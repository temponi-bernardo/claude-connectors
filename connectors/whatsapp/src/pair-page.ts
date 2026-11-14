/**
 * Página HTML do `/pair`: status do WhatsApp e pareamento por código (PairPhone) ou QR. Sem script; os formulários
 * levam o token anti-CSRF. Usa os tokens visuais da página de login (`docs/UI.md`). Pura.
 */
import { escapeHtml, LOGIN_PAGE_CSS } from '../../../src/remote/login-page.js';
import type { BridgeStatus } from './format.js';

/** Acréscimos de estilo do `/pair`: código grande, QR e botões secundários. */
export const PAIR_PAGE_CSS = `.code{font:700 2rem/1.2 ui-monospace,monospace;letter-spacing:.15em;color:var(--text);text-align:center;margin:var(--space) 0}
.qr{display:block;margin:var(--space) auto;width:256px;height:256px;image-rendering:pixelated;background:#fff;padding:8px;border-radius:8px}
.ok{color:var(--accent);font-weight:600}.secondary{background:transparent;color:var(--accent);border:1px solid var(--line)}
.danger{background:var(--danger)}hr{border:0;border-top:1px solid var(--line);margin:calc(var(--space)*1.5) 0}`;

/** O que a página mostra além do status. */
export interface PairPageView {
  readonly email: string;
  readonly csrf: string;
  readonly status: BridgeStatus | null;
  readonly code?: string;
  readonly qrPng?: string;
  readonly message?: string;
  readonly error?: string;
}

/** Frase de status para o dono. */
export function describePairStatus(status: BridgeStatus | null): string {
  if (!status) return 'Não consegui ler o status do WhatsApp agora.';
  if (status.needs_pairing)
    return 'Precisa parear: nenhum celular vinculado (ou ele foi deslogado).';
  if (!status.connected) return 'Pareado, mas ainda conectando ao WhatsApp…';
  const sync = status.offline_sync_complete ? 'sincronizado' : 'sincronizando pendências';
  return `Conectado${status.account ? ` como ${status.account}` : ''} (${sync}).`;
}

/** Formulário POST com o token anti-CSRF e campos extras. */
export function pairForm(action: string, csrf: string, body: string): string {
  return `<form method="post" action="${action}"><input type="hidden" name="csrf" value="${escapeHtml(csrf)}">${body}</form>`;
}

/** Bloco de pareamento: pedir código pelo número ou mostrar o QR. */
export function pairingSection(view: PairPageView): string {
  const code = view.code
    ? `<p>No celular: WhatsApp → Aparelhos conectados → Conectar aparelho → Conectar com número de telefone, e digite:</p><p class="code">${escapeHtml(view.code)}</p>`
    : '';
  const qr = view.qrPng
    ? `<p>Ou leia este QR em WhatsApp → Aparelhos conectados → Conectar aparelho:</p><img class="qr" alt="QR de pareamento" src="data:image/png;base64,${escapeHtml(view.qrPng)}">`
    : '';
  const phoneForm = pairForm(
    '/pair/code',
    view.csrf,
    '<label for="phone">Seu número com DDI (só dígitos)</label><input id="phone" name="phone" inputmode="numeric" pattern="[0-9]{8,15}" required placeholder="5531999999999"><button type="submit">Gerar código de pareamento</button>',
  );
  const qrForm = pairForm(
    '/pair/qr',
    view.csrf,
    '<button class="secondary" type="submit">Mostrar QR</button>',
  );
  return `${code}${qr}${phoneForm}${qrForm}`;
}

/** Bloco de manutenção: deslogar, recomeçar do zero (apaga o backup) e sair. */
export function maintenanceSection(view: PairPageView): string {
  const logout = pairForm(
    '/pair/logout',
    view.csrf,
    '<button class="secondary" type="submit">Desvincular este aparelho</button>',
  );
  const reset = pairForm(
    '/pair/reset',
    view.csrf,
    '<label for="confirm">Recomeçar do zero: arquiva o backup e exige parear de novo. Digite APAGAR</label><input id="confirm" name="confirm" required><button class="danger" type="submit">Recomeçar do zero</button>',
  );
  const signout = pairForm(
    '/pair/signout',
    view.csrf,
    '<button class="secondary" type="submit">Sair</button>',
  );
  return `<hr>${logout}${reset}${signout}`;
}

/** Aviso do resultado da última ação: erro, mensagem ou nada. */
export function alertHtml(view: PairPageView): string {
  if (view.error) return `<p class="error" role="alert">${escapeHtml(view.error)}</p>`;
  if (view.message) return `<p class="ok" role="status">${escapeHtml(view.message)}</p>`;
  return '';
}

/** Renderiza a página `/pair` completa. */
export function renderPairPage(view: PairPageView): string {
  const refresh =
    view.code || view.qrPng ? '<meta http-equiv="refresh" content="20;url=/pair">' : '';
  const alert = alertHtml(view);
  const pairing = view.status?.needs_pairing ? pairingSection(view) : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">${refresh}<title>WhatsApp no Claude</title><style>${LOGIN_PAGE_CSS}${PAIR_PAGE_CSS}</style></head><body><main>
<h1>WhatsApp no Claude</h1>
<p>Entrou como <strong>${escapeHtml(view.email)}</strong>.</p>
<p>${escapeHtml(describePairStatus(view.status))}</p>
${alert}${pairing}${maintenanceSection(view)}
</main></body></html>`;
}
