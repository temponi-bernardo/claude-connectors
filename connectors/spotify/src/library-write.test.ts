import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { fakeSpotify, testOwnerDeps, type SpotifyCallRecord } from './fixtures/fake-spotify.js';
import {
  chunkList,
  isArtistUri,
  libraryContains,
  SPOTIFY_URI_PATTERN,
  uriId,
  writeArtistFollows,
  writeLibraryChunk,
  writeLibraryUris,
} from './library-write.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function ok(): Response {
  return new Response(null, { status: 200 });
}

describe('library writes (2026 /me/library)', () => {
  it('saves and removes with PUT/DELETE /me/library?uris=', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          ['PUT', /\/v1\/me\/library$/, ok],
          ['DELETE', /\/v1\/me\/library$/, ok],
        ],
        calls,
      ),
    );
    await writeLibraryUris(deps, 'save', ['spotify:track:a', 'spotify:album:b']);
    await writeLibraryUris(deps, 'remove', ['spotify:track:a']);
    const api = calls.filter((c) => c.url.pathname === '/v1/me/library');
    expect(api.map((c) => c.method)).toEqual(['PUT', 'DELETE']);
    expect(api[0]?.url.searchParams.get('uris')).toBe('spotify:track:a,spotify:album:b');
  });

  it('sends artists apart and falls back to /me/following when /me/library rejects them', async () => {
    const calls: SpotifyCallRecord[] = [];
    function library(c: SpotifyCallRecord): Response {
      return c.url.searchParams.get('uris')?.includes('artist')
        ? new Response('', { status: 400 })
        : ok();
    }
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          ['PUT', /\/v1\/me\/library$/, library],
          ['PUT', /\/v1\/me\/following$/, ok],
        ],
        calls,
      ),
    );
    await writeLibraryChunk(deps, 'save', [
      'spotify:track:t',
      'spotify:artist:a1',
      'spotify:artist:a2',
    ]);
    const following = calls.find((c) => c.url.pathname === '/v1/me/following');
    expect(following?.url.searchParams.get('type')).toBe('artist');
    expect(following?.url.searchParams.get('ids')).toBe('a1,a2');
  });

  it('does not fall back on other errors', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['DELETE', /\/v1\/me\/library$/, () => new Response('', { status: 403 })]]),
    );
    await expect(writeArtistFollows(deps, 'remove', ['spotify:artist:a'])).rejects.toThrow('403');
  });

  it('checks containment', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /\/v1\/me\/library\/contains$/, () => Response.json([true, false])]]),
    );
    expect(await libraryContains(deps, ['spotify:track:a', 'spotify:track:b'])).toEqual([
      true,
      false,
    ]);
    const odd = await testOwnerDeps(
      fakeSpotify([['GET', /\/v1\/me\/library\/contains$/, () => Response.json({})]]),
    );
    expect(await libraryContains(odd, ['spotify:track:a'])).toEqual([false]);
  });

  it('helpers', () => {
    expect(SPOTIFY_URI_PATTERN.test('spotify:user:some.user_1')).toBe(true);
    expect(SPOTIFY_URI_PATTERN.test('spotify:local:x')).toBe(false);
    expect(isArtistUri('spotify:artist:a')).toBe(true);
    expect(uriId('spotify:artist:abc')).toBe('abc');
    expect(chunkList([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});
