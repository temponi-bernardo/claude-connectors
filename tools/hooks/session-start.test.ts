import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'session-start.sh';

describe('hook session-start (SessionStart)', () => {
  it('injects the content of docs/STATE.md and the next task', () => {
    const dir = createTempRepo();
    writeFileSync(join(dir, 'docs/STATE.md'), '# Estado atual\n\n## Feito\n\n- hooks created\n');
    writeFileSync(
      join(dir, 'docs/ROADMAP.md'),
      '# Roadmap\n\n## Next task\n\n**F1.1 — Something**\n',
    );
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Handoff from the previous session');
    expect(r.stdout).toContain('- hooks created');
    expect(r.stdout).toContain('Next roadmap task: **F1.1 — Something**');
  });

  it('reads the English "Next task" heading of the roadmap', () => {
    const dir = createTempRepo();
    writeFileSync(
      join(dir, 'docs/ROADMAP.md'),
      '# Roadmap\n\n## Next task\n\n**F4.6 — Translate**\n',
    );
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Next roadmap task: **F4.6 — Translate**');
  });

  it('removes the marker of the old stop-handoff hook', () => {
    const dir = createTempRepo();
    writeFileSync(join(dir, '.claude/.last-handoff'), 'abc def\n');
    expect(runHook(HOOK, dir, { input: '{}' }).status).toBe(0);
    expect(existsSync(join(dir, '.claude/.last-handoff'))).toBe(false);
  });

  it('without STATE.md says there is no handoff and still exits 0', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('No saved handoff');
    expect(r.stdout).toContain('see docs/ROADMAP.md');
  });
});
