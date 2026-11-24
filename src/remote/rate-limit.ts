/**
 * Simple per-OAuth-session request limit on `/mcp`, using the Workers rate limiting binding (an edge
 * counter, no KV writes and nothing running between requests).
 */

/** The Workers `ratelimits` binding. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Seconds suggested to the client before retrying (the binding period is 60 s). */
export const RATE_LIMIT_RETRY_SECONDS = 60;

/** Tells whether the session is over the limit; without a binding (e.g. local tests) it never limits. */
export async function isRateLimited(
  limiter: RateLimiter | undefined,
  key: string,
): Promise<boolean> {
  if (!limiter) return false;
  const { success } = await limiter.limit({ key });
  return !success;
}

/** 429 response with `Retry-After`. */
export function rateLimitedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'rate_limited',
      error_description: 'Too many requests; try again in 1 minute.',
    }),
    {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(RATE_LIMIT_RETRY_SECONDS),
      },
    },
  );
}
