import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DocsConfig } from './types.js';

/** Valores padrão da configuração; `docs.config.json` sobrescreve o que declarar. */
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

/** Mescla um objeto parcial lido do JSON sobre os padrões, validando os tipos essenciais. */
export function mergeDocsConfig(partial: unknown): DocsConfig {
  if (typeof partial !== 'object' || partial === null || Array.isArray(partial)) {
    throw new Error('docs.config.json precisa ser um objeto JSON.');
  }
  const merged = { ...DEFAULT_DOCS_CONFIG, ...(partial as Partial<DocsConfig>) };
  if (!Array.isArray(merged.sourceDirs) || merged.sourceDirs.length === 0) {
    throw new Error('docs.config.json: "sourceDirs" precisa ser uma lista com ao menos uma pasta.');
  }
  if (merged.uiDir !== null && typeof merged.uiDir !== 'string') {
    throw new Error('docs.config.json: "uiDir" precisa ser string ou null.');
  }
  return merged;
}

/** Lê `docs.config.json` da raiz (se existir) e devolve a configuração completa. */
export function loadDocsConfig(rootDir: string): DocsConfig {
  let raw: string;
  try {
    raw = readFileSync(join(rootDir, 'docs.config.json'), 'utf8');
  } catch {
    return DEFAULT_DOCS_CONFIG;
  }
  return mergeDocsConfig(JSON.parse(raw));
}
