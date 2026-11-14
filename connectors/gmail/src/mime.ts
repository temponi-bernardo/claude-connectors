/**
 * Montagem de e-mails MIME (RFC 5322/2045/2047) para enviar pela Gmail API: endereços validados, cabeçalhos
 * sem quebras de linha (sem injeção de cabeçalho), nomes e assunto em UTF-8 codificados, corpo em texto plano
 * e anexos em base64. Pura.
 */
import { isEmailAddress } from './config.js';

/** Endereço de e-mail com nome opcional. */
export interface MailAddress {
  readonly name: string;
  readonly email: string;
}

/** Anexo de um e-mail a enviar. */
export interface MailAttachment {
  readonly filename: string;
  readonly mimeType: string;
  readonly data: Uint8Array;
}

/** E-mail a enviar, já validado. `inReplyTo` e `references` mantêm a conversa. */
export interface OutgoingEmail {
  readonly to: readonly MailAddress[];
  readonly cc: readonly MailAddress[];
  readonly bcc: readonly MailAddress[];
  readonly subject: string;
  readonly body: string;
  readonly inReplyTo: string | null;
  readonly references: string | null;
  readonly attachments: readonly MailAttachment[];
}

/** Maior trecho UTF-8 (bytes) de uma palavra codificada: 45 bytes = 60 em base64, palavra ≤ 75. */
export const MAX_ENCODED_WORD_BYTES = 45;

/** Pedaços de uma lista de endereços: texto entre aspas, `<...>`, texto comum ou separador. */
const ADDRESS_TOKEN = /"(?:\\.|[^"\\])*"?|<[^>]*>?|[^,;"<]+|[,;]/gs;

/** Separa uma lista de endereços por vírgula ou ponto e vírgula, fora de aspas e de `<...>`. */
export function splitAddressList(text: string): string[] {
  const items: string[] = [''];
  for (const [token] of text.matchAll(ADDRESS_TOKEN)) {
    if (token === ',' || token === ';') items.push('');
    else items.push((items.pop() ?? '') + token);
  }
  return items.map((item) => item.trim()).filter(Boolean);
}

