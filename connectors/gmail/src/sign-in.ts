/**
 * Login de quem instalou o conector (OAuth 2.1 do Claude → Worker): consentimento por cliente, ida ao Google
 * com `openid email` e `gmail.modify` (acesso offline), volta validada pela biblioteca (`state` de uso único
 * preso ao navegador) e checagem do `id_token`. A conta que entrou já fica vinculada ao usuário. Qualquer
 * conta Google entra, a menos que `ALLOWED_EMAILS` restrinja (modo privado).
 */
import {
  AuthorizationError,
  authorizationErrorRedirect,
  type AuthRequest,
  type OAuthHelpers,
} from '@cloudflare/workers-oauth-provider';
import { readForm } from '../../../src/remote/handler.js';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { GMAIL_SCOPES, isEmailAllowed } from './config.js';
import type { GmailDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  randomToken,
  type GoogleTokens,
} from './google-oauth.js';
import { verifyGoogleIdToken, type GoogleIdentity } from './id-token.js';
import { linkRefusalReason, storeGoogleAccount } from './link-flow.js';
import { consentPage, messagePage, redirectWith } from './pages.js';

/** Dados guardados (cifrados) pela biblioteca entre a ida ao Google e a volta. */
export interface SignInData {
  readonly verifier: string;
  readonly nonce: string;
}

/** O que o token do Claude carrega (`ctx.props` no `/mcp`): o usuário (`sub`), o e-mail e um id da sessão. */
export interface GrantProps {
  readonly owner: string;
  readonly email: string;
  readonly sid: string;
}

/** Página 403 para contas Google fora de `ALLOWED_EMAILS` (só no modo privado). */
export function accessDeniedPage(): Response {
  return messagePage('Acesso negado', 'Esta conta Google não está autorizada neste conector.', 403);
}

/** Resposta para um erro de autorização: volta ao cliente quando a biblioteca diz para onde, senão página. */
export function authorizationErrorResponse(error: unknown): Response {
  if (error instanceof AuthorizationError && error.redirectTo) {
    return redirectWith(error.redirectTo);
  }
  const message =
    error instanceof AuthorizationError ? error.description : 'Pedido de autorização inválido.';
  return messagePage('Não foi possível conectar', message, 400);
}

/** Inicia a ida ao Google pedindo identidade e Gmail só leitura com refresh token. */
export async function beginGoogleSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  approved: { readonly request: AuthRequest; readonly headers: Headers },
): Promise<Response> {
  const data: SignInData = { verifier: randomToken(), nonce: randomToken() };
  const { state, headers } = await oauth.beginUpstream(approved.request, {
    data,
    headers: approved.headers,
  });
  const location = googleAuthorizeUrl({
    clientId: deps.settings.googleClientId,
    redirectUri: googleRedirectUri(deps.origin),
    scopes: GMAIL_SCOPES,
    state,
    codeChallenge: pkceChallenge(data.verifier),
    nonce: data.nonce,
    offline: true,
  });
  return redirectWith(location, headers);
}

/** `GET /authorize`: valida o pedido do Claude e mostra o consentimento (ou segue, se já foi lembrado). */
export async function showAuthorize(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const authRequest = await oauth.parseAuthRequest(request);
    const remember = { secret: deps.settings.consentSecret };
    if (await oauth.isConsentRemembered(request, authRequest, remember)) {
      return await beginGoogleSignIn(deps, oauth, { request: authRequest, headers: new Headers() });
    }
    const details = await oauth.describeConsent(authRequest);
    const consent = await oauth.beginConsent(authRequest);
    return consentPage(details, consent.handle, consent.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** `POST /authorize`: aprova (lembrando por 30 dias) e vai ao Google, ou nega e volta ao Claude. */
export async function submitAuthorize(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const form = await readForm(request);
    const handle = form.get('handle') ?? '';
    if (form.get('decision') !== 'approve') {
      const denied = await oauth.denyConsent(request, handle);
      return redirectWith(denied.redirectTo, denied.headers);
    }
    const approved = await oauth.approveConsent(request, handle, {
      remember: { secret: deps.settings.consentSecret },
    });
    return await beginGoogleSignIn(deps, oauth, approved);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}

/** Vincula a conta que acabou de entrar, se o Google deu o Gmail e o refresh token; falha não impede o login. */
export async function linkSignedInAccount(
  deps: GmailDeps,
  identity: GoogleIdentity,
  tokens: GoogleTokens,
): Promise<boolean> {
  if (linkRefusalReason(tokens) !== null) return false;
  try {
    await storeGoogleAccount({ ...deps, owner: identity.sub }, identity.email, tokens);
    return true;
  } catch {
    return false;
  }
}

/** Valida o código do Google e, se a conta pode entrar, vincula-a e conclui a autorização do Claude. */
export async function completeSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string },
): Promise<string | null> {
  const tokens = await exchangeGoogleCode(deps, resumed.code, resumed.data.verifier);
  if (tokens.idToken === null) throw new Error('O Google não devolveu o id_token.');
  const identity = await verifyGoogleIdToken(deps, tokens.idToken, resumed.data.nonce);
  if (!isEmailAllowed(deps.settings, identity.email)) return null;
  await linkSignedInAccount(deps, identity, tokens);
  const props: GrantProps = { owner: identity.sub, email: identity.email, sid: randomToken(16) };
  const { redirectTo } = await oauth.completeAuthorization({
    request: resumed.request,
    userId: identity.sub,
    metadata: {},
    scope: resumed.request.scope,
    props,
  });
  return redirectTo;
}

/** Volta do Google no login: recusa vira `access_denied` para o Claude; conta fora da allowlist, 403. */
export async function finishSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const resumed = await oauth.finishUpstream<SignInData>(request);
    const code = new URL(request.url).searchParams.get('code');
    if (!code) {
      const denied = authorizationErrorRedirect(resumed.request, 'access_denied');
      return redirectWith(denied, resumed.headers);
    }
    const args = { request: resumed.request, data: resumed.data, code };
    const redirectTo = await completeSignIn(deps, oauth, args);
    if (redirectTo === null) return accessDeniedPage();
    return redirectWith(redirectTo, resumed.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}
