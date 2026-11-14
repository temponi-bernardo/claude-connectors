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
import {
  applyLabelChange,
  checkLabelChange,
  fetchLabels,
  MAILBOX_ACTIONS,
  mailTargets,
  moveToTrash,
  resolveLabelIds,
  targetCounts,
} from './mailbox.js';

const OWNER = TEST_REFS[0]!;
const LABELS = [
  { id: 'INBOX', name: 'INBOX', type: 'system' },
  { id: 'Label_1', name: 'Receipts' },
];

beforeEach(() => {
  clearAccessTokenCache();
});

describe('pure decisions', () => {
  it('MAILBOX_ACTIONS maps each action to the system labels', () => {
    expect(MAILBOX_ACTIONS.mark_read).toEqual({ add: [], remove: ['UNREAD'] });
    expect(MAILBOX_ACTIONS.mark_unread).toEqual({ add: ['UNREAD'], remove: [] });
    expect(MAILBOX_ACTIONS.archive).toEqual({ add: [], remove: ['INBOX'] });
    expect(MAILBOX_ACTIONS.unarchive).toEqual({ add: ['INBOX'], remove: [] });
    expect(MAILBOX_ACTIONS.star).toEqual({ add: ['STARRED'], remove: [] });
    expect(MAILBOX_ACTIONS.unstar).toEqual({ add: [], remove: ['STARRED'] });
  });

  it('mailTargets requires at least one id', () => {
    expect(mailTargets(['m1'], undefined)).toEqual({ messageIds: ['m1'], threadIds: [] });
    expect(mailTargets(undefined, ['t1'])).toEqual({ messageIds: [], threadIds: ['t1'] });
    expect(() => mailTargets([], undefined)).toThrow(/message_ids or thread_ids/);
  });

  it('checkLabelChange requires a label and rejects the same one on both sides', () => {
    expect(() => {
      checkLabelChange({ add: ['A'], remove: [] });
    }).not.toThrow();
    expect(() => {
      checkLabelChange({ add: [], remove: [] });
    }).toThrow(/at least one/);
    expect(() => {
      checkLabelChange({ add: ['A'], remove: ['A'] });
    }).toThrow(/"A"/);
  });

  it('resolveLabelIds accepts an id or name (case-insensitive) and throws for unknown ones', () => {
    expect(resolveLabelIds(LABELS, ['inbox', 'receipts', 'Label_1'])).toEqual([
      'INBOX',
      'Label_1',
      'Label_1',
    ]);
    expect(() => resolveLabelIds(LABELS, ['Nothing'])).toThrow(/"Nothing".*list_labels/);
  });
});

describe('targetCounts', () => {
  it('counts messages and threads', () => {
    expect(targetCounts('owner', { messageIds: ['a', 'b'], threadIds: [] })).toEqual({
      account: 'owner',
      messages: 2,
      threads: 0,
    });
  });
});

describe('effects', () => {
  it('fetchLabels reads the labels (empty list without the field)', async () => {
    const deps = await linkedTestDeps([gmailRoute({ labels: { labels: LABELS } })]);
    expect(await fetchLabels(deps, OWNER)).toEqual(LABELS);
    const empty = await linkedTestDeps([gmailRoute({ labels: {} })]);
    expect(await fetchLabels(empty, OWNER)).toEqual([]);
  });

  it('applyLabelChange uses batchModify on messages and modify on each thread', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => null)]);
    const targets = { messageIds: ['m1', 'm2'], threadIds: ['t1'] };
    const result = await applyLabelChange(deps, OWNER, {
      targets,
      change: MAILBOX_ACTIONS.archive,
    });
    expect(result).toEqual({
      account: 'owner',
      messages: 2,
      threads: 1,
      added_labels: [],
      removed_labels: ['INBOX'],
    });
    expect(writes).toEqual([
      {
        method: 'POST',
        path: 'messages/batchModify',
        body: { ids: ['m1', 'm2'], addLabelIds: [], removeLabelIds: ['INBOX'] },
      },
      {
        method: 'POST',
        path: 'threads/t1/modify',
        body: { addLabelIds: [], removeLabelIds: ['INBOX'] },
      },
    ]);
  });

  it('applyLabelChange without messages does not call batchModify', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => ({}))]);
    const targets = { messageIds: [], threadIds: ['t1'] };
    await applyLabelChange(deps, OWNER, { targets, change: MAILBOX_ACTIONS.star });
    expect(writes.map((w) => w.path)).toEqual(['threads/t1/modify']);
  });

  it('moveToTrash trashes and restores, without permanent deletion', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => ({}))]);
    const targets = { messageIds: ['m1'], threadIds: ['t1'] };
    expect(await moveToTrash(deps, OWNER, { targets, restore: false })).toEqual({
      account: 'owner',
      action: 'trash',
      messages: 1,
      threads: 1,
    });
    await moveToTrash(deps, OWNER, { targets, restore: true });
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST messages/m1/trash',
      'POST threads/t1/trash',
      'POST messages/m1/untrash',
      'POST threads/t1/untrash',
    ]);
  });

  it('a read-only account changes nothing', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes)]);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    const targets = { messageIds: ['m1'], threadIds: [] };
    await expect(moveToTrash(deps, old, { targets, restore: false })).rejects.toThrow(/read-only/);
    expect(writes).toHaveLength(0);
  });
});
