import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), '.githooks/protected-branches.sh');
const ZERO = '0'.repeat(40);
const A = 'a'.repeat(40);
const B = 'b'.repeat(40);

/** Runs the script with the lines git gives pre-push on stdin. */
function runProtected(lines: string[]): { status: number | null; stderr: string } {
  const r = spawnSync('sh', [SCRIPT], { input: `${lines.join('\n')}\n`, encoding: 'utf8' });
  return { status: r.status, stderr: r.stderr };
}

describe('git hook pre-push: protected branches (protected-branches.sh)', () => {
  it.each(['main', 'master'])('refuses to update %s on the remote', (branch) => {
    const r = runProtected([`refs/heads/x ${A} refs/heads/${branch} ${B}`]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(branch);
  });

  it('refuses to delete main on the remote', () => {
    expect(runProtected([`(delete) ${ZERO} refs/heads/main ${B}`]).status).toBe(1);
  });

  it('allows creating the branch on the remote for the first time', () => {
    expect(runProtected([`refs/heads/main ${A} refs/heads/main ${ZERO}`]).status).toBe(0);
  });

  it('allows task branches, tags and similar names', () => {
    const r = runProtected([
      `refs/heads/feat/x ${A} refs/heads/feat/x ${B}`,
      `refs/heads/fix/main-menu ${A} refs/heads/fix/main-menu ${B}`,
      `refs/tags/v1.0.0 ${A} refs/tags/v1.0.0 ${ZERO}`,
    ]);
    expect(r.status).toBe(0);
  });

  it('exits 0 with nothing on stdin', () => {
    expect(runProtected([]).status).toBe(0);
  });
});
