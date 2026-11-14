/**
 * Builds MIME emails (RFC 5322/2045/2047) to send through the Gmail API: validated addresses, headers
 * without line breaks (no header injection), UTF-8 names and subject encoded, plain-text body and base64
 * attachments. Pure.
 */
import { isEmailAddress } from './config.js';

/** Email address with an optional name. */
export interface MailAddress {
  readonly name: string;
  readonly email: string;
}

/** Attachment of an email to send. */
export interface MailAttachment {
  readonly filename: string;
  readonly mimeType: string;
  readonly data: Uint8Array;
}

/** Email to send, already validated. `inReplyTo` and `references` keep the thread. */
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

/** Largest UTF-8 chunk (bytes) of an encoded word: 45 bytes = 60 in base64, word ≤ 75. */
export const MAX_ENCODED_WORD_BYTES = 45;

/** Pieces of an address list: quoted text, `<...>`, plain text or separator. */
const ADDRESS_TOKEN = /"(?:\\.|[^"\\])*"?|<[^>]*>?|[^,;"<]+|[,;]/gs;

/** Splits an address list on commas or semicolons outside quotes and `<...>`. */
export function splitAddressList(text: string): string[] {
  const items: string[] = [''];
  for (const [token] of text.matchAll(ADDRESS_TOKEN)) {
    if (token === ',' || token === ';') items.push('');
    else items.push((items.pop() ?? '') + token);
  }
  return items.map((item) => item.trim()).filter(Boolean);
}

/** Reads `Name <email>`, `"Name" <email>` or `email`; null if the email is invalid. */
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

/** Valid addresses of a header (`To`, `Cc`, `Reply-To`...); invalid ones are dropped. */
export function parseAddressList(text: string): MailAddress[] {
  return splitAddressList(text).flatMap((item) => {
    const address = parseMailAddress(item);
    return address ? [address] : [];
  });
}

/** Addresses the user asked for in a field; throws saying which item is invalid. */
export function parseRecipients(items: readonly string[], field: string): MailAddress[] {
  return items.flatMap(splitAddressList).map((item) => {
    const address = parseMailAddress(item);
    if (!address) throw new Error(`Invalid address in ${field}: "${item}".`);
    return address;
  });
}

/** Replaces line breaks and tabs with a space and trims (a header never gets a new line). */
export function cleanHeaderText(text: string): string {
  return text.replace(/[\r\n\t]+/g, ' ').trim();
}

/** Tells whether the text is printable ASCII only (goes into the header unencoded). */
export function isPrintableAscii(text: string): boolean {
  return /^[\x20-\x7e]*$/.test(text);
}

/** Encodes non-ASCII text as `=?UTF-8?B?...?=` words (RFC 2047) of up to 75 characters. */
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

/** Address ready for the header: quoted (or encoded) name and email in `<>`. */
export function formatMailAddress(address: MailAddress): string {
  if (!address.name) return address.email;
  const name = isPrintableAscii(address.name)
    ? `"${address.name.replace(/(["\\])/g, '\\$1')}"`
    : encodeHeaderWord(address.name);
  return `${name} <${address.email}>`;
}

/** Line of an address header; none if the list is empty. */
export function addressHeader(name: string, addresses: readonly MailAddress[]): string[] {
  return addresses.length === 0 ? [] : [`${name}: ${addresses.map(formatMailAddress).join(', ')}`];
}

/** Only the `<...>` ids of a `Message-ID`/`References` (the rest is dropped); null if there are none. */
export function messageIdList(text: string | undefined): string | null {
  const ids = (text ?? '').match(/<[^<>\s]+>/g) ?? [];
  return ids.length > 0 ? ids.join(' ') : null;
}

/** Email headers: MIME version, recipients, subject and the threading ones (`In-Reply-To`...). */
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

/** Bytes in base64 with 76-character lines (RFC 2045). */
export function wrapBase64(bytes: Uint8Array): string {
  return (
    Buffer.from(bytes)
      .toString('base64')
      .match(/.{1,76}/g) ?? []
  ).join('\r\n');
}

/** UTF-8 plain-text part (base64, with CRLF line breaks). */
export function textPart(body: string): string[] {
  return [
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(body.replace(/\r?\n/g, '\r\n'))),
  ];
}

/** MIME type safe for the header; anything else becomes `application/octet-stream`. */
export function safeMimeType(mimeType: string): string {
  return /^[\w.+-]+\/[\w.+-]+$/.test(mimeType) ? mimeType : 'application/octet-stream';
}

/** Attachment part: type, name (cleaned and encoded) and base64 content. */
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

/** Full MIME message; with attachments it becomes `multipart/mixed` with the given boundary. */
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

/** MIME message in base64url, as the Gmail API `raw` field expects. */
export function toRawMessage(mime: string): string {
  return Buffer.from(mime).toString('base64url');
}
