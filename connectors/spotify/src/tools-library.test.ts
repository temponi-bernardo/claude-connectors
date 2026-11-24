import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { parseAddedTrack, type AddedTrack } from './catalog.js';
import {
  entryJson,
  fakeSpotify,
  pagedRoute,
  testOwnerDeps,
  trackJson,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  checkLibraryTool,
  listFollowedArtistsTool,
  listLikedTracksTool,
  listSavedAlbumsTool,
  removeFromLibraryTool,
  saveToLibraryTool,
  withGenres,
} from './tools-library.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

const LIKED = Array.from({ length: 3 }, (_, i) =>
  entryJson(trackJson(`t${i}`), `2026-0${i + 1}-01T00:00:00Z`),
);
const artistRoute = [
  'GET',
  /^\/v1\/artists\/[^/]+$/,
  () => Response.json({ genres: ['grunge'] }),
] as const;

describe('library tools', () => {
  it('list_liked_tracks pages with the date liked and, on request, genres', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, LIKED), artistRoute]),
    );
    const page = (await listLikedTracksTool.run(deps, { limit: 2 })) as {
      total: number;
      next_offset: number;
      items: { added_at: string }[];
    };
    expect(page).toMatchObject({ total: 3, next_offset: 2 });
    expect(page.items[0]?.added_at).toBe('2026-01-01T00:00:00Z');
    const withG = (await listLikedTracksTool.run(deps, { with_genres: true })) as {
      items: { genres: string[] }[];
    };
    expect(withG.items[0]?.genres).toEqual(['grunge']);
  });

  it('withGenres reports artists left when the budget runs out', async () => {
    const deps = await testOwnerDeps(fakeSpotify([artistRoute]), { budget: 2 });
    const tracks = LIKED.map(parseAddedTrack) as AddedTrack[];
    const out = await withGenres(deps, tracks);
    expect(out.genresMissing).toBe(2);
    const listed = await testOwnerDeps(
      fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, LIKED), artistRoute]),
      { budget: 3 },
    );
    clearSpotifyTokenCache();
    expect(await listLikedTracksTool.run(listed, { with_genres: true })).toHaveProperty(
      'genres_pending_artists',
    );
  });

  it('lists saved albums and followed artists with the cursor', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([
        [
          'GET',
          /\/v1\/me\/albums$/,
          () =>
            Response.json({
              items: [
                {
                  added_at: 'd',
                  album: { uri: 'spotify:album:a', type: 'album', name: 'Superunknown' },
                },
              ],
              total: 1,
            }),
        ],
        [
          'GET',
          /\/v1\/me\/following$/,
          () =>
            Response.json({
              artists: {
                items: [{ uri: 'spotify:artist:a', type: 'artist', name: 'A' }],
                total: 9,
                cursors: { after: 'next1' },
              },
            }),
        ],
      ]),
    );
    expect(await listSavedAlbumsTool.run(deps, {})).toMatchObject({
      items: [{ name: 'Superunknown', added_at: 'd' }],
    });
    expect(await listFollowedArtistsTool.run(deps, { after: 'abc' })).toMatchObject({
      total: 9,
      after: 'next1',
    });
    expect(await listFollowedArtistsTool.run(deps, {})).toMatchObject({ items: [{ name: 'A' }] });
  });

  it('saves, removes and checks up to 40 URIs, and refuses more or bad URIs', async () => {
    const calls: SpotifyCallRecord[] = [];
    function ok(): Response {
      return new Response(null);
    }
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          ['PUT', /\/v1\/me\/library$/, ok],
          ['DELETE', /\/v1\/me\/library$/, ok],
          ['GET', /contains$/, () => Response.json([true])],
        ],
        calls,
      ),
    );
    expect(await saveToLibraryTool.run(deps, { uris: ['spotify:track:a'] })).toEqual({ saved: 1 });
    expect(await removeFromLibraryTool.run(deps, { uris: ['spotify:album:b'] })).toMatchObject({
      removed: 1,
      backup_id: expect.any(String) as unknown,
    });
    expect(await checkLibraryTool.run(deps, { uris: ['spotify:track:a'] })).toEqual({
      items: [{ uri: 'spotify:track:a', in_library: true }],
    });
    const many = Array.from({ length: 41 }, (_, i) => `spotify:track:t${i}`);
    await expect(saveToLibraryTool.run(deps, { uris: many })).rejects.toThrow();
    await expect(saveToLibraryTool.run(deps, { uris: ['https://evil'] })).rejects.toThrow();
  });
});
