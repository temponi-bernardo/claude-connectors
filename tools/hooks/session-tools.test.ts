import { chmodSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, runHook } from './fixtures/hook-test-utils.js';

const HOOK = 'session-tools.sh';
const ROOT = resolve(import.meta.dirname, '..', '..');

/** Temporary repository with the hook, the installer and fake `go`/`npm`/`gitleaks` that only log. */
function sandbox(gitleaksVersion: string) {
  const dir = createTempRepo();
  for (const file of ['.claude/hooks/session-tools.sh', 'scripts/install-gitleaks.sh']) {
    mkdirSync(join(dir, file, '..'), { recursive: true });
    copyFileSync(join(ROOT, file), join(dir, file));
  }
  writeFileSync(join(dir, 'package.json'), '{}');
  writeFileSync(join(dir, 'package-lock.json'), '{}');
  const bin = join(dir, 'fake-bin');
  const log = join(dir, 'calls.log');
  mkdirSync(bin);
  const fakes: Record<string, string> = {
    go: `echo "go $*" >> ${log}`,
    npm: `echo "npm $*" >> ${log}`,
    gitleaks: `echo ${gitleaksVersion}`,
  };
  for (const [name, body] of Object.entries(fakes)) {
    writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
    chmodSync(join(bin, name), 0o755);
  }
  const env = { PATH: `${bin}:${process.env.PATH ?? ''}`, GITLEAKS_BIN_DIR: bin };
  return { dir, env, calls: () => readCalls(log) };
}

/** Reads the call log of the fake executables (empty if nothing was called). */
function readCalls(log: string): string {
  try {
    return readFileSync(log, 'utf8');
  } catch {
    return '';
  }
}

describe('hook session-tools (SessionStart)', () => {
  it('outside the cloud installs nothing', () => {
    const { dir, env, calls } = sandbox('old');
    const r = runHook(HOOK, dir, { env: { ...env, CLAUDE_CODE_REMOTE: '' } });
    expect(r.status).toBe(0);
    expect(calls()).toBe('');
  });

  it('in the cloud installs the pinned gitleaks through Go and runs npm install', () => {
    const { dir, env, calls } = sandbox('old');
    const r = runHook(HOOK, dir, { env: { ...env, CLAUDE_CODE_REMOTE: 'true' } });
    expect(r.status).toBe(0);
    expect(calls()).toContain(
      'go install -ldflags -X github.com/zricethezav/gitleaks/v8/cmd.Version=8.28.0',
    );
    expect(calls()).toContain('github.com/zricethezav/gitleaks/v8@v8.28.0');
    expect(calls()).toContain('npm install');
  });

  it('the second time skips gitleaks already at the version and npm install without changes', () => {
    const { dir, env, calls } = sandbox('8.28.0');
    const remote = { ...env, CLAUDE_CODE_REMOTE: 'true' };
    runHook(HOOK, dir, { env: remote });
    expect(calls()).not.toContain('go install');
    expect(calls().match(/npm install/g)).toHaveLength(1);
    runHook(HOOK, dir, { env: remote });
    expect(calls().match(/npm install/g)).toHaveLength(1);
    writeFileSync(join(dir, 'package-lock.json'), '{"changed":true}');
    runHook(HOOK, dir, { env: remote });
    expect(calls().match(/npm install/g)).toHaveLength(2);
  });
});
