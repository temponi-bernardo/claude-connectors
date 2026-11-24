/**
 * Fake Spotify for tests: a routed `fetch` (accounts token endpoint + Web API) that records every call, catalog
 * JSON builders and connector dependencies over an in-memory KV. Every token, id and name here is fictitious.
 */
import { FakeKv } from '../../../../src/remote/fixtures/fake-kv.js';
import type { Fetcher } from '../../../../src/remote/worker-kit.js';
import { saveAccount, type SpotifyAccount } from '../account-store.js';
import type { SpotifySettings } from '../config.js';
import type { OwnerDeps, SpotifyDeps } from '../context.js';
import { vaultOf } from '../vault.js';

/** Test seal key (32 bytes). */
export const TEST_KEY = Buffer.alloc(32, 9);

/** Fixed test time (ms). */
export const TEST_NOW = 1_780_000_000_000;

/** Worker origin in tests. */
export const TEST_ORIGIN = 'https://spotify.test';

/** Test settings. */
export const TEST_SETTINGS: SpotifySettings = { tokenKey: TEST_KEY, callBudget: 40 };

/** Connector user in tests. */
export const TEST_OWNER = 'spotify_acc-owner';

/** App credentials in tests (32 hex). */
export const TEST_APP = { clientId: 'a'.repeat(32), clientSecret: 'b'.repeat(32) };

/** Stored account of the test user. */
export const TEST_ACCOUNT: SpotifyAccount = {
  ...TEST_APP,
  spotifyUserId: 'owner-user',
  displayName: 'Owner',
  refreshToken: 'refresh-owner',
  scope: 'user-library-read user-library-modify',
  authorizedAt: TEST_NOW - 1000,
};

/** A recorded call. */
export interface SpotifyCallRecord {
  readonly method: string;
  readonly url: URL;
  readonly body: string;
  readonly headers: Headers;
}

/** A route: method, path regex (matched on pathname) and handler. */
export type SpotifyRoute = readonly [
  string,
  RegExp,
  (call: SpotifyCallRecord) => Response | Promise<Response>,
];

/** Routed fake `fetch`; unknown routes answer 404 JSON. The token endpoint answers by default. */
export function fakeSpotify(
  routes: readonly SpotifyRoute[],
  calls: SpotifyCallRecord[] = [],
): Fetcher {
  return async (input, init) => {
    const call: SpotifyCallRecord = {
      method: init?.method ?? 'GET',
      url: new URL(input),
      body: typeof init?.body === 'string' ? init.body : '',
      headers: new Headers(init?.headers),
    };
    calls.push(call);
    const route = routes.find(([m, p]) => m === call.method && p.test(call.url.pathname));
    if (route) return route[2](call);
    if (call.url.pathname === '/api/token') return tokenResponse(call);
    return Response.json({ error: { status: 404, message: 'Not found' } }, { status: 404 });
  };
}

/** Default token endpoint: the access token names the refresh token used. */
export function tokenResponse(call: SpotifyCallRecord): Response {
  const form = new URLSearchParams(call.body);
  const refresh = form.get('refresh_token') ?? 'code';
  return Response.json({
    access_token: `at-${refresh}`,
    expires_in: 3600,
    scope: 'user-library-read',
  });
}

/** Connector dependencies (no user) over the given fetch. */
export function testSpotifyDeps(
  fetch: Fetcher,
  kv: FakeKv = new FakeKv(),
): SpotifyDeps & { kv: FakeKv; slept: number[] } {
  const slept: number[] = [];
  kv.now = () => TEST_NOW;
  return {
    settings: TEST_SETTINGS,
    kv,
    fetch,
    now: () => TEST_NOW,
    sleep: (ms) => {
      slept.push(ms);
      return Promise.resolve();
    },
    origin: TEST_ORIGIN,
    slept,
  };
}

/** Dependencies of an authenticated user, with a stored account. */
export async function testOwnerDeps(
  fetch: Fetcher,
  options: {
    readonly owner?: string;
    readonly budget?: number;
    readonly kv?: FakeKv;
    readonly account?: SpotifyAccount | null;
  } = {},
): Promise<OwnerDeps & { kv: FakeKv; slept: number[] }> {
  const base = testSpotifyDeps(fetch, options.kv);
  const deps = {
    ...base,
    owner: options.owner ?? TEST_OWNER,
    budget: { remaining: options.budget ?? 40 },
  };
  const account = options.account === undefined ? TEST_ACCOUNT : options.account;
  if (account !== null) await saveAccount(vaultOf(deps), deps.owner, account);
  return deps;
}

/** Track JSON. */
export function trackJson(
  id: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    uri: `spotify:track:${id}`,
    id,
    type: 'track',
    name: `Song ${id}`,
    duration_ms: 200_000,
    artists: [{ id: `ar-${id}`, name: `Artist ${id}` }],
    album: { name: `Album ${id}`, release_date: '1994-03-08' },
    is_playable: true,
    external_ids: { isrc: `ISRC${id}` },
    ...extra,
  };
}

/** Saved/playlist entry JSON. */
export function entryJson(
  track: Record<string, unknown>,
  addedAt = '2024-01-01T00:00:00Z',
): Record<string, unknown> {
  return { added_at: addedAt, item: track };
}

/** Paging object JSON for a slice of items. */
export function pageJson(all: readonly unknown[], url: URL): Record<string, unknown> {
  const offset = Number(url.searchParams.get('offset') ?? 0);
  const limit = Number(url.searchParams.get('limit') ?? 20);
  const items = all.slice(offset, offset + limit);
  const next =
    offset + limit < all.length ? `${url.origin}${url.pathname}?offset=${offset + limit}` : null;
  return { items, total: all.length, offset, limit, next };
}

/** Route that serves a paged list at a path. */
export function pagedRoute(path: RegExp, all: readonly unknown[]): SpotifyRoute {
  return ['GET', path, (call) => Response.json(pageJson(all, call.url))];
}

/** Playlist JSON. */
export function playlistJson(
  id: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id,
    uri: `spotify:playlist:${id}`,
    name: `List ${id}`,
    description: '',
    owner: { id: 'owner-user', display_name: 'Owner' },
    public: false,
    collaborative: false,
    snapshot_id: `snap-${id}`,
    items: { total: 0 },
    ...extra,
  };
}
