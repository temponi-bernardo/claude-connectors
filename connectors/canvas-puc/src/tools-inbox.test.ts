import { describe, expect, it, vi } from 'vitest';
import type { ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { fakeContext, resultParts, type Routes } from './fixtures/fake-context.js';
import {
  CANVAS_INBOX_READ_TOOLS,
  CANVAS_INBOX_WRITE_TOOLS,
  replyInboxMessage,
  sendInboxMessage,
} from './tools-inbox.js';

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
    expect(resultParts(result).rows).toMatchObject([{ id: 1, subject: 'S' }]);
    expect(getAll).toHaveBeenCalledWith('/conversations', { scope: 'inbox' }, 20);
    const sent = await runInbox('list_conversations', { scope: 'sent', limit: 5 }, routes);
    expect(sent.getAll).toHaveBeenCalledWith('/conversations', { scope: 'sent' }, 5);
  });

  it('list_conversations with changed_since keeps only conversations with newer messages', async () => {
    const routes = {
      '/conversations': [
        { id: 1, last_message_at: '2026-11-04T00:00:00Z' },
        { id: 2, last_message_at: '2026-10-04T00:00:00Z' },
      ],
    };
    const args = { changed_since: '2026-11-01T00:00:00-03:00' };
    const { rows, notes } = resultParts(
      (await runInbox('list_conversations', args, routes)).result,
    );
    expect(rows).toEqual([expect.objectContaining({ id: 1 })]);
    expect(notes[0]).toContain('checked_at=');
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
    expect(result).toEqual({
      ok: true,
      conversation_id: 3,
      subject: 'Hi',
      sent_at: 'd',
      attachments: [],
    });
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

  it('send_message without attachments sends no attachment_ids and uploads nothing', async () => {
    const routes = { '/conversations': [{ id: 3 }] };
    const args = { recipient_ids: ['5'], subject: 'Hi', body: 'Text' };
    const { result, post, upload } = await runInbox('send_message', args, routes);
    expect(post.mock.calls[0]![1]).not.toHaveProperty('attachment_ids');
    expect(upload).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: true, conversation_id: 3, attachments: [] });
  });

  it('send_message uploads each attachment to "conversation attachments" and sends their ids', async () => {
    const routes = {
      '/users/self/files': { upload_url: 'https://up.test/1', upload_params: { k: 'v' } },
      'https://up.test/1': { id: 77, display_name: 'atestados.zip', size: 3 },
      '/conversations': [{ id: 3, subject: 'Atestados', last_message_at: 'd' }],
    };
    const zip = { file_name: 'atestados.zip', content: 'UEsD', encoding: 'base64' };
    const args = { recipient_ids: [5], subject: 'Atestados', body: 'Segue', attachments: [zip] };
    const { result, post, upload } = await runInbox('send_message', args, routes);
    expect(post.mock.calls[0]).toEqual([
      '/users/self/files',
      {
        name: 'atestados.zip',
        size: 3,
        content_type: 'application/zip',
        parent_folder_path: 'conversation attachments',
        on_duplicate: 'rename',
      },
    ]);
    const sent = upload.mock.calls[0]![1];
    expect([...sent.bytes]).toEqual([0x50, 0x4b, 0x03]);
    expect(post.mock.calls[1]![1]).toMatchObject({ recipients: ['5'], attachment_ids: ['77'] });
    expect(result).toMatchObject({
      ok: true,
      conversation_id: 3,
      attachments: [{ id: 77, name: 'atestados.zip', size: 3 }],
    });
  });

  it('send_message sends nothing when an attachment upload fails', async () => {
    const routes = {
      '/users/self/files': { upload_url: 'https://up.test/1' },
      'https://up.test/1': new Error('Canvas rejected the file upload (500): boom'),
    };
    const file = { file_name: 'a.pdf', content: 'JVBE', encoding: 'base64' };
    const args = { recipient_ids: [5], subject: 'S', body: 'B', attachments: [file] };
    const fake = fakeContext(routes);
    await expect(inboxTool('send_message').run(fake.ctx, args)).rejects.toThrow(
      'Could not upload attachment "a.pdf" (Canvas rejected the file upload (500): boom). Nothing was sent.',
    );
    expect(fake.post.mock.calls.map((c) => c[0])).toEqual(['/users/self/files']);
  });

  it('send_message refuses a file above the limit before uploading anything', async () => {
    const big = 'A'.repeat(Math.ceil(((5 * 1024 * 1024 + 1) * 4) / 3 / 4) * 4);
    const file = { file_name: 'big.zip', content: big, encoding: 'base64' };
    const ok = { file_name: 'ok.txt', content: 'hi' };
    const args = { recipient_ids: [5], subject: 'S', body: 'B', attachments: [ok, file] };
    const fake = fakeContext({});
    await expect(inboxTool('send_message').run(fake.ctx, args)).rejects.toThrow(
      /Attachment "big\.zip": The file is 5\.0 MB, above the 5 MB limit.*Nothing was sent\./,
    );
    expect(fake.post).not.toHaveBeenCalled();
    expect(fake.upload).not.toHaveBeenCalled();
  });

  it('send_message refuses invalid recipients, more than 5 attachments and bad base64', async () => {
    const fake = fakeContext({});
    const base = { recipient_ids: [5], subject: 'S', body: 'B' };
    const six = Array.from({ length: 6 }, (_, i) => ({
      file_name: `f${String(i)}.txt`,
      content: 'x',
    }));
    const bad = [{ file_name: 'a.zip', content: '%%%', encoding: 'base64' }];
    for (const args of [
      { ...base, recipient_ids: ['abc'] },
      { ...base, recipient_ids: [0] },
      { ...base, attachments: six },
      { ...base, attachments: [{ file_name: ' ', content: 'x' }] },
    ])
      await expect(inboxTool('send_message').run(fake.ctx, args)).rejects.toThrow();
    await expect(
      inboxTool('send_message').run(fake.ctx, { ...base, attachments: bad }),
    ).rejects.toThrow('not valid base64');
    expect(fake.post).not.toHaveBeenCalled();
  });

  it('send_message surfaces Canvas refusing a recipient, after the upload', async () => {
    const routes = { '/conversations': new Error('Canvas answered 400: Invalid recipients') };
    const args = { recipient_ids: [999999], subject: 'S', body: 'B' };
    await expect(runInbox('send_message', args, routes)).rejects.toThrow('Invalid recipients');
  });

  it('never logs the message body, the attachment content or the token', async () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => undefined),
    );
    const routes = {
      '/users/self/files': { upload_url: 'https://up.test/1' },
      'https://up.test/1': new Error('upload refused'),
    };
    const file = { file_name: 'secret.txt', content: 'SECRET-CONTENT' };
    const args = { recipient_ids: [5], subject: 'S', body: 'SECRET-BODY', attachments: [file] };
    await expect(runInbox('send_message', args, routes)).rejects.toThrow();
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('reply_message adds the message, with attachments, to the conversation', async () => {
    const path = '/conversations/7/add_message';
    const routes = {
      '/users/self/files': { upload_url: 'https://up.test/2' },
      'https://up.test/2': { id: 88, display_name: 'r.txt', size: 2 },
      [path]: { id: 7, messages: [{ id: 12, created_at: 'd' }] },
    };
    const args = {
      conversation_id: 7,
      body: 'Thanks',
      attachments: [{ file_name: 'r.txt', content: 'ok' }],
    };
    const { result, post } = await runInbox('reply_message', args, routes);
    expect(post).toHaveBeenLastCalledWith(path, { body: 'Thanks', attachment_ids: ['88'] });
    expect(result).toEqual({
      ok: true,
      conversation_id: 7,
      message_id: 12,
      sent_at: 'd',
      attachments: [{ id: 88, name: 'r.txt', size: 2 }],
    });
  });

  it('reply_message tolerates a response without messages', async () => {
    const path = '/conversations/7/add_message';
    const { result, post } = await runInbox(
      'reply_message',
      { conversation_id: 7, body: 'Thanks' },
      { [path]: { id: 7 } },
    );
    expect(post).toHaveBeenCalledWith(path, { body: 'Thanks' });
    expect(result).toEqual({
      ok: true,
      conversation_id: 7,
      message_id: null,
      sent_at: null,
      attachments: [],
    });
  });
});

