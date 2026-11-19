import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { HOOKS_DIR } from './fixtures/hook-test-utils.js';

const HOOK = `${HOOKS_DIR}/format-on-edit.mjs`;
const UGLY = 'const  a = {b:1}\n';
const PRETTY = 'const a = { b: 1 };\n';
const created: string[] = [];

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Temporary folder removed after each test. */
function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  created.push(dir);
  return dir;
}

/** Temporary project with this repository's node_modules (Prettier) and .prettierrc. */
function project(withPrettier = true): string {
  const dir = tempDir('format-test-');
  if (withPrettier) symlinkSync(join(process.cwd(), 'node_modules'), join(dir, 'node_modules'));
  writeFileSync(join(dir, '.prettierrc'), readFileSync('.prettierrc'));
  return dir;
}

function runFormat(dir: string, filePath: string): number | null {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath } }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
  });
  return r.status;
}

describe('hook format-on-edit (PostToolUse)', () => {
  it('formats the edited file with the project Prettier', () => {
    const dir = project();
    writeFileSync(join(dir, 'a.ts'), UGLY);
    expect(runFormat(dir, join(dir, 'a.ts'))).toBe(0);
    expect(readFileSync(join(dir, 'a.ts'), 'utf8')).toBe(PRETTY);
  });

  it('a file whose name starts with "-" is treated as a file, not a Prettier option', () => {
    const dir = project();
    writeFileSync(join(dir, '--write.ts'), UGLY);
    expect(runFormat(dir, join(dir, '--write.ts'))).toBe(0);
    expect(readFileSync(join(dir, '--write.ts'), 'utf8')).toBe(PRETTY);
  });

  it('honors .prettierignore', () => {
    const dir = project();
    writeFileSync(join(dir, '.prettierignore'), 'ignored.ts\n');
    writeFileSync(join(dir, 'ignored.ts'), UGLY);
    runFormat(dir, join(dir, 'ignored.ts'));
    expect(readFileSync(join(dir, 'ignored.ts'), 'utf8')).toBe(UGLY);
  });

  it('does not touch a file outside the project', () => {
    const dir = project();
    const outside = join(tempDir('outside-'), 'b.ts');
    writeFileSync(outside, UGLY);
    expect(runFormat(dir, outside)).toBe(0);
    expect(readFileSync(outside, 'utf8')).toBe(UGLY);
  });

  it('without Prettier, with an unknown extension or invalid input: exits 0 without changes', () => {
    const dir = project(false);
    writeFileSync(join(dir, 'a.ts'), UGLY);
    expect(runFormat(dir, join(dir, 'a.ts'))).toBe(0);
    expect(readFileSync(join(dir, 'a.ts'), 'utf8')).toBe(UGLY);
    const withPrettier = project();
    writeFileSync(join(withPrettier, 'x.unknown'), 'a  b');
    expect(runFormat(withPrettier, join(withPrettier, 'x.unknown'))).toBe(0);
    const r = spawnSync('node', [HOOK], { input: '{', encoding: 'utf8' });
    expect(r.status).toBe(0);
  });
});
