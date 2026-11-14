/**
 * Cliente da ponte WhatsApp do lado do Worker: chama o Durable Object `WhatsAppBridge` (que acorda o container e
 * repassa à API interna, `bridge/API.md`) sempre dentro de um prazo, e traduz erros para mensagens ao usuário.
 */

/** Função que entrega uma requisição ao Durable Object da ponte (o `fetch` do stub). */
export type BridgeFetch = (path: string, init?: RequestInit) => Promise<Response>;

/** Erro da ponte com o status HTTP e o código (`error`) devolvido por ela. */
export class BridgeError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = 'BridgeError';
  }
}

/** Mensagens ao usuário para os códigos de erro conhecidos da ponte. */
export const BRIDGE_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  not_ready: 'O WhatsApp ainda está iniciando. Tente de novo em alguns segundos.',
  chat_not_found: 'Conversa não encontrada. Use list_chats para ver os JIDs.',
  not_found: 'Mensagem ou mídia não encontrada.',
  too_large: 'A mídia passa do limite de tamanho configurado (MAX_MEDIA_BYTES).',
  media_expired: 'O WhatsApp não tem mais esse arquivo (mídia antiga).',
  send_disabled: 'Envio desligado neste servidor (ENABLE_SEND=false).',
  recipient_not_allowed: 'Destinatário fora da SEND_ALLOWLIST: envio recusado.',
  rate_limited: 'Limite de envios por hora atingido. Tente mais tarde.',
  bad_snapshot:
    'Não consegui abrir o backup criptografado (SNAPSHOT_KEY trocada ou arquivo corrompido). Veja /pair.',
  unauthorized: 'A ponte recusou o BRIDGE_TOKEN: confira os secrets do Worker.',
  not_connected: 'O WhatsApp ainda não conectou. Tente de novo em alguns segundos.',
  download_failed: 'O WhatsApp não entregou a mídia agora. Tente de novo.',
  qr_not_ready: 'O QR ainda não chegou do WhatsApp. Tente de novo em alguns segundos.',
  pair_failed: 'O WhatsApp recusou o pedido de pareamento. Confira o número e tente de novo.',
  logout_failed: 'Não consegui desvincular agora. Tente de novo.',
  send_failed: 'O WhatsApp não aceitou o envio.',
};

/** Traduz uma resposta de erro da ponte em `BridgeError` com mensagem em português. */
export function bridgeErrorFrom(status: number, body: unknown): BridgeError {
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const code = typeof record.error === 'string' ? record.error : `http_${status}`;
  const fallback =
    typeof record.message === 'string' ? record.message : `A ponte respondeu ${status}.`;
  return new BridgeError(BRIDGE_ERROR_MESSAGES[code] ?? fallback, status, code);
}

/** Espera uma promessa até o instante `deadline` (ms Unix); depois disso rejeita com a mensagem dada. */
export function withDeadline<T>(
  promise: Promise<T>,
  deadline: number,
  message: string,
): Promise<T> {
  const remaining = deadline - Date.now();
  if (remaining <= 0) return Promise.reject(new Error(message));
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(message));
    }, remaining);
  });
  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

/** Mensagem de tempo esgotado de uma chamada à ponte. */
export function bridgeTimeoutMessage(path: string): string {
  const route = path.split('?')[0] ?? path;
  return `Tempo esgotado esperando o WhatsApp (${route}). O container pode estar acordando: tente de novo em instantes.`;
}

/** Espera entre tentativas enquanto a ponte acorda (ms). */
export const BRIDGE_RETRY_MS = 750;

/** Diz se vale tentar de novo: a ponte ainda está iniciando e sobra prazo para mais uma tentativa. */
export function shouldRetryBridge(error: BridgeError, deadline: number, now: number): boolean {
  return error.code === 'not_ready' && now + BRIDGE_RETRY_MS < deadline;
}

/** Faz uma tentativa: resposta 2xx, ou `BridgeError` com o código da ponte. */
export async function attemptBridge(
  bridge: BridgeFetch,
  path: string,
  options: { readonly init?: RequestInit; readonly deadline: number },
): Promise<Response> {
  const res = await withDeadline(
    bridge(path, options.init),
    options.deadline,
    bridgeTimeoutMessage(path),
  );
  if (res.ok) return res;
  const body: unknown = await res.json().catch(() => null);
  throw bridgeErrorFrom(res.status, body);
}

/** Chama a ponte dentro do prazo, esperando-a acordar (`not_ready`); 2xx devolve a resposta, o resto lança. */
export async function callBridge(
  bridge: BridgeFetch,
  path: string,
  options: { readonly init?: RequestInit; readonly deadline: number },
): Promise<Response> {
  for (;;) {
    try {
      return await attemptBridge(bridge, path, options);
    } catch (error) {
      if (
        !(error instanceof BridgeError) ||
        !shouldRetryBridge(error, options.deadline, Date.now())
      )
        throw error;
      await new Promise((resolve) => setTimeout(resolve, BRIDGE_RETRY_MS));
    }
  }
}

/** Chama a ponte e lê o JSON da resposta. */
export async function bridgeJson<T>(
  bridge: BridgeFetch,
  path: string,
  options: { readonly init?: RequestInit; readonly deadline: number },
): Promise<T> {
  const res = await callBridge(bridge, path, options);
  return (await res.json()) as T;
}

/** Monta `caminho?query` só com os parâmetros definidos. */
export function bridgePath(
  path: string,
  params: Readonly<Record<string, string | number | undefined>>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}

/** Corpo JSON de um POST para a ponte. */
export function jsonPost(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}
