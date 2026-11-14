/**
 * Vínculo de mais uma conta Gmail a um usuário do conector. A ferramenta `link_account` gera um link com um
 * ticket selado (usuário + validade de 10 minutos, uso único); `/accounts/link` resgata o ticket e manda ao
 * Google com `gmail.readonly` e acesso offline, `state` de uso único preso ao navegador por cookie `__Host-`,
 * PKCE S256 e `nonce`. Na volta, o refresh token é gravado (selado) nas contas desse usuário.
 */
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { forgetAccessToken } from './access-token.js';
import { GMAIL_READONLY_SCOPE, GMAIL_SCOPES } from './config.js';
import type { GmailDeps, OwnerDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  randomToken,
  type GoogleTokens,
} from './google-oauth.js';
import { verifyGoogleIdToken } from './id-token.js';
import { messagePage, redirectWith } from './pages.js';
import { loadOwnerAccounts, saveOwnerAccounts, sha256Hex, upsertAccount } from './token-store.js';

/** Prefixo do `state` do vínculo (o `state` da biblioteca OAuth nunca tem ponto). */
export const LINK_STATE_PREFIX = 'link.';

/** Cookie que prende o `state` ao navegador que iniciou o vínculo. */
export const LINK_COOKIE = '__Host-gmail-link';

/** Validade do ticket e do pedido de vínculo, em segundos. */
export const LINK_TTL_SECONDS = 600;

/** Tipo do selo do pedido de vínculo (entre a ida ao Google e a volta). */
export const LINK_REQUEST_TYP = 'gmail_link';

/** Tipo do selo do ticket de vínculo emitido por `link_account`. */
export const LINK_TICKET_TYP = 'gmail_link_ticket';

/** Pedido de vínculo guardado no KV entre a ida ao Google e a volta. */
export interface LinkRequest {
  readonly owner: string;
  readonly verifier: string;
  readonly nonce: string;
}

/** Segundos Unix do relógio das dependências. */
export function nowSeconds(deps: GmailDeps): number {
  return Math.floor(deps.now() / 1000);
}

/** Link de vínculo de uso único para o usuário (vale 10 minutos). */
export function issueLinkUrl(deps: OwnerDeps): string {
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const ticket = sealPayload(
    { typ: LINK_TICKET_TYP, exp, owner: deps.owner, jti: randomToken(16) },
    deps.settings.tokenKey,
  );
  return `${deps.origin}/accounts/link?ticket=${ticket}`;
}

/** Resgata o ticket (uso único, marcado no KV até vencer); devolve o usuário, ou nulo se inválido ou já usado. */
export async function redeemLinkTicket(deps: GmailDeps, ticket: string): Promise<string | null> {
  const claims = openSealed(ticket, deps.settings.tokenKey, {
    typ: LINK_TICKET_TYP,
    now: nowSeconds(deps),
  });
  if (typeof claims?.owner !== 'string' || typeof claims.jti !== 'string') return null;
  const usedKey = `ticket:${sha256Hex(claims.jti)}`;
  if ((await deps.kv.get(usedKey)) !== null) return null;
  await deps.kv.put(usedKey, '1', { expirationTtl: LINK_TTL_SECONDS });
  return claims.owner;
}

/** Chave do pedido de vínculo no KV. */
export function linkRequestKey(state: string): string {
  return `link:${sha256Hex(state)}`;
}

