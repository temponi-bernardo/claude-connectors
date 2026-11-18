import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { pkceChallenge, type AuthorizeRequest, type OAuthSettings } from './oauth.js';
import { LEGACY_AUDLESS_UNTIL, sealPayload } from './seal.js';
import {
  ACCESS_TTL_SECONDS,
  CODE_TTL_SECONDS,
  grantFromClaims,
  issueAuthorizationCode,
  issueTokenSet,
  openAuthorizeRequest,
  readAccessGrant,
  redeemAuthorizationCode,
  redeemRefreshToken,
  redeemTokenRequest,
  sealAuthorizeRequest,
  type SealedGrant,
} from './tokens.js';

const settings: OAuthSettings = {
  issuer: 'https://canvas.example.dev',
  key: randomBytes(32),
  redirectHosts: ['claude.ai'],
};
const NOW = 2_000_000;

/** Grant fixture: a fake secret and its permissions. */
function G(secret: string, grants: readonly string[] = []): SealedGrant {
  return { secret, grants };
}
const VERIFIER = 'verifier-with-enough-entropy-1234567890';
const request: AuthorizeRequest = {
  clientId: 'client-1',
  redirectUri: 'https://claude.ai/api/mcp/auth_callback',
  codeChallenge: pkceChallenge(VERIFIER),
  state: 's1',
};

function codeForm(code: string, overrides: Record<string, string> = {}): URLSearchParams {
  return new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: request.clientId,
    redirect_uri: request.redirectUri,
    code_verifier: VERIFIER,
    ...overrides,
  });
}

describe('sealAuthorizeRequest and openAuthorizeRequest', () => {
  it('keep the request until it expires', () => {
    const sealed = sealAuthorizeRequest(request, settings, NOW);
    expect(openAuthorizeRequest(sealed, settings, NOW)).toEqual(request);
    expect(openAuthorizeRequest(sealed, settings, NOW + 3600)).toBeNull();
    expect(openAuthorizeRequest('junk', settings, NOW)).toBeNull();
  });
});

describe('issueTokenSet', () => {
  it('issues Bearer access and refresh tokens with the access lifetime', () => {
    const tokens = issueTokenSet(G('secret'), settings, NOW);
    expect(tokens.token_type).toBe('Bearer');
    expect(tokens.expires_in).toBe(ACCESS_TTL_SECONDS);
    expect(readAccessGrant(`Bearer ${tokens.access_token}`, settings, NOW)).toEqual(G('secret'));
  });
});

describe('redeemTokenRequest with authorization_code', () => {
  it('exchanges the code for the token pair when client, redirect and PKCE match', () => {
    const code = issueAuthorizationCode({ request, ...G('secret') }, settings, NOW);
    const result = redeemTokenRequest(codeForm(code), settings, NOW + 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ grant: G('secret'), refreshed: false });
    expect(
      readAccessGrant(`Bearer ${result.value.tokens.access_token}`, settings, NOW + 1),
    ).toEqual(G('secret'));
  });

  it('rejects an expired code, a wrong verifier, or a swapped client or redirect', () => {
    const code = issueAuthorizationCode({ request, ...G('secret') }, settings, NOW);
    const late = NOW + CODE_TTL_SECONDS;
    expect(redeemTokenRequest(codeForm(code), settings, late)).toMatchObject({
      error: 'invalid_grant',
    });
    for (const bad of [
      { code_verifier: 'other' },
      { client_id: 'other' },
      { redirect_uri: 'https://claude.ai/x' },
    ]) {
      expect(redeemTokenRequest(codeForm(code, bad), settings, NOW)).toMatchObject({
        ok: false,
        error: 'invalid_grant',
      });
    }
  });
});

describe('redeemTokenRequest with refresh_token', () => {
  it('renews the access token with the refresh token', () => {
    const { refresh_token } = issueTokenSet(G('secret'), settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });
    const result = redeemTokenRequest(form, settings, NOW + ACCESS_TTL_SECONDS * 2);
    expect(result.ok && result.value.tokens.token_type).toBe('Bearer');
    expect(result).toMatchObject({ value: { grant: G('secret'), refreshed: true } });
  });

  it('accepts neither an access token in place of the refresh token nor an unknown grant', () => {
    const { access_token } = issueTokenSet(G('secret'), settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: access_token });
    expect(redeemTokenRequest(form, settings, NOW)).toMatchObject({ error: 'invalid_grant' });
    const other = new URLSearchParams({ grant_type: 'password' });
    expect(redeemTokenRequest(other, settings, NOW)).toMatchObject({
      error: 'unsupported_grant_type',
    });
  });
});

