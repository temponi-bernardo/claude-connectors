/** Test helpers of the plan page: the template loaded into the jsdom document, and a fake Claude runtime. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { injectPlan } from '../../plan-embed.js';
import type { PlanData } from '../../plan-schema.js';
import type { CheckMap, ClaudeLike, DocRefLike, DocSnapLike } from '../checks.js';

/** Path of the template source. */
export const PLAN_TEMPLATE_SOURCE = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'template.html',
);

const TEMPLATE = readFileSync(PLAN_TEMPLATE_SOURCE, 'utf8');

/** Replaces the jsdom document with a page (scripts are parsed, not run). */
export function replaceDocument(html: string): Document {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  document.replaceChild(
    document.importNode(parsed.documentElement, true),
    document.documentElement,
  );
  return document;
}

/** Replaces the jsdom document with the template filled with the plan (the runtime slot stays empty). */
export function loadPlanDocument(plan: PlanData): Document {
  return replaceDocument(injectPlan(TEMPLATE, plan));
}

export interface FakeAccount {
  readonly claude: ClaudeLike;
  readonly ref: DocRefLike;
  readonly writes: Record<string, unknown>[];
  readonly paths: string[];
  readonly failures: unknown[];
  readonly listeners: ((snap: DocSnapLike) => void)[];
  body: Record<string, unknown> | undefined;
}

/** Resolves a value, or rejects with the next queued failure. */
function nextResult<T>(account: FakeAccount, value: () => T): Promise<T> {
  const failure = account.failures.shift();
  return failure === undefined
    ? Promise.resolve(value())
    : Promise.reject(Object.assign(new Error('fake failure'), failure));
}

/** The fake document reference: get, set and onSnapshot over the in-memory body. */
function fakeRef(account: FakeAccount): DocRefLike {
  return {
    get: () =>
      nextResult(account, () => ({ exists: account.body !== undefined, data: () => account.body })),
    set: (data) =>
      nextResult(account, () => {
        account.body = data;
        account.writes.push(data);
      }),
    onSnapshot: (next) => {
      account.listeners.push(next);
      return () => undefined;
    },
  };
}

/** The fake `window.claude`: `user` with the given id and `db` with one document. */
function fakeClaude(account: FakeAccount, uid: string | null): ClaudeLike {
  const db = {
    collection: (path: string) => ({
      doc: (id: string) => {
        account.paths.push(`${path}/${id}`);
        return account.ref;
      },
    }),
  };
  const user = { id: () => Promise.resolve(uid) };
  return {
    use: (name) => Promise.resolve(({ db, user } as Record<string, unknown>)[name] ?? null),
  };
}

/** A fake Claude runtime whose db keeps one document in memory; `failures` are thrown by the next calls. */
export function fakeAccount(initial?: CheckMap, uid: string | null = 'viewer-1'): FakeAccount {
  const account = {
    writes: [],
    paths: [],
    failures: [],
    listeners: [],
    body: initial ? { checks: initial, v: 1 } : undefined,
  } as unknown as FakeAccount & { ref: DocRefLike; claude: ClaudeLike };
  account.ref = fakeRef(account);
  account.claude = fakeClaude(account, uid);
  return account;
}

/** Delivers a change of the account document to the listeners (another device). */
export function emitChecks(account: FakeAccount, checks: CheckMap, pending = false): void {
  account.body = { checks, v: 1 };
  const snap = { exists: true, data: () => account.body, metadata: { hasPendingWrites: pending } };
  for (const listener of account.listeners) listener(snap);
}
