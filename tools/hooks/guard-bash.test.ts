import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const HOOK = join(process.cwd(), '.claude/hooks/guard-bash.mjs');

function runGuard(command: string): { status: number | null; stderr: string } {
  const result = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_input: { command } }),
    encoding: 'utf8',
  });
  return { status: result.status, stderr: result.stderr };
}

describe('hook guard-bash (PreToolUse)', () => {
  it.each([
    ['git push -u origin main', 'push direto na main'],
    ['git push origin HEAD:main', 'push direto na main'],
    ['git push origin feat/x --force', 'force push'],
    ['git push -f origin feat/x', 'force push'],
    ['git push --force-with-lease origin feat/x', 'force push'],
    ['git commit -m "x" --no-verify', '--no-verify'],
    ['git commit -n -m x', '--no-verify'],
    ['git branch -D main', 'não apague a main'],
    ['cat .env', 'leitura de .env'],
    ['grep KEY ./.env.local', 'leitura de .env'],
    ["node -e \"require('fs').readFileSync('.env')\"", 'acesso a .env por script'],
    ['rm -rf /', 'rm -rf'],
    ['rm -rf ~', 'rm -rf'],
    ['git config core.hooksPath /dev/null', 'git hooks'],
  ])('bloqueia: %s', (command, reason) => {
    const { status, stderr } = runGuard(command);
    expect(status).toBe(2);
    expect(stderr).toContain(reason);
  });

  it.each([
    'git push -u origin feat/x',
    'git push -u origin feat/x && npm run check',
    'git log main --oneline',
    'git diff main...HEAD',
    'cat .env.example',
    'cp .env.example .env',
    'npm run check',
    'rm -rf dist/',
    'echo "leia o .env.example"',
  ])('permite: %s', (command) => {
    expect(runGuard(command).status).toBe(0);
  });

  it('entrada inválida não bloqueia', () => {
    const result = spawnSync('node', [HOOK], { input: 'não é json', encoding: 'utf8' });
    expect(result.status).toBe(0);
  });
});
