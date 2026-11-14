import { pkceChallenge } from '../../../src/remote/oauth.js';
import { AuthorizationError } from '@cloudflare/workers-oauth-provider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import { FakeKv } from './fixtures/fake-kv.js';
import {
  countingLimiter,
  fakeFetch,
  gmailRoute,
  TEST_TOKEN_KEY,
  tokenRoute,
  validIdToken,
} from './fixtures/fake-google.js';
import { authorizationErrorResponse } from './sign-in.js';
import {
  checkClientRegistration,
  clientIpKey,
  configErrorResponse,
  createGmailDeps,
  createGmailProvider,
  createGmailServer,
  handleDefaultRequest,
  handleGmailWorkerFetch,
  handleMcpApi,
  isMcpPath,
  publicOrigin,
  type GmailWorkerEnv,
} from './worker.js';

const ORIGIN = 'https://gmail.test';
const REDIRECT = 'https://claude.ai/api/mcp/auth_callback';
const VERIFIER = 'v'.repeat(64);
const SECRETS = {
  GOOGLE_CLIENT_ID: 'client-123.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'segredo',
  TOKEN_ENC_KEY: TEST_TOKEN_KEY.toString('base64'),
  CONSENT_SECRET: 's'.repeat(40),
};

/** Navegador mínimo: guarda cookies e chama o Worker. */
class Browser {
  readonly cookies = new Map<string, string>();
  constructor(readonly env: GmailWorkerEnv) {}

  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    const jar = [...this.cookies].map(([k, v]) => `${k}=${v}`).join('; ');
    if (jar) headers.set('cookie', jar);
    const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined, props: {} };
    const response = await handleGmailWorkerFetch(
      new Request(new URL(path, ORIGIN), { ...init, headers, redirect: 'manual' }),
      this.env,
      ctx,
    );
    for (const cookie of response.headers.getSetCookie()) {
      const [pair = ''] = cookie.split(';');
      const [name = '', ...value] = pair.split('=');
      if (/Max-Age=0/i.test(cookie)) this.cookies.delete(name);
      else this.cookies.set(name, value.join('='));
    }
    return response;
  }
}

/** Ambiente do Worker com KV em memória e todos os secrets. */
function workerEnv(extra: Partial<GmailWorkerEnv> = {}): GmailWorkerEnv {
  return { ...SECRETS, OAUTH_KV: new FakeKv(), GMAIL_KV: new FakeKv(), ...extra };
}

/** Google cuja troca de código devolve um id_token do e-mail dado com o nonce do último pedido. */
function stubGoogle(email: string, routes: Parameters<typeof fakeFetch>[0] = []) {
  const state = { nonce: '' };
  const exp = Math.floor(Date.now() / 1000) + 600;
  vi.stubGlobal(
    'fetch',
    fakeFetch([
      tokenRoute(() =>
        Response.json({
          access_token: 'a',
          refresh_token: `r-${email.slice(0, email.indexOf('@'))}`,
          scope: 'openid email https://www.googleapis.com/auth/gmail.modify',
          id_token: validIdToken(email, state.nonce, { exp }),
        }),
      ),
      ...routes,
    ]),
  );
  return state;
}

/** Registra um cliente com o retorno do claude.ai e devolve o `client_id`. */
async function register(browser: Browser): Promise<string> {
  const response = await browser.fetch('/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none' }),
  });
  expect(response.status).toBe(201);
  return ((await response.json()) as { client_id: string }).client_id;
}

/** URL do `/authorize` para o cliente, com PKCE S256. */
function authorizePath(clientId: string): string {
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT,
    state: 'claude-state',
    code_challenge: pkceChallenge(VERIFIER),
    code_challenge_method: 'S256',
    resource: `${ORIGIN}/mcp`,
  });
  return `/authorize?${query.toString()}`;
}

/** Aprova o consentimento e devolve a URL do Google para onde o navegador foi mandado. */
async function approve(browser: Browser, clientId: string, nonceHolder: { nonce: string }) {
  const page = await browser.fetch(authorizePath(clientId));
  expect(page.status).toBe(200);
  const handle = /name="handle" value="([^"]+)"/.exec(await page.text())?.[1] ?? '';
  const response = await browser.fetch('/authorize', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ handle, decision: 'approve' }).toString(),
  });
  expect(response.status).toBe(302);
  const google = new URL(response.headers.get('location') ?? '');
  nonceHolder.nonce = google.searchParams.get('nonce') ?? '';
  return google;
}

