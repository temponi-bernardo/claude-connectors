/**
 * Thin `node:http` server around the standard Web handler, and reading of the remote server configuration.
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { envValue, type EnvVars } from '../core/env.js';
import { readOAuthSettings, type OAuthSettings } from './oauth.js';

/** Largest accepted request body (1 MB). */
export const MAX_BODY_BYTES = 1_000_000;

/** Process configuration: port and OAuth. */
export interface RemoteServerConfig {
  readonly port: number;
  readonly settings: OAuthSettings;
}

/** What the HTTP server needs: handler, public origin (to build the URL) and port. */
export interface NodeServerOptions {
  readonly handler: (request: Request) => Promise<Response>;
  readonly origin: string;
  readonly port: number;
}

/** Reads `PUBLIC_URL`: required, https (http only on localhost), no trailing slash. */
export function readPublicUrl(env: EnvVars): string {
  const raw = envValue(env, 'PUBLIC_URL');
  if (!raw || !URL.canParse(raw))
    throw new Error('Set PUBLIC_URL to the public address of the server.');
  const url = new URL(raw);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error('PUBLIC_URL must use https (Claude only connects over https).');
  }
  return raw.replace(/\/+$/, '');
}

/** Builds the configuration from the environment (`PUBLIC_URL`, `SEAL_KEY`, `PORT`, `OAUTH_REDIRECT_HOSTS`). */
export function readRemoteServerConfig(env: EnvVars): RemoteServerConfig {
  return {
    port: Number(envValue(env, 'PORT') ?? 8080),
    settings: readOAuthSettings(env, readPublicUrl(env)),
  };
}

/** Reads the request body; null if it exceeds `MAX_BODY_BYTES`. */
export async function readNodeBody(req: IncomingMessage): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Converts the Node request into a `Request`, using the public origin (the internal host may differ). */
export function toWebRequest(req: IncomingMessage, body: Buffer, origin: string): Request {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
  }
  const method = req.method ?? 'GET';
  const hasBody = !['GET', 'HEAD'].includes(method);
  return new Request(new URL(req.url ?? '/', origin), {
    method,
    headers,
    ...(hasBody ? { body: new Uint8Array(body) } : {}),
  });
}

/** Writes a `Response` to the Node response. */
export async function writeWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  res.end(Buffer.from(await response.arrayBuffer()));
}

/** Serves a Node request with the handler; a large body gives 413 and an unexpected error gives 500. */
export async function serveNodeRequest(
  options: NodeServerOptions,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const body = await readNodeBody(req);
  if (!body) {
    await writeWebResponse(res, new Response('Body too large.', { status: 413 }));
    return;
  }
  try {
    await writeWebResponse(res, await options.handler(toWebRequest(req, body, options.origin)));
  } catch (error) {
    console.error(error);
    await writeWebResponse(res, new Response('Internal error.', { status: 500 }));
  }
}

/** Starts the HTTP server on the requested port (0 = any free one). */
export function startRemoteHttpServer(options: NodeServerOptions): Server {
  const server = createServer((req, res) => void serveNodeRequest(options, req, res));
  return server.listen(options.port);
}
