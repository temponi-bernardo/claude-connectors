import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { commitFile, createTempRepo, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'stop-handoff.sh';
const STOP = { input: JSON.stringify({ session_id: 's1', stop_hook_active: false }) };

function isBlock(stdout: string): boolean {
  return stdout.includes('"decision":"block"');
}

describe('hook stop-handoff (Stop)', () => {
  let dir: string;

  beforeEach(() => {
    dir = createTempRepo();
    writeFileSync(join(dir, 'docs/STATE.md'), '# Estado atual\n');
  });

  it('the first run adopts the current state as the reference and does not block', () => {
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
    expect(existsSync(join(dir, '.claude/.last-handoff'))).toBe(true);
  });

  it('no new commit does not block (work in progress)', () => {
    runHook(HOOK, dir, STOP);
    writeFileSync(join(dir, 'wip.txt'), 'draft');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('a new commit without a handoff blocks with /handoff and /clear instructions', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): something');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(true);
    const parsed = JSON.parse(r.stdout.trim()) as { reason: string };
    expect(parsed.reason).toContain('/handoff');
    expect(parsed.reason).toContain('/clear');
  });

  it('a new commit with an updated STATE.md does not block and records the marker', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): something');
    writeFileSync(join(dir, 'docs/STATE.md'), '# Estado atual\n\n## Feito\n\n- something\n');
    const r = runHook(HOOK, dir, STOP);
    expect(isBlock(r.stdout)).toBe(false);
    const marker = readFileSync(join(dir, '.claude/.last-handoff'), 'utf8');
    expect(marker.split(' ')[0]).toHaveLength(40);
    // Next turn, nothing changed: still allowed.
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
  });

  it('a commit by someone else (e.g. a GitHub squash brought by git pull) does not block', () => {
    runHook(HOOK, dir, STOP);
    writeFileSync(join(dir, 'merged.txt'), 'squash');
    const env = {
      ...process.env,
      GIT_COMMITTER_NAME: 'GitHub',
      GIT_COMMITTER_EMAIL: 'noreply@github.com',
    };
    spawnSync('git', ['add', 'merged.txt'], { cwd: dir });
    spawnSync('git', ['commit', '-q', '-m', 'feat(core): x (#1)'], { cwd: dir, env });
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
    // The marker moves forward: an own commit after that asks for the handoff again.
    commitFile(dir, 'feature.txt', 'feat(core): something');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
  });

  it('a marker pointing at a missing commit neither breaks nor blocks', () => {
    writeFileSync(join(dir, '.claude/.last-handoff'), `${'0'.repeat(40)} none\n`);
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('loop guard: stop_hook_active=true never blocks', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): something');
    const r = runHook(HOOK, dir, { input: JSON.stringify({ stop_hook_active: true }) });
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('a missing STATE.md is treated as "none" and follows the same rule', () => {
    rmSync(join(dir, 'docs/STATE.md'));
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): something');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
  });

  it('empty stdin or invalid JSON does not break the hook', () => {
    expect(runHook(HOOK, dir).status).toBe(0);
    expect(runHook(HOOK, dir, { input: 'not json' }).status).toBe(0);
  });

  it('outside a git repository exits 0 without blocking', () => {
    const plain = mkdtempSync(join(tmpdir(), 'hook-nogit-'));
    const r = runHook(HOOK, plain, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });
});
