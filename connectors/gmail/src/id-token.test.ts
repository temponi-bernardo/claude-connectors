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
  email: 'Dono@Example.com',
  email_verified: true,
};
const otherKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;

describe('decodificação do JWT', () => {
  it('decodeJwtJson exige objeto', () => {
    expect(decodeJwtJson(Buffer.from('{"a":1}').toString('base64url'))).toEqual({ a: 1 });
    expect(() => decodeJwtJson(Buffer.from('1').toString('base64url'))).toThrow(/malformado/);
  });

  it('decodeJwt separa as três partes e recusa formato errado', () => {
    const jwt = decodeJwt(signJwt({ sub: 'x' }));
    expect(jwt.header.kid).toBe('kid-1');
    expect(jwt.payload.sub).toBe('x');
    expect(jwt.signature.length).toBe(256);
    expect(() => decodeJwt('a.b')).toThrow(/malformado/);
  });
});

describe('claims do id_token', () => {
  it('aceita claims corretas e devolve o e-mail em minúsculas', () => {
    expect(idTokenProblems(GOOD, EXPECT)).toEqual([]);
    expect(checkIdTokenClaims(GOOD, EXPECT)).toBe('dono@example.com');
    const shortIss = { ...GOOD, iss: 'accounts.google.com' };
    expect(checkIdTokenClaims(shortIss, EXPECT)).toBe('dono@example.com');
  });

  it('aponta cada problema', () => {
    const bad = {
      iss: 'https://evil',
      aud: 'outro',
      exp: NOW - 120,
      nonce: 'x',
      email_verified: false,
    };
    expect(idTokenProblems(bad, EXPECT)).toEqual([
      'emissor',
      'audiência',
      'validade',
      'nonce',
      'e-mail verificado',
    ]);
    expect(idTokenProblems({ ...GOOD, exp: 'x' }, EXPECT)).toEqual(['validade']);
    const noEmail = { ...GOOD, email: undefined };
    expect(() => checkIdTokenClaims(noEmail, EXPECT)).toThrow(/e-mail verificado/);
  });
});

describe('assinatura', () => {
  it('fetchGoogleKey acha a chave pelo kid ou falha', async () => {
    const deps = testDeps(fakeFetch([]));
    expect((await fetchGoogleKey(deps, 'kid-1')).n).toBe(TEST_JWK.n);
    await expect(fetchGoogleKey(deps, 'outro')).rejects.toThrow(/não encontrada/);
    const down = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    await expect(fetchGoogleKey(down, 'kid-1')).rejects.toThrow(/HTTP 503/);
  });

  it('verifyRs256 confere a assinatura', async () => {
    expect(await verifyRs256(decodeJwt(signJwt({ a: 1 })), TEST_JWK)).toBe(true);
    const forged = decodeJwt(signJwt({ a: 1 }, undefined, otherKey));
    expect(await verifyRs256(forged, TEST_JWK)).toBe(false);
  });

  it('verifyGoogleIdToken valida tudo e recusa algoritmo, assinatura ou nonce errados', async () => {
    const deps = testDeps(fakeFetch([]));
    const token = validIdToken('dono@example.com', 'n1');
    expect(await verifyGoogleIdToken(deps, token, 'n1')).toBe('dono@example.com');
    const none = signJwt(GOOD, { alg: 'none' });
    await expect(verifyGoogleIdToken(deps, none, 'n1')).rejects.toThrow(/algoritmo/);
    const forged = signJwt(GOOD, undefined, otherKey);
    await expect(verifyGoogleIdToken(deps, forged, 'n1')).rejects.toThrow(/Assinatura/);
    await expect(verifyGoogleIdToken(deps, token, 'n2')).rejects.toThrow(/nonce/);
  });
});
