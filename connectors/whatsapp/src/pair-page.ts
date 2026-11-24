/**
 * HTML page for `/pair`: WhatsApp status and pairing by code (PairPhone) or QR. No script; the forms carry the
 * anti-CSRF token. Uses the visual tokens of the login page (`docs/UI.md`). Pure.
 */
import { escapeHtml, LOGIN_PAGE_CSS } from '../../../src/remote/login-page.js';
import type { AccessEntry, AccessList } from './access.js';
import type { BridgeStatus } from './format.js';

/** Style additions for `/pair`: large code, QR and secondary buttons. */
export const PAIR_PAGE_CSS = `.code{font:700 2rem/1.2 ui-monospace,monospace;letter-spacing:.15em;color:var(--text);text-align:center;margin:var(--space) 0}
.qr{display:block;margin:var(--space) auto;width:256px;height:256px;image-rendering:pixelated;background:#fff;padding:8px;border-radius:8px}
.ok{color:var(--accent);font-weight:600}.secondary{background:transparent;color:var(--accent);border:1px solid var(--line)}
.danger{background:var(--danger)}hr{border:0;border-top:1px solid var(--line);margin:calc(var(--space)*1.5) 0}
h2{font-size:1.05rem;margin:0 0 8px}.list{list-style:none;padding:0;margin:0 0 var(--space)}
.list li{display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid var(--line);padding:8px 0}
.list li span{overflow-wrap:anywhere}.list small{display:block;color:var(--muted)}.list form{flex:none}
.list button{margin:0;width:auto;padding:6px 12px}`;

/** What the page shows besides the status. */
export interface PairPageView {
  readonly email: string;
  readonly csrf: string;
  readonly status: BridgeStatus | null;
  readonly code?: string;
  readonly qrPng?: string;
  readonly message?: string;
  readonly error?: string;
  /** Owner's chat access list; null if it could not be read. */
  readonly access?: AccessList | null;
  /** Results of the last chat search on the page. */
  readonly candidates?: readonly AccessEntry[];
  readonly query?: string;
}

/** Status sentence for the owner. */
export function describePairStatus(status: BridgeStatus | null): string {
  if (!status) return 'Could not read the WhatsApp status right now.';
  if (status.needs_pairing) return 'Pairing needed: no phone linked (or it was logged out).';
  if (!status.connected) return 'Paired, but still connecting to WhatsApp…';
  const sync = status.offline_sync_complete ? 'synced' : 'syncing pending messages';
  return `Connected${status.account ? ` as ${status.account}` : ''} (${sync}).`;
}

/** POST form with the anti-CSRF token and extra fields. */
export function pairForm(action: string, csrf: string, body: string): string {
  return `<form method="post" action="${action}"><input type="hidden" name="csrf" value="${escapeHtml(csrf)}">${body}</form>`;
}

/** Pairing block: request a code by phone number or show the QR. */
export function pairingSection(view: PairPageView): string {
  const code = view.code
    ? `<p>On the phone: WhatsApp → Linked devices → Link a device → Link with phone number instead, and type:</p><p class="code">${escapeHtml(view.code)}</p>`
    : '';
  const qr = view.qrPng
    ? `<p>Or scan this QR in WhatsApp → Linked devices → Link a device:</p><img class="qr" alt="Pairing QR" src="data:image/png;base64,${escapeHtml(view.qrPng)}">`
    : '';
  const phoneForm = pairForm(
    '/pair/code',
    view.csrf,
    '<label for="phone">Your number with country code (digits only)</label><input id="phone" name="phone" inputmode="numeric" pattern="[0-9]{8,15}" required placeholder="5531999999999"><button type="submit">Generate pairing code</button>',
  );
  const qrForm = pairForm(
    '/pair/qr',
    view.csrf,
    '<button class="secondary" type="submit">Show QR</button>',
  );
  return `${code}${qr}${phoneForm}${qrForm}`;
}

/** Maintenance block: log out, start over (archives the backup) and sign out. */
export function maintenanceSection(view: PairPageView): string {
  const logout = pairForm(
    '/pair/logout',
    view.csrf,
    '<button class="secondary" type="submit">Unlink this device</button>',
  );
  const reset = pairForm(
    '/pair/reset',
    view.csrf,
    '<label for="confirm">Start over: archives the backup and requires pairing again. Type ERASE</label><input id="confirm" name="confirm" required><button class="danger" type="submit">Start over</button>',
  );
  const signout = pairForm(
    '/pair/signout',
    view.csrf,
    '<button class="secondary" type="submit">Sign out</button>',
  );
  return `<hr>${logout}${reset}${signout}`;
}