/** Lê `Nome <e-mail>`, `"Nome" <e-mail>` ou `e-mail`; nulo se o e-mail for inválido. */
export function parseMailAddress(item: string): MailAddress | null {
  const match = /^(.*)<([^<>]*)>\s*$/s.exec(item.trim());
  const rawName = match ? (match[1] ?? '') : '';
  const email = (match ? (match[2] ?? '') : item).trim();
  if (!isEmailAddress(email) || /[\r\n<>",;]/.test(email)) return null;
  const name = rawName
    .trim()
    .replace(/^"(.*)"$/s, '$1')
    .replace(/\\(.)/g, '$1');
  return { name: cleanHeaderText(name), email };
}

/** Endereços válidos de um cabeçalho (`To`, `Cc`, `Reply-To`...); os inválidos são descartados. */
export function parseAddressList(text: string): MailAddress[] {
  return splitAddressList(text).flatMap((item) => {
    const address = parseMailAddress(item);
    return address ? [address] : [];
  });
}

/** Endereços pedidos pelo usuário num campo; lança erro dizendo qual item é inválido. */
export function parseRecipients(items: readonly string[], field: string): MailAddress[] {
  return items.flatMap(splitAddressList).map((item) => {
    const address = parseMailAddress(item);
    if (!address) throw new Error(`Invalid address in ${field}: "${item}".`);
    return address;
  });
}

/** Troca quebras de linha e tabs por espaço e apara (um cabeçalho nunca ganha linha nova). */
export function cleanHeaderText(text: string): string {
  return text.replace(/[\r\n\t]+/g, ' ').trim();
}

/** Diz se o texto só tem ASCII imprimível (vai no cabeçalho sem codificar). */
export function isPrintableAscii(text: string): boolean {
  return /^[\x20-\x7e]*$/.test(text);
}

/** Codifica texto não ASCII em palavras `=?UTF-8?B?...?=` (RFC 2047) de até 75 caracteres. */
export function encodeHeaderWord(text: string): string {
  if (isPrintableAscii(text)) return text;
  const chunks: string[] = [];
  let current = '';
  for (const char of text) {
    if (Buffer.byteLength(current + char) > MAX_ENCODED_WORD_BYTES) {
      chunks.push(current);
      current = '';
    }
    current += char;
  }
  return [...chunks, current]
    .map((chunk) => `=?UTF-8?B?${Buffer.from(chunk).toString('base64')}?=`)
    .join('\r\n ');
}

/** Endereço pronto para o cabeçalho: nome entre aspas (ou codificado) e e-mail entre `<>`. */
export function formatMailAddress(address: MailAddress): string {
  if (!address.name) return address.email;
  const name = isPrintableAscii(address.name)
    ? `"${address.name.replace(/(["\\])/g, '\\$1')}"`
    : encodeHeaderWord(address.name);
  return `${name} <${address.email}>`;
}

/** Linha de um cabeçalho de endereços; nenhuma se a lista for vazia. */
export function addressHeader(name: string, addresses: readonly MailAddress[]): string[] {
  return addresses.length === 0 ? [] : [`${name}: ${addresses.map(formatMailAddress).join(', ')}`];
}

/** Só os ids `<...>` de um `Message-ID`/`References` (o resto é descartado); nulo se não houver. */
export function messageIdList(text: string | undefined): string | null {
  const ids = (text ?? '').match(/<[^<>\s]+>/g) ?? [];
  return ids.length > 0 ? ids.join(' ') : null;
}

/** Cabeçalhos do e-mail: versão MIME, destinatários, assunto e os de conversa (`In-Reply-To`...). */
export function mimeHeaderLines(email: OutgoingEmail): string[] {
  return [
    'MIME-Version: 1.0',
    ...addressHeader('To', email.to),
    ...addressHeader('Cc', email.cc),
    ...addressHeader('Bcc', email.bcc),
    `Subject: ${encodeHeaderWord(cleanHeaderText(email.subject))}`,
    ...(email.inReplyTo ? [`In-Reply-To: ${email.inReplyTo}`] : []),
    ...(email.references ? [`References: ${email.references}`] : []),
  ];
}

/** Bytes em base64 com linhas de 76 caracteres (RFC 2045). */
export function wrapBase64(bytes: Uint8Array): string {
  return (
    Buffer.from(bytes)
      .toString('base64')
      .match(/.{1,76}/g) ?? []
  ).join('\r\n');
}

/** Parte de texto plano em UTF-8 (base64, com quebras CRLF). */
export function textPart(body: string): string[] {
  return [
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(body.replace(/\r?\n/g, '\r\n'))),
  ];
}

/** Tipo MIME seguro para o cabeçalho; o resto vira `application/octet-stream`. */
export function safeMimeType(mimeType: string): string {
  return /^[\w.+-]+\/[\w.+-]+$/.test(mimeType) ? mimeType : 'application/octet-stream';
}

/** Parte de um anexo: tipo, nome (limpo e codificado) e conteúdo em base64. */
export function attachmentPart(attachment: MailAttachment): string[] {
  const name = encodeHeaderWord(cleanHeaderText(attachment.filename).replace(/["\\]/g, ''));
  return [
    `Content-Type: ${safeMimeType(attachment.mimeType)}; name="${name}"`,
    `Content-Disposition: attachment; filename="${name}"`,
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(attachment.data),
  ];
}

/** Mensagem MIME completa; com anexos vira `multipart/mixed` com a fronteira dada. */
export function buildMimeMessage(email: OutgoingEmail, boundary: string): string {
  const headers = mimeHeaderLines(email);
  if (email.attachments.length === 0) return [...headers, ...textPart(email.body)].join('\r\n');
  const parts = [textPart(email.body), ...email.attachments.map(attachmentPart)];
  return [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    ...parts.flatMap((part) => [`--${boundary}`, ...part]),
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

/** Mensagem MIME em base64url, como o campo `raw` da Gmail API pede. */
export function toRawMessage(mime: string): string {
  return Buffer.from(mime).toString('base64url');
}
