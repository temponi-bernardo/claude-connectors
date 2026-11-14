/**
 * Gmail drafts: list, create (new or as a reply, in the same thread), replace the content, send and delete.
 * Writes go through `gmailWrite` (`gmail.modify` scope).
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

/** Gmail API draft. */
export interface GmailDraft {
  readonly id: string;
  readonly message?: GmailMessage;
}

/** Draft arguments: a new email, or a reply to `replyToMessageId` (recipients from the original). */
export interface DraftArgs extends ComposeArgs {
  readonly replyToMessageId: string | null;
  readonly replyAll: boolean;
}

/** Draft summary: ids, recipients, subject, date and snippet. */
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

/** Lists the account drafts (up to `maxResults`) with a summary of each. */
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

/** Draft email: a reply to the original (if asked) or a new email with the given recipients. */
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

/** Ids returned by a draft operation. */
export function draftIds(draft: GmailDraft): Record<string, unknown> {
  return {
    draft_id: draft.id || null,
    message_id: draft.message?.id ?? null,
    thread_id: draft.message?.threadId ?? null,
  };
}

/** Creates a draft with the ready email. */
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

/** Replaces the whole content of a draft with the ready email. */
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

/** Sends an existing draft and returns the sent message ids. */
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

/** Deletes a draft (only the draft; sent messages are not touched). */
export async function deleteDraft(
  deps: OwnerDeps,
  ref: AccountRef,
  draftId: string,
): Promise<Record<string, unknown>> {
  await gmailWrite(deps, ref, { url: gmailUrl(`drafts/${draftId}`), method: 'DELETE' });
  return { account: ref.alias, deleted_draft: draftId };
}
