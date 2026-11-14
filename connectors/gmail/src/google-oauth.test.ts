import { describe, expect, it } from 'vitest';
import { fakeFetch, testDeps, tokenRoute, type RecordedCall } from './fixtures/fake-google.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleErrorCode,
  GoogleTokenError,
  googleRedirectUri,
  parseGoogleTokens,
  postGoogleToken,
  randomToken,
  refreshGoogleToken,
} from './google-oauth.js';

const BASE = {
  clientId: 'cid',
  redirectUri: 'https://w.test/google/callback',
  scopes: ['openid', 'email'],
  state: 'st',
  codeChallenge: 'ch',
  nonce: 'no',
};

describe('URL de autorização', () => {
  it('googleRedirectUri aponta para /google/callback', () => {
    expect(googleRedirectUri('https://w.test')).toBe('https://w.test/google/callback');
  });

  it('pede PKCE S256, nonce e state; offline pede consentimento e refresh token', () => {
    const offline = new URL(googleAuthorizeUrl({ ...BASE, offline: true })).searchParams;
    expect(Object.fromEntries(offline)).toMatchObject({
      client_id: 'cid',
      response_type: 'code',
      scope: 'openid email',
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent select_account',
      nonce: 'no',
      state: 'st',
    });
    const online = new URL(googleAuthorizeUrl({ ...BASE, offline: false })).searchParams;
    expect(online.get('access_type')).toBeNull();
    expect(online.get('prompt')).toBe('select_account');
  });

  it('randomToken gera textos base64url distintos', () => {
    expect(randomToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(randomToken(16)).not.toBe(randomToken(16));
  });
});

describe('respostas de token', () => {
  it('parseGoogleTokens lê campos e aplica padrões', () => {
    expect(parseGoogleTokens({ access_token: 'a' })).toEqual({
      accessToken: 'a',
      expiresIn: 3600,
      refreshToken: null,
      idToken: null,
      scope: '',
    });
    const full = {
      access_token: 'a',
      expires_in: 10,
      refresh_token: 'r',
      id_token: 'i',
      scope: 's',
    };
    expect(parseGoogleTokens(full)).toMatchObject({
      expiresIn: 10,
      refreshToken: 'r',
      idToken: 'i',
      scope: 's',
    });
    expect(() => parseGoogleTokens(null)).toThrow(GoogleTokenError);
  });

  it('googleErrorCode usa o campo error ou o status', async () => {
    const denied = Response.json({ error: 'invalid_grant' }, { status: 400 });
    expect(await googleErrorCode(denied)).toBe('invalid_grant');
    expect(await googleErrorCode(Response.json({}, { status: 500 }))).toBe('http_500');
    expect(await googleErrorCode(new Response('x', { status: 502 }))).toBe('http_502');
  });
});

describe('chamadas ao endpoint de tokens', () => {
  it('postGoogleToken envia credenciais e User-Agent; falha vira GoogleTokenError', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([tokenRoute()], calls));
    await expect(
      postGoogleToken(deps, { grant_type: 'authorization_code', code: 'c' }),
    ).rejects.toMatchObject({ code: 'http_400' });
    const body = new URLSearchParams(calls[0]?.init?.body as string);
    expect(body.get('client_secret')).toBe('segredo-de-teste');
    const headers = calls[0]?.init?.headers as Record<string, string>;
    expect(headers['user-agent']).toMatch(/claude-connectors-gmail/);
  });

  it('exchangeGoogleCode manda verificador e redirect; refreshGoogleToken manda o refresh', async () => {
    const seen: URLSearchParams[] = [];
    const deps = testDeps(
      fakeFetch([
        tokenRoute((form) => {
          seen.push(form);
          return Response.json({ access_token: 'x', id_token: 'i' });
        }),
      ]),
    );
    expect((await exchangeGoogleCode(deps, 'code-1', 'ver-1')).idToken).toBe('i');
    expect(seen[0]?.get('code_verifier')).toBe('ver-1');
    expect(seen[0]?.get('redirect_uri')).toBe('https://gmail.test/google/callback');
    expect((await refreshGoogleToken(deps, 'r1')).accessToken).toBe('access-r1');
  });
});
