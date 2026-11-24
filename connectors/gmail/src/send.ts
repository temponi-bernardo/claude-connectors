/**
 * Sends email through the Gmail API: builds new emails from the tool arguments, prepares replies and
 * forwards (with the original attachments) by reading the original message and sends the MIME to
 * `messages/send`. Every write goes through `gmailWrite`, which requires the account `gmail.modify` scope.
 */
import type { AccountRef } from './accounts.js';
import { downloadAttachment } from './attachments.js';
import { forwardEmail, replyEmail, type PreparedEmail } from './compose.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl, gmailWrite } from './gmail-api.js';
import { randomToken } from '../../../src/remote/worker-kit.js';
import { messageAttachments, type GmailMessage } from './message-format.js';
import {
  buildMimeMessage,
  parseRecipients,
  toRawMessage,
  type MailAttachment,
  type OutgoingEmail,
} from './mime.js';

/** Arguments of a new email, as the tools receive them. */
export interface ComposeArgs {
  readonly to: readonly string[];
  readonly cc: readonly string[];
  readonly bcc: readonly string[];
  readonly subject: string;
  readonly body: string;
}

/** Reply request: the original message, the new text and whether to reply all. */
export interface ReplyRequest {
  readonly messageId: string;
  readonly body: string;
  readonly replyAll: boolean;
}

/** Forward request: the original message, recipients and the optional note. */
export interface ForwardRequest {
  readonly messageId: string;
  readonly to: readonly string[];
  readonly cc: readonly string[];
  readonly bcc: readonly string[];
  readonly note: string;
}

/** Maximum recipients (To + Cc + Bcc) in an email. */
export const MAX_RECIPIENTS = 100;

/** Largest attachment total in a forward (Gmail accepts 25 MB per email, base64 included). */
export const MAX_FORWARD_BYTES = 18 * 1024 * 1024;

/** Throws if the email has no recipient or exceeds the limit. */
export function checkRecipientLimit(email: OutgoingEmail): void {
  const total = email.to.length + email.cc.length + email.bcc.length;
  if (email.to.length === 0) throw new Error('Give at least one recipient in "to".');
  if (total > MAX_RECIPIENTS) {
    throw new Error(`Use at most ${MAX_RECIPIENTS} recipients per email (To, Cc and Bcc).`);
  }
}

/** New email (no thread) from the arguments; throws for invalid addresses. */
export function composeEmail(args: ComposeArgs): PreparedEmail {
  const email: OutgoingEmail = {
    to: parseRecipients(args.to, 'to'),
    cc: parseRecipients(args.cc, 'cc'),
    bcc: parseRecipients(args.bcc, 'bcc'),
    subject: args.subject,
    body: args.body,
    inReplyTo: null,
    references: null,
    attachments: [],
  };
  checkRecipientLimit(email);
  return { email, threadId: null };
}

/** Random MIME boundary (`=_` never appears in base64, so it cannot collide with the content). */
export function mimeBoundary(): string {
  return `=_part_${randomToken(18)}`;
}

/** Message in the Gmail API format: base64url `raw` and the `threadId` when keeping the thread. */
export function gmailMessageResource(prepared: PreparedEmail): { raw: string; threadId?: string } {
  const raw = toRawMessage(buildMimeMessage(prepared.email, mimeBoundary()));
  return prepared.threadId ? { raw, threadId: prepared.threadId } : { raw };
}

/** Reads a whole message (`full` format), to reply or forward. */
export function fetchFullMessage(
  deps: OwnerDeps,
  ref: AccountRef,
  messageId: string,
): Promise<GmailMessage> {
  return gmailGet<GmailMessage>(deps, ref, gmailUrl(`messages/${messageId}`, { format: 'full' }));
}

/** Ready reply to the message: reads the original and works out recipients, subject and thread. */
export async function prepareReply(
  deps: OwnerDeps,
  ref: AccountRef,
  request: ReplyRequest,
): Promise<PreparedEmail> {
  const message = await fetchFullMessage(deps, ref, request.messageId);
  const options = { body: request.body, replyAll: request.replyAll, selfEmail: ref.account.email };
  const prepared = replyEmail(message, options);
  checkRecipientLimit(prepared.email);
  return prepared;
}

/** Downloads the message attachments to forward; refuses if the total exceeds `MAX_FORWARD_BYTES`. */
export async function forwardAttachments(
  deps: OwnerDeps,
  ref: AccountRef,
  message: GmailMessage,
): Promise<MailAttachment[]> {
  const infos = messageAttachments(message.payload);
  const total = infos.reduce((sum, info) => sum + info.size, 0);
  if (total > MAX_FORWARD_BYTES) {
    const mb = (total / 1024 / 1024).toFixed(1);
    throw new Error(`The attachments add up to ${mb} MB, above the 18 MB forwarding limit.`);
  }
  return Promise.all(
    infos.map(async (info) => {
      const ids = { messageId: message.id, attachmentId: info.attachment_id };
      const { bytes } = await downloadAttachment(deps, ref, ids);
      return { filename: info.filename, mimeType: info.mime_type, data: bytes };
    }),
  );
}

/** Ready forward: validates the recipients, reads the original and downloads its attachments. */
export async function prepareForward(
  deps: OwnerDeps,
  ref: AccountRef,
  request: ForwardRequest,
): Promise<PreparedEmail> {
  const { email } = composeEmail({ ...request, subject: '', body: '' });
  const message = await fetchFullMessage(deps, ref, request.messageId);
  const attachments = await forwardAttachments(deps, ref, message);
  return forwardEmail(message, { ...email, note: request.note, attachments });
}

/** Sends the ready email from the account and returns the sent message ids. */
export async function sendPrepared(
  deps: OwnerDeps,
  ref: AccountRef,
  prepared: PreparedEmail,
): Promise<Record<string, unknown>> {
  const sent = await gmailWrite<{ id?: string; threadId?: string }>(deps, ref, {
    url: gmailUrl('messages/send'),
    method: 'POST',
    body: gmailMessageResource(prepared),
  });
  return sentResult(ref.alias, sent);
}

/** Send result: account, `sent` and the sent message ids (null if Gmail does not return them). */
export function sentResult(
  alias: string,
  sent: { readonly id?: string; readonly threadId?: string },
): Record<string, unknown> {
  return {
    account: alias,
    sent: true,
    message_id: sent.id ?? null,
    thread_id: sent.threadId ?? null,
  };
}
