import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const HOOKS_DIR = join(process.cwd(), '.claude/hooks');

export interface HookResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

/** Cria um repositório git temporário com um commit inicial e as pastas que os hooks esperam. */
export function createTempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'hook-test-'));
  mkdirSync(join(dir, 'docs'));
  mkdirSync(join(dir, '.claude'));
  git(dir, ['init', '-q', '-b', 'main']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Teste']);
  commitFile(dir, 'README.md', 'inicial');
  return dir;
}

export function git(dir: string, args: string[]): string {
  const r = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} falhou: ${r.stderr}`);
  return r.stdout.trim();
}

/** Escreve um arquivo (conteúdo = mensagem) e o commita. */
export function commitFile(dir: string, file: string, message: string): void {
  writeFileSync(join(dir, file), message);
  git(dir, ['add', file]);
  git(dir, ['commit', '-q', '-m', message]);
}

export interface HookOptions {
  input?: string;
  env?: Record<string, string>;
}

/** Roda um hook de `.claude/hooks/` com stdin e ambiente controlados, dentro de `dir`. */
export function runHook(name: string, dir: string, options: HookOptions = {}): HookResult {
  const r = spawnSync('bash', [join(HOOKS_DIR, name)], {
    cwd: dir,
    input: options.input ?? '',
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, ...(options.env ?? {}) },
  });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}
