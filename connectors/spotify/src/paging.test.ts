import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { fakeSpotify, pagedRoute, testOwnerDeps } from './fixtures/fake-spotify.js';
import {
  collectOffsetPages,
  cursorAfter,
  fetchOffsetPage,
  nextPageOffset,
  readPagingObject,
} from './paging.js';
import { BudgetExhaustedError } from './spotify-errors.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

const ITEMS = Array.from({ length: 120 }, (_, i) => ({ n: i }));

describe('paging', () => {
  it('reads paging objects, nested ones and cursors', () => {
    expect(readPagingObject({ items: [1], total: 5, next: 'u' })).toEqual({
      items: [1],
      total: 5,
      hasNext: true,
    });
    expect(
      readPagingObject({ artists: { items: [], total: 0, next: null } }, 'artists').hasNext,
    ).toBe(false);
    expect(readPagingObject(null)).toEqual({ items: [], total: 0, hasNext: false });
    expect(cursorAfter({ artists: { cursors: { after: 'c1' } } }, 'artists')).toBe('c1');
    expect(cursorAfter({ artists: { cursors: { after: null } } }, 'artists')).toBeNull();
  });

  it('nextPageOffset stops at the end', () => {
    expect(nextPageOffset(0, 50, 120)).toBe(50);
    expect(nextPageOffset(100, 20, 120)).toBeNull();
    expect(nextPageOffset(0, 0, 10)).toBeNull();
  });

  it('collects every page (all pagination, 120 items over 3 pages)', async () => {
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, ITEMS)]));
    const read = await collectOffsetPages(deps, {
      path: '/me/tracks',
      offset: 0,
      pageSize: 50,
      maxItems: 1000,
    });
    expect(read.items).toHaveLength(120);
    expect(read.total).toBe(120);
    expect(read.nextOffset).toBeNull();
  });

  it('stops at maxItems and says where to continue', async () => {
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, ITEMS)]));
    const read = await collectOffsetPages(deps, {
      path: '/me/tracks',
      offset: 10,
      pageSize: 50,
      maxItems: 30,
    });
    expect(read.items).toHaveLength(30);
    expect(read.nextOffset).toBe(40);
  });

  it('returns what it read when the budget runs out, and rethrows when nothing was read', async () => {
    const route = pagedRoute(/\/v1\/me\/tracks$/, ITEMS);
    const deps = await testOwnerDeps(fakeSpotify([route]), { budget: 3 });
    const read = await collectOffsetPages(deps, {
      path: '/me/tracks',
      offset: 0,
      pageSize: 50,
      maxItems: 1000,
    });
    expect(read.items).toHaveLength(100);
    expect(read.nextOffset).toBe(100);
    const empty = await testOwnerDeps(fakeSpotify([route]), { budget: 0 });
    await expect(
      collectOffsetPages(empty, { path: '/me/tracks', offset: 0, pageSize: 50, maxItems: 10 }),
    ).rejects.toBeInstanceOf(BudgetExhaustedError);
  });

  it('fetchOffsetPage passes limit and offset', async () => {
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/x$/, ITEMS)]));
    const page = await fetchOffsetPage(
      deps,
      { path: '/x', query: { market: 'from_token' }, offset: 0, pageSize: 50, maxItems: 5 },
      115,
    );
    expect(page.items).toHaveLength(5);
    expect(page.nextOffset).toBeNull();
  });
});
