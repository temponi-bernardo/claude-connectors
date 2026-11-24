import { AuthorizationError } from '@cloudflare/workers-oauth-provider';
import { describe, expect, it } from 'vitest';
import {
  authorizationErrorResponse,
  copyConsentHeaders,
  messagePage,
  pageDocument,
  readConsentForm,
  redirectWith,
} from './pages.js';

describe('shared pages', () => {
  it('pageDocument escapes the title and carries the UI tokens', () => {
    const html = pageDocument('<t>', '<p>b</p>');
    expect(html).toContain('<title>&lt;t&gt;</title>');
    expect(html).toContain('--accent');
  });

  it('messagePage escapes, redacts and sets a strict CSP', async () => {
    const response = messagePage('Hi', '<b>Bearer abcdefghijklmnopqrstuvwxyz</b>', 403);
    expect(response.status).toBe(403);
    const text = await response.text();
    expect(text).toContain('&lt;b&gt;');
    expect(text).not.toContain('abcdefghijklmnopqrstuvwxyz');
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'");
  });

  it('copyConsentHeaders keeps cookies and anti-framing but not the content type', () => {
    const headers = new Headers({ 'x-frame-options': 'DENY', 'content-type': 'text/plain' });
    headers.append('set-cookie', 'a=1');
    const response = copyConsentHeaders(
      new Response('x', { headers: { 'content-type': 'text/html' } }),
      headers,
    );
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('content-type')).toBe('text/html');
    expect(response.headers.getSetCookie()).toEqual(['a=1']);
  });

  it('redirectWith is an uncached 302', () => {
    const response = redirectWith('https://claude.ai/cb');
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://claude.ai/cb');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('authorizationErrorResponse redirects when the library says where, else shows a page', async () => {
    const error = Object.assign(new AuthorizationError('access_denied', { description: 'x' }), {
      redirectTo: 'https://claude.ai/cb?error=access_denied',
    });
    const redirected = authorizationErrorResponse(error);
    expect(redirected.status).toBe(302);
    expect(redirected.headers.get('location')).toContain('error=access_denied');
    const described = authorizationErrorResponse(
      new AuthorizationError('invalid_request', { description: 'bad client' }),
    );
    expect(await described.text()).toContain('bad client');
    const page = authorizationErrorResponse(new Error('boom'));
    expect(page.status).toBe(400);
    expect(await page.text()).toContain('Invalid authorization request.');
  });
});

describe('readConsentForm', () => {
  function post(fields: Record<string, string>): Request {
    return new Request('https://x.test/authorize', {
      method: 'POST',
      body: new URLSearchParams(fields).toString(),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
  }
  const oauth = {
    denyConsent: () =>
      Promise.resolve({
        redirectTo: 'https://claude.ai/cb?error=access_denied',
        headers: new Headers(),
      }),
  } as never;

  it('returns the fields on approve and the redirect otherwise', async () => {
    const approved = await readConsentForm(
      oauth,
      post({ handle: 'h', decision: 'approve', x: '1' }),
    );
    expect(approved).toMatchObject({ handle: 'h', denied: null });
    expect(approved.form.get('x')).toBe('1');
    const denied = await readConsentForm(oauth, post({ handle: 'h', decision: 'deny' }));
    expect(denied.denied?.headers.get('location')).toContain('access_denied');
  });
});
