import { ConfigService } from '@nestjs/config';

import { GithubContributionsService } from './github-contributions.service';

describe('GithubContributionsService', () => {
  it('reuses cached contribution fetches within the ttl window', async () => {
    const service = new GithubContributionsService(
      new ConfigService({
        playground: {
          dataCacheTtlMs: 60000,
        },
      }),
    );

    const result = {
      user: {
        name: 'CatsJuice',
        contributionsCollection: {
          contributionCalendar: {
            colors: [],
            totalContributions: 3,
            weeks: [],
          },
        },
      },
      meta: {
        source: 'profile_page' as const,
        privateContributionsMode: 'profile_preference' as const,
        privateContributionsReason: 'github_profile_contribution_graph' as const,
        fetchedAt: '2026-03-22T00:00:00.000Z',
      },
    };

    const loader = jest
      .spyOn(service as any, 'loadUserContributions')
      .mockResolvedValue(result);

    const first = await service.getUserContributions('CatsJuice');
    const second = await service.getUserContributions('catsjuice');

    expect(first).toBe(result);
    expect(second).toBe(result);
    expect(loader).toHaveBeenCalledTimes(1);
  });
});
