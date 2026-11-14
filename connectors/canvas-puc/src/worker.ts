/**
 * Entry of the remote Canvas connector on Cloudflare Workers (ADR 0010): the same HTTP + OAuth handler as
 * `remote-main.ts`, served by the Worker's `fetch`. Configuration in `wrangler.toml` and the `SEAL_KEY` secret.
 */
import { toEnvVars, type EnvVars } from '../../../src/core/env.js';
import { createRemoteHandler, type RemoteApp } from '../../../src/remote/handler.js';
import { readOAuthSettings, resolveIssuer } from '../../../src/remote/oauth.js';
import { canvasRemoteConnector, readCanvasRemoteSettings } from './remote.js';

/** Builds the remote app: the issuer is `PUBLIC_URL` or, without it, the request origin (e.g. `*.workers.dev`). */
export function createWorkerApp(env: EnvVars, origin: string): RemoteApp {
  return {
    settings: readOAuthSettings(env, resolveIssuer(env, origin)),
    connector: canvasRemoteConnector(readCanvasRemoteSettings(env)),
    now: () => Math.floor(Date.now() / 1000),
  };
}

/** Serves a Worker request; an invalid configuration becomes a 500 with the explanation. */
export async function handleWorkerFetch(
  request: Request,
  env: Readonly<Record<string, unknown>>,
): Promise<Response> {
  let app: RemoteApp;
  try {
    app = createWorkerApp(toEnvVars(env), new URL(request.url).origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`Invalid Worker configuration: ${message}`, { status: 500 });
  }
  return createRemoteHandler(app)(request);
}

export default { fetch: handleWorkerFetch };
