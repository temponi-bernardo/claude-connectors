/**
 * HTTP client for the Canvas REST API: token (Bearer) authentication and pagination.
 */
import { buildUrl, parseNextLink, type QueryParams } from '../../../src/core/http.js';
import { readLimitedBytes } from '../../../src/core/stream.js';
import { MAX_DOWNLOAD_BYTES, tooLargeMessage } from './files.js';
import { redactVerifier } from './links.js';

/** Items per page requested from Canvas (the maximum the API accepts). */
export const CANVAS_PAGE_SIZE = 100;

/** Default cap on items gathered across pages, so huge lists are not swept. */
export const DEFAULT_MAX_ITEMS = 200;

/** Time limit of each Canvas API call, so a stuck request does not hold the tool forever. */
export const CANVAS_TIMEOUT_MS = 30_000;

/** Canvas GraphQL endpoint, relative to the base URL (it lives outside `/api/v1`). */
export const CANVAS_GRAPHQL_PATH = '/api/graphql';

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
  /** Opens a file download without reading it (the caller streams the body); `headers` e.g. `Range`. */
  readonly fetchStream: (url: string, headers?: Record<string, string>) => Promise<Response>;
  /** Sends a file to an upload slot and returns the confirmed Canvas file (upload steps 2 and 3). */
  readonly upload: <T>(slot: CanvasUploadSlot, file: UploadedBytes) => Promise<T>;
  /** Runs a read-only GraphQL query (never a mutation) and returns its `data`. */
  readonly query: <T>(document: string, variables?: GraphqlVariables) => Promise<T>;
}

/** Variables of a GraphQL query. */
export type GraphqlVariables = Readonly<Record<string, unknown>>;

/** A GraphQL query: the document and its variables. */
export interface GraphqlQuery {
  readonly document: string;
  readonly variables?: GraphqlVariables;
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
    signal: AbortSignal.timeout(CANVAS_TIMEOUT_MS),
  });
}

/** Error of a Canvas API call, with the HTTP status for callers that react to 401/403/404. */
export interface CanvasApiError extends Error {
  readonly status: number;
  /** `true` when Canvas refused the token itself (expired or revoked), not just this resource. */
  readonly tokenRejected: boolean;
}

/** Creates a `CanvasApiError`. */
export function canvasApiError(
  message: string,
  status: number,
  tokenRejected = false,
): CanvasApiError {
  return Object.assign(new Error(message), { status, tokenRejected });
}

/** HTTP status of a `CanvasApiError`, or `null` for any other error. */
export function canvasErrorStatus(error: unknown): number | null {
  const status = (error as Partial<CanvasApiError> | null)?.status;
  return typeof status === 'number' ? status : null;
}

/** Says whether a 401 body is Canvas denying this resource (`"status": "unauthorized"`), not the token. */
export function isPermissionDenial(body: string): boolean {
  return /"status"\s*:\s*"unauthorized"/.test(body);
}

/** Turns a timed-out call into a `CanvasApiError` 504 with a clear message; other errors pass unchanged. */
export function networkFailure(error: unknown, req: CanvasRequest): unknown {
  if ((error as Partial<Error> | null)?.name !== 'TimeoutError') return error;
  const seconds = CANVAS_TIMEOUT_MS / 1000;
  return canvasApiError(
    `Canvas did not answer within ${seconds} s on ${req.method} ${req.path}. Try again in a moment.`,
    504,
  );
}

/** Sends the request and throws a `CanvasApiError` on any status outside 2xx (token refused on a bare 401). */
export async function requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response> {
  const res = await sendCanvasRequest(deps, req).catch((error: unknown) => {
    throw networkFailure(error, req);
  });
  if (res.ok) return res;
  const text = await res.text().catch(() => '');
  if (res.status === 401 && !isPermissionDenial(text)) {
    throw canvasApiError(unauthorizedMessage(deps.baseUrl), 401, true);
  }
  const message = `Canvas ${res.status} on ${req.method} ${req.path}: ${text.slice(0, 300)}`;
  throw canvasApiError(message, res.status);
}

/** Reads a JSON body; a timeout while reading it becomes the same clear 504 as `networkFailure()`. */
export async function readCanvasJson<T>(res: Response, req: CanvasRequest): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch (error) {
    throw networkFailure(error, req);
  }
}

/** Sends the request and reads its JSON body (both under the call's timeout). */
export async function requestCanvasJson<T>(deps: ClientDeps, req: CanvasRequest): Promise<T> {
  return readCanvasJson<T>(await requestCanvas(deps, req), req);
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
    const data = await readCanvasJson<T | T[]>(res, req);
    items.push(...(Array.isArray(data) ? data : [data]));
    const next = parseNextLink(res.headers.get('link'));
    req = next ? { method: 'GET', path: next } : null;
  }
  return items.slice(0, max);
}

/** Downloads a file by direct URL (Canvas download links already carry the authorization), with optional headers. */
export async function fetchDownload(
  fetchFn: typeof fetch,
  url: string,
  headers: Record<string, string> = {},
): Promise<Response> {
  const res = await fetchFn(url, { headers });
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
  const limitMessage = tooLargeMessage('The file', maxBytes + 1, redactVerifier(url));
  return readLimitedBytes(res.body, maxBytes, limitMessage);
}

