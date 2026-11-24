/**
 * Data isolation of the public, multi-user Gmail Worker (docs/security/isolation.md): two connector users served
 * by the same isolate at the same time, with distinct accounts and with the SAME Gmail account linked to both,
 * only ever see their own accounts, tokens and mail. All tokens and emails here are fake fixtures.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aliasAccounts, type AccountRef } from './accounts.js';
import { clearAccessTokenCache, getAccessToken } from './access-token.js';
import type { Fetcher } from './context.js';
import { FakeKv } from '../../../src/remote/fixtures/fake-kv.js';
import {
  fakeFetch,
  TEST_TOKEN_KEY,
  testAccount,
  testDeps,
  tokenRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import type { GrantProps } from './sign-in.js';
import { loadOwnerAccounts, ownerKey, saveOwnerAccounts } from './token-store.js';
import { handleMcpApi, type GmailWorkerEnv } from './worker.js';

const SECRETS = {
  GOOGLE_CLIENT_ID: 'client-123.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'fake-secret',
  TOKEN_ENC_KEY: TEST_TOKEN_KEY.toString('base64'),
  CONSENT_SECRET: 's'.repeat(40),
};

/** Two connector users; `shared@example.com` is linked to both, each with their own refresh token. */
const A: GrantProps = { owner: 'sub-alice', email: 'alice@example.com', sid: 'sid-a' };
const B: GrantProps = { owner: 'sub-bob', email: 'bob@example.com', sid: 'sid-b' };

/** Gmail double: the label list names the access token used, after a random delay to interleave calls. */
function labelsByToken(): Fetcher {
  const google = fakeFetch([tokenRoute()]);
  return async (input, init) => {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 10)));
    const url = new URL(input);
    if (url.hostname !== 'gmail.googleapis.com') return google(input, init);
    const auth = new Headers(init?.headers).get('authorization') ?? '';
    return Response.json({ labels: [{ id: 'L1', name: `seen-with:${auth}`, type: 'user' }] });
  };
}

/** The shared account as one user linked it (with that user's own refresh token). */
function sharedRef(refreshToken: string): AccountRef {
  const [ref] = aliasAccounts([testAccount('shared@example.com', { refreshToken })]);
  if (!ref) throw new Error('fixture');
  return ref;
}

async function seedAccounts(kv: FakeKv): Promise<void> {
  await saveOwnerAccounts(kv, TEST_TOKEN_KEY, {
    owner: A.owner,
    accounts: [
      testAccount('alice@example.com'),
      testAccount('shared@example.com', { refreshToken: 'r-shared-for-alice' }),
    ],
  });
  await saveOwnerAccounts(kv, TEST_TOKEN_KEY, {
    owner: B.owner,
    accounts: [
      testAccount('bob@example.com'),
      testAccount('shared@example.com', { refreshToken: 'r-shared-for-bob' }),
    ],
  });
}

async function callAs(
  env: GmailWorkerEnv,
  props: GrantProps,
  [name, args]: [string, unknown],
): Promise<string> {
  const request = new Request('https://gmail.test/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });
  const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined, props };
  return (await handleMcpApi(request, env, ctx)).text();
}

beforeEach(() => {
  clearAccessTokenCache();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Gmail isolation between concurrent users in one isolate', () => {
  it('lists only each user’s own linked accounts', async () => {
    const env: GmailWorkerEnv = { ...SECRETS, OAUTH_KV: new FakeKv(), GMAIL_KV: new FakeKv() };
    await seedAccounts(env.GMAIL_KV as FakeKv);
    vi.stubGlobal('fetch', labelsByToken());
    const [a, b] = await Promise.all([
      callAs(env, A, ['list_accounts', {}]),
      callAs(env, B, ['list_accounts', {}]),
    ]);
    expect(a).toContain('alice@example.com');
    expect(a).not.toContain('bob@example.com');
    expect(b).toContain('bob@example.com');
    expect(b).not.toContain('alice@example.com');
  });

  it('uses each user’s own token for the SAME linked account, under interleaved calls', async () => {
    const env: GmailWorkerEnv = { ...SECRETS, OAUTH_KV: new FakeKv(), GMAIL_KV: new FakeKv() };
    await seedAccounts(env.GMAIL_KV as FakeKv);
    vi.stubGlobal('fetch', labelsByToken());
    const users = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? A : B));
    const answers = await Promise.all(
      users.map((props) => callAs(env, props, ['list_labels', { account: 'shared@example.com' }])),
    );
    answers.forEach((text, i) => {
      const [own, other] = i % 2 === 0 ? ['alice', 'bob'] : ['bob', 'alice'];
      expect(text).toContain(`access-r-shared-for-${own}`);
      expect(text).not.toContain(`r-shared-for-${other}`);
    });
  });
});

describe('Gmail storage and cache are keyed by user', () => {
  it('derives the KV key from the user and never opens one user’s record as another', async () => {
    const kv = new FakeKv();
    await seedAccounts(kv);
    expect(ownerKey(A.owner)).not.toBe(ownerKey(B.owner));
    expect(ownerKey(A.owner)).not.toContain(A.owner);
    const aliceRecord = (await kv.get(ownerKey(A.owner))) ?? '';
    await kv.put(ownerKey(B.owner), aliceRecord);
    expect(await loadOwnerAccounts(kv, TEST_TOKEN_KEY, B.owner)).toEqual([]);
  });

  it('never serves a cached access token of user A to user B for the same account', async () => {
    const calls: RecordedCall[] = [];
    const google = fakeFetch([tokenRoute()], calls);
    const alice = { ...testDeps(google), owner: A.owner };
    const bob = { ...testDeps(google), owner: B.owner };
    expect(await getAccessToken(alice, sharedRef('r-shared-for-alice'))).toBe(
      'access-r-shared-for-alice',
    );
    expect(await getAccessToken(bob, sharedRef('r-shared-for-bob'))).toBe(
      'access-r-shared-for-bob',
    );
    expect(await getAccessToken(alice, sharedRef('r-shared-for-alice'))).toBe(
      'access-r-shared-for-alice',
    );
    expect(calls.filter((c) => c.url.includes('oauth2.googleapis.com/token'))).toHaveLength(2);
  });
});
