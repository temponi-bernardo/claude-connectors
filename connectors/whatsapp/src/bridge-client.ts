/**
 * Worker-side WhatsApp bridge client: calls the `WhatsAppBridge` Durable Object (which wakes the container and
 * forwards to the internal API, `bridge/API.md`) always within a deadline, and turns errors into user messages.
 */

/** Function that delivers a request to the bridge Durable Object (the stub's `fetch`). */
export type BridgeFetch = (path: string, init?: RequestInit) => Promise<Response>;

/** Bridge error with the HTTP status and the code (`error`) it returned. */
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

/** User-facing messages for the bridge's known error codes. */
export const BRIDGE_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  not_ready: 'WhatsApp is still starting. Try again in a few seconds.',
  chat_not_found: 'Chat not found. Use list_chats to see the JIDs.',
  not_found: 'Message or media not found.',
  too_large: 'The media is above the configured size limit (MAX_MEDIA_BYTES).',
  media_expired: 'WhatsApp no longer has this file (old media).',
  send_disabled: 'Sending is turned off on this server (ENABLE_SEND=false).',
  recipient_not_allowed: 'Recipient is not in SEND_ALLOWLIST: sending refused.',
  quoted_not_found: 'Quoted message not found in this chat. Use get_messages to see the ids.',
  rate_limited: 'Hourly sending limit reached. Try again later.',
  bad_snapshot:
    'Could not open the encrypted backup (SNAPSHOT_KEY changed or file corrupted). See /pair.',
  unauthorized: 'The bridge rejected BRIDGE_TOKEN: check the Worker secrets.',
  not_connected: 'WhatsApp has not connected yet. Try again in a few seconds.',
  download_failed: 'WhatsApp did not deliver the media right now. Try again.',
  qr_not_ready: 'The QR code has not arrived from WhatsApp yet. Try again in a few seconds.',
  pair_failed: 'WhatsApp rejected the pairing request. Check the number and try again.',
  logout_failed: 'Could not unlink right now. Try again.',
  send_failed: 'WhatsApp did not accept the message.',
};

/** Turns a bridge error response into a `BridgeError` with a user-facing message. */
export function bridgeErrorFrom(status: number, body: unknown): BridgeError {
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const code = typeof record.error === 'string' ? record.error : `http_${status}`;
  const fallback =
    typeof record.message === 'string' ? record.message : `The bridge answered ${status}.`;
  return new BridgeError(BRIDGE_ERROR_MESSAGES[code] ?? fallback, status, code);
}

/** Waits for a promise until `deadline` (Unix ms); after that rejects with the given message. */
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

/** Timeout message of a bridge call. */
export function bridgeTimeoutMessage(path: string): string {
  const route = path.split('?')[0] ?? path;
  return `Timed out waiting for WhatsApp (${route}). The container may be waking up: try again in a moment.`;
}

/** Wait between attempts while the bridge wakes up (ms). */
export const BRIDGE_RETRY_MS = 750;

/** Tells whether to retry: the bridge is still starting and there is time left for another attempt. */
export function shouldRetryBridge(error: BridgeError, deadline: number, now: number): boolean {
  return error.code === 'not_ready' && now + BRIDGE_RETRY_MS < deadline;
}

/** Makes one attempt: a 2xx response, or a `BridgeError` with the bridge code. */
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

/** Calls the bridge within the deadline, waiting for it to wake up (`not_ready`); 2xx returns the response, the rest throws. */
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

/** Calls the bridge and reads the response JSON. */
export async function bridgeJson<T>(
  bridge: BridgeFetch,
  path: string,
  options: { readonly init?: RequestInit; readonly deadline: number },
): Promise<T> {
  const res = await callBridge(bridge, path, options);
  return (await res.json()) as T;
}

/** Builds `path?query` with only the defined parameters. */
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

/** JSON body of a POST to the bridge. */
export function jsonPost(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}
