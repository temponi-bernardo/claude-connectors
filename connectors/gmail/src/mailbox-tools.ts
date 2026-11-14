/**
 * Ferramentas MCP de organização: lido/não lido, arquivar, estrela, marcadores, lixeira e restaurar. Agem
 * em mensagens (`message_ids`) ou conversas inteiras (`thread_ids`). Não existe exclusão definitiva.
 */
import { z } from 'zod';
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
import {
  CONFIRM_HINT,
  DESTRUCTIVE_HINTS,
  GMAIL_ID,
  ONE_ACCOUNT,
  ORGANIZE_HINTS,
  resolveWritableAccount,
} from './tools.js';

/** Alvos: mensagens e/ou conversas inteiras (ao menos um id). */
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

/** Ação ligada ou desligada conforme o parâmetro booleano da ferramenta. */
export function toggleAction(
  on: boolean,
  onAction: MailboxAction,
  offAction: MailboxAction,
): MailboxAction {
  return on ? onAction : offAction;
}

/** Parâmetros de alvo das ferramentas de organização, já validados. */
export interface TargetArgs {
  readonly account: string;
  readonly message_ids?: string[] | undefined;
  readonly thread_ids?: string[] | undefined;
}

/** Alvos validados e conta com escrita: o começo comum de toda ferramenta de organização. */
export async function writableTargets(
  deps: OwnerDeps,
  args: TargetArgs,
): Promise<{ ref: AccountRef; targets: MailTargets }> {
  const ref = await resolveWritableAccount(deps, args.account);
  return { ref, targets: mailTargets(args.message_ids, args.thread_ids) };
}

/** Aplica uma ação pronta (lido, arquivar, estrela) nos alvos dos argumentos. */
export async function runMailboxAction(
  deps: OwnerDeps,
  args: TargetArgs,
  action: MailboxAction,
): Promise<Record<string, unknown>> {
  const { ref, targets } = await writableTargets(deps, args);
  return applyLabelChange(deps, ref, { targets, change: MAILBOX_ACTIONS[action] });
}

/** Texto do parâmetro booleano: `true` (padrão) liga, `false` desfaz. */
const TOGGLE_HELP = 'Default true; false undoes it.';

/** `mark_read`: marca como lido (ou não lido com `read: false`). */
export const markReadTool = defineTool({
  name: 'mark_read',
  description: 'Mark messages or threads as read (read: false marks them unread).',
  shape: { ...TARGET_SHAPE, read: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: ORGANIZE_HINTS,
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.read, 'mark_read', 'mark_unread')),
});

/** `archive`: tira da caixa de entrada (ou devolve com `archived: false`). */
export const archiveTool = defineTool({
  name: 'archive',
  description:
    'Archive messages or threads: remove them from the inbox (archived: false moves them back).',
  shape: { ...TARGET_SHAPE, archived: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: ORGANIZE_HINTS,
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.archived, 'archive', 'unarchive')),
});

/** `star`: põe estrela (ou tira com `starred: false`). */
export const starTool = defineTool({
  name: 'star',
  description: 'Star messages or threads (starred: false removes the star).',
  shape: { ...TARGET_SHAPE, starred: z.boolean().default(true).describe(TOGGLE_HELP) },
  annotations: ORGANIZE_HINTS,
  run: (deps: OwnerDeps, args) =>
    runMailboxAction(deps, args, toggleAction(args.starred, 'star', 'unstar')),
});

/** Lista de marcadores por id ou nome. */
const LABEL_LIST = z.array(z.string().min(1).max(225)).max(20).default([]);

/** `update_labels`: põe e tira marcadores (por id ou nome) de mensagens ou conversas. */
export const updateLabelsTool = defineTool({
  name: 'update_labels',
  description:
    'Add and/or remove labels (ids or names from list_labels, including system ones like IMPORTANT) on messages or threads.',
  shape: { ...TARGET_SHAPE, add_labels: LABEL_LIST, remove_labels: LABEL_LIST },
  annotations: ORGANIZE_HINTS,
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

/** `trash`: manda para a lixeira (o Gmail apaga sozinho depois de 30 dias; dá para restaurar antes). */
export const trashTool = defineTool({
  name: 'trash',
  description: `Move messages or threads to the trash (restorable with untrash for 30 days; there is no permanent delete). ${CONFIRM_HINT}`,
  shape: TARGET_SHAPE,
  annotations: DESTRUCTIVE_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const { ref, targets } = await writableTargets(deps, args);
    return moveToTrash(deps, ref, { targets, restore: false });
  },
});

/** `untrash`: tira da lixeira. */
export const untrashTool = defineTool({
  name: 'untrash',
  description: 'Restore messages or threads from the trash.',
  shape: TARGET_SHAPE,
  annotations: ORGANIZE_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const { ref, targets } = await writableTargets(deps, args);
    return moveToTrash(deps, ref, { targets, restore: true });
  },
});
