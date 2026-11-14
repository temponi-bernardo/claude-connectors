/** Types shared by the documentation checker/generator. */

export interface DocsConfig {
  /** Folders with analyzed source code (relative to the root). */
  readonly sourceDirs: readonly string[];
  /** Globs (simplified minimatch style) of files ignored by the analysis. */
  readonly ignore: readonly string[];
  /** Sufixo que identifica arquivos de teste. */
  readonly testSuffix: string;
  /** Arquivo TS que exporta TEST_EXCEPTIONS. */
  readonly testExceptionsFile: string;
  /** UI components folder (null when the project has no interface). */
  readonly uiDir: string | null;
  readonly functionsDoc: string;
  readonly processesDoc: string;
  readonly structureDoc: string;
  readonly uiDoc: string;
}

export interface FunctionInfo {
  readonly name: string;
  /** Path relative to the root, with `/`. */
  readonly file: string;
  /** Assinatura sem o corpo, ex.: `slugify(title: string): string`. */
  readonly signature: string;
}

export interface ConstantInfo {
  readonly name: string;
  readonly file: string;
}

/** Function name → labels of whoever references it (`fn()` or `file (module)`). */
export type ReferenceIndex = ReadonlyMap<string, ReadonlySet<string>>;

/** Function name → names of the registry functions it calls or passes as a value. */
export type CallGraph = ReadonlyMap<string, ReadonlySet<string>>;

/** Process id (P01) → functions cited in the text. */
export type ProcessCitations = ReadonlyMap<string, ReadonlySet<string>>;

export interface GeneratedData {
  readonly usedBy: readonly string[];
  readonly processes: readonly string[];
}

export interface FunctionSection {
  readonly name: string;
  /** Nearest `## ...` heading above the section (module). */
  readonly moduleHeading: string | null;
  /** Content between the generated markers (null if none). */
  readonly generatedBlock: string | null;
  /** Manual text of the section (outside the generated block). */
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
