import { describe, expect, it } from 'vitest';
import { countingLimiter } from './fixtures/limiter.js';
import { isRateLimited, rateLimitedResponse } from './rate-limit.js';

describe('isRateLimited', () => {
  it('never limits without a binding', async () => {
    expect(await isRateLimited(undefined, 's1')).toBe(false);
  });

  it('limits per key past the allowance', async () => {
    const limiter = countingLimiter(1);
    expect(await isRateLimited(limiter, 's1')).toBe(false);
    expect(await isRateLimited(limiter, 's1')).toBe(true);
    expect(await isRateLimited(limiter, 's2')).toBe(false);
  });
});

describe('rateLimitedResponse', () => {
  it('returns 429 with Retry-After', async () => {
    const response = rateLimitedResponse();
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(await response.json()).toMatchObject({ error: 'rate_limited' });
  });
});
