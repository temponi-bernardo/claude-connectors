import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, fakeClaude, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'precompact-handoff.sh';

function withTranscript(dir: string): string {
  const t = join(dir, 'transcript.jsonl');
  writeFileSync(t, '{"type":"user","message":"implement F1.1"}\n');
  return JSON.stringify({ transcript_path: t, trigger: 'auto' });
}

describe('hook precompact-handoff (PreCompact)', () => {
  it('without a transcript does nothing and exits 0', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, { input: JSON.stringify({ trigger: 'auto' }) });
    expect(r.status).toBe(0);
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(false);
  });

  it('a transcript pointing at a missing file exits 0', () => {
    const dir = createTempRepo();
    const r = runHook(HOOK, dir, {
      input: JSON.stringify({ transcript_path: '/does/not/exist.jsonl' }),
    });
    expect(r.status).toBe(0);
  });

  it('writes docs/STATE.md when claude answers in the expected format', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, '# Estado atual\n\n## Tarefa atual\n\nF1.1\n');
    const r = runHook(HOOK, dir, { input: withTranscript(dir), env: { PATH } });
    expect(r.status).toBe(0);
    const state = readFileSync(join(dir, 'docs/STATE.md'), 'utf8');
    expect(state.startsWith('# Estado atual')).toBe(true);
    expect(state).toContain('Generated automatically by the PreCompact hook');
    expect(existsSync(join(dir, '.claude/.last-handoff'))).toBe(true);
  });

  it('accepts a reply that starts with the English "# Current state" heading', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, '# Current state\n\n## Current task\n\nF4.6\n');
    const r = runHook(HOOK, dir, { input: withTranscript(dir), env: { PATH } });
    expect(r.status).toBe(0);
    const state = readFileSync(join(dir, 'docs/STATE.md'), 'utf8');
    expect(state.startsWith('# Current state')).toBe(true);
  });

  it('does not overwrite STATE.md if the reply does not start with a state heading', () => {
    const dir = createTempRepo();
    writeFileSync(join(dir, 'docs/STATE.md'), 'original');
    const PATH = fakeClaude(dir, 'Sorry, I could not do it.');
    runHook(HOOK, dir, { input: withTranscript(dir), env: { PATH } });
    expect(readFileSync(join(dir, 'docs/STATE.md'), 'utf8')).toBe('original');
  });

  it('a claude failure neither fails the compaction nor changes STATE.md', () => {
    const dir = createTempRepo();
    writeFileSync(join(dir, 'docs/STATE.md'), 'original');
    const PATH = fakeClaude(dir, null);
    const r = runHook(HOOK, dir, { input: withTranscript(dir), env: { PATH } });
    expect(r.status).toBe(0);
    expect(readFileSync(join(dir, 'docs/STATE.md'), 'utf8')).toBe('original');
  });

  it('CLAUDE_HANDOFF_AUTOGEN=0 turns the hook off', () => {
    const dir = createTempRepo();
    const PATH = fakeClaude(dir, '# Estado atual\n');
    runHook(HOOK, dir, { input: withTranscript(dir), env: { PATH, CLAUDE_HANDOFF_AUTOGEN: '0' } });
    expect(existsSync(join(dir, 'docs/STATE.md'))).toBe(false);
  });
});
