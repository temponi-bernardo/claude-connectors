import { describe, expect, it } from 'vitest';
import { sealPayload } from '../../../src/remote/seal.js';
import { FakeKv } from './fixtures/fake-kv.js';
import { TEST_ACCOUNTS, TEST_TOKEN_KEY } from './fixtures/fake-google.js';
import {
  accountKey,
  loadLinkedAccount,
  openLinkedAccount,
  saveLinkedAccount,
  sealLinkedAccount,
  type LinkedAccount,
} from './token-store.js';

const ACCOUNT: LinkedAccount = {
  email: 'dono@example.com',
  refreshToken: 'refresh-1',
  scope: 'openid email',
  linkedAt: '2026-11-14T00:00:00.000Z',
  status: 'active',
};

describe('selo da conta vinculada', () => {
  it('accountKey usa o apelido', () => {
    expect(accountKey('dono')).toBe('account:dono');
  });

  it('sela sem expor o refresh token e abre com o e-mail certo', () => {
    const sealed = sealLinkedAccount(ACCOUNT, TEST_TOKEN_KEY);
    expect(sealed).not.toContain('refresh-1');
    expect(openLinkedAccount(sealed, TEST_TOKEN_KEY, ACCOUNT.email)).toEqual(ACCOUNT);
  });

  it('não abre com outro e-mail, outra chave ou conteúdo incompleto', () => {
    const sealed = sealLinkedAccount(ACCOUNT, TEST_TOKEN_KEY);
    expect(openLinkedAccount(sealed, TEST_TOKEN_KEY, 'musica@example.com')).toBeNull();
    expect(openLinkedAccount(sealed, Buffer.alloc(32, 9), ACCOUNT.email)).toBeNull();
    const partial = sealPayload(
      { typ: 'gmail_account', exp: 4e9, email: ACCOUNT.email },
      TEST_TOKEN_KEY,
    );
    expect(openLinkedAccount(partial, TEST_TOKEN_KEY, ACCOUNT.email)).toBeNull();
  });

  it('usa padrões para campos ausentes e reconhece revogação', () => {
    const minimal = sealPayload(
      {
        typ: 'gmail_account',
        exp: 4e9,
        email: ACCOUNT.email,
        refreshToken: 'r',
        status: 'revoked',
      },
      TEST_TOKEN_KEY,
    );
    expect(openLinkedAccount(minimal, TEST_TOKEN_KEY, ACCOUNT.email)).toMatchObject({
      scope: '',
      linkedAt: '',
      status: 'revoked',
    });
  });
});

describe('saveLinkedAccount e loadLinkedAccount', () => {
  it('grava pelo apelido e lê de volta; sem vínculo devolve nulo', async () => {
    const kv = new FakeKv();
    const [bf, music] = TEST_ACCOUNTS;
    await saveLinkedAccount(kv, TEST_TOKEN_KEY, ACCOUNT);
    expect([...kv.entries.keys()]).toEqual(['account:dono']);
    expect(await loadLinkedAccount(kv, TEST_TOKEN_KEY, bf!)).toEqual(ACCOUNT);
    expect(await loadLinkedAccount(kv, TEST_TOKEN_KEY, music!)).toBeNull();
  });
});
