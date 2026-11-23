/**
 * Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage
 * and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the
 * viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`.
 */

export type SyncState = 'loading' | 'account' | 'local' | 'error';
export type CheckMap = Record<string, boolean>;

/** Status line of each sync state (pt-BR). */
export const SYNC_MESSAGES: Readonly<Record<SyncState, string>> = {
  loading: 'Carregando as marcações salvas…',
  account:
    'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.',
  local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.',
  error:
    'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.',
};

/** How long the page waits for the account before saying the ticks are local only. */
export const ACCOUNT_TIMEOUT_MS = 10000;

export interface DocSnapLike {
  readonly exists: boolean;
  data(): Record<string, unknown> | undefined;
  readonly metadata?: { readonly hasPendingWrites: boolean };
}
export interface DocRefLike {
  get(): Promise<DocSnapLike>;
  set(data: Record<string, unknown>): Promise<void>;
  onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void;
}
export interface DbLike {
  collection(path: string): { doc(id: string): DocRefLike };
}
export interface UserLike {
  id(): Promise<string | null>;
}
export interface ClaudeLike {
  use(name: string): Promise<unknown>;
}

interface Registered {
  readonly box: HTMLInputElement;
  readonly row: HTMLElement;
  readonly def: boolean;
}

export interface CheckStore {
  readonly key: string;
  saved: CheckMap;
  readonly touched: Set<string>;
  readonly boxes: Map<string, Registered>;
  readonly storage: Storage | null;
  remote: DocRefLike | null;
  writing: boolean;
  dirty: boolean;
  readonly listeners: (() => void)[];
  readonly status: (state: SyncState) => void;
  readonly wait: (ms: number) => Promise<void>;
}

export interface CheckStoreOptions {
  readonly key: string;
  readonly storage: Storage | null;
  readonly status: (state: SyncState) => void;
  readonly wait?: (ms: number) => Promise<void>;
}

/** Only the boolean entries of an unknown value (anything else is dropped). */
export function toCheckMap(value: unknown): CheckMap {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  const map: CheckMap = {};
  for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v;
  return map;
}

/** Ticks stored as JSON text; empty on missing or broken text. */
export function parseStoredChecks(text: string | null): CheckMap {
  try {
    return toCheckMap(text === null ? {} : JSON.parse(text));
  } catch {
    return {};
  }
}

/** Remote ticks win over local ones, except those the viewer changed in this page load. */
export function mergeChecks(
  local: CheckMap,
  remote: CheckMap,
  touched: ReadonlySet<string>,
): CheckMap {
  const mine: CheckMap = {};
  for (const id of touched) if (id in local) mine[id] = local[id] === true;
  return { ...local, ...remote, ...mine };
}

/** Says whether local ticks are missing from the account (or newer), so they must be sent. */
export function hasLocalOnly(
  local: CheckMap,
  remote: CheckMap,
  touched: ReadonlySet<string>,
): boolean {
  return Object.keys(local).some((id) => !(id in remote) || touched.has(id));
}

/** Storage key of a plan's ticks in this browser. */
export function localChecksKey(planKey: string): string {
  return `planejamento-faculdade:${planKey}`;
}

/** Ticks saved in this browser for a plan; empty when storage is missing or blocked. */
export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap {
  try {
    return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null);
  } catch {
    return {};
  }
}

/** Pause of the given length. */
export function pauseMs(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** New store with the ticks already saved in this browser. */
export function createCheckStore(options: CheckStoreOptions): CheckStore {
  return {
    ...options,
    wait: options.wait ?? pauseMs,
    saved: readLocalChecks(options.storage, options.key),
    touched: new Set(),
    boxes: new Map(),
    remote: null,
    writing: false,
    dirty: false,
    listeners: [],
  };
}

/** Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). */
export function writeLocalChecks(store: CheckStore): void {
  try {
    store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved));
  } catch {
    // Private mode or blocked storage: the ticks live only in this page load.
  }
}

/** Shows an item's tick: the saved one, or the item's default (done in the plan). */
export function applyCheck(store: CheckStore, id: string): void {
  const entry = store.boxes.get(id);
  if (!entry) return;
  const checked = id in store.saved ? store.saved[id] === true : entry.def;
  entry.box.checked = checked;
  entry.row.classList.toggle('done', checked);
}

/** Re-applies every tick and tells the listeners (progress counters). */
export function refreshChecks(store: CheckStore): void {
  for (const id of store.boxes.keys()) applyCheck(store, id);
  store.listeners.forEach((listener) => {
    listener();
  });
}

