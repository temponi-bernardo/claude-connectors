import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAccessTokenCache,
  forgetAccessToken,
  getAccessToken,
  linkUrl,
  relinkError,
  renewAccessToken,
  requireLinkedAccount,
} from './access-token.js';
import {
  fakeFetch,
  TEST_ACCOUNTS,
  TEST_TOKEN_KEY,
  testDeps,
  tokenRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { loadLinkedAccount, saveLinkedAccount, type LinkedAccount } from './token-store.js';

const OWNER = TEST_ACCOUNTS[0]!;
const LINKED: LinkedAccount = {
  email: OWNER.email,
  refreshToken: 'r1',
  scope: 's',
  linkedAt: 'agora',
  status: 'active',
};

beforeEach(() => {
  clearAccessTokenCache();
});

describe('mensagens de vínculo', () => {
  it('linkUrl e relinkError dizem o que fazer', () => {
    expect(linkUrl('https://w')).toBe('https://w/accounts/link');
    expect(relinkError(OWNER, 'https://w', false).message).toMatch(
      /"dono" não está vinculada\. Abra https:\/\/w\/accounts\/link/,
    );
    expect(relinkError(OWNER, 'https://w', true).message).toMatch(/perdeu o acesso/);
  });
});

describe('requireLinkedAccount', () => {
  it('exige vínculo ativo', async () => {
    const deps = testDeps(fakeFetch([]));
    await expect(requireLinkedAccount(deps, OWNER)).rejects.toThrow(/não está vinculada/);
    await saveLinkedAccount(deps.kv, TEST_TOKEN_KEY, { ...LINKED, status: 'revoked' });
    await expect(requireLinkedAccount(deps, OWNER)).rejects.toThrow(/perdeu o acesso/);
  });
});

describe('getAccessToken', () => {
  it('renova pelo refresh token e usa a memória até perto de vencer', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([tokenRoute()], calls));
    await saveLinkedAccount(deps.kv, TEST_TOKEN_KEY, LINKED);
    expect(await getAccessToken(deps, OWNER)).toBe('access-r1');
    expect(await getAccessToken(deps, OWNER)).toBe('access-r1');
    expect(calls).toHaveLength(1);
    forgetAccessToken(OWNER.email);
    await getAccessToken(deps, OWNER);
    expect(calls).toHaveLength(2);
  });

  it('invalid_grant marca a conta como revogada', async () => {
    const deps = testDeps(fakeFetch([tokenRoute()]));
    await saveLinkedAccount(deps.kv, TEST_TOKEN_KEY, { ...LINKED, refreshToken: 'revogado-1' });
    await expect(getAccessToken(deps, OWNER)).rejects.toThrow(/perdeu o acesso/);
    expect((await loadLinkedAccount(deps.kv, TEST_TOKEN_KEY, OWNER))?.status).toBe('revoked');
  });

  it('outras falhas do Google passam adiante sem revogar', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    await expect(renewAccessToken(deps, OWNER, LINKED)).rejects.toMatchObject({
      code: 'http_503',
    });
  });
});
