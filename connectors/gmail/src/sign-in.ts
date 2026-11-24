/**
 * Sign-in of whoever installed the connector (Claude → Worker OAuth 2.1): per-client consent, trip to Google
 * with `openid email` and `gmail.modify` (offline access), return validated by the library (single-use
 * `state` bound to the browser) and `id_token` check. The account that signed in is linked to the user right
 * away. Any Google account may sign in, unless `ALLOWED_EMAILS` restricts it (private mode).
 */
import {
  authorizationErrorRedirect,
  type AuthRequest,
  type OAuthHelpers,
} from '@cloudflare/workers-oauth-provider';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { GMAIL_SCOPES, isEmailAllowed } from './config.js';
import type { GmailDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  type GoogleTokens,
} from './google-oauth.js';
import { verifyGoogleIdToken, type GoogleIdentity } from './id-token.js';
import { linkRefusalReason, storeGoogleAccount } from './link-flow.js';
import { consentPage } from './pages.js';
import {
  authorizationErrorResponse,
  messagePage,
  readConsentForm,
  redirectWith,
} from '../../../src/remote/pages.js';
import { randomToken } from '../../../src/remote/worker-kit.js';

/** Data kept (encrypted) by the library between the trip to Google and the return. */
export interface SignInData {
  readonly verifier: string;
  readonly nonce: string;
}

/** What Claude's token carries (`ctx.props` on `/mcp`): the user (`sub`), the email and a session id. */
export interface GrantProps {
  readonly owner: string;
  readonly email: string;
  readonly sid: string;
}

/** 403 page for Google accounts outside `ALLOWED_EMAILS` (private mode only). */
export function accessDeniedPage(): Response {
  return messagePage(
    'Access denied',
    'This Google account is not authorized for this connector.',
    403,
  );
}

/** Starts the Google sign-in asking for identity and Gmail (`gmail.modify`) with a refresh token. */
export async function beginGoogleSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  approved: { readonly request: AuthRequest; readonly headers: Headers },
): Promise<Response> {
  const data: SignInData = { verifier: randomToken(), nonce: randomToken() };
  const { state, headers } = await oauth.beginUpstream(approved.request, {
    data,
    headers: approved.headers,
  });
  const location = googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: GMAIL_SCOPES,
    state,
    codeChallenge: pkceChallenge(data.verifier),
    nonce: data.nonce,
    offline: true,
  });
  return redirectWith(location, headers);
}

/** `GET /authorize`: validates Claude's request and shows the consent (or moves on, if remembered). */
export async function showAuthorize(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const authRequest = await oauth.parseAuthRequest(request);
    const remember = { secret: deps.settings.consentSecret };
    if (await oauth.isConsentRemembered(request, authRequest, remember)) {
      return await beginGoogleSignIn(deps, oauth, { request: authRequest, headers: new Headers() });
    }
    const details = await oauth.describeConsent(authRequest);
    const consent = await oauth.beginConsent(authRequest);
    return consentPage(details, consent.handle, consent.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** `POST /authorize`: approves (remembering for 30 days) and goes to Google, or denies and returns to Claude. */
export async function submitAuthorize(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const { handle, denied } = await readConsentForm(oauth, request);
    if (denied) return denied;
    const approved = await oauth.approveConsent(request, handle, {
      remember: { secret: deps.settings.consentSecret },
    });
    return await beginGoogleSignIn(deps, oauth, approved);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** Links the account that just signed in, if Google granted Gmail and a refresh token; failure does not block sign-in. */
export async function linkSignedInAccount(
  deps: GmailDeps,
  identity: GoogleIdentity,
  tokens: GoogleTokens,
): Promise<boolean> {
  if (linkRefusalReason(tokens) !== null) return false;
  try {
    await storeGoogleAccount({ ...deps, owner: identity.sub }, identity.email, tokens);
    return true;
  } catch {
    return false;
  }
}

/** Validates the Google code and, if the account may sign in, links it and completes Claude's authorization. */
export async function completeSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string },
): Promise<string | null> {
  const tokens = await exchangeGoogleCode(deps, resumed.code, resumed.data.verifier);
  if (tokens.idToken === null) throw new Error('Google did not return the id_token.');
  const identity = await verifyGoogleIdToken(deps, tokens.idToken, resumed.data.nonce);
  if (!isEmailAllowed(deps.settings, identity.email)) return null;
  await linkSignedInAccount(deps, identity, tokens);
  const props: GrantProps = { owner: identity.sub, email: identity.email, sid: randomToken(16) };
  const { redirectTo } = await oauth.completeAuthorization({
    request: resumed.request,
    userId: identity.sub,
    metadata: {},
    scope: resumed.request.scope,
    props,
  });
  return redirectTo;
}

/** Return from Google at sign-in: a refusal becomes `access_denied` for Claude; an account off the allowlist, 403. */
export async function finishSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const resumed = await oauth.finishUpstream<SignInData>(request);
    const code = new URL(request.url).searchParams.get('code');
    if (!code) {
      const denied = authorizationErrorRedirect(resumed.request, 'access_denied');
      return redirectWith(denied, resumed.headers);
    }
    const args = { request: resumed.request, data: resumed.data, code };
    const redirectTo = await completeSignIn(deps, oauth, args);
    if (redirectTo === null) return accessDeniedPage();
    return redirectWith(redirectTo, resumed.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}
