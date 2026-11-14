import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  READONLY_SCOPE,
  TEST_EMAILS,
  TEST_OWNER,
  TEST_TOKEN_KEY,
  testAccount,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { b64, RECEIPT } from './fixtures/messages.js';
import {
  forwardEmailTool,
  replyAllEmailTool,
  replyEmailTool,
  replyTool,
  sendEmailTool,
} from './send-tools.js';
import { saveOwnerAccounts } from './token-store.js';
import { SEND_HINTS } from './tools.js';

const ORIGINAL = gmailRoute({
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: 3, data: b64('PDF') },
});

/** Dependências com rota de escrita (que responde o id do envio) e a leitura do original. */
async function writableDeps(writes: GmailWrite[]) {
  const route = gmailWriteRoute(writes, () => ({ id: 's1', threadId: 't1' }));
  return linkedTestDeps([route, ORIGINAL]);
}

/** MIME do envio registrado. */
function sentMime(writes: GmailWrite[]): string {
  return Buffer.from((writes[0]?.body as { raw: string }).raw, 'base64url').toString();
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('ferramentas de envio', () => {
  it('todas pedem confirmação (destructiveHint) e não são idempotentes', () => {
    for (const tool of [sendEmailTool, replyEmailTool, replyAllEmailTool, forwardEmailTool]) {
      expect(tool.annotations).toEqual(SEND_HINTS);
      expect(tool.description).toMatch(/confirmation/);
    }
  });

  it('send_email envia pela conta pedida', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    const result = await sendEmailTool.run(deps, {
      account: 'musica',
      to: ['ana@example.com'],
      subject: 'Oi',
      body: 'Tudo bem?',
    });
    expect(result).toEqual({ account: 'musica', sent: true, message_id: 's1', thread_id: 't1' });
    expect(sentMime(writes)).toContain('To: ana@example.com');
  });

  it('send_email recusa "all" e listas vazias', async () => {
    const deps = await writableDeps([]);
    const args = { account: 'all', to: ['a@x.com'], subject: '', body: '' };
    await expect(sendEmailTool.run(deps, args)).rejects.toThrow(/conta específica/);
    await expect(sendEmailTool.run(deps, { ...args, account: 'dono', to: [] })).rejects.toThrow();
  });

  it('reply_email e reply_all_email mantêm a conversa', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    await replyEmailTool.run(deps, { account: 'dono', message_id: 'm1', body: 'Obrigado' });
    await replyAllEmailTool.run(deps, { account: 'dono', message_id: 'm1', body: 'Obrigado' });
    expect(writes.map((w) => (w.body as { threadId?: string }).threadId)).toEqual(['t1', 't1']);
    expect(sentMime(writes)).toContain('Subject: Re: Seu recibo FL Cloud');
  });

  it('replyTool monta a ferramenta com o nome dado', () => {
    expect(replyTool({ name: 'x', replyAll: true, description: 'd' }).name).toBe('x');
  });

  it('forward_email leva os anexos originais', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    await forwardEmailTool.run(deps, {
      account: 'dono',
      message_id: 'm1',
      to: ['z@example.com'],
      note: 'Segue',
    });
    const mime = sentMime(writes);
    expect(mime).toContain('multipart/mixed');
    expect(mime).toContain('filename="recibo.pdf"');
  });

  it('conta só leitura recebe o pedido de novo vínculo antes de ler o original', async () => {
    const writes: GmailWrite[] = [];
    const deps = await writableDeps(writes);
    const accounts = TEST_EMAILS.map((email) => testAccount(email, { scope: READONLY_SCOPE }));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts });
    await expect(
      replyEmailTool.run(deps, { account: 'dono', message_id: 'm1', body: 'x' }),
    ).rejects.toThrow(/só para leitura.*link_account/s);
    expect(writes).toHaveLength(0);
  });
});
