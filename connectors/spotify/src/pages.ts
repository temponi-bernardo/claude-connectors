/**
 * HTML page of the Spotify connector's `/authorize`: how to create your own Spotify app, the exact Redirect URI to
 * register, and the form where the user pastes the Client ID and Secret. Static HTML with a strict CSP. Pure.
 */
import type { ConsentDescription } from '@cloudflare/workers-oauth-provider';
import { htmlResponse } from '../../../src/remote/handler.js';
import { escapeHtml } from '../../../src/remote/login-page.js';
import { copyConsentHeaders, pageDocument } from '../../../src/remote/pages.js';

/** Spotify origin the form may redirect to after approval. */
export const SPOTIFY_ACCOUNTS_ORIGIN = 'https://accounts.spotify.com';

/** Spotify developer dashboard, where each user creates their app. */
export const SPOTIFY_DASHBOARD_URL = 'https://developer.spotify.com/dashboard';

/** What the credentials page shows. */
export interface CredentialsView {
  readonly details: ConsentDescription;
  readonly handle: string;
  readonly redirectUri: string;
  /** Form target: `/authorize` with Claude's original query, so a retry can re-read the request. */
  readonly action: string;
  readonly error: string | null;
}

/** Steps to create the Spotify app, with the exact Redirect URI. */
export function appSetupSteps(redirectUri: string): string {
  return `<ol>
<li>Open the <a href="${SPOTIFY_DASHBOARD_URL}" target="_blank" rel="noopener">Spotify developer dashboard</a> and click <strong>Create app</strong>.</li>
<li>Name and description: anything (e.g. "My Claude"). <strong>Redirect URI</strong>, exactly:<br><code>${escapeHtml(redirectUri)}</code></li>
<li>Under "Which API/SDKs are you planning to use?", tick <strong>Web API</strong>, accept the terms and save.</li>
<li>Open <strong>Settings</strong>, copy the <strong>Client ID</strong>, click <strong>View client secret</strong> and copy it.</li>
</ol>`;
}

/** Body of the credentials page: who gets access, the steps and the form. */
export function credentialsBody(view: CredentialsView): string {
  const error = view.error ? `<p class="error" role="alert">${escapeHtml(view.error)}</p>` : '';
  return `<h1>Connect Spotify to ${escapeHtml(view.details.clientName)}</h1>
<p>You use <strong>your own Spotify app</strong>: your credentials and quota are yours alone. Access goes to <strong>${escapeHtml(view.details.redirectHost)}</strong>. The app name is not verified.</p>
${appSetupSteps(view.redirectUri)}
${error}<form method="post" action="${escapeHtml(view.action)}"><input type="hidden" name="handle" value="${escapeHtml(view.handle)}">
<label for="client_id">Client ID</label><input id="client_id" name="client_id" required autocomplete="off" spellcheck="false" maxlength="64">
<label for="client_secret">Client Secret</label><input id="client_secret" name="client_secret" type="password" required autocomplete="off" maxlength="64">
<p>Stored encrypted and used only to talk to Spotify for you. You can erase everything with the <code>disconnect</code> tool.</p>
<button name="decision" value="approve">Continue to Spotify</button><button name="decision" value="deny" formnovalidate>Cancel</button></form>`;
}

/** The credentials page; the form may go on to Spotify (approve) or back to the client (deny). */
export function credentialsPage(view: CredentialsView, headers: Headers): Response {
  const formTargets = `${SPOTIFY_ACCOUNTS_ORIGIN} ${new URL(view.details.redirectUri).origin}`;
  const html = pageDocument('Connect Spotify', credentialsBody(view));
  return copyConsentHeaders(htmlResponse(html, view.error ? 400 : 200, formTargets), headers);
}
