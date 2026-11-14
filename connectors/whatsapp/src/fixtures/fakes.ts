/** Fakes para os testes do conector WhatsApp: bucket R2 em memória, armazenamento e host da ponte. */
import type { BridgeHost } from '../lifecycle.js';
import type { SnapshotBucket, SnapshotObject } from '../snapshots.js';

/** Fluxo com os bytes dados. */
export function streamOf(bytes: Uint8Array | string): ReadableStream<Uint8Array> {
  const data = typeof bytes === 'string' ? new TextEncoder().encode(bytes) : bytes;
  return new Response(data).body ?? new ReadableStream();
}

/** Lê um fluxo inteiro como texto. */
export function textOf(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

/** Bucket em memória que guarda o texto e os metadados. */
export interface MemoryBucket extends SnapshotBucket {
  readonly items: Map<string, { text: string; customMetadata: Record<string, string> }>;
}

/** Cria um bucket em memória. */
export function memoryBucket(): MemoryBucket {
  const items = new Map<string, { text: string; customMetadata: Record<string, string> }>();
  function meta(key: string): Omit<SnapshotObject, 'body'> | null {
    const item = items.get(key);
    return item ? { size: item.text.length, customMetadata: item.customMetadata } : null;
  }
  return {
    items,
    head: (key) => Promise.resolve(meta(key)),
    get: (key) => {
      const item = items.get(key);
      const head = meta(key);
      return Promise.resolve(item && head ? { ...head, body: streamOf(item.text) } : null);
    },
    put: async (key, value, options) => {
      items.set(key, { text: await textOf(value), customMetadata: options.customMetadata });
    },
    delete: (key) => {
      items.delete(key);
      return Promise.resolve();
    },
  };
}

/** Rota falsa da ponte: recebe caminho e opções e devolve a resposta. */
export type FakeRoute = (path: string, init: RequestInit) => Response | Promise<Response>;

/** Host falso da ponte, com registro das chamadas. */
export function fakeHost(
  route: FakeRoute,
  overrides: Partial<BridgeHost> = {},
): BridgeHost & { calls: { path: string; init: RequestInit }[]; waited: Promise<unknown>[] } {
  const calls: { path: string; init: RequestInit }[] = [];
  const waited: Promise<unknown>[] = [];
  let clock = 1_000_000;
  return {
    calls,
    waited,
    containerFetch: recordingFetch(route, calls),
    bucket: memoryBucket(),
    fixedLength: (body) => body,
    storage: memoryStorage(),
    waitUntil: (promise) => {
      waited.push(promise);
    },
    stop: () => Promise.resolve(),
    bridgeToken: 'token-da-ponte',
    sendMaxPerHour: 2,
    now: () => (clock += 1000),
    ...overrides,
  };
}

/** Armazenamento de Durable Object em memória. */
export function memoryStorage(): BridgeHost['storage'] {
  const store = new Map<string, unknown>();
  return {
    get: <T>(key: string) => Promise.resolve(store.get(key) as T | undefined),
    put: (key, value) => {
      store.set(key, value);
      return Promise.resolve();
    },
  };
}

/** `containerFetch` falso que registra caminho e opções de cada chamada. */
export function recordingFetch(
  route: FakeRoute,
  calls: { path: string; init: RequestInit }[],
): BridgeHost['containerFetch'] {
  return (url, init = {}) => {
    const path = url.replace('http://bridge', '');
    calls.push({ path, init });
    return Promise.resolve(route(path, init));
  };
}

/** Status de ponte pronta e sincronizada. */
export const READY_STATUS = {
  phase: 'ready',
  connected: true,
  logged_in: true,
  needs_pairing: false,
  account: '+55 31 9****-**12',
  offline_sync_complete: true,
  last_event_at: '2026-11-14T09:30:00-03:00',
  chats: 1,
  messages: 2,
  send_enabled: false,
} as const;

/** Ponte falsa (`BridgeFetch`) que responde por caminho sem query, com registro das chamadas. */
export function fakeBridge(
  routes: Readonly<Record<string, (init: RequestInit | undefined, path: string) => Response>>,
): ((path: string, init?: RequestInit) => Promise<Response>) & { paths: string[] } {
  const paths: string[] = [];
  function bridge(path: string, init?: RequestInit): Promise<Response> {
    paths.push(path);
    const route = routes[path.split('?')[0] ?? path];
    return Promise.resolve(
      route ? route(init, path) : Response.json({ error: 'x' }, { status: 404 }),
    );
  }
  return Object.assign(bridge, { paths });
}
