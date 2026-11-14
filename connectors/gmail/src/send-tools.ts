/**
 * Sending MCP tools: new email, reply, reply all and forward (with the original attachments). All are
 * annotated as destructive (`destructiveHint`) so Claude asks for confirmation, and the account needs the
 * `gmail.modify` scope (old accounts get the relinking request).
 */
import { z } from 'zod';
import { SEND_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import {
  composeEmail,
  MAX_RECIPIENTS,
  prepareForward,
  prepareReply,
  sendPrepared,
} from './send.js';
import { CONFIRM_HINT, GMAIL_ID, ONE_ACCOUNT, resolveWritableAccount } from './tools.js';

/** Longest email body accepted, in characters. */
export const MAX_BODY_CHARS = 100_000;

/** Recipient list (`Name <email>` or `email`; one item may hold several, comma-separated). */
export const RECIPIENTS = z
  .array(z.string().min(3).max(1000))
  .max(MAX_RECIPIENTS)
  .describe('Addresses like "Name <a@b.com>" or "a@b.com".');

/** Plain-text body. */
export const BODY = z.string().max(MAX_BODY_CHARS).describe('Plain-text body.');

/** Subject (up to 998 characters, the limit of a header line). */
export const SUBJECT = z.string().max(998);

/** `send_email`: a new plain-text email. */
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
  annotations: toolAnnotations('Send email', SEND_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    return sendPrepared(deps, ref, composeEmail(args));
  },
});

/** Reply variant: tool name and title, whether to reply all and the description. */
export interface ReplyToolOptions {
  readonly name: string;
  readonly title: string;
  readonly replyAll: boolean;
  readonly description: string;
}

/** Builds the reply tool (to the sender or to all), which quotes the original and keeps the thread. */
export function replyTool(options: ReplyToolOptions): ToolSpec<OwnerDeps> {
  return defineTool({
    name: options.name,
    description: `${options.description} Keeps the thread (Re:, In-Reply-To, References) and quotes the original. ${CONFIRM_HINT}`,
    shape: {
      account: ONE_ACCOUNT,
      message_id: GMAIL_ID.describe('Message id to reply to (from get_thread).'),
      body: BODY,
    },
    annotations: toolAnnotations(options.title, SEND_HINTS),
    run: async (deps: OwnerDeps, args) => {
      const ref = await resolveWritableAccount(deps, args.account);
      const request = { messageId: args.message_id, body: args.body, replyAll: options.replyAll };
      return sendPrepared(deps, ref, await prepareReply(deps, ref, request));
    },
  });
}

/** `reply_email`: replies to the sender (or to `Reply-To`). */
export const replyEmailTool = replyTool({
  name: 'reply_email',
  title: 'Reply to email',
  replyAll: false,
  description: 'Reply to the sender of a message.',
});

/** `reply_all_email`: replies to the sender and everyone in To and Cc, except the account itself. */
export const replyAllEmailTool = replyTool({
  name: 'reply_all_email',
  title: 'Reply to all',
  replyAll: true,
  description: 'Reply to the sender and everyone in To and Cc (except this account).',
});

/** `forward_email`: forwards the message with its original attachments and an optional note. */
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
  annotations: toolAnnotations('Forward email', SEND_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    const request = { ...args, messageId: args.message_id };
    return sendPrepared(deps, ref, await prepareForward(deps, ref, request));
  },
});
