import { ConfigService } from '@nestjs/config';

import { PlaygroundAccessGuard } from './playground-access.guard';
import { PlaygroundRateLimitService } from '../services/playground-rate-limit.service';

function createGuard(config: Record<string, any>) {
  const configService = new ConfigService(config);
  const rateLimitService = new PlaygroundRateLimitService();
  return new PlaygroundAccessGuard(configService, rateLimitService);
}

function createContext(headers: Record<string, string> = {}, username = 'cats') {
  const request = {
    headers,
    params: { username },
    ip: '127.0.0.1',
    protocol: 'http',
    socket: {
      remoteAddress: '127.0.0.1',
    },
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as any;
}

describe('PlaygroundAccessGuard', () => {
  it('allows same-origin playground requests', () => {
    const guard = createGuard({
      playground: {
        allowedOrigins: [],
        dataRateLimitMax: 2,
        dataRateLimitWindowMs: 60000,
      },
    });

    expect(
      guard.canActivate(
        createContext({
          host: 'example.com',
          referer: 'http://example.com/playground',
          'x-forwarded-proto': 'http',
          'x-playground-request': '1',
          'sec-fetch-site': 'same-origin',
        }),
      ),
    ).toBe(true);
  });

  it('rejects requests without the playground header', () => {
    const guard = createGuard({
      playground: {
        allowedOrigins: [],
        dataRateLimitMax: 2,
        dataRateLimitWindowMs: 60000,
      },
    });

    expect(() =>
      guard.canActivate(
        createContext({
          host: 'example.com',
          referer: 'http://example.com/playground',
          'x-forwarded-proto': 'http',
        }),
      ),
    ).toThrow('Missing playground request header');
  });

  it('rate limits repeated requests per client and username', () => {
    const guard = createGuard({
      playground: {
        allowedOrigins: [],
        dataRateLimitMax: 1,
        dataRateLimitWindowMs: 60000,
      },
    });
    const context = createContext({
      host: 'example.com',
      referer: 'http://example.com/playground',
      'x-forwarded-proto': 'http',
      'x-playground-request': '1',
      'sec-fetch-site': 'same-origin',
    });

    expect(guard.canActivate(context)).toBe(true);
    expect(() => guard.canActivate(context)).toThrow(
      'Too many requests for this username',
    );
  });
});
