/**
 * Cliente HTTP da API REST do Canvas: autenticação por token (Bearer) e paginação.
 */
import { buildUrl, parseNextLink, type QueryParams } from '../../../src/core/http.js';

/** Itens por página pedidos ao Canvas (máximo aceito pela API). */
export const CANVAS_PAGE_SIZE = 100;

/** Limite padrão de itens somados entre páginas, para não varrer listas enormes. */
export const DEFAULT_MAX_ITEMS = 200;

/** Uma requisição à API (caminho relativo a `/api/v1` ou URL absoluta de paginação). */
export interface CanvasRequest {
  readonly method: 'GET' | 'POST';
  readonly path: string;
  readonly params?: QueryParams;
  readonly body?: unknown;
}

/** Dependências do cliente. */
export interface ClientDeps {
  readonly baseUrl: string;
  /** Token de acesso do Canvas que o usuário colou na página do OAuth. */
  readonly token: string;
  readonly fetchFn: typeof fetch;
}

/** Operações usadas pelas ferramentas. */
export interface CanvasClient {
  readonly baseUrl: string;
  readonly get: <T>(path: string, params?: QueryParams) => Promise<T>;
  readonly getAll: <T>(path: string, params?: QueryParams, max?: number) => Promise<T[]>;
  readonly post: <T>(path: string, body: unknown) => Promise<T>;
  readonly fetchText: (url: string) => Promise<string>;
  readonly fetchBytes: (url: string) => Promise<Uint8Array>;
}

/** Mensagem de 401: o token venceu ou foi revogado; orienta a gerar outro e reconectar. */
export function unauthorizedMessage(baseUrl: string): string {
  return `Canvas rejected the token (expired or revoked). Generate a new one at ${baseUrl}/profile/settings and reconnect the connector in Claude's settings.`;
}

/** Envia uma requisição com o token (sem tratar o status). */
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

/** Envia a requisição e lança erro em 401 (token recusado) ou em qualquer status fora de 2xx. */
export async function requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response> {
  const res = await sendCanvasRequest(deps, req);
  if (res.status === 401) throw new Error(unauthorizedMessage(deps.baseUrl));
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Canvas ${res.status} on ${req.method} ${req.path}: ${text.slice(0, 300)}`);
  }
  return res;
}

/** Busca todas as páginas de uma listagem seguindo o header `Link`, até `max` itens. */
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

/** Baixa um arquivo por URL direta (links de download do Canvas já trazem a autorização). */
export async function fetchDownload(fetchFn: typeof fetch, url: string): Promise<Response> {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Failed to download the file (${res.status}).`);
  return res;
}

/** Baixa um arquivo de texto por URL direta. */
export async function fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string> {
  return (await fetchDownload(fetchFn, url)).text();
}

/** Baixa um arquivo binário por URL direta. */
export async function fetchFileBytes(fetchFn: typeof fetch, url: string): Promise<Uint8Array> {
  return new Uint8Array(await (await fetchDownload(fetchFn, url)).arrayBuffer());
}

/** Cria o cliente do Canvas. */
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
  };
}
