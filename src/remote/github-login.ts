/**
 * Owner login through GitHub (OAuth App): the remote server sends the browser to GitHub, exchanges the code for a
 * single-use token, reads the verified emails and only accepts someone on the list (`ALLOWED_EMAILS`). The GitHub
 * token is not stored; the "secret" sealed into the connector tokens is the accepted email.
 */
import type { UpstreamLogin } from './handler.js';

/** GitHub login configuration. */
export interface GithubLoginSettings {
  readonly clientId: string;
  readonly clientSecret: string;
  /** Accepted emails, already lowercase. */
  readonly allowedEmails: readonly string[];
  readonly fetchFn: typeof fetch;
}

/** An item of the GitHub API `GET /user/emails` (only the fields used). */
export interface GithubEmail {
  readonly email: string;
  readonly verified: boolean;
}

/** User-Agent of the GitHub calls: the API rejects requests without one (and the Workers fetch sends none). */
export const GITHUB_USER_AGENT =
  'claude-connectors (+https://github.com/temponi-bernardo/claude-connectors)';

/** Address of the GitHub authorization screen, asking only to read the emails. */
export function githubAuthorizeUrl(
  settings: GithubLoginSettings,
  state: string,
  callbackUrl: string,
): string {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', settings.clientId);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('scope', 'user:email');
  url.searchParams.set('state', state);
  url.searchParams.set('allow_signup', 'false');
  return url.toString();
}

/** Reads a comma-separated email list, lowercased and without empty items. */
export function parseEmailList(raw: string | null): string[] {
  return (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes('@'));
}

/** Picks the first verified email on the list; null if none fits. */
export function pickAllowedEmail(
  emails: readonly GithubEmail[],
  allowed: readonly string[],
): string | null {
  const match = emails.find((item) => item.verified && allowed.includes(item.email.toLowerCase()));
  return match ? match.email.toLowerCase() : null;
}

/** Exchanges the GitHub code for an access token; rejects with a user-facing message if it fails. */
export async function exchangeGithubCode(
  settings: GithubLoginSettings,
  code: string,
  callbackUrl: string,
): Promise<string> {
  const res = await settings.fetchFn('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'user-agent': GITHUB_USER_AGENT,
    },
    body: JSON.stringify({
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      code,
      redirect_uri: callbackUrl,
    }),
  });
  const body = (await res.json().catch(() => null)) as { access_token?: unknown } | null;
  if (!res.ok || typeof body?.access_token !== 'string') {
    throw new Error('GitHub did not confirm the login. Try signing in again.');
  }
  return body.access_token;
}

/** Reads the GitHub account emails with the access token. */
export async function fetchGithubEmails(
  settings: GithubLoginSettings,
  token: string,
): Promise<GithubEmail[]> {
  const res = await settings.fetchFn('https://api.github.com/user/emails', {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'user-agent': GITHUB_USER_AGENT,
    },
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status} when reading the account emails.`);
  const body: unknown = await res.json();
  return Array.isArray(body) ? (body as GithubEmail[]) : [];
}

/** Finishes the login: checks the GitHub callback and returns the accepted email, or rejects explaining why. */
export async function finishGithubLogin(
  settings: GithubLoginSettings,
  query: URLSearchParams,
  callbackUrl: string,
): Promise<string> {
  const code = query.get('code');
  if (!code) throw new Error('GitHub login was cancelled or denied.');
  const token = await exchangeGithubCode(settings, code, callbackUrl);
  const email = pickAllowedEmail(await fetchGithubEmails(settings, token), settings.allowedEmails);
  if (!email) {
    throw new Error(
      'This GitHub account has no verified email in ALLOWED_EMAILS. Only the server owner can sign in.',
    );
  }
  return email;
}

/** GitHub login for the remote connector, in the shape the remote server expects. */
export function githubUpstreamLogin(settings: GithubLoginSettings): UpstreamLogin {
  return {
    kind: 'upstream',
    start: (state, callbackUrl) => githubAuthorizeUrl(settings, state, callbackUrl),
    finish: (query, callbackUrl) => finishGithubLogin(settings, query, callbackUrl),
  };
}
