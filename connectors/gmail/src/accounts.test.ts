import { describe, expect, it } from 'vitest';
import { accountAlias, aliasAccounts, noAccountsError, resolveAccounts } from './accounts.js';
import { testAccount } from './fixtures/fake-google.js';

const REFS = aliasAccounts([testAccount('dono@example.com'), testAccount('musica@example.com')]);

describe('apelidos', () => {
  it('accountAlias usa a parte antes do @ em minúsculas', () => {
    expect(accountAlias('Musica.Nova@example.com')).toBe('musica.nova');
  });

  it('aliasAccounts usa o e-mail inteiro quando a parte antes do @ se repete', () => {
    const refs = aliasAccounts([
      testAccount('ana@a.com'),
      testAccount('ana@b.com'),
      testAccount('bia@a.com'),
    ]);
    expect(refs.map((r) => r.alias)).toEqual(['ana@a.com', 'ana@b.com', 'bia']);
  });
});

describe('resolveAccounts', () => {
  it('resolve all, apelido ou e-mail', () => {
    expect(resolveAccounts(REFS, 'all')).toHaveLength(2);
    expect(resolveAccounts(REFS, ' Musica ')[0]?.alias).toBe('musica');
    expect(resolveAccounts(REFS, 'dono@example.com')[0]?.alias).toBe('dono');
  });

  it('explica os válidos ou pede link_account sem contas', () => {
    expect(() => resolveAccounts(REFS, 'x')).toThrow(/"dono", "musica", "all"/);
    expect(() => resolveAccounts([], 'all')).toThrow(/link_account/);
    expect(noAccountsError().message).toMatch(/Nenhuma conta/);
  });
});
