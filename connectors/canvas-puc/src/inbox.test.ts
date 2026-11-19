import { describe, expect, it } from 'vitest';
import type { CanvasConversation } from './canvas-types.js';
import {
  attachmentIdsField,
  replyPayload,
  conversationNames,
  newMessagePayload,
  participantName,
  sentConversation,
  sentReply,
  toConversationDetail,
  toConversationMessage,
  toConversationSummary,
  toRecipient,
} from './inbox.js';

const conversation: CanvasConversation = {
  id: 7,
  subject: 'Exam',
  workflow_state: 'read',
  last_message: '<p>See you</p>',
  last_message_at: '2026-11-01T10:00:00Z',
  message_count: 2,
  context_name: 'Physics',
  participants: [
    { id: 1, name: 'Ana', full_name: 'Ana Souza' },
    { id: 2, name: 'Prof' },
  ],
  messages: [
    { id: 11, author_id: 2, created_at: 'd2', body: 'See you', attachments: [] },
    {
      id: 10,
      author_id: 1,
      created_at: 'd1',
      body: 'Hello',
      attachments: [{ display_name: 'a.pdf', url: 'u' }],
    },
  ],
};

describe('toRecipient', () => {
  it('keeps the id, the full name and the distinct roles of the common courses', () => {
    expect(
      toRecipient({
        id: 5,
        name: 'Prof',
        full_name: 'Prof X',
        common_courses: { '1': ['TeacherEnrollment'], '2': ['TeacherEnrollment', 'TaEnrollment'] },
      }),
    ).toEqual({ id: 5, name: 'Prof X', roles: ['TeacherEnrollment', 'TaEnrollment'] });
  });

  it('falls back to the short name and no roles', () => {
    expect(toRecipient({ id: 6, name: 'Bob' })).toEqual({ id: 6, name: 'Bob', roles: [] });
  });
});

describe('conversationNames', () => {
  it('maps participant ids to the full name, or the name', () => {
    const names = conversationNames(conversation);
    expect(names.get('1')).toBe('Ana Souza');
    expect(names.get('2')).toBe('Prof');
    expect(conversationNames({ id: 1 }).size).toBe(0);
  });
});

describe('toConversationSummary', () => {
  it('maps the listing fields with the participant names and a text preview', () => {
    expect(toConversationSummary(conversation)).toEqual({
      id: 7,
      subject: 'Exam',
      course: 'Physics',
      state: 'read',
      participants: ['Ana Souza', 'Prof'],
      message_count: 2,
      last_message_at: '2026-11-01T10:00:00Z',
      last_message: 'See you',
    });
  });

  it('tolerates a conversation without participants', () => {
    expect(toConversationSummary({ id: 1 })).toMatchObject({ participants: [], last_message: '' });
  });
});

describe('toConversationMessage', () => {
  it('resolves the author and lists the attachment names', () => {
    const names = conversationNames(conversation);
    expect(toConversationMessage(conversation.messages![1]!, names)).toEqual({
      id: 10,
      author: 'Ana Souza',
      date: 'd1',
      text: 'Hello',
      attachments: [{ name: 'a.pdf', url: 'u' }],
    });
    expect(toConversationMessage({ id: 3, author_id: 99 }, names)).toMatchObject({
      author: undefined,
      text: '',
      attachments: [],
    });
  });
});

describe('toConversationDetail', () => {
  it('returns the messages oldest first', () => {
    const detail = toConversationDetail(conversation);
    expect(detail).toMatchObject({ id: 7, subject: 'Exam', course: 'Physics' });
    expect((detail.messages as { id: number }[]).map((m) => m.id)).toEqual([10, 11]);
  });

  it('tolerates a conversation without messages', () => {
    expect(toConversationDetail({ id: 1 })).toMatchObject({ messages: [] });
  });
});

describe('newMessagePayload', () => {
  it('builds one new group conversation for the given users', () => {
    expect(newMessagePayload({ recipients: [5, '6'], subject: 'Hi', body: 'Text' })).toEqual({
      recipients: ['5', '6'],
      subject: 'Hi',
      body: 'Text',
      force_new: true,
      group_conversation: true,
    });
  });

  it('adds the course context when given', () => {
    expect(
      newMessagePayload({ recipients: [5], subject: 'Hi', body: 'Text', course_id: 9 }),
    ).toMatchObject({ context_code: 'course_9' });
  });
});

describe('sentConversation', () => {
  it('reports the created conversation', () => {
    expect(sentConversation([{ id: 3, subject: 'Hi', last_message_at: 'd' }])).toEqual({
      ok: true,
      conversation_id: 3,
      subject: 'Hi',
      sent_at: 'd',
    });
  });

  it('reports a queued send when Canvas returns no conversation', () => {
    expect(sentConversation([])).toEqual({ ok: true, conversation_id: null, queued: true });
  });
});

describe('sentReply', () => {
  it('reports the newest message of the conversation', () => {
    expect(sentReply({ id: 7, messages: [{ id: 12, created_at: 'd' }, { id: 1 }] })).toEqual({
      ok: true,
      conversation_id: 7,
      message_id: 12,
      sent_at: 'd',
    });
    expect(sentReply({ id: 7 })).toMatchObject({ message_id: null, sent_at: null });
  });
});

describe('participantName', () => {
  it('prefers the full name, then the name', () => {
    expect(participantName({ id: 1, name: 'A', full_name: 'A B' })).toBe('A B');
    expect(participantName({ id: 1, name: 'A' })).toBe('A');
    expect(participantName({ id: 1 })).toBeUndefined();
  });
});

describe('attachmentIdsField and replyPayload', () => {
  it('adds attachment_ids as strings only when there are attachments', () => {
    expect(attachmentIdsField(undefined)).toEqual({});
    expect(attachmentIdsField([])).toEqual({});
    expect(attachmentIdsField([1, '2'])).toEqual({ attachment_ids: ['1', '2'] });
    expect(replyPayload('Hi', [3])).toEqual({ body: 'Hi', attachment_ids: ['3'] });
    expect(replyPayload('Hi', undefined)).toEqual({ body: 'Hi' });
  });

  it('newMessagePayload carries the attachment ids', () => {
    const msg = { recipients: [5], subject: 'S', body: 'B', attachment_ids: [7] };
    expect(newMessagePayload(msg)).toMatchObject({ attachment_ids: ['7'] });
  });
});
