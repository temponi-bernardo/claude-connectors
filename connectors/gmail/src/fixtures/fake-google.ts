/**
 * Google falso para os testes: chaves RSA reais (id_token assinado de verdade), endpoint de tokens,
 * JWKS e Gmail API simulados por um `fetch` com rotas, que registra cada chamada.
 */
import { generateKeyPairSync, sign, type KeyObject } from 'node:crypto';
import { aliasAccounts, type AccountRef } from '../accounts.js';
import type { GmailSettings } from '../config.js';
import type { Fetcher, OwnerDeps } from '../context.js';
import type { RateLimiter } from '../rate-limit.js';
import { saveOwnerAccounts, type LinkedAccount } from '../token-store.js';
import { FakeKv } from './fake-kv.js';

/** Chave de teste dos selos (32 bytes). */
export const TEST_TOKEN_KEY = Buffer.alloc(32, 7);

/** E-mails das contas Gmail dos testes (fictícios). */
export const TEST_EMAILS: readonly string[] = ['dono@example.com', 'musica@example.com'];

/** Usuário do conector nos testes (`sub` do Google). */
export const TEST_OWNER = 'sub-dono@example.com';

/** Configuração dos testes. */
export const TEST_SETTINGS: GmailSettings = {
  googleClientId: 'client-123.apps.googleusercontent.com',
  googleClientSecret: 'segredo-de-teste',
  tokenKey: TEST_TOKEN_KEY,
  allowedEmails: null,
  consentSecret: 'c'.repeat(40),
};

/** Origem do Worker nos testes. */
export const TEST_ORIGIN = 'https://gmail.test';

const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });

/** Chave pública de teste em JWK, com `kid`. */
export const TEST_JWK = {
  ...keys.publicKey.export({ format: 'jwk' }),
  kid: 'kid-1',
  alg: 'RS256',
  use: 'sig',
};

/** Assina um JWT RS256 com a chave de teste (ou outra). */
export function signJwt(
  payload: Record<string, unknown>,
  header: Record<string, unknown> = { alg: 'RS256', kid: 'kid-1' },
  key: KeyObject = keys.privateKey,
): string {
  const encode = (value: unknown): string =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  const input = `${encode(header)}.${encode(payload)}`;
  return `${input}.${sign('sha256', Buffer.from(input), key).toString('base64url')}`;
}

/** `id_token` válido para o e-mail e o `nonce` dados (agora = 1_700_000_000 s). */
export function validIdToken(
  email: string,
  nonce: string,
  extra: Record<string, unknown> = {},
): string {
  return signJwt({
    iss: 'https://accounts.google.com',
    aud: TEST_SETTINGS.googleClientId,
    exp: 1_700_000_000 + 3600,
    email,
    email_verified: true,
    sub: `sub-${email}`,
    nonce,
    ...extra,
  });
}

/** Instante fixo dos testes, em ms. */
export const TEST_NOW_MS = 1_700_000_000_000;

