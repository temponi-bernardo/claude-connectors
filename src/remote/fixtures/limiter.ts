/** Rate-limiter double for tests: counts calls per key. */
import type { RateLimiter } from '../rate-limit.js';

/** Fake limiter that lets the first `allowed` calls per key through. */
export function countingLimiter(allowed: number): RateLimiter & { keys: string[] } {
  const keys: string[] = [];
  return {
    keys,
    limit: ({ key }) => {
      keys.push(key);
      return Promise.resolve({ success: keys.filter((k) => k === key).length <= allowed });
    },
  };
}
