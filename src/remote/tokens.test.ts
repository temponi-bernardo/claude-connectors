import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { pkceChallenge, type AuthorizeRequest, type OAuthSettings } from './oauth.js';
import {
  ACCESS_TTL_SECONDS,
  CODE_TTL_SECONDS,
  issueAuthorizationCode,
  issueTokenSet,
  openAuthorizeRequest,
  readAccessSecret,
  redeemAuthorizationCode,
  redeemRefreshToken,
  redeemTokenRequest,
  sealAuthorizeRequest,
} from './tokens.js';

const settings: OAuthSettings = {
  issuer: 'https://canvas.example.dev',
  key: randomBytes(32),
  redirectHosts: ['claude.ai'],
};
const NOW = 2_000_000;
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
    const tokens = issueTokenSet('secret', settings, NOW);
    expect(tokens.token_type).toBe('Bearer');
    expect(tokens.expires_in).toBe(ACCESS_TTL_SECONDS);
    expect(readAccessSecret(`Bearer ${tokens.access_token}`, settings, NOW)).toBe('secret');
  });
});

describe('redeemTokenRequest with authorization_code', () => {
  it('exchanges the code for the token pair when client, redirect and PKCE match', () => {
    const code = issueAuthorizationCode({ request, secret: 'secret' }, settings, NOW);
    const result = redeemTokenRequest(codeForm(code), settings, NOW + 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ secret: 'secret', refreshed: false });
    expect(readAccessSecret(`Bearer ${result.value.tokens.access_token}`, settings, NOW + 1)).toBe(
      'secret',
    );
  });

  it('rejects an expired code, a wrong verifier, or a swapped client or redirect', () => {
    const code = issueAuthorizationCode({ request, secret: 'secret' }, settings, NOW);
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
    const { refresh_token } = issueTokenSet('secret', settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });
    const result = redeemTokenRequest(form, settings, NOW + ACCESS_TTL_SECONDS * 2);
    expect(result.ok && result.value.tokens.token_type).toBe('Bearer');
    expect(result).toMatchObject({ value: { secret: 'secret', refreshed: true } });
  });

  it('accepts neither an access token in place of the refresh token nor an unknown grant', () => {
    const { access_token } = issueTokenSet('secret', settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: access_token });
    expect(redeemTokenRequest(form, settings, NOW)).toMatchObject({ error: 'invalid_grant' });
    const other = new URLSearchParams({ grant_type: 'password' });
    expect(redeemTokenRequest(other, settings, NOW)).toMatchObject({
      error: 'unsupported_grant_type',
    });
  });
});

describe('readAccessSecret', () => {
  it('returns null without Bearer, with a refresh token or with an expired token', () => {
    const tokens = issueTokenSet('secret', settings, NOW);
    expect(readAccessSecret(null, settings, NOW)).toBeNull();
    expect(readAccessSecret(tokens.access_token, settings, NOW)).toBeNull();
    expect(readAccessSecret(`Bearer ${tokens.refresh_token}`, settings, NOW)).toBeNull();
    expect(
      readAccessSecret(`Bearer ${tokens.access_token}`, settings, NOW + ACCESS_TTL_SECONDS),
    ).toBeNull();
  });
});

describe('redeemAuthorizationCode and redeemRefreshToken', () => {
  it('return the sealed secret when they match', () => {
    const code = issueAuthorizationCode({ request, secret: 's1' }, settings, NOW);
    expect(redeemAuthorizationCode(codeForm(code), settings, NOW)).toEqual({
      ok: true,
      value: 's1',
    });
    const { refresh_token } = issueTokenSet('s2', settings, NOW);
    const form = new URLSearchParams({ refresh_token });
    expect(redeemRefreshToken(form, settings, NOW)).toEqual({ ok: true, value: 's2' });
  });

  it('reject a missing seal', () => {
    expect(redeemAuthorizationCode(new URLSearchParams(), settings, NOW)).toMatchObject({
      ok: false,
    });
    expect(redeemRefreshToken(new URLSearchParams(), settings, NOW)).toMatchObject({ ok: false });
  });
});
