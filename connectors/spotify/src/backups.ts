/**
 * JSON backups of Liked Songs, playlists and library items in the user's vault: saved automatically before any
 * batch removal and on request, listed, exported page by page and turned into restore steps.
 */
import { randomToken } from '../../../src/remote/worker-kit.js';
import type { AddedTrack, PlaylistInfo } from './catalog.js';
import type { OwnerDeps } from './context.js';
import type { BackupContent, BackupPlaylist, BackupTrack } from './plans.js';
import { deleteVault, readVault, vaultOf, writeVault } from './vault.js';

/** Vault types of the backup index and of each backup. */
export const BACKUP_INDEX_TYP = 'backups';
export const BACKUP_TYP = 'backup';

/** Most backups kept per user (the oldest are deleted). */
export const MAX_BACKUPS = 10;

/** A backup as listed in the index. */
export interface BackupEntry {
  readonly id: string;
  readonly label: string;
  readonly createdAt: string;
  readonly liked: number;
  readonly playlists: number;
  readonly library: number;
}

/** A stored backup: its index entry plus the content. */
export interface StoredBackup extends BackupEntry {
  readonly content: BackupContent;
}

/** A track as a backup keeps it. */
export function toBackupTrack(track: AddedTrack): BackupTrack {
  return {
    uri: track.uri,
    name: track.name,
    artists: track.artists.map((a) => a.name).join(', '),
    addedAt: track.addedAt,
  };
}

/** A playlist and its items as a backup keeps them. */
export function toBackupPlaylist(
  info: PlaylistInfo,
  tracks: readonly AddedTrack[],
): BackupPlaylist {
  return {
    id: info.id,
    name: info.name,
    description: info.description,
    isPublic: info.isPublic,
    tracks: tracks.map(toBackupTrack),
  };
}

/** Index entry of a backup content. */
export function backupEntry(id: string, content: BackupContent, createdAt: string): BackupEntry {
  return {
    id,
    label: content.label,
    createdAt,
    liked: content.liked?.length ?? 0,
    playlists: content.playlists?.length ?? 0,
    library: content.library?.length ?? 0,
  };
}

/** Reads the user's backup index (newest last). */
export async function listBackups(deps: OwnerDeps): Promise<BackupEntry[]> {
  const data = await readVault(vaultOf(deps), { typ: BACKUP_INDEX_TYP, owner: deps.owner });
  return Array.isArray(data) ? (data as BackupEntry[]) : [];
}

/** Saves a backup, prunes the oldest beyond `MAX_BACKUPS` and returns its entry. */
export async function saveBackup(deps: OwnerDeps, content: BackupContent): Promise<BackupEntry> {
  const entry = backupEntry(randomToken(9), content, new Date(deps.now()).toISOString());
  const vault = vaultOf(deps);
  await writeVault(
    vault,
    { typ: BACKUP_TYP, owner: deps.owner, id: entry.id },
    { ...entry, content },
  );
  const all = [...(await listBackups(deps)), entry];
  const dropped = all.slice(0, Math.max(0, all.length - MAX_BACKUPS));
  for (const old of dropped)
    await deleteVault(vault, { typ: BACKUP_TYP, owner: deps.owner, id: old.id });
  await writeVault(vault, { typ: BACKUP_INDEX_TYP, owner: deps.owner }, all.slice(dropped.length));
  return entry;
}

/** Reads a backup by id or explains that it does not exist. */
export async function requireBackup(deps: OwnerDeps, id: string): Promise<StoredBackup> {
  const data = await readVault(vaultOf(deps), { typ: BACKUP_TYP, owner: deps.owner, id });
  if (data === null)
    throw new Error(`Backup ${id} does not exist. Use list_backups to see the ids.`);
  return data as StoredBackup;
}

/** Deletes one backup and its index entry. */
export async function deleteBackup(deps: OwnerDeps, id: string): Promise<boolean> {
  const all = await listBackups(deps);
  if (!all.some((entry) => entry.id === id)) return false;
  const vault = vaultOf(deps);
  await deleteVault(vault, { typ: BACKUP_TYP, owner: deps.owner, id });
  const rest = all.filter((entry) => entry.id !== id);
  await writeVault(vault, { typ: BACKUP_INDEX_TYP, owner: deps.owner }, rest);
  return true;
}

/** Deletes every backup of the user (used by `disconnect`); returns how many. */
export async function deleteAllBackups(deps: OwnerDeps): Promise<number> {
  const all = await listBackups(deps);
  const vault = vaultOf(deps);
  for (const entry of all)
    await deleteVault(vault, { typ: BACKUP_TYP, owner: deps.owner, id: entry.id });
  await deleteVault(vault, { typ: BACKUP_INDEX_TYP, owner: deps.owner });
  return all.length;
}

/** Backup page request of `backupPage`. */
export interface BackupPageRequest {
  readonly section: 'liked' | 'playlists' | 'library';
  readonly offset: number;
  readonly limit: number;
}

/** One page of a backup's content as JSON-ready data (`section` = liked, playlists or library). */
export function backupPage(backup: StoredBackup, page: BackupPageRequest): Record<string, unknown> {
  const list: readonly unknown[] = backup.content[page.section] ?? [];
  const end = Math.min(list.length, page.offset + page.limit);
  return {
    backup_id: backup.id,
    label: backup.label,
    created_at: backup.createdAt,
    section: page.section,
    total: list.length,
    offset: page.offset,
    items: list.slice(page.offset, end),
    next_offset: end < list.length ? end : null,
  };
}
