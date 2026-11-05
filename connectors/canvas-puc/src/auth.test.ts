import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  authHeaders,
  createAuthProvider,
  loginAndStore,
  pickAuth,
  renewAuth,
  renewOnce,
  type AuthDeps,
  type AuthState,
  type LoginMode,
} from './auth.js';
import { loadSession, saveSession, type CanvasSession } from './session.js';

const session: CanvasSession = {
  baseUrl: 'https://x.test',
  savedAt: 's',
  cookies: [{ name: '_csrf_token', value: 'c%2B' }],
};

const dirs: string[] = [];
function sessionFile(): string {
  const dir = mkdtempSync(join(tmpdir(), 'canvas-auth-'));
  dirs.push(dir);
  return join(dir, 'session.json');
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Login falso: `results` diz, por modo, se devolve a sessão ou falha. */
function fakeLogin(results: Partial<Record<LoginMode, boolean>>) {
  return vi.fn((mode: LoginMode) =>
    results[mode] ? Promise.resolve(session) : Promise.reject(new Error(`falhou ${mode}`)),
  );
}

function deps(login: AuthDeps['login'], token: string | null = null): AuthDeps {
  return { token, sessionFile: sessionFile(), login };
}

function emptyState(): AuthState {
  return { session: null, pending: null };
}

describe('pickAuth', () => {
  it('prefere sessão, depois token, senão null', () => {
    expect(pickAuth(session, 't')).toEqual({ kind: 'session', session });
    expect(pickAuth(null, 't')).toEqual({ kind: 'token', token: 't' });
    expect(pickAuth(null, null)).toBeNull();
  });
});

describe('authHeaders', () => {
  it('usa Bearer para token', () => {
    expect(authHeaders({ kind: 'token', token: 't' }, 'GET')).toEqual({
      Authorization: 'Bearer t',
    });
  });

  it('usa Cookie e só manda CSRF fora de GET', () => {
    const auth = { kind: 'session', session } as const;
    expect(authHeaders(auth, 'GET')).toEqual({ Cookie: '_csrf_token=c%2B' });
    expect(authHeaders(auth, 'POST')).toEqual({ Cookie: '_csrf_token=c%2B', 'X-CSRF-Token': 'c+' });
    expect(authHeaders({ kind: 'session', session: { ...session, cookies: [] } }, 'POST')).toEqual({
      Cookie: '',
    });
  });
});

describe('loginAndStore', () => {
  it('salva a sessão em disco e no estado', async () => {
    const d = deps(fakeLogin({ window: true }));
    const state = emptyState();
    await expect(loginAndStore(d, state, 'window')).resolves.toBe(session);
    expect(state.session).toBe(session);
    expect(loadSession(d.sessionFile)).toEqual(session);
  });
});

describe('renewAuth', () => {
  it('usa o login silencioso quando funciona', async () => {
    const login = fakeLogin({ silent: true });
    await expect(renewAuth(deps(login), emptyState())).resolves.toEqual({
      kind: 'session',
      session,
    });
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('cai para o token sem abrir janela', async () => {
    const login = fakeLogin({ window: true });
    await expect(renewAuth(deps(login, 't'), emptyState())).resolves.toEqual({
      kind: 'token',
      token: 't',
    });
    expect(login).not.toHaveBeenCalledWith('window');
  });

  it('abre a janela quando não há token', async () => {
    const login = fakeLogin({ window: true });
    await expect(renewAuth(deps(login), emptyState())).resolves.toEqual({
      kind: 'session',
      session,
    });
    expect(login).toHaveBeenLastCalledWith('window');
  });

  it('devolve null quando tudo falha', async () => {
    await expect(renewAuth(deps(fakeLogin({})), emptyState())).resolves.toBeNull();
  });
});

describe('renewOnce', () => {
  it('reaproveita a renovação em andamento', async () => {
    const login = fakeLogin({ silent: true });
    const d = deps(login);
    const state = emptyState();
    const [a, b] = await Promise.all([renewOnce(d, state), renewOnce(d, state)]);
    expect(a).toEqual(b);
    expect(login).toHaveBeenCalledTimes(1);
    expect(state.pending).toBeNull();
  });
});

describe('createAuthProvider', () => {
  it('carrega a sessão do disco e a usa como credencial', () => {
    const d = deps(fakeLogin({}), 't');
    saveSession(d.sessionFile, session);
    expect(createAuthProvider(d).current()).toEqual({ kind: 'session', session });
  });

  it('conecta pela janela, renova e desconecta apagando a sessão', async () => {
    const d = deps(fakeLogin({ silent: true, window: true }));
    const provider = createAuthProvider(d);
    expect(provider.current()).toBeNull();
    await expect(provider.connect()).resolves.toBe(session);
    await expect(provider.renew()).resolves.toEqual({ kind: 'session', session });
    provider.disconnect();
    expect(provider.current()).toBeNull();
    expect(existsSync(d.sessionFile)).toBe(false);
  });
});
