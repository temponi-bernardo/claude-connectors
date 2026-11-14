/**
 * Durable Object `WhatsAppBridge`: dono do container da ponte Go (`@cloudflare/containers`). Só despacha para o
 * ciclo de vida (`lifecycle.ts`); toda a decisão está lá, testada. O container dorme após `SLEEP_AFTER` sem uso,
 * depois de um último snapshot; não há alarme nem keep-alive próprio.
 */
import { Container } from '@cloudflare/containers';
import type { DurableObjectStateLike } from 'cloudflare:workers';
import { toEnvVars } from '../../../src/core/env.js';
import { containerEnvVars, readSendSettings, readSleepAfter } from './config.js';
import { createBridgeLifecycle, type BridgeLifecycle } from './lifecycle.js';
import { acceptSnapshotPush, pumpInto } from './snapshots.js';
import type { WhatsAppEnv } from './worker-env.js';

/** Fluxo de tamanho fixo do Workers para gravar no R2 sem carregar o arquivo na memória. */
export function workersFixedLength(
  body: ReadableStream<Uint8Array>,
  length: number,
): ReadableStream<Uint8Array> {
  const { readable, writable } = new FixedLengthStream(length);
  void pumpInto(body, writable);
  return readable;
}

/** Durable Object que controla o container da ponte. */
export class WhatsAppBridge extends Container<WhatsAppEnv> {
  override defaultPort = 8080;
  override enableInternet = true;
  private readonly lifecycle: BridgeLifecycle;

  /** Recebe o snapshot que a ponte manda no `SIGTERM` pelo endereço interno `snapshot.internal`. */
  static override outboundByHost = {
    'snapshot.internal': (req: Request, env: WhatsAppEnv): Promise<Response> =>
      acceptSnapshotPush(env.SNAPSHOTS, req, {
        token: String(env.BRIDGE_TOKEN),
        fixedLength: workersFixedLength,
      }),
  };

  constructor(ctx: DurableObjectStateLike, env: WhatsAppEnv) {
    const vars = toEnvVars(env);
    super(ctx, env, { sleepAfter: readSleepAfter(vars), envVars: containerEnvVars(vars) });
    this.lifecycle = createBridgeLifecycle({
      containerFetch: (url, init) => this.containerFetch(url, init ?? {}),
      bucket: env.SNAPSHOTS,
      fixedLength: workersFixedLength,
      storage: ctx.storage,
      waitUntil: (promise) => {
        ctx.waitUntil(promise);
      },
      stop: () => this.stop(),
      bridgeToken: String(env.BRIDGE_TOKEN),
      sendMaxPerHour: readSendSettings(vars).sendMaxPerHour,
      now: () => Date.now(),
    });
  }

  /** Atende o Worker pelo ciclo de vida (restore, repasse, snapshot, limite de envio). */
  override fetch(request: Request): Promise<Response> {
    return this.lifecycle.handle(request);
  }

  /** Antes de dormir, guarda o último snapshot; depois para o container. */
  override async onActivityExpired(): Promise<void> {
    await this.lifecycle.snapshotQuietly();
    await super.onActivityExpired();
  }
}
