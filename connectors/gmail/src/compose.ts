/**
 * Composes replies and forwards from the original message: subject with `Re:`/`Fwd:`, recipients (reply
 * or reply all, without the account itself), threading headers (`In-Reply-To`, `References`) and the
 * quoted text. Pure.
 */
import {
  headerValues,
  messageBodyText,
  truncateText,
  type GmailMessage,
} from './message-format.js';
import {
  messageIdList,
  parseAddressList,
  type MailAddress,
  type MailAttachment,
  type OutgoingEmail,
} from './mime.js';

/** Email ready to send or save as a draft, with the thread (`threadId`) to keep. */
export interface PreparedEmail {
  readonly email: OutgoingEmail;
  readonly threadId: string | null;
}

/** How to reply: new text, whether to reply all and the account's own address (excluded). */
export interface ReplyOptions {
  readonly body: string;
  readonly replyAll: boolean;
  readonly selfEmail: string;
}

/** Recipients, note and attachments of a forward. */
export interface ForwardOptions {
  readonly to: readonly MailAddress[];
  readonly cc: readonly MailAddress[];
  readonly bcc: readonly MailAddress[];
  readonly note: string;
  readonly attachments: readonly MailAttachment[];
}

/** Longest part of the original quoted in a reply, in characters. */
export const MAX_QUOTED_CHARS = 20_000;

/** Line that opens the forwarded email block. */
export const FORWARD_SEPARATOR = '---------- Forwarded message ----------';

/** Subject prefixed with `Re:` or `Fwd:`, not repeated if already there (`RE:`, `Fw:`...). */
export function prefixSubject(subject: string, prefix: 'Re' | 'Fwd'): string {
  const pattern = prefix === 'Re' ? /^re:/i : /^fwd?:/i;
  return pattern.test(subject.trim()) ? subject : `${prefix}: ${subject}`.trim();
}

/** Headers that keep the thread in a reply. */
export interface ThreadingHeaders {
  readonly inReplyTo: string | null;
  readonly references: string | null;
}

/** The reply's `In-Reply-To` and `References` from the original's headers. */
export function threadingHeaders(headers: ReadonlyMap<string, string>): ThreadingHeaders {
  const messageId = headers.get('message-id');
  return {
    inReplyTo: messageIdList(messageId),
    references: messageIdList(`${headers.get('references') ?? ''} ${messageId ?? ''}`),
  };
}

/** Addresses without duplicates or excluded ones (case-insensitive). */
export function uniqueAddresses(
  addresses: readonly MailAddress[],
  exclude: ReadonlySet<string>,
): MailAddress[] {
  const seen = new Set(exclude);
  return addresses.filter((address) => {
    const key = address.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Reply `To` candidates: the sender (or `Reply-To`), or the recipients if you sent the original. */
export function replyToList(
  headers: ReadonlyMap<string, string>,
  self: string,
  replyAll: boolean,
): MailAddress[] {
  const sender = parseAddressList(headers.get('reply-to') ?? headers.get('from') ?? '');
  const originalTo = parseAddressList(headers.get('to') ?? '');
  if (sender.every((address) => address.email.toLowerCase() === self)) return originalTo;
  return replyAll ? [...sender, ...originalTo] : sender;
}

/** Who gets the reply: the sender (or `Reply-To`); with `replyAll`, also the original's `To` and `Cc`. */
export function replyRecipients(
  headers: ReadonlyMap<string, string>,
  selfEmail: string,
  replyAll: boolean,
): { to: MailAddress[]; cc: MailAddress[] } {
  const self = selfEmail.toLowerCase();
  const to = uniqueAddresses(replyToList(headers, self, replyAll), new Set([self]));
  if (to.length === 0) {
    throw new Error(
      'There is no recipient for the reply: the original message only has your own address.',
    );
  }
  const taken = new Set([self, ...to.map((address) => address.email.toLowerCase())]);
  const cc = replyAll ? uniqueAddresses(parseAddressList(headers.get('cc') ?? ''), taken) : [];
  return { to, cc };
}

/** Original text quoted with `> `, after the line "On <date>, <sender> wrote:". */
export function quotedText(message: GmailMessage): string {
  const headers = headerValues(message.payload?.headers ?? []);
  const body = truncateText(messageBodyText(message.payload), MAX_QUOTED_CHARS);
  const quoted = body
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n');
  return `On ${headers.get('date') ?? ''}, ${headers.get('from') ?? ''} wrote:\n${quoted}`;
}

/** Forwarded email block: separator, the original's headers and its text body. */
export function forwardedText(message: GmailMessage): string {
  const headers = headerValues(message.payload?.headers ?? []);
  const cc = headers.get('cc');
  return [
    FORWARD_SEPARATOR,
    `From: ${headers.get('from') ?? ''}`,
    `Date: ${headers.get('date') ?? ''}`,
    `Subject: ${headers.get('subject') ?? ''}`,
    `To: ${headers.get('to') ?? ''}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    '',
    messageBodyText(message.payload),
  ].join('\n');
}

/** Ready reply: recipients, `Re:`, thread kept and the original quoted below the new text. */
export function replyEmail(message: GmailMessage, options: ReplyOptions): PreparedEmail {
  const headers = headerValues(message.payload?.headers ?? []);
  const recipients = replyRecipients(headers, options.selfEmail, options.replyAll);
  return {
    threadId: message.threadId ?? null,
    email: {
      ...recipients,
      bcc: [],
      subject: prefixSubject(headers.get('subject') ?? '', 'Re'),
      body: `${options.body}\n\n${quotedText(message)}`,
      ...threadingHeaders(headers),
      attachments: [],
    },
  };
}

/** Ready forward: `Fwd:`, note, the original's block and the given attachments, in a new thread. */
export function forwardEmail(message: GmailMessage, options: ForwardOptions): PreparedEmail {
  const headers = headerValues(message.payload?.headers ?? []);
  const note = options.note.trim();
  return {
    threadId: null,
    email: {
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: prefixSubject(headers.get('subject') ?? '', 'Fwd'),
      body: `${note ? `${note}\n\n` : ''}${forwardedText(message)}`,
      inReplyTo: null,
      references: null,
      attachments: options.attachments,
    },
  };
}
