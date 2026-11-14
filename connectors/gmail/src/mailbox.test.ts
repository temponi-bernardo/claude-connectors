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
  { id: 'Label_1', name: 'Recibos' },
];

beforeEach(() => {
  clearAccessTokenCache();
});

describe('decisões puras', () => {
  it('MAILBOX_ACTIONS mapeia cada ação para os marcadores de sistema', () => {
    expect(MAILBOX_ACTIONS.mark_read).toEqual({ add: [], remove: ['UNREAD'] });
    expect(MAILBOX_ACTIONS.mark_unread).toEqual({ add: ['UNREAD'], remove: [] });
    expect(MAILBOX_ACTIONS.archive).toEqual({ add: [], remove: ['INBOX'] });
    expect(MAILBOX_ACTIONS.unarchive).toEqual({ add: ['INBOX'], remove: [] });
    expect(MAILBOX_ACTIONS.star).toEqual({ add: ['STARRED'], remove: [] });
    expect(MAILBOX_ACTIONS.unstar).toEqual({ add: [], remove: ['STARRED'] });
  });

  it('mailTargets exige ao menos um id', () => {
    expect(mailTargets(['m1'], undefined)).toEqual({ messageIds: ['m1'], threadIds: [] });
    expect(mailTargets(undefined, ['t1'])).toEqual({ messageIds: [], threadIds: ['t1'] });
    expect(() => mailTargets([], undefined)).toThrow(/message_ids or thread_ids/);
  });

  it('checkLabelChange exige algum marcador e recusa o mesmo nos dois lados', () => {
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

  it('resolveLabelIds aceita id ou nome (sem maiúsculas) e lança erro para desconhecidos', () => {
    expect(resolveLabelIds(LABELS, ['inbox', 'recibos', 'Label_1'])).toEqual([
      'INBOX',
      'Label_1',
      'Label_1',
    ]);
    expect(() => resolveLabelIds(LABELS, ['Nada'])).toThrow(/"Nada".*list_labels/);
  });
});

describe('targetCounts', () => {
  it('conta mensagens e conversas', () => {
    expect(targetCounts('dono', { messageIds: ['a', 'b'], threadIds: [] })).toEqual({
      account: 'dono',
      messages: 2,
      threads: 0,
    });
  });
});

describe('efeitos', () => {
  it('fetchLabels lê os marcadores (lista vazia sem campo)', async () => {
    const deps = await linkedTestDeps([gmailRoute({ labels: { labels: LABELS } })]);
    expect(await fetchLabels(deps, OWNER)).toEqual(LABELS);
    const empty = await linkedTestDeps([gmailRoute({ labels: {} })]);
    expect(await fetchLabels(empty, OWNER)).toEqual([]);
  });

  it('applyLabelChange usa batchModify nas mensagens e modify em cada conversa', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => null)]);
    const targets = { messageIds: ['m1', 'm2'], threadIds: ['t1'] };
    const result = await applyLabelChange(deps, OWNER, {
      targets,
      change: MAILBOX_ACTIONS.archive,
    });
    expect(result).toEqual({
      account: 'dono',
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

  it('applyLabelChange sem mensagens não chama batchModify', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => ({}))]);
    const targets = { messageIds: [], threadIds: ['t1'] };
    await applyLabelChange(deps, OWNER, { targets, change: MAILBOX_ACTIONS.star });
    expect(writes.map((w) => w.path)).toEqual(['threads/t1/modify']);
  });

  it('moveToTrash manda para a lixeira e restaura, sem exclusão definitiva', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes, () => ({}))]);
    const targets = { messageIds: ['m1'], threadIds: ['t1'] };
    expect(await moveToTrash(deps, OWNER, { targets, restore: false })).toEqual({
      account: 'dono',
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

  it('conta só leitura não altera nada', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedTestDeps([gmailWriteRoute(writes)]);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    const targets = { messageIds: ['m1'], threadIds: [] };
    await expect(moveToTrash(deps, old, { targets, restore: false })).rejects.toThrow(/read-only/);
    expect(writes).toHaveLength(0);
  });
});
