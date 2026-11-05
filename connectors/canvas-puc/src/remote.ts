/**
 * Modo remoto do conector Canvas (ADR 0009): o usuário autoriza colando o token de acesso do Canvas na
 * página do OAuth; cada requisição MCP usa esse token, sem sessão do navegador nem arquivo em disco.
 */
import { envValue, parseFlag, type EnvVars } from '../../../src/core/env.js';
import type { RemoteConnector } from '../../../src/remote/handler.js';
import type { LoginPageText } from '../../../src/remote/login-page.js';
import type { AuthProvider, CanvasAuth } from './auth.js';
import { createCanvasClient } from './client.js';
import { DEFAULT_CANVAS_URL } from './config.js';
import { canvasServiceTools, createCanvasMcpServer } from './tools.js';

/** Configuração do modo remoto: Canvas fixo do servidor, escrita liberada ou não, e `fetch`. */
export interface CanvasRemoteSettings {
  readonly baseUrl: string;
  readonly allowWrite: boolean;
  readonly fetchFn: typeof fetch;
}

/** User-Agent das chamadas ao Canvas: sem ele o Canvas responde 403 (o fetch do Workers não manda um). */
export const CANVAS_USER_AGENT =
  'claude-connectors-canvas-puc (+https://github.com/temponi-bernardo/claude-connectors)';

/** Devolve as opções do `fetch` com o `User-Agent` do conector somado aos headers existentes. */
export function withCanvasUserAgent(init: RequestInit | undefined): RequestInit {
  const headers = Object.fromEntries(new Headers(init?.headers).entries());
  return { ...init, headers: { ...headers, 'user-agent': CANVAS_USER_AGENT } };
}

/** Lê `CANVAS_BASE_URL` e `CANVAS_ALLOW_WRITE` (escrita desligada por padrão). */
export function readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings {
  const baseUrl = envValue(env, 'CANVAS_BASE_URL') ?? DEFAULT_CANVAS_URL;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    allowWrite: parseFlag(envValue(env, 'CANVAS_ALLOW_WRITE')),
    // Arrow: no Workers, o fetch global chamado como método de outro objeto dá "Illegal invocation".
    fetchFn: (input, init) => fetch(input, withCanvasUserAgent(init)),
  };
}

/** Textos da página de autorização do Canvas. */
export function canvasLoginText(baseUrl: string): LoginPageText {
  return {
    title: 'Conectar o Canvas ao Claude',
    intro:
      'Cole um token de acesso do Canvas (Conta → Configurações → Novo token de acesso). O token não fica guardado neste servidor e, enquanto você usar o conector, a validade dele é renovada sozinha.',
    secretLabel: 'Token de acesso do Canvas',
    helpUrl: `${baseUrl}/profile/settings`,
    helpLabel: 'Abrir a página de tokens do Canvas',
    submit: 'Conectar',
  };
}

/** Mensagem de 401 no modo remoto: o token venceu ou foi revogado. */
export function remoteUnauthorizedMessage(_auth: CanvasAuth | null, baseUrl: string): string {
  return `O Canvas recusou o token (vencido ou revogado). Gere outro em ${baseUrl}/profile/settings e reconecte o conector nas configurações do Claude.`;
}

/** Autenticação só por token: não renova nem abre login (a validade é estendida no refresh do OAuth). */
export function createTokenAuthProvider(token: string): AuthProvider {
  return {
    current: () => ({ kind: 'token', token }),
    renew: () => Promise.resolve(null),
    connect: () =>
      Promise.reject(new Error('No conector remoto, reconecte pelas configurações do Claude.')),
    disconnect: () => undefined,
  };
}

/** Confere o token em `/api/v1/users/self`; rejeita com a orientação ao usuário se não servir. */
export async function verifyCanvasToken(
  settings: CanvasRemoteSettings,
  token: string,
): Promise<void> {
  if (!token.trim()) throw new Error('Cole o token de acesso do Canvas.');
  let res: Response;
  try {
    res = await settings.fetchFn(`${settings.baseUrl}/api/v1/users/self`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
  } catch {
    throw new Error('Não consegui falar com o Canvas. Tente de novo em instantes.');
  }
  if (res.status === 401) {
    throw new Error('O Canvas recusou o token: confira se copiou inteiro e se ele não expirou.');
  }
  if (!res.ok) throw new Error(`O Canvas respondeu ${res.status}. Tente de novo em instantes.`);
}

/** Quanto cada renovação estende o token: o Canvas recusa mais de 30 dias à frente (1 hora de folga). */
export const TOKEN_RENEWAL_SECONDS = 30 * 24 * 3600 - 3600;

/** Só renova se o token vence mais de um dia antes do limite (no máximo uma renovação por dia). */
const RENEWAL_SLACK_MS = 24 * 3600 * 1000;

/** Campos usados de um item de `/users/self/user_generated_tokens`. */
export interface CanvasTokenInfo {
  readonly id: number;
  readonly visible_token: string;
  readonly expires_at: string | null;
}

/** Pedido à API do Canvas com o token do usuário. */
export interface CanvasTokenRequest {
  readonly path: string;
  readonly method?: string;
  readonly body?: unknown;
}

/** Diz se o começo visível de um token (`11748~abcd...`) é o deste token. */
export function matchesVisibleToken(visible: string, token: string): boolean {
  const prefix = visible.replace(/\.+$/, '');
  return prefix.length > 0 && token.startsWith(prefix);
}

/** Decide a renovação: id e nova validade, ou nulo se o token não está na lista, não vence ou vence depois. */
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

/** Chama a API do Canvas com o token e devolve o JSON; rejeita se a resposta não for 2xx. */
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
  if (!res.ok) throw new Error(`O Canvas respondeu ${res.status} em ${request.path}.`);
  return res.json();
}

/** Estende a validade do próprio token no Canvas (Access Tokens API) quando ele está perto de vencer. */
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

/** Monta o conector remoto do Canvas para o servidor HTTP. */
export function canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector {
  return {
    loginText: canvasLoginText(settings.baseUrl),
    verifySecret: (secret) => verifyCanvasToken(settings, secret),
    renewSecret: (secret) => renewCanvasToken(settings, secret, new Date()),
    createServer: (secret) => {
      const auth = createTokenAuthProvider(secret);
      const client = createCanvasClient({
        baseUrl: settings.baseUrl,
        auth,
        fetchFn: settings.fetchFn,
        describeUnauthorized: remoteUnauthorizedMessage,
      });
      return createCanvasMcpServer(canvasServiceTools(settings.allowWrite), {
        client,
        auth,
        now: () => new Date(),
      });
    },
  };
}
