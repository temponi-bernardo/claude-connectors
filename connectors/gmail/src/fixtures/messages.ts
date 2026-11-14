/** Sample Gmail API messages and threads for tests. */
import type { GmailMessage, GmailPart, GmailThread } from '../message-format.js';

/** Encodes text (or bytes) in base64url, as the Gmail API returns it. */
export function b64(content: string | Uint8Array): string {
  return Buffer.from(content).toString('base64url');
}

/** Headers of a sample message. */
export function headers(subject: string, from: string): NonNullable<GmailPart['headers']> {
  return [
    { name: 'From', value: from },
    { name: 'To', value: 'owner@example.com' },
    { name: 'Date', value: 'Tue, 10 Nov 2026 10:00:00 +0000' },
    { name: 'Subject', value: subject },
    { name: 'subject', value: 'ignored duplicate' },
  ];
}

/** Multipart receipt: text, HTML and an attached PDF. */
export const RECEIPT: GmailMessage = {
  id: 'm1',
  threadId: 't1',
  labelIds: ['INBOX', 'CATEGORY_UPDATES'],
  snippet: 'Thanks for your purchase',
  internalDate: '1762768800000',
  payload: {
    mimeType: 'multipart/mixed',
    headers: headers('Your FL Cloud receipt', 'Image-Line <noreply@image-line.example>'),
    parts: [
      {
        mimeType: 'multipart/alternative',
        parts: [
          { mimeType: 'text/plain', body: { size: 20, data: b64('Total: US$ 9,99') } },
          { mimeType: 'text/html', body: { size: 30, data: b64('<p>Total: <b>US$ 9,99</b></p>') } },
        ],
      },
      {
        mimeType: 'application/pdf',
        filename: 'receipt.pdf',
        body: { size: 1234, attachmentId: 'att-1' },
      },
    ],
  },
};

/** HTML-only message, in ISO-8859-1. */
export const HTML_ONLY: GmailMessage = {
  id: 'm2',
  threadId: 't1',
  snippet: 'Reply',
  internalDate: '1762855200000',
  payload: {
    mimeType: 'text/html',
    headers: [
      { name: 'Content-Type', value: 'text/html; charset="ISO-8859-1"' },
      { name: 'From', value: 'Support <help@image-line.example>' },
    ],
    body: {
      size: 10,
      data: b64(Uint8Array.from([0x3c, 0x70, 0x3e, 0x4f, 0x6c, 0xe1, 0x3c, 0x2f, 0x70, 0x3e])),
    },
  },
};

/** Thread with both messages. */
export const THREAD: GmailThread = { id: 't1', messages: [RECEIPT, HTML_ONLY] };
