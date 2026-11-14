import { deflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it } from 'vitest';
import { runToolSafely } from '../../../src/mcp/tools.js';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  gmailRoute,
  linkedTestDeps,
  TEST_ACCOUNTS,
  TEST_TOKEN_KEY,
  testDeps,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { b64, RECEIPT, THREAD } from './fixtures/messages.js';
import { UNTRUSTED_NOTICE } from './message-format.js';
import { saveLinkedAccount } from './token-store.js';
import {
  accountLabels,
  accountStatus,
  getAttachmentTextTool,
  getMessageTool,
  getThreadTool,
  GMAIL_ID,
  GMAIL_TOOLS,
  listAccountsTool,
  listLabelsTool,
  resolveSingleAccount,
  searchThreadsTool,
  withUntrustedNotice,
} from './tools.js';

const [OWNER, MUSIC] = [TEST_ACCOUNTS[0]!, TEST_ACCOUNTS[1]!];
const LABELS = {
  labels: [
    { id: 'INBOX', name: 'INBOX', type: 'system' },
    { id: 'L1', name: 'Recibos' },
  ],
};
const PDF = Buffer.concat([
  Buffer.from(
    '%PDF-1.4\n1 0 obj << /Type /Pages /Kids [2 0 R] >> endobj\n2 0 obj << /Type /Page /Contents 3 0 R >> endobj\n3 0 obj << /Filter /FlateDecode >>\nstream\n',
  ),
  deflateSync('BT (Recibo) Tj ET'),
  Buffer.from('\nendstream\nendobj'),
]);
const GMAIL = gmailRoute({
  labels: LABELS,
  'threads/t1': THREAD,
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: PDF.length, data: b64(PDF) },
  threads: { threads: [] },
});

beforeEach(() => {
  clearAccessTokenCache();
});

describe('auxiliares', () => {
  it('GMAIL_ID aceita só ids seguros', () => {
    expect(GMAIL_ID.safeParse('18c2a_B-9').success).toBe(true);
    expect(GMAIL_ID.safeParse('../labels').success).toBe(false);
    expect(GMAIL_ID.safeParse('').success).toBe(false);
  });

  it('resolveSingleAccount recusa "all"', () => {
    const deps = testDeps(fakeFetch([]));
    expect(resolveSingleAccount(deps, 'musica')).toEqual(MUSIC);
    expect(() => resolveSingleAccount(deps, 'all')).toThrow(/conta específica/);
  });

  it('withUntrustedNotice põe o aviso primeiro', () => {
    expect(Object.keys(withUntrustedNotice({ a: 1 }))).toEqual(['notice', 'a']);
  });

  it('GMAIL_TOOLS tem as seis ferramentas, só leitura', () => {
    expect(GMAIL_TOOLS.map((t) => t.name)).toEqual([
      'list_accounts',
      'search_threads',
      'get_thread',
      'get_message',
      'list_labels',
      'get_attachment_text',
    ]);
  });
});

describe('list_accounts', () => {
  it('mostra vinculada, não vinculada, revogada e erro de token', async () => {
    const deps = await linkedTestDeps([], [], [OWNER]);
    expect(await accountStatus(deps, OWNER)).toMatchObject({ account: 'dono', status: 'ok' });
    expect(await accountStatus(deps, MUSIC)).toMatchObject({
      status: 'not_linked',
      link_url: 'https://gmail.test/accounts/link',
    });
    const linked = { email: MUSIC.email, scope: '', linkedAt: 'x' };
    await saveLinkedAccount(deps.kv, TEST_TOKEN_KEY, {
      ...linked,
      refreshToken: 'r',
      status: 'revoked',
    });
    expect(await accountStatus(deps, MUSIC)).toMatchObject({ status: 'needs_relink' });
    await saveLinkedAccount(deps.kv, TEST_TOKEN_KEY, {
      ...linked,
      refreshToken: 'revogado',
      status: 'active',
    });
    expect(await accountStatus(deps, MUSIC)).toMatchObject({ status: 'token_error' });
  });

  it('a ferramenta lista todas as contas', async () => {
    const deps = await linkedTestDeps([]);
    const result = (await listAccountsTool.run(deps, {})) as { accounts: unknown[] };
    expect(result.accounts).toHaveLength(2);
  });
});

describe('ferramentas de leitura', () => {
  it('search_threads aplica padrões e devolve o aviso', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([GMAIL], calls);
    const result = await searchThreadsTool.run(deps, { account: 'dono' });
    expect(result).toEqual({ notice: UNTRUSTED_NOTICE, threads: [], next_page_token: null });
    expect(new URL(calls.at(-1)!.url).searchParams.get('maxResults')).toBe('10');
  });

  it('get_thread pede full para text e metadata para minimal', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([GMAIL], calls);
    const text = (await getThreadTool.run(deps, { account: 'dono', thread_id: 't1' })) as Record<
      string,
      unknown
    >;
    expect(text).toMatchObject({ notice: UNTRUSTED_NOTICE, account: 'dono', message_count: 2 });
    expect(new URL(calls.at(-1)!.url).searchParams.get('format')).toBe('full');
    await getThreadTool.run(deps, { account: 'dono', thread_id: 't1', format: 'minimal' });
    expect(new URL(calls.at(-1)!.url).searchParams.get('format')).toBe('metadata');
  });

  it('get_message devolve corpo e anexos', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const result = await getMessageTool.run(deps, { account: 'dono', message_id: 'm1' });
    expect(result).toMatchObject({
      body: 'Total: US$ 9,99',
      attachments: [{ attachment_id: 'att-1' }],
    });
  });

  it('list_labels em todas as contas', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const result = (await listLabelsTool.run(deps, { account: 'all' })) as { results: unknown[] };
    expect(result.results).toHaveLength(2);
    expect(await accountLabels(deps, OWNER)).toEqual({
      account: 'dono',
      labels: [
        { id: 'INBOX', name: 'INBOX', type: 'system' },
        { id: 'L1', name: 'Recibos', type: 'user' },
      ],
    });
  });

  it('list_labels sem rótulos devolve lista vazia', async () => {
    const deps = await linkedTestDeps([gmailRoute({ labels: {} })]);
    expect(await accountLabels(deps, OWNER)).toEqual({ account: 'dono', labels: [] });
  });

  it('get_attachment_text extrai o texto do PDF', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const args = { account: 'dono', message_id: 'm1', attachment_id: 'att-1' };
    expect(await getAttachmentTextTool.run(deps, args)).toMatchObject({ text: 'Recibo' });
  });

  it('erros viram resultado MCP com isError e mensagem acionável', async () => {
    const deps = testDeps(fakeFetch([]));
    const result = await runToolSafely(getMessageTool, deps, { account: 'dono', message_id: 'm1' });
    expect(result.isError).toBe(true);
    expect(result.content[0]).toMatchObject({
      text: expect.stringMatching(/accounts\/link/) as string,
    });
    const bad = await runToolSafely(getThreadTool, deps, { account: 'dono', thread_id: '../x' });
    expect(bad.isError).toBe(true);
  });
});
