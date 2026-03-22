import { registerAs } from '@nestjs/config';

function parseOrigins(value: string | undefined) {
  return `${value || ''}`
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default registerAs('playground', () => ({
  allowedOrigins: parseOrigins(process.env.PLAYGROUND_ALLOWED_ORIGINS),
  dataRateLimitMax: Math.max(
    1,
    parseInt(process.env.PLAYGROUND_DATA_RATE_LIMIT_MAX || '30', 10) || 30,
  ),
  dataRateLimitWindowMs: Math.max(
    1000,
    parseInt(process.env.PLAYGROUND_DATA_RATE_LIMIT_WINDOW_MS || '60000', 10) ||
      60000,
  ),
  dataCacheTtlMs: Math.max(
    1000,
    parseInt(process.env.PLAYGROUND_DATA_CACHE_TTL_MS || '300000', 10) ||
      300000,
  ),
}));