/** Volta do Google com um código para o `state` dado. */
function googleCallback(browser: Browser, google: URL): Promise<Response> {
  const state = google.searchParams.get('state') ?? '';
  return browser.fetch(`/google/callback?state=${encodeURIComponent(state)}&code=codigo-google`);
}

/** Faz o fluxo inteiro e devolve o access token emitido para o Claude. */
async function signIn(browser: Browser, email = 'dono@example.com'): Promise<string> {
  const holder = stubGoogle(email, [gmailRoute({ labels: { labels: [] } })]);
  const clientId = await register(browser);
  const callback = await googleCallback(browser, await approve(browser, clientId, holder));
  expect(callback.status).toBe(302);
  const back = new URL(callback.headers.get('location') ?? '');
  expect(back.origin + back.pathname).toBe(REDIRECT);
  expect(back.searchParams.get('state')).toBe('claude-state');
  const token = await browser.fetch('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: back.searchParams.get('code') ?? '',
      redirect_uri: REDIRECT,
      client_id: clientId,
      code_verifier: VERIFIER,
    }).toString(),
  });
  expect(token.status).toBe(200);
  return ((await token.json()) as { access_token: string }).access_token;
}

/** Chamada JSON-RPC ao `/mcp` com o token dado. */
function mcpCall(browser: Browser, token: string, body: unknown): Promise<Response> {
  return browser.fetch('/mcp', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'mcp-protocol-version': '2025-06-18',
    },
    body: JSON.stringify(body),
  });
}

/** Chama uma ferramenta pelo `/mcp` e devolve o texto do primeiro bloco do resultado. */
async function toolText(
  browser: Browser,
  token: string,
  [name, args]: [string, Record<string, unknown>],
): Promise<string> {
  const call = await mcpCall(browser, token, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: { name, arguments: args },
  });
  const body = (await call.json()) as { result: { content: { text: string }[] } };
  return body.result.content[0]?.text ?? '';
}

