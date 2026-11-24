/**
 * Sign-in of a connector user (Claude → Worker OAuth 2.1, then the Worker → Spotify with the USER's own app):
 * the user pastes their app's Client ID and Secret, authorizes on Spotify, and the account whose `/me` answers is
 * the connector user. The credentials travel sealed inside the library's upstream transaction and end up in the
 * user's sealed vault record together with the refresh token.
 */
import {
  authorizationErrorRedirect,
  type AuthRequest,
  type OAuthHelpers,
} from '@cloudflare/workers-oauth-provider';
import {
  authorizationErrorResponse,
  messagePage,
  readConsentForm,
  redirectWith,
} from '../../../src/remote/pages.js';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { randomToken } from '../../../src/remote/worker-kit.js';
import { saveAccount } from './account-store.js';
import { forgetSpotifyAccessToken } from './access-token.js';
import { isSpotifyAppCredential } from './config.js';
import { SPOTIFY_USER_AGENT, type SpotifyDeps } from './context.js';
import { credentialsPage } from './pages.js';
import { SPOTIFY_API_BASE } from './spotify-api.js';
import {
  exchangeSpotifyCode,
  spotifyAuthorizeUrl,
  spotifyRedirectUri,
  SpotifyTokenError,
  type AppCredentials,
} from './spotify-oauth.js';
import { vaultOf } from './vault.js';

/** Seal type of the credentials carried through the Spotify round trip. */
export const PENDING_APP_TYP = 'spotify_pending_app';

/** Minutes the user has to finish the Spotify authorization. */
export const PENDING_APP_MINUTES = 15;

/** What Claude's token carries (`ctx.props` on `/mcp`): the connector user and a session id. */
export interface GrantProps {
  readonly owner: string;
  readonly sid: string;
}

/** The Spotify identity behind an access token. */
export interface SpotifyIdentity {
  readonly owner: string;
  readonly userId: string;
  readonly displayName: string;
}

/** Validates the pasted credentials; returns an error message or null. */
export function credentialsProblem(clientId: string, clientSecret: string): string | null {
  if (!isSpotifyAppCredential(clientId))
    return 'The Client ID must be the 32 letters and digits shown in your app settings.';
  if (!isSpotifyAppCredential(clientSecret))
    return 'The Client Secret must be the 32 letters and digits shown after "View client secret".';
  if (clientId.toLowerCase() === clientSecret.toLowerCase())
    return 'The Client ID and the Client Secret cannot be the same.';
  return null;
}

/** Redirect URI to register and form action (`/authorize` with the request's query). */
export function pageTargets(
  deps: SpotifyDeps,
  request: Request,
): { redirectUri: string; action: string } {
  return {
    redirectUri: spotifyRedirectUri(deps.origin),
    action: `/authorize${new URL(request.url).search}`,
  };
}

