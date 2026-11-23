import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { commitFile, createTempRepo, git } from '../hooks/fixtures/hook-test-utils.js';
import {
  listChangedFiles,
  runGit,
  splitGitLines,
  touchesWhatsAppImage,
  whatsAppImageDecision,
} from './whatsapp-image.js';

describe('touchesWhatsAppImage', () => {
  it.each([
    'connectors/whatsapp/Dockerfile',
    'connectors/whatsapp/.dockerignore',
    'connectors/whatsapp/NOTICE.md',
    'connectors/whatsapp/wrangler.toml',
    'connectors/whatsapp/bridge/main.go',
    'connectors/whatsapp/bridge/go.sum',
    'scripts/docker-proxy-ca.sh',
  ])('builds the image when %s changes', (file) => {
    expect(touchesWhatsAppImage(['docs/README.md', file])).toBe(true);
  });

  it.each([
    'connectors/whatsapp/src/tools.ts',
    'connectors/whatsapp/README.md',
    'connectors/whatsapp/plugin/.claude-plugin/plugin.json',
    'connectors/whatsapp-old/Dockerfile',
    'src/mcp/tool-gate.ts',
    'package.json',
    'docs/WORKFLOW.md',
  ])('skips the image when only %s changes', (file) => {
    expect(touchesWhatsAppImage([file])).toBe(false);
  });

  it('skips the image for an empty diff', () => {
    expect(touchesWhatsAppImage([])).toBe(false);
  });
});

describe('whatsAppImageDecision', () => {
  it('answers build when an image input changed and skip otherwise', () => {
    expect(whatsAppImageDecision(['connectors/whatsapp/Dockerfile'])).toBe('build');
    expect(whatsAppImageDecision(['docs/README.md'])).toBe('skip');
  });
});

describe('splitGitLines', () => {
  it('joins several git outputs into unique non-empty paths', () => {
    expect(splitGitLines(['a.ts\nb.ts\n', '', 'b.ts\nc.ts'])).toEqual(['a.ts', 'b.ts', 'c.ts']);
  });
});

describe('runGit', () => {
  it('returns the output of a git command', () => {
    expect(runGit(process.cwd(), ['rev-parse', '--is-inside-work-tree']).trim()).toBe('true');
  });

  it("throws with the command and git's message when git fails", () => {
    expect(() => runGit(process.cwd(), ['no-such-command'])).toThrow(
      /git no-such-command failed: .+/,
    );
  });
});

describe('listChangedFiles', () => {
  const repos: string[] = [];
  afterEach(() => {
    for (const dir of repos.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it('lists committed, staged, unstaged and untracked changes since the base', () => {
    const dir = createTempRepo();
    repos.push(dir);
    commitFile(dir, 'kept.md', 'base');
    git(dir, ['switch', '-q', '-c', 'work']);
    commitFile(dir, 'committed.md', 'work');
    writeFileSync(join(dir, 'kept.md'), 'edited');
    writeFileSync(join(dir, 'staged.md'), 'staged');
    git(dir, ['add', 'staged.md']);
    writeFileSync(join(dir, 'untracked.md'), 'new');
    expect(listChangedFiles(dir, 'main').sort()).toEqual([
      'committed.md',
      'kept.md',
      'staged.md',
      'untracked.md',
    ]);
  });

  it("fails with git's message when the base does not exist", () => {
    const dir = createTempRepo();
    repos.push(dir);
    expect(() => listChangedFiles(dir, 'no-such-branch')).toThrow(
      /git merge-base no-such-branch HEAD failed/,
    );
  });

  it('is empty when nothing changed since the base', () => {
    const dir = createTempRepo();
    repos.push(dir);
    expect(listChangedFiles(dir, 'main')).toEqual([]);
  });
});
