/**
 * List of the Spotify connector tools, in the order Claude sees them: account, catalog and listening, library,
 * playlists, smart previews and plans, backups, playback.
 */
import type { ToolSpec } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import { connectionStatusTool, disconnectTool } from './tools-account.js';
import {
  createBackupTool,
  deleteBackupTool,
  exportBackupTool,
  listBackupsTool,
  previewRestoreTool,
} from './tools-backup.js';
import {
  currentlyPlayingTool,
  getArtistTool,
  recentlyPlayedTool,
  spotifySearchTool,
  topItemsTool,
} from './tools-catalog.js';
import {
  checkLibraryTool,
  listFollowedArtistsTool,
  listLikedTracksTool,
  listSavedAlbumsTool,
  removeFromLibraryTool,
  saveToLibraryTool,
} from './tools-library.js';
import {
  previewCopyLikedTool,
  previewLibraryChangeTool,
  previewOrganizeTool,
  previewStalePlaylistsTool,
} from './tools-organize.js';
import {
  addToQueueTool,
  getQueueTool,
  listDevicesTool,
  pauseTool,
  playbackStateTool,
  playTool,
  seekTool,
  setRepeatTool,
  setShuffleTool,
  setVolumeTool,
  skipTool,
  transferPlaybackTool,
} from './tools-player.js';
import {
  addPlaylistItemsTool,
  createPlaylistFromQueriesTool,
  createPlaylistTool,
  getPlaylistTool,
  listMyPlaylistsTool,
  removePlaylistItemsTool,
  reorderPlaylistItemsTool,
  setPlaylistCoverTool,
  updatePlaylistDetailsTool,
} from './tools-playlists.js';
import {
  applyPlanTool,
  cancelPlanTool,
  previewDedupeTool,
  previewFilterLikedTool,
  previewUnavailableTool,
  syncLibraryTool,
} from './tools-smart.js';

/** All Spotify connector tools, in the order Claude sees them. */
export const SPOTIFY_TOOLS: readonly ToolSpec<OwnerDeps>[] = [
  connectionStatusTool,
  disconnectTool,
  spotifySearchTool,
  getArtistTool,
  currentlyPlayingTool,
  recentlyPlayedTool,
  topItemsTool,
  listLikedTracksTool,
  listSavedAlbumsTool,
  listFollowedArtistsTool,
  saveToLibraryTool,
  removeFromLibraryTool,
  checkLibraryTool,
  listMyPlaylistsTool,
  getPlaylistTool,
  createPlaylistTool,
  createPlaylistFromQueriesTool,
  updatePlaylistDetailsTool,
  addPlaylistItemsTool,
  removePlaylistItemsTool,
  reorderPlaylistItemsTool,
  setPlaylistCoverTool,
  syncLibraryTool,
  previewFilterLikedTool,
  previewDedupeTool,
  previewUnavailableTool,
  previewCopyLikedTool,
  previewOrganizeTool,
  previewStalePlaylistsTool,
  previewLibraryChangeTool,
  applyPlanTool,
  cancelPlanTool,
  createBackupTool,
  listBackupsTool,
  exportBackupTool,
  previewRestoreTool,
  deleteBackupTool,
  playbackStateTool,
  listDevicesTool,
  playTool,
  pauseTool,
  skipTool,
  seekTool,
  setVolumeTool,
  setShuffleTool,
  setRepeatTool,
  getQueueTool,
  addToQueueTool,
  transferPlaybackTool,
];
