/**
 * Main Worker module: only the `default`. The runtime treats every named export of the main module as an
 * entrypoint and rejects constants, so the logic (and its exports for tests) lives in `worker.ts`.
 */
import { handleGmailWorkerFetch } from './worker.js';

export default { fetch: handleGmailWorkerFetch };
