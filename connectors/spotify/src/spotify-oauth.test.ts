import { describe, expect, it } from 'vitest';
import { oauthErrorCode } from '../../../src/remote/worker-kit.js';
import {
  fakeSpotify,
  TEST_APP,
  testSpotifyDeps,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  exchangeSpotifyCode,
  parseSpotifyTokens,
  postSpotifyToken,
  refreshSpotifyToken,
  spotifyAuthorizeUrl,
  spotifyRedirectUri,
  SpotifyTokenError,
} from './spotify-oauth.js';

describe('Spotify OAuth with the user’s app', () => {
  it('builds the authorization URL with the user’s client id, exact redirect, scopes and dialog', () => {
    const url = new URL(spotifyAuthorizeUrl('cid', 'https://w.test', 'st'));
    expect(url.origin + url.pathname).toBe('https://accounts.spotify.com/authorize');
    expect(url.searchParams.get('client_id')).toBe('cid');
    expect(url.searchParams.get('redirect_uri')).toBe(spotifyRedirectUri('https://w.test'));
    expect(url.searchParams.get('redirect_uri')).toBe('https://w.test/spotify/callback');
    expect(url.searchParams.get('scope')).toContain('playlist-modify-private');
    expect(url.searchParams.get('state')).toBe('st');
    expect(url.searchParams.get('show_dialog')).toBe('true');
  });

  it('parses tokens and refuses a body without an access token', () => {
    expect(
      parseSpotifyTokens({ access_token: 'a', refresh_token: 'r', expires_in: 10, scope: 's' }),
    ).toEqual({
      accessToken: 'a',
      refreshToken: 'r',
      expiresIn: 10,
      scope: 's',
    });
    expect(parseSpotifyTokens({ access_token: 'a' })).toMatchObject({
      refreshToken: null,
      expiresIn: 3600,
    });
    expect(() => parseSpotifyTokens(null)).toThrow(SpotifyTokenError);
  });

  it('reads the OAuth error code or falls back to the status', async () => {
    expect(await oauthErrorCode(Response.json({ error: 'invalid_grant' }, { status: 400 }))).toBe(
      'invalid_grant',
    );
    expect(await oauthErrorCode(new Response('oops', { status: 502 }))).toBe('http_502');
  });

  it('authenticates with HTTP Basic using the user’s own app and posts the form', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = testSpotifyDeps(fakeSpotify([], calls));
    await exchangeSpotifyCode(deps, TEST_APP, 'the-code');
    const call = calls[0];
    const basic = Buffer.from(`${TEST_APP.clientId}:${TEST_APP.clientSecret}`).toString('base64');
    expect(call?.headers.get('authorization')).toBe(`Basic ${basic}`);
    const form = new URLSearchParams(call?.body);
    expect(form.get('grant_type')).toBe('authorization_code');
    expect(form.get('redirect_uri')).toBe('https://spotify.test/spotify/callback');
    expect(form.get('client_secret')).toBeNull();
  });

  it('refreshes with the refresh token and throws the Spotify code on failure', async () => {
    const deps = testSpotifyDeps(fakeSpotify([]));
    expect((await refreshSpotifyToken(deps, TEST_APP, 'r1')).accessToken).toBe('at-r1');
    const failing = testSpotifyDeps(
      fakeSpotify([
        ['POST', /\/api\/token/, () => Response.json({ error: 'invalid_client' }, { status: 400 })],
      ]),
    );
    await expect(postSpotifyToken(failing, TEST_APP, {})).rejects.toMatchObject({
      code: 'invalid_client',
    });
  });
});
