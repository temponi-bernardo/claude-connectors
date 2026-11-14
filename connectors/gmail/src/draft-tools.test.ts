import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  createDraftTool,
  deleteDraftTool,
  draftArgs,
  listDraftsTool,
  sendDraftTool,
  updateDraftTool,
} from './draft-tools.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { RECEIPT } from './fixtures/messages.js';
import {
  CREATE_HINTS,
  DESTRUCTIVE_HINTS,
  READ_ONLY_HINTS,
  SEND_HINTS,
} from '../../../src/mcp/annotations.js';

beforeEach(() => {
  clearAccessTokenCache();
});

describe('draftArgs', () => {
  it('converte os argumentos da ferramenta', () => {
    expect(
      draftArgs({ to: ['a@x.com'], cc: [], bcc: [], subject: 's', body: 'b', reply_all: false }),
    ).toEqual({
      to: ['a@x.com'],
      cc: [],
      bcc: [],
      subject: 's',
      body: 'b',
      replyToMessageId: null,
      replyAll: false,
    });
    const reply = draftArgs({
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: 'b',
      reply_all: true,
      reply_to_message_id: 'm1',
    });
    expect(reply).toMatchObject({ replyToMessageId: 'm1', replyAll: true });
  });
});

describe('ferramentas de rascunho', () => {
  it('anotações: listar lê, criar cria, editar e apagar destroem, enviar envia', () => {
    expect(listDraftsTool.annotations).toMatchObject(READ_ONLY_HINTS);
    expect(createDraftTool.annotations).toMatchObject(CREATE_HINTS);
    expect(updateDraftTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
    expect(deleteDraftTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
    expect(sendDraftTool.annotations).toMatchObject(SEND_HINTS);
  });

  it('list_drafts lista os rascunhos', async () => {
    const deps = await linkedTestDeps([
      gmailRoute({
        drafts: { drafts: [{ id: 'd1' }] },
        'drafts/d1': { id: 'd1', message: RECEIPT },
      }),
    ]);
    expect(await listDraftsTool.run(deps, { account: 'dono' })).toMatchObject({
      drafts: [{ draft_id: 'd1', subject: 'Seu recibo FL Cloud' }],
    });
  });

  it('create, update, send e delete', async () => {
    const writes: GmailWrite[] = [];
    const route = gmailWriteRoute(writes, (w) => (w.method === 'DELETE' ? null : { id: 'd1' }));
    const deps = await linkedTestDeps([route, gmailRoute({ 'messages/m1': RECEIPT })]);
    const created = await createDraftTool.run(deps, {
      account: 'dono',
      to: ['a@x.com'],
      subject: 'Oi',
      body: 'Texto',
    });
    expect(created).toMatchObject({ account: 'dono', draft_id: 'd1' });
    await updateDraftTool.run(deps, {
      account: 'dono',
      draft_id: 'd1',
      body: 'Nova versão',
      reply_to_message_id: 'm1',
    });
    await sendDraftTool.run(deps, { account: 'dono', draft_id: 'd1' });
    await deleteDraftTool.run(deps, { account: 'dono', draft_id: 'd1' });
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST drafts',
      'PUT drafts/d1',
      'POST drafts/send',
      'DELETE drafts/d1',
    ]);
    expect(writes[1]?.body).toMatchObject({ message: { threadId: 't1' } });
  });

  it('rascunho novo sem destinatário é recusado', async () => {
    const deps = await linkedTestDeps([]);
    await expect(createDraftTool.run(deps, { account: 'dono', body: 'x' })).rejects.toThrow(
      /at least one/,
    );
  });
});
