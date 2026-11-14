/**
 * Ambiente do Worker do WhatsApp: bindings (Durable Object da ponte e bucket R2) e acesso ao stub único da ponte.
 * Um só Durable Object com nome fixo garante uma só sessão do WhatsApp rodando por vez.
 */
import type { BridgeFetch } from './bridge-client.js';
import type { SnapshotBucket } from './snapshots.js';

/** Stub de Durable Object (subconjunto). */
export interface BridgeStub {
  fetch(request: Request): Promise<Response>;
}

/** Namespace do Durable Object (subconjunto). */
export interface BridgeNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): BridgeStub;
}

/** Bindings do Worker; o resto do ambiente são variáveis e secrets de texto. */
export interface WhatsAppEnv {
  readonly WHATSAPP_BRIDGE: BridgeNamespace;
  readonly SNAPSHOTS: SnapshotBucket;
  readonly [key: string]: unknown;
}

/** Nome fixo da única instância da ponte (instância única = sessão única). */
export const BRIDGE_INSTANCE_NAME = 'owner';

/** Devolve o stub da instância única da ponte. */
export function bridgeStub(env: WhatsAppEnv): BridgeStub {
  return env.WHATSAPP_BRIDGE.get(env.WHATSAPP_BRIDGE.idFromName(BRIDGE_INSTANCE_NAME));
}

/** Função que fala com a ponte pelo stub, com caminhos relativos (`/status`, `/chats?...`). */
export function bridgeFetchFor(stub: BridgeStub): BridgeFetch {
  return (path, init) => stub.fetch(new Request(`http://bridge${path}`, init));
}
