import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  linkedTestDeps,
  TEST_ACCOUNTS,
  type FakeRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { headers } from './fixtures/messages.js';
import {
  decodeMultiPageToken,
  encodeMultiPageToken,
  fetchThreadMetadata,
  pagesToFetch,
  searchAccount,
  searchThreads,
  sortByDateDesc,
  threadDate,
} from './search.js';

const [OWNER, MUSIC] = [TEST_ACCOUNTS[0]!, TEST_ACCOUNTS[1]!];
const REQUEST = { query: 'from:image-line', maxResults: 2, pageToken: null };

/** Gmail falso por conta: `threads` lista ids (com próxima página `p2`) e `threads/<id>` dá metadados. */
function mailbox(dates: Readonly<Record<string, string>>): FakeRoute {
  return (url, init) => {
    if (url.hostname !== 'gmail.googleapis.com') return undefined;
    const auth = (init?.headers as Record<string, string>).authorization ?? '';
    const prefix = auth.endsWith('dono') ? 'd' : 'm';
    const path = url.pathname.split('/users/me/')[1] ?? '';
    if (path === 'threads') {
      const ids = Object.keys(dates).filter((id) => id.startsWith(prefix));
      const next = url.searchParams.get('pageToken') ? {} : { nextPageToken: `${prefix}-p2` };
      return Response.json({ threads: ids.map((id) => ({ id })), ...next });
    }
    const id = path.slice('threads/'.length);
    const message = { id, internalDate: dates[id], payload: { headers: headers(id, 'x@y') } };
    return Response.json({ id, messages: [message] });
  };
}

const DATES = { d1: '1000', d2: '3000', m1: '2000' };

beforeEach(() => {
  clearAccessTokenCache();
});

describe('page_token de várias contas', () => {
  it('codifica e decodifica, ignorando valores que não são texto', () => {
    const token = encodeMultiPageToken({ dono: 'a', musica: 'b' });
    expect(decodeMultiPageToken(token!)).toEqual({ dono: 'a', musica: 'b' });
    expect(encodeMultiPageToken({})).toBeNull();
    const mixed = Buffer.from(JSON.stringify({ dono: 'a', x: 1 })).toString('base64url');
    expect(decodeMultiPageToken(mixed)).toEqual({ dono: 'a' });
  });

  it('recusa token que não é desta busca', () => {
    expect(() => decodeMultiPageToken('lixo')).toThrow(/page_token inválido/);
    const list = Buffer.from('[1]').toString('base64url');
    expect(() => decodeMultiPageToken(list)).toThrow(/page_token inválido/);
  });

  it('pagesToFetch consulta todas na primeira página e só as pendentes depois', () => {
    expect(pagesToFetch(TEST_ACCOUNTS, null)).toEqual([
      [OWNER, null],
      [MUSIC, null],
    ]);
    expect(pagesToFetch(TEST_ACCOUNTS, encodeMultiPageToken({ musica: 't' }))).toEqual([
      [MUSIC, 't'],
    ]);
  });
});

describe('ordenação', () => {
  it('threadDate e sortByDateDesc', () => {
    expect(threadDate({ date: 5 })).toBe('');
    const sorted = sortByDateDesc([{ date: '2026-01-01' }, { date: null }, { date: '2026-02-01' }]);
    expect(sorted.map(threadDate)).toEqual(['2026-02-01', '2026-01-01', '']);
  });
});

describe('busca', () => {
  it('fetchThreadMetadata pede só cabeçalhos úteis', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([mailbox(DATES)], calls);
    await fetchThreadMetadata(deps, OWNER, 'd1');
    const url = new URL(calls.at(-1)!.url);
    expect(url.searchParams.get('format')).toBe('metadata');
    expect(url.searchParams.getAll('metadataHeaders')).toEqual([
      'From',
      'To',
      'Cc',
      'Date',
      'Subject',
    ]);
  });

  it('searchAccount resume as conversas e repassa a busca', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([mailbox(DATES)], calls);
    const result = await searchAccount(deps, OWNER, REQUEST);
    expect(result.threads.map((t) => t.thread_id)).toEqual(['d1', 'd2']);
    expect(result.nextPageToken).toBe('d-p2');
    const list = new URL(calls.find((c) => c.url.includes('/threads?'))!.url);
    expect(list.searchParams.get('q')).toBe('from:image-line');
    expect(list.searchParams.get('maxResults')).toBe('2');
  });

  it('searchThreads numa conta devolve o page_token do Gmail', async () => {
    const deps = await linkedTestDeps([mailbox(DATES)]);
    const result = await searchThreads(deps, [MUSIC], REQUEST);
    expect(result).toMatchObject({ next_page_token: 'm-p2' });
  });

  it('searchThreads em todas junta, ordena por data e combina os page_token', async () => {
    const deps = await linkedTestDeps([mailbox(DATES)]);
    const first = await searchThreads(deps, TEST_ACCOUNTS, REQUEST);
    const threads = first.threads as Record<string, unknown>[];
    expect(threads.map((t) => `${String(t.account)}:${String(t.thread_id)}`)).toEqual([
      'dono:d2',
      'musica:m1',
      'dono:d1',
    ]);
    const token = first.next_page_token as string;
    expect(decodeMultiPageToken(token)).toEqual({ dono: 'd-p2', musica: 'm-p2' });
    const second = await searchThreads(deps, TEST_ACCOUNTS, { ...REQUEST, pageToken: token });
    expect(second.next_page_token).toBeNull();
  });
});
