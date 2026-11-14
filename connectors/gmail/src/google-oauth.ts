/**
 * OAuth do Google (servidor de autorização "de cima"): URL de autorização com `state`, PKCE S256 e `nonce`,
 * troca do código e renovação do access token pelo refresh token.
 */
import { UPSTREAM_USER_AGENT, type GmailDeps } from './context.js';

/** Endpoint de autorização do Google. */
export const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

/** Endpoint de tokens do Google. */
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** Caminho do retorno do Google neste Worker (cadastrado no Google Cloud). */
export const GOOGLE_CALLBACK_PATH = '/google/callback';

/** Parâmetros da URL de autorização do Google. */
export interface GoogleAuthorizeParams {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly scopes: readonly string[];
  readonly state: string;
  readonly codeChallenge: string;
  readonly nonce: string;
  /** Pede refresh token (`access_type=offline` + `prompt=consent`): só no vínculo de conta. */
  readonly offline: boolean;
}

/** Resposta do endpoint de tokens do Google, já validada. */
export interface GoogleTokens {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly refreshToken: string | null;
  readonly idToken: string | null;
  readonly scope: string;
}

/** Erro devolvido pelo Google no endpoint de tokens (`invalid_grant` = acesso revogado). */
export class GoogleTokenError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`O Google recusou o token (${code}).`);
    this.name = 'GoogleTokenError';
    this.code = code;
  }
}

/** Endereço de retorno do Google para a origem do Worker. */
export function googleRedirectUri(origin: string): string {
  return `${origin}${GOOGLE_CALLBACK_PATH}`;
}

/** Monta a URL de autorização do Google. */
export function googleAuthorizeUrl(params: GoogleAuthorizeParams): string {
  const url = new URL(GOOGLE_AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: params.scopes.join(' '),
    state: params.state,
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
    nonce: params.nonce,
    ...(params.offline
      ? {
          access_type: 'offline',
          prompt: 'consent select_account',
          include_granted_scopes: 'false',
        }
      : { prompt: 'select_account' }),
  }).toString();
  return url.toString();
}

/** Texto aleatório em base64url com `bytes` bytes de entropia (state, nonce, verificador PKCE). */
export function randomToken(bytes = 32): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');
}

/** Valida o JSON de sucesso do endpoint de tokens; lança erro se faltar o access token. */
export function parseGoogleTokens(body: unknown): GoogleTokens {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  if (typeof data.access_token !== 'string') throw new GoogleTokenError('invalid_response');
  return {
    accessToken: data.access_token,
    expiresIn: typeof data.expires_in === 'number' ? data.expires_in : 3600,
    refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : null,
    idToken: typeof data.id_token === 'string' ? data.id_token : null,
    scope: typeof data.scope === 'string' ? data.scope : '',
  };
}

/** Código de erro OAuth de uma resposta de falha do Google (`error`), ou `http_<status>`. */
export async function googleErrorCode(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === 'string') return body.error;
  } catch {
    // corpo não é JSON: usa o status
  }
  return `http_${response.status}`;
}

/** Envia um formulário ao endpoint de tokens do Google com as credenciais do cliente. */
export async function postGoogleToken(
  deps: GmailDeps,
  form: Readonly<Record<string, string>>,
): Promise<GoogleTokens> {
  const body = new URLSearchParams({
    ...form,
    client_id: deps.settings.googleClientId,
    client_secret: deps.settings.googleClientSecret,
  });
  const response = await deps.fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': UPSTREAM_USER_AGENT,
    },
    body: body.toString(),
  });
  if (!response.ok) throw new GoogleTokenError(await googleErrorCode(response));
  return parseGoogleTokens(await response.json());
}

/** Troca o código de autorização do Google (com o verificador PKCE) por tokens. */
export function exchangeGoogleCode(
  deps: GmailDeps,
  code: string,
  verifier: string,
): Promise<GoogleTokens> {
  return postGoogleToken(deps, {
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier,
    redirect_uri: googleRedirectUri(deps.origin),
  });
}

/** Renova o access token com o refresh token guardado. */
export function refreshGoogleToken(deps: GmailDeps, refreshToken: string): Promise<GoogleTokens> {
  return postGoogleToken(deps, { grant_type: 'refresh_token', refresh_token: refreshToken });
}

/** Endpoint de revogação de tokens do Google. */
export const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

/** Revoga o refresh token no Google (o app perde o acesso à conta); devolve se o Google confirmou. */
export async function revokeGoogleToken(deps: GmailDeps, token: string): Promise<boolean> {
  try {
    const response = await deps.fetch(GOOGLE_REVOKE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': UPSTREAM_USER_AGENT,
      },
      body: new URLSearchParams({ token }).toString(),
    });
    return response.ok;
  } catch {
    return false;
  }
}
