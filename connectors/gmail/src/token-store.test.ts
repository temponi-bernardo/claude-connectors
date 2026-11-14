import { describe, expect, it } from 'vitest';
import { sealPayload } from '../../../src/remote/seal.js';
import { FakeKv } from './fixtures/fake-kv.js';
import { TEST_OWNER, TEST_TOKEN_KEY, testAccount } from './fixtures/fake-google.js';
import {
  loadOwnerAccounts,
  MAX_LINKED_ACCOUNTS,
  openOwnerAccounts,
  ownerKey,
  saveOwnerAccounts,
  sealOwnerAccounts,
  sha256Hex,
  toLinkedAccount,
  upsertAccount,
} from './token-store.js';

const ACCOUNT = testAccount('owner@example.com');

describe('keys', () => {
  it('sha256Hex and ownerKey keep only the user hash', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(ownerKey('sub-1')).toBe(`owner:${sha256Hex('sub-1')}`);
    expect(ownerKey('sub-1')).not.toContain('sub-1');
  });
});

describe('user record seal', () => {
  it('seals without exposing the refresh token and opens only for the same user', () => {
    const sealed = sealOwnerAccounts(TEST_OWNER, [ACCOUNT], TEST_TOKEN_KEY);
    expect(sealed).not.toContain(ACCOUNT.refreshToken);
    expect(openOwnerAccounts(sealed, TEST_TOKEN_KEY, TEST_OWNER)).toEqual([ACCOUNT]);
    expect(openOwnerAccounts(sealed, TEST_TOKEN_KEY, 'other-user')).toEqual([]);
    expect(openOwnerAccounts(sealed, Buffer.alloc(32, 9), TEST_OWNER)).toEqual([]);
  });

  it('drops incomplete items and applies defaults', () => {
    const sealed = sealPayload(
      {
        typ: 'gmail_owner',
        exp: 4e9,
        owner: TEST_OWNER,
        accounts: [{ email: 'a@b.co', refreshToken: 'r', status: 'revoked' }, { email: 'x' }, 5],
      },
      TEST_TOKEN_KEY,
    );
    expect(openOwnerAccounts(sealed, TEST_TOKEN_KEY, TEST_OWNER)).toEqual([
      { email: 'a@b.co', refreshToken: 'r', scope: '', linkedAt: '', status: 'revoked' },
    ]);
    const noList = sealPayload({ typ: 'gmail_owner', exp: 4e9, owner: TEST_OWNER }, TEST_TOKEN_KEY);
    expect(openOwnerAccounts(noList, TEST_TOKEN_KEY, TEST_OWNER)).toEqual([]);
    expect(toLinkedAccount(null)).toBeNull();
  });
});

describe('saveOwnerAccounts and loadOwnerAccounts', () => {
  it('stores, reads and deletes when no account is left', async () => {
    const kv = new FakeKv();
    await saveOwnerAccounts(kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts: [ACCOUNT] });
    expect(await loadOwnerAccounts(kv, TEST_TOKEN_KEY, TEST_OWNER)).toEqual([ACCOUNT]);
    expect(await loadOwnerAccounts(kv, TEST_TOKEN_KEY, 'other')).toEqual([]);
    await saveOwnerAccounts(kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts: [] });
    expect(kv.entries.size).toBe(0);
  });
});

describe('upsertAccount', () => {
  it('replaces the account with the same email and adds new ones', () => {
    const renewed = { ...ACCOUNT, refreshToken: 'new' };
    expect(upsertAccount([ACCOUNT], renewed)).toEqual([renewed]);
    expect(upsertAccount([ACCOUNT], testAccount('b@c.d'))).toHaveLength(2);
  });

  it('refuses to exceed the account limit', () => {
    const full = Array.from({ length: MAX_LINKED_ACCOUNTS }, (_, i) => testAccount(`c${i}@x.io`));
    expect(() => upsertAccount(full, testAccount('new@x.io'))).toThrow(/Limit of 10/);
    expect(upsertAccount(full, { ...full[0]!, refreshToken: 'r2' })).toHaveLength(10);
  });
});
