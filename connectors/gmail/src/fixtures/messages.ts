/** Mensagens e conversas da Gmail API de exemplo para os testes. */
import type { GmailMessage, GmailPart, GmailThread } from '../message-format.js';

/** Codifica texto (ou bytes) em base64url, como a Gmail API devolve. */
export function b64(content: string | Uint8Array): string {
  return Buffer.from(content).toString('base64url');
}

/** Cabeçalhos de uma mensagem de exemplo. */
export function headers(subject: string, from: string): NonNullable<GmailPart['headers']> {
  return [
    { name: 'From', value: from },
    { name: 'To', value: 'dono@example.com' },
    { name: 'Date', value: 'Tue, 10 Nov 2026 10:00:00 +0000' },
    { name: 'Subject', value: subject },
    { name: 'subject', value: 'duplicado ignorado' },
  ];
}

/** Recibo multipart: texto, HTML e um PDF anexado. */
export const RECEIPT: GmailMessage = {
  id: 'm1',
  threadId: 't1',
  labelIds: ['INBOX', 'CATEGORY_UPDATES'],
  snippet: 'Obrigado pela compra',
  internalDate: '1762768800000',
  payload: {
    mimeType: 'multipart/mixed',
    headers: headers('Seu recibo FL Cloud', 'Image-Line <noreply@image-line.example>'),
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
        filename: 'recibo.pdf',
        body: { size: 1234, attachmentId: 'att-1' },
      },
    ],
  },
};

/** Mensagem só com HTML, em ISO-8859-1. */
export const HTML_ONLY: GmailMessage = {
  id: 'm2',
  threadId: 't1',
  snippet: 'Resposta',
  internalDate: '1762855200000',
  payload: {
    mimeType: 'text/html',
    headers: [
      { name: 'Content-Type', value: 'text/html; charset="ISO-8859-1"' },
      { name: 'From', value: 'Suporte <help@image-line.example>' },
    ],
    body: {
      size: 10,
      data: b64(Uint8Array.from([0x3c, 0x70, 0x3e, 0x4f, 0x6c, 0xe1, 0x3c, 0x2f, 0x70, 0x3e])),
    },
  },
};

/** Conversa com as duas mensagens. */
export const THREAD: GmailThread = { id: 't1', messages: [RECEIPT, HTML_ONLY] };
