import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  READONLY_SCOPE,
  TEST_REFS,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { b64, RECEIPT } from './fixtures/messages.js';
import {
  checkRecipientLimit,
  composeEmail,
  fetchFullMessage,
  forwardAttachments,
  gmailMessageResource,
  MAX_FORWARD_BYTES,
  MAX_RECIPIENTS,
  mimeBoundary,
  prepareForward,
  prepareReply,
  sendPrepared,
  sentResult,
} from './send.js';

const OWNER = TEST_REFS[0]!;
const ARGS = { to: ['Ana <ana@example.com>'], cc: [], bcc: [], subject: 'Oi', body: 'Olá' };
const ORIGINAL_ROUTES = gmailRoute({
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: 3, data: b64('PDF') },
});

/** Decodifica o `raw` de um envio registrado. */
function rawOf(write: GmailWrite | undefined): string {
  const body = write?.body as { raw?: string } | null;
  return Buffer.from(body?.raw ?? '', 'base64url').toString('utf8');
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('composeEmail', () => {
  it('valida e monta um e-mail novo, sem conversa', () => {
    const prepared = composeEmail({ ...ARGS, cc: ['c@x.com'], bcc: ['b@x.com'] });
    expect(prepared.threadId).toBeNull();
    expect(prepared.email).toMatchObject({
      to: [{ name: 'Ana', email: 'ana@example.com' }],
      cc: [{ name: '', email: 'c@x.com' }],
      bcc: [{ name: '', email: 'b@x.com' }],
      subject: 'Oi',
      body: 'Olá',
      inReplyTo: null,
      attachments: [],
    });
  });

  it('recusa endereço inválido', () => {
    expect(() => composeEmail({ ...ARGS, to: ['ruim'] })).toThrow(/to/);
  });
});

describe('checkRecipientLimit', () => {
  it('exige ao menos um destinatário e no máximo o limite', () => {
    const email = composeEmail(ARGS).email;
    expect(() => {
      checkRecipientLimit(email);
    }).not.toThrow();
    expect(() => {
      checkRecipientLimit({ ...email, to: [] });
    }).toThrow(/at least one/);
    const many = Array.from({ length: MAX_RECIPIENTS + 1 }, (_, i) => ({
      name: '',
      email: `p${i}@x.com`,
    }));
    expect(() => {
      checkRecipientLimit({ ...email, to: many });
    }).toThrow(/at most/);
  });
});

describe('recurso da Gmail API', () => {
  it('mimeBoundary é aleatória e segura', () => {
    expect(mimeBoundary()).toMatch(/^=_part_[A-Za-z0-9_-]+$/);
    expect(mimeBoundary()).not.toBe(mimeBoundary());
  });

  it('gmailMessageResource leva raw e threadId só quando houver', () => {
    const fresh = gmailMessageResource(composeEmail(ARGS));
    expect(Object.keys(fresh)).toEqual(['raw']);
    const reply = gmailMessageResource({ ...composeEmail(ARGS), threadId: 't1' });
    expect(reply.threadId).toBe('t1');
    expect(Buffer.from(reply.raw, 'base64url').toString()).toContain('To: "Ana"');
  });
});

describe('envio', () => {
  it('sendPrepared posta em messages/send e devolve os ids', async () => {
    const writes: GmailWrite[] = [];
    const route = gmailWriteRoute(writes, () => ({ id: 's1', threadId: 't9' }));
    const deps = await linkedTestDeps([route]);
    expect(await sendPrepared(deps, OWNER, composeEmail(ARGS))).toEqual({
      account: 'dono',
      sent: true,
      message_id: 's1',
      thread_id: 't9',
    });
    expect(writes[0]?.path).toBe('messages/send');
    expect(rawOf(writes[0])).toContain('Subject: Oi');
  });

  it('conta só leitura não envia e pede novo vínculo', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes)]);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    await expect(sendPrepared(deps, old, composeEmail(ARGS))).rejects.toThrow(/link_account/);
    expect(writes).toHaveLength(0);
  });
});

describe('sentResult', () => {
  it('usa nulo quando o Gmail não devolve ids', () => {
    expect(sentResult('dono', {})).toEqual({
      account: 'dono',
      sent: true,
      message_id: null,
      thread_id: null,
    });
  });
});

describe('resposta e encaminhamento', () => {
  it('fetchFullMessage lê a mensagem no formato full', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    expect((await fetchFullMessage(deps, OWNER, 'm1')).id).toBe('m1');
  });

  it('prepareReply responde ao remetente na mesma conversa', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const prepared = await prepareReply(deps, OWNER, {
      messageId: 'm1',
      body: 'Recebido',
      replyAll: false,
    });
    expect(prepared.threadId).toBe('t1');
    expect(prepared.email.to).toEqual([
      { name: 'Image-Line', email: 'noreply@image-line.example' },
    ]);
    expect(prepared.email.subject).toBe('Re: Seu recibo FL Cloud');
  });

  it('forwardAttachments baixa os anexos originais', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const attachments = await forwardAttachments(deps, OWNER, RECEIPT);
    expect(attachments).toHaveLength(1);
    expect(attachments[0]).toMatchObject({ filename: 'recibo.pdf', mimeType: 'application/pdf' });
    expect(Buffer.from(attachments[0]?.data ?? []).toString()).toBe('PDF');
  });

  it('forwardAttachments recusa anexos grandes demais antes de baixar', async () => {
    const deps = await linkedTestDeps([]);
    const big = structuredClone(RECEIPT) as typeof RECEIPT & { payload: { parts: unknown[] } };
    const part = big.payload.parts[1] as { body: { size: number } };
    part.body.size = MAX_FORWARD_BYTES + 1;
    await expect(forwardAttachments(deps, OWNER, big)).rejects.toThrow(/MB/);
  });

  it('prepareForward valida destinatários e inclui os anexos', async () => {
    const deps = await linkedTestDeps([ORIGINAL_ROUTES]);
    const prepared = await prepareForward(deps, OWNER, {
      messageId: 'm1',
      to: ['z@x.com'],
      cc: [],
      bcc: [],
      note: 'Para você',
    });
    expect(prepared.email.subject).toBe('Fwd: Seu recibo FL Cloud');
    expect(prepared.email.attachments).toHaveLength(1);
    await expect(
      prepareForward(deps, OWNER, { messageId: 'm1', to: [], cc: [], bcc: [], note: '' }),
    ).rejects.toThrow(/at least one/);
  });
});
