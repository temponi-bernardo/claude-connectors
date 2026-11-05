/**
 * Servidor `node:http` fino em volta do handler Web padrão, e leitura da configuração do servidor remoto.
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { envValue, type EnvVars } from '../core/env.js';
import type { OAuthSettings } from './oauth.js';
import { parseSealKey } from './seal.js';

/** Hosts de retorno OAuth aceitos por padrão: Claude na web e Claude Code (localhost). */
export const DEFAULT_REDIRECT_HOSTS: readonly string[] = ['claude.ai', 'claude.com', 'localhost'];

/** Maior corpo de requisição aceito (1 MB). */
export const MAX_BODY_BYTES = 1_000_000;

/** Configuração do processo: porta e OAuth. */
export interface RemoteServerConfig {
  readonly port: number;
  readonly settings: OAuthSettings;
}

/** O que o servidor HTTP precisa: handler, origem pública (para montar a URL) e porta. */
export interface NodeServerOptions {
  readonly handler: (request: Request) => Promise<Response>;
  readonly origin: string;
  readonly port: number;
}

/** Lê `PUBLIC_URL` (ou `RENDER_EXTERNAL_URL`, preenchida pelo Render): https, sem barra final. */
export function readPublicUrl(env: EnvVars): string {
  const raw = envValue(env, 'PUBLIC_URL') ?? envValue(env, 'RENDER_EXTERNAL_URL');
  if (!raw || !URL.canParse(raw))
    throw new Error('Defina PUBLIC_URL com o endereço público do servidor.');
  const url = new URL(raw);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error('PUBLIC_URL precisa usar https (o Claude só conecta em https).');
  }
  return raw.replace(/\/+$/, '');
}

/** Monta a configuração a partir do ambiente (`PUBLIC_URL`, `SEAL_KEY`, `PORT`, `OAUTH_REDIRECT_HOSTS`). */
export function readRemoteServerConfig(env: EnvVars): RemoteServerConfig {
  const hosts = envValue(env, 'OAUTH_REDIRECT_HOSTS')
    ?.split(',')
    .map((host) => host.trim());
  return {
    port: Number(envValue(env, 'PORT') ?? 8080),
    settings: {
      issuer: readPublicUrl(env),
      key: parseSealKey(envValue(env, 'SEAL_KEY')),
      redirectHosts: hosts?.filter(Boolean) ?? DEFAULT_REDIRECT_HOSTS,
    },
  };
}

/** Lê o corpo da requisição; nulo se passar de `MAX_BODY_BYTES`. */
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

/** Converte a requisição do Node em `Request`, usando a origem pública (o host interno pode ser outro). */
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

/** Escreve um `Response` na resposta do Node. */
export async function writeWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  res.end(Buffer.from(await response.arrayBuffer()));
}

/** Atende uma requisição do Node com o handler; corpo grande dá 413 e erro inesperado dá 500. */
export async function serveNodeRequest(
  options: NodeServerOptions,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const body = await readNodeBody(req);
  if (!body) {
    await writeWebResponse(res, new Response('Corpo grande demais.', { status: 413 }));
    return;
  }
  try {
    await writeWebResponse(res, await options.handler(toWebRequest(req, body, options.origin)));
  } catch (error) {
    console.error(error);
    await writeWebResponse(res, new Response('Erro interno.', { status: 500 }));
  }
}

/** Sobe o servidor HTTP na porta pedida (0 = qualquer livre). */
export function startRemoteHttpServer(options: NodeServerOptions): Server {
  const server = createServer((req, res) => void serveNodeRequest(options, req, res));
  return server.listen(options.port);
}
