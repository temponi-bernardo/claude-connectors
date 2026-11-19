import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HOOKS_DIR } from './fixtures/hook-test-utils.js';

const HOOK = `${HOOKS_DIR}/guard-edit.mjs`;
const PROJECT = '/project';

function runGuard(
  tool: string,
  filePath: string,
  projectDir = PROJECT,
): { status: number | null; stderr: string } {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: tool, tool_input: { file_path: filePath } }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
  });
  return { status: r.status, stderr: r.stderr };
}

describe('hook guard-edit (PreToolUse on Edit/Write)', () => {
  it.each([
    ['Write', '/project/.github/workflows/ci.yml', 'GitHub Actions'],
    ['Write', '/project/.GitHub/Workflows/x.yml', 'GitHub Actions'],
    ['Edit', '.github/workflows/release.yaml', 'GitHub Actions'],
    ['Write', '/project/.github//workflows/x.yml', 'GitHub Actions'],
    ['Write', '/project/.env', '.env'],
    ['Write', '/project/.ENV', '.env'],
    ['Edit', '/project/.env.local', '.env'],
    ['Write', '/project/config/.env.production', '.env'],
    ['Edit', './connectors/gmail/.dev.vars', '.dev.vars'],
    ['Write', '/project/docs/../.env', '.env'],
    ['Write', '/project/certs/server.pem', 'certificate'],
    ['Write', '/project/certs/server.PEM', 'certificate'],
    ['Write', '/project/id.key', 'certificate'],
    ['Write', '/project/cert.p12', 'certificate'],
  ])('blocks %s on %s', (tool, path, reason) => {
    const r = runGuard(tool, path);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain(reason);
  });

  it.each([
    ['Write', '/project/.env.example'],
    ['Edit', '/project/src/core/text.ts'],
    ['Write', '/project/docs/STATE.md'],
    ['Write', '/project/.github/PULL_REQUEST_TEMPLATE.md'],
    ['Write', '/project/src/environment.ts'],
    ['Edit', '/project/.github/dependabot.yml'],
    ['NotebookEdit', '/project/notes.ipynb'],
  ])('allows %s on %s', (tool, path) => {
    expect(runGuard(tool, path).status).toBe(0);
  });

  it('a symlink to .env is blocked (the real target is what counts)', () => {
    const project = mkdtempSync(join(tmpdir(), 'guard-edit-'));
    const outside = mkdtempSync(join(tmpdir(), 'guard-edit-out-'));
    try {
      mkdirSync(join(project, 'config'));
      writeFileSync(join(project, 'config/.env'), 'X=1\n');
      symlinkSync(join(project, 'config/.env'), join(outside, 'vars.txt'));
      const r = runGuard('Write', join(outside, 'vars.txt'), project);
      expect(r.status).toBe(2);
      expect(r.stderr).toContain('.env');
    } finally {
      rmSync(project, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it('invalid input or no path does not block', () => {
    const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(runGuard('Write', '').status).toBe(0);
  });
});
