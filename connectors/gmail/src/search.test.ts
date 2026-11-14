import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  linkedTestDeps,
  TEST_REFS,
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

const [OWNER, MUSIC] = [TEST_REFS[0]!, TEST_REFS[1]!];
const REQUEST = { query: 'from:image-line', maxResults: 2, pageToken: null };

/** Fake Gmail per account: `threads` lists ids (with next page `p2`) and `threads/<id>` gives metadata. */
function mailbox(dates: Readonly<Record<string, string>>): FakeRoute {
  return (url, init) => {
    if (url.hostname !== 'gmail.googleapis.com') return undefined;
    const auth = (init?.headers as Record<string, string>).authorization ?? '';
    const prefix = auth.endsWith('owner') ? 'd' : 'm';
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

describe('multi-account page_token', () => {
  it('encodes and decodes, ignoring non-string values', () => {
    const token = encodeMultiPageToken({ owner: 'a', music: 'b' });
    expect(decodeMultiPageToken(token!)).toEqual({ owner: 'a', music: 'b' });
    expect(encodeMultiPageToken({})).toBeNull();
    const mixed = Buffer.from(JSON.stringify({ owner: 'a', x: 1 })).toString('base64url');
    expect(decodeMultiPageToken(mixed)).toEqual({ owner: 'a' });
  });

  it('rejects a token not from this search', () => {
    expect(() => decodeMultiPageToken('junk')).toThrow(/Invalid page_token/);
    const list = Buffer.from('[1]').toString('base64url');
    expect(() => decodeMultiPageToken(list)).toThrow(/Invalid page_token/);
  });

  it('pagesToFetch queries all on the first page and only the pending ones afterwards', () => {
    expect(pagesToFetch(TEST_REFS, null)).toEqual([
      [OWNER, null],
      [MUSIC, null],
    ]);
    expect(pagesToFetch(TEST_REFS, encodeMultiPageToken({ music: 't' }))).toEqual([[MUSIC, 't']]);
  });
});

describe('sorting', () => {
  it('threadDate and sortByDateDesc', () => {
    expect(threadDate({ date: 5 })).toBe('');
    const sorted = sortByDateDesc([{ date: '2026-01-01' }, { date: null }, { date: '2026-02-01' }]);
    expect(sorted.map(threadDate)).toEqual(['2026-02-01', '2026-01-01', '']);
  });
});

describe('search', () => {
  it('fetchThreadMetadata asks only for useful headers', async () => {
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

  it('searchAccount summarizes the threads and forwards the query', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([mailbox(DATES)], calls);
    const result = await searchAccount(deps, OWNER, REQUEST);
    expect(result.threads.map((t) => t.thread_id)).toEqual(['d1', 'd2']);
    expect(result.nextPageToken).toBe('d-p2');
    const list = new URL(calls.find((c) => c.url.includes('/threads?'))!.url);
    expect(list.searchParams.get('q')).toBe('from:image-line');
    expect(list.searchParams.get('maxResults')).toBe('2');
  });

  it('searchThreads in one account returns the Gmail page_token', async () => {
    const deps = await linkedTestDeps([mailbox(DATES)]);
    const result = await searchThreads(deps, [MUSIC], REQUEST);
    expect(result).toMatchObject({ next_page_token: 'm-p2' });
  });

  it('searchThreads across all merges, sorts by date and combines the page_tokens', async () => {
    const deps = await linkedTestDeps([mailbox(DATES)]);
    const first = await searchThreads(deps, TEST_REFS, REQUEST);
    const threads = first.threads as Record<string, unknown>[];
    expect(threads.map((t) => `${String(t.account)}:${String(t.thread_id)}`)).toEqual([
      'owner:d2',
      'music:m1',
      'owner:d1',
    ]);
    const token = first.next_page_token as string;
    expect(decodeMultiPageToken(token)).toEqual({ owner: 'd-p2', music: 'm-p2' });
    const second = await searchThreads(deps, TEST_REFS, { ...REQUEST, pageToken: token });
    expect(second.next_page_token).toBeNull();
  });
});