/** `GET /authorize`: validates Claude's request and shows the credentials page. */
export async function showSpotifyAuthorize(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const authRequest = await oauth.parseAuthRequest(request);
    const details = await oauth.describeConsent(authRequest);
    const consent = await oauth.beginConsent(authRequest);
    const view = { ...pageTargets(deps, request), details, handle: consent.handle, error: null };
    return credentialsPage(view, consent.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** Seals the app credentials for the Spotify round trip. */
export function sealPendingApp(deps: SpotifyDeps, app: AppCredentials): string {
  const exp = Math.floor(deps.now() / 1000) + PENDING_APP_MINUTES * 60;
  return sealPayload({ typ: PENDING_APP_TYP, exp, ...app }, deps.settings.tokenKey);
}

/** Opens the sealed app credentials (null when tampered with or expired). */
export function openPendingApp(deps: SpotifyDeps, sealed: unknown): AppCredentials | null {
  if (typeof sealed !== 'string') return null;
  const claims = openSealed(sealed, deps.settings.tokenKey, {
    typ: PENDING_APP_TYP,
    now: Math.floor(deps.now() / 1000),
  });
  if (typeof claims?.clientId !== 'string' || typeof claims.clientSecret !== 'string') return null;
  return { clientId: claims.clientId, clientSecret: claims.clientSecret };
}

/** Re-shows the page with an error, keeping the same (still unused) consent handle. */
export async function credentialsRetryPage(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  retry: { readonly request: Request; readonly handle: string; readonly error: string },
): Promise<Response> {
  const authRequest = await oauth.parseAuthRequest(retry.request);
  const details = await oauth.describeConsent(authRequest);
  const view = {
    ...pageTargets(deps, retry.request),
    details,
    handle: retry.handle,
    error: retry.error,
  };
  return credentialsPage(view, new Headers());
}

/** Approves the consent and sends the browser to Spotify with the user's own Client ID. */
export async function beginSpotifyAuthorization(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  form: { readonly request: Request; readonly handle: string; readonly app: AppCredentials },
): Promise<Response> {
  const approved = await oauth.approveConsent(form.request, form.handle);
  const { state, headers } = await oauth.beginUpstream(approved.request, {
    data: { app: sealPendingApp(deps, form.app) },
    headers: approved.headers,
  });
  return redirectWith(spotifyAuthorizeUrl(form.app.clientId, deps.origin, state), headers);
}

/** `POST /authorize`: cancel goes back to Claude; valid credentials go to Spotify; invalid ones re-show the page. */
export async function submitSpotifyAuthorize(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const { form, handle, denied } = await readConsentForm(oauth, request);
    if (denied) return denied;
    const app = {
      clientId: (form.get('client_id') ?? '').trim(),
      clientSecret: (form.get('client_secret') ?? '').trim(),
    };
    const problem = credentialsProblem(app.clientId, app.clientSecret);
    if (problem !== null)
      return await credentialsRetryPage(deps, oauth, { request, handle, error: problem });
    return await beginSpotifyAuthorization(deps, oauth, { request, handle, app });
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** Reads `/me` with a fresh access token: the stable account id (`account_id`, else `id`) and the name. */
export async function fetchSpotifyIdentity(
  deps: SpotifyDeps,
  accessToken: string,
): Promise<SpotifyIdentity> {
  const response = await deps.fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { authorization: `Bearer ${accessToken}`, 'user-agent': SPOTIFY_USER_AGENT },
  });
  if (response.status === 403) throw new Error('not_allowlisted');
  if (!response.ok) throw new Error(`Spotify /me answered ${response.status}.`);
  const me = (await response.json()) as Record<string, unknown>;
  const userId = typeof me.id === 'string' ? me.id : '';
  const accountId = typeof me.account_id === 'string' && me.account_id ? me.account_id : userId;
  if (!accountId) throw new Error('Spotify /me returned no account id.');
  const displayName = typeof me.display_name === 'string' ? me.display_name : userId;
  return { owner: `spotify_${encodeURIComponent(accountId)}`, userId, displayName };
}

/** Page for a Spotify return after the sealed credentials expired. */
export function expiredConnectionPage(): Response {
  return messagePage(
    'Connection expired',
    'The connection took too long. Start again from Claude.',
    400,
  );
}

/** Page for a failed Spotify return, with what to fix. */
export function spotifyFailurePage(error: unknown): Response {
  if (error instanceof SpotifyTokenError && error.code === 'invalid_client') {
    return messagePage(
      'Wrong app credentials',
      'Spotify rejected the Client ID or Client Secret. Copy both again from your app settings and reconnect.',
      400,
    );
  }
  if (error instanceof Error && error.message === 'not_allowlisted') {
    return messagePage(
      'Account not allowed in your app',
      'Spotify refused this account. In your app on the Spotify dashboard, open Settings → User Management and add the email of the Spotify account you signed in with (development mode allows 5 users), then reconnect. The app owner needs Spotify Premium.',
      403,
    );
  }
  return authorizationErrorResponse(error);
}

/** Exchanges the code, identifies the account and stores it sealed in the user's vault. */
export async function connectSpotifyAccount(
  deps: SpotifyDeps,
  app: AppCredentials,
  code: string,
): Promise<SpotifyIdentity> {
  const tokens = await exchangeSpotifyCode(deps, app, code);
  if (tokens.refreshToken === null) throw new Error('Spotify did not return a refresh token.');
  const identity = await fetchSpotifyIdentity(deps, tokens.accessToken);
  const account = {
    ...app,
    spotifyUserId: identity.userId,
    displayName: identity.displayName,
    refreshToken: tokens.refreshToken,
    scope: tokens.scope,
    authorizedAt: deps.now(),
  };
  await saveAccount(vaultOf(deps), identity.owner, account);
  forgetSpotifyAccessToken(identity.owner);
  return identity;
}

/** Completes Claude's authorization for the Spotify account that just connected. */
export async function completeSpotifySignIn(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  resumed: { readonly request: AuthRequest; readonly app: AppCredentials; readonly code: string },
): Promise<string> {
  const identity = await connectSpotifyAccount(deps, resumed.app, resumed.code);
  const props: GrantProps = { owner: identity.owner, sid: randomToken(16) };
  const done = await oauth.completeAuthorization({
    request: resumed.request,
    userId: identity.owner,
    metadata: {},
    scope: resumed.request.scope,
    props,
  });
  return done.redirectTo;
}

/** Resumes the transaction at Spotify's return and finishes it (refusal → `access_denied` for Claude). */
export async function resumeSpotifySignIn(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  const resumed = await oauth.finishUpstream<{ app?: unknown }>(request);
  const code = new URL(request.url).searchParams.get('code');
  if (!code) {
    return redirectWith(
      authorizationErrorRedirect(resumed.request, 'access_denied'),
      resumed.headers,
    );
  }
  const app = openPendingApp(deps, resumed.data.app);
  if (!app) return expiredConnectionPage();
  const redirectTo = await completeSpotifySignIn(deps, oauth, {
    request: resumed.request,
    app,
    code,
  });
  return redirectWith(redirectTo, resumed.headers);
}

/** `GET /spotify/callback`: Spotify's return; failures become a page saying what to fix. */
export async function finishSpotifySignIn(
  deps: SpotifyDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    return await resumeSpotifySignIn(deps, oauth, request);
  } catch (error) {
    return spotifyFailurePage(error);
  }
}
