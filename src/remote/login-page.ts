/**
 * Página HTML do `/authorize`: o usuário cola a credencial do serviço (ex.: token do Canvas) para autorizar
 * o Claude. HTML estático, sem script, com os tokens visuais de `docs/UI.md`. Pura.
 */

/** Textos da página, fornecidos pelo conector. */
export interface LoginPageText {
  readonly title: string;
  readonly intro: string;
  readonly secretLabel: string;
  readonly helpUrl: string;
  readonly helpLabel: string;
  readonly submit: string;
}

/** O que a página mostra: textos, pedido selado, host que vai receber o acesso e erro (se houver). */
export interface LoginPageView {
  readonly text: LoginPageText;
  readonly pending: string;
  readonly clientHost: string;
  readonly error: string | null;
}

/** Estilo da página: tokens de cor, espaço e raio (claro e escuro), documentados em `docs/UI.md`. */
export const LOGIN_PAGE_CSS = `:root{--bg:#f6f7f9;--surface:#fff;--text:#1d2129;--muted:#5b6270;--accent:#2357d9;--danger:#b42318;--line:#d9dde3;--space:16px;--radius:10px}
@media (prefers-color-scheme:dark){:root{--bg:#121417;--surface:#1c1f24;--text:#e8eaed;--muted:#a3a9b3;--accent:#7aa2ff;--danger:#ff8a80;--line:#30343b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:var(--space)}
main{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:calc(var(--space)*1.5);width:100%;max-width:420px}
h1{font-size:1.25rem;margin:0 0 8px}p{color:var(--muted);margin:0 0 var(--space)}label{display:block;font-weight:600;margin-bottom:6px}
input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text);font:inherit}
button{margin-top:var(--space);width:100%;padding:10px;border:0;border-radius:8px;background:var(--accent);color:#fff;font:inherit;font-weight:600;cursor:pointer}
a{color:var(--accent)}.error{color:var(--danger);font-weight:600}`;

/** Escapa texto para HTML (conteúdo e atributos). */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Gera a página de login completa. */
export function renderLoginPage(view: LoginPageView): string {
  const { text } = view;
  const error = view.error ? `<p class="error" role="alert">${escapeHtml(view.error)}</p>` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(text.title)}</title><style>${LOGIN_PAGE_CSS}</style></head><body><main>
<h1>${escapeHtml(text.title)}</h1>
<p>${escapeHtml(text.intro)} O acesso vai para <strong>${escapeHtml(view.clientHost)}</strong>.</p>
${error}<form method="post" action="/authorize">
<input type="hidden" name="pending" value="${escapeHtml(view.pending)}">
<label for="secret">${escapeHtml(text.secretLabel)}</label>
<input id="secret" type="password" name="secret" required autocomplete="off">
<p><a href="${escapeHtml(text.helpUrl)}" target="_blank" rel="noopener">${escapeHtml(text.helpLabel)}</a></p>
<button type="submit">${escapeHtml(text.submit)}</button>
</form></main></body></html>`;
}