beforeEach(() => {
  clearAccessTokenCache();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('rotas básicas e descoberta', () => {
  it('responde ok em / e 404 em caminho desconhecido', async () => {
    const browser = new Browser(workerEnv());
    expect(await (await browser.fetch('/')).text()).toBe('ok');
    expect((await browser.fetch('/nada')).status).toBe(404);
  });

  it('publica os metadados e exige token no /mcp', async () => {
    const browser = new Browser(workerEnv());
    const resource = await browser.fetch('/.well-known/oauth-protected-resource/mcp');
    expect(await resource.json()).toMatchObject({
      resource: `${ORIGIN}/mcp`,
      authorization_servers: [ORIGIN],
    });
    const server = (await (
      await browser.fetch('/.well-known/oauth-authorization-server')
    ).json()) as Record<string, unknown>;
    expect(server.code_challenge_methods_supported).toEqual(['S256']);
    expect(server.registration_endpoint).toBe(`${ORIGIN}/register`);
    const unauthorized = await browser.fetch('/mcp', { method: 'POST' });
    expect(unauthorized.status).toBe(401);
    expect(unauthorized.headers.get('www-authenticate')).toContain('resource_metadata');
  });

  it('recusa registro de cliente com retorno fora do Claude', async () => {
    const browser = new Browser(workerEnv());
    const response = await browser.fetch('/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ redirect_uris: ['https://evil.example/cb'] }),
    });
    expect(response.status).toBe(400);
  });
});

describe('login de quem instalou e /mcp', () => {
  it('faz o fluxo completo e lista as ferramentas', async () => {
    const browser = new Browser(workerEnv());
    const token = await signIn(browser);
    const list = await mcpCall(browser, token, { jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(list.status).toBe(200);
    const body = (await list.json()) as {
      result: { tools: { name: string; annotations?: Record<string, boolean> }[] };
    };
    expect(body.result.tools.map((t) => t.name)).toContain('get_attachment_text');
    const send = body.result.tools.find((t) => t.name === 'send_email');
    expect(send?.annotations).toMatchObject({ destructiveHint: true, readOnlyHint: false });
    const read = body.result.tools.find((t) => t.name === 'get_message');
    expect(read?.annotations).toMatchObject({ readOnlyHint: true });
  });

  it('a conta do login já fica vinculada e responde às ferramentas', async () => {
    const browser = new Browser(workerEnv());
    const token = await signIn(browser);
    const text = await toolText(browser, token, ['list_labels', { account: 'dono' }]);
    expect(JSON.parse(text)).toEqual({ results: [{ account: 'dono', labels: [] }] });
  });

  it('cada usuário só vê as próprias contas', async () => {
    const env = workerEnv();
    const ana = await signIn(new Browser(env), 'ana@example.com');
    const bia = await signIn(new Browser(env), 'bia@example.com');
    const anaAccounts = JSON.parse(
      await toolText(new Browser(env), ana, ['list_accounts', {}]),
    ) as {
      accounts: { account: string }[];
    };
    expect(anaAccounts.accounts.map((a) => a.account)).toEqual(['ana']);
    const biaCall = await toolText(new Browser(env), bia, ['list_labels', { account: 'ana' }]);
    expect(biaCall).toMatch(/não vinculada/);
  });

  it('link_account gera link que leva ao Google com acesso offline', async () => {
    const env = workerEnv();
    const browser = new Browser(env);
    const token = await signIn(browser);
    const { link_url } = JSON.parse(await toolText(browser, token, ['link_account', {}])) as {
      link_url: string;
    };
    const response = await browser.fetch(new URL(link_url).pathname + new URL(link_url).search);
    const google = new URL(response.headers.get('location') ?? '');
    expect(google.searchParams.get('access_type')).toBe('offline');
    const back = await browser.fetch(
      `/google/callback?state=${google.searchParams.get('state') ?? ''}&error=access_denied`,
    );
    expect(await back.text()).toContain('Vínculo cancelado');
  });

  it('no modo privado, e-mail fora de ALLOWED_EMAILS recebe 403 e nenhum código', async () => {
    const browser = new Browser(workerEnv({ ALLOWED_EMAILS: 'dono@example.com' }));
    const holder = stubGoogle('intruso@example.com');
    const clientId = await register(browser);
    const callback = await googleCallback(browser, await approve(browser, clientId, holder));
    expect(callback.status).toBe(403);
  });

  it('consentimento lembrado vai direto ao Google na próxima vez', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('dono@example.com');
    const clientId = await register(browser);
    await approve(browser, clientId, holder);
    const again = await browser.fetch(authorizePath(clientId));
    expect(again.status).toBe(302);
    expect(again.headers.get('location')).toMatch(/^https:\/\/accounts\.google\.com/);
  });

  it('negar volta ao Claude com access_denied', async () => {
    const browser = new Browser(workerEnv());
    const clientId = await register(browser);
    const page = await browser.fetch(authorizePath(clientId));
    const handle = /name="handle" value="([^"]+)"/.exec(await page.text())?.[1] ?? '';
    const denied = await browser.fetch('/authorize', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `handle=${handle}&decision=deny`,
    });
    expect(new URL(denied.headers.get('location') ?? '').searchParams.get('error')).toBe(
      'access_denied',
    );
  });

  it('recusa no Google volta ao Claude com access_denied', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('dono@example.com');
    const google = await approve(browser, await register(browser), holder);
    const state = google.searchParams.get('state') ?? '';
    const back = await browser.fetch(`/google/callback?state=${state}&error=access_denied`);
    expect(back.headers.get('location')).toContain('error=access_denied');
  });

  it('pedidos inválidos viram página de erro', async () => {
    const browser = new Browser(workerEnv());
    expect((await browser.fetch('/authorize?client_id=x')).status).toBe(400);
    const post = await browser.fetch('/authorize', {
      method: 'POST',
      body: 'handle=x&decision=approve',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    expect(post.status).toBe(400);
    expect((await browser.fetch('/google/callback?state=sem-cookie&code=c')).status).toBe(400);
  });

  it('id_token ausente na volta do login vira página de erro', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('dono@example.com');
    const google = await approve(browser, await register(browser), holder);
    vi.stubGlobal('fetch', fakeFetch([tokenRoute(() => Response.json({ access_token: 'a' }))]));
    expect((await googleCallback(browser, google)).status).toBe(400);
  });

  it('limita requisições por sessão no /mcp', async () => {
    const browser = new Browser(workerEnv({ RATE_LIMITER: countingLimiter(1) }));
    const token = await signIn(browser);
    const ping = { jsonrpc: '2.0', id: 1, method: 'ping' };
    expect((await mcpCall(browser, token, ping)).status).toBe(200);
    expect((await mcpCall(browser, token, ping)).status).toBe(429);
  });
});

