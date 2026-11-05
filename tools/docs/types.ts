/** Tipos compartilhados pelo verificador/gerador de documentação. */

export interface DocsConfig {
  /** Pastas com código-fonte analisado (relativas à raiz). */
  readonly sourceDirs: readonly string[];
  /** Globs (estilo minimatch simplificado) de arquivos ignorados na análise. */
  readonly ignore: readonly string[];
  /** Sufixo que identifica arquivos de teste. */
  readonly testSuffix: string;
  /** Arquivo TS que exporta TEST_EXCEPTIONS. */
  readonly testExceptionsFile: string;
  /** Pasta de componentes de UI (null quando o projeto não tem interface). */
  readonly uiDir: string | null;
  readonly functionsDoc: string;
  readonly processesDoc: string;
  readonly structureDoc: string;
  readonly uiDoc: string;
}

export interface FunctionInfo {
  readonly name: string;
  /** Caminho relativo à raiz, com `/`. */
  readonly file: string;
  /** Assinatura sem o corpo, ex.: `slugify(title: string): string`. */
  readonly signature: string;
}

export interface ConstantInfo {
  readonly name: string;
  readonly file: string;
}

/** Nome da função → rótulos de quem a referencia (`fn()` ou `arquivo (módulo)`). */
export type ReferenceIndex = ReadonlyMap<string, ReadonlySet<string>>;

/** Nome da função → nomes das funções do registro que ela chama ou passa como valor. */
export type CallGraph = ReadonlyMap<string, ReadonlySet<string>>;

/** Id do processo (P01) → funções citadas no texto. */
export type ProcessCitations = ReadonlyMap<string, ReadonlySet<string>>;

export interface GeneratedData {
  readonly usedBy: readonly string[];
  readonly processes: readonly string[];
}

export interface FunctionSection {
  readonly name: string;
  /** Heading `## ...` mais próximo acima da seção (módulo). */
  readonly moduleHeading: string | null;
  /** Conteúdo entre os marcadores gerados (null se não houver). */
  readonly generatedBlock: string | null;
  /** Texto manual da seção (fora do bloco gerado). */
  readonly manualText: string;
}

export interface Issue {
  readonly code: string;
  readonly message: string;
}

export interface TestExceptionEntry {
  readonly name: string;
  readonly reason: string;
  readonly manualTest: string;
}

export interface Inventory {
  readonly functions: readonly FunctionInfo[];
  readonly constants: readonly ConstantInfo[];
  readonly references: ReferenceIndex;
  readonly callGraph: CallGraph;
  readonly versionedDirs: readonly string[];
  readonly testFilesText: string;
  readonly uiComponents: readonly string[];
  readonly testExceptions: readonly TestExceptionEntry[];
}
