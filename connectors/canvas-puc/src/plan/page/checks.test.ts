// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { emitChecks, fakeAccount } from './fixtures/plan-dom.js';
import {
  accountDocument,
  adoptAccount,
  applyCheck,
  connectAccount,
  createCheckStore,
  errorCode,
  flushChecks,
  hasLocalOnly,
  localChecksKey,
  mergeChecks,
  onCheckChange,
  onRemoteSnapshot,
  parseStoredChecks,
  pauseMs,
  readLocalChecks,
  writeChecksOnce,
  refreshChecks,
  registerCheck,
  remoteChecksOf,
  retryOnUnavailable,
  toCheckMap,
  writeLocalChecks,
} from './checks.js';
import type { CheckStore, SyncState } from './checks.js';

function noWait(): Promise<void> {
  return Promise.resolve();
}

function newStore(states: SyncState[] = [], storage: Storage | null = localStorage): CheckStore {
  return createCheckStore({
    key: 'plano-test',
    storage,
    status: (s) => states.push(s),
    wait: noWait,
  });
}

function box(store: CheckStore, id: string, def = false): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'checkbox';
  registerCheck(store, { id, def }, { box: input, row: document.createElement('div') });
  return input;
}

describe('toCheckMap and parseStoredChecks', () => {
  it('keeps only boolean entries', () => {
    expect(toCheckMap({ a: true, b: 'yes', c: false })).toEqual({ a: true, c: false });
    expect(toCheckMap([true])).toEqual({});
  });
  it('survives missing or broken text', () => {
    expect(parseStoredChecks(null)).toEqual({});
    expect(parseStoredChecks('{')).toEqual({});
    expect(parseStoredChecks('{"a":true}')).toEqual({ a: true });
  });
});

describe('mergeChecks and hasLocalOnly', () => {
  it('lets the account win except for ticks changed in this page load', () => {
    const merged = mergeChecks(
      { a: true, b: true, c: true },
      { a: false, b: false },
      new Set(['b']),
    );
    expect(merged).toEqual({ a: false, b: true, c: true });
  });
  it('detects ticks the account does not have', () => {
    expect(hasLocalOnly({ a: true }, { a: true }, new Set())).toBe(false);
    expect(hasLocalOnly({ a: true, c: true }, { a: true }, new Set())).toBe(true);
    expect(hasLocalOnly({ a: true }, { a: true }, new Set(['a']))).toBe(true);
  });
});

describe('createCheckStore and writeLocalChecks', () => {
  it('loads and saves the ticks of this browser', () => {
    localStorage.setItem(localChecksKey('plano-test'), '{"x":true}');
    const store = newStore();
    expect(store.saved).toEqual({ x: true });
    store.saved.y = false;
    writeLocalChecks(store);
    expect(localStorage.getItem(localChecksKey('plano-test'))).toBe('{"x":true,"y":false}');
    localStorage.clear();
  });
  it('works when storage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    const store = newStore([], broken);
    expect(store.saved).toEqual({});
    expect(() => {
      writeLocalChecks(store);
    }).not.toThrow();
  });
});

describe('registerCheck, applyCheck and onCheckChange', () => {
  it('starts from the item default, then the saved tick', () => {
    const store = newStore([], null);
    expect(box(store, 'a', true).checked).toBe(true);
    store.saved.a = false;
    applyCheck(store, 'a');
    expect(store.boxes.get('a')?.box.checked).toBe(false);
    applyCheck(store, 'missing');
  });
  it('saves a change and refreshes the counters', () => {
    const store = newStore([], null);
    const listener = vi.fn();
    store.listeners.push(listener);
    const input = box(store, 'a');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    expect(store.saved).toEqual({ a: true });
    expect(store.touched.has('a')).toBe(true);
    expect(listener).toHaveBeenCalled();
    refreshChecks(store);
    expect(store.boxes.get('a')?.row.classList.contains('done')).toBe(true);
  });
});

describe('onCheckChange', () => {
  it('records the tick as touched and saves it locally', () => {
    const store = newStore([], localStorage);
    box(store, 'z');
    onCheckChange(store, 'z', true);
    expect(store.touched.has('z')).toBe(true);
    expect(readLocalChecks(localStorage, 'plano-test')).toEqual({ z: true });
    localStorage.clear();
  });
});

describe('readLocalChecks and pauseMs', () => {
  it('reads nothing without storage', () => {
    expect(readLocalChecks(null, 'x')).toEqual({});
  });
  it('waits the given time', async () => {
    vi.useFakeTimers();
    let done = false;
    void pauseMs(50).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(50);
    expect(done).toBe(true);
    vi.useRealTimers();
  });
});

describe('writeChecksOnce', () => {
  it('reports whether the write went through', async () => {
    const store = newStore([], null);
    const account = fakeAccount();
    expect(await writeChecksOnce(store, account.ref)).toBe(true);
    account.failures.push({ code: 'revoked' });
    expect(await writeChecksOnce(store, account.ref)).toBe(false);
    expect(store.dirty).toBe(true);
  });
});

describe('errorCode and retryOnUnavailable', () => {
  it('reads the code of a rejection', () => {
    expect(errorCode({ code: 'unavailable' })).toBe('unavailable');
    expect(errorCode(null)).toBeUndefined();
  });
  it('retries once on unavailable', async () => {
    const call = vi.fn().mockRejectedValueOnce({ code: 'unavailable' }).mockResolvedValueOnce(7);
    await expect(retryOnUnavailable(call, noWait)).resolves.toBe(7);
    expect(call).toHaveBeenCalledTimes(2);
  });
  it('does not retry other errors', async () => {
    const call = vi.fn().mockRejectedValue({ code: 'invalid_argument' });
    await expect(retryOnUnavailable(call, noWait)).rejects.toEqual({ code: 'invalid_argument' });
    expect(call).toHaveBeenCalledTimes(1);
  });
});

