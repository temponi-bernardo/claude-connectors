import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EMAIL_PATTERN,
  errorMessage,
  logWarning,
  redactForLog,
  redactSecrets,
  SECRET_PATTERNS,
} from './redact.js';

/** Fake credentials in every shape the connectors handle (none is real). */
const FAKES = {
  canvas: '12345~AbCdEfGhIjKlMnOpQrStUvWxYz0123456789',
  googleAccess: 'ya29.a0AfB_fakeAccessTokenValue-123',
  googleRefresh: '1//0gFakeRefreshTokenValue_abc-123',
  jwt: ['eyJhbGciOiJSUzI1NiJ9', 'eyJzdWIiOiJmYWtlIn0', 'c2lnbmF0dXJl'].join('.'),
  seal: 'A'.repeat(40) + 'b_c-'.repeat(15),
  clientSecret: 'GOCSPX-fakeClientSecretValue',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('redactSecrets', () => {
  it('removes Bearer headers, Canvas and Google tokens, JWTs and long seals', () => {
    const text = `Authorization: Bearer ${FAKES.canvas}; token ${FAKES.canvas}; ${FAKES.googleAccess} ${FAKES.googleRefresh} ${FAKES.jwt} ${FAKES.seal}`;
    const out = redactSecrets(text);
    for (const secret of [
      FAKES.canvas,
      FAKES.googleAccess,
      FAKES.googleRefresh,
      FAKES.jwt,
      FAKES.seal,
    ]) {
      expect(out).not.toContain(secret);
    }
    expect(out).toContain('Bearer [redacted]');
    expect(out).toContain('[redacted-canvas-token]');
  });

  it('removes the value of access_token, refresh_token, client_secret and id_token fields', () => {
    const json = `{"access_token":"abc123","refresh_token": "def456","client_secret":"${FAKES.clientSecret}"}`;
    const form = 'id_token=xyz789&grant_type=refresh_token';
    const out = redactSecrets(`${json} ${form}`);
    for (const value of ['abc123', 'def456', FAKES.clientSecret, 'xyz789']) {
      expect(out).not.toContain(value);
    }
    expect(out).toContain('grant_type=refresh_token');
  });

  it('keeps ordinary text and emails (the user sees their own errors)', () => {
    const text = 'Canvas 404 on GET /courses/12: not found for me@example.com';
    expect(redactSecrets(text)).toBe(text);
    expect(SECRET_PATTERNS.length).toBeGreaterThan(0);
  });
});

describe('redactForLog', () => {
  it('also masks email addresses, which logs must not keep', () => {
    expect(redactForLog(`friend@example.com sent Bearer ${FAKES.canvas}`)).toBe(
      '[email] sent Bearer [redacted]',
    );
    expect('a@b.co'.replace(EMAIL_PATTERN, 'x')).toBe('x');
  });
});

describe('errorMessage and logWarning', () => {
  it('reads Error messages and other values', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom');
    expect(errorMessage(42)).toBe('42');
  });

  it('logs only the redacted message, never the token or the email', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    logWarning('Renew failed:', new Error(`refused ${FAKES.canvas} for friend@example.com`));
    expect(warn).toHaveBeenCalledWith(
      'Renew failed:',
      'refused [redacted-canvas-token] for [email]',
    );
  });
});
