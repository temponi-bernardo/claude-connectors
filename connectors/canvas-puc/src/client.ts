/**
 * Cliente HTTP da API REST do Canvas: autenticação, renovação automática em 401 e paginação.
 */
import { buildUrl, parseNextLink, type QueryParams } from '../../../src/core/http.js';
import { authHeaders, type AuthProvider, type CanvasAuth } from './auth.js';

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
  readonly auth: AuthProvider;
  readonly fetchFn: typeof fetch;
  /** Mensagem de 401 (padrão: `unauthorizedMessage`); o modo remoto troca para orientar a reconexão. */
  readonly describeUnauthorized?: (auth: CanvasAuth | null, baseUrl: string) => string;
}

/** Operações usadas pelas ferramentas. */
export interface CanvasClient {
  readonly baseUrl: string;
  readonly get: <T>(path: string, params?: QueryParams) => Promise<T>;
  readonly getAll: <T>(path: string, params?: QueryParams, max?: number) => Promise<T[]>;
  readonly post: <T>(path: string, body: unknown) => Promise<T>;
  readonly fetchText: (url: string) => Promise<string>;
}

/** Mensagem para 401 (ou sem credencial), conforme a credencial usada. */
export function unauthorizedMessage(auth: CanvasAuth | null, baseUrl: string): string {
  if (!auth)
    return 'O Canvas não está conectado. Use a ferramenta `conectar_canvas` para fazer login.';
  if (auth.kind === 'session') {
    return 'A sessão do Canvas expirou e o login não foi concluído. Use `conectar_canvas` para entrar de novo.';
  }
  return `O token do Canvas expirou ou é inválido. Use \`conectar_canvas\` para entrar pelo navegador, ou gere outro token em ${baseUrl}/profile/settings.`;
}

/** Envia uma requisição com a credencial dada (sem tratar o status). */
export function sendCanvasRequest(
  deps: ClientDeps,
  req: CanvasRequest,
  auth: CanvasAuth,
): Promise<Response> {
  const hasBody = req.body !== undefined;
  return deps.fetchFn(buildUrl(`${deps.baseUrl}/api/v1`, req.path, req.params), {
    method: req.method,
    headers: {
      ...authHeaders(auth, req.method),
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
  });
}

/** Erro de 401 com a mensagem injetada nas dependências, ou a padrão (`unauthorizedMessage`). */
export function unauthorizedError(deps: ClientDeps, auth: CanvasAuth | null): Error {
  return new Error((deps.describeUnauthorized ?? unauthorizedMessage)(auth, deps.baseUrl));
}

/** Envia a requisição; em 401 (ou sem credencial) renova uma vez e repete. Lança erro se não der certo. */
export async function requestWithRenewal(deps: ClientDeps, req: CanvasRequest): Promise<Response> {
  let auth = deps.auth.current();
  let res = auth ? await sendCanvasRequest(deps, req, auth) : null;
  if (!res || res.status === 401) {
    auth = await deps.auth.renew();
    res = auth ? await sendCanvasRequest(deps, req, auth) : null;
  }
  if (!res || res.status === 401) throw unauthorizedError(deps, auth);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Canvas ${res.status} em ${req.method} ${req.path}: ${text.slice(0, 300)}`);
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
    const res = await requestWithRenewal(deps, req);
    const data = (await res.json()) as T | T[];
    items.push(...(Array.isArray(data) ? data : [data]));
    const next = parseNextLink(res.headers.get('link'));
    req = next ? { method: 'GET', path: next } : null;
  }
  return items.slice(0, max);
}

/** Baixa um arquivo de texto por URL direta (links de download do Canvas já trazem a autorização). */
export async function fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string> {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Falha ao baixar o arquivo (${res.status}).`);
  return res.text();
}

/** Cria o cliente do Canvas. */
export function createCanvasClient(deps: ClientDeps): CanvasClient {
  return {
    baseUrl: deps.baseUrl,
    get: async <T>(path: string, params: QueryParams = {}) =>
      (await (await requestWithRenewal(deps, { method: 'GET', path, params })).json()) as T,
    getAll: <T>(path: string, params: QueryParams = {}, max = DEFAULT_MAX_ITEMS) =>
      collectPages<T>(
        deps,
        { method: 'GET', path, params: { per_page: CANVAS_PAGE_SIZE, ...params } },
        max,
      ),
    post: async <T>(path: string, body: unknown) =>
      (await (await requestWithRenewal(deps, { method: 'POST', path, body })).json()) as T,
    fetchText: (url) => fetchPlainText(deps.fetchFn, url),
  };
}
