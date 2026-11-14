import { generateKeyPairSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { fakeFetch, signJwt, TEST_JWK, testDeps, validIdToken } from './fixtures/fake-google.js';
import {
  checkIdTokenClaims,
  decodeJwt,
  decodeJwtJson,
  fetchGoogleKey,
  idTokenProblems,
  verifyGoogleIdToken,
  verifyRs256,
} from './id-token.js';

const NOW = 1_700_000_000;
const EXPECT = { clientId: 'client-123.apps.googleusercontent.com', nonce: 'n1', now: NOW };
const GOOD = {
  iss: 'https://accounts.google.com',
  aud: EXPECT.clientId,
  exp: NOW + 100,
  nonce: 'n1',
  email: 'Owner@Example.com',
  email_verified: true,
  sub: 's1',
};
const otherKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;

describe('JWT decoding', () => {
  it('decodeJwtJson requires an object', () => {
    expect(decodeJwtJson(Buffer.from('{"a":1}').toString('base64url'))).toEqual({ a: 1 });
    expect(() => decodeJwtJson(Buffer.from('1').toString('base64url'))).toThrow(/Malformed/);
  });

  it('decodeJwt splits the three parts and rejects a bad format', () => {
    const jwt = decodeJwt(signJwt({ sub: 'x' }));
    expect(jwt.header.kid).toBe('kid-1');
    expect(jwt.payload.sub).toBe('x');
    expect(jwt.signature.length).toBe(256);
    expect(() => decodeJwt('a.b')).toThrow(/Malformed/);
  });
});

describe('id_token claims', () => {
  it('accepts correct claims and returns the email in lowercase', () => {
    expect(idTokenProblems(GOOD, EXPECT)).toEqual([]);
    expect(checkIdTokenClaims(GOOD, EXPECT)).toEqual({ sub: 's1', email: 'owner@example.com' });
    const shortIss = { ...GOOD, iss: 'accounts.google.com' };
    expect(checkIdTokenClaims(shortIss, EXPECT).email).toBe('owner@example.com');
  });

  it('points out each problem', () => {
    const bad = {
      iss: 'https://evil',
      aud: 'other',
      exp: NOW - 120,
      nonce: 'x',
      email_verified: false,
    };
    expect(idTokenProblems(bad, EXPECT)).toEqual([
      'issuer',
      'audience',
      'expiry',
      'nonce',
      'verified email',
      'sub',
    ]);
    expect(idTokenProblems({ ...GOOD, exp: 'x' }, EXPECT)).toEqual(['expiry']);
    const noEmail = { ...GOOD, email: undefined };
    expect(() => checkIdTokenClaims(noEmail, EXPECT)).toThrow(/verified email/);
  });
});

describe('signature', () => {
  it('fetchGoogleKey finds the key by kid or fails', async () => {
    const deps = testDeps(fakeFetch([]));
    expect((await fetchGoogleKey(deps, 'kid-1')).n).toBe(TEST_JWK.n);
    await expect(fetchGoogleKey(deps, 'other')).rejects.toThrow(/not found/);
    const down = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    await expect(fetchGoogleKey(down, 'kid-1')).rejects.toThrow(/HTTP 503/);
  });

  it('verifyRs256 checks the signature', async () => {
    expect(await verifyRs256(decodeJwt(signJwt({ a: 1 })), TEST_JWK)).toBe(true);
    const forged = decodeJwt(signJwt({ a: 1 }, undefined, otherKey));
    expect(await verifyRs256(forged, TEST_JWK)).toBe(false);
  });

  it('verifyGoogleIdToken validates everything and rejects a wrong algorithm, signature or nonce', async () => {
    const deps = testDeps(fakeFetch([]));
    const token = validIdToken('owner@example.com', 'n1');
    expect(await verifyGoogleIdToken(deps, token, 'n1')).toEqual({
      sub: 'sub-owner@example.com',
      email: 'owner@example.com',
    });
    const none = signJwt(GOOD, { alg: 'none' });
    await expect(verifyGoogleIdToken(deps, none, 'n1')).rejects.toThrow(/algorithm/);
    const forged = signJwt(GOOD, undefined, otherKey);
    await expect(verifyGoogleIdToken(deps, forged, 'n1')).rejects.toThrow(/signature/);
    await expect(verifyGoogleIdToken(deps, token, 'n2')).rejects.toThrow(/nonce/);
  });
});
