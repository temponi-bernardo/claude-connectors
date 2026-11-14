import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REDIRECT_HOSTS,
  authorizationServerMetadata,
  clientRedirectUris,
  readOAuthSettings,
  resolveIssuer,
  isAllowedRedirect,
  oauthError,
  parseAuthorizeQuery,
  readCodeChallenge,
  readRedirectUris,
  pkceChallenge,
  protectedResourceMetadata,
  registerClient,
  type OAuthSettings,
} from './oauth.js';
import { sealPayload } from './seal.js';

const settings: OAuthSettings = {
  issuer: 'https://canvas.example.dev',
  key: randomBytes(32),
  redirectHosts: ['claude.ai', 'localhost'],
};
const NOW = 1_000_000;
const CALLBACK = 'https://claude.ai/api/mcp/auth_callback';

describe('metadata', () => {
  it('advertise the authorization server endpoints with PKCE S256', () => {
    const meta = authorizationServerMetadata(settings.issuer);
    expect(meta.authorization_endpoint).toBe('https://canvas.example.dev/authorize');
    expect(meta.registration_endpoint).toBe('https://canvas.example.dev/register');
    expect(meta.code_challenge_methods_supported).toEqual(['S256']);
  });

  it('point the /mcp resource at the issuer itself', () => {
    expect(protectedResourceMetadata(settings.issuer)).toMatchObject({
      resource: 'https://canvas.example.dev/mcp',
      authorization_servers: ['https://canvas.example.dev'],
    });
  });
});

