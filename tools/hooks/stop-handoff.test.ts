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

  it('primeira execução adota o estado atual como referência e não bloqueia', () => {
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
    expect(existsSync(join(dir, '.claude/.last-handoff'))).toBe(true);
  });

  it('sem commit novo não bloqueia (trabalho em andamento)', () => {
    runHook(HOOK, dir, STOP);
    writeFileSync(join(dir, 'wip.txt'), 'rascunho');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('commit novo sem handoff bloqueia com instrução de /handoff e /clear', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): algo');
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(true);
    const parsed = JSON.parse(r.stdout.trim()) as { reason: string };
    expect(parsed.reason).toContain('/handoff');
    expect(parsed.reason).toContain('/clear');
  });

  it('commit novo com STATE.md atualizado não bloqueia e registra o marcador', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): algo');
    writeFileSync(join(dir, 'docs/STATE.md'), '# Estado atual\n\n## Feito\n\n- algo\n');
    const r = runHook(HOOK, dir, STOP);
    expect(isBlock(r.stdout)).toBe(false);
    const marker = readFileSync(join(dir, '.claude/.last-handoff'), 'utf8');
    expect(marker.split(' ')[0]).toHaveLength(40);
    // Turno seguinte, nada mudou: continua liberado.
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(false);
  });

  it('commit de outra pessoa (ex.: squash do GitHub trazido por git pull) não bloqueia', () => {
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
    // O marcador avança: um commit próprio depois disso volta a cobrar o handoff.
    commitFile(dir, 'feature.txt', 'feat(core): algo');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
  });

  it('marcador apontando para commit inexistente não quebra nem bloqueia', () => {
    writeFileSync(join(dir, '.claude/.last-handoff'), `${'0'.repeat(40)} none\n`);
    const r = runHook(HOOK, dir, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('guarda contra loop: stop_hook_active=true nunca bloqueia', () => {
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): algo');
    const r = runHook(HOOK, dir, { input: JSON.stringify({ stop_hook_active: true }) });
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });

  it('STATE.md inexistente é tratado como "none" e segue o mesmo critério', () => {
    rmSync(join(dir, 'docs/STATE.md'));
    runHook(HOOK, dir, STOP);
    commitFile(dir, 'feature.txt', 'feat(core): algo');
    expect(isBlock(runHook(HOOK, dir, STOP).stdout)).toBe(true);
  });

  it('stdin vazio ou JSON inválido não quebra o hook', () => {
    expect(runHook(HOOK, dir).status).toBe(0);
    expect(runHook(HOOK, dir, { input: 'não é json' }).status).toBe(0);
  });

  it('fora de um repositório git sai 0 sem bloquear', () => {
    const plain = mkdtempSync(join(tmpdir(), 'hook-nogit-'));
    const r = runHook(HOOK, plain, STOP);
    expect(r.status).toBe(0);
    expect(isBlock(r.stdout)).toBe(false);
  });
});
