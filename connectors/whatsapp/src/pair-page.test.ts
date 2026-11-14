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

const VIEW: PairPageView = { email: 'dono@exemplo.dev', csrf: 'tok"en', status: READY_STATUS };

describe('describePairStatus', () => {
  it('descreve cada situação', () => {
    expect(describePairStatus(null)).toContain('Não consegui');
    expect(describePairStatus({ ...READY_STATUS, needs_pairing: true })).toContain(
      'Precisa parear',
    );
    expect(describePairStatus({ ...READY_STATUS, connected: false })).toContain('conectando');
    expect(describePairStatus(READY_STATUS)).toBe(
      `Conectado como ${READY_STATUS.account} (sincronizado).`,
    );
    const syncing = { ...READY_STATUS, offline_sync_complete: false, account: null };
    expect(describePairStatus(syncing)).toBe('Conectado (sincronizando pendências).');
  });
});

describe('pairForm, pairingSection e maintenanceSection', () => {
  it('escapa o token anti-CSRF no formulário', () => {
    expect(pairForm('/pair/qr', 'a"b', '')).toContain('value="a&quot;b"');
  });

  it('mostra código e QR quando existem, sempre com os formulários', () => {
    const html = pairingSection({ ...VIEW, code: 'ABCD-EFGH', qrPng: 'iVBOR' });
    expect(html).toContain('<p class="code">ABCD-EFGH</p>');
    expect(html).toContain('src="data:image/png;base64,iVBOR"');
    expect(html).toContain('action="/pair/code"');
    expect(pairingSection(VIEW)).not.toContain('class="code"');
  });

  it('oferece desvincular, recomeçar do zero e sair', () => {
    const html = maintenanceSection(VIEW);
    for (const action of ['/pair/logout', '/pair/reset', '/pair/signout']) {
      expect(html).toContain(`action="${action}"`);
    }
  });
});

describe('alertHtml e renderPairPage', () => {
  it('prioriza o erro e escapa os textos', () => {
    expect(alertHtml({ ...VIEW, error: '<x>', message: 'ok' })).toContain('&lt;x&gt;');
    expect(alertHtml({ ...VIEW, message: 'feito' })).toContain('role="status"');
    expect(alertHtml(VIEW)).toBe('');
  });

  it('só mostra o pareamento quando precisa e atualiza sozinha enquanto pareia', () => {
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
