/**
 * HTML page of `/authorize`: the user pastes the service credential (e.g. the Canvas token) to authorize
 * Claude. Static HTML, no script, with the visual tokens from `docs/UI.md`. Pure.
 */

/** Page texts, supplied by the connector. */
export interface LoginPageText {
  readonly title: string;
  readonly intro: string;
  readonly secretLabel: string;
  readonly helpUrl: string;
  readonly helpLabel: string;
  readonly submit: string;
}

/** What the page shows: texts, sealed request, host that will receive access and error (if any). */
export interface LoginPageView {
  readonly text: LoginPageText;
  readonly pending: string;
  readonly clientHost: string;
  readonly error: string | null;
}

/** Page style: color, spacing and radius tokens (light and dark), documented in `docs/UI.md`. */
export const LOGIN_PAGE_CSS = `:root{--bg:#f6f7f9;--surface:#fff;--text:#1d2129;--muted:#5b6270;--accent:#2357d9;--danger:#b42318;--line:#d9dde3;--space:16px;--radius:10px}
@media (prefers-color-scheme:dark){:root{--bg:#121417;--surface:#1c1f24;--text:#e8eaed;--muted:#a3a9b3;--accent:#7aa2ff;--danger:#ff8a80;--line:#30343b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:var(--space)}
main{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:calc(var(--space)*1.5);width:100%;max-width:420px}
h1{font-size:1.25rem;margin:0 0 8px}p{color:var(--muted);margin:0 0 var(--space)}label{display:block;font-weight:600;margin-bottom:6px}
input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text);font:inherit}
button{margin-top:var(--space);width:100%;padding:10px;border:0;border-radius:8px;background:var(--accent);color:#fff;font:inherit;font-weight:600;cursor:pointer}
a{color:var(--accent)}.error{color:var(--danger);font-weight:600}`;

/** Escapes text for HTML (content and attributes). */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Renders the full login page. */
export function renderLoginPage(view: LoginPageView): string {
  const { text } = view;
  const error = view.error ? `<p class="error" role="alert">${escapeHtml(view.error)}</p>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(text.title)}</title><style>${LOGIN_PAGE_CSS}</style></head><body><main>
<h1>${escapeHtml(text.title)}</h1>
<p>${escapeHtml(text.intro)} Access will be granted to <strong>${escapeHtml(view.clientHost)}</strong>.</p>
${error}<form method="post" action="/authorize">
<input type="hidden" name="pending" value="${escapeHtml(view.pending)}">
<label for="secret">${escapeHtml(text.secretLabel)}</label>
<input id="secret" type="password" name="secret" required autocomplete="off">
<p><a href="${escapeHtml(text.helpUrl)}" target="_blank" rel="noopener">${escapeHtml(text.helpLabel)}</a></p>
<button type="submit">${escapeHtml(text.submit)}</button>
</form></main></body></html>`;
}
