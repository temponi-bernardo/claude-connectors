/**
 * Canvas inbox tools: find people, read conversations and, with writes enabled, send and reply.
 * Sending only accepts numeric user IDs (never `course_X` or group codes), so a message cannot reach a whole
 * course by accident.
 */
import { z } from 'zod';
import { READ_ONLY_HINTS, SEND_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasConversation, CanvasRecipient } from './canvas-types.js';
import type { CanvasContext } from './context.js';
import * as inbox from './inbox.js';

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

/** Inbox write tools (only with `CANVAS_ALLOW_WRITE`). */
export const CANVAS_INBOX_WRITE_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'send_message',
    description:
      'SENDS a new Canvas inbox message to people (e.g. a teacher). Get user IDs with find_recipients. Real action, visible to the recipients: show the exact recipients, subject and text and confirm with the user first.',
    shape: {
      recipient_ids: z.array(userId).min(1).max(MAX_MESSAGE_RECIPIENTS).describe('User IDs'),
      subject: z.string().min(1).max(255),
      body: z.string().min(1).describe('Plain text'),
      course_id: courseId.optional().describe('Course the message is about'),
    },
    annotations: toolAnnotations('Send message', SEND_HINTS),
    run: async ({ client }, args) => {
      const payload = inbox.newMessagePayload({
        recipients: args.recipient_ids,
        subject: args.subject,
        body: args.body,
        course_id: args.course_id,
      });
      return inbox.sentConversation(
        await client.post<CanvasConversation[]>('/conversations', payload),
      );
    },
  }),
  defineTool({
    name: 'reply_to_conversation',
    description:
      'SENDS a reply in an existing Canvas inbox conversation, to all its participants. Real action: show the text and confirm with the user first.',
    shape: { conversation_id: conversationId, body: z.string().min(1).describe('Plain text') },
    annotations: toolAnnotations('Reply to conversation', SEND_HINTS),
    run: async ({ client }, args) => {
      const path = `/conversations/${String(args.conversation_id)}/add_message`;
      return inbox.sentReply(await client.post<CanvasConversation>(path, { body: args.body }));
    },
  }),
];
