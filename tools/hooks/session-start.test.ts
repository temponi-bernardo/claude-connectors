import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'session-start.sh';

describe('hook session-start (SessionStart)', () => {
  it('injeta o conteúdo de docs/STATE.md e a próxima tarefa', () => {
    const dir = createTempRepo();
    writeFileSync(join(dir, 'docs/STATE.md'), '# Estado atual\n\n## Feito\n\n- hooks criados\n');
    writeFileSync(join(dir, 'docs/ROADMAP.md'), '# Roadmap\n\n## Next task\n\n**F1.1 — Algo**\n');
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Handoff from the previous session');
    expect(r.stdout).toContain('- hooks criados');
    expect(r.stdout).toContain('Next roadmap task: **F1.1 — Algo**');
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

  it('sem STATE.md avisa que não há handoff e ainda assim sai 0', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('No saved handoff');
    expect(r.stdout).toContain('see docs/ROADMAP.md');
  });
});
