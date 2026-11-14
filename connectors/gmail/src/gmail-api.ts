/**
 * Cliente da Gmail API (só leitura): monta a URL, envia o access token da conta e o User-Agent, tenta de
 * novo uma vez depois de 401 e converte falhas HTTP em mensagens acionáveis.
 */
import type { AllowedAccount } from './config.js';
import { UPSTREAM_USER_AGENT, type GmailDeps } from './context.js';
import { forgetAccessToken, getAccessToken } from './access-token.js';

/** Base da Gmail API para a conta do token. */
export const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/** Valor de um parâmetro da Gmail API; listas viram o parâmetro repetido (`metadataHeaders=a&...=b`). */
export type GmailQueryValue = string | number | readonly string[] | null | undefined;

/** Mensagens por status HTTP da Gmail API. */
export const GMAIL_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'o Gmail recusou o pedido (confira a busca ou os ids)',
  403: 'o Gmail negou acesso (escopo gmail.readonly ausente: vincule a conta de novo)',
  404: 'não encontrado (id errado ou de outra conta)',
  429: 'limite de uso do Gmail atingido; tente de novo em instantes',
};

/** Monta a URL de um caminho da Gmail API com os parâmetros dados (nulos e vazios são omitidos). */
export function gmailUrl(
  path: string,
  params: Readonly<Record<string, GmailQueryValue>> = {},
): string {
  const url = new URL(`${GMAIL_API_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    const values: readonly (string | number)[] = Array.isArray(value)
      ? value
      : [value as string | number];
    for (const item of values) url.searchParams.append(key, String(item));
  }
  return url.toString();
}

/** Erro acionável para uma resposta de falha da Gmail API. */
export function gmailHttpError(status: number, account: AllowedAccount): Error {
  const reason = GMAIL_STATUS_MESSAGES[status] ?? `o Gmail falhou (HTTP ${status}); tente de novo`;
  return new Error(`Conta "${account.alias}": ${reason}.`);
}

/** Envia um GET autenticado à Gmail API com o access token dado. */
export function sendGmailGet(deps: GmailDeps, url: string, token: string): Promise<Response> {
  return deps.fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      'user-agent': UPSTREAM_USER_AGENT,
    },
  });
}

/** Lê um recurso da Gmail API como JSON; depois de 401 renova o token e tenta mais uma vez. */
export async function gmailGet<T>(
  deps: GmailDeps,
  account: AllowedAccount,
  url: string,
): Promise<T> {
  let response = await sendGmailGet(deps, url, await getAccessToken(deps, account));
  if (response.status === 401) {
    forgetAccessToken(account.email);
    response = await sendGmailGet(deps, url, await getAccessToken(deps, account));
  }
  if (!response.ok) throw gmailHttpError(response.status, account);
  return (await response.json()) as T;
}
