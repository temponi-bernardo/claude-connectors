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

const REF = aliasAccounts([testAccount('dono@example.com')])[0]!;

beforeEach(() => {
  clearAccessTokenCache();
});

describe('auxiliares', () => {
  it('accessTokenKey separa usuário e conta', () => {
    expect(accessTokenKey('u1', 'a@b.co')).not.toBe(accessTokenKey('u2', 'a@b.co'));
  });

  it('relinkError manda usar link_account', () => {
    expect(relinkError('dono').message).toMatch(/"dono" perdeu o acesso.*link_account/);
  });
});

describe('getAccessToken', () => {
  it('renova pelo refresh token e usa a memória até perto de vencer', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([tokenRoute()], calls));
    expect(await getAccessToken(deps, REF)).toBe('access-r-dono');
    expect(await getAccessToken(deps, REF)).toBe('access-r-dono');
    expect(calls).toHaveLength(1);
    forgetAccessToken(TEST_OWNER, REF.account.email);
    await getAccessToken(deps, REF);
    expect(calls).toHaveLength(2);
  });

  it('não chama o Google para conta já revogada', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([], calls));
    const revoked = { ...REF, account: { ...REF.account, status: 'revoked' as const } };
    await expect(getAccessToken(deps, revoked)).rejects.toThrow(/perdeu o acesso/);
    expect(calls).toHaveLength(0);
  });

  it('invalid_grant marca a conta como revogada no registro do usuário', async () => {
    const deps = await linkedTestDeps([]);
    const ref = { ...REF, account: { ...REF.account, refreshToken: 'revogado-1' } };
    await expect(getAccessToken(deps, ref)).rejects.toThrow(/perdeu o acesso/);
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.find((a) => a.email === 'dono@example.com')?.status).toBe('revoked');
    expect(accounts.find((a) => a.email === 'musica@example.com')?.status).toBe('active');
  });

  it('outras falhas do Google passam adiante sem revogar', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    await expect(renewAccessToken(deps, REF)).rejects.toMatchObject({ code: 'http_503' });
  });
});

describe('markAccountRevoked', () => {
  it('só muda a conta indicada', async () => {
    const deps = testDeps(fakeFetch([]));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('dono@example.com')],
    });
    await markAccountRevoked(deps, 'dono@example.com');
    const [account] = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(account?.status).toBe('revoked');
  });
});
