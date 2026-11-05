import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  authorizationServerMetadata,
  clientRedirectUris,
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
  issuer: 'https://canvas.exemplo.dev',
  key: randomBytes(32),
  redirectHosts: ['claude.ai', 'localhost'],
};
const NOW = 1_000_000;
const CALLBACK = 'https://claude.ai/api/mcp/auth_callback';

describe('metadados', () => {
  it('anunciam os endpoints do servidor de autorização com PKCE S256', () => {
    const meta = authorizationServerMetadata(settings.issuer);
    expect(meta.authorization_endpoint).toBe('https://canvas.exemplo.dev/authorize');
    expect(meta.registration_endpoint).toBe('https://canvas.exemplo.dev/register');
    expect(meta.code_challenge_methods_supported).toEqual(['S256']);
  });

  it('apontam o recurso /mcp para o próprio emissor', () => {
    expect(protectedResourceMetadata(settings.issuer)).toMatchObject({
      resource: 'https://canvas.exemplo.dev/mcp',
      authorization_servers: ['https://canvas.exemplo.dev'],
    });
  });
});

describe('isAllowedRedirect', () => {
  it('aceita https em host listado, subdomínio dele e localhost em http', () => {
    expect(isAllowedRedirect(CALLBACK, settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('https://www.claude.ai/cb', settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('http://localhost:3118/callback', settings.redirectHosts)).toBe(true);
    expect(isAllowedRedirect('http://127.0.0.1:3118/callback', settings.redirectHosts)).toBe(true);
  });

  it('recusa host fora da lista, http público e texto inválido', () => {
    expect(isAllowedRedirect('https://evil.com/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('https://claude.ai.evil.com/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('http://claude.ai/cb', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('nada', settings.redirectHosts)).toBe(false);
    expect(isAllowedRedirect('http://localhost/cb', ['claude.ai'])).toBe(false);
  });
});

describe('pkceChallenge', () => {
  it('calcula o desafio S256 do exemplo da RFC 7636', () => {
    expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });
});

describe('registerClient', () => {
  it('sela os endereços de retorno no client_id', () => {
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

  it('recusa corpo sem endereços ou com endereço fora da lista', () => {
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
    if (!result.ok) throw new Error('registro falhou');
    return result.value.client_id;
  }

  function query(overrides: Record<string, string> = {}): URLSearchParams {
    return new URLSearchParams({
      response_type: 'code',
      client_id: clientId(),
      redirect_uri: CALLBACK,
      code_challenge: 'desafio',
      code_challenge_method: 'S256',
      state: 'xyz',
      ...overrides,
    });
  }

  it('devolve o pedido validado', () => {
    const result = parseAuthorizeQuery(query(), settings, NOW);
    expect(result).toMatchObject({
      ok: true,
      value: { redirectUri: CALLBACK, codeChallenge: 'desafio', state: 'xyz' },
    });
  });

  it('recusa cliente desconhecido, retorno não registrado e PKCE ausente ou plain', () => {
    const forged = sealPayload(
      { typ: 'client', exp: NOW + 10, redirect_uris: [CALLBACK] },
      randomBytes(32),
    );
    expect(parseAuthorizeQuery(query({ client_id: forged }), settings, NOW)).toMatchObject({
      ok: false,
      error: 'invalid_client',
    });
    expect(
      parseAuthorizeQuery(query({ redirect_uri: 'https://claude.ai/outro' }), settings, NOW),
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

describe('auxiliares do OAuth', () => {
  it('oauthError monta o erro sem valor', () => {
    expect(oauthError('x', 'y')).toEqual({ ok: false, error: 'x', description: 'y' });
  });

  it('readRedirectUris aceita só lista não vazia de textos', () => {
    expect(readRedirectUris({ redirect_uris: [CALLBACK] })).toEqual([CALLBACK]);
    expect(readRedirectUris({ redirect_uris: [] })).toBeNull();
    expect(readRedirectUris({ redirect_uris: [1] })).toBeNull();
    expect(readRedirectUris('x')).toBeNull();
  });

  it('clientRedirectUris abre só client_id selado por este servidor', () => {
    const result = registerClient({ redirect_uris: [CALLBACK] }, settings, NOW);
    if (!result.ok) throw new Error('registro falhou');
    expect(clientRedirectUris(result.value.client_id, settings, NOW)).toEqual([CALLBACK]);
    expect(clientRedirectUris('falso', settings, NOW)).toBeNull();
  });

  it('readCodeChallenge exige response_type=code e S256', () => {
    const ok = new URLSearchParams({
      response_type: 'code',
      code_challenge: 'c',
      code_challenge_method: 'S256',
    });
    expect(readCodeChallenge(ok)).toEqual({ ok: true, value: 'c' });
    expect(readCodeChallenge(new URLSearchParams())).toMatchObject({ ok: false });
  });
});
