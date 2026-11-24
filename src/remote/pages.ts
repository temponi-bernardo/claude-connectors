/**
 * HTML pages and redirects shared by the connectors on `@cloudflare/workers-oauth-provider`: the page shell with
 * the `docs/UI.md` tokens and a strict CSP, notice pages, 302 redirects and authorization errors. Pure.
 */
import { AuthorizationError, type OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { redactSecrets } from '../core/redact.js';
import { htmlResponse, readForm } from './handler.js';
import { escapeHtml, LOGIN_PAGE_CSS } from './login-page.js';

/** OAuth library headers the page response must not inherit (the page sets its own). */
const PAGE_OWNED_HEADERS: ReadonlySet<string> = new Set([
  'content-type',
  'content-security-policy',
  'set-cookie',
]);

/** Full HTML document with a title and a body already escaped by the caller. */
export function pageDocument(title: string, body: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title><style>${LOGIN_PAGE_CSS}</style></head><body><main>${body}</main></body></html>`;
}

/** Simple notice page (title and text message, with secrets redacted and escaped here). */
export function messagePage(title: string, message: string, status = 200): Response {
  const text = escapeHtml(redactSecrets(message));
  return htmlResponse(pageDocument(title, `<h1>${escapeHtml(title)}</h1><p>${text}</p>`), status);
}

/** Copies the consent transaction headers (cookies and anti-framing) into the response. */
export function copyConsentHeaders(response: Response, headers: Headers): Response {
  for (const cookie of headers.getSetCookie()) response.headers.append('set-cookie', cookie);
  headers.forEach((value, name) => {
    if (!PAGE_OWNED_HEADERS.has(name)) response.headers.set(name, value);
  });
  return response;
}

/** 302 redirect with the given headers (transaction cookies) plus `Location`. */
export function redirectWith(location: string, headers: Headers = new Headers()): Response {
  headers.set('location', location);
  headers.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers });
}

/** Response to an authorization error: back to the client when the library says where, otherwise a page. */
export function authorizationErrorResponse(error: unknown): Response {
  if (error instanceof AuthorizationError && error.redirectTo) {
    return redirectWith(error.redirectTo);
  }
  const message =
    error instanceof AuthorizationError ? error.description : 'Invalid authorization request.';
  return messagePage('Could not connect', message, 400);
}

/** A posted consent form: its fields, the consent handle and, when the user did not approve, the way back. */
export interface ConsentForm {
  readonly form: URLSearchParams;
  readonly handle: string;
  readonly denied: Response | null;
}

/** Reads a consent form; anything but `decision=approve` denies the consent and redirects back to the client. */
export async function readConsentForm(oauth: OAuthHelpers, request: Request): Promise<ConsentForm> {
  const form = await readForm(request.clone());
  const handle = form.get('handle') ?? '';
  if (form.get('decision') === 'approve') return { form, handle, denied: null };
  const denied = await oauth.denyConsent(request, handle);
  return { form, handle, denied: redirectWith(denied.redirectTo, denied.headers) };
}
