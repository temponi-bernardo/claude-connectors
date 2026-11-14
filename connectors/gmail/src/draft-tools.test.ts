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
  it('converts the tool arguments', () => {
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

describe('draft tools', () => {
  it('annotations: list reads, create creates, update and delete destroy, send sends', () => {
    expect(listDraftsTool.annotations).toMatchObject(READ_ONLY_HINTS);
    expect(createDraftTool.annotations).toMatchObject(CREATE_HINTS);
    expect(updateDraftTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
    expect(deleteDraftTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
    expect(sendDraftTool.annotations).toMatchObject(SEND_HINTS);
  });

  it('list_drafts lists the drafts', async () => {
    const deps = await linkedTestDeps([
      gmailRoute({
        drafts: { drafts: [{ id: 'd1' }] },
        'drafts/d1': { id: 'd1', message: RECEIPT },
      }),
    ]);
    expect(await listDraftsTool.run(deps, { account: 'owner' })).toMatchObject({
      drafts: [{ draft_id: 'd1', subject: 'Your FL Cloud receipt' }],
    });
  });

  it('create, update, send and delete', async () => {
    const writes: GmailWrite[] = [];
    const route = gmailWriteRoute(writes, (w) => (w.method === 'DELETE' ? null : { id: 'd1' }));
    const deps = await linkedTestDeps([route, gmailRoute({ 'messages/m1': RECEIPT })]);
    const created = await createDraftTool.run(deps, {
      account: 'owner',
      to: ['a@x.com'],
      subject: 'Hi',
      body: 'Text',
    });
    expect(created).toMatchObject({ account: 'owner', draft_id: 'd1' });
    await updateDraftTool.run(deps, {
      account: 'owner',
      draft_id: 'd1',
      body: 'New version',
      reply_to_message_id: 'm1',
    });
    await sendDraftTool.run(deps, { account: 'owner', draft_id: 'd1' });
    await deleteDraftTool.run(deps, { account: 'owner', draft_id: 'd1' });
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST drafts',
      'PUT drafts/d1',
      'POST drafts/send',
      'DELETE drafts/d1',
    ]);
    expect(writes[1]?.body).toMatchObject({ message: { threadId: 't1' } });
  });

  it('a new draft without a recipient is refused', async () => {
    const deps = await linkedTestDeps([]);
    await expect(createDraftTool.run(deps, { account: 'owner', body: 'x' })).rejects.toThrow(
      /at least one/,
    );
  });
});
