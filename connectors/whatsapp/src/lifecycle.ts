/**
 * Ciclo de vida da ponte dentro do Durable Object `WhatsAppBridge`: restaura o snapshot do R2 quando o container
 * acorda vazio, repassa as chamadas com o `BRIDGE_TOKEN`, guarda snapshots depois das sincronizações (no máximo um
 * por minuto) e aplica o limite rígido de envios por hora no armazenamento do Durable Object.
 */
import { bridgeErrorFrom } from './bridge-client.js';
import {
  archiveSnapshot,
  storeSnapshotResponse,
  type FixedLength,
  type SnapshotBucket,
  type SnapshotOutcome,
  SNAPSHOT_KEY_NAME,
} from './snapshots.js';

/** O que o ciclo de vida precisa do Durable Object (porta, testável com fakes). */
export interface BridgeHost {
  /** `containerFetch` do `Container`: acorda o container se preciso e repassa a requisição. */
  readonly containerFetch: (url: string, init?: RequestInit) => Promise<Response>;
  readonly bucket: SnapshotBucket;
  readonly fixedLength: FixedLength;
  readonly storage: {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
  };
  readonly waitUntil: (promise: Promise<unknown>) => void;
  readonly stop: () => Promise<void>;
  readonly bridgeToken: string;
  readonly sendMaxPerHour: number;
  readonly now: () => number;
}

/** Intervalo mínimo entre snapshots disparados por uso (ms). */
export const SNAPSHOT_INTERVAL_MS = 60_000;

/** Rotas da ponte depois das quais o banco pode ter mudado e vale tentar um snapshot. */
export const SNAPSHOT_AFTER_PATHS: ReadonlySet<string> = new Set([
  '/sync/wait',
  '/status',
  '/send',
  '/logout',
  '/pair/code',
  '/pair/qr',
]);

/** Chave, no armazenamento do Durable Object, dos instantes dos envios recentes. */
export const SEND_HISTORY_KEY = 'send-history';

/** Junta o `Authorization` da ponte às opções de uma requisição. */
export function withBridgeToken(token: string, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set('authorization', `Bearer ${token}`);
  return { ...init, headers };
}

/** Faz uma requisição à ponte dentro do container, já autenticada. */
export function fetchBridge(host: BridgeHost, path: string, init?: RequestInit): Promise<Response> {
  return host.containerFetch(`http://bridge${path}`, withBridgeToken(host.bridgeToken, init));
}

/** Lê a fase da ponte (`GET /health`). */
export async function readBridgePhase(host: BridgeHost): Promise<string> {
  const res = await fetchBridge(host, '/health');
  const body = (await res.json()) as { phase?: unknown };
  return typeof body.phase === 'string' ? body.phase : 'unknown';
}

/** Opções do `POST /restore`: o snapshot do bucket em fluxo, ou `X-Snapshot: none` se não houver. */
export async function restoreRequestInit(host: BridgeHost): Promise<RequestInit> {
  const snapshot = await host.bucket.get(SNAPSHOT_KEY_NAME);
  if (!snapshot) return { method: 'POST', headers: { 'x-snapshot': 'none' } };
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': String(snapshot.size),
    },
    body: snapshot.body,
  };
}

/** Restaura a ponte se ela acabou de acordar; snapshot recusado lança (nunca recomeça do zero sozinho). */
export async function ensureRestored(host: BridgeHost): Promise<void> {
  if ((await readBridgePhase(host)) !== 'awaiting_restore') return;
  const res = await fetchBridge(host, '/restore', await restoreRequestInit(host));
  // 409: outra requisição restaurou primeiro.
  if (res.ok || res.status === 409) return;
  throw bridgeErrorFrom(res.status, await res.json().catch(() => null));
}

/** Pede o snapshot à ponte e grava no bucket. */
export async function snapshotBridge(host: BridgeHost, force = false): Promise<SnapshotOutcome> {
  // force=1: depois de uma gravação que falhou, a ponte devolveria 204 (já entregue) sem isso.
  const res = await fetchBridge(host, force ? '/snapshot?force=1' : '/snapshot');
  return storeSnapshotResponse(host.bucket, res, host.fixedLength);
}

/** Decide um envio: permitido (e o histórico novo) ou recusado com quantos segundos esperar. Pura. */
export function planSend(
  history: readonly number[],
  now: number,
  maxPerHour: number,
): { readonly allowed: boolean; readonly history: number[]; readonly retryAfterSeconds: number } {
  const recent = history.filter((at) => at > now - 3_600_000).sort((a, b) => a - b);
  if (recent.length < maxPerHour)
    return { allowed: true, history: [...recent, now], retryAfterSeconds: 0 };
  const oldest = recent[recent.length - maxPerHour] ?? now;
  return {
    allowed: false,
    history: recent,
    retryAfterSeconds: Math.ceil((oldest + 3_600_000 - now) / 1000),
  };
}

