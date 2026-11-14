import { describe, expect, it } from 'vitest';
import {
  forwardEmail,
  forwardedText,
  prefixSubject,
  quotedText,
  replyEmail,
  replyRecipients,
  replyToList,
  threadingHeaders,
  uniqueAddresses,
} from './compose.js';
import { b64 } from './fixtures/messages.js';
import type { GmailMessage } from './message-format.js';
import { headerValues } from './message-format.js';

const SELF = 'owner@example.com';

/** Original message with the given headers and a text body. */
function original(headers: Record<string, string>, body = 'line 1\nline 2'): GmailMessage {
  return {
    id: 'm1',
    threadId: 't1',
    payload: {
      mimeType: 'text/plain',
      headers: Object.entries(headers).map(([name, value]) => ({ name, value })),
      body: { size: body.length, data: b64(body) },
    },
  };
}

const ORIGINAL = original({
  From: 'Ana <ana@example.com>',
  To: 'Owner <OWNER@example.com>, bia@example.com',
  Cc: 'carla@example.com, ana@example.com',
  Subject: 'Budget',
  Date: 'Tue, 10 Nov 2026 10:00:00 +0000',
  'Message-ID': '<m1@mail.example>',
  References: '<m0@mail.example>',
});

describe('subject and thread', () => {
  it('prefixSubject does not repeat the prefix', () => {
    expect(prefixSubject('Hi', 'Re')).toBe('Re: Hi');
    expect(prefixSubject('RE: Hi', 'Re')).toBe('RE: Hi');
    expect(prefixSubject('Hi', 'Fwd')).toBe('Fwd: Hi');
    expect(prefixSubject('Fw: Hi', 'Fwd')).toBe('Fw: Hi');
    expect(prefixSubject('', 'Re')).toBe('Re:');
  });

  it('threadingHeaders joins References and Message-ID', () => {
    expect(threadingHeaders(headerValues(ORIGINAL.payload?.headers ?? []))).toEqual({
      inReplyTo: '<m1@mail.example>',
      references: '<m0@mail.example> <m1@mail.example>',
    });
    expect(threadingHeaders(new Map())).toEqual({ inReplyTo: null, references: null });
  });
});

describe('reply recipients', () => {
  it('uniqueAddresses drops duplicates and excluded ones, case-insensitive', () => {
    const list = [
      { name: 'A', email: 'a@x.com' },
      { name: '', email: 'A@x.com' },
      { name: '', email: 'b@x.com' },
    ];
    expect(uniqueAddresses(list, new Set(['b@x.com']))).toEqual([{ name: 'A', email: 'a@x.com' }]);
  });

  it('reply goes only to the sender (or Reply-To)', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyRecipients(headers, SELF, false)).toEqual({
      to: [{ name: 'Ana', email: 'ana@example.com' }],
      cc: [],
    });
    headers.set('reply-to', 'list@example.com');
    expect(replyRecipients(headers, SELF, false).to).toEqual([
      { name: '', email: 'list@example.com' },
    ]);
  });

  it('reply all includes To and Cc, without the account itself or duplicates', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyRecipients(headers, SELF, true)).toEqual({
      to: [
        { name: 'Ana', email: 'ana@example.com' },
        { name: '', email: 'bia@example.com' },
      ],
      cc: [{ name: '', email: 'carla@example.com' }],
    });
  });

  it('reply to a message you sent goes to the original recipients', () => {
    const sent = headerValues([
      { name: 'From', value: 'Owner <owner@example.com>' },
      { name: 'To', value: 'ana@example.com' },
    ]);
    expect(replyRecipients(sent, SELF, false).to).toEqual([{ name: '', email: 'ana@example.com' }]);
  });

  it('replyToList: sender, everyone, or the recipients if you sent the original', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyToList(headers, SELF, false)).toHaveLength(1);
    expect(replyToList(headers, SELF, true)).toHaveLength(3);
    const sent = headerValues([
      { name: 'From', value: SELF },
      { name: 'To', value: 'a@x.com' },
    ]);
    expect(replyToList(sent, SELF, true)).toEqual([{ name: '', email: 'a@x.com' }]);
  });

  it('throws when no recipient is possible', () => {
    const onlySelf = headerValues([{ name: 'From', value: SELF }]);
    expect(() => replyRecipients(onlySelf, SELF, true)).toThrow(/recipient/);
  });
});

describe('quoted texts', () => {
  it('quotedText quotes the original with date and sender', () => {
    expect(quotedText(ORIGINAL)).toBe(
      'On Tue, 10 Nov 2026 10:00:00 +0000, Ana <ana@example.com> wrote:\n> line 1\n> line 2',
    );
  });

  it('forwardedText has the header block and the body', () => {
    const text = forwardedText(ORIGINAL);
    expect(text).toContain('---------- Forwarded message ----------');
    expect(text).toContain('From: Ana <ana@example.com>');
    expect(text).toContain('Subject: Budget');
    expect(text).toContain('Cc: carla@example.com, ana@example.com');
    expect(text.endsWith('line 1\nline 2')).toBe(true);
    const noCc = forwardedText(original({ From: 'a@x.com' }, 'x'));
    expect(noCc).not.toContain('Cc:');
  });
});

describe('ready emails', () => {
  it('replyEmail keeps the thread and quotes the original', () => {
    const prepared = replyEmail(ORIGINAL, { body: 'Agreed.', replyAll: true, selfEmail: SELF });
    expect(prepared.threadId).toBe('t1');
    expect(prepared.email).toMatchObject({
      subject: 'Re: Budget',
      inReplyTo: '<m1@mail.example>',
      references: '<m0@mail.example> <m1@mail.example>',
      bcc: [],
      attachments: [],
    });
    expect(prepared.email.to).toHaveLength(2);
    expect(prepared.email.body.startsWith('Agreed.\n\nOn Tue')).toBe(true);
  });

  it('replyEmail without threadId uses null', () => {
    const noThread: GmailMessage = { id: ORIGINAL.id, payload: ORIGINAL.payload! };
    expect(replyEmail(noThread, { body: 'x', replyAll: false, selfEmail: SELF }).threadId).toBe(
      null,
    );
  });

  it('forwardEmail joins the note, the original and the attachments, in a new thread', () => {
    const attachments = [
      { filename: 'a.pdf', mimeType: 'application/pdf', data: new Uint8Array() },
    ];
    const to = [{ name: '', email: 'z@x.com' }];
    const prepared = forwardEmail(ORIGINAL, { to, cc: [], bcc: [], note: 'FYI.', attachments });
    expect(prepared.threadId).toBeNull();
    expect(prepared.email).toMatchObject({ subject: 'Fwd: Budget', to, attachments });
    expect(prepared.email.body.startsWith('FYI.\n\n---------- Forwarded')).toBe(true);
    const bare = forwardEmail(ORIGINAL, { to, cc: [], bcc: [], note: '', attachments: [] });
    expect(bare.email.body.startsWith('---------- Forwarded')).toBe(true);
  });
});
