import { describe, expect, it } from 'vitest';
import { FakeKv } from '../../../src/remote/fixtures/fake-kv.js';
import {
  deleteAccount,
  loadAccount,
  maskCredential,
  refreshExpiryIso,
  REFRESH_TOKEN_LIFETIME_MS,
  saveAccount,
  toSpotifyAccount,
} from './account-store.js';
import { TEST_ACCOUNT } from './fixtures/fake-spotify.js';

function deps(): { kv: FakeKv; tokenKey: Buffer; now: () => number } {
  return { kv: new FakeKv(), tokenKey: Buffer.alloc(32, 2), now: () => 0 };
}

describe('account store', () => {
  it('saves, loads and deletes the user’s account', async () => {
    const d = deps();
    expect(await loadAccount(d, 'o')).toBeNull();
    await saveAccount(d, 'o', TEST_ACCOUNT);
    expect(await loadAccount(d, 'o')).toEqual(TEST_ACCOUNT);
    expect(await loadAccount(d, 'other')).toBeNull();
    await deleteAccount(d, 'o');
    expect(await loadAccount(d, 'o')).toBeNull();
  });

  it('toSpotifyAccount rejects incomplete records and fills optional fields', () => {
    expect(toSpotifyAccount(null)).toBeNull();
    expect(toSpotifyAccount({ ...TEST_ACCOUNT, refreshToken: 1 })).toBeNull();
    expect(toSpotifyAccount({ ...TEST_ACCOUNT, authorizedAt: 'x' })).toBeNull();
    const rest: Record<string, unknown> = { ...TEST_ACCOUNT };
    delete rest.displayName;
    delete rest.scope;
    expect(toSpotifyAccount(rest)).toMatchObject({ displayName: '', scope: '' });
  });

  it('refreshExpiryIso is six months after the authorization', () => {
    const account = { ...TEST_ACCOUNT, authorizedAt: 0 };
    expect(refreshExpiryIso(account)).toBe(new Date(REFRESH_TOKEN_LIFETIME_MS).toISOString());
  });

  it('maskCredential keeps 4 characters', () => {
    expect(maskCredential('abcdef123')).toBe('abcd…');
  });
});
