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

const LABELS = gmailRoute({ labels: { labels: [{ id: 'Label_1', name: 'Recibos' }] } });

/** Dependências que registram as escritas. */
async function recordingDeps(writes: GmailWrite[]) {
  return linkedTestDeps([gmailWriteRoute(writes, () => null), LABELS]);
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('toggleAction', () => {
  it('escolhe a ação ligada ou desligada', () => {
    expect(toggleAction(true, 'star', 'unstar')).toBe('star');
    expect(toggleAction(false, 'star', 'unstar')).toBe('unstar');
  });
});

describe('writableTargets e runMailboxAction', () => {
  it('resolve a conta com escrita e os alvos, e aplica a ação pronta', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    const { ref, targets } = await writableTargets(deps, { account: 'musica', thread_ids: ['t1'] });
    expect(ref.alias).toBe('musica');
    expect(targets).toEqual({ messageIds: [], threadIds: ['t1'] });
    await expect(writableTargets(deps, { account: 'musica' })).rejects.toThrow(/message_ids/);
    const result = await runMailboxAction(deps, { account: 'dono', message_ids: ['m1'] }, 'unstar');
    expect(result).toMatchObject({ messages: 1, removed_labels: ['STARRED'] });
  });
});

describe('ferramentas de organização', () => {
  it('anotações: organizar é reversível; lixeira é destrutiva', () => {
    for (const tool of [markReadTool, archiveTool, starTool, updateLabelsTool, untrashTool]) {
      expect(tool.annotations).toMatchObject(ORGANIZE_HINTS);
    }
    expect(trashTool.annotations).toMatchObject(DESTRUCTIVE_HINTS);
  });

  it('mark_read, archive e star mexem nos marcadores de sistema', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    await markReadTool.run(deps, { account: 'dono', message_ids: ['m1'] });
    await markReadTool.run(deps, { account: 'dono', message_ids: ['m1'], read: false });
    await archiveTool.run(deps, { account: 'dono', thread_ids: ['t1'] });
    await archiveTool.run(deps, { account: 'dono', thread_ids: ['t1'], archived: false });
    await starTool.run(deps, { account: 'dono', message_ids: ['m1'], starred: true });
    await starTool.run(deps, { account: 'dono', message_ids: ['m1'], starred: false });
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

  it('update_labels aceita nomes e ids e exige ao menos um', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    const result = await updateLabelsTool.run(deps, {
      account: 'dono',
      message_ids: ['m1'],
      add_labels: ['recibos'],
    });
    expect(result).toMatchObject({ added_labels: ['Label_1'] });
    await expect(
      updateLabelsTool.run(deps, { account: 'dono', message_ids: ['m1'] }),
    ).rejects.toThrow(/at least one/);
    await expect(
      updateLabelsTool.run(deps, { account: 'dono', message_ids: ['m1'], add_labels: ['Nada'] }),
    ).rejects.toThrow(/list_labels/);
  });

  it('trash e untrash; sem ids é recusado', async () => {
    const writes: GmailWrite[] = [];
    const deps = await recordingDeps(writes);
    await trashTool.run(deps, { account: 'dono', thread_ids: ['t1'] });
    await untrashTool.run(deps, { account: 'dono', thread_ids: ['t1'] });
    expect(writes.map((w) => w.path)).toEqual(['threads/t1/trash', 'threads/t1/untrash']);
    await expect(trashTool.run(deps, { account: 'dono' })).rejects.toThrow(/message_ids/);
  });

  it('ids inválidos são recusados pelo schema', async () => {
    const deps = await recordingDeps([]);
    await expect(
      trashTool.run(deps, { account: 'dono', message_ids: ['../drafts'] }),
    ).rejects.toThrow();
  });
});
