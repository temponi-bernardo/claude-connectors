/** Workers KV em memória para os testes (get com `type: 'json'`, put com validade, delete e list). */
import type { KvStore } from '../context.js';

/** Opções de leitura aceitas pelo KV falso. */
interface GetOptions {
  readonly type?: 'text' | 'json';
}

/** KV em memória; `now` controla a validade (`expirationTtl`). */
export class FakeKv implements KvStore {
  readonly entries = new Map<string, { value: string; expiresAt: number | null }>();
  now: () => number = () => Date.now();

  get(key: string, options?: GetOptions | string): Promise<string | null> {
    const entry = this.entries.get(key);
    if (!entry || (entry.expiresAt !== null && entry.expiresAt <= this.now())) {
      return Promise.resolve(null);
    }
    const type = typeof options === 'string' ? options : options?.type;
    return Promise.resolve(type === 'json' ? (JSON.parse(entry.value) as string) : entry.value);
  }

  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number; expiration?: number },
  ): Promise<void> {
    const ttl = options?.expirationTtl;
    const expiresAt = ttl
      ? this.now() + ttl * 1000
      : options?.expiration
        ? options.expiration * 1000
        : null;
    this.entries.set(key, { value, expiresAt });
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.entries.delete(key);
    return Promise.resolve();
  }

  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }> {
    const keys = [...this.entries.keys()]
      .filter((name) => name.startsWith(options?.prefix ?? ''))
      .sort()
      .map((name) => ({ name }));
    return Promise.resolve({ keys, list_complete: true });
  }
}
