/**
 * Rascunhos do Gmail: listar, criar (novo ou como resposta, na mesma conversa), substituir o conteúdo,
 * enviar e apagar. Escritas passam por `gmailWrite` (escopo `gmail.modify`).
 */
import type { AccountRef } from './accounts.js';
import type { PreparedEmail } from './compose.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl, gmailWrite } from './gmail-api.js';
import {
  internalDateIso,
  MESSAGE_HEADERS,
  pickHeaders,
  type GmailMessage,
} from './message-format.js';
import {
  composeEmail,
  gmailMessageResource,
  prepareReply,
  sentResult,
  type ComposeArgs,
} from './send.js';

/** Rascunho da Gmail API. */
export interface GmailDraft {
  readonly id: string;
  readonly message?: GmailMessage;
}

/** Argumentos de um rascunho: e-mail novo, ou resposta a `replyToMessageId` (destinatários do original). */
export interface DraftArgs extends ComposeArgs {
  readonly replyToMessageId: string | null;
  readonly replyAll: boolean;
}

/** Resumo de um rascunho: ids, destinatários, assunto, data e trecho. */
export function draftSummary(draft: GmailDraft): Record<string, unknown> {
  const { to, cc, subject } = {
    to: '',
    cc: '',
    subject: '',
    ...pickHeaders(draft.message?.payload),
  };
  return {
    ...draftIds(draft),
    to,
    cc,
    subject,
    date: internalDateIso(draft.message?.internalDate),
    snippet: draft.message?.snippet ?? '',
  };
}

/** Lista os rascunhos da conta (até `maxResults`) com o resumo de cada um. */
export async function listDrafts(
  deps: OwnerDeps,
  ref: AccountRef,
  maxResults: number,
): Promise<Record<string, unknown>> {
  const list = await gmailGet<{ drafts?: { id: string }[] }>(
    deps,
    ref,
    gmailUrl('drafts', { maxResults }),
  );
  const params = { format: 'metadata', metadataHeaders: MESSAGE_HEADERS };
  const drafts = await Promise.all(
    (list.drafts ?? []).map(({ id }) =>
      gmailGet<GmailDraft>(deps, ref, gmailUrl(`drafts/${id}`, params)),
    ),
  );
  return { account: ref.alias, drafts: drafts.map(draftSummary) };
}

/** E-mail do rascunho: resposta ao original (se pedido) ou e-mail novo com os destinatários dados. */
export function prepareDraftEmail(
  deps: OwnerDeps,
  ref: AccountRef,
  args: DraftArgs,
): Promise<PreparedEmail> {
  if (args.replyToMessageId === null) return Promise.resolve(composeEmail(args));
  return prepareReply(deps, ref, {
    messageId: args.replyToMessageId,
    body: args.body,
    replyAll: args.replyAll,
  });
}

/** Ids devolvidos por uma operação de rascunho. */
export function draftIds(draft: GmailDraft): Record<string, unknown> {
  return {
    draft_id: draft.id || null,
    message_id: draft.message?.id ?? null,
    thread_id: draft.message?.threadId ?? null,
  };
}

/** Cria um rascunho com o e-mail pronto. */
export async function createDraft(
  deps: OwnerDeps,
  ref: AccountRef,
  prepared: PreparedEmail,
): Promise<Record<string, unknown>> {
  const draft = await gmailWrite<GmailDraft>(deps, ref, {
    url: gmailUrl('drafts'),
    method: 'POST',
    body: { message: gmailMessageResource(prepared) },
  });
  return { account: ref.alias, ...draftIds(draft) };
}

/** Substitui todo o conteúdo de um rascunho pelo e-mail pronto. */
export async function updateDraft(
  deps: OwnerDeps,
  ref: AccountRef,
  change: { readonly draftId: string; readonly prepared: PreparedEmail },
): Promise<Record<string, unknown>> {
  const draft = await gmailWrite<GmailDraft>(deps, ref, {
    url: gmailUrl(`drafts/${change.draftId}`),
    method: 'PUT',
    body: { id: change.draftId, message: gmailMessageResource(change.prepared) },
  });
  return { account: ref.alias, ...draftIds(draft) };
}

/** Envia um rascunho existente e devolve os ids da mensagem enviada. */
export async function sendDraft(
  deps: OwnerDeps,
  ref: AccountRef,
  draftId: string,
): Promise<Record<string, unknown>> {
  const sent = await gmailWrite<GmailMessage>(deps, ref, {
    url: gmailUrl('drafts/send'),
    method: 'POST',
    body: { id: draftId },
  });
  return sentResult(ref.alias, sent);
}

/** Apaga um rascunho (só o rascunho; mensagens enviadas não são tocadas). */
export async function deleteDraft(
  deps: OwnerDeps,
  ref: AccountRef,
  draftId: string,
): Promise<Record<string, unknown>> {
  await gmailWrite(deps, ref, { url: gmailUrl(`drafts/${draftId}`), method: 'DELETE' });
  return { account: ref.alias, deleted_draft: draftId };
}