describe('readAccessGrant', () => {
  it('returns null without Bearer, with a refresh token or with an expired token', () => {
    const tokens = issueTokenSet(G('secret'), settings, NOW);
    expect(readAccessGrant(null, settings, NOW)).toBeNull();
    expect(readAccessGrant(tokens.access_token, settings, NOW)).toBeNull();
    expect(readAccessGrant(`Bearer ${tokens.refresh_token}`, settings, NOW)).toBeNull();
    expect(
      readAccessGrant(`Bearer ${tokens.access_token}`, settings, NOW + ACCESS_TTL_SECONDS),
    ).toBeNull();
  });
});

describe('redeemAuthorizationCode and redeemRefreshToken', () => {
  it('return the sealed secret when they match', () => {
    const code = issueAuthorizationCode({ request, ...G('s1', ['write']) }, settings, NOW);
    expect(redeemAuthorizationCode(codeForm(code), settings, NOW)).toEqual({
      ok: true,
      value: G('s1', ['write']),
    });
    const { refresh_token } = issueTokenSet(G('s2'), settings, NOW);
    const form = new URLSearchParams({ refresh_token });
    expect(redeemRefreshToken(form, settings, NOW)).toEqual({ ok: true, value: G('s2') });
  });

  it('reject a missing seal', () => {
    expect(redeemAuthorizationCode(new URLSearchParams(), settings, NOW)).toMatchObject({
      ok: false,
    });
    expect(redeemRefreshToken(new URLSearchParams(), settings, NOW)).toMatchObject({ ok: false });
  });
});

describe('token isolation between connectors (aud)', () => {
  const other: OAuthSettings = { ...settings, issuer: 'https://whatsapp.example.dev' };

  it('rejects an access or refresh token issued by another connector, even with the same key', () => {
    const tokens = issueTokenSet(G('secret'), settings, NOW);
    expect(readAccessGrant(`Bearer ${tokens.access_token}`, other, NOW)).toBeNull();
    const form = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    });
    expect(redeemTokenRequest(form, other, NOW)).toMatchObject({ error: 'invalid_grant' });
  });

  it('rejects a code and a pending request from another connector', () => {
    const code = issueAuthorizationCode({ request, ...G('secret') }, settings, NOW);
    expect(redeemAuthorizationCode(codeForm(code), other, NOW)).toMatchObject({ ok: false });
    expect(openAuthorizeRequest(sealAuthorizeRequest(request, settings, NOW), other, NOW)).toBe(
      null,
    );
  });

  it('rejects a tampered token and one sealed with another key', () => {
    const { access_token } = issueTokenSet(G('secret'), settings, NOW);
    const flipped = `${access_token.slice(0, 20)}${access_token[20] === 'A' ? 'B' : 'A'}${access_token.slice(21)}`;
    expect(readAccessGrant(`Bearer ${flipped}`, settings, NOW)).toBeNull();
    const foreignKey = { ...settings, key: randomBytes(32) };
    expect(readAccessGrant(`Bearer ${access_token}`, foreignKey, NOW)).toBeNull();
  });

  it('accepts a token from before aud existed only until the legacy cutoff', () => {
    const legacy = sealPayload(
      { typ: 'access', exp: LEGACY_AUDLESS_UNTIL + 999, secret: 'old' },
      settings.key,
    );
    expect(readAccessGrant(`Bearer ${legacy}`, settings, NOW)).toEqual(G('old'));
    expect(readAccessGrant(`Bearer ${legacy}`, settings, LEGACY_AUDLESS_UNTIL)).toBeNull();
  });
});

describe('grantFromClaims', () => {
  it('reads the secret and keeps only string permissions; a legacy token has none', () => {
    const base = { typ: 'access', exp: 1 };
    expect(grantFromClaims({ ...base, secret: 's', grants: ['write', 7] })).toEqual(
      G('s', ['write']),
    );
    expect(grantFromClaims({ ...base, secret: 's' })).toEqual(G('s'));
  });

  it('carries the permissions through the refresh', () => {
    const { refresh_token } = issueTokenSet(G('s', ['write']), settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });
    const result = redeemTokenRequest(form, settings, NOW + 1);
    expect(
      result.ok && readAccessGrant(`Bearer ${result.value.tokens.access_token}`, settings, NOW + 1),
    ).toEqual(G('s', ['write']));
  });
});
