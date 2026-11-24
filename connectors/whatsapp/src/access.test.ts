import { describe, expect, it } from 'vitest';
import { fakeBridge } from './fixtures/fakes.js';
import {
  accessEntryFrom,
  accessRefusal,
  fetchAccessList,
  filterAllowedMessages,
  isChatAllowed,
  markChatAccess,
  MAX_ACCESS_ENTRIES,
  mergeCandidates,
  parseAccessEntries,
  parseAccessEntry,
  OPEN_ACCESS,
  parseAccessList,
  requireChatAccess,
  saveAccessList,
  withAccessEntry,
  withAccessMode,
  withoutAccessEntry,
  type AccessList,
} from './access.js';

const GROUP = { jid: '120363000000000001@g.us', name: 'Turma', group: true };
const ANA = { jid: '5531999999999@s.whatsapp.net', name: 'Ana', group: false };
const SELECTED: AccessList = { mode: 'selected', entries: [GROUP] };
const PAIR = 'https://wa.example.dev/pair';

describe('parseAccessList', () => {
  it('keeps the old behavior (everything open) while nothing was saved', () => {
    expect(parseAccessList(undefined)).toEqual(OPEN_ACCESS);
    expect(parseAccessList(null)).toEqual(OPEN_ACCESS);
  });

  it('reads a valid list and drops invalid or duplicated entries', () => {
    const raw = { mode: 'selected', entries: [GROUP, GROUP, { jid: 'bad', name: 'x' }, 3] };
    expect(parseAccessList(raw)).toEqual(SELECTED);
  });

  it('fails closed on a corrupt stored value: selected mode with nothing allowed', () => {
    expect(parseAccessList({ mode: 'weird' })).toEqual({ mode: 'selected', entries: [] });
    expect(parseAccessList('x')).toEqual({ mode: 'selected', entries: [] });
  });
});

describe('isChatAllowed, requireChatAccess and accessRefusal', () => {
  it('allows any chat in open mode and only listed chats in selected mode', () => {
    expect(isChatAllowed(OPEN_ACCESS, ANA.jid)).toBe(true);
    expect(isChatAllowed(SELECTED, GROUP.jid)).toBe(true);
    expect(isChatAllowed(SELECTED, ANA.jid)).toBe(false);
  });

  it('refuses a chat outside the list pointing the owner to the access page', () => {
    expect(() => {
      requireChatAccess(SELECTED, ANA.jid, PAIR);
    }).toThrow(accessRefusal(PAIR));
    expect(accessRefusal(PAIR)).toContain(PAIR);
    expect(() => {
      requireChatAccess(SELECTED, GROUP.jid, PAIR);
    }).not.toThrow();
  });
});

describe('list changes', () => {
  it('adds without duplicating, refreshes the name and caps the size', () => {
    const renamed = { ...GROUP, name: 'Turma 2' };
    expect(withAccessEntry(SELECTED, renamed).entries).toEqual([renamed]);
    expect(withAccessEntry(SELECTED, ANA).entries).toEqual([GROUP, ANA]);
    const full: AccessList = {
      mode: 'selected',
      entries: Array.from({ length: MAX_ACCESS_ENTRIES }, (_, i) => ({
        jid: `55319${String(i).padStart(8, '0')}@s.whatsapp.net`,
        name: String(i),
        group: false,
      })),
    };
    expect(() => withAccessEntry(full, ANA)).toThrow(String(MAX_ACCESS_ENTRIES));
  });

  it('removes an entry and switches the mode', () => {
    expect(withoutAccessEntry(SELECTED, GROUP.jid).entries).toEqual([]);
    expect(withAccessMode(SELECTED, 'all')).toEqual({ mode: 'all', entries: [GROUP] });
  });
});

describe('accessEntryFrom', () => {
  it('builds an entry from a form, normalizing numbers and cleaning the name', () => {
    const form = new URLSearchParams({ jid: '+55 31 99999-9999', name: 'A‮na', group: '0' });
    expect(accessEntryFrom(form)).toEqual(ANA);
    const group = new URLSearchParams({ jid: GROUP.jid, name: '', group: '1' });
    expect(accessEntryFrom(group)).toEqual({ ...GROUP, name: GROUP.jid });
  });

  it('rejects an invalid JID', () => {
    expect(accessEntryFrom(new URLSearchParams({ jid: 'evil@example.com' }))).toBeNull();
  });
});

describe('markChatAccess and filterAllowedMessages', () => {
  const chats = [
    { jid: GROUP.jid, name: 'Turma', last: 'Ana: oi' },
    { jid: ANA.jid, name: 'Ana', last: 'me: segredo' },
  ];

  it('leaves chats untouched in open mode', () => {
    expect(markChatAccess(OPEN_ACCESS, chats)).toEqual(chats);
  });

  it('flags each chat and hides the preview of chats outside the list', () => {
    expect(markChatAccess(SELECTED, chats)).toEqual([
      { ...chats[0], allowed: true },
      { jid: ANA.jid, name: 'Ana', allowed: false },
    ]);
  });

  it('keeps only messages of allowed chats', () => {
    const messages = [{ chat: GROUP.jid }, { chat: ANA.jid }];
    expect(filterAllowedMessages(SELECTED, messages)).toEqual([{ chat: GROUP.jid }]);
    expect(filterAllowedMessages(OPEN_ACCESS, messages)).toEqual(messages);
  });
});

describe('mergeCandidates', () => {
  it('joins chats and contacts without repeating a JID', () => {
    const merged = mergeCandidates(
      [{ jid: GROUP.jid, name: 'Turma', is_group: true, last_message_at: null }],
      [
        { jid: ANA.jid, name: null, push_name: 'Ana', phone: '+5531999999999' },
        { jid: GROUP.jid, name: 'dup', push_name: null, phone: null },
      ],
    );
    expect(merged).toEqual([GROUP, ANA]);
  });
});

describe('fetchAccessList and saveAccessList', () => {
  it('reads the list from the Durable Object and saves it with PUT', async () => {
    let saved: unknown = null;
    const bridge = fakeBridge({
      '/__access': (init) => {
        if (init?.method === 'PUT') saved = JSON.parse(init.body as string);
        return Response.json(SELECTED);
      },
    });
    expect(await fetchAccessList(bridge, Date.now() + 5_000)).toEqual(SELECTED);
    await saveAccessList(bridge, OPEN_ACCESS, Date.now() + 5_000);
    expect(saved).toEqual(OPEN_ACCESS);
  });
});

describe('parseAccessEntry and parseAccessEntries', () => {
  it('derives the group flag from the JID and falls back to the JID as name', () => {
    expect(parseAccessEntry({ jid: GROUP.jid, group: false })).toEqual({
      ...GROUP,
      name: GROUP.jid,
    });
    expect(parseAccessEntry({ jid: 'not a jid' })).toBeNull();
    expect(parseAccessEntry(null)).toBeNull();
  });

  it('keeps valid entries once, in order', () => {
    expect(parseAccessEntries([ANA, GROUP, ANA, {}])).toEqual([ANA, GROUP]);
    expect(parseAccessEntries('x')).toEqual([]);
  });
});
