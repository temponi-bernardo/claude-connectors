import { describe, expect, it } from 'vitest';
import { READY_STATUS } from './fixtures/fakes.js';
import {
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
