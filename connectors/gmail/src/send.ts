/**
 * Envio de e-mails pela Gmail API: monta e-mails novos a partir dos argumentos das ferramentas, prepara
 * respostas e encaminhamentos (com os anexos originais) lendo a mensagem original e envia o MIME em
 * `messages/send`. Toda escrita passa por `gmailWrite`, que exige o escopo `gmail.modify` da conta.
 */
import type { AccountRef } from './accounts.js';
import { downloadAttachment } from './attachments.js';
import { forwardEmail, replyEmail, type PreparedEmail } from './compose.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl, gmailWrite } from './gmail-api.js';
import { randomToken } from './google-oauth.js';
import { messageAttachments, type GmailMessage } from './message-format.js';
import {
  buildMimeMessage,
  parseRecipients,
  toRawMessage,
  type MailAttachment,
  type OutgoingEmail,
} from './mime.js';

/** Argumentos de um e-mail novo, como as ferramentas recebem. */
export interface ComposeArgs {
  readonly to: readonly string[];
  readonly cc: readonly string[];
  readonly bcc: readonly string[];
  readonly subject: string;
  readonly body: string;
}

/** Pedido de resposta: a mensagem original, o texto novo e se é para todos. */
export interface ReplyRequest {
  readonly messageId: string;
  readonly body: string;
  readonly replyAll: boolean;
}

/** Pedido de encaminhamento: a mensagem original, destinatários e a nota opcional. */
export interface ForwardRequest {
  readonly messageId: string;
  readonly to: readonly string[];
  readonly cc: readonly string[];
  readonly bcc: readonly string[];
  readonly note: string;
}

/** Mais destinatários (To + Cc + Bcc) num e-mail. */
export const MAX_RECIPIENTS = 100;

/** Maior soma de anexos num encaminhamento (o Gmail aceita 25 MB por e-mail, já com o base64). */
export const MAX_FORWARD_BYTES = 18 * 1024 * 1024;

/** Lança erro se o e-mail não tiver destinatário ou passar do limite. */
export function checkRecipientLimit(email: OutgoingEmail): void {
  const total = email.to.length + email.cc.length + email.bcc.length;
  if (email.to.length === 0) throw new Error('Informe ao menos um destinatário em "to".');
  if (total > MAX_RECIPIENTS) {
    throw new Error(`Use no máximo ${MAX_RECIPIENTS} destinatários por e-mail (To, Cc e Bcc).`);
  }
}

/** E-mail novo (sem conversa) a partir dos argumentos; lança erro para endereços inválidos. */
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

/** Fronteira MIME aleatória (`=_` não aparece em base64, então não colide com o conteúdo). */
export function mimeBoundary(): string {
  return `=_part_${randomToken(18)}`;
}

/** Mensagem no formato da Gmail API: `raw` em base64url e o `threadId` quando mantém a conversa. */
export function gmailMessageResource(prepared: PreparedEmail): { raw: string; threadId?: string } {
  const raw = toRawMessage(buildMimeMessage(prepared.email, mimeBoundary()));
  return prepared.threadId ? { raw, threadId: prepared.threadId } : { raw };
}

/** Lê uma mensagem inteira (formato `full`), para responder ou encaminhar. */
export function fetchFullMessage(
  deps: OwnerDeps,
  ref: AccountRef,
  messageId: string,
): Promise<GmailMessage> {
  return gmailGet<GmailMessage>(deps, ref, gmailUrl(`messages/${messageId}`, { format: 'full' }));
}

/** Resposta pronta à mensagem: lê o original e calcula destinatários, assunto e conversa. */
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

/** Baixa os anexos da mensagem para encaminhar; recusa se a soma passar de `MAX_FORWARD_BYTES`. */
export async function forwardAttachments(
  deps: OwnerDeps,
  ref: AccountRef,
  message: GmailMessage,
): Promise<MailAttachment[]> {
  const infos = messageAttachments(message.payload);
  const total = infos.reduce((sum, info) => sum + info.size, 0);
  if (total > MAX_FORWARD_BYTES) {
    const mb = (total / 1024 / 1024).toFixed(1);
    throw new Error(`Os anexos somam ${mb} MB, acima do limite de 18 MB para encaminhar.`);
  }
  return Promise.all(
    infos.map(async (info) => {
      const ids = { messageId: message.id, attachmentId: info.attachment_id };
      const { bytes } = await downloadAttachment(deps, ref, ids);
      return { filename: info.filename, mimeType: info.mime_type, data: bytes };
    }),
  );
}

/** Encaminhamento pronto: valida os destinatários, lê o original e baixa os anexos dele. */
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

/** Envia o e-mail pronto pela conta e devolve os ids da mensagem enviada. */
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

/** Resultado de um envio: conta, `sent` e os ids da mensagem enviada (nulos se o Gmail não devolver). */
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
