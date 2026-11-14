/**
 * Thread search with Gmail syntax, in one account or all of them: a summary of each thread, sorting by date
 * and pagination (with `all`, the `page_token` combines each account's token).
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl } from './gmail-api.js';
import { MESSAGE_HEADERS, summarizeThread, type GmailThread } from './message-format.js';

/** Search request, already validated. */
export interface SearchRequest {
  readonly query: string;
  readonly maxResults: number;
  readonly pageToken: string | null;
}

/** Search result in one account. */
export interface AccountSearchResult {
  readonly threads: Record<string, unknown>[];
  readonly nextPageToken: string | null;
}

/** Multi-account search page: `page_token` per alias. */
export type MultiPageToken = Readonly<Record<string, string>>;

/** Encodes several accounts' `page_token`s into one string (base64url JSON). */
export function encodeMultiPageToken(tokens: MultiPageToken): string | null {
  return Object.keys(tokens).length === 0
    ? null
    : Buffer.from(JSON.stringify(tokens)).toString('base64url');
}

/** Decodes the multi-account `page_token`; throws an actionable error if it is not from this search. */
export function decodeMultiPageToken(token: string): MultiPageToken {
  try {
    const value: unknown = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      throw new Error('format');
    const entries = Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    );
    return Object.fromEntries(entries);
  } catch {
    throw new Error(
      'Invalid page_token: use the next_page_token returned by the previous search with account "all".',
    );
  }
}

/** Reads a thread with only the useful headers (no body), for the search summary. */
export function fetchThreadMetadata(
  deps: OwnerDeps,
  ref: AccountRef,
  threadId: string,
): Promise<GmailThread> {
  const url = gmailUrl(`threads/${threadId}`, {
    format: 'metadata',
    metadataHeaders: MESSAGE_HEADERS,
  });
  return gmailGet<GmailThread>(deps, ref, url);
}

/** Searches one account: lists the threads and reads each one's headers in parallel. */
export async function searchAccount(
  deps: OwnerDeps,
  ref: AccountRef,
  request: SearchRequest,
): Promise<AccountSearchResult> {
  const listUrl = gmailUrl('threads', {
    q: request.query,
    maxResults: request.maxResults,
    pageToken: request.pageToken,
  });
  const list = await gmailGet<{ threads?: { id: string }[]; nextPageToken?: string }>(
    deps,
    ref,
    listUrl,
  );
  const threads = await Promise.all(
    (list.threads ?? []).map(({ id }) => fetchThreadMetadata(deps, ref, id)),
  );
  return {
    threads: threads.map((thread) => summarizeThread(thread, ref.alias)),
    nextPageToken: list.nextPageToken ?? null,
  };
}

/** ISO date of a thread summary, or an empty string. */
export function threadDate(thread: Readonly<Record<string, unknown>>): string {
  return typeof thread.date === 'string' ? thread.date : '';
}

/** Sorts thread summaries from newest to oldest. */
export function sortByDateDesc(threads: Record<string, unknown>[]): Record<string, unknown>[] {
  return [...threads].sort((a, b) => threadDate(b).localeCompare(threadDate(a)));
}

/** Accounts to query and each one's token, from the multi-account `page_token`. */
export function pagesToFetch(
  accounts: readonly AccountRef[],
  pageToken: string | null,
): [AccountRef, string | null][] {
  if (pageToken === null) return accounts.map((account) => [account, null]);
  const tokens = decodeMultiPageToken(pageToken);
  return accounts
    .filter((a) => tokens[a.alias] !== undefined)
    .map((a) => [a, tokens[a.alias] ?? null]);
}

/** Searches one or more accounts and returns the threads and the next `page_token`. */
export async function searchThreads(
  deps: OwnerDeps,
  accounts: readonly AccountRef[],
  request: SearchRequest,
): Promise<Record<string, unknown>> {
  if (accounts.length === 1 && accounts[0]) {
    const result = await searchAccount(deps, accounts[0], request);
    return { threads: result.threads, next_page_token: result.nextPageToken };
  }
  const pages = pagesToFetch(accounts, request.pageToken);
  const results = await Promise.all(
    pages.map(([ref, pageToken]) => searchAccount(deps, ref, { ...request, pageToken })),
  );
  const next = Object.fromEntries(
    results.flatMap((result, i) =>
      result.nextPageToken ? [[pages[i]?.[0].alias, result.nextPageToken]] : [],
    ),
  ) as MultiPageToken;
  return {
    threads: sortByDateDesc(results.flatMap((r) => r.threads)),
    next_page_token: encodeMultiPageToken(next),
  };
}
