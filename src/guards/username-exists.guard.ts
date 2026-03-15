import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtendedRequest } from 'src/types/extended-request.interface';
import {
  buildGithubUserFromContributionDays,
  getContributionYearsForProfileWindow,
  mergeContributionDaysByDate,
} from 'src/utils/github-profile-contributions';

type PrivateContributionsMode = 'eligible' | 'limited' | 'disabled';

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
): PrivateContributionsMode {
  if (!scopes.includes('repo')) return 'disabled';
  if ((viewerLogin || '').toLowerCase() !== username.toLowerCase()) {
    return 'limited';
  }
  return 'eligible';
}

@Injectable()
export class UsernameExistsGuard implements CanActivate {
  constructor(@Inject(ConfigService) private readonly _cfgSrv: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const username = req.params?.username || req.raw?.params?.username;
    if (!username) throw new NotFoundException('Username must not be empty');
    const profileUser = await this.fetchUserFromProfileContributionGraph(username);

    if (profileUser) {
      res.setHeader('X-GitHub-Contributions-Source', 'profile_page');
      res.setHeader('X-GitHub-Private-Contributions', 'profile_preference');
      res.setHeader(
        'X-GitHub-Private-Contributions-Reason',
        'github_profile_contribution_graph',
      );
      req.user = profileUser;
      return true;
    }

    const githubRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._cfgSrv.get('github.pat')}`,
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
    }[privateContributionsMode];

    res.setHeader('X-GitHub-Private-Contributions', privateContributionsMode);
    res.setHeader(
      'X-GitHub-Private-Contributions-Reason',
      privateContributionsReason,
    );
    res.setHeader('X-GitHub-Contributions-Source', 'graphql_fallback');

    const user = githubData?.data?.user;
    if (!user) throw new NotFoundException(`User ${username} not found`);
    req.user = user;
    return true;
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
