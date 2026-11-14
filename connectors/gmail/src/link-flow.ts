/**
 * Vínculo de uma conta Gmail (`/accounts/link`): login no Google com `gmail.readonly` e acesso offline,
 * `state` de uso único preso ao navegador por cookie `__Host-`, PKCE S256 e `nonce`. Só e-mails da
 * allowlist com `id_token` válido têm o refresh token gravado (selado) no KV.
 */
import { createHash } from 'node:crypto';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { forgetAccessToken } from './access-token.js';
import { findAllowedAccount, GMAIL_LINK_SCOPES, GMAIL_READONLY_SCOPE } from './config.js';
import type { GmailDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  randomToken,
  type GoogleTokens,
} from './google-oauth.js';
import { verifyGoogleIdToken } from './id-token.js';
import { messagePage, redirectWith } from './pages.js';
import { saveLinkedAccount } from './token-store.js';

/** Prefixo do `state` do vínculo (o `state` da biblioteca OAuth nunca tem ponto). */
export const LINK_STATE_PREFIX = 'link.';

/** Cookie que prende o `state` ao navegador que iniciou o vínculo. */
export const LINK_COOKIE = '__Host-gmail-link';

/** Validade do pedido de vínculo, em segundos. */
export const LINK_TTL_SECONDS = 600;

/** Tipo do selo do pedido de vínculo. */
export const LINK_REQUEST_TYP = 'gmail_link';

/** Pedido de vínculo guardado no KV entre a ida ao Google e a volta. */
export interface LinkRequest {
  readonly verifier: string;
  readonly nonce: string;
  readonly bindingHash: string;
}

/** SHA-256 em hexadecimal (o KV só guarda o hash do `state` e do cookie). */
export function sha256Hex(text: string): string {
  return createHash('sha256').update(text).digest('hex');
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

/** `GET /accounts/link`: grava o pedido (selado, com validade) e manda o navegador ao Google. */
export async function startAccountLink(deps: GmailDeps): Promise<Response> {
  const state = `${LINK_STATE_PREFIX}${randomToken()}`;
  const binding = randomToken();
  const request: LinkRequest = {
    verifier: randomToken(),
    nonce: randomToken(),
    bindingHash: sha256Hex(binding),
  };
  const exp = Math.floor(deps.now() / 1000) + LINK_TTL_SECONDS;
  const sealed = sealPayload({ typ: LINK_REQUEST_TYP, exp, ...request }, deps.settings.tokenKey);
  await deps.kv.put(linkRequestKey(state), sealed, { expirationTtl: LINK_TTL_SECONDS });
  const location = googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: GMAIL_LINK_SCOPES,
    state,
    codeChallenge: pkceChallenge(request.verifier),
    nonce: request.nonce,
    offline: true,
  });
  return redirectWith(location, new Headers({ 'set-cookie': linkCookie(binding) }));
}

/** Recupera e apaga (uso único) o pedido de vínculo; nulo se não existir, vencer ou o cookie não conferir. */
export async function takeLinkRequest(
  deps: GmailDeps,
  request: Request,
): Promise<LinkRequest | null> {
  const state = new URL(request.url).searchParams.get('state') ?? '';
  const key = linkRequestKey(state);
  const sealed = await deps.kv.get(key);
  if (sealed === null) return null;
  await deps.kv.delete(key);
  const now = Math.floor(deps.now() / 1000);
  const claims = openSealed(sealed, deps.settings.tokenKey, { typ: LINK_REQUEST_TYP, now });
  const binding = readCookie(request.headers.get('cookie'), LINK_COOKIE);
  if (!claims || binding === null || sha256Hex(binding) !== claims.bindingHash) return null;
  return {
    verifier: String(claims.verifier),
    nonce: String(claims.nonce),
    bindingHash: sha256Hex(binding),
  };
}

/** Página 403 para contas Google fora da allowlist. */
export function accessDeniedPage(): Response {
  return messagePage('Acesso negado', 'Esta conta Google não está autorizada neste conector.', 403);
}

/** Página de recusa quando os tokens não servem para ler o Gmail (sem escopo ou sem refresh token), ou nula. */
export function linkRefusal(tokens: GoogleTokens): Response | null {
  if (!tokens.scope.split(' ').includes(GMAIL_READONLY_SCOPE)) {
    return messagePage(
      'Permissão faltando',
      'Marque a permissão de ler o Gmail na tela do Google e tente de novo.',
      400,
    );
  }
  if (tokens.refreshToken === null) {
    return messagePage(
      'Falha no vínculo',
      'O Google não devolveu o refresh token. Tente de novo.',
      400,
    );
  }
  return null;
}

/** Grava a conta com o refresh token (selado) e descarta o access token antigo dela. */
export async function storeLinkedAccount(
  deps: GmailDeps,
  email: string,
  tokens: GoogleTokens,
): Promise<void> {
  await saveLinkedAccount(deps.kv, deps.settings.tokenKey, {
    email,
    refreshToken: tokens.refreshToken ?? '',
    scope: tokens.scope,
    linkedAt: new Date(deps.now()).toISOString(),
    status: 'active',
  });
  forgetAccessToken(email);
}

/** Troca o código, valida o `id_token` e grava a conta se ela for permitida; devolve a página do resultado. */
export async function linkFromCode(
  deps: GmailDeps,
  code: string,
  link: LinkRequest,
): Promise<Response> {
  const tokens = await exchangeGoogleCode(deps, code, link.verifier);
  if (tokens.idToken === null)
    return messagePage('Falha no vínculo', 'Sem id_token do Google.', 400);
  const email = await verifyGoogleIdToken(deps, tokens.idToken, link.nonce);
  const allowed = findAllowedAccount(deps.settings.accounts, email);
  if (!allowed) {
    return messagePage(
      'Acesso negado',
      'Esta conta Google não está autorizada neste conector.',
      403,
    );
  }
  const refusal = linkRefusal(tokens);
  if (refusal) return refusal;
  await storeLinkedAccount(deps, email, tokens);
  return messagePage(
    'Conta vinculada',
    `A conta "${allowed.alias}" foi vinculada. Pode fechar esta página.`,
  );
}

/** Volta do Google no vínculo: confere o pedido, trata recusa e erros e apaga o cookie. */
export async function finishAccountLink(deps: GmailDeps, request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const link = await takeLinkRequest(deps, request);
  let response: Response;
  if (!link) {
    response = messagePage(
      'Pedido expirado',
      'Abra /accounts/link de novo neste mesmo navegador.',
      400,
    );
  } else if (params.get('error') !== null || !params.get('code')) {
    response = messagePage(
      'Vínculo cancelado',
      'O Google não autorizou o acesso. Nada foi gravado.',
      400,
    );
  } else {
    response = await linkFromCode(deps, params.get('code') ?? '', link);
  }
  response.headers.append('set-cookie', linkCookie(null));
  return response;
}
