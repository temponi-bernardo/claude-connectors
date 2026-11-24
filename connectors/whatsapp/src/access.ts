/**
 * Chat access list: which chats (contacts and groups) the connector may read and send to. The owner manages it
 * on the `/pair` page; it lives in the `WhatsAppBridge` Durable Object storage. Mode `all` (default, nothing saved
 * yet) keeps every chat open; mode `selected` allows only the listed chats. Pure, except the two bridge calls.
 */
import { bridgeJson, type BridgeFetch } from './bridge-client.js';
import { normalizeRecipient } from './config.js';
import { sanitizeText, type BridgeChat } from './format.js';

/** One allowed chat: JID, name shown to the owner and whether it is a group. */
export interface AccessEntry {
  readonly jid: string;
  readonly name: string;
  readonly group: boolean;
}

/** Access mode: every chat, or only the selected ones. */
export type AccessMode = 'all' | 'selected';

/** The owner's access list. */
export interface AccessList {
  readonly mode: AccessMode;
  readonly entries: readonly AccessEntry[];
}

/** Durable Object storage key of the access list. */
export const ACCESS_LIST_KEY = 'access-list';

/** Internal Durable Object route that reads (GET) and saves (PUT) the access list. */
export const ACCESS_ROUTE = '/__access';

/** Most chats the list holds (keeps the stored value small). */
export const MAX_ACCESS_ENTRIES = 200;

/** Longest name kept for an entry. */
const MAX_ENTRY_NAME = 100;

/** List before the owner saves anything: every chat open (behavior before the access list existed). */
export const OPEN_ACCESS: Readonly<AccessList> = { mode: 'all', entries: [] };

/** Validates one stored entry; null if it is not a usable chat. */
export function parseAccessEntry(raw: unknown): AccessEntry | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const jid = typeof record.jid === 'string' ? normalizeRecipient(record.jid) : null;
  if (!jid?.includes('@')) return null;
  const name = typeof record.name === 'string' ? record.name : '';
  return {
    jid,
    name: sanitizeText(name, MAX_ENTRY_NAME) || jid,
    group: jid.endsWith('@g.us'),
  };
}

/** Valid entries of a stored list, without duplicates and within the size cap. */
export function parseAccessEntries(raw: unknown): AccessEntry[] {
  let list: AccessList = { mode: 'selected', entries: [] };
  for (const entry of (Array.isArray(raw) ? raw : []).map(parseAccessEntry)) {
    if (entry && list.entries.length < MAX_ACCESS_ENTRIES) list = withAccessEntry(list, entry);
  }
  return [...list.entries];
}

/** Reads the stored list: nothing saved = open; a corrupt value fails closed (selected, empty). */
export function parseAccessList(raw: unknown): AccessList {
  if (raw === undefined || raw === null) return OPEN_ACCESS;
  const record = typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  if (record.mode !== 'all' && record.mode !== 'selected') return { mode: 'selected', entries: [] };
  return { mode: record.mode, entries: parseAccessEntries(record.entries) };
}

/** Tells whether the connector may read and send to a chat. */
export function isChatAllowed(list: AccessList, jid: string): boolean {
  return list.mode === 'all' || list.entries.some((entry) => entry.jid === jid);
}

/** Refusal for a chat outside the list, pointing the owner to the page where it is managed. */
export function accessRefusal(pairUrl: string): string {
  return `This chat is not in the owner's WhatsApp access list, so the connector cannot read or send to it. The owner can allow it at ${pairUrl} (Chat access).`;
}

/** Throws if the chat is outside the access list. */
export function requireChatAccess(list: AccessList, jid: string, pairUrl: string): void {
  if (!isChatAllowed(list, jid)) throw new Error(accessRefusal(pairUrl));
}

/** Adds (or renames) an entry; past the size cap, throws. */
export function withAccessEntry(list: AccessList, entry: AccessEntry): AccessList {
  const others = list.entries.filter((item) => item.jid !== entry.jid);
  if (others.length === list.entries.length && others.length >= MAX_ACCESS_ENTRIES) {
    throw new Error(`The access list holds at most ${MAX_ACCESS_ENTRIES} chats.`);
  }
  const at = list.entries.findIndex((item) => item.jid === entry.jid);
  const entries =
    at < 0 ? [...others, entry] : list.entries.map((item, i) => (i === at ? entry : item));
  return { mode: list.mode, entries };
}

/** Removes an entry by JID. */
export function withoutAccessEntry(list: AccessList, jid: string): AccessList {
  return { mode: list.mode, entries: list.entries.filter((item) => item.jid !== jid) };
}

/** Switches the mode, keeping the entries. */
export function withAccessMode(list: AccessList, mode: AccessMode): AccessList {
  return { mode, entries: list.entries };
}

/** Builds an entry from the `/pair` form (`jid`, `name`); null if the JID is invalid. */
export function accessEntryFrom(form: URLSearchParams): AccessEntry | null {
  return parseAccessEntry({ jid: form.get('jid') ?? '', name: form.get('name') ?? '' });
}

/** In selected mode, flags each compact chat and hides the last-message preview of chats outside the list. */
export function markChatAccess(
  list: AccessList,
  chats: readonly Record<string, unknown>[],
): Record<string, unknown>[] {
  if (list.mode === 'all') return [...chats];
  return chats.map((chat) => {
    if (isChatAllowed(list, String(chat.jid))) return { ...chat, allowed: true };
    const rest = Object.entries(chat).filter(([key]) => key !== 'last');
    return { ...Object.fromEntries(rest), allowed: false };
  });
}

/** Keeps only compact messages (`chat` field) of allowed chats. */
export function filterAllowedMessages<T extends { readonly chat?: unknown }>(
  list: AccessList,
  messages: readonly T[],
): T[] {
  return messages.filter((message) => isChatAllowed(list, String(message.chat)));
}

/** Search results for the `/pair` page: chats and contacts as entries, without repeating a JID. */
export function mergeCandidates(
  chats: readonly BridgeChat[],
  contacts: readonly Readonly<Record<string, string | null>>[],
): AccessEntry[] {
  const raw = [
    ...chats.map((chat) => ({ jid: chat.jid, name: chat.name })),
    ...contacts.map((contact) => ({ jid: contact.jid, name: contact.name ?? contact.push_name })),
  ];
  const seen = new Set<string>();
  return raw.flatMap((item) => {
    const entry = parseAccessEntry(item);
    if (!entry || seen.has(entry.jid)) return [];
    seen.add(entry.jid);
    return [entry];
  });
}

/** Reads the access list from the Durable Object (does not wake the container). */
export async function fetchAccessList(bridge: BridgeFetch, deadline: number): Promise<AccessList> {
  return parseAccessList(await bridgeJson<unknown>(bridge, ACCESS_ROUTE, { deadline }));
}

/** Saves the access list in the Durable Object. */
export async function saveAccessList(
  bridge: BridgeFetch,
  list: AccessList,
  deadline: number,
): Promise<void> {
  const init = {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(list),
  };
  await bridgeJson(bridge, ACCESS_ROUTE, { init, deadline });
}
