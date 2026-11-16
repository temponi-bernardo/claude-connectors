/**
 * Canvas inbox (conversations): pure mapping of the API responses and of the send payload.
 */
import { htmlToText } from '../../../src/core/html.js';
import type {
  CanvasConversation,
  CanvasConversationMessage,
  CanvasConversationParticipant,
  CanvasRecipient,
  Id,
} from './canvas-types.js';
import type { View } from './format.js';

/** Maximum length of the last-message preview in a conversation listing. */
export const CONVERSATION_PREVIEW_LENGTH = 300;

/** Arguments of a new inbox message. */
export interface NewMessage {
  readonly recipients: readonly Id[];
  readonly subject: string;
  readonly body: string;
  readonly course_id?: Id | undefined;
}

/** Person the user can message, with the distinct roles they have in shared courses. */
export function toRecipient(r: CanvasRecipient): View {
  const roles = new Set(Object.values(r.common_courses ?? {}).flat());
  return { id: r.id, name: r.full_name ?? r.name, roles: [...roles] };
}

/** Display name of a conversation participant. */
export function participantName(p: CanvasConversationParticipant): string | undefined {
  return p.full_name ?? p.name;
}

/** Map from participant id to display name. */
export function conversationNames(c: CanvasConversation): Map<string, string | undefined> {
  return new Map((c.participants ?? []).map((p) => [String(p.id), participantName(p)]));
}

/** Conversation in a listing, with a short preview of the last message. */
export function toConversationSummary(c: CanvasConversation): View {
  return {
    id: c.id,
    subject: c.subject,
    course: c.context_name,
    state: c.workflow_state,
    participants: (c.participants ?? []).map(participantName),
    message_count: c.message_count,
    last_message_at: c.last_message_at,
    last_message: htmlToText(c.last_message).slice(0, CONVERSATION_PREVIEW_LENGTH),
  };
}

/** One inbox message with its author name and attachment links. */
export function toConversationMessage(
  m: CanvasConversationMessage,
  names: ReadonlyMap<string, string | undefined>,
): View {
  return {
    id: m.id,
    author: names.get(String(m.author_id)),
    date: m.created_at,
    text: htmlToText(m.body),
    attachments: (m.attachments ?? []).map((a) => ({ name: a.display_name, url: a.url })),
  };
}

/** Full conversation with its messages oldest first (Canvas returns newest first). */
export function toConversationDetail(c: CanvasConversation): View {
  const names = conversationNames(c);
  const messages = [...(c.messages ?? [])].reverse();
  return {
    ...toConversationSummary(c),
    messages: messages.map((m) => toConversationMessage(m, names)),
  };
}

/** Body of `POST /conversations`: one new conversation shared by the given users. */
export function newMessagePayload(msg: NewMessage): Readonly<Record<string, unknown>> {
  return {
    recipients: msg.recipients.map(String),
    subject: msg.subject,
    body: msg.body,
    force_new: true,
    group_conversation: true,
    ...(msg.course_id !== undefined ? { context_code: `course_${String(msg.course_id)}` } : {}),
  };
}

/** Result of a send: the created conversation, or a queued send when Canvas returns none. */
export function sentConversation(created: readonly CanvasConversation[]): View {
  const c = created[0];
  if (!c) return { ok: true, conversation_id: null, queued: true };
  return { ok: true, conversation_id: c.id, subject: c.subject, sent_at: c.last_message_at };
}

/** Result of a reply: the newest message of the conversation Canvas returns. */
export function sentReply(c: CanvasConversation): View {
  const last = c.messages?.[0];
  return {
    ok: true,
    conversation_id: c.id,
    message_id: last?.id ?? null,
    sent_at: last?.created_at ?? null,
  };
}
