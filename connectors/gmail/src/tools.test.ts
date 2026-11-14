import { deflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it } from 'vitest';
import { runToolSafely } from '../../../src/mcp/tools.js';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  gmailRoute,
  linkedTestDeps,
  TEST_OWNER,
  TEST_REFS,
  TEST_TOKEN_KEY,
  testAccount,
  testDeps,
  type FakeRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { b64, RECEIPT, THREAD } from './fixtures/messages.js';
import { UNTRUSTED_NOTICE } from './message-format.js';
import { loadOwnerAccounts, saveOwnerAccounts } from './token-store.js';
import {
  accountLabels,
  accountStatus,
  getAttachmentTextTool,
  getMessageTool,
  getThreadTool,
  GMAIL_ID,
  GMAIL_TOOLS,
  linkAccountTool,
  listAccountsTool,
  listLabelsTool,
  ownerRefs,
  resolveOwnerAccounts,
  resolveSingleAccount,
  searchThreadsTool,
  unlinkAccountTool,
  withUntrustedNotice,
} from './tools.js';

const OWNER_REF = TEST_REFS[0]!;
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

/** Rota da revogação do Google, que registra o token revogado. */
function revokeRoute(revoked: string[]): FakeRoute {
  return (url, init) => {
    if (url.href !== 'https://oauth2.googleapis.com/revoke') return undefined;
    revoked.push(new URLSearchParams(init?.body as string).get('token') ?? '');
    return new Response('');
  };
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('auxiliares', () => {
  it('GMAIL_ID aceita só ids seguros', () => {
    expect(GMAIL_ID.safeParse('18c2a_B-9').success).toBe(true);
    expect(GMAIL_ID.safeParse('../labels').success).toBe(false);
    expect(GMAIL_ID.safeParse('').success).toBe(false);
  });

  it('ownerRefs e resolveOwnerAccounts só veem as contas do próprio usuário', async () => {
    const deps = await linkedTestDeps([]);
    expect((await ownerRefs(deps)).map((r) => r.alias)).toEqual(['dono', 'musica']);
    const stranger = { ...deps, owner: 'outro-usuario' };
    expect(await ownerRefs(stranger)).toEqual([]);
    await expect(resolveOwnerAccounts(stranger, 'all')).rejects.toThrow(/link_account/);
  });

  it('resolveSingleAccount recusa "all"', async () => {
    const deps = await linkedTestDeps([]);
    expect((await resolveSingleAccount(deps, 'musica')).alias).toBe('musica');
    await expect(resolveSingleAccount(deps, 'all')).rejects.toThrow(/conta específica/);
  });

  it('withUntrustedNotice põe o aviso primeiro', () => {
    expect(Object.keys(withUntrustedNotice({ a: 1 }))).toEqual(['notice', 'a']);
  });

  it('GMAIL_TOOLS tem as oito ferramentas', () => {
    expect(GMAIL_TOOLS.map((t) => t.name)).toEqual([
      'list_accounts',
      'link_account',
      'unlink_account',
      'search_threads',
      'get_thread',
      'get_message',
      'list_labels',
      'get_attachment_text',
    ]);
  });
});

describe('list_accounts', () => {
  it('mostra ok, revogada e erro de token', async () => {
    const deps = await linkedTestDeps([]);
    expect(await accountStatus(deps, OWNER_REF)).toMatchObject({ account: 'dono', status: 'ok' });
    const revoked = { ...OWNER_REF, account: { ...OWNER_REF.account, status: 'revoked' as const } };
    expect(await accountStatus(deps, revoked)).toMatchObject({ status: 'needs_relink' });
    clearAccessTokenCache();
    const broken = { ...OWNER_REF, account: { ...OWNER_REF.account, refreshToken: 'revogado' } };
    expect(await accountStatus(deps, broken)).toMatchObject({ status: 'token_error' });
  });

  it('a ferramenta lista as contas ou sugere link_account', async () => {
    const deps = await linkedTestDeps([]);
    const result = (await listAccountsTool.run(deps, {})) as { accounts: unknown[] };
    expect(result.accounts).toHaveLength(2);
    expect(await listAccountsTool.run(testDeps(fakeFetch([])), {})).toMatchObject({
      accounts: [],
      hint: expect.stringContaining('link_account') as string,
    });
  });
});

describe('link_account e unlink_account', () => {
  it('link_account devolve o link de uso único', async () => {
    const result = (await linkAccountTool.run(testDeps(fakeFetch([])), {})) as Record<
      string,
      unknown
    >;
    expect(String(result.link_url)).toMatch(/^https:\/\/gmail\.test\/accounts\/link\?ticket=/);
    expect(result.expires_in_minutes).toBe(10);
  });

  it('unlink_account revoga no Google e remove só aquela conta', async () => {
    const revoked: string[] = [];
    const deps = await linkedTestDeps([revokeRoute(revoked)]);
    const result = await unlinkAccountTool.run(deps, { account: 'musica' });
    expect(result).toEqual({ unlinked: 'musica', revoked_at_google: true });
    expect(revoked).toEqual(['r-musica']);
    const left = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(left.map((a) => a.email)).toEqual(['dono@example.com']);
  });

  it('unlink_account remove mesmo se o Google não responder', async () => {
    const deps = testDeps(() => Promise.reject(new Error('rede')));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('dono@example.com')],
    });
    expect(await unlinkAccountTool.run(deps, { account: 'dono' })).toMatchObject({
      revoked_at_google: false,
    });
    expect(deps.kv.entries.size).toBe(0);
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
    const args = { account: 'dono', thread_id: 't1' };
    const text = (await getThreadTool.run(deps, args)) as Record<string, unknown>;
    expect(text).toMatchObject({ notice: UNTRUSTED_NOTICE, account: 'dono', message_count: 2 });
    expect(new URL(calls.at(-1)!.url).searchParams.get('format')).toBe('full');
    await getThreadTool.run(deps, { ...args, format: 'minimal' });
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
    expect(await accountLabels(deps, OWNER_REF)).toEqual({
      account: 'dono',
      labels: [
        { id: 'INBOX', name: 'INBOX', type: 'system' },
        { id: 'L1', name: 'Recibos', type: 'user' },
      ],
    });
  });

  it('list_labels sem rótulos devolve lista vazia', async () => {
    const deps = await linkedTestDeps([gmailRoute({ labels: {} })]);
    expect(await accountLabels(deps, OWNER_REF)).toEqual({ account: 'dono', labels: [] });
  });

  it('get_attachment_text extrai o texto do PDF', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const args = { account: 'dono', message_id: 'm1', attachment_id: 'att-1' };
    expect(await getAttachmentTextTool.run(deps, args)).toMatchObject({ text: 'Recibo' });
  });

  it('erros viram resultado MCP com isError e mensagem acionável', async () => {
    const deps = testDeps(fakeFetch([]));
    const args = { account: 'dono', message_id: 'm1' };
    const result = await runToolSafely(getMessageTool, deps, args);
    expect(result.isError).toBe(true);
    expect(result.content[0]).toMatchObject({
      text: expect.stringMatching(/link_account/) as string,
    });
    const bad = await runToolSafely(getThreadTool, deps, { account: 'dono', thread_id: '../x' });
    expect(bad.isError).toBe(true);
  });
});
