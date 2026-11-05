/**
 * Entrada do conector Canvas remoto no Cloudflare Workers (ADR 0010): o mesmo handler HTTP + OAuth do
 * `remote-main.ts`, servido pelo `fetch` do Worker. Configuração em `wrangler.toml` e no secret `SEAL_KEY`.
 */
import { envValue, type EnvVars } from '../../../src/core/env.js';
import { createRemoteHandler, type RemoteApp } from '../../../src/remote/handler.js';
import { readOAuthSettings } from '../../../src/remote/oauth.js';
import { canvasRemoteConnector, readCanvasRemoteSettings } from './remote.js';

/** Converte o ambiente do Worker (variáveis, secrets e bindings) em variáveis de texto. */
export function toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars {
  return Object.fromEntries(
    Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

/** Monta o app remoto: emissor é `PUBLIC_URL` ou, sem ela, a origem da requisição (ex.: `*.workers.dev`). */
export function createWorkerApp(env: EnvVars, origin: string): RemoteApp {
  const issuer = envValue(env, 'PUBLIC_URL')?.replace(/\/+$/, '') ?? origin;
  return {
    settings: readOAuthSettings(env, issuer),
    connector: canvasRemoteConnector(readCanvasRemoteSettings(env)),
    now: () => Math.floor(Date.now() / 1000),
  };
}

/** Atende uma requisição do Worker; configuração inválida vira 500 com a explicação. */
export async function handleWorkerFetch(
  request: Request,
  env: Readonly<Record<string, unknown>>,
): Promise<Response> {
  let app: RemoteApp;
  try {
    app = createWorkerApp(toEnvVars(env), new URL(request.url).origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`Configuração do Worker inválida: ${message}`, { status: 500 });
  }
  return createRemoteHandler(app)(request);
}

export default { fetch: handleWorkerFetch };
