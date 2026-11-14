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

describe('decodificação de corpo', () => {
  it('base64UrlToBytes decodifica base64url', () => {
    expect(new TextDecoder().decode(base64UrlToBytes(b64('olá')))).toBe('olá');
  });

  it('partCharset lê o charset ou assume utf-8', () => {
    expect(partCharset(HTML_ONLY.payload!)).toBe('iso-8859-1');
    expect(partCharset({})).toBe('utf-8');
  });

  it('decodePartBody respeita latin1 e usa UTF-8 nos demais', () => {
    expect(decodePartBody(HTML_ONLY.payload!)).toBe('<p>Olá</p>');
    expect(decodePartBody({ body: { data: b64('ação') } })).toBe('ação');
    expect(decodePartBody({})).toBe('');
  });
});

describe('estrutura MIME', () => {
  it('headerValues fica com o primeiro de cada nome', () => {
    expect(headerValues(RECEIPT.payload!.headers!).get('subject')).toBe('Seu recibo FL Cloud');
  });

  it('flattenParts percorre a árvore e tolera ausência', () => {
    expect(flattenParts(RECEIPT.payload).map((p) => p.mimeType)).toEqual([
      'multipart/mixed',
      'multipart/alternative',
      'text/plain',
      'text/html',
      'application/pdf',
    ]);
    expect(flattenParts(undefined)).toEqual([]);
  });

  it('isBodyPart ignora anexos e partes sem dados', () => {
    expect(isBodyPart({ mimeType: 'text/plain', body: { data: '' } }, 'text/plain')).toBe(true);
    expect(
      isBodyPart({ mimeType: 'text/plain', filename: 'a.txt', body: { data: '' } }, 'text/plain'),
    ).toBe(false);
    expect(isBodyPart({ mimeType: 'text/plain' }, 'text/plain')).toBe(false);
  });

  it('messageBodyText prefere texto puro e converte HTML na falta dele', () => {
    expect(messageBodyText(RECEIPT.payload)).toBe('Total: US$ 9,99');
    expect(messageBodyText(HTML_ONLY.payload)).toBe('Olá');
    expect(messageBodyText(undefined)).toBe('');
  });

  it('messageAttachments lista nome, tipo, tamanho e id', () => {
    expect(messageAttachments(RECEIPT.payload)).toEqual([
      { attachment_id: 'att-1', filename: 'recibo.pdf', mime_type: 'application/pdf', size: 1234 },
    ]);
    const bare = { filename: 'x', body: { attachmentId: 'a' } };
    expect(messageAttachments(bare)[0]).toMatchObject({
      mime_type: 'application/octet-stream',
      size: 0,
    });
  });
});

describe('limites e datas', () => {
  it('truncateText corta e informa o resto', () => {
    expect(truncateText('abc', 5)).toBe('abc');
    expect(truncateText('abcdef', 2)).toBe('ab\n[... cortado: mais 4 caracteres]');
  });

  it('internalDateIso converte ou devolve nulo', () => {
    expect(internalDateIso('0')).toBe('1970-01-01T00:00:00.000Z');
    expect(internalDateIso(undefined)).toBeNull();
    expect(internalDateIso('abc')).toBeNull();
  });

  it('perMessageLimit divide a conversa entre as mensagens', () => {
    expect(perMessageLimit(1)).toBe(MAX_MESSAGE_CHARS);
    expect(perMessageLimit(0)).toBe(MAX_MESSAGE_CHARS);
    expect(perMessageLimit(10)).toBe(6000);
    expect(perMessageLimit(1000)).toBe(MIN_MESSAGE_CHARS);
  });
});

describe('formatação', () => {
  it('pickHeaders devolve só os cabeçalhos úteis', () => {
    expect(pickHeaders(HTML_ONLY.payload)).toEqual({ from: 'Suporte <help@image-line.example>' });
    expect(pickHeaders(undefined)).toEqual({});
  });

  it('formatMessage inclui o corpo só no formato text e respeita o limite', () => {
    const text = formatMessage(RECEIPT, 'text', 5);
    expect(text).toMatchObject({
      message_id: 'm1',
      thread_id: 't1',
      subject: 'Seu recibo FL Cloud',
    });
    expect(text.body).toBe('Total\n[... cortado: mais 10 caracteres]');
    expect(formatMessage(RECEIPT, 'minimal')).not.toHaveProperty('body');
    expect(formatMessage({ id: 'x' }, 'minimal')).toMatchObject({
      thread_id: null,
      labels: [],
      snippet: '',
    });
  });

  it('formatThread formata todas as mensagens', () => {
    const thread = formatThread(THREAD, 'text');
    expect(thread).toMatchObject({ thread_id: 't1', message_count: 2 });
    expect(formatThread({ id: 'v' }, 'minimal')).toMatchObject({ message_count: 0, messages: [] });
  });

  it('summarizeThread usa o assunto da primeira e o remetente da última', () => {
    expect(summarizeThread(THREAD, 'dono')).toEqual({
      account: 'dono',
      thread_id: 't1',
      subject: 'Seu recibo FL Cloud',
      from: 'Suporte <help@image-line.example>',
      date: '2025-11-11T10:00:00.000Z',
      message_count: 2,
      snippet: 'Resposta',
      labels: [],
    });
    expect(summarizeThread({ id: 'vazia' }, 'dono')).toMatchObject({
      subject: '',
      from: '',
      date: null,
    });
  });
});
