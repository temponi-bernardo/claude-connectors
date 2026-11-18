/**
 * Links one more Gmail account to a connector user. The `link_account` tool issues a link with a sealed
 * ticket (user + email + 10-minute validity, single use, bound to this Worker). `GET /accounts/link` only shows
 * whose connector receives the account and asks for confirmation (setting a `__Host-` cookie); the confirmation
 * `POST`, which only works from that page in that browser, redeems the ticket and sends the browser to Google
 * with `gmail.modify` and offline access, a single-use `state` bound to the same cookie, PKCE S256 and `nonce`.
 * On return, the refresh token is stored (sealed) in that user's accounts.
 */
import { readForm } from '../../../src/remote/handler.js';
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
import { linkConfirmPage, messagePage, redirectWith } from './pages.js';
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

/** Seal type of the confirmation form (ties the confirmation to the ticket and to this browser's cookie). */
export const LINK_CONFIRM_TYP = 'gmail_link_confirm';

/** Opened link ticket: whose connector receives the account, their email (if known) and the single-use id. */
export interface LinkTicket {
  readonly owner: string;
  readonly email: string | null;
  readonly jti: string;
}

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

/** Single-use linking link for the user (valid for 10 minutes, only on this Worker). */
export function issueLinkUrl(deps: OwnerDeps): string {
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const claims = { owner: deps.owner, email: deps.ownerEmail ?? null, jti: randomToken(16) };
  const ticket = sealPayload(
    { typ: LINK_TICKET_TYP, aud: deps.origin, exp, ...claims },
    deps.settings.tokenKey,
  );
  return `${deps.origin}/accounts/link?ticket=${ticket}`;
}

/** Opens a ticket without spending it; null if invalid, expired or from another Worker. */
export function openLinkTicket(deps: GmailDeps, ticket: string): LinkTicket | null {
  const expected = { typ: LINK_TICKET_TYP, now: nowSeconds(deps), aud: deps.origin };
  const claims = openSealed(ticket, deps.settings.tokenKey, expected);
  if (typeof claims?.owner !== 'string' || typeof claims.jti !== 'string') return null;
  const email = typeof claims.email === 'string' ? claims.email : null;
  return { owner: claims.owner, email, jti: claims.jti };
}

/** KV key that marks a ticket as used. */
export function usedTicketKey(jti: string): string {
  return `ticket:${sha256Hex(jti)}`;
}

/** Redeems the ticket (single use, marked in KV until it expires); returns it, or null if invalid or used. */
export async function redeemLinkTicket(
  deps: GmailDeps,
  ticket: string,
): Promise<LinkTicket | null> {
  const opened = openLinkTicket(deps, ticket);
  if (!opened || (await deps.kv.get(usedTicketKey(opened.jti))) !== null) return null;
  await deps.kv.put(usedTicketKey(opened.jti), '1', { expirationTtl: LINK_TTL_SECONDS });
  return opened;
}

/** `GET /accounts/link?ticket=...`: shows whose connector receives the account and asks for confirmation. */
export async function showLinkConfirmation(deps: GmailDeps, request: Request): Promise<Response> {
  const ticket = new URL(request.url).searchParams.get('ticket') ?? '';
  const opened = openLinkTicket(deps, ticket);
  if (!opened || (await deps.kv.get(usedTicketKey(opened.jti))) !== null) {
    return invalidTicketPage();
  }
  const binding = randomToken();
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const confirm = sealPayload(
    {
      typ: LINK_CONFIRM_TYP,
      aud: deps.origin,
      exp,
      jti: opened.jti,
      bindingHash: sha256Hex(binding),
    },
    deps.settings.tokenKey,
  );
  const headers = new Headers({ 'set-cookie': linkCookie(binding) });
  return linkConfirmPage({ ownerEmail: opened.email, ticket, confirm }, headers);
}

/** Says whether the confirmation came from the page shown to this browser for this very ticket. */
export function isConfirmedInThisBrowser(
  deps: GmailDeps,
  form: URLSearchParams,
  binding: string | null,
): boolean {
  const expected = { typ: LINK_CONFIRM_TYP, now: nowSeconds(deps), aud: deps.origin };
  const confirm = openSealed(form.get('confirm') ?? '', deps.settings.tokenKey, expected);
  const ticket = openLinkTicket(deps, form.get('ticket') ?? '');
  if (!confirm || !ticket || binding === null) return false;
  return confirm.jti === ticket.jti && confirm.bindingHash === sha256Hex(binding);
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

/** Redeems the ticket of a confirmation posted from this browser; returns the owner and the cookie binding. */
export async function redeemConfirmedTicket(
  deps: GmailDeps,
  request: Request,
): Promise<{ readonly owner: string; readonly binding: string } | null> {
  const form = await readForm(request);
  const binding = readCookie(request.headers.get('cookie'), LINK_COOKIE);
  if (binding === null || !isConfirmedInThisBrowser(deps, form, binding)) return null;
  const ticket = await redeemLinkTicket(deps, form.get('ticket') ?? '');
  return ticket && { owner: ticket.owner, binding };
}

/** `POST /accounts/link`: checks the confirmation, redeems the ticket, stores the request and goes to Google. */
export async function startAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const confirmed = await redeemConfirmedTicket(deps, request);
  if (confirmed === null) return invalidTicketPage();
  const { owner, binding } = confirmed;
  const state = `${LINK_STATE_PREFIX}${randomToken()}`;
  const link: LinkRequest = { owner, verifier: randomToken(), nonce: randomToken() };
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const sealed = sealPayload(
    { typ: LINK_REQUEST_TYP, aud: deps.origin, exp, bindingHash: sha256Hex(binding), ...link },
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
    aud: deps.origin,
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
