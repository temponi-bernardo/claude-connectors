/**
 * WhatsApp Worker environment: bindings (bridge Durable Object and R2 bucket) and access to the single bridge stub.
 * A single Durable Object with a fixed name guarantees only one WhatsApp session runs at a time.
 */
import type { BridgeFetch } from './bridge-client.js';
import type { SnapshotBucket } from './snapshots.js';

/** Durable Object stub (subset). */
export interface BridgeStub {
  fetch(request: Request): Promise<Response>;
}

/** Durable Object namespace (subset). */
export interface BridgeNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): BridgeStub;
}

/** Worker bindings; the rest of the environment is text variables and secrets. */
export interface WhatsAppEnv {
  readonly WHATSAPP_BRIDGE: BridgeNamespace;
  readonly SNAPSHOTS: SnapshotBucket;
  readonly [key: string]: unknown;
}

/** Fixed name of the single bridge instance (single instance = single session). */
export const BRIDGE_INSTANCE_NAME = 'owner';

/** Returns the stub of the single bridge instance. */
export function bridgeStub(env: WhatsAppEnv): BridgeStub {
  return env.WHATSAPP_BRIDGE.get(env.WHATSAPP_BRIDGE.idFromName(BRIDGE_INSTANCE_NAME));
}

/** Function that talks to the bridge through the stub, with relative paths (`/status`, `/chats?...`). */
export function bridgeFetchFor(stub: BridgeStub): BridgeFetch {
  return (path, init) => stub.fetch(new Request(`http://bridge${path}`, init));
}
