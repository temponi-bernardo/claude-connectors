/**
 * Contexto falso para testar as ferramentas sem rede: respostas por caminho da API.
 */
import { vi, type Mock } from 'vitest';
import type { AuthProvider } from '../auth.js';
import type { CanvasClient } from '../client.js';
import type { CanvasContext } from '../context.js';
import type { QueryParams } from '../../../../src/core/http.js';

/** Respostas por caminho; um `Error` como valor faz a chamada falhar. */
export type Routes = Record<string, unknown>;

function answer(routes: Routes, path: string): Promise<unknown> {
  if (!(path in routes)) return Promise.reject(new Error(`rota não simulada: ${path}`));
  const value = routes[path];
  return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
}

type GetFn = (path: string, params?: QueryParams) => Promise<unknown>;
type PostFn = (path: string, body: unknown) => Promise<unknown>;
type TextFn = (url: string) => Promise<unknown>;

/** Contexto falso com os mocks expostos para asserções. */
export interface FakeContext {
  readonly ctx: CanvasContext;
  readonly get: Mock<GetFn>;
  readonly getAll: Mock<GetFn>;
  readonly post: Mock<PostFn>;
  readonly fetchText: Mock<TextFn>;
  readonly fetchBytes: Mock<TextFn>;
  readonly auth: { [K in keyof AuthProvider]: Mock<AuthProvider[K]> };
}

/** Autenticação falsa: sem credencial, `connect` devolve uma sessão de um cookie. */
function fakeAuth(): FakeContext['auth'] {
  return {
    current: vi.fn<AuthProvider['current']>(() => null),
    renew: vi.fn<AuthProvider['renew']>(() => Promise.resolve(null)),
    connect: vi.fn<AuthProvider['connect']>(() =>
      Promise.resolve({
        baseUrl: 'https://x.test',
        savedAt: '',
        cookies: [{ name: 'a', value: 'b' }],
      }),
    ),
    disconnect: vi.fn<AuthProvider['disconnect']>(),
  };
}

/** Cria um contexto com cliente e autenticação falsos e relógio fixo em 2026-11-05T12:00:00Z. */
export function fakeContext(routes: Routes = {}): FakeContext {
  const get = vi.fn<GetFn>((path) => answer(routes, path));
  const getAll = vi.fn<GetFn>((path) => answer(routes, path));
  const post = vi.fn<PostFn>((path) => answer(routes, path));
  const fetchText = vi.fn<TextFn>((url) => answer(routes, url));
  const fetchBytes = vi.fn<TextFn>((url) => answer(routes, url));
  const client = {
    baseUrl: 'https://x.test',
    get,
    getAll,
    post,
    fetchText,
    fetchBytes,
  } as unknown as CanvasClient;
  const auth = fakeAuth();
  const ctx: CanvasContext = { client, auth, now: () => new Date('2026-11-05T12:00:00Z') };
  return { ctx, get, getAll, post, fetchText, fetchBytes, auth };
}
