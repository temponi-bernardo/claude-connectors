/**
 * Cliente da Gmail API: monta a URL, envia o access token da conta e o User-Agent, tenta de novo uma vez
 * depois de 401 e converte falhas HTTP em mensagens acionáveis. Escritas (`gmailWrite`) exigem antes o
 * escopo `gmail.modify` na conta, para contas antigas (só leitura) pedirem novo vínculo sem chamar o Google.
 */
import { requireWriteAccess, type AccountRef } from './accounts.js';
import { UPSTREAM_USER_AGENT, type GmailDeps, type OwnerDeps } from './context.js';
import { forgetAccessToken, getAccessToken } from './access-token.js';

/** Base da Gmail API para a conta do token. */
export const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/** Valor de um parâmetro da Gmail API; listas viram o parâmetro repetido (`metadataHeaders=a&...=b`). */
export type GmailQueryValue = string | number | readonly string[] | null | undefined;

/** Pedido à Gmail API: URL, método (padrão GET) e corpo JSON opcional. */
export interface GmailRequest {
  readonly url: string;
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly body?: unknown;
}

/** Maior detalhe de erro do Gmail repassado ao modelo, em caracteres. */
export const MAX_GMAIL_ERROR_DETAIL = 200;

/** Mensagens por status HTTP da Gmail API. */
export const GMAIL_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Gmail rejected the request (check ids, query and recipients)',
  403: 'Gmail denied access (missing permission: use link_account and link the account again)',
  404: 'not found (wrong id or from another account)',
  429: 'Gmail usage limit reached; try again shortly',
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

/** Erro acionável para uma resposta de falha da Gmail API, com o detalhe do Gmail quando houver. */
export function gmailHttpError(status: number, alias: string, detail: string | null = null): Error {
  const reason = GMAIL_STATUS_MESSAGES[status] ?? `Gmail failed (HTTP ${status}); try again`;
  return new Error(`Account "${alias}": ${reason}${detail ? `: ${detail}` : ''}.`);
}

/** Detalhe (`error.message`) de uma resposta de erro da Gmail API, limitado; nulo se não houver. */
export async function gmailErrorDetail(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { error?: { message?: unknown } };
    const message = body.error?.message;
    return typeof message === 'string' ? message.slice(0, MAX_GMAIL_ERROR_DETAIL) : null;
  } catch {
    return null;
  }
}

/** Envia um pedido autenticado à Gmail API com o access token dado. */
export function sendGmailRequest(
  deps: GmailDeps,
  request: GmailRequest,
  token: string,
): Promise<Response> {
  const hasBody = request.body !== undefined;
  return deps.fetch(request.url, {
    method: request.method ?? 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      'user-agent': UPSTREAM_USER_AGENT,
      ...(hasBody ? { 'content-type': 'application/json' } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(request.body) } : {}),
  });
}

/** Lê o JSON de uma resposta de sucesso; corpo vazio (ex.: 204 de DELETE) vira objeto vazio. */
export async function readGmailJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** Faz um pedido à Gmail API e lê o JSON; depois de 401 renova o token e tenta mais uma vez. */
export async function gmailCall<T>(
  deps: OwnerDeps,
  ref: AccountRef,
  request: GmailRequest,
): Promise<T> {
  let response = await sendGmailRequest(deps, request, await getAccessToken(deps, ref));
  if (response.status === 401) {
    forgetAccessToken(deps.owner, ref.account.email);
    response = await sendGmailRequest(deps, request, await getAccessToken(deps, ref));
  }
  if (!response.ok) {
    throw gmailHttpError(response.status, ref.alias, await gmailErrorDetail(response));
  }
  return readGmailJson<T>(response);
}

/** Lê um recurso da Gmail API como JSON. */
export function gmailGet<T>(deps: OwnerDeps, ref: AccountRef, url: string): Promise<T> {
  return gmailCall<T>(deps, ref, { url });
}

/** Escreve na Gmail API (enviar, rascunhos, marcadores, lixeira) exigindo antes o escopo `gmail.modify`. */
export async function gmailWrite<T>(
  deps: OwnerDeps,
  ref: AccountRef,
  request: GmailRequest,
): Promise<T> {
  requireWriteAccess(ref);
  return gmailCall<T>(deps, ref, request);
}
