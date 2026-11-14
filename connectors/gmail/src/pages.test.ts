import type { ConsentDescription } from '@cloudflare/workers-oauth-provider';
import { describe, expect, it } from 'vitest';
import {
  consentPage,
  consentPageBody,
  copyConsentHeaders,
  messagePage,
  pageDocument,
  redirectWith,
} from './pages.js';

const DETAILS = {
  clientId: 'c1',
  clientName: 'Claude <script>',
  redirectUri: 'https://claude.ai/api/mcp/auth_callback',
  redirectHost: 'claude.ai',
  redirectIsLoopback: false,
  scope: [],
} as unknown as ConsentDescription;

describe('HTML', () => {
  it('pageDocument escapes the title', () => {
    expect(pageDocument('<t>', '<p>body</p>')).toContain('<title>&lt;t&gt;</title>');
  });

  it('messagePage escapes the message and applies a strict CSP', async () => {
    const response = messagePage('Hi', '<b>x</b>', 403);
    expect(response.status).toBe(403);
    expect(await response.text()).toContain('&lt;b&gt;x');
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'");
  });
});

describe('consent', () => {
  it('consentPageBody escapes the client name and warns about a local app', () => {
    expect(consentPageBody(DETAILS, 'h"1')).toContain('Claude &lt;script&gt;');
    expect(consentPageBody(DETAILS, 'h"1')).toContain('value="h&quot;1"');
    expect(consentPageBody({ ...DETAILS, redirectIsLoopback: true }, 'h')).toContain(
      'app on your computer',
    );
  });

  it('copyConsentHeaders merges cookies and headers without replacing the page ones', () => {
    const headers = new Headers({
      'x-frame-options': 'DENY',
      'content-security-policy': "frame-ancestors 'none'",
    });
    headers.append('set-cookie', 'a=1');
    headers.append('set-cookie', 'b=2');
    const response = copyConsentHeaders(
      new Response('', { headers: { 'content-security-policy': 'mine' } }),
      headers,
    );
    expect(response.headers.getSetCookie()).toEqual(['a=1', 'b=2']);
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('content-security-policy')).toBe('mine');
  });

  it('consentPage allows the form to Google and to the client callback', () => {
    const headers = new Headers();
    headers.append('set-cookie', 'consent=1');
    const response = consentPage(DETAILS, 'h', headers);
    const csp = response.headers.get('content-security-policy') ?? '';
    expect(csp).toContain("form-action 'self' https://accounts.google.com https://claude.ai");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(response.headers.getSetCookie()).toEqual(['consent=1']);
  });

  it('redirectWith builds an uncached 302, keeping the headers', () => {
    const response = redirectWith('https://x/y', new Headers({ 'set-cookie': 'c=1' }));
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://x/y');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.getSetCookie()).toEqual(['c=1']);
    expect(redirectWith('https://z').headers.get('location')).toBe('https://z');
  });
});
