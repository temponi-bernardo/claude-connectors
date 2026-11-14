/**
 * Limite simples de requisições por sessão OAuth no `/mcp`, com o binding de rate limiting do Workers
 * (contador na borda, sem gravar no KV e sem nada rodando entre requisições).
 */

/** O binding `ratelimits` do Workers. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Segundos sugeridos ao cliente para tentar de novo (o período do binding é 60 s). */
export const RATE_LIMIT_RETRY_SECONDS = 60;

/** Diz se a sessão passou do limite; sem binding (ex.: testes locais) nunca limita. */
export async function isRateLimited(
  limiter: RateLimiter | undefined,
  key: string,
): Promise<boolean> {
  if (!limiter) return false;
  const { success } = await limiter.limit({ key });
  return !success;
}

/** Resposta 429 com `Retry-After`. */
export function rateLimitedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'rate_limited',
      error_description: 'Muitas requisições; tente de novo em 1 minuto.',
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
