/**
 * Spotify accounts service (the upstream authorization server) with the USER's own app: authorization URL,
 * code exchange and refresh, authenticated with that app's Client ID and Secret (HTTP Basic).
 */
import { oauthErrorCode } from '../../../src/remote/worker-kit.js';
import { SPOTIFY_SCOPES } from './config.js';
import { SPOTIFY_USER_AGENT, type SpotifyDeps } from './context.js';

/** Spotify authorization endpoint. */
export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';

/** Spotify token endpoint. */
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

/** Callback path on this Worker: the Redirect URI each user registers in their Spotify app. */
export const SPOTIFY_CALLBACK_PATH = '/spotify/callback';

/** A Spotify app's credentials (the user's own). */
export interface AppCredentials {
  readonly clientId: string;
  readonly clientSecret: string;
}

/** Token endpoint response, already validated. */
export interface SpotifyTokens {
  readonly accessToken: string;
  readonly expiresIn: number;
  /** Present on the code exchange; on refresh only when Spotify rotates it. */
  readonly refreshToken: string | null;
  readonly scope: string;
}

/** Error returned by the token endpoint (`invalid_grant` = expired or revoked, `invalid_client` = bad app). */
export class SpotifyTokenError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Spotify rejected the token request (${code}).`);
    this.name = 'SpotifyTokenError';
    this.code = code;
  }
}

/** The Redirect URI for the Worker origin. */
export function spotifyRedirectUri(origin: string): string {
  return `${origin}${SPOTIFY_CALLBACK_PATH}`;
}

/** Builds the authorization URL (always shows the dialog, so the user sees which account they authorize). */
export function spotifyAuthorizeUrl(clientId: string, origin: string, state: string): string {
  const url = new URL(SPOTIFY_AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: spotifyRedirectUri(origin),
    scope: SPOTIFY_SCOPES.join(' '),
    state,
    show_dialog: 'true',
  }).toString();
  return url.toString();
}

/** Validates the token endpoint JSON; throws if the access token is missing. */
export function parseSpotifyTokens(body: unknown): SpotifyTokens {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  if (typeof data.access_token !== 'string') throw new SpotifyTokenError('invalid_response');
  return {
    accessToken: data.access_token,
    expiresIn: typeof data.expires_in === 'number' ? data.expires_in : 3600,
    refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : null,
    scope: typeof data.scope === 'string' ? data.scope : '',
  };
}

/** Posts a form to the token endpoint authenticated with the user's app (HTTP Basic). */
export async function postSpotifyToken(
  deps: SpotifyDeps,
  app: AppCredentials,
  form: Readonly<Record<string, string>>,
): Promise<SpotifyTokens> {
  const basic = Buffer.from(`${app.clientId}:${app.clientSecret}`).toString('base64');
  const response = await deps.fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      authorization: `Basic ${basic}`,
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': SPOTIFY_USER_AGENT,
    },
    body: new URLSearchParams(form).toString(),
  });
  if (!response.ok) throw new SpotifyTokenError(await oauthErrorCode(response));
  return parseSpotifyTokens(await response.json());
}

/** Exchanges the authorization code for tokens. */
export function exchangeSpotifyCode(
  deps: SpotifyDeps,
  app: AppCredentials,
  code: string,
): Promise<SpotifyTokens> {
  const form = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: spotifyRedirectUri(deps.origin),
  };
  return postSpotifyToken(deps, app, form);
}

/** Gets a new access token with the stored refresh token. */
export function refreshSpotifyToken(
  deps: SpotifyDeps,
  app: AppCredentials,
  refreshToken: string,
): Promise<SpotifyTokens> {
  return postSpotifyToken(deps, app, { grant_type: 'refresh_token', refresh_token: refreshToken });
}