/** Records a change made by the viewer and saves it. */
export function onCheckChange(store: CheckStore, id: string, checked: boolean): void {
  store.saved[id] = checked;
  store.touched.add(id);
  refreshChecks(store);
  writeLocalChecks(store);
  store.dirty = true;
  void flushChecks(store);
}

/** Connects a checkbox (and its row) to the store under the item's stable id. */
export function registerCheck(
  store: CheckStore,
  item: { id: string; def: boolean },
  view: { box: HTMLInputElement; row: HTMLElement },
): void {
  const { box, row } = view;
  store.boxes.set(item.id, { box, row, def: item.def });
  applyCheck(store, item.id);
  box.addEventListener('change', () => {
    onCheckChange(store, item.id, box.checked);
  });
}

/** Error code of a runtime rejection, if any. */
export function errorCode(error: unknown): string | undefined {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === 'string' ? code : undefined;
}

/** Runs a call and, when it fails with `unavailable`, once more after a short random pause. */
export async function retryOnUnavailable<T>(
  call: () => Promise<T>,
  wait: (ms: number) => Promise<void>,
): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (errorCode(error) !== 'unavailable') throw error;
    await wait(600 + Math.floor(Math.random() * 800));
    return call();
  }
}

/** One write of the ticks to the account; false (and still pending) when it fails. */
export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> {
  try {
    await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait);
    store.status('account');
    return true;
  } catch {
    store.dirty = true;
    store.status('error');
    return false;
  }
}

/** Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. */
export async function flushChecks(store: CheckStore): Promise<void> {
  const remote = store.remote;
  if (!remote || store.writing) return;
  while (store.dirty) {
    store.writing = true;
    store.dirty = false;
    const sent = await writeChecksOnce(store, remote);
    store.writing = false;
    if (!sent) return;
  }
}

/** Ticks stored in an account document. */
export function remoteChecksOf(snap: DocSnapLike): CheckMap {
  return snap.exists ? toCheckMap(snap.data()?.checks) : {};
}

/** Applies ticks changed on another device (ignores this page's own pending writes). */
export function onRemoteSnapshot(store: CheckStore, snap: DocSnapLike): void {
  if (store.writing || snap.metadata?.hasPendingWrites === true) return;
  const remote = remoteChecksOf(snap);
  const changed = Object.keys(remote).filter((id) => store.saved[id] !== remote[id]);
  if (changed.length === 0) return;
  for (const id of changed) store.saved[id] = remote[id] === true;
  refreshChecks(store);
  writeLocalChecks(store);
}

/** The viewer's private document for this plan, or null when there is no database or no signed-in viewer. */
export async function accountDocument(
  claude: ClaudeLike,
  planKey: string,
): Promise<DocRefLike | null> {
  const [db, user] = (await Promise.all([claude.use('db'), claude.use('user')])) as [
    DbLike | null,
    UserLike | null,
  ];
  const uid = user ? await user.id() : null;
  return db && uid ? db.collection(`data/users/${uid}`).doc(planKey) : null;
}

/** Merges the account's ticks with this browser's, sends what only this browser has and listens for changes. */
export async function adoptAccount(store: CheckStore, ref: DocRefLike): Promise<void> {
  const remote = remoteChecksOf(await retryOnUnavailable(() => ref.get(), store.wait));
  const localOnly = hasLocalOnly(store.saved, remote, store.touched);
  store.saved = mergeChecks(store.saved, remote, store.touched);
  refreshChecks(store);
  writeLocalChecks(store);
  store.remote = ref;
  if (localOnly) {
    store.dirty = true;
    await flushChecks(store);
  } else store.status('account');
  ref.onSnapshot(
    (snap) => {
      onRemoteSnapshot(store, snap);
    },
    () => undefined,
  );
}

/** Connects the store to the viewer's account when the page runs inside Claude; otherwise stays local. */
export async function connectAccount(
  store: CheckStore,
  claude: ClaudeLike | undefined,
): Promise<void> {
  if (!claude || typeof claude.use !== 'function') {
    store.status('local');
    return;
  }
  store.status('loading');
  const timer = setTimeout(() => {
    if (!store.remote) store.status('local');
  }, ACCOUNT_TIMEOUT_MS);
  try {
    const ref = await accountDocument(claude, store.key);
    if (ref) await adoptAccount(store, ref);
    else store.status('local');
  } catch {
    store.status('local');
  } finally {
    clearTimeout(timer);
  }
}
