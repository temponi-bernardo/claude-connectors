/**
 * Leitura de anexos como texto: o tipo é detectado pelos próprios bytes (o Gmail não devolve o MIME no
 * download e o `attachmentId` muda a cada leitura). Aceita PDF, Word, HTML e texto; o resto é recusado.
 */
import { htmlToText } from '../../../src/core/html.js';
import { pdfToText, isPdf } from '../../../src/core/pdf.js';
import { wordToText } from '../../../src/core/word.js';
import type { AllowedAccount } from './config.js';
import type { GmailDeps } from './context.js';
import { gmailGet, gmailUrl } from './gmail-api.js';
import { base64UrlToBytes, truncateText } from './message-format.js';

/** Maior anexo lido como texto (5 MB). */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** Maior texto devolvido de um anexo, em caracteres. */
export const MAX_ATTACHMENT_CHARS = 50_000;

/** Tipo de anexo reconhecido pelos bytes. */
export type AttachmentKind = 'pdf' | 'docx' | 'doc' | 'html' | 'text' | null;

/** Diz se o texto parece texto de verdade (sem caracteres de controle além de espaços e quebras). */
export function looksLikeText(text: string): boolean {
  const sample = text.slice(0, 4096);
  let control = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0xfffd || (code < 0x20 && ![0x09, 0x0a, 0x0c, 0x0d].includes(code))) control++;
  }
  return sample.length > 0 && control / sample.length < 0.01;
}

/** Detecta o tipo do anexo pelos primeiros bytes e, para texto, pelo conteúdo. */
export function detectAttachmentKind(bytes: Uint8Array): AttachmentKind {
  if (isPdf(bytes)) return 'pdf';
  const magic = Array.from(bytes.subarray(0, 4), (b) => b.toString(16).padStart(2, '0')).join('');
  if (magic === '504b0304') return 'docx';
  if (magic === 'd0cf11e0') return 'doc';
  const text = new TextDecoder().decode(bytes.subarray(0, 4096));
  if (!looksLikeText(text)) return null;
  return /<html|<body|<div|<table/i.test(text) ? 'html' : 'text';
}

/** Converte os bytes do anexo em texto conforme o tipo; lança erro para tipos não suportados. */
export async function attachmentBytesToText(bytes: Uint8Array): Promise<string> {
  const kind = detectAttachmentKind(bytes);
  if (kind === 'pdf') return pdfToText(bytes);
  if (kind === 'docx' || kind === 'doc') return wordToText(kind, bytes);
  if (kind === null) {
    throw new Error('Tipo de anexo não suportado: só PDF, Word (.doc/.docx), HTML e texto.');
  }
  const text = new TextDecoder().decode(bytes);
  return kind === 'html' ? htmlToText(text) : text;
}

/** Baixa um anexo e devolve o texto (limitado); recusa anexos acima de 5 MB. */
export async function readAttachmentText(
  deps: GmailDeps,
  account: AllowedAccount,
  ids: { readonly messageId: string; readonly attachmentId: string },
): Promise<Record<string, unknown>> {
  const path = `messages/${ids.messageId}/attachments/${ids.attachmentId}`;
  const body = await gmailGet<{ size?: number; data?: string }>(deps, account, gmailUrl(path));
  const size = body.size ?? 0;
  if (size > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `Anexo de ${(size / 1024 / 1024).toFixed(1)} MB, acima do limite de 5 MB para leitura.`,
    );
  }
  const text = await attachmentBytesToText(base64UrlToBytes(body.data ?? ''));
  return {
    account: account.alias,
    message_id: ids.messageId,
    size,
    text: truncateText(
      text || '(sem texto extraível: talvez seja um PDF escaneado)',
      MAX_ATTACHMENT_CHARS,
    ),
  };
}
