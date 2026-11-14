/**
 * Mailbox organization: mark read/unread, archive, star and labels (per message or per thread) and trash
 * with restore. There is no permanent deletion: the `gmail.modify` scope does not even allow it.
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl, gmailWrite } from './gmail-api.js';

/** Ready-made actions on system labels. */
export type MailboxAction =
  'mark_read' | 'mark_unread' | 'archive' | 'unarchive' | 'star' | 'unstar';

/** Labels to add and remove (ids). */
export interface LabelChange {
  readonly add: readonly string[];
  readonly remove: readonly string[];
}

/** Messages and threads to change. */
export interface MailTargets {
  readonly messageIds: readonly string[];
  readonly threadIds: readonly string[];
}

/** Gmail API label. */
export interface GmailLabel {
  readonly id: string;
  readonly name: string;
  readonly type?: string;
}

/** Maximum messages per call of the organization tools. */
export const MAX_TARGET_MESSAGES = 50;

/** Maximum threads per call of the organization tools. */
export const MAX_TARGET_THREADS = 20;

/** What each action does to the Gmail system labels. */
export const MAILBOX_ACTIONS: Readonly<Record<MailboxAction, LabelChange>> = {
  mark_read: { add: [], remove: ['UNREAD'] },
  mark_unread: { add: ['UNREAD'], remove: [] },
  archive: { add: [], remove: ['INBOX'] },
  unarchive: { add: ['INBOX'], remove: [] },
  star: { add: ['STARRED'], remove: [] },
  unstar: { add: [], remove: ['STARRED'] },
};

/** Targets of a change; throws if there is no id. */
export function mailTargets(
  messageIds: readonly string[] | undefined,
  threadIds: readonly string[] | undefined,
): MailTargets {
  const targets = { messageIds: messageIds ?? [], threadIds: threadIds ?? [] };
  if (targets.messageIds.length + targets.threadIds.length === 0) {
    throw new Error('Give message_ids or thread_ids (ids from search_threads or get_thread).');
  }
  return targets;
}

/** Throws if the change has no label or adds and removes the same one. */
export function checkLabelChange(change: LabelChange): void {
  if (change.add.length + change.remove.length === 0) {
    throw new Error('Give at least one label in add_labels or remove_labels.');
  }
  const both = change.add.find((id) => change.remove.includes(id));
  if (both !== undefined)
    throw new Error(`Label "${both}" is in both add_labels and remove_labels.`);
}

/** Ids of the labels requested by id or name (case-insensitive); throws for unknown ones. */
export function resolveLabelIds(
  labels: readonly GmailLabel[],
  wanted: readonly string[],
): string[] {
  return wanted.map((item) => {
    const key = item.trim().toLowerCase();
    const found = labels.find((l) => l.id === item || l.name.toLowerCase() === key);
    if (!found) throw new Error(`Label "${item}" does not exist in this account. Use list_labels.`);
    return found.id;
  });
}

/** Account labels, as the Gmail API returns them. */
export async function fetchLabels(deps: OwnerDeps, ref: AccountRef): Promise<GmailLabel[]> {
  const body = await gmailGet<{ labels?: GmailLabel[] }>(deps, ref, gmailUrl('labels'));
  return body.labels ?? [];
}

/** Adds and removes labels: `batchModify` on messages and `modify` on each thread. */
export async function applyLabelChange(
  deps: OwnerDeps,
  ref: AccountRef,
  request: { readonly targets: MailTargets; readonly change: LabelChange },
): Promise<Record<string, unknown>> {
  const { targets, change } = request;
  const labels = { addLabelIds: change.add, removeLabelIds: change.remove };
  if (targets.messageIds.length > 0) {
    const body = { ids: targets.messageIds, ...labels };
    await gmailWrite(deps, ref, { url: gmailUrl('messages/batchModify'), method: 'POST', body });
  }
  for (const id of targets.threadIds) {
    await gmailWrite(deps, ref, {
      url: gmailUrl(`threads/${id}/modify`),
      method: 'POST',
      body: labels,
    });
  }
  return {
    ...targetCounts(ref.alias, targets),
    added_labels: change.add,
    removed_labels: change.remove,
  };
}

/** Account and how many messages and threads changed (for the tools' result). */
export function targetCounts(alias: string, targets: MailTargets): Record<string, unknown> {
  return {
    account: alias,
    messages: targets.messageIds.length,
    threads: targets.threadIds.length,
  };
}

/** Moves messages and threads to the trash (or restores them with `restore`). */
export async function moveToTrash(
  deps: OwnerDeps,
  ref: AccountRef,
  request: { readonly targets: MailTargets; readonly restore: boolean },
): Promise<Record<string, unknown>> {
  const action = request.restore ? 'untrash' : 'trash';
  const paths = [
    ...request.targets.messageIds.map((id) => `messages/${id}/${action}`),
    ...request.targets.threadIds.map((id) => `threads/${id}/${action}`),
  ];
  for (const path of paths) {
    await gmailWrite(deps, ref, { url: gmailUrl(path), method: 'POST' });
  }
  return { ...targetCounts(ref.alias, request.targets), action };
}