describe('rotas públicas', () => {
  it('/accounts/link sem ticket mostra link inválido', async () => {
    const response = await new Browser(workerEnv()).fetch('/accounts/link');
    expect(response.status).toBe(400);
  });

  it('limita por IP as rotas sem token, mas não o /mcp', async () => {
    const browser = new Browser(workerEnv({ RATE_LIMITER_PUBLIC: countingLimiter(1) }));
    expect((await browser.fetch('/')).status).toBe(200);
    expect((await browser.fetch('/')).status).toBe(429);
    expect((await browser.fetch('/mcp', { method: 'POST' })).status).toBe(401);
  });

  it('clientIpKey e isMcpPath', () => {
    const request = new Request(`${ORIGIN}/mcp/x`, { headers: { 'cf-connecting-ip': '1.2.3.4' } });
    expect(clientIpKey(request)).toBe('ip:1.2.3.4');
    expect(clientIpKey(new Request(ORIGIN))).toBe('ip:unknown');
    expect(isMcpPath(request)).toBe(true);
    expect(isMcpPath(new Request(`${ORIGIN}/mcpx`))).toBe(false);
  });
});

describe('configuração e peças do Worker', () => {
  it('secret ausente vira 500 explicando qual falta', async () => {
    const env = workerEnv({ GOOGLE_CLIENT_ID: undefined });
    const response = await new Browser(env).fetch('/authorize');
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('GOOGLE_CLIENT_ID');
    const ctx = {
      waitUntil: () => undefined,
      passThroughOnException: () => undefined,
      props: { sid: 's', owner: 'o' },
    };
    const mcp = await handleMcpApi(new Request(`${ORIGIN}/mcp`), env, ctx);
    expect(mcp.status).toBe(500);
    expect(configErrorResponse('texto').status).toBe(500);
  });

  it('publicOrigin prefere PUBLIC_URL', () => {
    const request = new Request('https://x.workers.dev/mcp');
    expect(publicOrigin(workerEnv(), request)).toBe('https://x.workers.dev');
    const custom = workerEnv({ PUBLIC_URL: 'https://gmail.exemplo.dev/' });
    expect(publicOrigin(custom, request)).toBe('https://gmail.exemplo.dev');
  });

  it('createGmailDeps e createGmailServer montam o conector', () => {
    const deps = createGmailDeps(workerEnv(), ORIGIN);
    expect(deps.settings.allowedEmails).toBeNull();
    expect(deps.now()).toBeGreaterThan(0);
    expect(createGmailServer({ ...deps, owner: 'o' })).toBeDefined();
    expect(createGmailProvider(ORIGIN)).toBeDefined();
  });

  it('handleDefaultRequest sem o provedor injetado dá 404', async () => {
    const response = await handleDefaultRequest(new Request(`${ORIGIN}/authorize`), workerEnv());
    expect(response.status).toBe(404);
  });

  it('checkClientRegistration aceita só retornos do Claude', () => {
    const request = new Request(ORIGIN);
    expect(
      checkClientRegistration({ clientMetadata: { redirect_uris: [REDIRECT] }, request }),
    ).toBeUndefined();
    expect(checkClientRegistration({ clientMetadata: {}, request })).toMatchObject({ status: 400 });
  });

  it('authorizationErrorResponse redireciona quando a biblioteca indica, senão mostra página', () => {
    const withRedirect = Object.assign(
      new AuthorizationError('access_denied', { description: 'x' }),
      {
        redirectTo: 'https://claude.ai/cb?error=access_denied',
      },
    );
    expect(authorizationErrorResponse(withRedirect).status).toBe(302);
    expect(authorizationErrorResponse(new Error('x')).status).toBe(400);
  });
});
