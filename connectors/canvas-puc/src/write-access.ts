/**
 * Turning on Canvas writing for a connection that is already authorized, without a new Canvas token: a read-only
 * user who asks to send gets a short-lived link (sealed, bound to their token's fingerprint); on that page they
 * tick the consent and the opt-in is stored under the fingerprint (never the token). Ticking the option at
 * sign-in still works the same way.
 */
import { createHash } from 'node:crypto';
import { escapeHtml, LOGIN_PAGE_CSS } from '../../../src/remote/login-page.js';
import { htmlResponse, readForm } from '../../../src/remote/handler.js';
import type { OAuthSettings } from '../../../src/remote/oauth.js';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';

/** Where the opt-ins live (Workers KV in production, memory locally): key `write:<fingerprint>` → `on`. */
export interface WriteAccessStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** What the write-access pages need: OAuth settings (issuer and seal key), the store and a clock (Unix s). */
export interface WriteAccessDeps {
  readonly oauth: OAuthSettings;
  readonly store: WriteAccessStore;
  readonly now: () => number;
}

/** Path of the page that turns writing on or off for a connection. */
export const WRITE_ACCESS_PATH = '/write-access';

/** Seal type and lifetime of the link to that page (15 minutes). */
export const WRITE_TICKET_TYP = 'canvas-write-access';
export const WRITE_TICKET_TTL_SECONDS = 15 * 60;

/** SHA-256 of the Canvas token in hex: identifies the connection without storing the token. */
export function tokenFingerprint(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

/** Store key of a token's opt-in. */
export function writeAccessKey(fingerprint: string): string {
  return `write:${fingerprint}`;
}

/** Says whether this token's user turned writing on through the page (a store failure counts as off). */
export async function hasStoredWriteOptIn(
  store: WriteAccessStore,
  token: string,
): Promise<boolean> {
  try {
    return (await store.get(writeAccessKey(tokenFingerprint(token)))) === 'on';
  } catch {
    return false;
  }
}

/** Link to the write-access page, carrying a sealed ticket with the token's fingerprint (never the token). */
export function writeAccessUrl(deps: WriteAccessDeps, token: string): string {
  const claims = {
    typ: WRITE_TICKET_TYP,
    aud: deps.oauth.issuer,
    exp: deps.now() + WRITE_TICKET_TTL_SECONDS,
    fp: tokenFingerprint(token),
  };
  return `${deps.oauth.issuer}${WRITE_ACCESS_PATH}?t=${sealPayload(claims, deps.oauth.key)}`;
}

/** Opens the ticket of the page: the fingerprint, or null when it is invalid, expired or for another server. */
export function openWriteTicket(deps: WriteAccessDeps, ticket: string): string | null {
  const expected = { typ: WRITE_TICKET_TYP, now: deps.now(), aud: deps.oauth.issuer };
  const claims = openSealed(ticket, deps.oauth.key, expected);
  return typeof claims?.fp === 'string' ? claims.fp : null;
}

/** HTML of the write-access page: the current state and one button to change it (no script). */
export function renderWriteAccessPage(ticket: string, enabled: boolean): string {
  const state = enabled ? 'on' : 'off';
  const action = enabled ? 'off' : 'on';
  const button = enabled ? 'Turn writing off' : 'Allow writing';
  const next = enabled ? ' Go back to Claude and ask again (it applies within a minute).' : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Canvas writing</title><style>${LOGIN_PAGE_CSS}</style></head><body><main>
<h1>Canvas writing</h1>
<p>Writing is <strong>${state}</strong> for this Canvas connection. With it on, Claude can send inbox messages, reply to discussions and submit assignments on your behalf, and it always asks before each action. No new token is needed.${next}</p>
<form method="post" action="${WRITE_ACCESS_PATH}">
<input type="hidden" name="t" value="${escapeHtml(ticket)}">
<input type="hidden" name="action" value="${action}">
<button type="submit">${button}</button>
</form></main></body></html>`;
}

/** Page shown when the link expired or was tampered with. */
export function expiredWriteAccessPage(): Response {
  return htmlResponse(
    '<p>This link expired. Ask Claude again to send the message: it will give you a new link.</p>',
    400,
  );
}

/** `GET /write-access`: shows the state of the connection behind the ticket. */
export async function showWriteAccess(deps: WriteAccessDeps, request: Request): Promise<Response> {
  const ticket = new URL(request.url).searchParams.get('t') ?? '';
  const fingerprint = openWriteTicket(deps, ticket);
  if (fingerprint === null) return expiredWriteAccessPage();
  const enabled = (await deps.store.get(writeAccessKey(fingerprint))) === 'on';
  return htmlResponse(renderWriteAccessPage(ticket, enabled));
}

/** `POST /write-access`: stores (or removes) the opt-in of the connection behind the ticket. */
export async function submitWriteAccess(
  deps: WriteAccessDeps,
  request: Request,
): Promise<Response> {
  const form = await readForm(request);
  const ticket = form.get('t') ?? '';
  const fingerprint = openWriteTicket(deps, ticket);
  if (fingerprint === null) return expiredWriteAccessPage();
  const key = writeAccessKey(fingerprint);
  const enable = form.get('action') === 'on';
  await (enable ? deps.store.put(key, 'on') : deps.store.delete(key));
  return htmlResponse(renderWriteAccessPage(ticket, enable));
}

/** Store kept in memory (local Node server and tests). */
export function memoryWriteAccessStore(): WriteAccessStore {
  const items = new Map<string, string>();
  return {
    get: (key) => Promise.resolve(items.get(key) ?? null),
    put: (key, value) => Promise.resolve(void items.set(key, value)),
    delete: (key) => Promise.resolve(void items.delete(key)),
  };
}
