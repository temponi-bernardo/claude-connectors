/**
 * Pure helpers for paginated REST APIs (URL building and the `Link` header).
 */

/** Value accepted as a query parameter: lists become `key[]=a&key[]=b`; nulls are omitted. */
export type QueryValue =
  string | number | boolean | readonly (string | number)[] | null | undefined;

/** Query parameters of a request. */
export type QueryParams = Readonly<Record<string, QueryValue>>;

/** Builds a request URL: a path relative to `base` (or an absolute URL) plus the parameters. */
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

/** Extracts the `rel="next"` URL from a pagination `Link` header (RFC 8288), or `null` if absent. */
export function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const next = linkHeader.split(',').find((part) => part.includes('rel="next"'));
  return next?.match(/<([^>]+)>/)?.[1] ?? null;
}
