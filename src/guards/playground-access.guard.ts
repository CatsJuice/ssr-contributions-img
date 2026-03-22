import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtendedRequest } from '../types/extended-request.interface';
import { PlaygroundRateLimitService } from '../services/playground-rate-limit.service';

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return '';
  }
}

function getHeaderValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function getClientIp(req: ExtendedRequest) {
  const forwardedFor = getHeaderValue(req.headers['x-forwarded-for']);
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return (
    req.ip ||
    req.socket?.remoteAddress ||
    req.raw?.socket?.remoteAddress ||
    'unknown'
  );
}

function getCurrentOrigin(req: ExtendedRequest) {
  const host = getHeaderValue(req.headers.host);
  const proto =
    getHeaderValue(req.headers['x-forwarded-proto']) ||
    (req.protocol as string) ||
    'http';

  return host ? `${proto}://${host}` : '';
}

@Injectable()
export class PlaygroundAccessGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly rateLimitService: PlaygroundRateLimitService,
  ) {}

  private createTooManyRequestsException(message: string) {
    return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();
    const secFetchSite = getHeaderValue(req.headers['sec-fetch-site']);
    const origin = normalizeOrigin(getHeaderValue(req.headers.origin));
    const refererOrigin = normalizeOrigin(getHeaderValue(req.headers.referer));
    const currentOrigin = normalizeOrigin(getCurrentOrigin(req));
    const allowedOrigins = new Set(
      (this.configService.get<string[]>('playground.allowedOrigins') || [])
        .map((item) => normalizeOrigin(item))
        .filter(Boolean),
    );

    if (currentOrigin) {
      allowedOrigins.add(currentOrigin);
    }

    if (getHeaderValue(req.headers['x-playground-request']) !== '1') {
      throw new BadRequestException('Missing playground request header');
    }

    if (
      secFetchSite &&
      !['same-origin', 'same-site'].includes(secFetchSite.toLowerCase())
    ) {
      throw new ForbiddenException('Invalid request site');
    }

    const effectiveOrigin = origin || refererOrigin;
    if (!effectiveOrigin || !allowedOrigins.has(effectiveOrigin)) {
      throw new ForbiddenException('Origin not allowed');
    }

    const username = `${req.params?.username || ''}`.trim().toLowerCase();
    const ip = getClientIp(req);
    const limit = this.configService.get<number>('playground.dataRateLimitMax') || 30;
    const windowMs =
      this.configService.get<number>('playground.dataRateLimitWindowMs') || 60000;

    if (!this.rateLimitService.consume(`ip:${ip}`, limit * 4, windowMs)) {
      throw this.createTooManyRequestsException(
        'Too many requests from this client',
      );
    }

    if (!this.rateLimitService.consume(`ip:${ip}:user:${username}`, limit, windowMs)) {
      throw this.createTooManyRequestsException(
        'Too many requests for this username',
      );
    }

    return true;
  }
}