/** Chamada registrada pelo `fetch` falso. */
export interface RecordedCall {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

/** Rota do `fetch` falso: recebe a URL e as opções e devolve a resposta (ou nada, para seguir adiante). */
export type FakeRoute = (url: URL, init: RequestInit | undefined) => Response | undefined;

/** `fetch` falso com rotas; o JWKS do Google já vem respondido. Sem rota, 599. */
export function fakeFetch(routes: FakeRoute[], calls: RecordedCall[] = []): Fetcher {
  return (input, init) => {
    calls.push({ url: input, init });
    const url = new URL(input);
    if (url.href === 'https://www.googleapis.com/oauth2/v3/certs') {
      return Promise.resolve(Response.json({ keys: [TEST_JWK] }));
    }
    for (const route of routes) {
      const response = route(url, init);
      if (response) return Promise.resolve(response);
    }
    return Promise.resolve(new Response(`sem rota para ${url.href}`, { status: 599 }));
  };
}

/** Rota do endpoint de tokens do Google: refresh devolve `access-<refresh>`; código usa `onCode`. */
export function tokenRoute(
  onCode: (form: URLSearchParams) => Response = () => new Response('', { status: 400 }),
): FakeRoute {
  return (url, init) => {
    if (url.href !== 'https://oauth2.googleapis.com/token') return undefined;
    const form = new URLSearchParams(String(init?.body));
    if (form.get('grant_type') === 'authorization_code') return onCode(form);
    const refresh = form.get('refresh_token') ?? '';
    if (refresh.startsWith('revogado'))
      return Response.json({ error: 'invalid_grant' }, { status: 400 });
    return Response.json({ access_token: `access-${refresh}`, expires_in: 3600 });
  };
}

/** Rota da Gmail API: responde o JSON de `responses[caminho]` (caminho depois de `/users/me/`). */
export function gmailRoute(responses: Readonly<Record<string, unknown>>): FakeRoute {
  return (url) => {
    const prefix = '/gmail/v1/users/me/';
    if (url.hostname !== 'gmail.googleapis.com' || !url.pathname.startsWith(prefix))
      return undefined;
    const body = responses[url.pathname.slice(prefix.length)];
    return body === undefined ? new Response('{}', { status: 404 }) : Response.json(body);
  };
}

/** Dependências de teste com KV em memória, o `fetch` dado e o usuário `TEST_OWNER`. */
export function testDeps(fetcher: Fetcher, kv: FakeKv = new FakeKv()): OwnerDeps & { kv: FakeKv } {
  kv.now = () => TEST_NOW_MS;
  return {
    settings: TEST_SETTINGS,
    kv,
    fetch: fetcher,
    now: () => TEST_NOW_MS,
    origin: TEST_ORIGIN,
    owner: TEST_OWNER,
  };
}

/** Conta vinculada de teste (refresh `r-<parte antes do @>`). */
export function testAccount(email: string, extra: Partial<LinkedAccount> = {}): LinkedAccount {
  return {
    email,
    refreshToken: `r-${email.slice(0, email.indexOf('@'))}`,
    scope: 'openid email https://www.googleapis.com/auth/gmail.modify',
    linkedAt: '2026-11-14T00:00:00.000Z',
    status: 'active',
    ...extra,
  };
}

/** Dependências com as contas dadas já vinculadas ao `TEST_OWNER` e as rotas dadas. */
export async function linkedTestDeps(
  routes: FakeRoute[],
  calls: RecordedCall[] = [],
  emails: readonly string[] = TEST_EMAILS,
): Promise<OwnerDeps & { kv: FakeKv }> {
  const deps = testDeps(fakeFetch([tokenRoute(), ...routes], calls));
  const accounts = emails.map((email) => testAccount(email));
  await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts });
  return deps;
}

/** Limitador falso que libera as primeiras `allowed` chamadas por chave. */
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

/** Contas dos testes com apelido (`dono`, `musica`), como as ferramentas as veem. */
export const TEST_REFS: readonly AccountRef[] = aliasAccounts(
  TEST_EMAILS.map((email) => testAccount(email)),
);

/** Escrita registrada pela rota de escrita da Gmail API. */
export interface GmailWrite {
  readonly method: string;
  readonly path: string;
  readonly body: unknown;
}

/** Rota de escrita da Gmail API: registra POST/PUT/DELETE e responde `respond(escrita)` (nulo = 204). */
export function gmailWriteRoute(
  writes: GmailWrite[],
  respond: (write: GmailWrite) => unknown = () => ({}),
): FakeRoute {
  return (url, init) => {
    const method = init?.method ?? 'GET';
    if (url.hostname !== 'gmail.googleapis.com' || method === 'GET') return undefined;
    const text = typeof init?.body === 'string' ? init.body : '';
    const write = {
      method,
      path: url.pathname.replace('/gmail/v1/users/me/', ''),
      body: text ? (JSON.parse(text) as unknown) : null,
    };
    writes.push(write);
    const reply = respond(write);
    return reply === null ? new Response(null, { status: 204 }) : Response.json(reply);
  };
}

/** Escopo das contas vinculadas antes do gerenciamento (só leitura). */
export const READONLY_SCOPE = 'openid email https://www.googleapis.com/auth/gmail.readonly';
