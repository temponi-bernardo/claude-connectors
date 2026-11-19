/**
 * Canvas inbox tools: find people, read conversations and, with writing on for the user, send and reply (with
 * attachments).
 * Sending only accepts numeric user IDs (never `course_X` or group codes), so a message cannot reach a whole
 * course by accident.
 */
import { z } from 'zod';
import { READ_ONLY_HINTS, SEND_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasConversation, CanvasRecipient, Id } from './canvas-types.js';
import type { CanvasClient } from './client.js';
import type { CanvasContext } from './context.js';
import type { View } from './format.js';
import * as inbox from './inbox.js';
import {
  ATTACHMENTS_LIMIT_TEXT,
  attachmentIds,
  attachmentSummary,
  MAX_MESSAGE_ATTACHMENTS,
  prepareAttachments,
  uploadMessageAttachments,
} from './message-attachments.js';
import { FILE_FIELDS } from './tools-write.js';
import type { FileSubmissionArgs } from './upload.js';

/** Maximum recipients of one message sent by the connector. */
export const MAX_MESSAGE_RECIPIENTS = 20;

const id = z.union([z.string(), z.number()]);
const userId = z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]);
const courseId = id.describe('Course ID (see list_courses)');
const conversationId = id.describe('Conversation ID (see list_conversations)');

/** Inbox read tools (always registered). */
export const CANVAS_INBOX_READ_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'find_recipients',
    description:
      'Find people the user can message in the Canvas inbox (teachers, TAs, classmates) by name. Returns the user ID that send_message needs.',
    shape: {
      search: z.string().min(2).describe('Part of the person name'),
      course_id: courseId.optional().describe('Only people of this course'),
    },
    annotations: toolAnnotations('Find recipients', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const context = args.course_id === undefined ? undefined : `course_${String(args.course_id)}`;
      const params = { search: args.search, type: 'user', context };
      const found = await client.getAll<CanvasRecipient>('/search/recipients', params, 50);
      return found.map(inbox.toRecipient);
    },
  }),
  defineTool({
    name: 'list_conversations',
    description: 'List the Canvas inbox conversations (messages), newest first.',
    shape: {
      scope: z.enum(['inbox', 'unread', 'starred', 'sent', 'archived']).optional(),
      limit: z.number().int().min(1).max(100).optional().describe('Default 20'),
    },
    annotations: toolAnnotations('List conversations', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const params = { scope: args.scope ?? 'inbox' };
      const list = await client.getAll<CanvasConversation>(
        '/conversations',
        params,
        args.limit ?? 20,
      );
      return list.map(inbox.toConversationSummary);
    },
  }),
  defineTool({
    name: 'get_conversation',
    description:
      'Read a Canvas inbox conversation with all its messages (does not mark it as read).',
    shape: { conversation_id: conversationId },
    annotations: toolAnnotations('Get conversation', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/conversations/${String(args.conversation_id)}`;
      const c = await client.get<CanvasConversation>(path, { auto_mark_as_read: false });
      return inbox.toConversationDetail(c);
    },
  }),
];

/** One attachment of a message: the file inside the call (text, or base64 for binaries such as .zip or .pdf). */
const attachment = z.object(FILE_FIELDS);
const attachments = z
  .array(attachment)
  .max(MAX_MESSAGE_ATTACHMENTS)
  .optional()
  .describe(`Files to attach, ${ATTACHMENTS_LIMIT_TEXT}; binaries in base64`);

/** Arguments of `send_message` after validation. */
export interface SendMessageArgs {
  readonly recipient_ids: readonly Id[];
  readonly subject: string;
  readonly body: string;
  readonly course_id?: Id | undefined;
  readonly attachments?: readonly FileSubmissionArgs[] | undefined;
}

/** Sends a new message: checks and uploads the attachments first, then creates the conversation. */
export async function sendInboxMessage(client: CanvasClient, args: SendMessageArgs): Promise<View> {
  const files = prepareAttachments(args.attachments);
  const uploaded = await uploadMessageAttachments(client, files);
  const payload = inbox.newMessagePayload({
    recipients: args.recipient_ids,
    subject: args.subject,
    body: args.body,
    course_id: args.course_id,
    attachment_ids: attachmentIds(uploaded),
  });
  const created = await client.post<CanvasConversation[]>('/conversations', payload);
  return { ...inbox.sentConversation(created), attachments: attachmentSummary(uploaded) };
}

/** Arguments of `reply_message` after validation. */
export interface ReplyMessageArgs {
  readonly conversation_id: Id;
  readonly body: string;
  readonly attachments?: readonly FileSubmissionArgs[] | undefined;
}

/** Replies in a conversation: checks and uploads the attachments first, then adds the message. */
export async function replyInboxMessage(
  client: CanvasClient,
  args: ReplyMessageArgs,
): Promise<View> {
  const files = prepareAttachments(args.attachments);
  const uploaded = await uploadMessageAttachments(client, files);
  const path = `/conversations/${String(args.conversation_id)}/add_message`;
  const payload = inbox.replyPayload(args.body, attachmentIds(uploaded));
  const reply = await client.post<CanvasConversation>(path, payload);
  return { ...inbox.sentReply(reply), attachments: attachmentSummary(uploaded) };
}

/** Inbox write tools (they refuse with how to turn writing on when it is off for the user). */
export const CANVAS_INBOX_WRITE_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'send_message',
    description: `SENDS a new Canvas inbox message to people (e.g. a teacher), optionally with attachments (${ATTACHMENTS_LIMIT_TEXT}). Get user IDs with find_recipients. Real action, visible to the recipients: show the exact recipients, subject, text and file names and confirm with the user first.`,
    shape: {
      recipient_ids: z.array(userId).min(1).max(MAX_MESSAGE_RECIPIENTS).describe('User IDs'),
      subject: z.string().min(1).max(255),
      body: z.string().min(1).describe('Plain text'),
      course_id: courseId.optional().describe('Course the message is about'),
      attachments,
    },
    annotations: toolAnnotations('Send message', SEND_HINTS),
    run: ({ client }, args) => sendInboxMessage(client, args),
  }),
  defineTool({
    name: 'reply_message',
    description: `SENDS a reply in an existing Canvas inbox conversation, to all its participants, optionally with attachments (${ATTACHMENTS_LIMIT_TEXT}). Real action: show the text and file names and confirm with the user first.`,
    shape: {
      conversation_id: conversationId,
      body: z.string().min(1).describe('Plain text'),
      attachments,
    },
    annotations: toolAnnotations('Reply message', SEND_HINTS),
    run: ({ client }, args) => replyInboxMessage(client, args),
  }),
];
