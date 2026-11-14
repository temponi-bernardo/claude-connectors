/**
 * Organization MCP tools: read/unread, archive, star, labels, trash and restore. They act on messages
 * (`message_ids`) or whole threads (`thread_ids`). There is no permanent deletion.
 */
import { z } from 'zod';
import {
  DESTRUCTIVE_HINTS,
  ORGANIZE_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import {
  applyLabelChange,
  checkLabelChange,
  fetchLabels,
  MAILBOX_ACTIONS,
  mailTargets,
  MAX_TARGET_MESSAGES,
  MAX_TARGET_THREADS,
  moveToTrash,
  resolveLabelIds,
  type MailboxAction,
  type MailTargets,
} from './mailbox.js';
import { CONFIRM_HINT, GMAIL_ID, ONE_ACCOUNT, resolveWritableAccount } from './tools.js';

/** Targets: messages and/or whole threads (at least one id). */
export const TARGET_SHAPE = {
  account: ONE_ACCOUNT,
  message_ids: z.array(GMAIL_ID).min(1).max(MAX_TARGET_MESSAGES).optional(),
  thread_ids: z
    .array(GMAIL_ID)
    .min(1)
    .max(MAX_TARGET_THREADS)
    .optional()
    .describe('Whole threads (every message in them).'),
};

/** Action on or off depending on the tool's boolean parameter. */
export function toggleAction(
  on: boolean,
  onAction: MailboxAction,
  offAction: MailboxAction,
): MailboxAction {
  return on ? onAction : offAction;
}

/** Target parameters of the organization tools, already validated. */
export interface TargetArgs {
  readonly account: string;
  readonly message_ids?: string[] | undefined;
  readonly thread_ids?: string[] | undefined;
}

/** Validated targets and a writable account: the common start of every organization tool. */
export async function writableTargets(
  deps: OwnerDeps,
  args: TargetArgs,
): Promise<{ ref: AccountRef; targets: MailTargets }> {
  const ref = await resolveWritableAccount(deps, args.account);
  return { ref, targets: mailTargets(args.message_ids, args.thread_ids) };
}

/** Applies a ready-made action (read, archive, star) to the targets in the arguments. */
export async function runMailboxAction(
  deps: OwnerDeps,
  args: TargetArgs,
  action: MailboxAction,
): Promise<Record<string, unknown>> {
  const { ref, targets } = await writableTargets(deps, args);
  return applyLabelChange(deps, ref, { targets, change: MAILBOX_ACTIONS[action] });
}

/** Boolean parameter help: `true` (default) turns it on, `false` undoes it. */
const TOGGLE_HELP = 'Default true; false undoes it.';

/** `mark_read`: marks as read (or unread with `read: false`). */
export const markReadTool = defineTool({
  name: 'mark_read',
  description: 'Mark messages or threads as read (read: false marks them unread).',
  shape: { ...TARGET_SHAPE, read: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: toolAnnotations('Mark as read or unread', ORGANIZE_HINTS),
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.read, 'mark_read', 'mark_unread')),
});

/** `archive`: removes from the inbox (or moves back with `archived: false`). */
export const archiveTool = defineTool({
  name: 'archive',
  description:
    'Archive messages or threads: remove them from the inbox (archived: false moves them back).',
  shape: { ...TARGET_SHAPE, archived: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: toolAnnotations('Archive', ORGANIZE_HINTS),
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.archived, 'archive', 'unarchive')),
});

/** `star`: adds a star (or removes it with `starred: false`). */
export const starTool = defineTool({
  name: 'star',
  description: 'Star messages or threads (starred: false removes the star).',
  shape: { ...TARGET_SHAPE, starred: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: toolAnnotations('Star', ORGANIZE_HINTS),
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.starred, 'star', 'unstar')),
});

/** List of labels by id or name. */
const LABEL_LIST = z.array(z.string().min(1).max(225)).max(20).default([]);

/** `update_labels`: adds and removes labels (by id or name) on messages or threads. */
export const updateLabelsTool = defineTool({
  name: 'update_labels',
  description:
    'Add and/or remove labels (ids or names from list_labels, including system ones like IMPORTANT) on messages or threads.',
  shape: { ...TARGET_SHAPE, add_labels: LABEL_LIST, remove_labels: LABEL_LIST },
  annotations: toolAnnotations('Update labels', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const { ref, targets } = await writableTargets(deps, args);
    checkLabelChange({ add: args.add_labels, remove: args.remove_labels });
    const labels = await fetchLabels(deps, ref);
    const change = {
      add: resolveLabelIds(labels, args.add_labels),
      remove: resolveLabelIds(labels, args.remove_labels),
    };
    checkLabelChange(change);
    return applyLabelChange(deps, ref, { targets, change });
  },
});

/** `trash`: moves to the trash (Gmail deletes it by itself after 30 days; it can be restored before). */
export const trashTool = defineTool({
  name: 'trash',
  description: `Move messages or threads to the trash (restorable with untrash for 30 days; there is no permanent delete). ${CONFIRM_HINT}`,
  shape: TARGET_SHAPE,
  annotations: toolAnnotations('Move to trash', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const { ref, targets } = await writableTargets(deps, args);
    return moveToTrash(deps, ref, { targets, restore: false });
  },
});

/** `untrash`: restores from the trash. */
export const untrashTool = defineTool({
  name: 'untrash',
  description: 'Restore messages or threads from the trash.',
  shape: TARGET_SHAPE,
  annotations: toolAnnotations('Restore from trash', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const { ref, targets } = await writableTargets(deps, args);
    return moveToTrash(deps, ref, { targets, restore: true });
  },
});
