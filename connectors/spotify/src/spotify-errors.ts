/**
 * Errors of the Spotify Web API turned into actionable messages, and the per-call budget of Spotify requests.
 * Pure: messages never carry tokens, credentials or the request URL's query.
 */
import type { CallBudget } from './context.js';

/** The tool call already used every Spotify request it may make; the operation resumes on the next call. */
export class BudgetExhaustedError extends Error {
  constructor() {
    super('Spotify request budget for this call is used up; call the tool again to continue.');
    this.name = 'BudgetExhaustedError';
  }
}

/** An HTTP error from the Spotify Web API, with its status and Spotify's `reason` (if any). */
export class SpotifyApiError extends Error {
  readonly status: number;
  readonly reason: string;

  constructor(status: number, reason: string, message: string) {
    super(message);
    this.name = 'SpotifyApiError';
    this.status = status;
    this.reason = reason;
  }
}

/** Takes one request from the budget; throws `BudgetExhaustedError` when none is left. */
export function spendCall(budget: CallBudget): void {
  if (budget.remaining <= 0) throw new BudgetExhaustedError();
  budget.remaining -= 1;
}

/** Spotify's error detail (`error.message`, `error.reason`) from a failure body; empty when absent. */
export function spotifyErrorDetail(body: unknown): { message: string; reason: string } {
  const error = (body as { error?: unknown } | null)?.error;
  if (typeof error === 'string') return { message: error, reason: '' };
  const item = (typeof error === 'object' && error !== null ? error : {}) as Record<
    string,
    unknown
  >;
  return {
    message: typeof item.message === 'string' ? item.message : '',
    reason: typeof item.reason === 'string' ? item.reason : '',
  };
}

/** Message for a 403: Premium for playback, otherwise the usual causes in development mode. */
export function forbiddenMessage(path: string, detail: string): string {
  if (path.startsWith('/me/player')) {
    return `Spotify refused playback control (403${detail}). Playback control needs Spotify Premium, and some devices do not accept remote commands.`;
  }
  return `Spotify refused the request (403${detail}). Usual causes: the playlist is not yours (apps may only read or edit items of playlists you own or collaborate on); your Spotify account is not in your app's User Management list (development mode allows 5 users); or a permission is missing — reconnect the connector to grant it.`;
}

/** Message for a 404: no active device for playback, otherwise a wrong id. */
export function notFoundMessage(path: string, detail: string): string {
  if (path.startsWith('/me/player')) {
    return `No active Spotify device (404${detail}). Open Spotify on a phone, computer or speaker and play something, or pass a device_id from list_devices.`;
  }
  return `Spotify did not find it (404${detail}). Check the id or URI.`;
}

/** Message for a 429: the developer quota, or a short rate limit with the wait. */
export function rateLimitMessage(reason: string, retryAfter: number): string {
  if (reason === 'QUOTA_EXCEEDED') {
    return 'The request quota of your Spotify app is used up (QUOTA_EXCEEDED). Wait and try later; the quota belongs to your own developer account.';
  }
  return `Spotify rate limit reached: try again in ${retryAfter} seconds.`;
}

/** Builds the error for a failed Spotify response (status, path and parsed body). */
export function spotifyHttpError(
  status: number,
  path: string,
  extra: { readonly body: unknown; readonly retryAfter: number },
): SpotifyApiError {
  const { message, reason } = spotifyErrorDetail(extra.body);
  const detail = message ? `: ${message}` : '';
  const texts: Record<number, () => string> = {
    401: () =>
      `Spotify did not accept the access (401${detail}). Try again; if it persists, reconnect the connector.`,
    403: () => forbiddenMessage(path, detail),
    404: () => notFoundMessage(path, detail),
    429: () => rateLimitMessage(reason, extra.retryAfter),
  };
  const text =
    texts[status]?.() ??
    (status >= 500
      ? `Spotify is unavailable right now (${status}). Try again in a moment.`
      : `Spotify rejected the request (${status}${detail}).`);
  return new SpotifyApiError(status, reason, text);
}
