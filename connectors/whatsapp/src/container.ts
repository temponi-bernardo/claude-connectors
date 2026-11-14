/**
 * `WhatsAppBridge` Durable Object: owner of the Go bridge container (`@cloudflare/containers`). It only dispatches
 * to the lifecycle (`lifecycle.ts`); every decision lives there, tested. The container sleeps after `SLEEP_AFTER`
 * of idleness, after a last snapshot; there is no alarm or keep-alive of its own.
 */
import { Container } from '@cloudflare/containers';
import type { DurableObjectStateLike } from 'cloudflare:workers';
import { toEnvVars } from '../../../src/core/env.js';
import { containerEnvVars, readSendSettings, readSleepAfter } from './config.js';
import { createBridgeLifecycle, type BridgeLifecycle } from './lifecycle.js';
import { acceptSnapshotPush, pumpInto } from './snapshots.js';
import type { WhatsAppEnv } from './worker-env.js';

/** Workers fixed-length stream to write to R2 without loading the file into memory. */
export function workersFixedLength(
  body: ReadableStream<Uint8Array>,
  length: number,
): ReadableStream<Uint8Array> {
  const { readable, writable } = new FixedLengthStream(length);
  void pumpInto(body, writable);
  return readable;
}

/** Durable Object that controls the bridge container. */
export class WhatsAppBridge extends Container<WhatsAppEnv> {
  override defaultPort = 8080;
  override enableInternet = true;
  private readonly lifecycle: BridgeLifecycle;

  /** Receives the snapshot the bridge sends on `SIGTERM` through the internal address `snapshot.internal`. */
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

  /** Serves the Worker through the lifecycle (restore, forwarding, snapshot, send limit). */
  override fetch(request: Request): Promise<Response> {
    return this.lifecycle.handle(request);
  }

  /** Before sleeping, saves the last snapshot; then stops the container. */
  override async onActivityExpired(): Promise<void> {
    await this.lifecycle.snapshotQuietly();
    await super.onActivityExpired();
  }
}
