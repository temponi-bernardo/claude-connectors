/**
 * Links one more Gmail account to a connector user. The `link_account` tool issues a link with a sealed
 * ticket (user + 10-minute validity, single use); `/accounts/link` redeems the ticket and sends the browser to
 * Google with `gmail.modify` and offline access, a single-use `state` bound to the browser by a `__Host-`
 * cookie, PKCE S256 and `nonce`. On return, the refresh token is stored (sealed) in that user's accounts.
 */
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { forgetAccessToken } from './access-token.js';
import { GMAIL_SCOPES, hasModifyScope } from './config.js';
import type { GmailDeps, OwnerDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  randomToken,
  type GoogleTokens,
} from './google-oauth.js';
import { verifyGoogleIdToken } from './id-token.js';
import { messagePage, redirectWith } from './pages.js';
import { loadOwnerAccounts, saveOwnerAccounts, sha256Hex, upsertAccount } from './token-store.js';

/** Prefix of the linking `state` (the OAuth library `state` never has a dot). */
export const LINK_STATE_PREFIX = 'link.';

/** Cookie that binds the `state` to the browser that started the linking. */
export const LINK_COOKIE = '__Host-gmail-link';

/** Validity of the ticket and of the link request, in seconds. */
export const LINK_TTL_SECONDS = 600;

/** Seal type of the link request (between the trip to Google and the return). */
export const LINK_REQUEST_TYP = 'gmail_link';

/** Seal type of the link ticket issued by `link_account`. */
export const LINK_TICKET_TYP = 'gmail_link_ticket';

/** Link request kept in KV between the trip to Google and the return. */
export interface LinkRequest {
  readonly owner: string;
  readonly verifier: string;
  readonly nonce: string;
}

/** Unix seconds from the dependencies' clock. */
export function nowSeconds(deps: GmailDeps): number {
  return Math.floor(deps.now() / 1000);
}

/** Single-use linking link for the user (valid for 10 minutes). */
export function issueLinkUrl(deps: OwnerDeps): string {
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const ticket = sealPayload(
    { typ: LINK_TICKET_TYP, exp, owner: deps.owner, jti: randomToken(16) },
    deps.settings.tokenKey,
  );
  return `${deps.origin}/accounts/link?ticket=${ticket}`;
}

/** Redeems the ticket (single use, marked in KV until it expires); returns the user, or null if invalid or used. */
export async function redeemLinkTicket(deps: GmailDeps, ticket: string): Promise<string | null> {
  const claims = openSealed(ticket, deps.settings.tokenKey, {
    typ: LINK_TICKET_TYP,
    now: nowSeconds(deps),
  });
  if (typeof claims?.owner !== 'string' || typeof claims.jti !== 'string') return null;
  const usedKey = `ticket:${sha256Hex(claims.jti)}`;
  if ((await deps.kv.get(usedKey)) !== null) return null;
  await deps.kv.put(usedKey, '1', { expirationTtl: LINK_TTL_SECONDS });
  return claims.owner;
}

/** KV key of the link request. */
export function linkRequestKey(state: string): string {
  return `link:${sha256Hex(state)}`;
}

