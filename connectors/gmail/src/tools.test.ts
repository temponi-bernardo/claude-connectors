import { deflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it } from 'vitest';
import { runToolSafely } from '../../../src/mcp/tools.js';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  gmailRoute,
  linkedTestDeps,
  READONLY_SCOPE,
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
  accountBase,
  accountStatus,
  getAttachmentTextTool,
  getMessageTool,
  getThreadTool,
  GMAIL_ID,
  linkAccountTool,
  listAccountsTool,
  listLabelsTool,
  ownerRefs,
  resolveOwnerAccounts,
  resolveSingleAccount,
  resolveWritableAccount,
  searchThreadsTool,
  unlinkAccountTool,
  withUntrustedNotice,
} from './tools.js';

const OWNER_REF = TEST_REFS[0]!;
const LABELS = {
  labels: [
    { id: 'INBOX', name: 'INBOX', type: 'system' },
    { id: 'L1', name: 'Receipts' },
  ],
};
const PDF = Buffer.concat([
  Buffer.from(
    '%PDF-1.4\n1 0 obj << /Type /Pages /Kids [2 0 R] >> endobj\n2 0 obj << /Type /Page /Contents 3 0 R >> endobj\n3 0 obj << /Filter /FlateDecode >>\nstream\n',
  ),
  deflateSync('BT (Receipt) Tj ET'),
  Buffer.from('\nendstream\nendobj'),
]);
const GMAIL = gmailRoute({
  labels: LABELS,
  'threads/t1': THREAD,
  'messages/m1': RECEIPT,
  'messages/m1/attachments/att-1': { size: PDF.length, data: b64(PDF) },
  threads: { threads: [] },
});

/** Google revocation route, which records the revoked token. */
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

describe('helpers', () => {
  it('GMAIL_ID accepts only safe ids', () => {
    expect(GMAIL_ID.safeParse('18c2a_B-9').success).toBe(true);
    expect(GMAIL_ID.safeParse('../labels').success).toBe(false);
    expect(GMAIL_ID.safeParse('').success).toBe(false);
  });

  it('ownerRefs and resolveOwnerAccounts only see the user own accounts', async () => {
    const deps = await linkedTestDeps([]);
    expect((await ownerRefs(deps)).map((r) => r.alias)).toEqual(['owner', 'music']);
    const stranger = { ...deps, owner: 'other-user' };
    expect(await ownerRefs(stranger)).toEqual([]);
    await expect(resolveOwnerAccounts(stranger, 'all')).rejects.toThrow(/link_account/);
  });

  it('resolveSingleAccount refuses "all"', async () => {
    const deps = await linkedTestDeps([]);
    expect((await resolveSingleAccount(deps, 'music')).alias).toBe('music');
    await expect(resolveSingleAccount(deps, 'all')).rejects.toThrow(/one specific account/);
  });

  it('withUntrustedNotice puts the notice first', () => {
    expect(Object.keys(withUntrustedNotice({ a: 1 }))).toEqual(['notice', 'a']);
  });
});

describe('write access', () => {
  it('accountBase shows write_access and the relinking hint', () => {
    expect(accountBase(OWNER_REF)).toMatchObject({ write_access: true });
    expect(accountBase(OWNER_REF)).not.toHaveProperty('hint');
    const old = { ...OWNER_REF, account: { ...OWNER_REF.account, scope: READONLY_SCOPE } };
    expect(accountBase(old)).toMatchObject({
      write_access: false,
      hint: expect.stringContaining('link_account') as string,
    });
  });

  it('resolveWritableAccount refuses a read-only account', async () => {
    const deps = await linkedTestDeps([]);
    expect((await resolveWritableAccount(deps, 'owner')).alias).toBe('owner');
    const accounts = [testAccount('owner@example.com', { scope: READONLY_SCOPE })];
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, { owner: TEST_OWNER, accounts });
    await expect(resolveWritableAccount(deps, 'owner')).rejects.toThrow(/read-only/);
  });
});

describe('list_accounts', () => {
  it('shows ok, revoked and token error', async () => {
    const deps = await linkedTestDeps([]);
    expect(await accountStatus(deps, OWNER_REF)).toMatchObject({ account: 'owner', status: 'ok' });
    const revoked = { ...OWNER_REF, account: { ...OWNER_REF.account, status: 'revoked' as const } };
    expect(await accountStatus(deps, revoked)).toMatchObject({ status: 'needs_relink' });
    clearAccessTokenCache();
    const broken = { ...OWNER_REF, account: { ...OWNER_REF.account, refreshToken: 'revoked' } };
    expect(await accountStatus(deps, broken)).toMatchObject({ status: 'token_error' });
  });

  it('the tool lists the accounts or suggests link_account', async () => {
    const deps = await linkedTestDeps([]);
    const result = (await listAccountsTool.run(deps, {})) as { accounts: unknown[] };
    expect(result.accounts).toHaveLength(2);
    expect(await listAccountsTool.run(testDeps(fakeFetch([])), {})).toMatchObject({
      accounts: [],
      hint: expect.stringContaining('link_account') as string,
    });
  });
});