describe('sendInboxMessage and replyInboxMessage', () => {
  it('send and reply through the client with no attachments', async () => {
    const fake = fakeContext({
      '/conversations': [{ id: 1 }],
      '/conversations/1/add_message': { id: 1, messages: [{ id: 2 }] },
    });
    const sent = await sendInboxMessage(fake.ctx.client, {
      recipient_ids: [5],
      subject: 'S',
      body: 'B',
    });
    expect(sent).toMatchObject({ ok: true, conversation_id: 1 });
    const reply = await replyInboxMessage(fake.ctx.client, { conversation_id: 1, body: 'R' });
    expect(reply).toMatchObject({ ok: true, message_id: 2, attachments: [] });
  });
});

describe('attachments by Canvas file id', () => {
  it('send_message attaches file_ids, copying files outside the inbox folder', async () => {
    const { result, post } = await runInbox(
      'send_message',
      { recipient_ids: [5], subject: 'S', body: 'B', file_ids: [3] },
      {
        '/users/self/folders/by_path/conversation%20attachments': [{ id: 77 }],
        '/files/3': { id: 3, folder_id: 1 },
        '/folders/77/copy_file': { id: 30, display_name: 'docs.zip', size: 9 },
        '/conversations': [{ id: 1 }],
      },
    );
    expect(result).toMatchObject({ ok: true, attachments: [{ id: 30, name: 'docs.zip' }] });
    expect(post.mock.calls.at(-1)).toEqual([
      '/conversations',
      expect.objectContaining({ attachment_ids: ['30'] }),
    ]);
  });

  it('prepare_attachment_upload returns a curl command and sends nothing', async () => {
    const { result, post } = await runInbox(
      'prepare_attachment_upload',
      { file_name: 'docs.zip', size: 189000 },
      { '/users/self/files': { upload_url: 'https://up.test/x' } },
    );
    expect(result).toMatchObject({ file_name: 'docs.zip' });
    expect(post).toHaveBeenCalledTimes(1);
  });
});
