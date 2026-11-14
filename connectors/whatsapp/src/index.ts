/**
 * Entrada do Worker do WhatsApp (`wrangler.toml` → `main`): só junta os handlers de `worker.ts`, o Durable Object
 * da ponte e o `ContainerProxy` (necessário para interceptar a saída do container, usada no snapshot do `SIGTERM`).
 */
import { WHATSAPP_WORKER_HANDLERS } from './worker.js';

export { ContainerProxy } from '@cloudflare/containers';
export { WhatsAppBridge } from './container.js';

export default WHATSAPP_WORKER_HANDLERS;
