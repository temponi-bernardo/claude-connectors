import { beforeEach, describe, expect, it } from 'vitest';
import {
  accessTokenKey,
  clearAccessTokenCache,
  forgetAccessToken,
  getAccessToken,
  markAccountRevoked,
  relinkError,
  renewAccessToken,
} from './access-token.js';
import { aliasAccounts } from './accounts.js';
import {
  fakeFetch,
  linkedTestDeps,
  TEST_OWNER,
  TEST_TOKEN_KEY,
  testAccount,
  testDeps,
  tokenRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { loadOwnerAccounts, saveOwnerAccounts } from './token-store.js';

const REF = aliasAccounts([testAccount('owner@example.com')])[0]!;

beforeEach(() => {
  clearAccessTokenCache();
});

describe('helpers', () => {
  it('accessTokenKey separates user and account', () => {
    expect(accessTokenKey('u1', 'a@b.co')).not.toBe(accessTokenKey('u2', 'a@b.co'));
  });

  it('relinkError says to use link_account', () => {
    expect(relinkError('owner').message).toMatch(/"owner" lost access.*link_account/);
  });
});

describe('getAccessToken', () => {
  it('refreshes with the refresh token and uses memory until close to expiry', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([tokenRoute()], calls));
    expect(await getAccessToken(deps, REF)).toBe('access-r-owner');
    expect(await getAccessToken(deps, REF)).toBe('access-r-owner');
    expect(calls).toHaveLength(1);
    forgetAccessToken(TEST_OWNER, REF.account.email);
    await getAccessToken(deps, REF);
    expect(calls).toHaveLength(2);
  });

  it('does not call Google for an already revoked account', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([], calls));
    const revoked = { ...REF, account: { ...REF.account, status: 'revoked' as const } };
    await expect(getAccessToken(deps, revoked)).rejects.toThrow(/lost access/);
    expect(calls).toHaveLength(0);
  });

  it('invalid_grant marks the account revoked in the user record', async () => {
    const deps = await linkedTestDeps([]);
    const ref = { ...REF, account: { ...REF.account, refreshToken: 'revoked-1' } };
    await expect(getAccessToken(deps, ref)).rejects.toThrow(/lost access/);
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.find((a) => a.email === 'owner@example.com')?.status).toBe('revoked');
    expect(accounts.find((a) => a.email === 'music@example.com')?.status).toBe('active');
  });

  it('other Google failures propagate without revoking', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    await expect(renewAccessToken(deps, REF)).rejects.toMatchObject({ code: 'http_503' });
  });
});

describe('markAccountRevoked', () => {
  it('changes only the given account', async () => {
    const deps = testDeps(fakeFetch([]));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('owner@example.com')],
    });
    await markAccountRevoked(deps, 'owner@example.com');
    const [account] = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(account?.status).toBe('revoked');
  });
});
