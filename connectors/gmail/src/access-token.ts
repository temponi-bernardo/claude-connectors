/**
 * Access tokens do Google por conta: lê o vínculo no KV, renova pelo refresh token e guarda o resultado
 * na memória do isolate até perto de vencer. Acesso revogado no Google marca a conta para novo vínculo.
 */
import type { AllowedAccount } from './config.js';
import type { GmailDeps } from './context.js';
import { GoogleTokenError, refreshGoogleToken } from './google-oauth.js';
import { loadLinkedAccount, saveLinkedAccount, type LinkedAccount } from './token-store.js';

/** Margem antes do vencimento em que o access token já é renovado (ms). */
export const ACCESS_TOKEN_MARGIN_MS = 60_000;

/** Access tokens em memória por e-mail (vivem só enquanto o isolate do Worker vive). */
const accessTokenCache = new Map<string, { token: string; expiresAt: number }>();

/** Esquece o access token guardado de uma conta (ex.: depois de um 401 do Gmail). */
export function forgetAccessToken(email: string): void {
  accessTokenCache.delete(email);
}

/** Esquece todos os access tokens guardados. */
export function clearAccessTokenCache(): void {
  accessTokenCache.clear();
}

/** Link da página que vincula contas. */
export function linkUrl(origin: string): string {
  return `${origin}/accounts/link`;
}

/** Erro acionável de conta sem vínculo válido (nunca vinculada ou revogada). */
export function relinkError(account: AllowedAccount, origin: string, revoked: boolean): Error {
  const why = revoked ? 'perdeu o acesso ao Gmail (revogado ou expirado)' : 'não está vinculada';
  return new Error(
    `A conta "${account.alias}" ${why}. Abra ${linkUrl(origin)} e entre com essa conta Google para vincular.`,
  );
}

/** Lê a conta vinculada e ativa; lança o erro de vínculo se não houver. */
export async function requireLinkedAccount(
  deps: GmailDeps,
  account: AllowedAccount,
): Promise<LinkedAccount> {
  const linked = await loadLinkedAccount(deps.kv, deps.settings.tokenKey, account);
  if (!linked) throw relinkError(account, deps.origin, false);
  if (linked.status === 'revoked') throw relinkError(account, deps.origin, true);
  return linked;
}

/** Renova o access token; se o Google disser `invalid_grant`, marca a conta como revogada e pede novo vínculo. */
export async function renewAccessToken(
  deps: GmailDeps,
  account: AllowedAccount,
  linked: LinkedAccount,
): Promise<string> {
  try {
    const tokens = await refreshGoogleToken(deps, linked.refreshToken);
    const expiresAt = deps.now() + tokens.expiresIn * 1000 - ACCESS_TOKEN_MARGIN_MS;
    accessTokenCache.set(account.email, { token: tokens.accessToken, expiresAt });
    return tokens.accessToken;
  } catch (error) {
    if (!(error instanceof GoogleTokenError) || error.code !== 'invalid_grant') throw error;
    await saveLinkedAccount(deps.kv, deps.settings.tokenKey, { ...linked, status: 'revoked' });
    throw relinkError(account, deps.origin, true);
  }
}

/** Access token válido da conta: da memória, ou renovado pelo refresh token do KV. */
export async function getAccessToken(deps: GmailDeps, account: AllowedAccount): Promise<string> {
  const cached = accessTokenCache.get(account.email);
  if (cached && cached.expiresAt > deps.now()) return cached.token;
  return renewAccessToken(deps, account, await requireLinkedAccount(deps, account));
}
