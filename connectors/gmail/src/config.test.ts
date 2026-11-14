import { describe, expect, it } from 'vitest';
import {
  accountAlias,
  findAllowedAccount,
  isEmailAddress,
  parseAllowedEmails,
  readConsentSecret,
  readGmailSettings,
  requiredSecret,
  resolveAccounts,
} from './config.js';
import { TEST_ACCOUNTS } from './fixtures/fake-google.js';

const KEY = Buffer.alloc(32, 1).toString('base64');
const ENV = {
  GOOGLE_CLIENT_ID: 'id',
  GOOGLE_CLIENT_SECRET: 'secret',
  TOKEN_ENC_KEY: KEY,
  ALLOWED_EMAILS: ' Dono@Example.com , musica@example.com ',
  CONSENT_SECRET: 'x'.repeat(32),
};

describe('accountAlias e isEmailAddress', () => {
  it('usa a parte antes do @ em minúsculas', () => {
    expect(accountAlias('Musica.Nova@example.com')).toBe('musica.nova');
  });

  it('reconhece e-mails simples', () => {
    expect(isEmailAddress('a@b.co')).toBe(true);
    expect(isEmailAddress('a b@c.d')).toBe(false);
    expect(isEmailAddress('semarroba')).toBe(false);
  });
});

describe('parseAllowedEmails', () => {
  it('normaliza e gera apelidos', () => {
    expect(parseAllowedEmails(ENV.ALLOWED_EMAILS)).toEqual(TEST_ACCOUNTS);
  });

  it('exige ao menos um e-mail válido', () => {
    expect(() => parseAllowedEmails(null)).toThrow(/ALLOWED_EMAILS/);
    expect(() => parseAllowedEmails(' , ')).toThrow(/ALLOWED_EMAILS/);
    expect(() => parseAllowedEmails('nao-e-email')).toThrow(/não é e-mail/);
  });

  it('recusa apelidos repetidos ou "all"', () => {
    expect(() => parseAllowedEmails('a@x.com,a@y.com')).toThrow(/única/);
    expect(() => parseAllowedEmails('all@x.com')).toThrow(/all/);
  });
});

describe('secrets', () => {
  it('requiredSecret lê ou explica como definir', () => {
    expect(requiredSecret(ENV, 'GOOGLE_CLIENT_ID')).toBe('id');
    expect(() => requiredSecret({}, 'GOOGLE_CLIENT_ID')).toThrow(
      /wrangler secret put GOOGLE_CLIENT_ID/,
    );
  });

  it('readConsentSecret exige 32 caracteres', () => {
    expect(readConsentSecret(ENV)).toHaveLength(32);
    expect(() => readConsentSecret({ CONSENT_SECRET: 'curto' })).toThrow(/32/);
  });

  it('readGmailSettings monta tudo e valida a chave de cifra', () => {
    const settings = readGmailSettings(ENV);
    expect(settings.accounts).toEqual(TEST_ACCOUNTS);
    expect(settings.tokenKey.length).toBe(32);
    expect(() => readGmailSettings({ ...ENV, TOKEN_ENC_KEY: 'YQ==' })).toThrow(/TOKEN_ENC_KEY/);
  });
});

describe('findAllowedAccount e resolveAccounts', () => {
  it('acha a conta pelo e-mail sem diferenciar maiúsculas', () => {
    expect(findAllowedAccount(TEST_ACCOUNTS, 'DONO@example.com')?.alias).toBe('dono');
    expect(findAllowedAccount(TEST_ACCOUNTS, 'outro@gmail.com')).toBeNull();
  });

  it('resolve "all", um apelido ou explica os válidos', () => {
    expect(resolveAccounts(TEST_ACCOUNTS, 'all')).toHaveLength(2);
    expect(resolveAccounts(TEST_ACCOUNTS, ' Musica ')).toEqual([TEST_ACCOUNTS[1]]);
    expect(() => resolveAccounts(TEST_ACCOUNTS, 'x')).toThrow(/"dono", "musica", "all"/);
  });
});