describe('isAllowedRedirect', () => {
  it('accepts https on a listed host, its subdomains and localhost over http', () => {
    expect(isAllowedRedirect(CALLBACK, settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('https://www.claude.ai/cb', settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('http://localhost:3118/callback', settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('http://127.0.0.1:3118/callback', settings.redirectHosts)).toBe(true);
  });

  it('rejects an unlisted host, public http and invalid text', () => {
    expect(isAllowedRedirect('https://evil.com/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('https://claude.ai.evil.com/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('http://claude.ai/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('nothing', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('http://localhost/cb', ['claude.ai'])).toBe(false);
  });
});

describe('pkceChallenge', () => {
  it('computes the S256 challenge of the RFC 7636 example', () => {
    expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });
});

describe('registerClient', () => {
  it('seals the redirect addresses into the client_id', () => {
    const result = registerClient(
      { redirect_uris: [CALLBACK], client_name: 'Claude' },
      settings,
      NOW,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.redirect_uris).toEqual([CALLBACK]);
    expect(result.value.token_endpoint_auth_method).toBe('none');
    expect(typeof result.value.client_id).toBe('string');
  });

  it('rejects a body without addresses or with an unlisted address', () => {
    expect(registerClient({}, settings, NOW)).toMatchObject({
      ok: false,
      error: 'invalid_redirect_uri',
    });
    expect(registerClient(null, settings, NOW)).toMatchObject({ ok: false });
    expect(registerClient({ redirect_uris: ['https://evil.com/cb'] }, settings, NOW)).toMatchObject(
      {
        ok: false,
        error: 'invalid_redirect_uri',
      },
    );
  });
});

describe('parseAuthorizeQuery', () => {
  function clientId(): string {
    const result = registerClient({ redirect_uris: [CALLBACK] }, settings, NOW);
    if (!result.ok) throw new Error('registration failed');
    return result.value.client_id;
  }

  function query(overrides: Record<string, string> = {}): URLSearchParams {
    return new URLSearchParams({
      response_type: 'code',
      client_id: clientId(),
      redirect_uri: CALLBACK,
      code_challenge: 'challenge',
      code_challenge_method: 'S256',
      state: 'xyz',
      ...overrides,
    });
  }

  it('returns the validated request', () => {
    const result = parseAuthorizeQuery(query(), settings, NOW);
    expect(result).toMatchObject({
      ok: true,
      value: { redirectUri: CALLBACK, codeChallenge: 'challenge', state: 'xyz' },
    });
  });

  it('rejects an unknown client, an unregistered redirect and missing or plain PKCE', () => {
    const forged = sealPayload(
      { typ: 'client', exp: NOW + 10, redirect_uris: [CALLBACK] },
      randomBytes(32),
    );
    expect(parseAuthorizeQuery(query({ client_id: forged }), settings, NOW)).toMatchObject({
      ok: false,
      error: 'invalid_client',
    });
    expect(
      parseAuthorizeQuery(query({ redirect_uri: 'https://claude.ai/other' }), settings, NOW),
    ).toMatchObject({ ok: false, error: 'invalid_request' });
    expect(parseAuthorizeQuery(query({ code_challenge: '' }), settings, NOW)).toMatchObject({
      ok: false,
      error: 'invalid_request',
    });
    expect(
      parseAuthorizeQuery(query({ code_challenge_method: 'plain' }), settings, NOW),
    ).toMatchObject({ ok: false, error: 'invalid_request' });
    expect(parseAuthorizeQuery(query({ response_type: 'token' }), settings, NOW)).toMatchObject({
      ok: false,
      error: 'unsupported_response_type',
    });
  });
});

describe('OAuth helpers', () => {
  it('oauthError builds the error without a value', () => {
    expect(oauthError('x', 'y')).toEqual({ ok: false, error: 'x', description: 'y' });
  });

  it('readRedirectUris accepts only a non-empty list of strings', () => {
    expect(readRedirectUris({ redirect_uris: [CALLBACK] })).toEqual([CALLBACK]);
    expect(readRedirectUris({ redirect_uris: [] })).toBeNull();
    expect(readRedirectUris({ redirect_uris: [1] })).toBeNull();
    expect(readRedirectUris('x')).toBeNull();
  });

  it('clientRedirectUris opens only a client_id sealed by this server', () => {
    const result = registerClient({ redirect_uris: [CALLBACK] }, settings, NOW);
    if (!result.ok) throw new Error('registration failed');
    expect(clientRedirectUris(result.value.client_id, settings, NOW)).toEqual([CALLBACK]);
    expect(clientRedirectUris('fake', settings, NOW)).toBeNull();
  });

  it('readCodeChallenge requires response_type=code and S256', () => {
    const ok = new URLSearchParams({
      response_type: 'code',
      code_challenge: 'c',
      code_challenge_method: 'S256',
    });
    expect(readCodeChallenge(ok)).toEqual({ ok: true, value: 'c' });
    expect(readCodeChallenge(new URLSearchParams())).toMatchObject({ ok: false });
  });
});

describe('resolveIssuer', () => {
  it('prefers PUBLIC_URL without a trailing slash; without it, uses the origin', () => {
    expect(resolveIssuer({ PUBLIC_URL: 'https://a.dev//' }, 'https://b.dev')).toBe('https://a.dev');
    expect(resolveIssuer({}, 'https://b.dev')).toBe('https://b.dev');
  });
});

describe('readOAuthSettings', () => {
  const key = randomBytes(32).toString('base64');

  it('uses the given issuer, the key and the default hosts', () => {
    const read = readOAuthSettings({ SEAL_KEY: key }, 'https://x.dev');
    expect(read.issuer).toBe('https://x.dev');
    expect(read.key.length).toBe(32);
    expect(read.redirectHosts).toEqual(DEFAULT_REDIRECT_HOSTS);
  });

  it('accepts comma-separated hosts and requires SEAL_KEY', () => {
    const read = readOAuthSettings(
      { SEAL_KEY: key, OAUTH_REDIRECT_HOSTS: 'a.dev, ,b.dev' },
      'https://x',
    );
    expect(read.redirectHosts).toEqual(['a.dev', 'b.dev']);
    expect(() => readOAuthSettings({}, 'https://x.dev')).toThrow(/SEAL_KEY/);
  });
});
