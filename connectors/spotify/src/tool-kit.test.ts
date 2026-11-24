import { describe, expect, it } from 'vitest';
import { fakeSpotify, testOwnerDeps } from './fixtures/fake-spotify.js';
import {
  currentUserId,
  DATE_TEXT,
  LIBRARY_URI,
  PLAYABLE_URI,
  sourceRefOf,
  spotifyIdOf,
  toTrackFilter,
} from './tool-kit.js';

describe('tool kit', () => {
  it('extracts ids from ids, URIs and links, and refuses anything else', () => {
    expect(spotifyIdOf('37i9dQZF1DXcBWIGoYBM5M', 'playlist')).toBe('37i9dQZF1DXcBWIGoYBM5M');
    expect(spotifyIdOf('spotify:playlist:abc', 'playlist')).toBe('abc');
    expect(spotifyIdOf('https://open.spotify.com/intl-pt/playlist/abc?si=1', 'playlist')).toBe(
      'abc',
    );
    expect(() => spotifyIdOf('spotify:album:abc', 'playlist')).toThrow('not a Spotify playlist');
    expect(() => spotifyIdOf('../me/tracks', 'playlist')).toThrow();
  });

  it('builds source refs and filters', () => {
    expect(sourceRefOf({ source: 'liked' })).toEqual({ kind: 'liked' });
    expect(sourceRefOf({ source: 'playlist', playlist_id: 'spotify:playlist:p' })).toEqual({
      kind: 'playlist',
      id: 'p',
    });
    expect(() => sourceRefOf({ source: 'playlist' })).toThrow('playlist_id');
    expect(
      toTrackFilter({ artists: ['a'], year_from: 1990, unavailable_only: true }),
    ).toMatchObject({ artists: ['a'], yearFrom: 1990, unavailableOnly: true });
  });

  it('validates URIs and dates', () => {
    expect(LIBRARY_URI.safeParse('spotify:artist:abc').success).toBe(true);
    expect(PLAYABLE_URI.safeParse('spotify:album:abc').success).toBe(false);
    expect(DATE_TEXT.safeParse('2026-11-01').success).toBe(true);
    expect(DATE_TEXT.safeParse('yesterday').success).toBe(false);
  });

  it('currentUserId comes from the stored account', async () => {
    expect(await currentUserId(await testOwnerDeps(fakeSpotify([])))).toBe('owner-user');
  });
});
