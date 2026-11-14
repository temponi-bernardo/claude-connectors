/**
 * Organização da caixa: marcar como lido/não lido, arquivar, estrela e marcadores (por mensagem ou por
 * conversa) e lixeira com restauração. Não há exclusão definitiva: o escopo `gmail.modify` nem permite.
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl, gmailWrite } from './gmail-api.js';

/** Ações prontas sobre marcadores de sistema. */
export type MailboxAction =
  'mark_read' | 'mark_unread' | 'archive' | 'unarchive' | 'star' | 'unstar';

/** Marcadores a pôr e a tirar (ids). */
export interface LabelChange {
  readonly add: readonly string[];
  readonly remove: readonly string[];
}

/** Mensagens e conversas a alterar. */
export interface MailTargets {
  readonly messageIds: readonly string[];
  readonly threadIds: readonly string[];
}

/** Marcador da Gmail API. */
export interface GmailLabel {
  readonly id: string;
  readonly name: string;
  readonly type?: string;
}

/** Mais mensagens por chamada das ferramentas de organização. */
export const MAX_TARGET_MESSAGES = 50;

/** Mais conversas por chamada das ferramentas de organização. */
export const MAX_TARGET_THREADS = 20;

/** O que cada ação faz nos marcadores de sistema do Gmail. */
export const MAILBOX_ACTIONS: Readonly<Record<MailboxAction, LabelChange>> = {
  mark_read: { add: [], remove: ['UNREAD'] },
  mark_unread: { add: ['UNREAD'], remove: [] },
  archive: { add: [], remove: ['INBOX'] },
  unarchive: { add: ['INBOX'], remove: [] },
  star: { add: ['STARRED'], remove: [] },
  unstar: { add: [], remove: ['STARRED'] },
};

/** Alvos de uma alteração; lança erro se não houver nenhum id. */
export function mailTargets(
  messageIds: readonly string[] | undefined,
  threadIds: readonly string[] | undefined,
): MailTargets {
  const targets = { messageIds: messageIds ?? [], threadIds: threadIds ?? [] };
  if (targets.messageIds.length + targets.threadIds.length === 0) {
    throw new Error(
      'Informe message_ids ou thread_ids (ids vindos de search_threads ou get_thread).',
    );
  }
  return targets;
}

/** Lança erro se a mudança não tiver marcador ou puser e tirar o mesmo. */
export function checkLabelChange(change: LabelChange): void {
  if (change.add.length + change.remove.length === 0) {
    throw new Error('Informe ao menos um marcador em add_labels ou remove_labels.');
  }
  const both = change.add.find((id) => change.remove.includes(id));
  if (both !== undefined)
    throw new Error(`O marcador "${both}" está em add_labels e remove_labels.`);
}

/** Ids dos marcadores pedidos por id ou nome (sem maiúsculas); lança erro para os desconhecidos. */
export function resolveLabelIds(
  labels: readonly GmailLabel[],
  wanted: readonly string[],
): string[] {
  return wanted.map((item) => {
    const key = item.trim().toLowerCase();
    const found = labels.find((l) => l.id === item || l.name.toLowerCase() === key);
    if (!found) throw new Error(`Marcador "${item}" não existe na conta. Use list_labels.`);
    return found.id;
  });
}

/** Marcadores da conta, como a Gmail API devolve. */
export async function fetchLabels(deps: OwnerDeps, ref: AccountRef): Promise<GmailLabel[]> {
  const body = await gmailGet<{ labels?: GmailLabel[] }>(deps, ref, gmailUrl('labels'));
  return body.labels ?? [];
}

/** Põe e tira marcadores: `batchModify` nas mensagens e `modify` em cada conversa. */
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

/** Conta e quantas mensagens e conversas foram alteradas (para o resultado das ferramentas). */
export function targetCounts(alias: string, targets: MailTargets): Record<string, unknown> {
  return {
    account: alias,
    messages: targets.messageIds.length,
    threads: targets.threadIds.length,
  };
}

/** Manda mensagens e conversas para a lixeira (ou as restaura com `restore`). */
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
