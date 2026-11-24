import type { ConsentDescription } from '@cloudflare/workers-oauth-provider';
import { describe, expect, it } from 'vitest';
import { appSetupSteps, credentialsBody, credentialsPage, SPOTIFY_DASHBOARD_URL } from './pages.js';

const DETAILS = {
  clientId: 'c',
  clientName: 'Claude <x>',
  redirectUri: 'https://claude.ai/api/mcp/auth_callback',
  redirectHost: 'claude.ai',
  redirectIsLoopback: false,
  scope: [],
} as unknown as ConsentDescription;
const VIEW = {
  details: DETAILS,
  handle: 'h"1',
  redirectUri: 'https://w.test/spotify/callback',
  action: '/authorize?a=1&b=2',
  error: null,
};

describe('credentials page', () => {
  it('lists the steps with the exact Redirect URI and the dashboard link', () => {
    const steps = appSetupSteps('https://w.test/spotify/callback');
    expect(steps).toContain('<code>https://w.test/spotify/callback</code>');
    expect(steps).toContain(SPOTIFY_DASHBOARD_URL);
    expect(steps).toContain('Web API');
  });

  it('escapes the client name, the handle and the action', () => {
    const body = credentialsBody(VIEW);
    expect(body).toContain('Claude &lt;x&gt;');
    expect(body).toContain('value="h&quot;1"');
    expect(body).toContain('action="/authorize?a=1&amp;b=2"');
    expect(credentialsBody({ ...VIEW, error: '<bad>' })).toContain('role="alert">&lt;bad&gt;');
  });

  it('lets the form go to Spotify and back to Claude, with the consent cookies', () => {
    const page = credentialsPage(VIEW, new Headers({ 'set-cookie': 'tx=1' }));
    expect(page.status).toBe(200);
    expect(page.headers.get('content-security-policy')).toContain(
      'https://accounts.spotify.com https://claude.ai',
    );
    expect(page.headers.getSetCookie()).toEqual(['tx=1']);
    expect(credentialsPage({ ...VIEW, error: 'x' }, new Headers()).status).toBe(400);
  });
});
