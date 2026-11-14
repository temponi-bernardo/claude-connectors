/**
 * Google access tokens per linked account: refreshed with the refresh token and kept in the isolate memory
 * until close to expiry (per user and account). Access revoked at Google flags the account for relinking.
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { GoogleTokenError, refreshGoogleToken } from './google-oauth.js';
import { loadOwnerAccounts, saveOwnerAccounts } from './token-store.js';

/** Margin before expiry at which the access token is already refreshed (ms). */
export const ACCESS_TOKEN_MARGIN_MS = 60_000;

/** In-memory access tokens per user and account (they live only as long as the Worker isolate). */
const accessTokenCache = new Map<string, { token: string; expiresAt: number }>();

/** Cache key: user and account (the same Gmail account may be linked to two users). */
export function accessTokenKey(owner: string, email: string): string {
  return `${owner}\n${email}`;
}

/** Forgets an account's cached access token (e.g. after a Gmail 401 or a new link). */
export function forgetAccessToken(owner: string, email: string): void {
  accessTokenCache.delete(accessTokenKey(owner, email));
}

/** Forgets every cached access token. */
export function clearAccessTokenCache(): void {
  accessTokenCache.clear();
}

/** Actionable error for an account that lost Gmail access. */
export function relinkError(alias: string): Error {
  return new Error(
    `Account "${alias}" lost access to Gmail (revoked or expired). Use link_account and sign in with it again.`,
  );
}

/** Marks the user's account as revoked in KV. */
export async function markAccountRevoked(deps: OwnerDeps, email: string): Promise<void> {
  const accounts = await loadOwnerAccounts(deps.kv, deps.settings.tokenKey, deps.owner);
  const updated = accounts.map((a) =>
    a.email === email ? { ...a, status: 'revoked' as const } : a,
  );
  await saveOwnerAccounts(deps.kv, deps.settings.tokenKey, {
    owner: deps.owner,
    accounts: updated,
  });
}

/** Refreshes the access token; if Google says `invalid_grant`, marks the account revoked and asks for relinking. */
export async function renewAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string> {
  try {
    const tokens = await refreshGoogleToken(deps, ref.account.refreshToken);
    const expiresAt = deps.now() + tokens.expiresIn * 1000 - ACCESS_TOKEN_MARGIN_MS;
    accessTokenCache.set(accessTokenKey(deps.owner, ref.account.email), {
      token: tokens.accessToken,
      expiresAt,
    });
    return tokens.accessToken;
  } catch (error) {
    if (!(error instanceof GoogleTokenError) || error.code !== 'invalid_grant') throw error;
    await markAccountRevoked(deps, ref.account.email);
    throw relinkError(ref.alias);
  }
}

/** Valid access token for the account: from memory, or refreshed with the refresh token. */
export async function getAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string> {
  if (ref.account.status === 'revoked') throw relinkError(ref.alias);
  const cached = accessTokenCache.get(accessTokenKey(deps.owner, ref.account.email));
  if (cached && cached.expiresAt > deps.now()) return cached.token;
  return renewAccessToken(deps, ref);
}
