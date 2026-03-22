import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { GithubContributionsService } from './../src/services/github-contributions.service';

const mockContributionResult = {
  user: {
    name: 'CatsJuice',
    contributionsCollection: {
      contributionCalendar: {
        colors: [],
        totalContributions: 6,
        weeks: [
          {
            firstDay: '2026-03-15',
            contributionDays: [
              {
                date: '2026-03-15',
                contributionCount: 1,
              },
              {
                date: '2026-03-16',
                contributionCount: 2,
              },
              {
                date: '2026-03-17',
                contributionCount: 3,
              },
            ],
          },
        ],
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

function playgroundHeaders() {
  return {
    Host: 'example.com',
    Referer: 'http://example.com/playground',
    'Sec-Fetch-Site': 'same-origin',
    'X-Forwarded-Proto': 'http',
    'X-Playground-Request': '1',
  };
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let githubContributionsService: {
    getUserContributions: jest.Mock;
  };

  beforeEach(async () => {
    process.env.PLAYGROUND_DATA_RATE_LIMIT_MAX = '1';
    process.env.PLAYGROUND_DATA_RATE_LIMIT_WINDOW_MS = '60000';

    githubContributionsService = {
      getUserContributions: jest.fn().mockResolvedValue(mockContributionResult),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GithubContributionsService)
      .useValue(githubContributionsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    delete process.env.PLAYGROUND_DATA_RATE_LIMIT_MAX;
    delete process.env.PLAYGROUND_DATA_RATE_LIMIT_WINDOW_MS;
  });

  it('/config (GET)', () => {
    return request(app.getHttpServer())
      .get('/config')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/contributions/:username (GET)', () => {
    return request(app.getHttpServer())
      .get('/contributions/CatsJuice')
      .set(playgroundHeaders())
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          username: 'CatsJuice',
          weeks: mockContributionResult.user.contributionsCollection
            .contributionCalendar.weeks,
          totalContributions: 6,
          source: 'profile_page',
          privateContributionsMode: 'profile_preference',
          privateContributionsReason: 'github_profile_contribution_graph',
          fetchedAt: '2026-03-22T00:00:00.000Z',
        });
      });
  });

  it('/contributions/:username (GET) rejects missing playground header', () => {
    return request(app.getHttpServer())
      .get('/contributions/CatsJuice')
      .set({
        Host: 'example.com',
        Referer: 'http://example.com/playground',
        'Sec-Fetch-Site': 'same-origin',
        'X-Forwarded-Proto': 'http',
      })
      .expect(400);
  });

  it('/contributions/:username (GET) rate limits repeated requests', async () => {
    await request(app.getHttpServer())
      .get('/contributions/CatsJuice')
      .set(playgroundHeaders())
      .expect(200);

    await request(app.getHttpServer())
      .get('/contributions/CatsJuice')
      .set(playgroundHeaders())
      .expect(429);

    expect(githubContributionsService.getUserContributions).toHaveBeenCalledTimes(
      1,
    );
  });
});
