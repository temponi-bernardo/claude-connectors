/**
 * Código de autorização, access token e refresh token do OAuth sem estado: todos são selos que carregam
 * o segredo do usuário no serviço de destino (ex.: token do Canvas) e só abrem com a chave do servidor.
 */
import {
  oauthError,
  pkceChallenge,
  type AuthorizeRequest,
  type OAuthResult,
  type OAuthSettings,
} from './oauth.js';
import { openSealed, sealPayload } from './seal.js';

/** Validades em segundos: pedido em andamento, código, access token e refresh token. */
export const PENDING_TTL_SECONDS = 15 * 60;
export const CODE_TTL_SECONDS = 5 * 60;
export const ACCESS_TTL_SECONDS = 60 * 60;
export const REFRESH_TTL_SECONDS = 30 * 24 * 3600;

/** Resposta do endpoint `/token`. */
export interface TokenSet {
  readonly access_token: string;
  readonly token_type: 'Bearer';
  readonly expires_in: number;
  readonly refresh_token: string;
}

/** Resultado do `/token`: os tokens novos, o segredo selado neles e se veio de um refresh. */
export interface RedeemedGrant {
  readonly tokens: TokenSet;
  readonly secret: string;
  readonly refreshed: boolean;
}

/** Pedido aprovado: o pedido validado e o segredo que o usuário informou. */
export interface ApprovedGrant {
  readonly request: AuthorizeRequest;
  readonly secret: string;
}

/** Sela o pedido de autorização para viajar no formulário de login sem poder ser alterado. */
export function sealAuthorizeRequest(
  request: AuthorizeRequest,
  settings: OAuthSettings,
  now: number,
): string {
  return sealPayload({ typ: 'pending', exp: now + PENDING_TTL_SECONDS, request }, settings.key);
}

/** Abre o pedido selado do formulário; nulo se inválido ou vencido. */
export function openAuthorizeRequest(
  sealed: string,
  settings: OAuthSettings,
  now: number,
): AuthorizeRequest | null {
  const claims = openSealed(sealed, settings.key, { typ: 'pending', now });
  return claims ? (claims.request as AuthorizeRequest) : null;
}

/** Emite o código de autorização (5 minutos) amarrado a cliente, retorno e desafio PKCE. */
export function issueAuthorizationCode(
  grant: ApprovedGrant,
  settings: OAuthSettings,
  now: number,
): string {
  const { clientId, redirectUri, codeChallenge } = grant.request;
  return sealPayload(
    {
      typ: 'code',
      exp: now + CODE_TTL_SECONDS,
      clientId,
      redirectUri,
      codeChallenge,
      secret: grant.secret,
    },
    settings.key,
  );
}

/** Emite o par access token (1 hora) + refresh token (30 dias) para um segredo. */
export function issueTokenSet(secret: string, settings: OAuthSettings, now: number): TokenSet {
  return {
    access_token: sealPayload(
      { typ: 'access', exp: now + ACCESS_TTL_SECONDS, secret },
      settings.key,
    ),
    token_type: 'Bearer',
    expires_in: ACCESS_TTL_SECONDS,
    refresh_token: sealPayload(
      { typ: 'refresh', exp: now + REFRESH_TTL_SECONDS, secret },
      settings.key,
    ),
  };
}

/** Confere o código contra cliente, retorno e verificador PKCE; devolve o segredo dele. */
export function redeemAuthorizationCode(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<string> {
  const claims = openSealed(form.get('code') ?? '', settings.key, { typ: 'code', now });
  const matches =
    claims !== null &&
    claims.clientId === form.get('client_id') &&
    claims.redirectUri === form.get('redirect_uri') &&
    claims.codeChallenge === pkceChallenge(form.get('code_verifier') ?? '');
  if (!matches) return oauthError('invalid_grant', 'Código inválido, vencido ou de outro cliente.');
  return { ok: true, value: String(claims.secret) };
}

/** Confere o refresh token; devolve o segredo dele. */
export function redeemRefreshToken(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<string> {
  const claims = openSealed(form.get('refresh_token') ?? '', settings.key, { typ: 'refresh', now });
  if (!claims)
    return oauthError('invalid_grant', 'Refresh token inválido ou vencido: conecte de novo.');
  return { ok: true, value: String(claims.secret) };
}

/** Atende o `/token`: troca código ou refresh token por um novo par de tokens. */
export function redeemTokenRequest(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<RedeemedGrant> {
  const grantType = form.get('grant_type');
  let secret: OAuthResult<string>;
  if (grantType === 'authorization_code') secret = redeemAuthorizationCode(form, settings, now);
  else if (grantType === 'refresh_token') secret = redeemRefreshToken(form, settings, now);
  else return oauthError('unsupported_grant_type', 'Use authorization_code ou refresh_token.');
  if (!secret.ok) return secret;
  const tokens = issueTokenSet(secret.value, settings, now);
  return {
    ok: true,
    value: { tokens, secret: secret.value, refreshed: grantType === 'refresh_token' },
  };
}

/** Lê o segredo de um header `Authorization: Bearer <access token>`; nulo se ausente ou inválido. */
export function readAccessSecret(
  authorization: string | null,
  settings: OAuthSettings,
  now: number,
): string | null {
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
  if (!match?.[1]) return null;
  const claims = openSealed(match[1], settings.key, { typ: 'access', now });
  return claims ? String(claims.secret) : null;
}
