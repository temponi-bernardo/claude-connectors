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

/**
 * Stages of the link: `verify` proves with an `openid email` sign-in that whoever confirmed IS the owner (same
 * Google `sub`); only then `link` asks for Gmail access for the account to add.
 */
export type LinkStage = 'verify' | 'link';

/** Scopes of the owner check: identity only, no Gmail access. */
export const OWNER_CHECK_SCOPES: readonly string[] = ['openid', 'email'];

/** Link request kept in KV between the trip to Google and the return. */
export interface LinkRequest {
  readonly owner: string;
  readonly verifier: string;
  readonly nonce: string;
  readonly stage: LinkStage;
}

/** Where a link stage goes: whose connector, the browser binding and, for `verify`, the owner email hint. */
export interface LinkStageStart {
  readonly owner: string;
  readonly binding: string;
  readonly stage: LinkStage;
  readonly loginHint: string | null;
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

/** Redeems the ticket of a confirmation posted from this browser; returns the `verify` stage to start. */
export async function redeemConfirmedTicket(
  deps: GmailDeps,
  request: Request,
): Promise<LinkStageStart | null> {
  const form = await readForm(request);
  const binding = readCookie(request.headers.get('cookie'), LINK_COOKIE);
  if (binding === null || !isConfirmedInThisBrowser(deps, form, binding)) return null;
  const ticket = await redeemLinkTicket(deps, form.get('ticket') ?? '');
  return ticket && { owner: ticket.owner, binding, stage: 'verify', loginHint: ticket.email };
}

/** Stores the sealed link request (bound to the browser cookie hash) under a new `state`; returns the `state`. */
export async function storeLinkRequest(
  deps: GmailDeps,
  link: LinkRequest,
  binding: string,
): Promise<string> {
  const state = `${LINK_STATE_PREFIX}${randomToken()}`;
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const sealed = sealPayload(
    { typ: LINK_REQUEST_TYP, aud: deps.origin, exp, bindingHash: sha256Hex(binding), ...link },
    deps.settings.tokenKey,
  );
  await deps.kv.put(linkRequestKey(state), sealed, { expirationTtl: LINK_TTL_SECONDS });
  return state;
}

/** Google address of a stage: identity only (with the owner hint) for `verify`, Gmail offline for `link`. */
export function linkStageUrl(
  deps: GmailDeps,
  link: LinkRequest & { readonly state: string },
  loginHint: string | null,
): string {
  return googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: link.stage === 'verify' ? OWNER_CHECK_SCOPES : GMAIL_SCOPES,
    state: link.state,
    codeChallenge: pkceChallenge(link.verifier),
    nonce: link.nonce,
    offline: link.stage === 'link',
    ...(loginHint ? { loginHint } : {}),
  });
}

/** Starts a link stage: stores the request and redirects the browser to Google, keeping the binding cookie. */
export async function beginLinkStage(deps: GmailDeps, start: LinkStageStart): Promise<Response> {
  const link: LinkRequest = {
    owner: start.owner,
    verifier: randomToken(),
    nonce: randomToken(),
    stage: start.stage,
  };
  const state = await storeLinkRequest(deps, link, start.binding);
  const location = linkStageUrl(deps, { ...link, state }, start.loginHint);
  return redirectWith(location, new Headers({ 'set-cookie': linkCookie(start.binding) }));
}

/** `POST /accounts/link`: checks the confirmation, redeems the ticket and sends the owner to prove who they are. */
export async function startAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const confirmed = await redeemConfirmedTicket(deps, request);
  return confirmed === null ? invalidTicketPage() : beginLinkStage(deps, confirmed);
}

/** Page shown when the Google account of the identity check is not the owner who asked for the link. */
export function notOwnerPage(): Response {
  return messagePage(
    'Not the owner of this link',
    'This link was created by another person. Sign in with the Google account that asked Claude for the link. Nothing was linked.',
    403,
  );
}

/** `verify` stage return: the signed-in Google account must be the owner; then asks Gmail access to link. */
export async function verifyOwnerThenLink(
  deps: GmailDeps,
  code: string,
  link: LinkRequest & { readonly binding: string },
): Promise<Response> {
  const tokens = await exchangeGoogleCode(deps, code, link.verifier);
  if (tokens.idToken === null)
    return messagePage('Linking failed', 'No id_token from Google.', 400);
  const identity = await verifyGoogleIdToken(deps, tokens.idToken, link.nonce);
  if (identity.sub !== link.owner) return notOwnerPage();
  return beginLinkStage(deps, {
    owner: link.owner,
    binding: link.binding,
    stage: 'link',
    loginHint: null,
  });
}

/** Fetches and deletes (single use) the link request; null if missing, expired or the cookie does not match. */
export async function takeLinkRequest(
  deps: GmailDeps,
  request: Request,
): Promise<(LinkRequest & { readonly binding: string }) | null> {
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
  if (claims.stage !== 'verify' && claims.stage !== 'link') return null;
  return {
    owner: String(claims.owner),
    verifier: String(claims.verifier),
    nonce: String(claims.nonce),
    stage: claims.stage,
    binding,
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

/** Runs the stage (`verifyOwnerThenLink` or `linkFromCode`); failures become a 400 page without storing anything. */
export async function linkSafely(
  deps: GmailDeps,
  code: string,
  link: LinkRequest & { readonly binding: string },
): Promise<Response> {
  try {
    if (link.stage === 'verify') return await verifyOwnerThenLink(deps, code, link);
    return await linkFromCode(deps, code, link);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return messagePage('Linking failed', `${message} Nothing was stored; try again.`, 400);
  }
}

/** Return from Google when linking: checks the request, runs the stage and deletes the cookie unless it goes on. */
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
  if (response.status !== 302) response.headers.append('set-cookie', linkCookie(null));
  return response;
}
