import { describe, expect, it } from 'vitest';
import { countingLimiter } from './fixtures/fake-google.js';
import { isRateLimited, rateLimitedResponse } from './rate-limit.js';

describe('isRateLimited', () => {
  it('sem binding nunca limita', async () => {
    expect(await isRateLimited(undefined, 's1')).toBe(false);
  });

  it('limita por chave depois do permitido', async () => {
    const limiter = countingLimiter(1);
    expect(await isRateLimited(limiter, 's1')).toBe(false);
    expect(await isRateLimited(limiter, 's1')).toBe(true);
    expect(await isRateLimited(limiter, 's2')).toBe(false);
  });
});

describe('rateLimitedResponse', () => {
  it('devolve 429 com Retry-After', async () => {
    const response = rateLimitedResponse();
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(await response.json()).toMatchObject({ error: 'rate_limited' });
  });
});
