/**
 * Google OAuth (the upstream authorization server): authorization URL with `state`, PKCE S256 and `nonce`,
 * code exchange and access token refresh with the refresh token.
 */
import { UPSTREAM_USER_AGENT, type GmailDeps } from './context.js';

/** Google authorization endpoint. */
export const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

/** Google token endpoint. */
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** Google callback path on this Worker (registered in Google Cloud). */
export const GOOGLE_CALLBACK_PATH = '/google/callback';

/** Google authorization URL parameters. */
export interface GoogleAuthorizeParams {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly scopes: readonly string[];
  readonly state: string;
  readonly codeChallenge: string;
  readonly nonce: string;
  /** Asks for a refresh token (`access_type=offline` + `prompt=consent`): only when linking an account. */
  readonly offline: boolean;
  /** Suggests the account to sign in with (`login_hint`), e.g. the owner in the link's identity check. */
  readonly loginHint?: string;
}

/** Google token endpoint response, already validated. */
export interface GoogleTokens {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly refreshToken: string | null;
  readonly idToken: string | null;
  readonly scope: string;
}

/** Error returned by the Google token endpoint (`invalid_grant` = access revoked). */
export class GoogleTokenError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Google rejected the token (${code}).`);
    this.name = 'GoogleTokenError';
    this.code = code;
  }
}

/** Google callback address for the Worker origin. */
export function googleRedirectUri(origin: string): string {
  return `${origin}${GOOGLE_CALLBACK_PATH}`;
}

/** Builds the Google authorization URL. */
export function googleAuthorizeUrl(params: GoogleAuthorizeParams): string {
  const url = new URL(GOOGLE_AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: params.scopes.join(' '),
    state: params.state,
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
    nonce: params.nonce,
    ...(params.loginHint ? { login_hint: params.loginHint } : {}),
    ...(params.offline
      ? {
          access_type: 'offline',
          prompt: 'consent select_account',
          include_granted_scopes: 'false',
        }
      : { prompt: 'select_account' }),
  }).toString();
  return url.toString();
}

/** Validates the token endpoint success JSON; throws if the access token is missing. */
export function parseGoogleTokens(body: unknown): GoogleTokens {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  if (typeof data.access_token !== 'string') throw new GoogleTokenError('invalid_response');
  return {
    accessToken: data.access_token,
    expiresIn: typeof data.expires_in === 'number' ? data.expires_in : 3600,
    refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : null,
    idToken: typeof data.id_token === 'string' ? data.id_token : null,
    scope: typeof data.scope === 'string' ? data.scope : '',
  };
}

/** OAuth error code of a Google failure response (`error`), or `http_<status>`. */
export async function googleErrorCode(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === 'string') return body.error;
  } catch {
    // body is not JSON: use the status
  }
  return `http_${response.status}`;
}

/** Posts a form to the Google token endpoint with the client credentials. */
export async function postGoogleToken(
  deps: GmailDeps,
  form: Readonly<Record<string, string>>,
): Promise<GoogleTokens> {
  const body = new URLSearchParams({
    ...form,
    client_id: deps.settings.googleClientId,
    client_secret: deps.settings.googleClientSecret,
  });
  const response = await deps.fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': UPSTREAM_USER_AGENT,
    },
    body: body.toString(),
  });
  if (!response.ok) throw new GoogleTokenError(await googleErrorCode(response));
  return parseGoogleTokens(await response.json());
}

/** Exchanges the Google authorization code (with the PKCE verifier) for tokens. */
export function exchangeGoogleCode(
  deps: GmailDeps,
  code: string,
  verifier: string,
): Promise<GoogleTokens> {
  return postGoogleToken(deps, {
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier,
    redirect_uri: googleRedirectUri(deps.origin),
  });
}

/** Refreshes the access token with the stored refresh token. */
export function refreshGoogleToken(deps: GmailDeps, refreshToken: string): Promise<GoogleTokens> {
  return postGoogleToken(deps, { grant_type: 'refresh_token', refresh_token: refreshToken });
}

/** Google token revocation endpoint. */
export const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

/** Revokes the refresh token at Google (the app loses access to the account); returns whether Google confirmed. */
export async function revokeGoogleToken(deps: GmailDeps, token: string): Promise<boolean> {
  try {
    const response = await deps.fetch(GOOGLE_REVOKE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': UPSTREAM_USER_AGENT,
      },
      body: new URLSearchParams({ token }).toString(),
    });
    return response.ok;
  } catch {
    return false;
  }
}
