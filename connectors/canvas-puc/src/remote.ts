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

/** Lê `CANVAS_BASE_URL` e `CANVAS_ALLOW_WRITE` (escrita desligada por padrão). */
export function readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings {
  const baseUrl = envValue(env, 'CANVAS_BASE_URL') ?? DEFAULT_CANVAS_URL;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    allowWrite: parseFlag(envValue(env, 'CANVAS_ALLOW_WRITE')),
    fetchFn: fetch,
  };
}

/** Textos da página de autorização do Canvas. */
export function canvasLoginText(baseUrl: string): LoginPageText {
  return {
    title: 'Conectar o Canvas ao Claude',
    intro:
      'Cole um token de acesso do Canvas (Conta → Configurações → Novo token de acesso). O token não fica guardado neste servidor.',
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

/** Autenticação só por token: não renova nem abre login (isso acontece na reconexão do OAuth). */
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

/** Monta o conector remoto do Canvas para o servidor HTTP. */
export function canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector {
  return {
    loginText: canvasLoginText(settings.baseUrl),
    verifySecret: (secret) => verifyCanvasToken(settings, secret),
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
