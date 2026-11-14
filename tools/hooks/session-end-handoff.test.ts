import { existsSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, fakeClaude, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'session-end-handoff.sh';
const GOOD = '# Estado atual\n\n## Tarefa atual\n\nF1.1\n';
const WORK_AT = '2026-01-01T12:00:00.000Z';

interface ToolUse {
  name: string;
  input: Record<string, string>;
}

/** JSONL line of an assistant message with a tool call. */
function toolLine(tool: ToolUse, timestamp = WORK_AT): string {
  const content = [{ type: 'tool_use', id: 't1', ...tool }];
  return JSON.stringify({ type: 'assistant', timestamp, message: { role: 'assistant', content } });
}

/** Writes the transcript and returns the hook input JSON. */
function sessionInput(dir: string, lines: string[], reason = 'clear'): string {
  const t = join(dir, 'transcript.jsonl');
  writeFileSync(t, `${lines.join('\n')}\n`);
  return JSON.stringify({ transcript_path: t, reason, hook_event_name: 'SessionEnd' });
}

/** Creates a STATE.md with modification time `iso`. */
function stateAt(dir: string, iso: string): string {
  const file = join(dir, 'docs/STATE.md');
  writeFileSync(file, 'original');
  const when = new Date(iso);
  utimesSync(file, when, when);
  return file;
}

const EDIT = toolLine({ name: 'Edit', input: { file_path: '/repo/src/a.ts' } });

describe('hook session-end-handoff (SessionEnd)', () => {
  it('writes STATE.md when there was an edit and no handoff', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, GOOD);
    const r = runHook(HOOK, dir, { input: sessionInput(dir, [EDIT]), env: { PATH } });
    expect(r.status).toBe(0);
    const state = readFileSync(join(dir, 'docs/STATE.md'), 'utf8');
    expect(state.startsWith('# Estado atual')).toBe(true);
    expect(state).toContain('Gerado automaticamente pelo hook SessionEnd');
    expect(existsSync(join(dir, '.claude/.last-handoff'))).toBe(true);
  });

  it('writes STATE.md when STATE.md is older than the last edit', () => {
    const dir = createTempRepo();
    const file = stateAt(dir, '2026-01-01T11:00:00.000Z');
    const PATH = fakeClaude(dir, GOOD);
    runHook(HOOK, dir, { input: sessionInput(dir, [EDIT]), env: { PATH } });
    expect(readFileSync(file, 'utf8').startsWith('# Estado atual')).toBe(true);
  });

  it('counts git commit through Bash as work', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, GOOD);
    const commit = toolLine({ name: 'Bash', input: { command: 'git add . && git commit -m x' } });
    runHook(HOOK, dir, { input: sessionInput(dir, [commit]), env: { PATH } });
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(true);
  });

  it('writes nothing in a chat-only or read-only session', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, GOOD);
    const lines = [
      JSON.stringify({ type: 'user', timestamp: WORK_AT, message: { content: 'hi' } }),
      toolLine({ name: 'Read', input: { file_path: '/repo/a.ts' } }),
      toolLine({ name: 'Bash', input: { command: 'git status' } }),
    ];
    runHook(HOOK, dir, { input: sessionInput(dir, lines), env: { PATH } });
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(false);
  });

  it('does not overwrite a handoff made after the last edit', () => {
    const dir = createTempRepo();
    const file = stateAt(dir, '2026-01-01T13:00:00.000Z');
    const PATH = fakeClaude(dir, GOOD);
    runHook(HOOK, dir, { input: sessionInput(dir, [EDIT]), env: { PATH } });
    expect(readFileSync(file, 'utf8')).toBe('original');
  });

  it('ignores the edit of STATE.md itself when deciding', () => {
    const dir = createTempRepo();
    const file = stateAt(dir, '2026-01-01T11:00:00.000Z');
    const PATH = fakeClaude(dir, GOOD);
    const handoff = toolLine({ name: 'Write', input: { file_path: '/repo/docs/STATE.md' } });
    runHook(HOOK, dir, { input: sessionInput(dir, [handoff]), env: { PATH } });
    expect(readFileSync(file, 'utf8')).toBe('original');
  });

  it('ignores invalid transcript lines without failing', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, GOOD);
    const r = runHook(HOOK, dir, { input: sessionInput(dir, ['{broken', EDIT]), env: { PATH } });
    expect(r.status).toBe(0);
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(true);
  });

  it('without a transcript exits 0 writing nothing', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, { input: JSON.stringify({ reason: 'clear' }) });
    expect(r.status).toBe(0);
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(false);
  });

  it('a claude failure does not change STATE.md and exits 0', () => {
    const dir = createTempRepo();
    const file = stateAt(dir, '2026-01-01T11:00:00.000Z');
    const PATH = fakeClaude(dir, null);
    const r = runHook(HOOK, dir, { input: sessionInput(dir, [EDIT]), env: { PATH } });
    expect(r.status).toBe(0);
    expect(readFileSync(file, 'utf8')).toBe('original');
  });

  it('CLAUDE_HANDOFF_AUTOGEN=0 turns the hook off', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, GOOD);
    const env = { PATH, CLAUDE_HANDOFF_AUTOGEN: '0' };
    runHook(HOOK, dir, { input: sessionInput(dir, [EDIT]), env });
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(false);
  });
});
