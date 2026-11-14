import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DocsConfig } from './types.js';

/** Default configuration values; `docs.config.json` overrides whatever it declares. */
export const DEFAULT_DOCS_CONFIG: DocsConfig = {
  sourceDirs: ['src', 'tools'],
  ignore: ['**/fixtures/**'],
  testSuffix: '.test.ts',
  testExceptionsFile: 'src/test-exceptions.ts',
  uiDir: null,
  functionsDoc: 'docs/FUNCTIONS.md',
  processesDoc: 'docs/PROCESSES.md',
  structureDoc: 'docs/STRUCTURE.md',
  uiDoc: 'docs/UI.md',
};

/** Merges a partial object read from JSON over the defaults, validating the essential types. */
export function mergeDocsConfig(partial: unknown): DocsConfig {
  if (typeof partial !== 'object' || partial === null || Array.isArray(partial)) {
    throw new Error('docs.config.json must be a JSON object.');
  }
  const merged = { ...DEFAULT_DOCS_CONFIG, ...(partial as Partial<DocsConfig>) };
  if (!Array.isArray(merged.sourceDirs) || merged.sourceDirs.length === 0) {
    throw new Error('docs.config.json: "sourceDirs" must be a list with at least one directory.');
  }
  if (merged.uiDir !== null && typeof merged.uiDir !== 'string') {
    throw new Error('docs.config.json: "uiDir" must be a string or null.');
  }
  return merged;
}

/** Reads `docs.config.json` from the root (if present) and returns the full configuration. */
export function loadDocsConfig(rootDir: string): DocsConfig {
  let raw: string;
  try {
    raw = readFileSync(join(rootDir, 'docs.config.json'), 'utf8');
  } catch {
    return DEFAULT_DOCS_CONFIG;
  }
  return mergeDocsConfig(JSON.parse(raw));
}
