import { describe, expect, it } from 'vitest';
import type { ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { fakeContext, type Routes } from './fixtures/fake-context.js';
import { CANVAS_INBOX_READ_TOOLS, CANVAS_INBOX_WRITE_TOOLS } from './tools-inbox.js';

const ALL = [...CANVAS_INBOX_READ_TOOLS, ...CANVAS_INBOX_WRITE_TOOLS];

function inboxTool(name: string): ToolSpec<CanvasContext> {
  const spec = ALL.find((t) => t.name === name);
  if (!spec) throw new Error(`unknown tool: ${name}`);
  return spec;
}

async function runInbox(name: string, args: unknown, routes: Routes = {}) {
  const fake = fakeContext(routes);
  return { result: (await inboxTool(name).run(fake.ctx, args)) as never, ...fake };
}

describe('inbox read tools', () => {
  it('find_recipients searches users, narrowed to a course when given', async () => {
    const routes = { '/search/recipients': [{ id: 5, full_name: 'Prof X' }] };
    const { result, getAll } = await runInbox('find_recipients', { search: 'prof' }, routes);
    expect(result).toEqual([{ id: 5, name: 'Prof X', roles: [] }]);
    expect(getAll).toHaveBeenCalledWith(
      '/search/recipients',
      { search: 'prof', type: 'user', context: undefined },
      50,
    );
    const course = await runInbox('find_recipients', { search: 'prof', course_id: 3 }, routes);
    expect(course.getAll.mock.calls[0]![1]).toMatchObject({ context: 'course_3' });
  });

  it('list_conversations uses the inbox scope and 20 items by default', async () => {
    const routes = { '/conversations': [{ id: 1, subject: 'S' }] };
    const { result, getAll } = await runInbox('list_conversations', {}, routes);
    expect(result).toMatchObject([{ id: 1, subject: 'S' }]);
    expect(getAll).toHaveBeenCalledWith('/conversations', { scope: 'inbox' }, 20);
    const sent = await runInbox('list_conversations', { scope: 'sent', limit: 5 }, routes);
    expect(sent.getAll).toHaveBeenCalledWith('/conversations', { scope: 'sent' }, 5);
  });

  it('get_conversation reads it without marking it as read', async () => {
    const routes = { '/conversations/7': { id: 7, messages: [{ id: 1, body: 'Hi' }] } };
    const { result, get } = await runInbox('get_conversation', { conversation_id: 7 }, routes);
    expect(get).toHaveBeenCalledWith('/conversations/7', { auto_mark_as_read: false });
    expect(result).toMatchObject({ id: 7, messages: [{ text: 'Hi' }] });
  });
});

describe('inbox write tools', () => {
  it('send_message creates a new conversation with the users', async () => {
    const routes = { '/conversations': [{ id: 3, subject: 'Hi', last_message_at: 'd' }] };
    const args = { recipient_ids: [5], subject: 'Hi', body: 'Text', course_id: 9 };
    const { result, post } = await runInbox('send_message', args, routes);
    expect(post).toHaveBeenCalledWith('/conversations', {
      recipients: ['5'],
      subject: 'Hi',
      body: 'Text',
      force_new: true,
      group_conversation: true,
      context_code: 'course_9',
    });
    expect(result).toEqual({ ok: true, conversation_id: 3, subject: 'Hi', sent_at: 'd' });
  });

  it('send_message accepts only user ids, up to 20, with a subject and a body', async () => {
    const base = { subject: 'Hi', body: 'Text' };
    for (const recipient_ids of [
      [],
      ['course_1'],
      [-1],
      Array.from({ length: 21 }, (_, i) => i + 1),
    ])
      await expect(runInbox('send_message', { ...base, recipient_ids })).rejects.toThrow();
    await expect(
      runInbox('send_message', { recipient_ids: [5], subject: '', body: 'x' }),
    ).rejects.toThrow();
    await expect(
      runInbox('send_message', { recipient_ids: [5], subject: 'x', body: '' }),
    ).rejects.toThrow();
  });

  it('reply_to_conversation adds the message to the conversation', async () => {
    const path = '/conversations/7/add_message';
    const routes = { [path]: { id: 7, messages: [{ id: 12, created_at: 'd' }] } };
    const { result, post } = await runInbox(
      'reply_to_conversation',
      { conversation_id: 7, body: 'Thanks' },
      routes,
    );
    expect(post).toHaveBeenCalledWith(path, { body: 'Thanks' });
    expect(result).toEqual({ ok: true, conversation_id: 7, message_id: 12, sent_at: 'd' });
  });

  it('reply_to_conversation tolerates a response without messages', async () => {
    const path = '/conversations/7/add_message';
    const { result } = await runInbox(
      'reply_to_conversation',
      { conversation_id: 7, body: 'Thanks' },
      { [path]: { id: 7 } },
    );
    expect(result).toEqual({ ok: true, conversation_id: 7, message_id: null, sent_at: null });
  });
});
