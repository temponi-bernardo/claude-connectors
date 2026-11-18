/**
 * Remote mode of the Canvas connector (ADR 0009): the user authorizes by pasting a Canvas access token on
 * the OAuth page; every MCP request uses that token, with no browser session and no file on disk.
 */
import { envValue, parseFlag, type EnvVars } from '../../../src/core/env.js';
import { z } from 'zod';
import type { RemoteConnector, SecretRenewal } from '../../../src/remote/handler.js';
import type { StreamedToolContent, ToolCallRequest } from '../../../src/remote/streamed-tool.js';
import { createCanvasClient, type CanvasClient } from './client.js';
import { resolveCanvasFile } from './file-ref.js';
import { streamCanvasFile } from './files.js';
import { downloadFileShape } from './tools-read.js';
import type { LoginPageText } from '../../../src/remote/login-page.js';
import { canvasTools, createCanvasMcpServer } from './tools.js';

/** PUC Minas Canvas, used when `CANVAS_BASE_URL` is not set. */
export const DEFAULT_CANVAS_URL = 'https://pucminas.instructure.com';

/** Remote mode configuration: the server's fixed Canvas, whether writing is allowed, and `fetch`. */
export interface CanvasRemoteSettings {
  readonly baseUrl: string;
  readonly allowWrite: boolean;
  readonly fetchFn: typeof fetch;
}

/** User-Agent of the Canvas calls: without one Canvas answers 403 (the Workers fetch does not send one). */
export const CANVAS_USER_AGENT =
  'claude-connectors-canvas-puc (+https://github.com/temponi-bernardo/claude-connectors)';

/** Returns the `fetch` options with the connector's `User-Agent` added to the existing headers. */
export function withCanvasUserAgent(init: RequestInit | undefined): RequestInit {
  const headers = Object.fromEntries(new Headers(init?.headers).entries());
  return { ...init, headers: { ...headers, 'user-agent': CANVAS_USER_AGENT } };
}

/** Reads `CANVAS_BASE_URL` and `CANVAS_ALLOW_WRITE` (writing off by default). */
export function readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings {
  const baseUrl = envValue(env, 'CANVAS_BASE_URL') ?? DEFAULT_CANVAS_URL;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    allowWrite: parseFlag(envValue(env, 'CANVAS_ALLOW_WRITE')),
    // Arrow: on Workers, the global fetch called as a method of another object throws "Illegal invocation".
    fetchFn: (input, init) => fetch(input, withCanvasUserAgent(init)),
  };
}

/** Texts of the Canvas authorization page. */
export function canvasLoginText(baseUrl: string): LoginPageText {
  return {
    title: 'Connect Canvas to Claude',
    intro:
      'Paste a Canvas access token (Account → Settings → New Access Token). The token is not stored on this server and, while you use the connector, its expiry is renewed automatically.',
    secretLabel: 'Canvas access token',
    helpUrl: `${baseUrl}/profile/settings`,
    helpLabel: 'Open the Canvas tokens page',
    submit: 'Connect',
  };
}

