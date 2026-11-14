/**
 * WhatsApp Worker entry point (`wrangler.toml` → `main`): only joins the `worker.ts` handlers, the bridge Durable
 * Object and the `ContainerProxy` (needed to intercept the container's outbound traffic, used by the `SIGTERM` snapshot).
 */
import { WHATSAPP_WORKER_HANDLERS } from './worker.js';

export { ContainerProxy } from '@cloudflare/containers';
export { WhatsAppBridge } from './container.js';

export default WHATSAPP_WORKER_HANDLERS;