describe('flushChecks', () => {
  it('writes the ticks and reports the account state', async () => {
    const states: SyncState[] = [];
    const store = newStore(states, null);
    const account = fakeAccount();
    store.remote = account.ref;
    store.saved = { a: true };
    store.dirty = true;
    await flushChecks(store);
    expect(account.writes).toEqual([{ checks: { a: true }, v: 1 }]);
    expect(states).toEqual(['account']);
  });
  it('keeps the ticks pending after an error', async () => {
    const states: SyncState[] = [];
    const store = newStore(states, null);
    const account = fakeAccount();
    account.failures.push({ code: 'quota_exceeded' });
    store.remote = account.ref;
    store.dirty = true;
    await flushChecks(store);
    expect(store.dirty).toBe(true);
    expect(states).toEqual(['error']);
  });
  it('does nothing without an account or changes', async () => {
    const store = newStore([], null);
    store.dirty = true;
    await flushChecks(store);
    expect(store.dirty).toBe(true);
  });
  it('sends a change made during a write right after it', async () => {
    const store = newStore([], null);
    const account = fakeAccount();
    store.remote = account.ref;
    const original = account.ref.set.bind(account.ref);
    let first = true;
    account.ref.set = (data) => {
      if (first) {
        first = false;
        store.saved.b = true;
        store.dirty = true;
      }
      return original(data);
    };
    store.dirty = true;
    await flushChecks(store);
    expect(account.writes).toHaveLength(2);
  });
});

describe('remoteChecksOf and onRemoteSnapshot', () => {
  it('reads the checks of a document', () => {
    expect(remoteChecksOf({ exists: false, data: () => undefined })).toEqual({});
    expect(remoteChecksOf({ exists: true, data: () => ({ checks: { a: true } }) })).toEqual({
      a: true,
    });
  });
  it('applies ticks from another device but not own pending writes', () => {
    const store = newStore([], null);
    box(store, 'a');
    onRemoteSnapshot(store, {
      exists: true,
      data: () => ({ checks: { a: true } }),
      metadata: { hasPendingWrites: true },
    });
    expect(store.saved.a).toBeUndefined();
    onRemoteSnapshot(store, { exists: true, data: () => ({ checks: { a: true } }) });
    expect(store.boxes.get('a')?.box.checked).toBe(true);
    onRemoteSnapshot(store, { exists: true, data: () => ({ checks: { a: true } }) });
    expect(store.saved.a).toBe(true);
  });
});

describe('accountDocument', () => {
  it('opens the viewer private document', async () => {
    const account = fakeAccount();
    expect(await accountDocument(account.claude, 'plano-test')).toBe(account.ref);
    expect(account.paths).toEqual(['data/users/viewer-1/plano-test']);
  });
  it('is null for a viewer who is not signed in', async () => {
    expect(await accountDocument(fakeAccount(undefined, null).claude, 'p')).toBeNull();
  });
});

describe('adoptAccount', () => {
  it('merges, sends local-only ticks and follows other devices', async () => {
    const store = newStore([], null);
    box(store, 'a');
    box(store, 'b');
    store.saved = { b: true };
    const account = fakeAccount({ a: true });
    await adoptAccount(store, account.ref);
    expect(store.saved).toEqual({ a: true, b: true });
    expect(account.writes).toEqual([{ checks: { a: true, b: true }, v: 1 }]);
    emitChecks(account, { a: false, b: true });
    expect(store.boxes.get('a')?.box.checked).toBe(false);
  });
  it('only reports the account when nothing is new locally', async () => {
    const states: SyncState[] = [];
    const store = newStore(states, null);
    const account = fakeAccount({ a: true });
    account.failures.push({ code: 'unavailable' });
    await adoptAccount(store, account.ref);
    expect(account.writes).toEqual([]);
    expect(states).toEqual(['account']);
  });
});

describe('connectAccount', () => {
  it('stays local outside Claude', async () => {
    const states: SyncState[] = [];
    await connectAccount(newStore(states, null), undefined);
    expect(states).toEqual(['local']);
  });
  it('stays local without a signed-in viewer', async () => {
    const states: SyncState[] = [];
    await connectAccount(newStore(states, null), fakeAccount(undefined, null).claude);
    expect(states).toEqual(['loading', 'local']);
  });
  it('falls back to local when the account fails', async () => {
    const states: SyncState[] = [];
    const account = fakeAccount();
    account.failures.push({ code: 'revoked' });
    await connectAccount(newStore(states, null), account.claude);
    expect(states).toEqual(['loading', 'local']);
  });
  it('says the ticks are local when the account takes too long', async () => {
    vi.useFakeTimers();
    const states: SyncState[] = [];
    const never = { use: () => new Promise<unknown>(() => undefined) };
    void connectAccount(newStore(states, null), never);
    await vi.advanceTimersByTimeAsync(10001);
    expect(states).toEqual(['loading', 'local']);
    vi.useRealTimers();
  });
  it('connects to the account', async () => {
    const states: SyncState[] = [];
    await connectAccount(newStore(states, null), fakeAccount({ a: true }).claude);
    expect(states).toEqual(['loading', 'account']);
  });
});
