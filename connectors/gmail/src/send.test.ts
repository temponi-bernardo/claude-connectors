import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  READONLY_SCOPE,
  TEST_REFS,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { b64, RECEIPT } from './fixtures/messages.js';
import {
  checkRecipientLimit,
  composeEmail,
  fetchFullMessage,
  forwardAttachments,
  gmailMessageResource,
  MAX_FORWARD_BYTES,
  MAX_RECIPIENTS,
  mimeBoundary,
  prepareForward,
  prepareReply,
  sendPrepared,
  sentResult,
} from './send.js';

const OWNER = TEST_REFS[0]!;
const ARGS = { to: ['Ana <ana@example.com>'], cc: [], bcc: [], subject: 'Hi', body: 'Hello' };
const ORIGINAL_ROUTES = gmailRoute({
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: 3, data: b64('PDF') },
});

/** Decodes the `raw` of a recorded send. */
function rawOf(write: GmailWrite | undefined): string {
  const body = write?.body as { raw?: string } | null;
  return Buffer.from(body?.raw ?? '', 'base64url').toString('utf8');
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('composeEmail', () => {
  it('validates and builds a new email, without a thread', () => {
    const prepared = composeEmail({ ...ARGS, cc: ['c@x.com'], bcc: ['b@x.com'] });
    expect(prepared.threadId).toBeNull();
    expect(prepared.email).toMatchObject({
      to: [{ name: 'Ana', email: 'ana@example.com' }],
      cc: [{ name: '', email: 'c@x.com' }],
      bcc: [{ name: '', email: 'b@x.com' }],
      subject: 'Hi',
      body: 'Hello',
      inReplyTo: null,
      attachments: [],
    });
  });

  it('rejects an invalid address', () => {
    expect(() => composeEmail({ ...ARGS, to: ['bad'] })).toThrow(/to/);
  });
});

describe('checkRecipientLimit', () => {
  it('requires at least one recipient and at most the limit', () => {
    const email = composeEmail(ARGS).email;
    expect(() => {
      checkRecipientLimit(email);
    }).not.toThrow();
    expect(() => {
      checkRecipientLimit({ ...email, to: [] });
    }).toThrow(/at least one/);
    const many = Array.from({ length: MAX_RECIPIENTS + 1 }, (_, i) => ({
      name: '',
      email: `p${i}@x.com`,
    }));
    expect(() => {
      checkRecipientLimit({ ...email, to: many });
    }).toThrow(/at most/);
  });
});

describe('Gmail API resource', () => {
  it('mimeBoundary is random and safe', () => {
    expect(mimeBoundary()).toMatch(/^=_part_[A-Za-z0-9_-]+$/);
    expect(mimeBoundary()).not.toBe(mimeBoundary());
  });

  it('gmailMessageResource carries raw, and threadId only when present', () => {
    const fresh = gmailMessageResource(composeEmail(ARGS));
    expect(Object.keys(fresh)).toEqual(['raw']);
    const reply = gmailMessageResource({ ...composeEmail(ARGS), threadId: 't1' });
    expect(reply.threadId).toBe('t1');
    expect(Buffer.from(reply.raw, 'base64url').toString()).toContain('To: "Ana"');
  });
});

describe('sending', () => {
  it('sendPrepared posts to messages/send and returns the ids', async () => {
    const writes: GmailWrite[] = [];
    const route = gmailWriteRoute(writes, () => ({ id: 's1', threadId: 't9' }));
    const deps = await linkedTestDeps([route]);
    expect(await sendPrepared(deps, OWNER, composeEmail(ARGS))).toEqual({
      account: 'owner',
      sent: true,
      message_id: 's1',
      thread_id: 't9',
    });
    expect(writes[0]?.path).toBe('messages/send');
    expect(rawOf(writes[0])).toContain('Subject: Hi');
  });

  it('a read-only account does not send and asks for relinking', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes)]);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    await expect(sendPrepared(deps, old, composeEmail(ARGS))).rejects.toThrow(/link_account/);
    expect(writes).toHaveLength(0);
  });
});

describe('sentResult', () => {
  it('uses null when Gmail returns no ids', () => {
    expect(sentResult('owner', {})).toEqual({
      account: 'owner',
      sent: true,
      message_id: null,
      thread_id: null,
    });
  });
});

describe('reply and forward', () => {
  it('fetchFullMessage reads the message in full format', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    expect((await fetchFullMessage(deps, OWNER, 'm1')).id).toBe('m1');
  });

  it('prepareReply replies to the sender in the same thread', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const prepared = await prepareReply(deps, OWNER, {
      messageId: 'm1',
      body: 'Received',
      replyAll: false,
    });
    expect(prepared.threadId).toBe('t1');
    expect(prepared.email.to).toEqual([
      { name: 'Image-Line', email: 'noreply@image-line.example' },
    ]);
    expect(prepared.email.subject).toBe('Re: Your FL Cloud receipt');
  });

  it('forwardAttachments downloads the original attachments', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const attachments = await forwardAttachments(deps, OWNER, RECEIPT);
    expect(attachments).toHaveLength(1);
    expect(attachments[0]).toMatchObject({ filename: 'receipt.pdf', mimeType: 'application/pdf' });
    expect(Buffer.from(attachments[0]?.data ?? []).toString()).toBe('PDF');
  });

  it('forwardAttachments refuses oversized attachments before downloading', async () => {
    const deps = await linkedTestDeps([]);
    const big = structuredClone(RECEIPT) as typeof RECEIPT & { payload: { parts: unknown[] } };
    const part = big.payload.parts[1] as { body: { size: number } };
    part.body.size = MAX_FORWARD_BYTES + 1;
    await expect(forwardAttachments(deps, OWNER, big)).rejects.toThrow(/MB/);
  });

  it('prepareForward validates recipients and includes the attachments', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const prepared = await prepareForward(deps, OWNER, {
      messageId: 'm1',
      to: ['z@x.com'],
      cc: [],
      bcc: [],
      note: 'For you',
    });
    expect(prepared.email.subject).toBe('Fwd: Your FL Cloud receipt');
    expect(prepared.email.attachments).toHaveLength(1);
    await expect(
      prepareForward(deps, OWNER, { messageId: 'm1', to: [], cc: [], bcc: [], note: '' }),
    ).rejects.toThrow(/at least one/);
  });
});
