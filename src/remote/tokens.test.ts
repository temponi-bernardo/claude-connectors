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
  issuer: 'https://canvas.exemplo.dev',
  key: randomBytes(32),
  redirectHosts: ['claude.ai'],
};
const NOW = 2_000_000;
const VERIFIER = 'verificador-com-entropia-suficiente-1234567890';
const request: AuthorizeRequest = {
  clientId: 'cliente-1',
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

describe('sealAuthorizeRequest e openAuthorizeRequest', () => {
  it('preservam o pedido até vencer', () => {
    const sealed = sealAuthorizeRequest(request, settings, NOW);
    expect(openAuthorizeRequest(sealed, settings, NOW)).toEqual(request);
    expect(openAuthorizeRequest(sealed, settings, NOW + 3600)).toBeNull();
    expect(openAuthorizeRequest('lixo', settings, NOW)).toBeNull();
  });
});

describe('issueTokenSet', () => {
  it('emite access e refresh do tipo Bearer com a validade do access', () => {
    const tokens = issueTokenSet('segredo', settings, NOW);
    expect(tokens.token_type).toBe('Bearer');
    expect(tokens.expires_in).toBe(ACCESS_TTL_SECONDS);
    expect(readAccessSecret(`Bearer ${tokens.access_token}`, settings, NOW)).toBe('segredo');
  });
});

describe('redeemTokenRequest com authorization_code', () => {
  it('troca o código pelo par de tokens quando cliente, retorno e PKCE conferem', () => {
    const code = issueAuthorizationCode({ request, secret: 'segredo' }, settings, NOW);
    const result = redeemTokenRequest(codeForm(code), settings, NOW + 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ secret: 'segredo', refreshed: false });
    expect(readAccessSecret(`Bearer ${result.value.tokens.access_token}`, settings, NOW + 1)).toBe(
      'segredo',
    );
  });

  it('recusa código vencido, verificador errado, cliente ou retorno trocados', () => {
    const code = issueAuthorizationCode({ request, secret: 'segredo' }, settings, NOW);
    const late = NOW + CODE_TTL_SECONDS;
    expect(redeemTokenRequest(codeForm(code), settings, late)).toMatchObject({
      error: 'invalid_grant',
    });
    for (const bad of [
      { code_verifier: 'outro' },
      { client_id: 'outro' },
      { redirect_uri: 'https://claude.ai/x' },
    ]) {
      expect(redeemTokenRequest(codeForm(code, bad), settings, NOW)).toMatchObject({
        ok: false,
        error: 'invalid_grant',
      });
    }
  });
});

describe('redeemTokenRequest com refresh_token', () => {
  it('renova o access token com o refresh token', () => {
    const { refresh_token } = issueTokenSet('segredo', settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });
    const result = redeemTokenRequest(form, settings, NOW + ACCESS_TTL_SECONDS * 2);
    expect(result.ok && result.value.tokens.token_type).toBe('Bearer');
    expect(result).toMatchObject({ value: { secret: 'segredo', refreshed: true } });
  });

  it('não aceita access token no lugar do refresh nem grant desconhecido', () => {
    const { access_token } = issueTokenSet('segredo', settings, NOW);
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: access_token });
    expect(redeemTokenRequest(form, settings, NOW)).toMatchObject({ error: 'invalid_grant' });
    const other = new URLSearchParams({ grant_type: 'password' });
    expect(redeemTokenRequest(other, settings, NOW)).toMatchObject({
      error: 'unsupported_grant_type',
    });
  });
});

describe('readAccessSecret', () => {
  it('devolve nulo sem Bearer, com refresh token ou com token vencido', () => {
    const tokens = issueTokenSet('segredo', settings, NOW);
    expect(readAccessSecret(null, settings, NOW)).toBeNull();
    expect(readAccessSecret(tokens.access_token, settings, NOW)).toBeNull();
    expect(readAccessSecret(`Bearer ${tokens.refresh_token}`, settings, NOW)).toBeNull();
    expect(
      readAccessSecret(`Bearer ${tokens.access_token}`, settings, NOW + ACCESS_TTL_SECONDS),
    ).toBeNull();
  });
});

describe('redeemAuthorizationCode e redeemRefreshToken', () => {
  it('devolvem o segredo selado quando conferem', () => {
    const code = issueAuthorizationCode({ request, secret: 's1' }, settings, NOW);
    expect(redeemAuthorizationCode(codeForm(code), settings, NOW)).toEqual({
      ok: true,
      value: 's1',
    });
    const { refresh_token } = issueTokenSet('s2', settings, NOW);
    const form = new URLSearchParams({ refresh_token });
    expect(redeemRefreshToken(form, settings, NOW)).toEqual({ ok: true, value: 's2' });
  });

  it('recusam selo ausente', () => {
    expect(redeemAuthorizationCode(new URLSearchParams(), settings, NOW)).toMatchObject({
      ok: false,
    });
    expect(redeemRefreshToken(new URLSearchParams(), settings, NOW)).toMatchObject({ ok: false });
  });
});
