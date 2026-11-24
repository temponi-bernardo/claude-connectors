import { describe, expect, it } from 'vitest';
import {
  GMAIL_SCOPES,
  hasModifyScope,
  isEmailAddress,
  isEmailAllowed,
  parseAllowedEmails,
  readGmailSettings,
} from './config.js';
import { readConsentSecret, requiredSecret } from '../../../src/remote/worker-kit.js';
import { TEST_SETTINGS } from './fixtures/fake-google.js';

const KEY = Buffer.alloc(32, 1).toString('base64');
const ENV = {
  GOOGLE_CLIENT_ID: 'id',
  GOOGLE_CLIENT_SECRET: 'secret',
  TOKEN_ENC_KEY: KEY,
  CONSENT_SECRET: 'x'.repeat(32),
};

describe('isEmailAddress', () => {
  it('recognizes simple emails', () => {
    expect(isEmailAddress('a@b.co')).toBe(true);
    expect(isEmailAddress('a b@c.d')).toBe(false);
    expect(isEmailAddress('noatsign')).toBe(false);
  });
});

describe('parseAllowedEmails', () => {
  it('no value means public mode (null)', () => {
    expect(parseAllowedEmails(null)).toBeNull();
    expect(parseAllowedEmails(' , ')).toBeNull();
  });

  it('normalizes the private-mode list and rejects an invalid item', () => {
    expect(parseAllowedEmails(' Owner@Example.com , music@example.com ')).toEqual([
      'owner@example.com',
      'music@example.com',
    ]);
    expect(() => parseAllowedEmails('not-an-email')).toThrow(/not an email/);
  });
});

describe('secrets', () => {
  it('requiredSecret reads or explains how to set it', () => {
    expect(requiredSecret(ENV, 'GOOGLE_CLIENT_ID')).toBe('id');
    expect(() => requiredSecret({}, 'GOOGLE_CLIENT_ID')).toThrow(
      /wrangler secret put GOOGLE_CLIENT_ID/,
    );
  });

  it('readConsentSecret requires 32 characters', () => {
    expect(readConsentSecret(ENV)).toHaveLength(32);
    expect(() => readConsentSecret({ CONSENT_SECRET: 'short' })).toThrow(/32/);
  });

  it('readGmailSettings works without ALLOWED_EMAILS and validates the encryption key', () => {
    const settings = readGmailSettings(ENV);
    expect(settings.allowedEmails).toBeNull();
    expect(settings.tokenKey.length).toBe(32);
    const restricted = readGmailSettings({ ...ENV, ALLOWED_EMAILS: 'a@b.co' });
    expect(restricted.allowedEmails).toEqual(['a@b.co']);
    expect(() => readGmailSettings({ ...ENV, TOKEN_ENC_KEY: 'YQ==' })).toThrow(/TOKEN_ENC_KEY/);
  });
});

describe('isEmailAllowed', () => {
  it('allows any account in public mode and only the listed ones in private mode', () => {
    expect(isEmailAllowed(TEST_SETTINGS, 'anyone@example.com')).toBe(true);
    const restricted = { ...TEST_SETTINGS, allowedEmails: ['owner@example.com'] };
    expect(isEmailAllowed(restricted, 'OWNER@example.com')).toBe(true);
    expect(isEmailAllowed(restricted, 'other@example.com')).toBe(false);
  });
});

describe('scopes', () => {
  it('asks only for identity and gmail.modify (no readonly, no permanent deletion)', () => {
    expect(GMAIL_SCOPES).toEqual([
      'openid',
      'email',
      'https://www.googleapis.com/auth/gmail.modify',
    ]);
  });

  it('hasModifyScope recognizes gmail.modify and rejects the others', () => {
    expect(hasModifyScope('openid email https://www.googleapis.com/auth/gmail.modify')).toBe(true);
    expect(hasModifyScope('openid https://www.googleapis.com/auth/gmail.readonly')).toBe(false);
    expect(hasModifyScope('https://www.googleapis.com/auth/gmail.modify.extra')).toBe(false);
    expect(hasModifyScope('')).toBe(false);
  });
});
