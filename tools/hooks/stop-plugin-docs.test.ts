import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { commitFile, createTempRepo, git, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'stop-plugin-docs.sh';
const STOP = { input: JSON.stringify({ session_id: 's1', stop_hook_active: false }) };

function isBlock(stdout: string): boolean {
  return stdout.includes('"decision":"block"');
}

function write(dir: string, file: string, content = 'x'): void {
  mkdirSync(join(dir, file, '..'), { recursive: true });
  writeFileSync(join(dir, file), content);
}

describe('hook stop-plugin-docs (Stop)', () => {
  let dir: string;

  beforeEach(() => {
    dir = createTempRepo();
    git(dir, ['switch', '-q', '-c', 'feat/plugin']);
  });

  it('sem mudança em plugin não bloqueia', () => {
    write(dir, 'src/qualquer.ts');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('plugin changed without docs blocks asking for /update-docs', () => {
    write(dir, 'connectors/canvas-puc/manifest.json', '{}');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(true);
    const parsed = JSON.parse(r.stdout.trim()) as { reason: string };
    expect(parsed.reason).toContain('/update-docs');
    expect(parsed.reason).toContain('connectors/canvas-puc/manifest.json');
  });

  it('marketplace alterado sem docs também bloqueia', () => {
    write(dir, '.claude-plugin/marketplace.json', '{}');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
  });

  it('plugin alterado com docs na mesma mudança não bloqueia', () => {
    write(dir, 'connectors/canvas-puc/manifest.json', '{}');
    write(dir, 'CHANGELOG.md', '# Changelog');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
  });

  it('README do conector conta como documentação', () => {
    write(dir, 'connectors/canvas-puc/src/tool.ts');
    write(dir, 'connectors/canvas-puc/README.md', '# Canvas');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
  });

  it('considera commits da branch desde a main, não só o working tree', () => {
    commitFile(dir, 'plugin.txt', 'x');
    write(dir, 'connectors/canvas-puc/package.json', '{}');
    git(dir, ['add', '.']);
    git(dir, ['commit', '-q', '-m', 'feat(canvas): x']);
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
    write(dir, 'docs/PROCESSES.md', '# Processos');
    git(dir, ['add', '.']);
    git(dir, ['commit', '-q', '-m', 'docs: processos']);
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
  });

  it('não bloqueia duas vezes seguidas (stop_hook_active)', () => {
    write(dir, 'connectors/canvas-puc/manifest.json', '{}');
    const again = { input: JSON.stringify({ session_id: 's1', stop_hook_active: true }) };
    expect(isBlock(runHook(HOOK, dir, again).stdout)).toBe(false);
  });

  it('fora de um repositório git não quebra nem bloqueia', () => {
    git(dir, ['switch', '-q', 'main']);
    const r = runHook(HOOK, join(dir, 'docs'), {
      ...STOP,
      env: { GIT_DIR: join(dir, 'nao-existe') },
    });
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });
});
