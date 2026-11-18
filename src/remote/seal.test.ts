import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  audienceMatches,
  LEGACY_AUDLESS_UNTIL,
  openSealed,
  parseSealKey,
  sealPayload,
  unsealPayload,
} from './seal.js';

const KEY = randomBytes(32);

describe('parseSealKey', () => {
  it('accepts 32 bytes in base64 or base64url', () => {
    expect(parseSealKey(KEY.toString('base64')).equals(KEY)).toBe(true);
    expect(parseSealKey(KEY.toString('base64url')).equals(KEY)).toBe(true);
  });

  it('rejects a missing or wrong-size key, saying how to generate one', () => {
    expect(() => parseSealKey(null)).toThrow(/SEAL_KEY/);
    expect(() => parseSealKey(randomBytes(16).toString('base64'))).toThrow(/32 bytes/);
  });

  it('names the given variable in the error', () => {
    expect(() => parseSealKey(null, 'TOKEN_ENC_KEY')).toThrow(/TOKEN_ENC_KEY/);
    expect(() => parseSealKey('YQ==', 'TOKEN_ENC_KEY')).toThrow(/TOKEN_ENC_KEY must/);
  });
});

describe('sealPayload and unsealPayload', () => {
  it('opens what it sealed, with a different IV for each seal', () => {
    const a = sealPayload({ typ: 'x', n: 1 }, KEY);
    const b = sealPayload({ typ: 'x', n: 1 }, KEY);
    expect(a).not.toBe(b);
    expect(unsealPayload(a, KEY)).toEqual({ typ: 'x', n: 1 });
  });

  it('returns null for another key, tampered text or garbage', () => {
    const sealed = sealPayload({ typ: 'x' }, KEY);
    expect(unsealPayload(sealed, randomBytes(32))).toBeNull();
    expect(unsealPayload(`${sealed.slice(0, -2)}AA`, KEY)).toBeNull();
    expect(unsealPayload('abc', KEY)).toBeNull();
    expect(unsealPayload(sealPayload('text', KEY), KEY)).toBeNull();
  });
});

describe('openSealed', () => {
  const now = 1_000;

  it('opens only the requested type and within its validity', () => {
    const sealed = sealPayload({ typ: 'code', exp: now + 1, v: 'ok' }, KEY);
    expect(openSealed(sealed, KEY, { typ: 'code', now })).toEqual({
      typ: 'code',
      exp: now + 1,
      v: 'ok',
    });
    expect(openSealed(sealed, KEY, { typ: 'access', now })).toBeNull();
    expect(openSealed(sealed, KEY, { typ: 'code', now: now + 1 })).toBeNull();
  });

  it('rejects a seal without a numeric expiry', () => {
    expect(openSealed(sealPayload({ typ: 'code' }, KEY), KEY, { typ: 'code', now })).toBeNull();
  });
});

describe('audienceMatches', () => {
  it('requires the expected aud, lets an aud-less seal pass only before the cutoff, ignores aud when none expected', () => {
    const expected = { typ: 'x', now: 10, aud: 'https://a.dev' };
    expect(audienceMatches({ aud: 'https://a.dev' }, expected)).toBe(true);
    expect(audienceMatches({ aud: 'https://b.dev' }, expected)).toBe(false);
    expect(audienceMatches({}, expected)).toBe(true);
    expect(audienceMatches({}, { ...expected, now: LEGACY_AUDLESS_UNTIL })).toBe(false);
    expect(audienceMatches({ aud: 'https://b.dev' }, { typ: 'x', now: 10 })).toBe(true);
  });

  it('makes openSealed refuse a seal for another audience', () => {
    const sealed = sealPayload({ typ: 'x', aud: 'https://a.dev', exp: 99 }, KEY);
    expect(openSealed(sealed, KEY, { typ: 'x', now: 1, aud: 'https://a.dev' })).not.toBeNull();
    expect(openSealed(sealed, KEY, { typ: 'x', now: 1, aud: 'https://b.dev' })).toBeNull();
  });
});