/** Aplica o limite de envios; devolve a resposta 429 se estourou, ou nulo (e registra o envio) se pode. */
export async function guardSend(host: BridgeHost): Promise<Response | null> {
  const history = (await host.storage.get<number[]>(SEND_HISTORY_KEY)) ?? [];
  const plan = planSend(history, host.now(), host.sendMaxPerHour);
  await host.storage.put(SEND_HISTORY_KEY, plan.history);
  if (plan.allowed) return null;
  return Response.json(
    { error: 'rate_limited', retry_after_seconds: plan.retryAfterSeconds },
    { status: 429 },
  );
}

/** Opções para repassar uma requisição recebida à ponte (método, tipo e corpo). */
export function forwardInit(request: Request): RequestInit {
  const type = request.headers.get('content-type');
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  return {
    method: request.method,
    ...(type ? { headers: { 'content-type': type } } : {}),
    ...(hasBody && request.body ? { body: request.body } : {}),
  };
}

/** Ciclo de vida montado: atende requisições e guarda snapshots em série. */
export interface BridgeLifecycle {
  readonly handle: (request: Request) => Promise<Response>;
  readonly snapshotNow: () => Promise<SnapshotOutcome>;
  readonly snapshotQuietly: () => Promise<void>;
}

/** Guarda snapshots em série (nunca dois ao mesmo tempo) e decide quando um uso merece snapshot. */
export class SnapshotScheduler {
  private chain: Promise<unknown> = Promise.resolve();
  private lastAt = 0;
  private forceNext = false;

  constructor(private readonly host: BridgeHost) {}

  /** Tira um snapshot depois dos que já estão na fila. */
  snapshotNow(): Promise<SnapshotOutcome> {
    const run = this.chain.then(() => this.runSnapshot());
    this.chain = run.catch(() => undefined);
    this.lastAt = this.host.now();
    return run;
  }

  /** Pede o snapshot; se falhar, o próximo é forçado para não perder o que não chegou ao R2. */
  private async runSnapshot(): Promise<SnapshotOutcome> {
    const force = this.forceNext;
    try {
      const outcome = await snapshotBridge(this.host, force);
      this.forceNext = false;
      return outcome;
    } catch (error) {
      this.forceNext = true;
      throw error;
    }
  }

  /** Tira um snapshot e só registra a falha no log. */
  snapshotQuietly(): Promise<void> {
    return logSnapshotFailure(this.snapshotNow());
  }

  /** Depois de uma rota que pode mudar o banco, agenda um snapshot se o último tem mais de um minuto. */
  maybeSnapshot(path: string): void {
    if (SNAPSHOT_AFTER_PATHS.has(path) && this.host.now() - this.lastAt >= SNAPSHOT_INTERVAL_MS) {
      this.host.waitUntil(this.snapshotQuietly());
    }
  }
}

/** Monta o ciclo de vida da ponte para um Durable Object. */
export function createBridgeLifecycle(host: BridgeHost): BridgeLifecycle {
  const scheduler = new SnapshotScheduler(host);
  return {
    handle: (request) => routeBridgeRequest({ host, scheduler }, request),
    snapshotNow: () => scheduler.snapshotNow(),
    snapshotQuietly: () => scheduler.snapshotQuietly(),
  };
}

/** Espera um snapshot e só registra a falha no log (sem dados de mensagens). */
export async function logSnapshotFailure(run: Promise<SnapshotOutcome>): Promise<void> {
  try {
    await run;
  } catch (error) {
    console.warn('Snapshot falhou:', error instanceof Error ? error.message : String(error));
  }
}

/** Dependências do roteador do Durable Object. */
export interface BridgeRouter {
  readonly host: BridgeHost;
  readonly scheduler: Pick<SnapshotScheduler, 'snapshotNow' | 'maybeSnapshot'>;
}

/** Recomeça do zero: arquiva o snapshot atual e para o container (o próximo uso sobe vazio). */
export async function resetBridge(host: BridgeHost): Promise<Response> {
  const archived = await archiveSnapshot(host.bucket, new Date(host.now()), host.fixedLength);
  await host.stop();
  return Response.json({ reset: true, archived });
}

/** Atende uma requisição do Worker: rotas internas (`/__snapshot`, `/__reset`) ou repasse à ponte. */
export async function routeBridgeRequest(
  router: BridgeRouter,
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/__snapshot')
    return Response.json({ outcome: await router.scheduler.snapshotNow() });
  if (url.pathname === '/__reset') return resetBridge(router.host);
  await ensureRestored(router.host);
  if (url.pathname === '/send') {
    const refused = await guardSend(router.host);
    if (refused) return refused;
  }
  const res = await fetchBridge(router.host, url.pathname + url.search, forwardInit(request));
  router.scheduler.maybeSnapshot(url.pathname);
  return res;
}