/** One chat line: name, kind and an action button (or a note when there is nothing to do). */
export function accessEntryRow(entry: AccessEntry, action: string, view: PairPageView): string {
  const kind = entry.group ? 'Group' : 'Contact';
  const label = `<span>${escapeHtml(entry.name)}<small>${kind} · ${escapeHtml(entry.jid)}</small></span>`;
  if (!action) return `<li>${label}<small>Allowed</small></li>`;
  const button = action.endsWith('/remove') ? 'Remove' : 'Allow';
  const fields = `<input type="hidden" name="jid" value="${escapeHtml(entry.jid)}"><input type="hidden" name="name" value="${escapeHtml(entry.name)}"><button class="secondary" type="submit">${button}</button>`;
  return `<li>${label}${pairForm(action, view.csrf, fields)}</li>`;
}

/** One radio option of the access mode, checked when it is the current mode. */
export function accessModeRadio(list: AccessList, mode: AccessList['mode'], text: string): string {
  const checked = list.mode === mode ? ' checked' : '';
  return `<label class="option"><input type="radio" name="mode" value="${mode}"${checked}>${text}</label>`;
}

/** Mode choice: every chat, or only the selected ones. */
export function accessModeForm(list: AccessList, view: PairPageView): string {
  const all = accessModeRadio(list, 'all', 'Every chat (no restriction)');
  const selected = accessModeRadio(list, 'selected', 'Only the chats I allow below');
  const body = `${all}${selected}<button type="submit">Save access mode</button>`;
  return pairForm('/pair/access/mode', view.csrf, body);
}

/** Search form and its results; chats already allowed have no button. */
export function accessSearchHtml(list: AccessList, view: PairPageView): string {
  const form = pairForm(
    '/pair/access/search',
    view.csrf,
    `<label for="query">Find a group or contact (empty = most recent chats)</label><input id="query" name="query" maxlength="100" value="${escapeHtml(view.query ?? '')}"><button class="secondary" type="submit">Search</button>`,
  );
  if (!view.candidates) return form;
  if (view.candidates.length === 0) return `${form}<p>No chats or contacts found.</p>`;
  const allowed = new Set(list.entries.map((entry) => entry.jid));
  const rows = view.candidates.map((entry) =>
    accessEntryRow(entry, allowed.has(entry.jid) ? '' : '/pair/access/add', view),
  );
  return `${form}<ul class="list">${rows.join('')}</ul>`;
}

/** Chat access block: mode, allowed chats with remove buttons, and the search to allow more. */
export function accessSection(view: PairPageView): string {
  const list = view.access;
  if (!list) return '<hr><h2>Chat access</h2><p>Could not read the access list right now.</p>';
  const summary =
    list.mode === 'all'
      ? 'Claude can read and message every chat. Choose "Only the chats I allow" to restrict it.'
      : `Claude can read and message only the chats below (${list.entries.length}); everything else is refused.`;
  const rows = list.entries.map((entry) => accessEntryRow(entry, '/pair/access/remove', view));
  const listHtml = rows.length
    ? `<ul class="list">${rows.join('')}</ul>`
    : '<p>No chats allowed yet.</p>';
  return `<hr><h2>Chat access</h2><p>${escapeHtml(summary)}</p>${accessModeForm(list, view)}${listHtml}${accessSearchHtml(list, view)}`;
}

/** Notice with the result of the last action: error, message or nothing. */
export function alertHtml(view: PairPageView): string {
  if (view.error) return `<p class="error" role="alert">${escapeHtml(view.error)}</p>`;
  if (view.message) return `<p class="ok" role="status">${escapeHtml(view.message)}</p>`;
  return '';
}

/** Renders the full `/pair` page. */
export function renderPairPage(view: PairPageView): string {
  const refresh =
    view.code || view.qrPng ? '<meta http-equiv="refresh" content="20;url=/pair">' : '';
  const alert = alertHtml(view);
  const pairing = view.status?.needs_pairing ? pairingSection(view) : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">${refresh}<title>WhatsApp in Claude</title><style>${LOGIN_PAGE_CSS}${PAIR_PAGE_CSS}</style></head><body><main>
<h1>WhatsApp in Claude</h1>
<p>Signed in as <strong>${escapeHtml(view.email)}</strong>.</p>
<p>${escapeHtml(describePairStatus(view.status))}</p>
${alert}${pairing}${accessSection(view)}${maintenanceSection(view)}
</main></body></html>`;
}