/** Asks Canvas `/api/v1/users/self` with the token (rejects only on network failure). */
export function fetchCanvasSelf(settings: CanvasRemoteSettings, token: string): Promise<Response> {
  return settings.fetchFn(`${settings.baseUrl}/api/v1/users/self`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
}

/** Checks the token at `/api/v1/users/self`; rejects with guidance for the user if it does not work. */
export async function verifyCanvasToken(
  settings: CanvasRemoteSettings,
  token: string,
): Promise<void> {
  if (!token.trim()) throw new Error('Paste the Canvas access token.');
  let res: Response;
  try {
    res = await fetchCanvasSelf(settings, token);
  } catch {
    throw new Error('Could not reach Canvas. Try again in a moment.');
  }
  if (res.status === 401) {
    throw new Error(
      'Canvas refused the token: check that you copied all of it and that it has not expired.',
    );
  }
  if (!res.ok) throw new Error(`Canvas answered ${res.status}. Try again in a moment.`);
}

/** How far each renewal extends the token: Canvas refuses more than 30 days ahead (1 hour of slack). */
export const TOKEN_RENEWAL_SECONDS = 30 * 24 * 3600 - 3600;

/** Renews only if the token expires more than a day before the limit (at most one renewal a day). */
const RENEWAL_SLACK_MS = 24 * 3600 * 1000;

/** Fields used from an item of `/users/self/user_generated_tokens`. */
export interface CanvasTokenInfo {
  readonly id: number;
  readonly visible_token: string;
  readonly expires_at: string | null;
}

/** Canvas API request made with the user's token. */
export interface CanvasTokenRequest {
  readonly path: string;
  readonly method?: string;
  readonly body?: unknown;
}

/** Says whether the visible start of a token (`11748~abcd...`) belongs to this token. */
export function matchesVisibleToken(visible: string, token: string): boolean {
  const prefix = visible.replace(/\.+$/, '');
  return prefix.length > 0 && token.startsWith(prefix);
}

/** Plans the renewal: id and new expiry, or null if the token is not listed, never expires or expires later. */
export function planTokenRenewal(
  list: readonly CanvasTokenInfo[],
  token: string,
  now: Date,
): { readonly id: number; readonly expiresAt: string } | null {
  const mine = list.find((item) => matchesVisibleToken(item.visible_token, token));
  if (!mine?.expires_at) return null;
  const target = now.getTime() + TOKEN_RENEWAL_SECONDS * 1000;
  if (Date.parse(mine.expires_at) > target - RENEWAL_SLACK_MS) return null;
  return { id: mine.id, expiresAt: new Date(target).toISOString() };
}

/** Calls the Canvas API with the token and returns the JSON; rejects if the response is not 2xx. */
export async function canvasTokenApi(
  settings: CanvasRemoteSettings,
  token: string,
  request: CanvasTokenRequest,
): Promise<unknown> {
  const hasBody = request.body !== undefined;
  const res = await settings.fetchFn(`${settings.baseUrl}${request.path}`, {
    method: request.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(request.body) } : {}),
  });
  if (!res.ok) throw new Error(`Canvas answered ${res.status} on ${request.path}.`);
  return res.json();
}

/** Extends the token's own expiry on Canvas (Access Tokens API) when it is close to expiring. */
export async function renewCanvasToken(
  settings: CanvasRemoteSettings,
  token: string,
  now: Date,
): Promise<void> {
  const path = '/api/v1/users/self/user_generated_tokens?per_page=100';
  const list = (await canvasTokenApi(settings, token, { path })) as CanvasTokenInfo[];
  const plan = planTokenRenewal(list, token, now);
  if (!plan) return;
  await canvasTokenApi(settings, token, {
    path: `/api/v1/users/self/tokens/${plan.id}`,
    method: 'PUT',
    body: { token: { expires_at: plan.expiresAt } },
  });
}

/** Says whether Canvas still accepts the token: only a 401 counts as dead; network or 5xx errors count as alive. */
export async function isCanvasTokenAlive(
  settings: CanvasRemoteSettings,
  token: string,
): Promise<boolean> {
  try {
    return (await fetchCanvasSelf(settings, token)).status !== 401;
  } catch {
    return true;
  }
}

/** On each OAuth refresh: `revoked` if Canvas refuses the token, else extends its expiry and answers `kept`. */
export async function renewCanvasSecret(
  settings: CanvasRemoteSettings,
  token: string,
  now: Date,
): Promise<SecretRenewal> {
  if (!(await isCanvasTokenAlive(settings, token))) return 'revoked';
  await renewCanvasToken(settings, token, now);
  return 'kept';
}

/** Canvas client of the server's Canvas, authorized with the user's token. */
export function canvasClientFor(settings: CanvasRemoteSettings, token: string): CanvasClient {
  return createCanvasClient({ baseUrl: settings.baseUrl, token, fetchFn: settings.fetchFn });
}

/** Streams `download_file` (ADR 0023); `null` for every other tool, which the MCP server answers. */
export async function streamCanvasTool(
  client: CanvasClient,
  call: ToolCallRequest,
): Promise<StreamedToolContent | null> {
  if (call.name !== 'download_file') return null;
  const args = z.object(downloadFileShape).parse(call.args);
  return streamCanvasFile(client, await resolveCanvasFile(client, args), args);
}

/** Builds the remote Canvas connector for the HTTP server. */
export function canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector {
  return {
    login: {
      kind: 'secret',
      text: canvasLoginText(settings.baseUrl),
      verify: (secret) => verifyCanvasToken(settings, secret),
    },
    renewSecret: (secret) => renewCanvasSecret(settings, secret, new Date()),
    createServer: (secret) =>
      createCanvasMcpServer(canvasTools(settings.allowWrite), {
        client: canvasClientFor(settings, secret),
        now: () => new Date(),
      }),
    streamTool: (secret, call) => streamCanvasTool(canvasClientFor(settings, secret), call),
  };
}
