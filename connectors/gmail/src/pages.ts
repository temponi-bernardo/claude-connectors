/**
 * Páginas HTML do conector Gmail (consentimento e resultados), com CSP restritiva e escape de tudo que vem
 * do cliente OAuth ou do Google. Pura: só monta texto e respostas.
 */
import type { ConsentDescription } from '@cloudflare/workers-oauth-provider';
import { htmlResponse } from '../../../src/remote/handler.js';

/** Origem do Google para onde o formulário de consentimento redireciona. */
export const GOOGLE_ACCOUNTS_ORIGIN = 'https://accounts.google.com';

/** Headers da biblioteca OAuth que a resposta da página não deve herdar (a página define os seus). */
const PAGE_OWNED_HEADERS = new Set(['content-type', 'content-security-policy', 'set-cookie']);

/** Estilo único das páginas (inline: a CSP não libera folhas externas). */
const PAGE_STYLE =
  'body{font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;line-height:1.5}button{padding:.5rem 1rem;margin-right:.5rem}';

/** Escapa texto para HTML (nomes de cliente e escopos vêm de terceiros). */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/** Documento HTML completo com título e corpo já escapados por quem chama. */
export function pageDocument(title: string, body: string): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>${PAGE_STYLE}</style></head><body>${body}</body></html>`;
}

/** Página simples de aviso (título e mensagem em texto, escapados aqui). */
export function messagePage(title: string, message: string, status = 200): Response {
  return htmlResponse(
    pageDocument(title, `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>`),
    status,
  );
}

/** Corpo da página de consentimento: quem pede, para onde vai o acesso e os botões. */
export function consentPageBody(details: ConsentDescription, handle: string): string {
  const loopback = details.redirectIsLoopback
    ? '<p><strong>O acesso vai para um app no seu computador.</strong> Continue só se você acabou de iniciar a conexão nele.</p>'
    : '';
  return `<h1>Conectar ${escapeHtml(details.clientName)} ao Gmail?</h1>
<p>O acesso (somente leitura) será enviado para <strong>${escapeHtml(details.redirectHost)}</strong>. O nome do app não é verificado.</p>${loopback}
<p>Em seguida você entra com sua conta Google; só os e-mails autorizados são aceitos.</p>
<form method="post" action="/authorize"><input type="hidden" name="handle" value="${escapeHtml(handle)}">
<button name="decision" value="approve">Permitir</button><button name="decision" value="deny">Negar</button></form>`;
}

/** Copia para a resposta os headers da transação de consentimento (cookies e anti-frame). */
export function copyConsentHeaders(response: Response, headers: Headers): Response {
  for (const cookie of headers.getSetCookie()) response.headers.append('set-cookie', cookie);
  headers.forEach((value, name) => {
    if (!PAGE_OWNED_HEADERS.has(name)) response.headers.set(name, value);
  });
  return response;
}

/** Página de consentimento: o formulário pode seguir para o Google (aprovar) ou para o cliente (negar). */
export function consentPage(
  details: ConsentDescription,
  handle: string,
  headers: Headers,
): Response {
  const formTargets = `${GOOGLE_ACCOUNTS_ORIGIN} ${new URL(details.redirectUri).origin}`;
  const html = pageDocument(`Conectar ${details.clientName}`, consentPageBody(details, handle));
  return copyConsentHeaders(htmlResponse(html, 200, formTargets), headers);
}

/** Redirecionamento 302 com os headers dados (cookies da transação) mais o `Location`. */
export function redirectWith(location: string, headers: Headers = new Headers()): Response {
  headers.set('location', location);
  headers.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers });
}
