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
    ['git push -u origin main', 'direct push to main'],
    ['git push origin HEAD:main', 'direct push to main'],
    ['git push origin feat/x --force', 'force push is forbidden'],
    ['git push -f origin feat/x', 'force push is forbidden'],
    ['git push --force-with-lease origin feat/x', 'force push is forbidden'],
    ['git commit -m "x" --no-verify', '--no-verify'],
    ['git commit -n -m x', '--no-verify'],
    ['git branch -D main', 'do not delete main'],
    ['cat .env', 'reading .env is forbidden'],
    ['grep KEY ./.env.local', 'reading .env is forbidden'],
    ["node -e \"require('fs').readFileSync('.env')\"", 'accessing .env from a script'],
    ['rm -rf /', 'rm -rf on the root'],
    ['rm -rf ~', 'rm -rf on the root'],
    ['git config core.hooksPath /dev/null', 'disable the git hooks'],
  ])('blocks: %s', (command, reason) => {
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
    'echo "read .env.example"',
  ])('allows: %s', (command) => {
    expect(runGuard(command).status).toBe(0);
  });

  it('invalid input does not block', () => {
    const result = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
    expect(result.status).toBe(0);
  });
});
