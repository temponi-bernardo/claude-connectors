/**
 * Gmail API client: builds the URL, sends the account access token and the User-Agent, retries once after
 * a 401 and turns HTTP failures into actionable messages. Writes (`gmailWrite`) first require the
 * `gmail.modify` scope on the account, so old (read-only) accounts ask for relinking without calling Google.
 */
import { requireWriteAccess, type AccountRef } from './accounts.js';
import { UPSTREAM_USER_AGENT, type GmailDeps, type OwnerDeps } from './context.js';
import { forgetAccessToken, getAccessToken } from './access-token.js';

/** Gmail API base for the token's account. */
export const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/** Value of a Gmail API parameter; lists become the repeated parameter (`metadataHeaders=a&...=b`). */
export type GmailQueryValue = string | number | readonly string[] | null | undefined;

/** Gmail API request: URL, method (GET by default) and optional JSON body. */
export interface GmailRequest {
  readonly url: string;
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly body?: unknown;
}

/** Longest Gmail error detail passed on to the model, in characters. */
export const MAX_GMAIL_ERROR_DETAIL = 200;

/** Messages per Gmail API HTTP status. */
export const GMAIL_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Gmail rejected the request (check ids, query and recipients)',
  403: 'Gmail denied access (missing permission: use link_account and link the account again)',
  404: 'not found (wrong id or from another account)',
  429: 'Gmail usage limit reached; try again shortly',
};

/** Builds the URL of a Gmail API path with the given parameters (nulls and empties are omitted). */
export function gmailUrl(
  path: string,
  params: Readonly<Record<string, GmailQueryValue>> = {},
): string {
  const url = new URL(`${GMAIL_API_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    const values: readonly (string | number)[] = Array.isArray(value)
      ? value
      : [value as string | number];
    for (const item of values) url.searchParams.append(key, String(item));
  }
  return url.toString();
}

/** Actionable error for a Gmail API failure response, with Gmail's detail when present. */
export function gmailHttpError(status: number, alias: string, detail: string | null = null): Error {
  const reason = GMAIL_STATUS_MESSAGES[status] ?? `Gmail failed (HTTP ${status}); try again`;
  return new Error(`Account "${alias}": ${reason}${detail ? `: ${detail}` : ''}.`);
}

/** Detail (`error.message`) of a Gmail API error response, capped; null if absent. */
export async function gmailErrorDetail(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { error?: { message?: unknown } };
    const message = body.error?.message;
    return typeof message === 'string' ? message.slice(0, MAX_GMAIL_ERROR_DETAIL) : null;
  } catch {
    return null;
  }
}

/** Sends an authenticated request to the Gmail API with the given access token. */
export function sendGmailRequest(
  deps: GmailDeps,
  request: GmailRequest,
  token: string,
): Promise<Response> {
  const hasBody = request.body !== undefined;
  return deps.fetch(request.url, {
    method: request.method ?? 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      'user-agent': UPSTREAM_USER_AGENT,
      ...(hasBody ? { 'content-type': 'application/json' } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(request.body) } : {}),
  });
}

/** Reads the JSON of a success response; an empty body (e.g. a DELETE 204) becomes an empty object. */
export async function readGmailJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** Calls the Gmail API and reads the JSON; after a 401 it refreshes the token and retries once. */
export async function gmailCall<T>(
  deps: OwnerDeps,
  ref: AccountRef,
  request: GmailRequest,
): Promise<T> {
  let response = await sendGmailRequest(deps, request, await getAccessToken(deps, ref));
  if (response.status === 401) {
    forgetAccessToken(deps.owner, ref.account.email);
    response = await sendGmailRequest(deps, request, await getAccessToken(deps, ref));
  }
  if (!response.ok) {
    throw gmailHttpError(response.status, ref.alias, await gmailErrorDetail(response));
  }
  return readGmailJson<T>(response);
}

/** Reads a Gmail API resource as JSON. */
export function gmailGet<T>(deps: OwnerDeps, ref: AccountRef, url: string): Promise<T> {
  return gmailCall<T>(deps, ref, { url });
}

/** Writes to the Gmail API (send, drafts, labels, trash), first requiring the `gmail.modify` scope. */
export async function gmailWrite<T>(
  deps: OwnerDeps,
  ref: AccountRef,
  request: GmailRequest,
): Promise<T> {
  requireWriteAccess(ref);
  return gmailCall<T>(deps, ref, request);
}
