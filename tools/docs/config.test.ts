import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_DOCS_CONFIG, loadDocsConfig, mergeDocsConfig } from './config.js';

describe('mergeDocsConfig', () => {
  it('merges a partial over the defaults', () => {
    expect(mergeDocsConfig({ uiDir: 'ui' })).toEqual({ ...DEFAULT_DOCS_CONFIG, uiDir: 'ui' });
  });

  it('rejects invalid shapes', () => {
    expect(() => mergeDocsConfig([])).toThrow('JSON object');
    expect(() => mergeDocsConfig({ sourceDirs: [] })).toThrow('sourceDirs');
    expect(() => mergeDocsConfig({ uiDir: 3 })).toThrow('uiDir');
  });
});

describe('loadDocsConfig', () => {
  it('uses defaults without a file and reads the file when it exists', () => {
    const root = mkdtempSync(join(tmpdir(), 'docs-cfg-'));
    try {
      expect(loadDocsConfig(root)).toEqual(DEFAULT_DOCS_CONFIG);
      writeFileSync(join(root, 'docs.config.json'), '{"sourceDirs":["lib"]}');
      expect(loadDocsConfig(root).sourceDirs).toEqual(['lib']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
