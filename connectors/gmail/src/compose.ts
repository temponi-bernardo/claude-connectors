/**
 * Composição de respostas e encaminhamentos a partir da mensagem original: assunto com `Re:`/`Fwd:`,
 * destinatários (responder ou responder a todos, sem a própria conta), cabeçalhos de conversa
 * (`In-Reply-To`, `References`) e o texto citado. Pura.
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

/** E-mail pronto para enviar ou guardar como rascunho, com a conversa (`threadId`) a manter. */
export interface PreparedEmail {
  readonly email: OutgoingEmail;
  readonly threadId: string | null;
}

/** Como responder: texto novo, se é para todos e o endereço da própria conta (excluído). */
export interface ReplyOptions {
  readonly body: string;
  readonly replyAll: boolean;
  readonly selfEmail: string;
}

/** Destinatários, nota e anexos de um encaminhamento. */
export interface ForwardOptions {
  readonly to: readonly MailAddress[];
  readonly cc: readonly MailAddress[];
  readonly bcc: readonly MailAddress[];
  readonly note: string;
  readonly attachments: readonly MailAttachment[];
}

/** Maior trecho do original citado numa resposta, em caracteres. */
export const MAX_QUOTED_CHARS = 20_000;

/** Linha que abre o bloco do e-mail encaminhado. */
export const FORWARD_SEPARATOR = '---------- Mensagem encaminhada ----------';

/** Assunto com `Re:` ou `Fwd:` na frente, sem repetir se já houver (`RE:`, `Fw:`...). */
export function prefixSubject(subject: string, prefix: 'Re' | 'Fwd'): string {
  const pattern = prefix === 'Re' ? /^re:/i : /^fwd?:/i;
  return pattern.test(subject.trim()) ? subject : `${prefix}: ${subject}`.trim();
}

/** Cabeçalhos que mantêm a conversa numa resposta. */
export interface ThreadingHeaders {
  readonly inReplyTo: string | null;
  readonly references: string | null;
}

/** `In-Reply-To` e `References` da resposta a partir dos cabeçalhos do original. */
export function threadingHeaders(headers: ReadonlyMap<string, string>): ThreadingHeaders {
  const messageId = headers.get('message-id');
  return {
    inReplyTo: messageIdList(messageId),
    references: messageIdList(`${headers.get('references') ?? ''} ${messageId ?? ''}`),
  };
}

/** Endereços sem repetidos e sem os excluídos (comparação sem maiúsculas). */
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

/** Candidatos a `To` da resposta: remetente (ou `Reply-To`), ou os destinatários se a original é sua. */
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

/** Para quem vai a resposta: remetente (ou `Reply-To`); com `replyAll`, também `To` e `Cc` do original. */
export function replyRecipients(
  headers: ReadonlyMap<string, string>,
  selfEmail: string,
  replyAll: boolean,
): { to: MailAddress[]; cc: MailAddress[] } {
  const self = selfEmail.toLowerCase();
  const to = uniqueAddresses(replyToList(headers, self, replyAll), new Set([self]));
  if (to.length === 0) {
    throw new Error(
      'Não há destinatário para a resposta: a mensagem original só tem o seu endereço.',
    );
  }
  const taken = new Set([self, ...to.map((address) => address.email.toLowerCase())]);
  const cc = replyAll ? uniqueAddresses(parseAddressList(headers.get('cc') ?? ''), taken) : [];
  return { to, cc };
}

/** Texto do original citado com `> `, depois da linha "Em <data>, <remetente> escreveu:". */
export function quotedText(message: GmailMessage): string {
  const headers = headerValues(message.payload?.headers ?? []);
  const body = truncateText(messageBodyText(message.payload), MAX_QUOTED_CHARS);
  const quoted = body
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n');
  return `Em ${headers.get('date') ?? ''}, ${headers.get('from') ?? ''} escreveu:\n${quoted}`;
}

/** Bloco do e-mail encaminhado: separador, cabeçalhos do original e o corpo em texto. */
export function forwardedText(message: GmailMessage): string {
  const headers = headerValues(message.payload?.headers ?? []);
  const cc = headers.get('cc');
  return [
    FORWARD_SEPARATOR,
    `De: ${headers.get('from') ?? ''}`,
    `Data: ${headers.get('date') ?? ''}`,
    `Assunto: ${headers.get('subject') ?? ''}`,
    `Para: ${headers.get('to') ?? ''}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    '',
    messageBodyText(message.payload),
  ].join('\n');
}

/** Resposta pronta: destinatários, `Re:`, conversa mantida e o original citado abaixo do texto novo. */
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

/** Encaminhamento pronto: `Fwd:`, nota, bloco do original e os anexos dados, numa conversa nova. */
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
