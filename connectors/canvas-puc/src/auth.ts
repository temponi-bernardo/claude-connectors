/**
 * Autenticação no Canvas: sessão do navegador (preferida, renovável sem janela) ou token de acesso (reserva).
 */
import {
  clearSession,
  cookieHeader,
  csrfToken,
  loadSession,
  saveSession,
  type CanvasSession,
} from './session.js';

/** Credencial usada numa requisição. */
export type CanvasAuth =
  | { readonly kind: 'session'; readonly session: CanvasSession }
  | { readonly kind: 'token'; readonly token: string };

/** `silent`: navegador oculto, só funciona se o login da Microsoft estiver guardado. `window`: janela visível. */
export type LoginMode = 'silent' | 'window';

/** Faz o login no navegador e devolve a sessão (implementada em `browser-login.ts`). */
export type BrowserLoginFn = (mode: LoginMode) => Promise<CanvasSession>;

/** Dependências do provedor de autenticação. */
export interface AuthDeps {
  readonly token: string | null;
  readonly sessionFile: string;
  readonly login: BrowserLoginFn;
}

/** Estado mutável do provedor: sessão atual e renovação em andamento (uma por vez). */
export interface AuthState {
  session: CanvasSession | null;
  pending: Promise<CanvasAuth | null> | null;
}

/** Provedor usado pelo cliente HTTP e pelas ferramentas de conexão. */
export interface AuthProvider {
  readonly current: () => CanvasAuth | null;
  readonly renew: () => Promise<CanvasAuth | null>;
  readonly connect: () => Promise<CanvasSession>;
  readonly disconnect: () => void;
}

/** Escolhe a credencial atual: sessão se houver, senão token, senão nenhuma. */
export function pickAuth(session: CanvasSession | null, token: string | null): CanvasAuth | null {
  if (session) return { kind: 'session', session };
  return token ? { kind: 'token', token } : null;
}

/** Headers de autenticação: `Cookie` (+ `X-CSRF-Token` fora de GET) para sessão, `Bearer` para token. */
export function authHeaders(auth: CanvasAuth, method: string): Record<string, string> {
  if (auth.kind === 'token') return { Authorization: `Bearer ${auth.token}` };
  const headers: Record<string, string> = { Cookie: cookieHeader(auth.session) };
  const csrf = csrfToken(auth.session);
  if (method !== 'GET' && csrf) headers['X-CSRF-Token'] = csrf;
  return headers;
}

/** Faz login no modo pedido, salva a sessão e a guarda no estado. */
export async function loginAndStore(
  deps: AuthDeps,
  state: AuthState,
  mode: LoginMode,
): Promise<CanvasSession> {
  const session = await deps.login(mode);
  saveSession(deps.sessionFile, session);
  state.session = session;
  return session;
}

/** Renova: login silencioso; se falhar, usa o token (se houver) ou abre a janela de login. */
export async function renewAuth(deps: AuthDeps, state: AuthState): Promise<CanvasAuth | null> {
  try {
    return pickAuth(await loginAndStore(deps, state, 'silent'), null);
  } catch {
    if (deps.token) return pickAuth(null, deps.token);
  }
  try {
    return pickAuth(await loginAndStore(deps, state, 'window'), null);
  } catch {
    return null;
  }
}

/** Garante uma renovação por vez: chamadas simultâneas esperam a mesma promessa. */
export function renewOnce(deps: AuthDeps, state: AuthState): Promise<CanvasAuth | null> {
  state.pending ??= renewAuth(deps, state).finally(() => {
    state.pending = null;
  });
  return state.pending;
}

/** Cria o provedor de autenticação a partir da sessão salva em disco. */
export function createAuthProvider(deps: AuthDeps): AuthProvider {
  const state: AuthState = { session: loadSession(deps.sessionFile), pending: null };
  return {
    current: () => pickAuth(state.session, deps.token),
    renew: () => renewOnce(deps, state),
    connect: () => loginAndStore(deps, state, 'window'),
    disconnect: () => {
      clearSession(deps.sessionFile);
      state.session = null;
    },
  };
}
