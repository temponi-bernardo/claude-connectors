/**
 * Módulo principal do Worker: só o `default`. O runtime trata cada export nomeado do módulo principal como
 * entrypoint e recusa constantes, por isso a lógica (e seus exports para teste) fica em `worker.ts`.
 */
import { handleGmailWorkerFetch } from './worker.js';

export default { fetch: handleGmailWorkerFetch };
