/**
 * Pagination of the Web API within the call budget: offset pages (`limit`/`offset`/`total`) and cursor pages
 * (`after`). When the budget runs out, what was read so far comes back with where to continue.
 */
import type { QueryParams } from '../../../src/core/http.js';
import { asJsonObject } from '../../../src/remote/streamed-tool.js';
import type { OwnerDeps } from './context.js';
import { spotifyCall } from './spotify-api.js';
import { BudgetExhaustedError } from './spotify-errors.js';

/** A request for offset pages: path, extra query, where to start, page size and how many items at most. */
export interface OffsetRequest {
  readonly path: string;
  readonly query?: QueryParams;
  readonly offset: number;
  readonly pageSize: number;
  readonly maxItems: number;
}

/** Items read, the total Spotify reports and the next offset (null when everything was read). */
export interface OffsetResult {
  readonly items: unknown[];
  readonly total: number;
  readonly nextOffset: number | null;
}

/** Reads a paging object (`items`, `total`, `next`), optionally nested under `key` (search, following). */
export function readPagingObject(
  body: unknown,
  key?: string,
): { items: unknown[]; total: number; hasNext: boolean } {
  const root = asJsonObject(body) ?? {};
  const page = (key ? asJsonObject(root[key]) : root) ?? {};
  return {
    items: Array.isArray(page.items) ? page.items : [],
    total: typeof page.total === 'number' ? page.total : 0,
    hasNext: typeof page.next === 'string' && page.next.length > 0,
  };
}

/** The `after` cursor of a cursor-paged object nested under `key` (null at the end). */
export function cursorAfter(body: unknown, key: string): string | null {
  const page = asJsonObject(asJsonObject(body)?.[key]);
  const after = asJsonObject(page?.cursors)?.after;
  return typeof after === 'string' && after.length > 0 ? after : null;
}

/** Offset of the next page after reading `count` items from `offset` (null at the end). */
export function nextPageOffset(offset: number, count: number, total: number): number | null {
  return offset + count < total && count > 0 ? offset + count : null;
}

/** Reads one offset page. */
export async function fetchOffsetPage(
  deps: OwnerDeps,
  request: OffsetRequest,
  offset: number,
): Promise<OffsetResult> {
  const limit = Math.min(request.pageSize, request.maxItems);
  const query = { ...request.query, limit, offset };
  const page = readPagingObject(await spotifyCall(deps, { path: request.path, query }));
  const next = offset + page.items.length;
  const done = !page.hasNext || page.items.length === 0 || next >= page.total;
  return { items: page.items, total: page.total, nextOffset: done ? null : next };
}

/** Reads pages from `offset` until the end, `maxItems` or the budget; rethrows only if nothing was read. */
export async function collectOffsetPages(
  deps: OwnerDeps,
  request: OffsetRequest,
): Promise<OffsetResult> {
  const items: unknown[] = [];
  let state: OffsetResult = { items, total: 0, nextOffset: request.offset };
  while (state.nextOffset !== null && items.length < request.maxItems) {
    const remaining = { ...request, maxItems: request.maxItems - items.length };
    try {
      const page = await fetchOffsetPage(deps, remaining, state.nextOffset);
      items.push(...page.items);
      state = { items, total: page.total, nextOffset: page.nextOffset };
    } catch (error) {
      if (!(error instanceof BudgetExhaustedError) || items.length === 0) throw error;
      break;
    }
  }
  return state;
}
