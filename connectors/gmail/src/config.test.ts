import { describe, expect, it } from 'vitest';
import {
  GMAIL_SCOPES,
  hasModifyScope,
  isEmailAddress,
  isEmailAllowed,
  parseAllowedEmails,
  readConsentSecret,
  readGmailSettings,
  requiredSecret,
} from './config.js';
import { TEST_SETTINGS } from './fixtures/fake-google.js';

const KEY = Buffer.alloc(32, 1).toString('base64');
const ENV = {
  GOOGLE_CLIENT_ID: 'id',
  GOOGLE_CLIENT_SECRET: 'secret',
  TOKEN_ENC_KEY: KEY,
  CONSENT_SECRET: 'x'.repeat(32),
};

describe('isEmailAddress', () => {
  it('reconhece e-mails simples', () => {
    expect(isEmailAddress('a@b.co')).toBe(true);
    expect(isEmailAddress('a b@c.d')).toBe(false);
    expect(isEmailAddress('semarroba')).toBe(false);
  });
});

describe('parseAllowedEmails', () => {
  it('sem valor é modo público (nulo)', () => {
    expect(parseAllowedEmails(null)).toBeNull();
    expect(parseAllowedEmails(' , ')).toBeNull();
  });

  it('normaliza a lista do modo privado e recusa item inválido', () => {
    expect(parseAllowedEmails(' Dono@Example.com , musica@example.com ')).toEqual([
      'dono@example.com',
      'musica@example.com',
    ]);
    expect(() => parseAllowedEmails('nao-e-email')).toThrow(/não é e-mail/);
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

  it('readGmailSettings funciona sem ALLOWED_EMAILS e valida a chave de cifra', () => {
    const settings = readGmailSettings(ENV);
    expect(settings.allowedEmails).toBeNull();
    expect(settings.tokenKey.length).toBe(32);
    const restricted = readGmailSettings({ ...ENV, ALLOWED_EMAILS: 'a@b.co' });
    expect(restricted.allowedEmails).toEqual(['a@b.co']);
    expect(() => readGmailSettings({ ...ENV, TOKEN_ENC_KEY: 'YQ==' })).toThrow(/TOKEN_ENC_KEY/);
  });
});

describe('isEmailAllowed', () => {
  it('libera qualquer conta no modo público e só as listadas no privado', () => {
    expect(isEmailAllowed(TEST_SETTINGS, 'qualquer@example.com')).toBe(true);
    const restricted = { ...TEST_SETTINGS, allowedEmails: ['dono@example.com'] };
    expect(isEmailAllowed(restricted, 'DONO@example.com')).toBe(true);
    expect(isEmailAllowed(restricted, 'outro@example.com')).toBe(false);
  });
});

describe('escopos', () => {
  it('pede só identidade e gmail.modify (sem readonly nem exclusão definitiva)', () => {
    expect(GMAIL_SCOPES).toEqual([
      'openid',
      'email',
      'https://www.googleapis.com/auth/gmail.modify',
    ]);
  });

  it('hasModifyScope reconhece gmail.modify e recusa os outros', () => {
    expect(hasModifyScope('openid email https://www.googleapis.com/auth/gmail.modify')).toBe(true);
    expect(hasModifyScope('openid https://www.googleapis.com/auth/gmail.readonly')).toBe(false);
    expect(hasModifyScope('https://www.googleapis.com/auth/gmail.modify.extra')).toBe(false);
    expect(hasModifyScope('')).toBe(false);
  });
});
