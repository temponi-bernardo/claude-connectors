/**
 * HTTP client for the Canvas REST API: token (Bearer) authentication and pagination.
 */
import { buildUrl, parseNextLink, type QueryParams } from '../../../src/core/http.js';
import { readLimitedBytes } from '../../../src/core/stream.js';
import { MAX_DOWNLOAD_BYTES, tooLargeMessage } from './files.js';

/** Items per page requested from Canvas (the maximum the API accepts). */
export const CANVAS_PAGE_SIZE = 100;

/** Default cap on items gathered across pages, so huge lists are not swept. */
export const DEFAULT_MAX_ITEMS = 200;

/** An API request (path relative to `/api/v1` or an absolute pagination URL). */
export interface CanvasRequest {
  readonly method: 'GET' | 'POST';
  readonly path: string;
  readonly params?: QueryParams;
  readonly body?: unknown;
}

/** Client dependencies. */
export interface ClientDeps {
  readonly baseUrl: string;
  /** Canvas access token the user pasted on the OAuth page. */
  readonly token: string;
  readonly fetchFn: typeof fetch;
}

/** Operations used by the tools. */
export interface CanvasClient {
  readonly baseUrl: string;
  readonly get: <T>(path: string, params?: QueryParams) => Promise<T>;
  readonly getAll: <T>(path: string, params?: QueryParams, max?: number) => Promise<T[]>;
  readonly post: <T>(path: string, body: unknown) => Promise<T>;
  readonly fetchText: (url: string) => Promise<string>;
  readonly fetchBytes: (url: string) => Promise<Uint8Array>;
  /** Opens a file download without reading it (the caller streams the body). */
  readonly fetchStream: (url: string) => Promise<Response>;
}

/** 401 message: the token expired or was revoked; tells the user to generate another and reconnect. */
export function unauthorizedMessage(baseUrl: string): string {
  return `Canvas rejected the token (expired or revoked). Generate a new one at ${baseUrl}/profile/settings and reconnect the connector in Claude's settings.`;
}

/** Sends a request with the token (without handling the status). */
export function sendCanvasRequest(deps: ClientDeps, req: CanvasRequest): Promise<Response> {
  const hasBody = req.body !== undefined;
  return deps.fetchFn(buildUrl(`${deps.baseUrl}/api/v1`, req.path, req.params), {
    method: req.method,
    headers: {
      Authorization: `Bearer ${deps.token}`,
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
  });
}

/** Sends the request and throws on 401 (token refused) or on any status outside 2xx. */
export async function requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response> {
  const res = await sendCanvasRequest(deps, req);
  if (res.status === 401) throw new Error(unauthorizedMessage(deps.baseUrl));
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Canvas ${res.status} on ${req.method} ${req.path}: ${text.slice(0, 300)}`);
  }
  return res;
}

/** Fetches every page of a listing by following the `Link` header, up to `max` items. */
export async function collectPages<T>(
  deps: ClientDeps,
  first: CanvasRequest,
  max: number,
): Promise<T[]> {
  const items: T[] = [];
  let req: CanvasRequest | null = first;
  while (req && items.length < max) {
    const res = await requestCanvas(deps, req);
    const data = (await res.json()) as T | T[];
    items.push(...(Array.isArray(data) ? data : [data]));
    const next = parseNextLink(res.headers.get('link'));
    req = next ? { method: 'GET', path: next } : null;
  }
  return items.slice(0, max);
}

/** Downloads a file by direct URL (Canvas download links already carry the authorization). */
export async function fetchDownload(fetchFn: typeof fetch, url: string): Promise<Response> {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Failed to download the file (${res.status}).`);
  return res;
}

/** Downloads a text file by direct URL. */
export async function fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string> {
  return (await fetchDownload(fetchFn, url)).text();
}

/** Downloads a binary file by direct URL, failing as soon as it passes `maxBytes` (default `MAX_DOWNLOAD_BYTES`). */
export async function fetchFileBytes(
  fetchFn: typeof fetch,
  url: string,
  maxBytes = MAX_DOWNLOAD_BYTES,
): Promise<Uint8Array> {
  const res = await fetchDownload(fetchFn, url);
  return readLimitedBytes(res.body, maxBytes, tooLargeMessage('The file', maxBytes + 1, url));
}

/** Creates the Canvas client. */
export function createCanvasClient(deps: ClientDeps): CanvasClient {
  return {
    baseUrl: deps.baseUrl,
    get: async <T>(path: string, params: QueryParams = {}) =>
      (await (await requestCanvas(deps, { method: 'GET', path, params })).json()) as T,
    getAll: <T>(path: string, params: QueryParams = {}, max = DEFAULT_MAX_ITEMS) =>
      collectPages<T>(
        deps,
        { method: 'GET', path, params: { per_page: CANVAS_PAGE_SIZE, ...params } },
        max,
      ),
    post: async <T>(path: string, body: unknown) =>
      (await (await requestCanvas(deps, { method: 'POST', path, body })).json()) as T,
    fetchText: (url) => fetchPlainText(deps.fetchFn, url),
    fetchBytes: (url) => fetchFileBytes(deps.fetchFn, url),
    fetchStream: (url) => fetchDownload(deps.fetchFn, url),
  };
}
