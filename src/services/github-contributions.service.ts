import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubUser } from '../types/contribution.interface';
import {
  buildGithubUserFromContributionDays,
  getContributionYearsForProfileWindow,
  mergeContributionDaysByDate,
} from '../utils/github-profile-contributions';

export interface GithubContributionsMeta {
  source: 'profile_page' | 'graphql_fallback';
  privateContributionsMode: 'eligible' | 'limited' | 'disabled' | 'profile_preference';
  privateContributionsReason:
    | 'github_profile_contribution_graph'
    | 'missing_repo_scope'
    | 'viewer_mismatch'
    | 'same_viewer_with_repo_scope';
  fetchedAt: string;
}

export interface GithubContributionsResult {
  user: GithubUser;
  meta: GithubContributionsMeta;
}

type CacheEntry = {
  expiresAt: number;
  promise: Promise<GithubContributionsResult>;
};

function parseOauthScopes(scopesHeader?: string | string[]) {
  const raw = Array.isArray(scopesHeader) ? scopesHeader.join(',') : scopesHeader;

  return `${raw || ''}`
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean);
}

function getPrivateContributionsMode(
  scopes: string[],
  viewerLogin: string | undefined,
  username: string,
): 'eligible' | 'limited' | 'disabled' {
  if (!scopes.includes('repo')) return 'disabled';
  if ((viewerLogin || '').toLowerCase() !== username.toLowerCase()) {
    return 'limited';
  }
  return 'eligible';
}

@Injectable()
export class GithubContributionsService {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  async getUserContributions(username: string) {
    const key = `${username || ''}`.trim().toLowerCase();
    const ttlMs = this.configService.get<number>('playground.dataCacheTtlMs') || 300000;
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > now) {
      return cached.promise;
    }

    const promise = this.loadUserContributions(username).catch((error) => {
      this.cache.delete(key);
      throw error;
    });

    this.cache.set(key, {
      expiresAt: now + ttlMs,
      promise,
    });

    return promise;
  }

  private async loadUserContributions(username: string): Promise<GithubContributionsResult> {
    const profileUser = await this.fetchUserFromProfileContributionGraph(username);
    const fetchedAt = new Date().toISOString();

    if (profileUser) {
      return {
        user: profileUser,
        meta: {
          source: 'profile_page',
          privateContributionsMode: 'profile_preference',
          privateContributionsReason: 'github_profile_contribution_graph',
          fetchedAt,
        },
      };
    }

    const githubRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.configService.get('github.pat')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query ($username: String!) {
            viewer {
                login
            }
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                            firstDay
                        }
                    }
                }
            }
          }`,
        variables: {
          username,
        },
      }),
    });
    const githubData = await githubRes.json();
    const scopes = parseOauthScopes(githubRes.headers.get('x-oauth-scopes'));
    const viewerLogin = githubData?.data?.viewer?.login;
    const privateContributionsMode = getPrivateContributionsMode(
      scopes,
      viewerLogin,
      username,
    );
    const privateContributionsReason = {
      disabled: 'missing_repo_scope',
      limited: 'viewer_mismatch',
      eligible: 'same_viewer_with_repo_scope',
    }[privateContributionsMode] as GithubContributionsMeta['privateContributionsReason'];

    const user = githubData?.data?.user;
    if (!user) throw new NotFoundException(`User ${username} not found`);

    return {
      user,
      meta: {
        source: 'graphql_fallback',
        privateContributionsMode,
        privateContributionsReason,
        fetchedAt,
      },
    };
  }

  private async fetchUserFromProfileContributionGraph(username: string) {
    const { years, startDate, endDate } = getContributionYearsForProfileWindow();
    const pages = await Promise.all(
      years.map(async (year) => {
        const pageUrl = new URL(
          `https://github.com/users/${username}/contributions`,
        );
        pageUrl.searchParams.set('from', `${year}-01-01`);
        pageUrl.searchParams.set('to', `${year}-12-31`);

        const response = await fetch(pageUrl.toString(), {
          method: 'GET',
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'ssr-contributions-svg',
          },
        });

        return {
          status: response.status,
          data: await response.text(),
        };
      }),
    );

    if (pages.some((page) => page.status === 404)) {
      throw new NotFoundException(`User ${username} not found`);
    }

    const contributionDays = mergeContributionDaysByDate(
      pages.map((page) => `${page.data || ''}`),
      endDate,
      startDate,
    );

    if (!contributionDays.length) return null;
    return buildGithubUserFromContributionDays(username, contributionDays);
  }
}
