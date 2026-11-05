/**
 * Sessão do Canvas obtida pelo login no navegador: cookies salvos em disco e montagem dos headers.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Cookie guardado (só o necessário para montar o header `Cookie`). */
export interface StoredCookie {
  readonly name: string;
  readonly value: string;
}

/** Sessão salva depois do login. */
export interface CanvasSession {
  readonly baseUrl: string;
  readonly savedAt: string;
  readonly cookies: readonly StoredCookie[];
}

/** Caminho do arquivo da sessão dentro da pasta de dados do conector. */
export function sessionFilePath(dataDir: string): string {
  return join(dataDir, 'session.json');
}

/** Monta o valor do header `Cookie` com todos os cookies da sessão. */
export function cookieHeader(session: CanvasSession): string {
  return session.cookies.map((c) => `${c.name}=${c.value}`).join('; ');
}

/** Devolve o token CSRF (cookie `_csrf_token`, decodificado), exigido pelo Canvas em POST/PUT. */
export function csrfToken(session: CanvasSession): string | null {
  const cookie = session.cookies.find((c) => c.name === '_csrf_token');
  return cookie ? decodeURIComponent(cookie.value) : null;
}

/** Confere se um valor lido do disco tem a forma de uma sessão válida. */
export function isCanvasSession(value: unknown): value is CanvasSession {
  if (typeof value !== 'object' || value === null) return false;
  const { baseUrl, cookies } = value as Record<string, unknown>;
  if (typeof baseUrl !== 'string' || !Array.isArray(cookies)) return false;
  return cookies.every((c: unknown) => {
    const cookie = c as Record<string, unknown> | null;
    return typeof cookie?.name === 'string' && typeof cookie.value === 'string';
  });
}

/** Lê a sessão salva; devolve `null` se o arquivo não existe, está corrompido ou tem forma inválida. */
export function loadSession(file: string): CanvasSession | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
    return isCanvasSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Salva a sessão em disco, criando a pasta se preciso. */
export function saveSession(file: string, session: CanvasSession): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(session, null, 2));
}

/** Apaga a sessão salva, se existir. */
export function clearSession(file: string): void {
  if (existsSync(file)) unlinkSync(file);
}
