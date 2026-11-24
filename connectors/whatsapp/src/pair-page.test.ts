import { describe, expect, it } from 'vitest';
import { READY_STATUS } from './fixtures/fakes.js';
import {
  accessEntryRow,
  accessModeForm,
  accessModeRadio,
  accessSearchHtml,
  accessSection,
  alertHtml,
  describePairStatus,
  maintenanceSection,
  pairForm,
  pairingSection,
  PAIR_PAGE_CSS,
  renderPairPage,
  type PairPageView,
} from './pair-page.js';

const VIEW: PairPageView = { email: 'owner@example.dev', csrf: 'tok"en', status: READY_STATUS };

describe('describePairStatus', () => {
  it('describes each situation', () => {
    expect(describePairStatus(null)).toContain('Could not');
    expect(describePairStatus({ ...READY_STATUS, needs_pairing: true })).toContain(
      'Pairing needed',
    );
    expect(describePairStatus({ ...READY_STATUS, connected: false })).toContain('connecting');
    expect(describePairStatus(READY_STATUS)).toBe(`Connected as ${READY_STATUS.account} (synced).`);
    const syncing = { ...READY_STATUS, offline_sync_complete: false, account: null };
    expect(describePairStatus(syncing)).toBe('Connected (syncing pending messages).');
  });
});

describe('pairForm, pairingSection and maintenanceSection', () => {
  it('escapes the anti-CSRF token in the form', () => {
    expect(pairForm('/pair/qr', 'a"b', '')).toContain('value="a&quot;b"');
  });

  it('shows code and QR when present, always with the forms', () => {
    const html = pairingSection({ ...VIEW, code: 'ABCD-EFGH', qrPng: 'iVBOR' });
    expect(html).toContain('<p class="code">ABCD-EFGH</p>');
    expect(html).toContain('src="data:image/png;base64,iVBOR"');
    expect(html).toContain('action="/pair/code"');
    expect(pairingSection(VIEW)).not.toContain('class="code"');
  });

  it('offers unlink, start over and sign out', () => {
    const html = maintenanceSection(VIEW);
    for (const action of ['/pair/logout', '/pair/reset', '/pair/signout']) {
      expect(html).toContain(`action="${action}"`);
    }
  });
});

describe('alertHtml and renderPairPage', () => {
  it('prioritizes the error and escapes the texts', () => {
    expect(alertHtml({ ...VIEW, error: '<x>', message: 'ok' })).toContain('&lt;x&gt;');
    expect(alertHtml({ ...VIEW, message: 'done' })).toContain('role="status"');
    expect(alertHtml(VIEW)).toBe('');
  });

  it('shows pairing only when needed and auto-refreshes while pairing', () => {
    expect(renderPairPage(VIEW)).not.toContain('/pair/code');
    const pairing = renderPairPage({
      ...VIEW,
      status: { ...READY_STATUS, needs_pairing: true },
      code: 'X',
    });
    expect(pairing).toContain('/pair/code');
    expect(pairing).toContain('http-equiv="refresh"');
    expect(renderPairPage({ ...VIEW, email: '<b>' })).toContain('&lt;b&gt;');
    expect(renderPairPage(VIEW)).toContain(PAIR_PAGE_CSS);
  });
});

describe('accessSection', () => {
  const GROUP = { jid: '120363000000000001@g.us', name: '<Turma>', group: true };

  it('explains the open mode and offers the search even without a saved list', () => {
    const html = accessSection({ ...VIEW, access: { mode: 'all', entries: [] } });
    expect(html).toContain('Chat access');
    expect(html).toContain('every chat');
    expect(html).toContain('action="/pair/access/mode"');
    expect(html).toContain('action="/pair/access/search"');
  });

  it('lists allowed chats with remove buttons and escapes names', () => {
    const html = accessSection({ ...VIEW, access: { mode: 'selected', entries: [GROUP] } });
    expect(html).toContain('only the chats below');
    expect(html).toContain('&lt;Turma&gt;');
    expect(html).toContain('action="/pair/access/remove"');
    expect(html).toContain('value="selected" checked');
  });

  it('shows search results, marking the ones already allowed', () => {
    const ana = { jid: '5531999999999@s.whatsapp.net', name: 'Ana', group: false };
    const html = accessSection({
      ...VIEW,
      access: { mode: 'selected', entries: [GROUP] },
      candidates: [GROUP, ana],
      query: 'a"b',
    });
    expect(html).toContain('value="a&quot;b"');
    expect(html.match(/action="\/pair\/access\/add"/g)).toHaveLength(1);
    expect(html).toContain('Allowed');
  });

  it('says when the list could not be read and when the search found nothing', () => {
    expect(accessSection({ ...VIEW, access: null })).toContain('Could not read');
    expect(
      accessSection({ ...VIEW, access: { mode: 'all', entries: [] }, candidates: [] }),
    ).toContain('No chats or contacts found');
  });

  it('renderPairPage includes the access section', () => {
    expect(renderPairPage({ ...VIEW, access: { mode: 'all', entries: [] } })).toContain(
      'Chat access',
    );
  });
});

describe('access page pieces', () => {
  const ANA = { jid: '5531999999999@s.whatsapp.net', name: 'Ana', group: false };
  const LIST = { mode: 'all', entries: [] } as const;

  it('accessEntryRow shows an Allow or Remove button, or only a note', () => {
    expect(accessEntryRow(ANA, '/pair/access/add', VIEW)).toContain('>Allow<');
    expect(accessEntryRow(ANA, '/pair/access/remove', VIEW)).toContain('>Remove<');
    expect(accessEntryRow(ANA, '', VIEW)).not.toContain('<form');
  });

  it('accessModeRadio and accessModeForm check the current mode', () => {
    expect(accessModeRadio(LIST, 'all', 'x')).toContain('checked');
    expect(accessModeRadio(LIST, 'selected', 'x')).not.toContain('checked');
    expect(accessModeForm(LIST, VIEW)).toContain('action="/pair/access/mode"');
  });

  it('accessSearchHtml shows only the form before any search', () => {
    expect(accessSearchHtml(LIST, VIEW)).not.toContain('class="list"');
  });
});
