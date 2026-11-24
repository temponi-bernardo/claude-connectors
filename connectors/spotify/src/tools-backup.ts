/**
 * Backup tools: back up Liked Songs or a playlist as JSON in the user's vault, list and export backups page by
 * page, plan a restore (re-like tracks, re-follow items, recreate playlists as new ones) and delete backups.
 */
import { z } from 'zod';
import {
  CREATE_HINTS,
  DESTRUCTIVE_HINTS,
  READ_ONLY_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import {
  backupPage,
  deleteBackup,
  listBackups,
  requireBackup,
  saveBackup,
  toBackupTrack,
  type StoredBackup,
} from './backups.js';
import type { OwnerDeps } from './context.js';
import type { PlanStep } from './plans.js';
import { isLoading, loadCompleteSource } from './sources.js';
import { playlistBefore, type PlanDraft } from './smart.js';
import { SOURCE_SHAPE, sourceRefOf } from './tool-kit.js';
import { previewDraft } from './tools-smart.js';

/** Backup ids look like this (9 random bytes in base64url). */
export const BACKUP_ID = z.string().regex(/^[\w-]{12}$/, 'Expected a backup_id from list_backups.');

/** Restore steps of a backup: re-save liked and library items; recreate each playlist as a NEW playlist. */
export function restoreSteps(backup: StoredBackup): PlanStep[] {
  const { content } = backup;
  const uris = [...(content.liked ?? []), ...(content.library ?? [])].map((t) => t.uri);
  const steps: PlanStep[] = uris.length > 0 ? [{ kind: 'library_save', uris }] : [];
  for (const playlist of content.playlists ?? []) {
    steps.push({
      kind: 'playlist_create',
      name: `${playlist.name} (restored)`.slice(0, 100),
      description: `Restored from backup ${backup.createdAt.slice(0, 10)}.`,
      isPublic: false,
      uris: playlist.tracks.map((t) => t.uri).filter((uri) => !uri.startsWith('spotify:local:')),
    });
  }
  return steps;
}

/** Restore plan draft of a backup, with what comes back and the caveats. */
export function restoreDraft(backup: StoredBackup): PlanDraft {
  const { content } = backup;
  const details = {
    backup_id: backup.id,
    label: backup.label,
    liked: content.liked?.length ?? 0,
    library_items: content.library?.length ?? 0,
    playlists: (content.playlists ?? []).map((p) => ({ name: p.name, items: p.tracks.length })),
    note: "Liked dates cannot be restored: re-liked tracks get today's date. Playlists come back as new playlists; the originals are not touched.",
  };
  return {
    title: `Restore backup "${backup.label}"`,
    steps: restoreSteps(backup),
    before: null,
    details,
  };
}

/** `create_backup`: backs up Liked Songs or a playlist. */
export const createBackupTool = defineTool({
  name: 'create_backup',
  description:
    'Saves a JSON backup of Liked Songs or one of your playlists in the connector (kept until deleted; the newest 10 are kept). Large libraries take several calls: repeat while status is "loading". Backups also happen automatically before any batch removal.',
  shape: { ...SOURCE_SHAPE },
  annotations: toolAnnotations('Create backup', CREATE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const ref = sourceRefOf(args);
    const loaded = await loadCompleteSource(deps, ref);
    if (isLoading(loaded)) return loaded;
    const label = `${loaded.name} (${new Date(deps.now()).toISOString().slice(0, 10)})`;
    const content =
      ref.kind === 'liked'
        ? { label, liked: loaded.tracks.map(toBackupTrack) }
        : { ...playlistBefore(loaded, ref.id, label) };
    return { backup: await saveBackup(deps, content) };
  },
});

/** `list_backups`. */
export const listBackupsTool = defineTool({
  name: 'list_backups',
  description:
    'Lists your backups (manual and automatic) with id, label, date and counts, newest last.',
  shape: {},
  annotations: toolAnnotations('List backups', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => ({ backups: await listBackups(deps) }),
});

/** `export_backup`: one page of a backup as JSON. */
export const exportBackupTool = defineTool({
  name: 'export_backup',
  description:
    'Returns a page of a backup as JSON (section liked, playlists or library; up to 500 entries). Use next_offset to export everything, e.g. into a file the user keeps.',
  shape: {
    backup_id: BACKUP_ID,
    section: z.enum(['liked', 'playlists', 'library']).default('liked'),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(500).default(200),
  },
  annotations: toolAnnotations('Export backup', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => backupPage(await requireBackup(deps, args.backup_id), args),
});

/** `preview_restore`: plans restoring a backup. */
export const previewRestoreTool = defineTool({
  name: 'preview_restore',
  description:
    'Plans restoring a backup: re-likes its tracks, re-follows its library items and recreates its playlists as NEW playlists (nothing is deleted). Run with apply_plan after the user agrees.',
  shape: { backup_id: BACKUP_ID },
  annotations: toolAnnotations('Preview restore', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) =>
    previewDraft(deps, restoreDraft(await requireBackup(deps, args.backup_id))),
});

/** `delete_backup`. */
export const deleteBackupTool = defineTool({
  name: 'delete_backup',
  description: 'Deletes one backup for good. Confirm with the user first.',
  shape: { backup_id: BACKUP_ID },
  annotations: toolAnnotations('Delete backup', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => ({ deleted: await deleteBackup(deps, args.backup_id) }),
});
