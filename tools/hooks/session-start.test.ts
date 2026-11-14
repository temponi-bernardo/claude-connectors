import { writeFileSync } from 'node:fs';
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
      '# Roadmap\n\n## Próxima tarefa\n\n**F1.1 — Something**\n',
    );
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Handoff da sessão anterior');
    expect(r.stdout).toContain('- hooks created');
    expect(r.stdout).toContain('Próxima tarefa do roadmap: **F1.1 — Something**');
  });

  it('without STATE.md says there is no handoff and still exits 0', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, { input: '{}' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Sem handoff salvo');
    expect(r.stdout).toContain('ver docs/ROADMAP.md');
  });
});
