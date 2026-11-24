/**
 * Fake Google for tests: real RSA keys (a truly signed id_token), token endpoint, JWKS and Gmail API
 * simulated by a routed `fetch` that records every call.
 */
import { generateKeyPairSync, sign, type KeyObject } from 'node:crypto';
import { aliasAccounts, type AccountRef } from '../accounts.js';
import type { GmailSettings } from '../config.js';
import type { Fetcher, OwnerDeps } from '../context.js';
import { saveOwnerAccounts, type LinkedAccount } from '../token-store.js';
import { FakeKv } from '../../../../src/remote/fixtures/fake-kv.js';
export { countingLimiter } from '../../../../src/remote/fixtures/limiter.js';

/** Test seal key (32 bytes). */
export const TEST_TOKEN_KEY = Buffer.alloc(32, 7);

/** Emails of the test Gmail accounts (fictitious). */
export const TEST_EMAILS: readonly string[] = ['owner@example.com', 'music@example.com'];

/** Connector user in tests (Google `sub`). */
export const TEST_OWNER = 'sub-owner@example.com';

/** Test settings. */
export const TEST_SETTINGS: GmailSettings = {
  googleClientId: 'client-123.apps.googleusercontent.com',
  googleClientSecret: 'test-secret',
  tokenKey: TEST_TOKEN_KEY,
  allowedEmails: null,
  consentSecret: 'c'.repeat(40),
};

/** Worker origin in tests. */
export const TEST_ORIGIN = 'https://gmail.test';

const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });

/** Test public key as JWK, with `kid`. */
export const TEST_JWK = {
  ...keys.publicKey.export({ format: 'jwk' }),
  kid: 'kid-1',
  alg: 'RS256',
  use: 'sig',
};

/** Signs an RS256 JWT with the test key (or another one). */
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

/** Valid `id_token` for the given email and `nonce` (now = 1_700_000_000 s). */
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

/** Fixed test time, in ms. */
export const TEST_NOW_MS = 1_700_000_000_000;

/** Call recorded by the fake `fetch`. */
export interface RecordedCall {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

/** Fake `fetch` route: gets the URL and options and returns the response (or nothing, to move on). */
export type FakeRoute = (url: URL, init: RequestInit | undefined) => Response | undefined;

/** Routed fake `fetch`; the Google JWKS is answered already. No route, 599. */
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
    return Promise.resolve(new Response(`no route for ${url.href}`, { status: 599 }));
  };
}

/** Google token endpoint route: refresh returns `access-<refresh>`; a code uses `onCode`. */
export function tokenRoute(
  onCode: (form: URLSearchParams) => Response = () => new Response('', { status: 400 }),
): FakeRoute {
  return (url, init) => {
    if (url.href !== 'https://oauth2.googleapis.com/token') return undefined;
    const form = new URLSearchParams(String(init?.body));
    if (form.get('grant_type') === 'authorization_code') return onCode(form);
    const refresh = form.get('refresh_token') ?? '';
    if (refresh.startsWith('revoked'))
      return Response.json({ error: 'invalid_grant' }, { status: 400 });
    return Response.json({ access_token: `access-${refresh}`, expires_in: 3600 });
  };
}

/** Gmail API route: answers the JSON of `responses[path]` (path after `/users/me/`). */
export function gmailRoute(responses: Readonly<Record<string, unknown>>): FakeRoute {
  return (url) => {
    const prefix = '/gmail/v1/users/me/';
    if (url.hostname !== 'gmail.googleapis.com' || !url.pathname.startsWith(prefix))
      return undefined;
    const body = responses[url.pathname.slice(prefix.length)];
    return body === undefined ? new Response('{}', { status: 404 }) : Response.json(body);
  };
}

/** Test dependencies with in-memory KV, the given `fetch` and the `TEST_OWNER` user. */
export function testDeps(fetcher: Fetcher, kv: FakeKv = new FakeKv()): OwnerDeps & { kv: FakeKv } {
  kv.now = () => TEST_NOW_MS;
  return {
    settings: TEST_SETTINGS,
    kv,
    fetch: fetcher,
    now: () => TEST_NOW_MS,
    origin: TEST_ORIGIN,
    owner: TEST_OWNER,
    ownerEmail: 'owner@example.com',
  };
}

/** Test linked account (refresh `r-<part before the @>`). */
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

/** Dependencies with the given accounts already linked to `TEST_OWNER` and the given routes. */
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

/** Test accounts with aliases (`owner`, `music`), as the tools see them. */
export const TEST_REFS: readonly AccountRef[] = aliasAccounts(
  TEST_EMAILS.map((email) => testAccount(email)),
);

/** Write recorded by the Gmail API write route. */
export interface GmailWrite {
  readonly method: string;
  readonly path: string;
  readonly body: unknown;
}

/** Gmail API write route: records POST/PUT/DELETE and answers `respond(write)` (null = 204). */
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

/** Scope of accounts linked before Gmail management (read-only). */
export const READONLY_SCOPE = 'openid email https://www.googleapis.com/auth/gmail.readonly';
