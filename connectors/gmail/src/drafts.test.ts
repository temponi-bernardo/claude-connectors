import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  createDraft,
  deleteDraft,
  draftIds,
  draftSummary,
  listDrafts,
  prepareDraftEmail,
  sendDraft,
  updateDraft,
} from './drafts.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  TEST_REFS,
  type GmailWrite,
} from './fixtures/fake-google.js';
import { RECEIPT } from './fixtures/messages.js';
import { composeEmail } from './send.js';

const OWNER = TEST_REFS[0]!;
const ARGS = {
  to: ['ana@example.com'],
  cc: [],
  bcc: [],
  subject: 'Draft',
  body: 'Text',
  replyToMessageId: null,
  replyAll: false,
};
const DRAFT = { id: 'd1', message: RECEIPT };

beforeEach(() => {
  clearAccessTokenCache();
});

describe('draftSummary', () => {
  it('summarizes id, recipient and subject', () => {
    expect(draftSummary(DRAFT)).toMatchObject({
      draft_id: 'd1',
      message_id: 'm1',
      thread_id: 't1',
      subject: 'Your FL Cloud receipt',
      to: 'owner@example.com',
      snippet: 'Thanks for your purchase',
    });
    expect(draftSummary({ id: 'd2' })).toMatchObject({ draft_id: 'd2', message_id: null });
  });
});

describe('draftIds', () => {
  it('draft and message ids, or nulls', () => {
    expect(draftIds(DRAFT)).toEqual({ draft_id: 'd1', message_id: 'm1', thread_id: 't1' });
    expect(draftIds({ id: '' })).toEqual({ draft_id: null, message_id: null, thread_id: null });
  });
});

describe('prepareDraftEmail', () => {
  it('without a reply builds a new email', async () => {
    const deps = await linkedTestDeps([]);
    expect((await prepareDraftEmail(deps, OWNER, ARGS)).email.subject).toBe('Draft');
  });

  it('as a reply uses the original recipients and thread', async () => {
    const deps = await linkedTestDeps([gmailRoute({ 'messages/m1': RECEIPT })]);
    const prepared = await prepareDraftEmail(deps, OWNER, {
      ...ARGS,
      to: [],
      replyToMessageId: 'm1',
    });
    expect(prepared.threadId).toBe('t1');
    expect(prepared.email.subject).toBe('Re: Your FL Cloud receipt');
  });
});

describe('draft operations', () => {
  it('listDrafts lists and summarizes each draft', async () => {
    const route = gmailRoute({ drafts: { drafts: [{ id: 'd1' }] }, 'drafts/d1': DRAFT });
    const deps = await linkedTestDeps([route]);
    const result = await listDrafts(deps, OWNER, 10);
    expect(result).toMatchObject({ account: 'owner', drafts: [{ draft_id: 'd1' }] });
    const empty = await listDrafts(await linkedTestDeps([gmailRoute({ drafts: {} })]), OWNER, 5);
    expect(empty).toEqual({ account: 'owner', drafts: [] });
  });

  it('createDraft, updateDraft, sendDraft and deleteDraft call the right endpoints', async () => {
    const writes: GmailWrite[] = [];
    const route = gmailWriteRoute(writes, (w) => {
      if (w.method === 'DELETE') return null;
      if (w.path === 'drafts/send') return { id: 'm9', threadId: 't9' };
      return { id: 'd1', message: { id: 'm9', threadId: 't9' } };
    });
    const deps = await linkedTestDeps([route]);
    const prepared = { ...composeEmail(ARGS), threadId: 't1' };
    expect(await createDraft(deps, OWNER, prepared)).toEqual({
      account: 'owner',
      draft_id: 'd1',
      message_id: 'm9',
      thread_id: 't9',
    });
    await updateDraft(deps, OWNER, { draftId: 'd1', prepared });
    expect(await sendDraft(deps, OWNER, 'd1')).toMatchObject({ sent: true, message_id: 'm9' });
    expect(await deleteDraft(deps, OWNER, 'd1')).toEqual({ account: 'owner', deleted_draft: 'd1' });
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST drafts',
      'PUT drafts/d1',
      'POST drafts/send',
      'DELETE drafts/d1',
    ]);
    expect(writes[0]?.body).toMatchObject({ message: { threadId: 't1' } });
    expect(writes[1]?.body).toMatchObject({ id: 'd1', message: { threadId: 't1' } });
    expect(writes[2]?.body).toEqual({ id: 'd1' });
  });

  it('a response without a message returns null ids', async () => {
    const deps = await linkedTestDeps([gmailWriteRoute([], () => ({}))]);
    expect(await sendDraft(deps, OWNER, 'd1')).toEqual({
      account: 'owner',
      sent: true,
      message_id: null,
      thread_id: null,
    });
    expect(await createDraft(deps, OWNER, composeEmail(ARGS))).toMatchObject({ draft_id: null });
  });
});
