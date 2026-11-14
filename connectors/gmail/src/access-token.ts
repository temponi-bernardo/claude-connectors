/**
 * Access tokens do Google por conta vinculada: renova pelo refresh token e guarda o resultado na memória do
 * isolate até perto de vencer (por usuário e conta). Acesso revogado no Google marca a conta para novo vínculo.
 */
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { GoogleTokenError, refreshGoogleToken } from './google-oauth.js';
import { loadOwnerAccounts, saveOwnerAccounts } from './token-store.js';

/** Margem antes do vencimento em que o access token já é renovado (ms). */
export const ACCESS_TOKEN_MARGIN_MS = 60_000;

/** Access tokens em memória por usuário e conta (vivem só enquanto o isolate do Worker vive). */
const accessTokenCache = new Map<string, { token: string; expiresAt: number }>();

/** Chave do cache: usuário e conta (a mesma conta Gmail pode estar vinculada a dois usuários). */
export function accessTokenKey(owner: string, email: string): string {
  return `${owner}\n${email}`;
}

/** Esquece o access token guardado de uma conta (ex.: depois de um 401 do Gmail ou de um novo vínculo). */
export function forgetAccessToken(owner: string, email: string): void {
  accessTokenCache.delete(accessTokenKey(owner, email));
}

/** Esquece todos os access tokens guardados. */
export function clearAccessTokenCache(): void {
  accessTokenCache.clear();
}

/** Erro acionável de conta que perdeu o acesso ao Gmail. */
export function relinkError(alias: string): Error {
  return new Error(
    `A conta "${alias}" perdeu o acesso ao Gmail (revogado ou expirado). Use link_account e entre com ela de novo.`,
  );
}

/** Marca a conta do usuário como revogada no KV. */
export async function markAccountRevoked(deps: OwnerDeps, email: string): Promise<void> {
  const accounts = await loadOwnerAccounts(deps.kv, deps.settings.tokenKey, deps.owner);
  const updated = accounts.map((a) =>
    a.email === email ? { ...a, status: 'revoked' as const } : a,
  );
  await saveOwnerAccounts(deps.kv, deps.settings.tokenKey, {
    owner: deps.owner,
    accounts: updated,
  });
}

/** Renova o access token; se o Google disser `invalid_grant`, marca a conta como revogada e pede novo vínculo. */
export async function renewAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string> {
  try {
    const tokens = await refreshGoogleToken(deps, ref.account.refreshToken);
    const expiresAt = deps.now() + tokens.expiresIn * 1000 - ACCESS_TOKEN_MARGIN_MS;
    accessTokenCache.set(accessTokenKey(deps.owner, ref.account.email), {
      token: tokens.accessToken,
      expiresAt,
    });
    return tokens.accessToken;
  } catch (error) {
    if (!(error instanceof GoogleTokenError) || error.code !== 'invalid_grant') throw error;
    await markAccountRevoked(deps, ref.account.email);
    throw relinkError(ref.alias);
  }
}

/** Access token válido da conta: da memória, ou renovado pelo refresh token. */
export async function getAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string> {
  if (ref.account.status === 'revoked') throw relinkError(ref.alias);
  const cached = accessTokenCache.get(accessTokenKey(deps.owner, ref.account.email));
  if (cached && cached.expiresAt > deps.now()) return cached.token;
  return renewAccessToken(deps, ref);
}
