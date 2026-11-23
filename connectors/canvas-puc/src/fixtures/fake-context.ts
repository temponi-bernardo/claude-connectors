/**
 * Fake context to test the tools without network: responses by API path.
 */
import { vi, type Mock } from 'vitest';
import type { CanvasClient, CanvasUploadSlot, UploadedBytes } from '../client.js';
import type { CanvasContext } from '../context.js';
import type { QueryParams } from '../../../../src/core/http.js';
import { toToolResult } from '../../../../src/mcp/tools.js';

/** Responses by path; an `Error` as the value makes the call fail. */
export type Routes = Record<string, unknown>;

function answer(routes: Routes, path: string): Promise<unknown> {
  if (!(path in routes)) return Promise.reject(new Error(`route not mocked: ${path}`));
  const value = routes[path];
  return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
}

type GetFn = (path: string, params?: QueryParams) => Promise<unknown>;
type PostFn = (path: string, body: unknown) => Promise<unknown>;
type TextFn = (url: string) => Promise<unknown>;
type UploadFn = (slot: CanvasUploadSlot, file: UploadedBytes) => Promise<unknown>;

/** Fake context with the mocks exposed for assertions. */
export interface FakeContext {
  readonly ctx: CanvasContext;
  readonly get: Mock<GetFn>;
  readonly getAll: Mock<GetFn>;
  readonly post: Mock<PostFn>;
  readonly fetchText: Mock<TextFn>;
  readonly fetchBytes: Mock<TextFn>;
  readonly fetchStream: Mock<TextFn>;
  /** Answers with the route keyed by the slot's `upload_url`. */
  readonly upload: Mock<UploadFn>;
}

/** Creates a context with a fake client and a clock fixed at 2026-11-05T12:00:00Z. */
export function fakeContext(routes: Routes = {}): FakeContext {
  const get = vi.fn<GetFn>((path) => answer(routes, path));
  const getAll = vi.fn<GetFn>((path) => answer(routes, path));
  const post = vi.fn<PostFn>((path) => answer(routes, path));
  const fetchText = vi.fn<TextFn>((url) => answer(routes, url));
  const fetchBytes = vi.fn<TextFn>((url) => answer(routes, url));
  const fetchStream = vi.fn<TextFn>((url) => answer(routes, url));
  const upload = vi.fn<UploadFn>((slot) => answer(routes, slot.upload_url));
  const client = {
    baseUrl: 'https://x.test',
    get,
    getAll,
    post,
    fetchText,
    fetchBytes,
    fetchStream,
    upload,
  } as unknown as CanvasClient;
  const ctx: CanvasContext = { client, now: () => new Date('2026-11-05T12:00:00Z') };
  return { ctx, get, getAll, post, fetchText, fetchBytes, fetchStream, upload };
}

/** Text blocks of a tool result: the JSON rows parsed and the notes after them. */
export function resultParts(result: unknown): { rows: never; notes: string[] } {
  const [first, ...rest] = toToolResult(result).content.map((c) => (c as { text: string }).text);
  return { rows: JSON.parse(first ?? 'null') as never, notes: rest };
}
