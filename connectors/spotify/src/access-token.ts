/**
 * Spotify access tokens per connector user: refreshed with the stored refresh token (and the user's own app),
 * kept in the isolate memory until close to expiry. A rotated refresh token is saved back; an expired or revoked
 * one becomes an error that tells the user to reconnect.
 */
import { loadAccount, saveAccount, type SpotifyAccount } from './account-store.js';
import type { OwnerDeps } from './context.js';
import { spendCall } from './spotify-errors.js';
import { refreshSpotifyToken, SpotifyTokenError } from './spotify-oauth.js';
import { vaultOf } from './vault.js';

/** Margin before expiry at which the access token is already refreshed (ms). */
export const SPOTIFY_TOKEN_MARGIN_MS = 60_000;

/** In-memory access tokens per user (they live only as long as the Worker isolate). */
const spotifyTokenCache = new Map<string, { token: string; expiresAt: number }>();

/** Forgets the user's cached access token (after a 401, a new connection or a disconnect). */
export function forgetSpotifyAccessToken(owner: string): void {
  spotifyTokenCache.delete(owner);
}

/** Forgets every cached access token. */
export function clearSpotifyTokenCache(): void {
  spotifyTokenCache.clear();
}

/** Error for a user with no connected account. */
export function notConnectedError(): Error {
  return new Error(
    'No Spotify account is connected for this user. Reconnect the spotify connector in Claude (Settings → Connectors → spotify → Disconnect, then Connect) and paste your app Client ID and Secret again.',
  );
}

/** Error for an authorization Spotify no longer accepts (expired after 6 months, revoked or app changed). */
export function reconnectError(code: string): Error {
  const why =
    code === 'invalid_client'
      ? 'Spotify rejected your app credentials (the Client Secret was rotated or the app was deleted).'
      : 'Your Spotify authorization expired or was revoked (Spotify refresh tokens last 6 months).';
  return new Error(
    `${why} Reconnect the spotify connector in Claude (Settings → Connectors → spotify → Disconnect, then Connect).`,
  );
}

/** Loads the user's account or throws the not-connected error. */
export async function requireAccount(deps: OwnerDeps): Promise<SpotifyAccount> {
  const account = await loadAccount(vaultOf(deps), deps.owner);
  if (account === null) throw notConnectedError();
  return account;
}

/** Refreshes the access token, saving a rotated refresh token; terminal token errors become reconnect errors. */
export async function renewSpotifyAccessToken(deps: OwnerDeps): Promise<string> {
  const account = await requireAccount(deps);
  spendCall(deps.budget);
  try {
    const tokens = await refreshSpotifyToken(deps, account, account.refreshToken);
    if (tokens.refreshToken !== null && tokens.refreshToken !== account.refreshToken) {
      await saveAccount(vaultOf(deps), deps.owner, {
        ...account,
        refreshToken: tokens.refreshToken,
      });
    }
    const expiresAt = deps.now() + tokens.expiresIn * 1000 - SPOTIFY_TOKEN_MARGIN_MS;
    spotifyTokenCache.set(deps.owner, { token: tokens.accessToken, expiresAt });
    return tokens.accessToken;
  } catch (error) {
    if (error instanceof SpotifyTokenError && isTerminalTokenError(error.code)) {
      throw reconnectError(error.code);
    }
    throw error;
  }
}

/** Tells whether a token error code means the stored authorization can never work again. */
export function isTerminalTokenError(code: string): boolean {
  return code === 'invalid_grant' || code === 'invalid_client' || code === 'unauthorized_client';
}

/** A valid access token for the user: from memory, or refreshed. */
export async function getSpotifyAccessToken(deps: OwnerDeps): Promise<string> {
  const cached = spotifyTokenCache.get(deps.owner);
  if (cached && cached.expiresAt > deps.now()) return cached.token;
  return renewSpotifyAccessToken(deps);
}
