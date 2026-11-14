import { pkceChallenge } from '../../../src/remote/oauth.js';
import { FALLBACK_SERVER_VERSION } from '../../../src/mcp/server-version.js';
import manifest from '../plugin/.claude-plugin/plugin.json' with { type: 'json' };
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
  GMAIL_SERVER_INFO,
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
  GOOGLE_CLIENT_SECRET: 'secret',
  TOKEN_ENC_KEY: TEST_TOKEN_KEY.toString('base64'),
  CONSENT_SECRET: 's'.repeat(40),
};

/** Minimal browser: keeps cookies and calls the Worker. */
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

/** Worker environment with in-memory KV and every secret. */
function workerEnv(extra: Partial<GmailWorkerEnv> = {}): GmailWorkerEnv {
  return { ...SECRETS, OAUTH_KV: new FakeKv(), GMAIL_KV: new FakeKv(), ...extra };
}

/** Google whose code exchange returns an id_token for the given email with the last request's nonce. */
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

/** Registers a client with the claude.ai callback and returns the `client_id`. */
async function register(browser: Browser): Promise<string> {
  const response = await browser.fetch('/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none' }),
  });
  expect(response.status).toBe(201);
  return ((await response.json()) as { client_id: string }).client_id;
}

/** `/authorize` URL for the client, with PKCE S256. */
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

/** Approves the consent and returns the Google URL the browser was sent to. */
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

/** Google callback with a code for the given `state`. */
function googleCallback(browser: Browser, google: URL): Promise<Response> {
  const state = google.searchParams.get('state') ?? '';
  return browser.fetch(`/google/callback?state=${encodeURIComponent(state)}&code=google-code`);
}

