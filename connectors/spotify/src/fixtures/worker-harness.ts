/**
 * Worker test harness: a cookie-keeping browser, Claude's OAuth client (registration, PKCE, token) and a fake
 * Spotify that knows several users — the code `code-<user>` signs in as `<user>`, and the Web API answers with
 * that user's own data. Everything is fictitious.
 */
import { expect } from 'vitest';
import { FakeKv } from '../../../../src/remote/fixtures/fake-kv.js';
import { pkceChallenge } from '../../../../src/remote/oauth.js';
import type { Fetcher } from '../../../../src/remote/worker-kit.js';
import { handleSpotifyWorkerFetch, type SpotifyWorkerEnv } from '../worker.js';
import { entryJson, pageJson, trackJson } from './fake-spotify.js';

export const ORIGIN = 'https://spotify.test';
export const REDIRECT = 'https://claude.ai/api/mcp/auth_callback';
export const VERIFIER = 'v'.repeat(64);
export const CLIENT_ID = 'c'.repeat(32);
export const CLIENT_SECRET = 'd'.repeat(32);

/** Worker environment with in-memory KV and the secrets. */
export function workerEnv(extra: Partial<SpotifyWorkerEnv> = {}): SpotifyWorkerEnv {
  return {
    TOKEN_ENC_KEY: Buffer.alloc(32, 5).toString('base64'),
    OAUTH_KV: new FakeKv(),
    SPOTIFY_KV: new FakeKv(),
    ...extra,
  };
}

/** User of a bearer or refresh token (`at-code-ana`, `at-rt-ana`, `rt-ana` → `ana`). */
export function userOfToken(token: string): string {
  return token
    .replace(/^Bearer /, '')
    .replace(/^at-/, '')
    .replace(/^code-/, '')
    .replace(/^rt-/, '');
}

/** Fake Spotify for several users; `onApi` may override Web API answers. */
export function multiUserSpotify(
  onApi?: (path: string, user: string, url: URL) => Response | null,
): Fetcher {
  return async (input, init) => {
    await new Promise((done) => setTimeout(done, Math.floor(Math.random() * 5)));
    const url = new URL(input);
    if (url.pathname === '/api/token') {
      const form = new URLSearchParams(String(init?.body ?? ''));
      const user = userOfToken(form.get('code') ?? form.get('refresh_token') ?? '');
      return Response.json({
        access_token: `at-${user}`,
        refresh_token: `rt-${user}`,
        expires_in: 3600,
        scope: 'user-library-read',
      });
    }
    const user = userOfToken(new Headers(init?.headers).get('authorization') ?? '');
    const custom = onApi?.(url.pathname, user, url);
    if (custom) return custom;
    if (url.pathname === '/v1/me')
      return Response.json({
        id: user,
        account_id: `acc-${user}`,
        display_name: user.toUpperCase(),
      });
    if (url.pathname === '/v1/me/tracks')
      return Response.json(
        pageJson([entryJson(trackJson(`${user}1`)), entryJson(trackJson(`${user}2`))], url),
      );
    return Response.json({ error: { status: 404, message: 'nope' } }, { status: 404 });
  };
}

/** Minimal browser: keeps cookies and calls the Worker. */
export class Browser {
  readonly cookies = new Map<string, string>();
  constructor(readonly env: SpotifyWorkerEnv) {}

  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    const jar = [...this.cookies].map(([k, v]) => `${k}=${v}`).join('; ');
    if (jar) headers.set('cookie', jar);
    const ctx = {
      waitUntil: () => undefined,
      passThroughOnException: () => undefined,
      props: {},
    } as unknown as ExecutionContext;
    const response = await handleSpotifyWorkerFetch(
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

/** Registers Claude as a client and returns its `client_id`. */
export async function register(browser: Browser): Promise<string> {
  const response = await browser.fetch('/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none' }),
  });
  expect(response.status).toBe(201);
  return ((await response.json()) as { client_id: string }).client_id;
}

/** `/authorize` URL for the client, with PKCE S256. */
export function authorizePath(clientId: string): string {
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

/** Posts the credentials form of a page; returns the response. */
export async function submitCredentials(
  browser: Browser,
  page: string,
  fields: {
    readonly clientId?: string;
    readonly clientSecret?: string;
    readonly decision?: string;
  } = {},
): Promise<Response> {
  const handle = /name="handle" value="([^"]+)"/.exec(page)?.[1] ?? '';
  const action = (/<form method="post" action="([^"]+)"/.exec(page)?.[1] ?? '').replaceAll(
    '&amp;',
    '&',
  );
  return browser.fetch(action, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      handle,
      decision: fields.decision ?? 'approve',
      client_id: fields.clientId ?? CLIENT_ID,
      client_secret: fields.clientSecret ?? CLIENT_SECRET,
    }).toString(),
  });
}

/** Runs the whole flow as `user` and returns Claude's access token. */
export async function signIn(browser: Browser, user: string): Promise<string> {
  const clientId = await register(browser);
  const page = await browser.fetch(authorizePath(clientId));
  const toSpotify = await submitCredentials(browser, await page.text());
  const state = new URL(toSpotify.headers.get('location') ?? '').searchParams.get('state') ?? '';
  const callback = await browser.fetch(
    `/spotify/callback?state=${encodeURIComponent(state)}&code=code-${user}`,
  );
  expect(callback.status).toBe(302);
  const back = new URL(callback.headers.get('location') ?? '');
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

/** JSON-RPC call to `/mcp`. */
export function mcpCall(browser: Browser, token: string, body: unknown): Promise<Response> {
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

/** Calls a tool and returns the text of the first result block. */
export async function toolText(
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
