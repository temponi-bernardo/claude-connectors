/**
 * A fake Spotify library for smart-operation tests: Liked Songs and playlists that the add/replace/remove and
 * library endpoints really change, plus artists with genres. Fictitious data.
 */
import {
  entryJson,
  pageJson,
  playlistJson,
  trackJson,
  type SpotifyCallRecord,
  type SpotifyRoute,
} from './fake-spotify.js';

/** Mutable library state. */
export interface LibraryState {
  liked: { id: string; extra: Record<string, unknown>; addedAt: string }[];
  playlists: Record<string, string[]>;
  genres: Record<string, string[]>;
  created: number;
}

/** Track id of a URI. */
function idOf(uri: string): string {
  return uri.slice(uri.lastIndexOf(':') + 1);
}

/** Routes of the fake library. */
export function libraryRoutes(state: LibraryState): SpotifyRoute[] {
  const pid = (c: SpotifyCallRecord): string => c.url.pathname.split('/')[3] ?? '';
  const body = (c: SpotifyCallRecord) =>
    JSON.parse(c.body || '{}') as { uris?: string[]; items?: { uri: string }[] };
  const likedJson = () => state.liked.map((t) => entryJson(trackJson(t.id, t.extra), t.addedAt));
  const uris = (c: SpotifyCallRecord) =>
    (c.url.searchParams.get('uris') ?? '').split(',').filter(Boolean);
  return [
    ['GET', /^\/v1\/me\/tracks$/, (c) => Response.json(pageJson(likedJson(), c.url))],
    [
      'DELETE',
      /^\/v1\/me\/library$/,
      (c) => {
        const gone = new Set(uris(c).map(idOf));
        state.liked = state.liked.filter((t) => !gone.has(t.id));
        return new Response(null);
      },
    ],
    [
      'PUT',
      /^\/v1\/me\/library$/,
      (c) => {
        for (const u of uris(c))
          if (u.startsWith('spotify:track:') && !state.liked.some((t) => t.id === idOf(u)))
            state.liked.unshift({ id: idOf(u), extra: {}, addedAt: 'now' });
        return new Response(null);
      },
    ],
    [
      'GET',
      /^\/v1\/artists\/[^/]+$/,
      (c) => Response.json({ genres: state.genres[c.url.pathname.split('/')[3] ?? ''] ?? [] }),
    ],
    [
      'GET',
      /^\/v1\/me\/playlists$/,
      (c) =>
        Response.json(
          pageJson(
            Object.keys(state.playlists).map((id) =>
              playlistJson(id, {
                snapshot_id: `${id}-${(state.playlists[id] ?? []).length}`,
                items: { total: (state.playlists[id] ?? []).length },
              }),
            ),
            c.url,
          ),
        ),
    ],
    [
      'GET',
      /^\/v1\/playlists\/[^/]+$/,
      (c) =>
        state.playlists[pid(c)]
          ? Response.json(
              playlistJson(pid(c), {
                snapshot_id: `${pid(c)}-${(state.playlists[pid(c)] ?? []).length}`,
              }),
            )
          : Response.json({ error: { status: 404 } }, { status: 404 }),
    ],
    [
      'GET',
      /\/items$/,
      (c) =>
        Response.json(
          pageJson(
            (state.playlists[pid(c)] ?? []).map((u) => entryJson(trackJson(idOf(u)), '2020-01-01')),
            c.url,
          ),
        ),
    ],
    [
      'POST',
      /\/items$/,
      (c) => {
        state.playlists[pid(c)] = [...(state.playlists[pid(c)] ?? []), ...(body(c).uris ?? [])];
        return Response.json({ snapshot_id: 's' });
      },
    ],
    [
      'PUT',
      /\/items$/,
      (c) => {
        state.playlists[pid(c)] = [...(body(c).uris ?? [])];
        return Response.json({ snapshot_id: 's' });
      },
    ],
    [
      'DELETE',
      /\/items$/,
      (c) => {
        const gone = new Set((body(c).items ?? []).map((i) => i.uri));
        state.playlists[pid(c)] = (state.playlists[pid(c)] ?? []).filter((u) => !gone.has(u));
        return Response.json({ snapshot_id: 's' });
      },
    ],
    [
      'POST',
      /^\/v1\/me\/playlists$/,
      () => {
        state.created += 1;
        const id = `created${state.created}`;
        state.playlists[id] = [];
        return Response.json({ id });
      },
    ],
  ];
}
