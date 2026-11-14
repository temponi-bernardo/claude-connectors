/**
 * Login do dono no conector (OAuth 2.1 do Claude → Worker): consentimento por cliente, ida ao Google só
 * com `openid email`, volta validada pela biblioteca (`state` de uso único preso ao navegador) e checagem
 * do `id_token` e da allowlist antes de emitir o código para o Claude.
 */
import {
  AuthorizationError,
  authorizationErrorRedirect,
  type AuthRequest,
  type OAuthHelpers,
} from '@cloudflare/workers-oauth-provider';
import { readForm } from '../../../src/remote/handler.js';
import { pkceChallenge } from '../../../src/remote/oauth.js';
import { findAllowedAccount, SIGN_IN_SCOPES } from './config.js';
import type { GmailDeps } from './context.js';
import {
  exchangeGoogleCode,
  googleAuthorizeUrl,
  googleRedirectUri,
  randomToken,
} from './google-oauth.js';
import { verifyGoogleIdToken } from './id-token.js';
import { accessDeniedPage } from './link-flow.js';
import { consentPage, messagePage, redirectWith } from './pages.js';

/** Dados guardados (cifrados) pela biblioteca entre a ida ao Google e a volta. */
export interface SignInData {
  readonly verifier: string;
  readonly nonce: string;
}

/** O que o token do Claude carrega (`ctx.props` no `/mcp`): o e-mail do dono e um id da sessão. */
export interface GrantProps {
  readonly email: string;
  readonly sid: string;
}

/** Resposta para um erro de autorização: volta ao cliente quando a biblioteca diz para onde, senão página. */
export function authorizationErrorResponse(error: unknown): Response {
  if (error instanceof AuthorizationError && error.redirectTo)
    return redirectWith(error.redirectTo);
  const message =
    error instanceof AuthorizationError ? error.description : 'Pedido de autorização inválido.';
  return messagePage('Não foi possível conectar', message, 400);
}

/** Inicia a ida ao Google (sem refresh token: só identifica o dono). */
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
    scopes: SIGN_IN_SCOPES,
    state,
    codeChallenge: pkceChallenge(data.verifier),
    nonce: data.nonce,
    offline: false,
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

/** Valida o código do Google e, se o e-mail estiver na allowlist, conclui a autorização do Claude. */
export async function completeSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string },
): Promise<string | null> {
  const tokens = await exchangeGoogleCode(deps, resumed.code, resumed.data.verifier);
  if (tokens.idToken === null) throw new Error('O Google não devolveu o id_token.');
  const email = await verifyGoogleIdToken(deps, tokens.idToken, resumed.data.nonce);
  if (!findAllowedAccount(deps.settings.accounts, email)) return null;
  const props: GrantProps = { email, sid: randomToken(16) };
  const { redirectTo } = await oauth.completeAuthorization({
    request: resumed.request,
    userId: email,
    metadata: {},
    scope: resumed.request.scope,
    props,
  });
  return redirectTo;
}

/** Volta do Google no login: recusa vira `access_denied` para o Claude; e-mail fora da allowlist, 403. */
export async function finishSignIn(
  deps: GmailDeps,
  oauth: OAuthHelpers,
  request: Request,
): Promise<Response> {
  try {
    const resumed = await oauth.finishUpstream<SignInData>(request);
    const code = new URL(request.url).searchParams.get('code');
    if (!code) {
      return redirectWith(
        authorizationErrorRedirect(resumed.request, 'access_denied'),
        resumed.headers,
      );
    }
    const redirectTo = await completeSignIn(deps, oauth, {
      request: resumed.request,
      data: resumed.data,
      code,
    });
    if (redirectTo === null) return accessDeniedPage();
    return redirectWith(redirectTo, resumed.headers);
  } catch (error) {
    return authorizationErrorResponse(error);
  }
}