describe('link_account and unlink_account', () => {
  it('link_account returns the single-use link', async () => {
    const result = (await linkAccountTool.run(testDeps(fakeFetch([])), {})) as Record<
      string,
      unknown
    >;
    expect(String(result.link_url)).toMatch(/^https:\/\/gmail\.test\/accounts\/link\?ticket=/);
    expect(result.expires_in_minutes).toBe(10);
  });

  it('unlink_account revokes at Google and removes only that account', async () => {
    const revoked: string[] = [];
    const deps = await linkedTestDeps([revokeRoute(revoked)]);
    const result = await unlinkAccountTool.run(deps, { account: 'music' });
    expect(result).toEqual({ unlinked: 'music', revoked_at_google: true });
    expect(revoked).toEqual(['r-music']);
    const left = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(left.map((a) => a.email)).toEqual(['owner@example.com']);
  });

  it('unlink_account removes even if Google does not answer', async () => {
    const deps = testDeps(() => Promise.reject(new Error('network')));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('owner@example.com')],
    });
    expect(await unlinkAccountTool.run(deps, { account: 'owner' })).toMatchObject({
      revoked_at_google: false,
    });
    expect(deps.kv.entries.size).toBe(0);
  });
});

describe('read tools', () => {
  it('search_threads applies defaults and returns the notice', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([GMAIL], calls);
    const result = await searchThreadsTool.run(deps, { account: 'owner' });
    expect(result).toEqual({ notice: UNTRUSTED_NOTICE, threads: [], next_page_token: null });
    expect(new URL(calls.at(-1)!.url).searchParams.get('maxResults')).toBe('10');
  });

  it('get_thread asks for full with text and metadata with minimal', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedTestDeps([GMAIL], calls);
    const args = { account: 'owner', thread_id: 't1' };
    const text = (await getThreadTool.run(deps, args)) as Record<string, unknown>;
    expect(text).toMatchObject({ notice: UNTRUSTED_NOTICE, account: 'owner', message_count: 2 });
    expect(new URL(calls.at(-1)!.url).searchParams.get('format')).toBe('full');
    await getThreadTool.run(deps, { ...args, format: 'minimal' });
    expect(new URL(calls.at(-1)!.url).searchParams.get('format')).toBe('metadata');
  });

  it('get_message returns body and attachments', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const result = await getMessageTool.run(deps, { account: 'owner', message_id: 'm1' });
    expect(result).toMatchObject({
      body: 'Total: US$ 9,99',
      attachments: [{ attachment_id: 'att-1' }],
    });
  });

  it('list_labels across all accounts', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const result = (await listLabelsTool.run(deps, { account: 'all' })) as { results: unknown[] };
    expect(result.results).toHaveLength(2);
    expect(await accountLabels(deps, OWNER_REF)).toEqual({
      account: 'owner',
      labels: [
        { id: 'INBOX', name: 'INBOX', type: 'system' },
        { id: 'L1', name: 'Receipts', type: 'user' },
      ],
    });
  });

  it('list_labels without labels returns an empty list', async () => {
    const deps = await linkedTestDeps([gmailRoute({ labels: {} })]);
    expect(await accountLabels(deps, OWNER_REF)).toEqual({ account: 'owner', labels: [] });
  });

  it('get_attachment_text extracts the PDF text', async () => {
    const deps = await linkedTestDeps([GMAIL]);
    const args = { account: 'owner', message_id: 'm1', attachment_id: 'att-1' };
    expect(await getAttachmentTextTool.run(deps, args)).toMatchObject({ text: 'Receipt' });
  });

  it('errors become an MCP result with isError and an actionable message', async () => {
    const deps = testDeps(fakeFetch([]));
    const args = { account: 'owner', message_id: 'm1' };
    const result = await runToolSafely(getMessageTool, deps, args);
    expect(result.isError).toBe(true);
    expect(result.content[0]).toMatchObject({
      text: expect.stringMatching(/link_account/) as string,
    });
    const bad = await runToolSafely(getThreadTool, deps, { account: 'owner', thread_id: '../x' });
    expect(bad.isError).toBe(true);
  });
});
