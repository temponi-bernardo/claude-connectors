import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  clearSession,
  cookieHeader,
  csrfToken,
  isCanvasSession,
  loadSession,
  saveSession,
  sessionFilePath,
  type CanvasSession,
} from './session.js';

const session: CanvasSession = {
  baseUrl: 'https://x.test',
  savedAt: '2026-11-05T00:00:00Z',
  cookies: [
    { name: 'a', value: '1' },
    { name: '_csrf_token', value: 'abc%3D%3D' },
  ],
};

const dirs: string[] = [];
function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'canvas-session-'));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('sessionFilePath', () => {
  it('fica dentro da pasta de dados', () => {
    expect(sessionFilePath('/d')).toBe(join('/d', 'session.json'));
  });
});

describe('cookieHeader', () => {
  it('junta os cookies no formato do header', () => {
    expect(cookieHeader(session)).toBe('a=1; _csrf_token=abc%3D%3D');
  });
});

describe('csrfToken', () => {
  it('decodifica o cookie _csrf_token', () => {
    expect(csrfToken(session)).toBe('abc==');
  });

  it('devolve null sem o cookie', () => {
    expect(csrfToken({ ...session, cookies: [] })).toBeNull();
  });
});

describe('isCanvasSession', () => {
  it('aceita a forma esperada, inclusive com campos extras do navegador', () => {
    expect(isCanvasSession({ ...session, cookies: [{ name: 'a', value: 'b', domain: 'x' }] })).toBe(
      true,
    );
  });

  it('rejeita formas inválidas', () => {
    expect(isCanvasSession(null)).toBe(false);
    expect(isCanvasSession('x')).toBe(false);
    expect(isCanvasSession({ baseUrl: 1, cookies: [] })).toBe(false);
    expect(isCanvasSession({ baseUrl: 'x', cookies: [{ name: 'a' }] })).toBe(false);
    expect(isCanvasSession({ baseUrl: 'x', cookies: [null] })).toBe(false);
  });
});

describe('saveSession, loadSession e clearSession', () => {
  it('salva, lê de volta e apaga', () => {
    const file = join(tempDir(), 'sub', 'session.json');
    saveSession(file, session);
    expect(loadSession(file)).toEqual(session);
    clearSession(file);
    expect(existsSync(file)).toBe(false);
    clearSession(file);
  });

  it('devolve null para arquivo ausente, corrompido ou inválido', () => {
    const dir = tempDir();
    expect(loadSession(join(dir, 'nada.json'))).toBeNull();
    writeFileSync(join(dir, 'ruim.json'), '{');
    expect(loadSession(join(dir, 'ruim.json'))).toBeNull();
    writeFileSync(join(dir, 'forma.json'), '{"x":1}');
    expect(loadSession(join(dir, 'forma.json'))).toBeNull();
  });
});
