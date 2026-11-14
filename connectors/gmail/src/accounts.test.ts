import { describe, expect, it } from 'vitest';
import {
  accountAlias,
  aliasAccounts,
  noAccountsError,
  requireWriteAccess,
  resolveAccounts,
  writeAccessError,
} from './accounts.js';
import { testAccount } from './fixtures/fake-google.js';

const REFS = aliasAccounts([testAccount('owner@example.com'), testAccount('music@example.com')]);

describe('aliases', () => {
  it('accountAlias uses the lowercased part before the @', () => {
    expect(accountAlias('Music.New@example.com')).toBe('music.new');
  });

  it('aliasAccounts uses the full email when the part before the @ repeats', () => {
    const refs = aliasAccounts([
      testAccount('ana@a.com'),
      testAccount('ana@b.com'),
      testAccount('bia@a.com'),
    ]);
    expect(refs.map((r) => r.alias)).toEqual(['ana@a.com', 'ana@b.com', 'bia']);
  });
});

describe('resolveAccounts', () => {
  it('resolves all, an alias or an email', () => {
    expect(resolveAccounts(REFS, 'all')).toHaveLength(2);
    expect(resolveAccounts(REFS, ' Music ')[0]?.alias).toBe('music');
    expect(resolveAccounts(REFS, 'owner@example.com')[0]?.alias).toBe('owner');
  });

  it('lists the valid ones or asks for link_account without accounts', () => {
    expect(() => resolveAccounts(REFS, 'x')).toThrow(/"owner", "music", "all"/);
    expect(() => resolveAccounts([], 'all')).toThrow(/link_account/);
    expect(noAccountsError().message).toMatch(/No Gmail account/);
  });
});

describe('write access', () => {
  it('requireWriteAccess passes with gmail.modify', () => {
    expect(() => {
      requireWriteAccess(REFS[0]!);
    }).not.toThrow();
  });

  it('a read-only linked account asks for relinking via link_account', () => {
    const scope = 'openid email https://www.googleapis.com/auth/gmail.readonly';
    const [old] = aliasAccounts([testAccount('legacy@example.com', { scope })]);
    expect(() => {
      requireWriteAccess(old!);
    }).toThrow(writeAccessError('legacy'));
    expect(writeAccessError('legacy').message).toMatch(/"legacy".*read-only.*link_account/s);
  });
});
