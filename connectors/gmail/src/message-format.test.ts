import { describe, expect, it } from 'vitest';
import { b64, HTML_ONLY, RECEIPT, THREAD } from './fixtures/messages.js';
import {
  base64UrlToBytes,
  decodePartBody,
  flattenParts,
  formatMessage,
  formatThread,
  headerValues,
  internalDateIso,
  isBodyPart,
  MAX_MESSAGE_CHARS,
  MIN_MESSAGE_CHARS,
  messageAttachments,
  messageBodyText,
  partCharset,
  perMessageLimit,
  pickHeaders,
  summarizeThread,
  truncateText,
} from './message-format.js';

describe('body decoding', () => {
  it('base64UrlToBytes decodes base64url', () => {
    expect(new TextDecoder().decode(base64UrlToBytes(b64('olá')))).toBe('olá');
  });

  it('partCharset reads the charset or assumes utf-8', () => {
    expect(partCharset(HTML_ONLY.payload!)).toBe('iso-8859-1');
    expect(partCharset({})).toBe('utf-8');
  });

  it('decodePartBody honors latin1 and uses UTF-8 otherwise', () => {
    expect(decodePartBody(HTML_ONLY.payload!)).toBe('<p>Olá</p>');
    expect(decodePartBody({ body: { data: b64('ação') } })).toBe('ação');
    expect(decodePartBody({})).toBe('');
  });
});

describe('MIME structure', () => {
  it('headerValues keeps the first of each name', () => {
    expect(headerValues(RECEIPT.payload!.headers!).get('subject')).toBe('Your FL Cloud receipt');
  });

  it('flattenParts walks the tree and tolerates absence', () => {
    expect(flattenParts(RECEIPT.payload).map((p) => p.mimeType)).toEqual([
      'multipart/mixed',
      'multipart/alternative',
      'text/plain',
      'text/html',
      'application/pdf',
    ]);
    expect(flattenParts(undefined)).toEqual([]);
  });

  it('isBodyPart ignores attachments and parts without data', () => {
    expect(isBodyPart({ mimeType: 'text/plain', body: { data: '' } }, 'text/plain')).toBe(true);
    expect(
      isBodyPart({ mimeType: 'text/plain', filename: 'a.txt', body: { data: '' } }, 'text/plain'),
    ).toBe(false);
    expect(isBodyPart({ mimeType: 'text/plain' }, 'text/plain')).toBe(false);
  });

  it('messageBodyText prefers plain text and converts HTML when missing', () => {
    expect(messageBodyText(RECEIPT.payload)).toBe('Total: US$ 9,99');
    expect(messageBodyText(HTML_ONLY.payload)).toBe('Olá');
    expect(messageBodyText(undefined)).toBe('');
  });

  it('messageAttachments lists name, type, size and id', () => {
    expect(messageAttachments(RECEIPT.payload)).toEqual([
      { attachment_id: 'att-1', filename: 'receipt.pdf', mime_type: 'application/pdf', size: 1234 },
    ]);
    const bare = { filename: 'x', body: { attachmentId: 'a' } };
    expect(messageAttachments(bare)[0]).toMatchObject({
      mime_type: 'application/octet-stream',
      size: 0,
    });
  });
});

describe('limits and dates', () => {
  it('truncateText cuts and reports the rest', () => {
    expect(truncateText('abc', 5)).toBe('abc');
    expect(truncateText('abcdef', 2)).toBe('ab\n[... truncated: 4 more characters]');
  });

  it('internalDateIso converts or returns null', () => {
    expect(internalDateIso('0')).toBe('1970-01-01T00:00:00.000Z');
    expect(internalDateIso(undefined)).toBeNull();
    expect(internalDateIso('abc')).toBeNull();
  });

  it('perMessageLimit splits the thread among the messages', () => {
    expect(perMessageLimit(1)).toBe(MAX_MESSAGE_CHARS);
    expect(perMessageLimit(0)).toBe(MAX_MESSAGE_CHARS);
    expect(perMessageLimit(10)).toBe(6000);
    expect(perMessageLimit(1000)).toBe(MIN_MESSAGE_CHARS);
  });
});

describe('formatting', () => {
  it('pickHeaders returns only the useful headers', () => {
    expect(pickHeaders(HTML_ONLY.payload)).toEqual({ from: 'Support <help@image-line.example>' });
    expect(pickHeaders(undefined)).toEqual({});
  });

  it('formatMessage includes the body only in text format and honors the limit', () => {
    const text = formatMessage(RECEIPT, 'text', 5);
    expect(text).toMatchObject({
      message_id: 'm1',
      thread_id: 't1',
      subject: 'Your FL Cloud receipt',
    });
    expect(text.body).toBe('Total\n[... truncated: 10 more characters]');
    expect(formatMessage(RECEIPT, 'minimal')).not.toHaveProperty('body');
    expect(formatMessage({ id: 'x' }, 'minimal')).toMatchObject({
      thread_id: null,
      labels: [],
      snippet: '',
    });
  });

  it('formatThread formats every message', () => {
    const thread = formatThread(THREAD, 'text');
    expect(thread).toMatchObject({ thread_id: 't1', message_count: 2 });
    expect(formatThread({ id: 'v' }, 'minimal')).toMatchObject({ message_count: 0, messages: [] });
  });

  it('summarizeThread uses the subject of the first and the sender of the last', () => {
    expect(summarizeThread(THREAD, 'owner')).toEqual({
      account: 'owner',
      thread_id: 't1',
      subject: 'Your FL Cloud receipt',
      from: 'Support <help@image-line.example>',
      date: '2025-11-11T10:00:00.000Z',
      message_count: 2,
      snippet: 'Reply',
      labels: [],
    });
    expect(summarizeThread({ id: 'empty' }, 'owner')).toMatchObject({
      subject: '',
      from: '',
      date: null,
    });
  });
});