/** Runs the whole flow and returns the access token issued to Claude. */
async function signIn(browser: Browser, email = 'owner@example.com'): Promise<string> {
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

/** JSON-RPC call to `/mcp` with the given token. */
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

/** Calls a tool through `/mcp` and returns the text of the first result block. */
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

describe('basic routes and discovery', () => {
  it('answers ok on / and 404 on an unknown path', async () => {
    const browser = new Browser(workerEnv());
    expect(await (await browser.fetch('/')).text()).toBe('ok');
    expect((await browser.fetch('/nothing')).status).toBe(404);
  });

  it('publishes the metadata and requires a token on /mcp', async () => {
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

  it('refuses registering a client with a callback outside Claude', async () => {
    const browser = new Browser(workerEnv());
    const response = await browser.fetch('/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ redirect_uris: ['https://evil.example/cb'] }),
    });
    expect(response.status).toBe(400);
  });
});

describe('installer sign-in and /mcp', () => {
  it('runs the full flow and lists the tools', async () => {
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

  it('the sign-in account is linked right away and answers the tools', async () => {
    const browser = new Browser(workerEnv());
    const token = await signIn(browser);
    const text = await toolText(browser, token, ['list_labels', { account: 'owner' }]);
    expect(JSON.parse(text)).toEqual({ results: [{ account: 'owner', labels: [] }] });
  });

  it('each user only sees their own accounts', async () => {
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
    expect(biaCall).toMatch(/is not linked/);
  });

  it('link_account issues a link that leads to Google with offline access', async () => {
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
    expect(await back.text()).toContain('Linking canceled');
  });

  it('in private mode, an email outside ALLOWED_EMAILS gets 403 and no code', async () => {
    const browser = new Browser(workerEnv({ ALLOWED_EMAILS: 'owner@example.com' }));
    const holder = stubGoogle('intruder@example.com');
    const clientId = await register(browser);
    const callback = await googleCallback(browser, await approve(browser, clientId, holder));
    expect(callback.status).toBe(403);
  });

  it('remembered consent goes straight to Google next time', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('owner@example.com');
    const clientId = await register(browser);
    await approve(browser, clientId, holder);
    const again = await browser.fetch(authorizePath(clientId));
    expect(again.status).toBe(302);
    expect(again.headers.get('location')).toMatch(/^https:\/\/accounts\.google\.com/);
  });

  it('denying returns to Claude with access_denied', async () => {
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

  it('a refusal at Google returns to Claude with access_denied', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('owner@example.com');
    const google = await approve(browser, await register(browser), holder);
    const state = google.searchParams.get('state') ?? '';
    const back = await browser.fetch(`/google/callback?state=${state}&error=access_denied`);
    expect(back.headers.get('location')).toContain('error=access_denied');
  });

  it('invalid requests become an error page', async () => {
    const browser = new Browser(workerEnv());
    expect((await browser.fetch('/authorize?client_id=x')).status).toBe(400);
    const post = await browser.fetch('/authorize', {
      method: 'POST',
      body: 'handle=x&decision=approve',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    expect(post.status).toBe(400);
    expect((await browser.fetch('/google/callback?state=no-cookie&code=c')).status).toBe(400);
  });

  it('a missing id_token on the sign-in callback becomes an error page', async () => {
    const browser = new Browser(workerEnv());
    const holder = stubGoogle('owner@example.com');
    const google = await approve(browser, await register(browser), holder);
    vi.stubGlobal('fetch', fakeFetch([tokenRoute(() => Response.json({ access_token: 'a' }))]));
    expect((await googleCallback(browser, google)).status).toBe(400);
  });

  it('limits requests per session on /mcp', async () => {
    const browser = new Browser(workerEnv({ RATE_LIMITER: countingLimiter(1) }));
    const token = await signIn(browser);
    const ping = { jsonrpc: '2.0', id: 1, method: 'ping' };
    expect((await mcpCall(browser, token, ping)).status).toBe(200);
    expect((await mcpCall(browser, token, ping)).status).toBe(429);
  });
});

/** POST to `/token` with a form body. */
function tokenForm(browser: Browser, fields: Record<string, string>): Promise<Response> {
  return browser.fetch('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
}

/** `/authorize` path for the client with some PKCE parameters changed or removed. */
function pkcePath(clientId: string, changes: Record<string, string | null>): string {
  const url = new URL(authorizePath(clientId), ORIGIN);
  for (const [name, value] of Object.entries(changes)) {
    if (value === null) url.searchParams.delete(name);
    else url.searchParams.set(name, value);
  }
  return `${url.pathname}${url.search}`;
}

describe('Connectors Directory requirements (Gmail, via workers-oauth-provider)', () => {
  it('PKCE: plain or missing code_challenge never reaches Google nor issues a code', async () => {
    const browser = new Browser(workerEnv());
    const clientId = await register(browser);
    const variants = [
      { code_challenge_method: 'plain', code_challenge: VERIFIER },
      { code_challenge: null, code_challenge_method: null },
    ];
    for (const changes of variants) {
      const res = await browser.fetch(pkcePath(clientId, changes));
      const location = res.headers.get('location');
      if (location === null) {
        expect(res.status).toBe(400);
        continue;
      }
      const back = new URL(location);
      expect(back.origin + back.pathname).toBe(REDIRECT);
      expect(back.searchParams.get('error')).toBe('invalid_request');
      expect(back.searchParams.get('code')).toBeNull();
    }
  });

  it('discovery: 401 points to resource metadata whose resource is the server URL', async () => {
    const browser = new Browser(workerEnv());
    const res = await browser.fetch('/mcp', { method: 'POST' });
    expect(res.status).toBe(401);
    const header = res.headers.get('www-authenticate') ?? '';
    expect(header).toMatch(/^Bearer /);
    const metadataUrl = new URL(/resource_metadata="([^"]+)"/.exec(header)?.[1] ?? '');
    expect(metadataUrl.origin).toBe(ORIGIN);
    expect(metadataUrl.pathname.startsWith('/.well-known/oauth-protected-resource')).toBe(true);
    const resource = (await (await browser.fetch(metadataUrl.pathname)).json()) as {
      resource: string;
      resource_name: string;
    };
    expect(resource.resource).toBe(`${ORIGIN}/mcp`);
    expect(resource.resource_name).not.toMatch(/read-only/i);
    const server = (await (
      await browser.fetch('/.well-known/oauth-authorization-server')
    ).json()) as Record<string, unknown>;
    expect(server).toMatchObject({ issuer: ORIGIN, token_endpoint: `${ORIGIN}/token` });
  });

  it('dynamic client registration accepts the claude.ai callback', async () => {
    const browser = new Browser(workerEnv());
    expect(await register(browser)).not.toBe('');
  });

  it('token endpoint answers invalid_grant for dead refresh tokens', async () => {
    const browser = new Browser(workerEnv());
    const clientId = await register(browser);
    const res = await tokenForm(browser, {
      grant_type: 'refresh_token',
      refresh_token: 'user:grant:dead',
      client_id: clientId,
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; error_description: string };
    expect(body.error).toBe('invalid_grant');
    expect(body.error_description).not.toBe('');
  });

  it('token endpoint takes form bodies and refuses JSON with an explanation', async () => {
    const browser = new Browser(workerEnv());
    const json = await browser.fetch('/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: 'x' }),
    });
    expect(json.status).toBe(400);
    expect(((await json.json()) as { error_description: string }).error_description).toContain(
      'application/x-www-form-urlencoded',
    );
    expect(await signIn(browser)).not.toBe('');
  });

  it('never accepts the access token in the query string', async () => {
    const browser = new Browser(workerEnv());
    const token = await signIn(browser);
    const res = await browser.fetch(`/mcp?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
    });
    expect(res.status).toBe(401);
  });
});

describe('public routes', () => {
  it('/accounts/link without a ticket shows an invalid link', async () => {
    const response = await new Browser(workerEnv()).fetch('/accounts/link');
    expect(response.status).toBe(400);
  });

  it('limits the tokenless routes per IP, but not /mcp', async () => {
    const browser = new Browser(workerEnv({ RATE_LIMITER_PUBLIC: countingLimiter(1) }));
    expect((await browser.fetch('/')).status).toBe(200);
    expect((await browser.fetch('/')).status).toBe(429);
    expect((await browser.fetch('/mcp', { method: 'POST' })).status).toBe(401);
  });

  it('clientIpKey and isMcpPath', () => {
    const request = new Request(`${ORIGIN}/mcp/x`, { headers: { 'cf-connecting-ip': '1.2.3.4' } });
    expect(clientIpKey(request)).toBe('ip:1.2.3.4');
    expect(clientIpKey(new Request(ORIGIN))).toBe('ip:unknown');
    expect(isMcpPath(request)).toBe(true);
    expect(isMcpPath(new Request(`${ORIGIN}/mcpx`))).toBe(false);
  });
});

describe('GMAIL_SERVER_INFO', () => {
  it('announces the version of the plugin manifest', () => {
    expect(GMAIL_SERVER_INFO.version).toBe(manifest.version);
    expect(GMAIL_SERVER_INFO.version).not.toBe(FALLBACK_SERVER_VERSION);
  });
});

describe('Worker configuration and pieces', () => {
  it('a missing secret becomes a 500 naming it', async () => {
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
    expect(configErrorResponse('text').status).toBe(500);
  });

  it('publicOrigin prefers PUBLIC_URL', () => {
    const request = new Request('https://x.workers.dev/mcp');
    expect(publicOrigin(workerEnv(), request)).toBe('https://x.workers.dev');
    const custom = workerEnv({ PUBLIC_URL: 'https://gmail.example.dev/' });
    expect(publicOrigin(custom, request)).toBe('https://gmail.example.dev');
  });

  it('createGmailDeps and createGmailServer build the connector', () => {
    const deps = createGmailDeps(workerEnv(), ORIGIN);
    expect(deps.settings.allowedEmails).toBeNull();
    expect(deps.now()).toBeGreaterThan(0);
    expect(createGmailServer({ ...deps, owner: 'o' })).toBeDefined();
    expect(createGmailProvider(ORIGIN)).toBeDefined();
  });

  it('handleDefaultRequest without the injected provider gives 404', async () => {
    const response = await handleDefaultRequest(new Request(`${ORIGIN}/authorize`), workerEnv());
    expect(response.status).toBe(404);
  });

  it('checkClientRegistration accepts only Claude callbacks', () => {
    const request = new Request(ORIGIN);
    expect(
      checkClientRegistration({ clientMetadata: { redirect_uris: [REDIRECT] }, request }),
    ).toBeUndefined();
    expect(checkClientRegistration({ clientMetadata: {}, request })).toMatchObject({ status: 400 });
  });

  it('authorizationErrorResponse redirects when the library says so, otherwise shows a page', () => {
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
