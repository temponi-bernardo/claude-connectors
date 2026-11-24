import { AuthorizationError } from '@cloudflare/workers-oauth-provider';
import { describe, expect, it } from 'vitest';
import { fakeSpotify, TEST_APP, testSpotifyDeps } from './fixtures/fake-spotify.js';
import {
  credentialsProblem,
  expiredConnectionPage,
  fetchSpotifyIdentity,
  openPendingApp,
  pageTargets,
  sealPendingApp,
  spotifyFailurePage,
} from './sign-in.js';
import { SpotifyTokenError } from './spotify-oauth.js';

describe('sign-in pieces', () => {
  it('validates pasted credentials', () => {
    expect(credentialsProblem(TEST_APP.clientId, TEST_APP.clientSecret)).toBeNull();
    expect(credentialsProblem('x', TEST_APP.clientSecret)).toContain('Client ID');
    expect(credentialsProblem(TEST_APP.clientId, 'x')).toContain('Client Secret');
    expect(credentialsProblem(TEST_APP.clientId, TEST_APP.clientId.toUpperCase())).toContain(
      'cannot be the same',
    );
  });

  it('seals the app credentials for 15 minutes only', () => {
    const deps = testSpotifyDeps(fakeSpotify([]));
    const sealed = sealPendingApp(deps, TEST_APP);
    expect(sealed).not.toContain(TEST_APP.clientSecret);
    expect(openPendingApp(deps, sealed)).toEqual(TEST_APP);
    expect(openPendingApp({ ...deps, now: () => deps.now() + 16 * 60_000 }, sealed)).toBeNull();
    expect(openPendingApp(deps, 'tampered')).toBeNull();
    expect(openPendingApp(deps, 42)).toBeNull();
  });

  it('identifies the account by account_id (falling back to id) and encodes it for the OAuth library', async () => {
    function me(body: unknown, status = 200): ReturnType<typeof testSpotifyDeps> {
      return testSpotifyDeps(
        fakeSpotify([['GET', /\/v1\/me$/, () => Response.json(body, { status })]]),
      );
    }
    expect(
      await fetchSpotifyIdentity(me({ id: 'u', account_id: 'a:b', display_name: 'U' }), 't'),
    ).toEqual({ owner: 'spotify_a%3Ab', userId: 'u', displayName: 'U' });
    expect(await fetchSpotifyIdentity(me({ id: 'u' }), 't')).toEqual({
      owner: 'spotify_u',
      userId: 'u',
      displayName: 'u',
    });
    await expect(fetchSpotifyIdentity(me({}), 't')).rejects.toThrow('no account id');
    await expect(fetchSpotifyIdentity(me({}, 500), 't')).rejects.toThrow('500');
    await expect(fetchSpotifyIdentity(me({}, 403), 't')).rejects.toThrow('not_allowlisted');
  });

  it('turns failures into pages that say what to fix', async () => {
    expect(await spotifyFailurePage(new SpotifyTokenError('invalid_client')).text()).toContain(
      'Client ID or Client Secret',
    );
    expect(spotifyFailurePage(new Error('not_allowlisted')).status).toBe(403);
    expect(
      spotifyFailurePage(new AuthorizationError('invalid_request', { description: 'bad' })).status,
    ).toBe(400);
    expect(await expiredConnectionPage().text()).toContain('took too long');
  });

  it('keeps Claude’s query in the form action', () => {
    const deps = testSpotifyDeps(fakeSpotify([]));
    expect(
      pageTargets(deps, new Request('https://spotify.test/authorize?client_id=x&state=y')),
    ).toEqual({
      redirectUri: 'https://spotify.test/spotify/callback',
      action: '/authorize?client_id=x&state=y',
    });
  });
});
