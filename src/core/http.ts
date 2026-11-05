/**
 * Utilitários puros para APIs REST paginadas (montagem de URL e header `Link`).
 */

/** Valor aceito como parâmetro de query: listas viram `chave[]=a&chave[]=b`; nulos são omitidos. */
export type QueryValue =
  string | number | boolean | readonly (string | number)[] | null | undefined;

/** Parâmetros de query de uma requisição. */
export type QueryParams = Readonly<Record<string, QueryValue>>;

/** Monta a URL de uma requisição: caminho relativo a `base` (ou URL absoluta) mais os parâmetros. */
export function buildUrl(base: string, path: string, params: QueryParams = {}): URL {
  const url = new URL(path.startsWith('http') ? path : `${base}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value as readonly (string | number)[]) {
        url.searchParams.append(`${key}[]`, String(item));
      }
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

/** Extrai a URL `rel="next"` de um header `Link` de paginação (RFC 8288), ou `null` se não houver. */
export function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const next = linkHeader.split(',').find((part) => part.includes('rel="next"'));
  return next?.match(/<([^>]+)>/)?.[1] ?? null;
}