/** Valor de um cookie do header `Cookie`, ou nulo. */
export function readCookie(header: string | null, name: string): string | null {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

/** Header `Set-Cookie` do vínculo (vazio e vencido quando `value` é nulo, para apagar). */
export function linkCookie(value: string | null): string {
  const age = value === null ? 0 : LINK_TTL_SECONDS;
  return `${LINK_COOKIE}=${value ?? ''}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
}

/** Página de link inválido, vencido ou já usado. */
export function invalidTicketPage(): Response {
  return messagePage(
    'Link inválido ou vencido',
    'Peça ao Claude um novo link de vínculo (ferramenta link_account). Cada link vale 10 minutos e uma vez.',
    400,
  );
}

/** `GET /accounts/link?ticket=...`: resgata o ticket, grava o pedido (selado) e manda o navegador ao Google. */
export async function startAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const owner = await redeemLinkTicket(deps, new URL(request.url).searchParams.get('ticket') ?? '');
  if (owner === null) return invalidTicketPage();
  const state = `${LINK_STATE_PREFIX}${randomToken()}`;
  const binding = randomToken();
  const link: LinkRequest = { owner, verifier: randomToken(), nonce: randomToken() };
  const exp = nowSeconds(deps) + LINK_TTL_SECONDS;
  const sealed = sealPayload(
    { typ: LINK_REQUEST_TYP, exp, bindingHash: sha256Hex(binding), ...link },
    deps.settings.tokenKey,
  );
  await deps.kv.put(linkRequestKey(state), sealed, { expirationTtl: LINK_TTL_SECONDS });
  const location = googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: GMAIL_SCOPES,
    state,
    codeChallenge: pkceChallenge(link.verifier),
    nonce: link.nonce,
    offline: true,
  });
  return redirectWith(location, new Headers({ 'set-cookie': linkCookie(binding) }));
}

/** Recupera e apaga (uso único) o pedido de vínculo; nulo se não existir, vencer ou o cookie não conferir. */
export async function takeLinkRequest(
  deps: GmailDeps,
  request: Request,
): Promise<LinkRequest | null> {
  const key = linkRequestKey(new URL(request.url).searchParams.get('state') ?? '');
  const sealed = await deps.kv.get(key);
  if (sealed === null) return null;
  await deps.kv.delete(key);
  const claims = openSealed(sealed, deps.settings.tokenKey, {
    typ: LINK_REQUEST_TYP,
    now: nowSeconds(deps),
  });
  const binding = readCookie(request.headers.get('cookie'), LINK_COOKIE);
  if (!claims || binding === null || sha256Hex(binding) !== claims.bindingHash) return null;
  return {
    owner: String(claims.owner),
    verifier: String(claims.verifier),
    nonce: String(claims.nonce),
  };
}

/** Motivo para não gravar a conta (sem permissão do Gmail ou sem refresh token), ou nulo se pode. */
export function linkRefusalReason(tokens: GoogleTokens): string | null {
  if (!tokens.scope.split(' ').includes(GMAIL_READONLY_SCOPE)) {
    return 'Marque a permissão de ler o Gmail na tela do Google e tente de novo.';
  }
  if (tokens.refreshToken === null) return 'O Google não devolveu o refresh token. Tente de novo.';
  return null;
}

/** Grava (ou troca) a conta nas contas do usuário e descarta o access token antigo dela. */
export async function storeGoogleAccount(
  deps: OwnerDeps,
  email: string,
  tokens: GoogleTokens,
): Promise<void> {
  const accounts = await loadOwnerAccounts(deps.kv, deps.settings.tokenKey, deps.owner);
  const updated = upsertAccount(accounts, {
    email,
    refreshToken: tokens.refreshToken ?? '',
    scope: tokens.scope,
    linkedAt: new Date(deps.now()).toISOString(),
    status: 'active',
  });
  await saveOwnerAccounts(deps.kv, deps.settings.tokenKey, {
    owner: deps.owner,
    accounts: updated,
  });
  forgetAccessToken(deps.owner, email);
}

/** Troca o código, valida o `id_token` e grava a conta no usuário do ticket; devolve a página do resultado. */
export async function linkFromCode(
  deps: GmailDeps,
  code: string,
  link: LinkRequest,
): Promise<Response> {
  const tokens = await exchangeGoogleCode(deps, code, link.verifier);
  if (tokens.idToken === null)
    return messagePage('Falha no vínculo', 'Sem id_token do Google.', 400);
  const { email } = await verifyGoogleIdToken(deps, tokens.idToken, link.nonce);
  const refusal = linkRefusalReason(tokens);
  if (refusal !== null) return messagePage('Permissão faltando', refusal, 400);
  await storeGoogleAccount({ ...deps, owner: link.owner }, email, tokens);
  return messagePage('Conta vinculada', `A conta ${email} foi vinculada. Pode fechar esta página.`);
}

/** Roda `linkFromCode` convertendo falhas (Google fora, `id_token` inválido) em página 400 sem gravar nada. */
export async function linkSafely(
  deps: GmailDeps,
  code: string,
  link: LinkRequest,
): Promise<Response> {
  try {
    return await linkFromCode(deps, code, link);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return messagePage('Falha no vínculo', `${message} Nada foi gravado; tente de novo.`, 400);
  }
}

/** Volta do Google no vínculo: confere o pedido, trata recusa e erros e apaga o cookie. */
export async function finishAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const link = await takeLinkRequest(deps, request);
  let response: Response;
  if (!link) {
    response = invalidTicketPage();
  } else if (params.get('error') !== null || !params.get('code')) {
    response = messagePage(
      'Vínculo cancelado',
      'O Google não autorizou o acesso. Nada foi gravado.',
      400,
    );
  } else {
    response = await linkSafely(deps, params.get('code') ?? '', link);
  }
  response.headers.append('set-cookie', linkCookie(null));
  return response;
}
