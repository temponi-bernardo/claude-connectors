import { describe, expect, it } from 'vitest';
import { FakeKv } from '../../../src/remote/fixtures/fake-kv.js';
import {
  deletePrefix,
  deleteVault,
  eraseOwner,
  ownerHash,
  readVault,
  vaultKey,
  vaultOf,
  writeVault,
  type VaultDeps,
} from './vault.js';

const KEY = Buffer.alloc(32, 3);

function vault(now = 1_000_000): VaultDeps & { kv: FakeKv } {
  const kv = new FakeKv();
  kv.now = () => now;
  return { kv, tokenKey: KEY, now: () => now };
}

describe('vault records', () => {
  it('keys hold only a hash of the owner', () => {
    const key = vaultKey({ typ: 'account', owner: 'spotify:alice' });
    expect(key).toBe(`account:${ownerHash('spotify:alice')}`);
    expect(key).not.toContain('alice');
    expect(vaultKey({ typ: 'backup', owner: 'o', id: 'x1' })).toMatch(/^backup:[0-9a-f]{64}:x1$/);
  });

  it('round-trips data encrypted at rest', async () => {
    const deps = vault();
    await writeVault(deps, { typ: 'account', owner: 'o' }, { secret: 'client-secret-value' });
    const raw = [...deps.kv.entries.values()][0]?.value ?? '';
    expect(raw).not.toContain('client-secret-value');
    expect(await readVault(deps, { typ: 'account', owner: 'o' })).toEqual({
      secret: 'client-secret-value',
    });
  });

  it('never opens another owner’s record, another type or another id, even when copied', async () => {
    const deps = vault();
    await writeVault(deps, { typ: 'account', owner: 'alice' }, { a: 1 });
    const sealed = (await deps.kv.get(vaultKey({ typ: 'account', owner: 'alice' }))) ?? '';
    await deps.kv.put(vaultKey({ typ: 'account', owner: 'bob' }), sealed);
    await deps.kv.put(vaultKey({ typ: 'genres', owner: 'alice' }), sealed);
    await deps.kv.put(vaultKey({ typ: 'account', owner: 'alice', id: 'x' }), sealed);
    expect(await readVault(deps, { typ: 'account', owner: 'bob' })).toBeNull();
    expect(await readVault(deps, { typ: 'genres', owner: 'alice' })).toBeNull();
    expect(await readVault(deps, { typ: 'account', owner: 'alice', id: 'x' })).toBeNull();
  });

  it('does not open with another key or after its TTL', async () => {
    const deps = vault();
    await writeVault(deps, { typ: 'plans', owner: 'o', ttlSeconds: 60 }, [1]);
    expect(
      await readVault({ ...deps, tokenKey: Buffer.alloc(32, 4) }, { typ: 'plans', owner: 'o' }),
    ).toBeNull();
    const later = { ...deps, now: () => 1_000_000 + 61_000 };
    expect(await readVault(later, { typ: 'plans', owner: 'o' })).toBeNull();
  });

  it('deleteVault and eraseOwner remove only that owner’s keys', async () => {
    const deps = vault();
    await writeVault(deps, { typ: 'account', owner: 'alice' }, 1);
    await writeVault(deps, { typ: 'backup', owner: 'alice', id: 'b1' }, 2);
    await writeVault(deps, { typ: 'scan', owner: 'alice', id: 'liked' }, 3);
    await writeVault(deps, { typ: 'account', owner: 'bob' }, 4);
    expect(await eraseOwner(deps.kv, 'alice')).toBe(3);
    expect(await readVault(deps, { typ: 'account', owner: 'bob' })).toBe(4);
    await deleteVault(deps, { typ: 'account', owner: 'bob' });
    expect(deps.kv.entries.size).toBe(0);
  });

  it('deletePrefix follows list cursors', async () => {
    const kv = new FakeKv();
    await kv.put('p:1', 'x');
    await kv.put('p:2', 'x');
    let calls = 0;
    const paged = {
      delete: (k: string) => kv.delete(k),
      list: async () => {
        calls += 1;
        const keys = calls === 1 ? [{ name: 'p:1' }] : [{ name: 'p:2' }];
        return Promise.resolve({ keys, list_complete: calls > 1, cursor: 'c' });
      },
    };
    expect(await deletePrefix(paged as never, 'p:')).toBe(2);
    expect(kv.entries.size).toBe(0);
  });

  it('vaultOf takes KV, key and clock from the connector deps', () => {
    const kv = new FakeKv();
    const deps = vaultOf({ kv, settings: { tokenKey: KEY }, now: () => 5 });
    expect(deps.tokenKey).toBe(KEY);
    expect(deps.now()).toBe(5);
  });
});
