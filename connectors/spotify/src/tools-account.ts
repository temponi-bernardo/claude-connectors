/**
 * Account tools: the connection's state (who, which app, when the authorization expires) and `disconnect`,
 * which erases everything the connector stored for the user and revokes Claude's grants.
 */
import { z } from 'zod';
import {
  DESTRUCTIVE_HINTS,
  READ_ONLY_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import { maskCredential, refreshExpiryIso } from './account-store.js';
import { forgetSpotifyAccessToken, requireAccount } from './access-token.js';
import type { OwnerDeps } from './context.js';
import { eraseOwner } from './vault.js';

/** Where a user removes the app's access on Spotify's side (there is no revocation API). */
export const SPOTIFY_APPS_PAGE = 'https://www.spotify.com/account/apps/';

/** Revokes every Claude grant of the user on this connector; returns how many. */
export async function revokeClaudeGrants(deps: OwnerDeps): Promise<number> {
  if (!deps.oauth) return 0;
  let revoked = 0;
  let cursor: string | undefined;
  do {
    const page = await deps.oauth.listUserGrants(
      deps.owner,
      cursor === undefined ? {} : { cursor },
    );
    for (const grant of page.items) await deps.oauth.revokeGrant(grant.id, deps.owner);
    revoked += page.items.length;
    cursor = page.cursor;
  } while (cursor !== undefined);
  return revoked;
}

/** `connection_status`: who is connected, with which app, and until when. */
export const connectionStatusTool = defineTool({
  name: 'connection_status',
  description:
    'Shows the connected Spotify account, the app (Client ID, masked) it uses, the granted scopes and when the authorization expires (Spotify refresh tokens last 6 months). Use it to check the connection.',
  shape: {},
  annotations: toolAnnotations('Connection status', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => {
    const account = await requireAccount(deps);
    return {
      spotify_user: account.spotifyUserId,
      display_name: account.displayName,
      app_client_id: maskCredential(account.clientId),
      authorized_at: new Date(account.authorizedAt).toISOString(),
      reconnect_before: refreshExpiryIso(account),
      scopes: account.scope.split(' ').filter(Boolean),
      requests_per_call: deps.settings.callBudget,
    };
  },
});

/** `disconnect`: erases the user's data on this connector and revokes Claude's access. */
export const disconnectTool = defineTool({
  name: 'disconnect',
  description:
    "Disconnects Spotify and ERASES everything this connector stored for you: app credentials, tokens, library snapshots, genre cache, pending plans and backups (export backups first if you want them). Also revokes Claude's access to this connector. Ask the user to confirm first and pass confirm: true.",
  shape: { confirm: z.literal(true).describe('Must be true: the user confirmed the erasure.') },
  annotations: toolAnnotations('Disconnect and erase data', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps) => {
    const erased = await eraseOwner(deps.kv, deps.owner);
    forgetSpotifyAccessToken(deps.owner);
    const grants = await revokeClaudeGrants(deps);
    return {
      erased_records: erased,
      revoked_claude_grants: grants,
      next: `Also remove the app's access on Spotify at ${SPOTIFY_APPS_PAGE} and, if you no longer need it, delete your app in the Spotify developer dashboard.`,
    };
  },
});
