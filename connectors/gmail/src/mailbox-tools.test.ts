import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  type GmailWrite,
} from './fixtures/fake-google.js';
import {
  archiveTool,
  markReadTool,
  runMailboxAction,
  starTool,
  toggleAction,
  trashTool,
  untrashTool,
  updateLabelsTool,
  writableTargets,
} from './mailbox-tools.js';
import { DESTRUCTIVE_HINTS, ORGANIZE_HINTS } from '../../../src/mcp/annotations.js';

const LABELS = gmailRoute({ labels: { labels: [{ id: 'Label_1', name: 'Receipts' }] } });

/** Dependencies that record the writes. */
async function recordingDeps(writes: GmailWrite[]) {
  return linkedTestDeps([gmailWriteRoute(writes, () => null), LABELS]);
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('toggleAction', () => {
  it('picks the on or off action', () => {
    expect(toggleAction(true, 'star', 'unstar')).toBe('star');
    expect(toggleAction(false, 'star', 'unstar')).toBe('unstar');
  });
});

describe('writableTargets and runMailboxAction', () => {
  it('resolves the writable account and the targets, and applies the ready-made action', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    const { ref, targets } = await writableTargets(deps, { account: 'music', thread_ids: ['t1'] });
    expect(ref.alias).toBe('music');
    expect(targets).toEqual({ messageIds: [], threadIds: ['t1'] });
    await expect(writableTargets(deps, { account: 'music' })).rejects.toThrow(/message_ids/);
    const result = await runMailboxAction(
      deps,
      { account: 'owner', message_ids: ['m1'] },
      'unstar',
    );
    expect(result).toMatchObject({ messages: 1, removed_labels: ['STARRED'] });
  });
});

describe('organization tools', () => {
  it('annotations: organizing is reversible; trash is destructive', () => {
    for (const tool of [markReadTool, archiveTool, starTool, updateLabelsTool, untrashTool]) {
      expect(tool.annotations).toMatchObject(ORGANIZE_HINTS);
    }
    expect(trashTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
  });

  it('mark_read, archive and star change the system labels', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    await markReadTool.run(deps, { account: 'owner', message_ids: ['m1'] });
    await markReadTool.run(deps, { account: 'owner', message_ids: ['m1'], read: false });
    await archiveTool.run(deps, { account: 'owner', thread_ids: ['t1'] });
    await archiveTool.run(deps, { account: 'owner', thread_ids: ['t1'], archived: false });
    await starTool.run(deps, { account: 'owner', message_ids: ['m1'], starred: true });
    await starTool.run(deps, { account: 'owner', message_ids: ['m1'], starred: false });
    const bodies = writes.map((w) => w.body as { addLabelIds: string[]; removeLabelIds: string[] });
    expect(bodies.map((b) => [b.addLabelIds, b.removeLabelIds])).toEqual([
      [[], ['UNREAD']],
      [['UNREAD'], []],
      [[], ['INBOX']],
      [['INBOX'], []],
      [['STARRED'], []],
      [[], ['STARRED']],
    ]);
  });

  it('update_labels accepts names and ids and requires at least one', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    const result = await updateLabelsTool.run(deps, {
      account: 'owner',
      message_ids: ['m1'],
      add_labels: ['receipts'],
    });
    expect(result).toMatchObject({ added_labels: ['Label_1'] });
    await expect(
      updateLabelsTool.run(deps, { account: 'owner', message_ids: ['m1'] }),
    ).rejects.toThrow(/at least one/);
    await expect(
      updateLabelsTool.run(deps, {
        account: 'owner',
        message_ids: ['m1'],
        add_labels: ['Nothing'],
      }),
    ).rejects.toThrow(/list_labels/);
  });

  it('trash and untrash; no ids is refused', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    await trashTool.run(deps, { account: 'owner', thread_ids: ['t1'] });
    await untrashTool.run(deps, { account: 'owner', thread_ids: ['t1'] });
    expect(writes.map((w) => w.path)).toEqual(['threads/t1/trash', 'threads/t1/untrash']);
    await expect(trashTool.run(deps, { account: 'owner' })).rejects.toThrow(/message_ids/);
  });

  it('invalid ids are rejected by the schema', async () => {
    const deps = await recordingDeps([]);
    await expect(
      trashTool.run(deps, { account: 'owner', message_ids: ['../drafts'] }),
    ).rejects.toThrow();
  });
});
