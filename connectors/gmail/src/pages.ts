/**
 * HTML pages of the Gmail connector (consent and results), with a strict CSP and escaping of everything that
 * comes from the OAuth client or from Google. Pure: it only builds text and responses.
 */
import type { ConsentDescription } from '@cloudflare/workers-oauth-provider';
import { htmlResponse } from '../../../src/remote/handler.js';
import { redactSecrets } from '../../../src/core/redact.js';
import { escapeHtml, LOGIN_PAGE_CSS } from '../../../src/remote/login-page.js';

/** Google origin the consent form redirects to. */
export const GOOGLE_ACCOUNTS_ORIGIN = 'https://accounts.google.com';

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

/** Masks an email for display: keeps the first two characters of the name and the domain (`bf***@gmail.com`). */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 1) return '***';
  return `${email.slice(0, Math.min(2, at))}***${email.slice(at)}`;
}

/** What the link confirmation page shows and posts back. */
export interface LinkConfirmView {
  readonly ownerEmail: string | null;
  readonly ticket: string;
  readonly confirm: string;
}

/** Link confirmation body: whose connector receives the account, the warning and the button. */
export function linkConfirmBody(view: LinkConfirmView): string {
  const owner = view.ownerEmail ? maskEmail(view.ownerEmail) : 'an unknown user';
  return `<h1>Link a Gmail account?</h1>
<p>The account you choose next will be added to the Claude connector of <strong>${escapeHtml(owner)}</strong>, who will be able to read, send and organize its email.</p>
<p class="error">Continue only if that is you and you just asked Claude for this link. If someone sent you this link, close this page.</p>
<form method="post" action="/accounts/link"><input type="hidden" name="ticket" value="${escapeHtml(view.ticket)}"><input type="hidden" name="confirm" value="${escapeHtml(view.confirm)}">
<button type="submit">Continue to Google</button></form>`;
}

/** Link confirmation page; the form posts here and is then redirected to Google (allowed by the CSP). */
export function linkConfirmPage(view: LinkConfirmView, headers: Headers): Response {
  const html = pageDocument('Link a Gmail account', linkConfirmBody(view));
  const response = htmlResponse(html, 200, GOOGLE_ACCOUNTS_ORIGIN);
  for (const cookie of headers.getSetCookie()) response.headers.append('set-cookie', cookie);
  return response;
}

/** Consent page body: who is asking, where the access goes and the buttons. */
export function consentPageBody(details: ConsentDescription, handle: string): string {
  const loopback = details.redirectIsLoopback
    ? '<p><strong>The access goes to an app on your computer.</strong> Continue only if you just started the connection there.</p>'
    : '';
  return `<h1>Connect ${escapeHtml(details.clientName)} to Gmail?</h1>
<p>The access (read, send and organize emails; no permanent deletion) will be sent to <strong>${escapeHtml(details.redirectHost)}</strong>. The app name is not verified.</p>${loopback}
<p>Next you sign in with your Google account; only authorized emails are accepted.</p>
<form method="post" action="/authorize"><input type="hidden" name="handle" value="${escapeHtml(handle)}">
<button name="decision" value="approve">Allow</button><button name="decision" value="deny">Deny</button></form>`;
}

/** Copies the consent transaction headers (cookies and anti-framing) into the response. */
export function copyConsentHeaders(response: Response, headers: Headers): Response {
  for (const cookie of headers.getSetCookie()) response.headers.append('set-cookie', cookie);
  headers.forEach((value, name) => {
    if (!PAGE_OWNED_HEADERS.has(name)) response.headers.set(name, value);
  });
  return response;
}

/** Consent page: the form may go on to Google (approve) or to the client (deny). */
export function consentPage(
  details: ConsentDescription,
  handle: string,
  headers: Headers,
): Response {
  const formTargets = `${GOOGLE_ACCOUNTS_ORIGIN} ${new URL(details.redirectUri).origin}`;
  const html = pageDocument(`Connect ${details.clientName}`, consentPageBody(details, handle));
  return copyConsentHeaders(htmlResponse(html, 200, formTargets), headers);
}

/** 302 redirect with the given headers (transaction cookies) plus `Location`. */
export function redirectWith(location: string, headers: Headers = new Headers()): Response {
  headers.set('location', location);
  headers.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers });
}
