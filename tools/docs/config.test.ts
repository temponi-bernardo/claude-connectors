import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_DOCS_CONFIG, loadDocsConfig, mergeDocsConfig } from './config.js';

describe('mergeDocsConfig', () => {
  it('mescla parcial sobre os padrões', () => {
    expect(mergeDocsConfig({ uiDir: 'ui' })).toEqual({ ...DEFAULT_DOCS_CONFIG, uiDir: 'ui' });
  });

  it('rejeita formatos inválidos', () => {
    expect(() => mergeDocsConfig([])).toThrow('objeto JSON');
    expect(() => mergeDocsConfig({ sourceDirs: [] })).toThrow('sourceDirs');
    expect(() => mergeDocsConfig({ uiDir: 3 })).toThrow('uiDir');
  });
});

describe('loadDocsConfig', () => {
  it('usa padrões sem arquivo e lê o arquivo quando existe', () => {
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