/** Upload slot Canvas answers in step 1 of a file upload (where and with which fields to send the file). */
export interface CanvasUploadSlot {
  readonly upload_url: string;
  readonly upload_params?: Readonly<Record<string, string>>;
}

/** A file to upload: name, MIME type and bytes. */
export interface UploadedBytes {
  readonly name: string;
  readonly contentType: string;
  readonly bytes: Uint8Array;
}

/** Builds the multipart form of upload step 2: Canvas's params first, the file last (Canvas requires it). */
export function uploadForm(slot: CanvasUploadSlot, file: UploadedBytes): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(slot.upload_params ?? {})) form.append(key, value);
  const blob = new Blob([file.bytes as Uint8Array<ArrayBuffer>], { type: file.contentType });
  form.append('file', blob, file.name);
  return form;
}

/** Sends the file to the upload URL (step 2): no Canvas token (the URL is signed) and no redirect following. */
export function postUploadForm(
  fetchFn: typeof fetch,
  slot: CanvasUploadSlot,
  file: UploadedBytes,
): Promise<Response> {
  return fetchFn(slot.upload_url, {
    method: 'POST',
    body: uploadForm(slot, file),
    redirect: 'manual',
  });
}

/** Upload step 3: reads the file of a 2xx answer, or confirms a 3xx at its `Location` with the token. */
export async function confirmUpload<T>(deps: ClientDeps, res: Response): Promise<T> {
  if (res.ok) return (await res.json()) as T;
  const location = res.headers.get('location');
  if (res.status >= 300 && res.status < 400 && location) {
    return requestCanvasJson<T>(deps, { method: 'POST', path: location });
  }
  const text = await res.text().catch(() => '');
  throw new Error(`Canvas rejected the file upload (${res.status}): ${text.slice(0, 300)}`);
}

/**
 * Guard for the connector's own constant GraphQL documents: accepts a document that starts with `{` or `query`
 * and has no `mutation`/`subscription` keyword. A keyword check, not a parser: never pass it text from outside.
 */
export function isReadOnlyGraphql(document: string): boolean {
  const code = document.replace(/#[^\n]*/g, '').trim();
  if (/\b(mutation|subscription)\b/.test(code)) return false;
  return code.startsWith('{') || /^query\b/.test(code);
}

/** Envelope of a GraphQL answer. */
export interface GraphqlEnvelope<T> {
  readonly data?: T | null;
  readonly errors?: readonly { readonly message?: string }[];
}

/** The `data` of a GraphQL answer, or a `CanvasApiError` 400 with the first error (GraphQL answers 200 on errors). */
export function graphqlData<T>(envelope: GraphqlEnvelope<T>): T {
  const first = envelope.errors?.[0];
  if (!first && envelope.data !== null && envelope.data !== undefined) return envelope.data;
  const reason = first?.message ?? 'empty answer';
  throw canvasApiError(`Canvas GraphQL error: ${reason.slice(0, 300)}`, 400);
}

/** Posts one of the connector's GraphQL queries to Canvas; a document that fails `isReadOnlyGraphql()` never leaves. */
export async function queryCanvasGraphql<T>(deps: ClientDeps, query: GraphqlQuery): Promise<T> {
  if (!isReadOnlyGraphql(query.document)) {
    throw new Error(
      'Only read-only GraphQL queries are allowed: this connector never changes Canvas through GraphQL.',
    );
  }
  const body = { query: query.document, variables: query.variables ?? {} };
  const path = `${deps.baseUrl}${CANVAS_GRAPHQL_PATH}`;
  return graphqlData(
    await requestCanvasJson<GraphqlEnvelope<T>>(deps, { method: 'POST', path, body }),
  );
}

/** Creates the Canvas client. */
export function createCanvasClient(deps: ClientDeps): CanvasClient {
  return {
    baseUrl: deps.baseUrl,
    get: <T>(path: string, params: QueryParams = {}) =>
      requestCanvasJson<T>(deps, { method: 'GET', path, params }),
    getAll: <T>(path: string, params: QueryParams = {}, max = DEFAULT_MAX_ITEMS) =>
      collectPages<T>(
        deps,
        { method: 'GET', path, params: { per_page: CANVAS_PAGE_SIZE, ...params } },
        max,
      ),
    post: <T>(path: string, body: unknown) =>
      requestCanvasJson<T>(deps, { method: 'POST', path, body }),
    fetchText: (url) => fetchPlainText(deps.fetchFn, url),
    fetchBytes: (url) => fetchFileBytes(deps.fetchFn, url),
    fetchStream: (url, headers) => fetchDownload(deps.fetchFn, url, headers),
    upload: async <T>(slot: CanvasUploadSlot, file: UploadedBytes) =>
      confirmUpload<T>(deps, await postUploadForm(deps.fetchFn, slot, file)),
    query: <T>(document: string, variables?: GraphqlVariables) =>
      queryCanvasGraphql<T>(deps, { document, ...(variables ? { variables } : {}) }),
  };
}
