/**
 * Ferramentas MCP de envio: e-mail novo, responder, responder a todos e encaminhar (com os anexos
 * originais). Todas são marcadas como destrutivas (`destructiveHint`) para o Claude pedir confirmação, e a
 * conta precisa do escopo `gmail.modify` (contas antigas recebem o pedido de novo vínculo).
 */
import { z } from 'zod';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import {
  composeEmail,
  MAX_RECIPIENTS,
  prepareForward,
  prepareReply,
  sendPrepared,
} from './send.js';
import {
  CONFIRM_HINT,
  GMAIL_ID,
  ONE_ACCOUNT,
  resolveWritableAccount,
  SEND_HINTS,
} from './tools.js';

/** Maior corpo de e-mail aceito, em caracteres. */
export const MAX_BODY_CHARS = 100_000;

/** Lista de destinatários (`Nome <e-mail>` ou `e-mail`; um item pode ter vários separados por vírgula). */
export const RECIPIENTS = z
  .array(z.string().min(3).max(1000))
  .max(MAX_RECIPIENTS)
  .describe('Addresses like "Name <a@b.com>" or "a@b.com".');

/** Corpo em texto plano. */
export const BODY = z.string().max(MAX_BODY_CHARS).describe('Plain-text body.');

/** Assunto (até 998 caracteres, o limite de uma linha de cabeçalho). */
export const SUBJECT = z.string().max(998);

/** `send_email`: e-mail novo em texto plano. */
export const sendEmailTool = defineTool({
  name: 'send_email',
  description: `Send a new plain-text email from one linked account. ${CONFIRM_HINT}`,
  shape: {
    account: ONE_ACCOUNT,
    to: RECIPIENTS.min(1),
    cc: RECIPIENTS.default([]),
    bcc: RECIPIENTS.default([]),
    subject: SUBJECT,
    body: BODY,
  },
  annotations: SEND_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    return sendPrepared(deps, ref, composeEmail(args));
  },
});

/** Variante de resposta: nome da ferramenta, se é para todos e a descrição. */
export interface ReplyToolOptions {
  readonly name: string;
  readonly replyAll: boolean;
  readonly description: string;
}

/** Monta a ferramenta de resposta (ao remetente ou a todos), que cita o original e mantém a conversa. */
export function replyTool(options: ReplyToolOptions): ToolSpec<OwnerDeps> {
  return defineTool({
    name: options.name,
    description: `${options.description} Keeps the thread (Re:, In-Reply-To, References) and quotes the original. ${CONFIRM_HINT}`,
    shape: {
      account: ONE_ACCOUNT,
      message_id: GMAIL_ID.describe('Message id to reply to (from get_thread).'),
      body: BODY,
    },
    annotations: SEND_HINTS,
    run: async (deps: OwnerDeps, args) => {
      const ref = await resolveWritableAccount(deps, args.account);
      const request = { messageId: args.message_id, body: args.body, replyAll: options.replyAll };
      return sendPrepared(deps, ref, await prepareReply(deps, ref, request));
    },
  });
}

/** `reply_email`: responde ao remetente (ou ao `Reply-To`). */
export const replyEmailTool = replyTool({
  name: 'reply_email',
  replyAll: false,
  description: 'Reply to the sender of a message.',
});

/** `reply_all_email`: responde ao remetente e a todos em To e Cc, menos a própria conta. */
export const replyAllEmailTool = replyTool({
  name: 'reply_all_email',
  replyAll: true,
  description: 'Reply to the sender and everyone in To and Cc (except this account).',
});

/** `forward_email`: encaminha a mensagem com os anexos originais e uma nota opcional. */
export const forwardEmailTool = defineTool({
  name: 'forward_email',
  description: `Forward a message with its original attachments (up to 18 MB) and an optional note on top. ${CONFIRM_HINT}`,
  shape: {
    account: ONE_ACCOUNT,
    message_id: GMAIL_ID.describe('Message id to forward.'),
    to: RECIPIENTS.min(1),
    cc: RECIPIENTS.default([]),
    bcc: RECIPIENTS.default([]),
    note: BODY.default('').describe('Optional plain-text note above the forwarded message.'),
  },
  annotations: SEND_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    const request = { ...args, messageId: args.message_id };
    return sendPrepared(deps, ref, await prepareForward(deps, ref, request));
  },
});
