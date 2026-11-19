import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTempRepo, git } from './fixtures/hook-test-utils.js';

const PRE_COMMIT = join(process.cwd(), '.githooks/pre-commit');

describe('git hook pre-commit', () => {
  it('refuses files in .github/workflows (the checks run locally)', () => {
    const dir = createTempRepo();
    mkdirSync(join(dir, '.github/workflows'), { recursive: true });
    writeFileSync(join(dir, '.github/workflows/ci.yml'), 'on: push\n');
    git(dir, ['add', '.github/workflows/ci.yml']);
    const r = spawnSync('sh', [PRE_COMMIT], { cwd: dir, encoding: 'utf8' });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('.github/workflows/');
  });
});
