import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  READONLY_SCOPE,
  TEST_EMAILS,
  TEST_OWNER,
  TEST_TOKEN_KEY,
  testAccount,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { b64, RECEIPT } from './fixtures/messages.js';
import {
  forwardEmailTool,
  replyAllEmailTool,
  replyEmailTool,
  replyTool,
  sendEmailTool,
} from './send-tools.js';
import { saveOwnerAccounts } from './token-store.js';
import { SEND_HINTS } from '../../../src/mcp/annotations.js';

const ORIGINAL = gmailRoute({
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: 3, data: b64('PDF') },
});

/** Dependencies with a write route (answering the send id) and the original read. */
async function writableDeps(writes: GmailWrite[]) {
  const route = gmailWriteRoute(writes, () => ({ id: 's1', threadId: 't1' }));
  return linkedTestDeps([route, ORIGINAL]);
}

/** MIME of the recorded send. */
function sentMime(writes: GmailWrite[]): string {
  return Buffer.from((writes[0]?.body as { raw: string }).raw, 'base64url').toString();
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('sending tools', () => {
  it('all ask for confirmation (destructiveHint) and are not idempotent', () => {
    for (const tool of [sendEmailTool, replyEmailTool, replyAllEmailTool, forwardEmailTool]) {
      expect(tool.annotations).toMatchObject(SEND_HINTS);
      expect(tool.description).toMatch(/confirmation/);
    }
  });

  it('send_email sends from the requested account', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    const result = await sendEmailTool.run(deps, {
      account: 'music',
      to: ['ana@example.com'],
      subject: 'Hi',
      body: 'How are you?',
    });
    expect(result).toEqual({ account: 'music', sent: true, message_id: 's1', thread_id: 't1' });
    expect(sentMime(writes)).toContain('To: ana@example.com');
  });

  it('send_email refuses "all" and empty lists', async () => {
    const deps = await writableDeps([]);
    const args = { account: 'all', to: ['a@x.com'], subject: '', body: '' };
    await expect(sendEmailTool.run(deps, args)).rejects.toThrow(/one specific account/);
    await expect(sendEmailTool.run(deps, { ...args, account: 'owner', to: [] })).rejects.toThrow();
  });

  it('reply_email and reply_all_email keep the thread', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    await replyEmailTool.run(deps, { account: 'owner', message_id: 'm1', body: 'Thanks' });
    await replyAllEmailTool.run(deps, { account: 'owner', message_id: 'm1', body: 'Thanks' });
    expect(writes.map((w) => (w.body as { threadId?: string }).threadId)).toEqual(['t1', 't1']);
    expect(sentMime(writes)).toContain('Subject: Re: Your FL Cloud receipt');
  });

  it('replyTool builds the tool with the given name', () => {
    expect(replyTool({ name: 'x', title: 'X', replyAll: true, description: 'd' }).name).toBe('x');
  });

  it('forward_email carries the original attachments', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    await forwardEmailTool.run(deps, {
      account: 'owner',
      message_id: 'm1',
      to: ['z@example.com'],
      note: 'See below',
    });
    const mime = sentMime(writes);
    expect(mime).toContain('multipart/mixed');
    expect(mime).toContain('filename="receipt.pdf"');
  });

  it('a read-only account gets the relinking request before reading the original', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    const accounts = TEST_EMAILS.map((email) => testAccount(email, { scope: READONLY_SCOPE }));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts });
    await expect(
      replyEmailTool.run(deps, { account: 'owner', message_id: 'm1', body: 'x' }),
    ).rejects.toThrow(/read-only.*link_account/s);
    expect(writes).toHaveLength(0);
  });
});