/** Value of a cookie from the `Cookie` header, or null. */
export function readCookie(header: string | null, name: string): string | null {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

/** Linking `Set-Cookie` header (empty and expired when `value` is null, to delete it). */
export function linkCookie(value: string | null): string {
  const age = value === null ? 0 : LINK_TTL_SECONDS;
  return `${LINK_COOKIE}=${value ?? ''}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
}

/** Page for an invalid, expired or already used link. */
export function invalidTicketPage(): Response {
  return messagePage(
    'Invalid or expired link',
    'Ask Claude for a new linking link (link_account tool). Each link works once, for 10 minutes.',
    400,
  );
}

/** `GET /accounts/link?ticket=...`: redeems the ticket, stores the request (sealed) and sends the browser to Google. */
export async function startAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const owner = await redeemLinkTicket(deps, new URL(request.url).searchParams.get('ticket') ?? '');
  if (owner === null) return invalidTicketPage();
  const state = `${LINK_STATE_PREFIX}${randomToken()}`;
  const binding = randomToken();
  const link: LinkRequest = { owner, verifier: randomToken(), nonce: randomToken() };
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const sealed = sealPayload(
    { typ: LINK_REQUEST_TYP, exp, bindingHash: sha256Hex(binding), ...link },
    deps.settings.tokenKey,
  );
  await deps.kv.put(linkRequestKey(state), sealed, { expirationTtl: LINK_TTL_SECONDS });
  const location = googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: GMAIL_SCOPES,
    state,
    codeChallenge: pkceChallenge(link.verifier),
    nonce: link.nonce,
    offline: true,
  });
  return redirectWith(location, new Headers({ 'set-cookie': linkCookie(binding) }));
}

/** Fetches and deletes (single use) the link request; null if missing, expired or the cookie does not match. */
export async function takeLinkRequest(
  deps: GmailDeps,
  request: Request,
): Promise<LinkRequest | null> {
  const key = linkRequestKey(new URL(request.url).searchParams.get('state') ?? '');
  const sealed = await deps.kv.get(key);
  if (sealed === null) return null;
  await deps.kv.delete(key);
  const claims = openSealed(sealed, deps.settings.tokenKey, {
    typ: LINK_REQUEST_TYP,
    now: nowSeconds(deps),
  });
  const binding = readCookie(request.headers.get('cookie'), LINK_COOKIE);
  if (!claims || binding === null || sha256Hex(binding) !== claims.bindingHash) return null;
  return {
    owner: String(claims.owner),
    verifier: String(claims.verifier),
    nonce: String(claims.nonce),
  };
}

/** Reason not to store the account (no Gmail permission or no refresh token), or null if it can be stored. */
export function linkRefusalReason(tokens: GoogleTokens): string | null {
  if (!hasModifyScope(tokens.scope)) {
    return 'Check the permission to manage Gmail (read, send and organize emails) on the Google screen and try again.';
  }
  if (tokens.refreshToken === null) return 'Google did not return the refresh token. Try again.';
  return null;
}

/** Stores (or replaces) the account in the user's accounts and drops its old access token. */
export async function storeGoogleAccount(
  deps: OwnerDeps,
  email: string,
  tokens: GoogleTokens,
): Promise<void> {
  const accounts = await loadOwnerAccounts(deps.kv, deps.settings.tokenKey, deps.owner);
  const updated = upsertAccount(accounts, {
    email,
    refreshToken: tokens.refreshToken ?? '',
    scope: tokens.scope,
    linkedAt: new Date(deps.now()).toISOString(),
    status: 'active',
  });
  await saveOwnerAccounts(deps.kv, deps.settings.tokenKey, {
    owner: deps.owner,
    accounts: updated,
  });
  forgetAccessToken(deps.owner, email);
}

/** Exchanges the code, validates the `id_token` and stores the account for the ticket user; returns the result page. */
export async function linkFromCode(
  deps: GmailDeps,
  code: string,
  link: LinkRequest,
): Promise<Response> {
  const tokens = await exchangeGoogleCode(deps, code, link.verifier);
  if (tokens.idToken === null)
    return messagePage('Linking failed', 'No id_token from Google.', 400);
  const { email } = await verifyGoogleIdToken(deps, tokens.idToken, link.nonce);
  const refusal = linkRefusalReason(tokens);
  if (refusal !== null) return messagePage('Missing permission', refusal, 400);
  await storeGoogleAccount({ ...deps, owner: link.owner }, email, tokens);
  return messagePage('Account linked', `The account ${email} was linked. You can close this page.`);
}

/** Runs `linkFromCode`, turning failures (Google down, invalid `id_token`) into a 400 page without storing anything. */
export async function linkSafely(
  deps: GmailDeps,
  code: string,
  link: LinkRequest,
): Promise<Response> {
  try {
    return await linkFromCode(deps, code, link);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return messagePage('Linking failed', `${message} Nothing was stored; try again.`, 400);
  }
}

/** Return from Google when linking: checks the request, handles refusal and errors and deletes the cookie. */
export async function finishAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const link = await takeLinkRequest(deps, request);
  let response: Response;
  if (!link) {
    response = invalidTicketPage();
  } else if (params.get('error') !== null || !params.get('code')) {
    response = messagePage(
      'Linking canceled',
      'Google did not authorize the access. Nothing was stored.',
      400,
    );
  } else {
    response = await linkSafely(deps, params.get('code') ?? '', link);
  }
  response.headers.append('set-cookie', linkCookie(null));
  return response;
}
