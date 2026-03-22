import { Injectable } from '@nestjs/common';

type Bucket = {
  count: number;
  expiresAt: number;
};

@Injectable()
export class PlaygroundRateLimitService {
  private readonly buckets = new Map<string, Bucket>();

  consume(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.expiresAt <= now) {
      this.buckets.set(key, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return true;
    }

    if (bucket.count >= limit) {
      return false;
    }

    bucket.count += 1;
    this.buckets.set(key, bucket);
    return true;
  }
}
