/**
 * Resumable snapshots of a track source — Liked Songs or one playlist — in the user's vault. Large libraries
 * take several tool calls: each call reads what the budget allows and saves where it stopped. Liked Songs are
 * re-read after 15 minutes; a playlist when its `snapshot_id` changes.
 */
import { asJsonObject } from '../../../src/remote/streamed-tool.js';
import { parseAddedTrack, parsePlaylist, type AddedTrack, type PlaylistInfo } from './catalog.js';
import type { OwnerDeps } from './context.js';
import { collectOffsetPages } from './paging.js';
import { spotifyCall } from './spotify-api.js';
import { deleteVault, readVault, vaultOf, writeVault } from './vault.js';

/** Vault type of source snapshots. */
export const SCAN_TYP = 'scan';

/** Age after which a Liked Songs snapshot is read again (ms). */
export const LIKED_FRESH_MS = 15 * 60 * 1000;

/** Seconds a snapshot stays in KV (it is only a working copy for previews). */
export const SCAN_TTL_SECONDS = 24 * 3600;

/** Most items a snapshot keeps. */
export const MAX_SOURCE_ITEMS = 20_000;

/** Page sizes of the Web API (max `limit` of each endpoint). */
export const LIKED_PAGE_SIZE = 50;
export const PLAYLIST_PAGE_SIZE = 50;

/** Liked Songs or one playlist (by id). */
export type SourceRef =
  { readonly kind: 'liked' } | { readonly kind: 'playlist'; readonly id: string };

/** What was read from a source and where to continue (`nextOffset` null = complete). */
export interface SourceSnapshot {
  readonly key: string;
  readonly name: string;
  readonly snapshotId: string;
  readonly startedAt: number;
  readonly total: number;
  readonly nextOffset: number | null;
  readonly tracks: readonly AddedTrack[];
}

/** Answer of a tool while a source is still loading. */
export interface LoadingStatus {
  readonly status: 'loading';
  readonly loaded: number;
  readonly total: number;
  readonly message: string;
}

/** Vault id of a source. */
export function sourceKey(ref: SourceRef): string {
  return ref.kind === 'liked' ? 'liked' : `playlist-${ref.id}`;
}

/** Web API path and query of a source's items (`market=from_token` fills `is_playable`). */
export function sourceRequest(ref: SourceRef): { path: string; query: Record<string, string> } {
  if (ref.kind === 'liked') return { path: '/me/tracks', query: { market: 'from_token' } };
  return {
    path: `/playlists/${encodeURIComponent(ref.id)}/items`,
    query: { market: 'from_token', additional_types: 'track,episode' },
  };
}

/** Reads a playlist's details (one request). */
export async function fetchPlaylistInfo(deps: OwnerDeps, id: string): Promise<PlaylistInfo> {
  const body = await spotifyCall(deps, { path: `/playlists/${encodeURIComponent(id)}` });
  const playlist = parsePlaylist(body);
  if (!playlist) throw new Error(`Spotify returned no playlist for id ${id}.`);
  return playlist;
}

/** Tells whether a saved snapshot can be continued or reused (same playlist version, or fresh Liked Songs). */
export function isSnapshotReusable(
  saved: SourceSnapshot | null,
  current: { readonly snapshotId: string; readonly now: number },
): saved is SourceSnapshot {
  if (!saved) return false;
  if (saved.key === 'liked') return current.now - saved.startedAt < LIKED_FRESH_MS;
  return saved.snapshotId === current.snapshotId;
}

/** An empty snapshot to start reading a source. */
export function emptySnapshot(
  ref: SourceRef,
  info: { readonly name: string; readonly snapshotId: string; readonly now: number },
): SourceSnapshot {
  return {
    key: sourceKey(ref),
    name: info.name,
    snapshotId: info.snapshotId,
    startedAt: info.now,
    total: 0,
    nextOffset: 0,
    tracks: [],
  };
}

/** Reads the next pages of a source within the budget and returns the grown snapshot. */
export async function advanceSnapshot(
  deps: OwnerDeps,
  ref: SourceRef,
  snapshot: SourceSnapshot,
): Promise<SourceSnapshot> {
  if (snapshot.nextOffset === null) return snapshot;
  const pageSize = ref.kind === 'liked' ? LIKED_PAGE_SIZE : PLAYLIST_PAGE_SIZE;
  const maxItems = Math.max(1, MAX_SOURCE_ITEMS - snapshot.tracks.length);
  const read = await collectOffsetPages(deps, {
    ...sourceRequest(ref),
    offset: snapshot.nextOffset,
    pageSize,
    maxItems,
  });
  const tracks = read.items.map(parseAddedTrack).filter((t): t is AddedTrack => t !== null);
  const full = snapshot.tracks.length + read.items.length >= MAX_SOURCE_ITEMS;
  const nextOffset = full ? null : read.nextOffset;
  return { ...snapshot, total: read.total, nextOffset, tracks: [...snapshot.tracks, ...tracks] };
}

/** Current version and name of a source (Liked Songs have no version: one request saved). */
export async function sourceVersion(
  deps: OwnerDeps,
  ref: SourceRef,
): Promise<{ name: string; snapshotId: string }> {
  if (ref.kind === 'liked') return { name: 'Liked Songs', snapshotId: '' };
  const info = await fetchPlaylistInfo(deps, ref.id);
  return { name: info.name, snapshotId: info.snapshotId };
}

/** Loads (and continues) a source snapshot, saving progress; `refresh` starts over. */
export async function loadSource(
  deps: OwnerDeps,
  ref: SourceRef,
  refresh = false,
): Promise<SourceSnapshot> {
  const vaultRef = { typ: SCAN_TYP, owner: deps.owner, id: sourceKey(ref) };
  const saved = refresh
    ? null
    : ((await readVault(vaultOf(deps), vaultRef)) as SourceSnapshot | null);
  const version = await sourceVersion(deps, ref);
  const now = deps.now();
  const start = isSnapshotReusable(saved, { snapshotId: version.snapshotId, now })
    ? saved
    : emptySnapshot(ref, { ...version, now });
  if (start.nextOffset === null) return start;
  const snapshot = await advanceSnapshot(deps, ref, start);
  await writeVault(vaultOf(deps), { ...vaultRef, ttlSeconds: SCAN_TTL_SECONDS }, snapshot);
  return snapshot;
}

/** Loading answer for an incomplete snapshot. */
export function loadingStatus(snapshot: SourceSnapshot): LoadingStatus {
  return {
    status: 'loading',
    loaded: snapshot.tracks.length,
    total: snapshot.total,
    message: `Loaded ${snapshot.tracks.length} of ${snapshot.total} items of "${snapshot.name}". Call the same tool again with the same arguments to continue (each call reads what its request budget allows).`,
  };
}

/** Loads a source and returns it only when complete; otherwise the loading answer. */
export async function loadCompleteSource(
  deps: OwnerDeps,
  ref: SourceRef,
  refresh = false,
): Promise<SourceSnapshot | LoadingStatus> {
  const snapshot = await loadSource(deps, ref, refresh);
  return snapshot.nextOffset === null ? snapshot : loadingStatus(snapshot);
}

/** Tells whether a value is the loading answer. */
export function isLoading(value: unknown): value is LoadingStatus {
  return asJsonObject(value)?.status === 'loading';
}

/** Forgets a source snapshot (after changes, so the next preview reads Spotify again). */
export async function forgetSource(deps: OwnerDeps, ref: SourceRef): Promise<void> {
  await deleteVault(vaultOf(deps), { typ: SCAN_TYP, owner: deps.owner, id: sourceKey(ref) });
}
