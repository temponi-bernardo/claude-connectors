/**
 * Busca de conversas com a sintaxe do Gmail, numa conta ou em todas: resumo de cada conversa, ordenação
 * por data e paginação (com `all`, o `page_token` junta o de cada conta).
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl } from './gmail-api.js';
import { MESSAGE_HEADERS, summarizeThread, type GmailThread } from './message-format.js';

/** Pedido de busca já validado. */
export interface SearchRequest {
  readonly query: string;
  readonly maxResults: number;
  readonly pageToken: string | null;
}

/** Resultado da busca numa conta. */
export interface AccountSearchResult {
  readonly threads: Record<string, unknown>[];
  readonly nextPageToken: string | null;
}

/** Página da busca em várias contas: `page_token` por apelido. */
export type MultiPageToken = Readonly<Record<string, string>>;

/** Codifica os `page_token` de várias contas num só texto (base64url de JSON). */
export function encodeMultiPageToken(tokens: MultiPageToken): string | null {
  return Object.keys(tokens).length === 0
    ? null
    : Buffer.from(JSON.stringify(tokens)).toString('base64url');
}

/** Decodifica o `page_token` de várias contas; lança erro acionável se não for um token desta busca. */
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

/** Lê uma conversa só com os cabeçalhos úteis (sem corpo), para o resumo da busca. */
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

/** Busca numa conta: lista as conversas e lê os cabeçalhos de cada uma em paralelo. */
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

/** Data ISO de um resumo de conversa, ou texto vazio. */
export function threadDate(thread: Readonly<Record<string, unknown>>): string {
  return typeof thread.date === 'string' ? thread.date : '';
}

/** Ordena resumos de conversas da mais recente para a mais antiga. */
export function sortByDateDesc(threads: Record<string, unknown>[]): Record<string, unknown>[] {
  return [...threads].sort((a, b) => threadDate(b).localeCompare(threadDate(a)));
}

/** Contas a consultar e o token de cada uma, a partir do `page_token` de várias contas. */
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

/** Busca em uma ou várias contas e devolve as conversas e o próximo `page_token`. */
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
