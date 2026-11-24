import { describe, expect, it } from 'vitest';
import {
  buildOrConfigError,
  checkClientRegistration,
  clientIpKey,
  configErrorResponse,
  isMcpPath,
  MIN_CONSENT_SECRET_CHARS,
  oauthErrorCode,
  publicOrigin,
  randomToken,
  readConsentSecret,
  requiredSecret,
  sha256Hex,
} from './worker-kit.js';

/** Registration options with the given redirect URIs (only the field the check reads). */
function registration(uris: unknown): Parameters<typeof checkClientRegistration>[0] {
  return { clientMetadata: { redirect_uris: uris } } as unknown as Parameters<
    typeof checkClientRegistration
  >[0];
}

describe('worker-kit ids and secrets', () => {
  it('randomToken is base64url with the requested entropy and never repeats', () => {
    expect(randomToken(16)).toMatch(/^[\w-]{22}$/);
    expect(randomToken()).not.toBe(randomToken());
  });

  it('sha256Hex is the hex digest', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('requiredSecret returns the value or explains how to set it', () => {
    expect(requiredSecret({ A: 'x' }, 'A')).toBe('x');
    expect(() => requiredSecret({}, 'A')).toThrow('wrangler secret put A');
  });

  it('readConsentSecret enforces the minimum length', () => {
    const ok = 's'.repeat(MIN_CONSENT_SECRET_CHARS);
    expect(readConsentSecret({ CONSENT_SECRET: ok })).toBe(ok);
    expect(() => readConsentSecret({ CONSENT_SECRET: 'short' })).toThrow('at least');
  });
});

describe('worker-kit responses and routing', () => {
  it('configErrorResponse is a 500 naming the problem', async () => {
    const response = configErrorResponse(new Error('Set the secret X'));
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('Set the secret X');
    expect(await configErrorResponse('plain').text()).toContain('plain');
  });

  it('checkClientRegistration accepts only Claude callbacks', () => {
    expect(
      checkClientRegistration(registration(['https://claude.ai/api/mcp/auth_callback'])),
    ).toBeUndefined();
    expect(checkClientRegistration(registration(['https://evil.example/cb']))?.code).toBe(
      'invalid_redirect_uri',
    );
    expect(checkClientRegistration(registration(undefined))?.status).toBe(400);
  });

  it('publicOrigin prefers PUBLIC_URL over the request origin', () => {
    const request = new Request('https://x.workers.dev/mcp');
    expect(publicOrigin({}, request)).toBe('https://x.workers.dev');
    expect(publicOrigin({ PUBLIC_URL: 'https://music.example/' }, request)).toBe(
      'https://music.example',
    );
  });

  it('clientIpKey and isMcpPath read the request', () => {
    const request = new Request('https://x.dev/mcp/sse', {
      headers: { 'cf-connecting-ip': '1.2.3.4' },
    });
    expect(clientIpKey(request)).toBe('ip:1.2.3.4');
    expect(clientIpKey(new Request('https://x.dev/'))).toBe('ip:unknown');
    expect(isMcpPath(request)).toBe(true);
    expect(isMcpPath(new Request('https://x.dev/mcpx'))).toBe(false);
  });
});

describe('worker-kit helpers', () => {
  it('oauthErrorCode reads the error field or falls back to the status', async () => {
    expect(await oauthErrorCode(Response.json({ error: 'invalid_grant' }, { status: 400 }))).toBe(
      'invalid_grant',
    );
    expect(await oauthErrorCode(new Response('x', { status: 502 }))).toBe('http_502');
  });

  it('buildOrConfigError returns the value or the 500 page', () => {
    expect(buildOrConfigError(() => 7)).toBe(7);
    const failed = buildOrConfigError(() => {
      throw new Error('Set the secret X');
    });
    expect(failed instanceof Response && failed.status).toBe(500);
  });
});
