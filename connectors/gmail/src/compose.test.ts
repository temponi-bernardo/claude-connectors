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

const SELF = 'dono@example.com';

/** Mensagem original com os cabeçalhos dados e corpo em texto. */
function original(headers: Record<string, string>, body = 'linha 1\nlinha 2'): GmailMessage {
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
  To: 'Dono <DONO@example.com>, bia@example.com',
  Cc: 'carla@example.com, ana@example.com',
  Subject: 'Orçamento',
  Date: 'Tue, 10 Nov 2026 10:00:00 +0000',
  'Message-ID': '<m1@mail.example>',
  References: '<m0@mail.example>',
});

describe('assunto e conversa', () => {
  it('prefixSubject não repete o prefixo', () => {
    expect(prefixSubject('Oi', 'Re')).toBe('Re: Oi');
    expect(prefixSubject('RE: Oi', 'Re')).toBe('RE: Oi');
    expect(prefixSubject('Oi', 'Fwd')).toBe('Fwd: Oi');
    expect(prefixSubject('Fw: Oi', 'Fwd')).toBe('Fw: Oi');
    expect(prefixSubject('', 'Re')).toBe('Re:');
  });

  it('threadingHeaders junta References e Message-ID', () => {
    expect(threadingHeaders(headerValues(ORIGINAL.payload?.headers ?? []))).toEqual({
      inReplyTo: '<m1@mail.example>',
      references: '<m0@mail.example> <m1@mail.example>',
    });
    expect(threadingHeaders(new Map())).toEqual({ inReplyTo: null, references: null });
  });
});

describe('destinatários da resposta', () => {
  it('uniqueAddresses tira repetidos e excluídos sem diferenciar maiúsculas', () => {
    const list = [
      { name: 'A', email: 'a@x.com' },
      { name: '', email: 'A@x.com' },
      { name: '', email: 'b@x.com' },
    ];
    expect(uniqueAddresses(list, new Set(['b@x.com']))).toEqual([{ name: 'A', email: 'a@x.com' }]);
  });

  it('responder vai só para o remetente (ou Reply-To)', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyRecipients(headers, SELF, false)).toEqual({
      to: [{ name: 'Ana', email: 'ana@example.com' }],
      cc: [],
    });
    headers.set('reply-to', 'lista@example.com');
    expect(replyRecipients(headers, SELF, false).to).toEqual([
      { name: '', email: 'lista@example.com' },
    ]);
  });

  it('responder a todos inclui To e Cc, sem a própria conta e sem repetir', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyRecipients(headers, SELF, true)).toEqual({
      to: [
        { name: 'Ana', email: 'ana@example.com' },
        { name: '', email: 'bia@example.com' },
      ],
      cc: [{ name: '', email: 'carla@example.com' }],
    });
  });

  it('resposta a uma mensagem enviada por você vai para os destinatários originais', () => {
    const sent = headerValues([
      { name: 'From', value: 'Dono <dono@example.com>' },
      { name: 'To', value: 'ana@example.com' },
    ]);
    expect(replyRecipients(sent, SELF, false).to).toEqual([{ name: '', email: 'ana@example.com' }]);
  });

  it('replyToList: remetente, todos, ou os destinatários se a original é sua', () => {
    const headers = headerValues(ORIGINAL.payload?.headers ?? []);
    expect(replyToList(headers, SELF, false)).toHaveLength(1);
    expect(replyToList(headers, SELF, true)).toHaveLength(3);
    const sent = headerValues([
      { name: 'From', value: SELF },
      { name: 'To', value: 'a@x.com' },
    ]);
    expect(replyToList(sent, SELF, true)).toEqual([{ name: '', email: 'a@x.com' }]);
  });

  it('sem destinatário possível lança erro', () => {
    const onlySelf = headerValues([{ name: 'From', value: SELF }]);
    expect(() => replyRecipients(onlySelf, SELF, true)).toThrow(/destinatário/);
  });
});

describe('textos citados', () => {
  it('quotedText cita o original com data e remetente', () => {
    expect(quotedText(ORIGINAL)).toBe(
      'Em Tue, 10 Nov 2026 10:00:00 +0000, Ana <ana@example.com> escreveu:\n> linha 1\n> linha 2',
    );
  });

  it('forwardedText traz o bloco de cabeçalhos e o corpo', () => {
    const text = forwardedText(ORIGINAL);
    expect(text).toContain('---------- Mensagem encaminhada ----------');
    expect(text).toContain('De: Ana <ana@example.com>');
    expect(text).toContain('Assunto: Orçamento');
    expect(text).toContain('Cc: carla@example.com, ana@example.com');
    expect(text.endsWith('linha 1\nlinha 2')).toBe(true);
    const noCc = forwardedText(original({ From: 'a@x.com' }, 'x'));
    expect(noCc).not.toContain('Cc:');
  });
});

describe('e-mails prontos', () => {
  it('replyEmail mantém a conversa e cita o original', () => {
    const prepared = replyEmail(ORIGINAL, { body: 'Combinado.', replyAll: true, selfEmail: SELF });
    expect(prepared.threadId).toBe('t1');
    expect(prepared.email).toMatchObject({
      subject: 'Re: Orçamento',
      inReplyTo: '<m1@mail.example>',
      references: '<m0@mail.example> <m1@mail.example>',
      bcc: [],
      attachments: [],
    });
    expect(prepared.email.to).toHaveLength(2);
    expect(prepared.email.body.startsWith('Combinado.\n\nEm Tue')).toBe(true);
  });

  it('replyEmail sem threadId usa nulo', () => {
    const noThread: GmailMessage = { id: ORIGINAL.id, payload: ORIGINAL.payload! };
    expect(replyEmail(noThread, { body: 'x', replyAll: false, selfEmail: SELF }).threadId).toBe(
      null,
    );
  });

  it('forwardEmail junta a nota, o original e os anexos, em conversa nova', () => {
    const attachments = [
      { filename: 'a.pdf', mimeType: 'application/pdf', data: new Uint8Array() },
    ];
    const to = [{ name: '', email: 'z@x.com' }];
    const prepared = forwardEmail(ORIGINAL, { to, cc: [], bcc: [], note: 'Veja.', attachments });
    expect(prepared.threadId).toBeNull();
    expect(prepared.email).toMatchObject({ subject: 'Fwd: Orçamento', to, attachments });
    expect(prepared.email.body.startsWith('Veja.\n\n---------- Mensagem')).toBe(true);
    const bare = forwardEmail(ORIGINAL, { to, cc: [], bcc: [], note: '', attachments: [] });
    expect(bare.email.body.startsWith('---------- Mensagem')).toBe(true);
  });
});
