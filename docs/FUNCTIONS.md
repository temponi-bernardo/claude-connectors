# Funções

Toda função de topo do código aparece aqui, em um modelo fixo. Os campos entre `<!-- gerado:inicio -->` e
`<!-- gerado:fim -->` (Arquivo, Assinatura, Usada por, Processos) são escritos por `npm run docs:generate` a
partir do código — não edite à mão. Os campos **Faz**, **Entrada**, **Saída**, **Efeitos** e **Erros** são
manuais e obrigatórios; `npm run docs:check` falha enquanto houver `_preencher_`.

Modelo e regras de escrita: [DOCUMENTATION.md](DOCUMENTATION.md#função).

## Índice por módulo

<!-- indice:inicio -->

- `src/core/slug.ts`: [`removeDiacritics`](#removediacritics), [`slugify`](#slugify)
- `src/main.ts`: [`main`](#main)
- `tools/docs/ast.ts`: [`toPosixRelative`](#toposixrelative), [`globToRegExp`](#globtoregexp), [`isAnalyzedSource`](#isanalyzedsource), [`openProject`](#openproject), [`signatureOf`](#signatureof), [`collectFileFunctions`](#collectfilefunctions), [`collectFunctions`](#collectfunctions), [`isDataDeclaration`](#isdatadeclaration), [`collectFileConstants`](#collectfileconstants), [`collectConstants`](#collectconstants), [`isIgnoredReference`](#isignoredreference), [`ownerLabelOf`](#ownerlabelof), [`findDeclaration`](#finddeclaration), [`buildReferenceIndex`](#buildreferenceindex), [`buildCallGraph`](#buildcallgraph)
- `tools/docs/checks.ts`: [`checkFunctionsDocumented`](#checkfunctionsdocumented), [`checkSectionModules`](#checksectionmodules), [`checkUniqueNames`](#checkuniquenames), [`checkGeneratedBlocks`](#checkgeneratedblocks), [`checkManualFields`](#checkmanualfields), [`checkProcessCitations`](#checkprocesscitations), [`checkStructure`](#checkstructure), [`checkUiComponents`](#checkuicomponents), [`checkTests`](#checktests), [`checkConstants`](#checkconstants), [`runAllChecks`](#runallchecks)
- `tools/docs/cli.ts`: [`runDocsCli`](#rundocscli)
- `tools/docs/config.ts`: [`mergeDocsConfig`](#mergedocsconfig), [`loadDocsConfig`](#loaddocsconfig)
- `tools/docs/inventory.ts`: [`listGitFiles`](#listgitfiles), [`walkFiles`](#walkfiles), [`dirsFromFiles`](#dirsfromfiles), [`listVersionedDirs`](#listversioneddirs), [`readTestFilesText`](#readtestfilestext), [`listUiComponents`](#listuicomponents), [`loadTestExceptions`](#loadtestexceptions), [`buildInventory`](#buildinventory)
- `tools/docs/markdown.ts`: [`firstGroup`](#firstgroup), [`stripCodeBlocks`](#stripcodeblocks), [`extractCalledNames`](#extractcallednames), [`sliceBetween`](#slicebetween), [`replaceBetween`](#replacebetween), [`extractFunctionSections`](#extractfunctionsections), [`buildSection`](#buildsection), [`extractProcessCitations`](#extractprocesscitations), [`extractDocumentedDirs`](#extractdocumenteddirs), [`extractBacktickedNames`](#extractbacktickednames)
- `tools/docs/render.ts`: [`formatList`](#formatlist), [`renderGeneratedBlock`](#rendergeneratedblock), [`renderNewSection`](#rendernewsection), [`renderModuleIndex`](#rendermoduleindex), [`computeGeneratedData`](#computegenerateddata), [`closureOf`](#closureof), [`processesByFunction`](#processesbyfunction), [`replaceSectionBlock`](#replacesectionblock), [`appendSection`](#appendsection), [`insertBeforeDataTable`](#insertbeforedatatable), [`removeSection`](#removesection), [`removeEmptyModules`](#removeemptymodules), [`pruneOrphanSections`](#pruneorphansections), [`applyGenerated`](#applygenerated)
- `tools/docs/run.ts`: [`readOptional`](#readoptional), [`readDocsTexts`](#readdocstexts), [`formatIssues`](#formatissues), [`runCheck`](#runcheck), [`generateFunctionsDoc`](#generatefunctionsdoc), [`runGenerate`](#rungenerate)
- `tools/init/cli.ts`: [`runInitCli`](#runinitcli)
- `tools/init/init.ts`: [`parseKeyValueArgs`](#parsekeyvalueargs), [`requireArg`](#requirearg), [`parseInitArgs`](#parseinitargs), [`replacePlaceholders`](#replaceplaceholders), [`applyPackageValues`](#applypackagevalues), [`resetChangelog`](#resetchangelog), [`rewriteFile`](#rewritefile), [`initFile`](#initfile), [`initProject`](#initproject)

<!-- indice:fim -->

## `src/core/slug.ts`

### `removeDiacritics`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/slug.ts`
- **Assinatura:** `removeDiacritics(text: string): string`
- **Usada por:** `slugify()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Remove acentos e marcas diacríticas de um texto (normalização NFD + remoção dos combinantes).
- **Entrada:** `text`: texto livre.
- **Saída:** Texto sem diacríticos, mesmo comprimento de letras.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `slugify`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/slug.ts`
- **Assinatura:** `slugify(title: string): string`
- **Usada por:** `main()`, `parseInitArgs()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Converte um título em slug de URL: minúsculo, sem acentos, blocos não alfanuméricos virando um hífen, sem hífens nas pontas e limitado a `MAX_SLUG_LENGTH`.
- **Entrada:** `title`: título livre.
- **Saída:** Slug (`[a-z0-9-]*`); vazio se não houver caracteres válidos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/main.ts`

### `main`

<!-- gerado:inicio -->

- **Arquivo:** `src/main.ts`
- **Assinatura:** `main(args: readonly string[]): void`
- **Usada por:** `src/main.ts (módulo)`
- **Processos:** P04

<!-- gerado:fim -->

- **Faz:** Ponto de entrada do esqueleto: monta um título a partir dos argumentos (ou usa "Olá, Mundo!") e imprime o slug.
- **Entrada:** `args`: argumentos da linha de comando, sem `node` e script.
- **Saída:** Nada (`void`).
- **Efeitos:** Escreve uma linha no stdout.
- **Erros:** Nenhum.

## `tools/docs/ast.ts`

### `toPosixRelative`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `toPosixRelative(rootDir: string, absolutePath: string): string`
- **Usada por:** `collectFileConstants()`, `collectFileFunctions()`, `openProject()`, `ownerLabelOf()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Converte um caminho absoluto em caminho relativo à raiz, sempre com `/`.
- **Entrada:** `rootDir`: raiz absoluta; `absolutePath`: caminho absoluto dentro dela.
- **Saída:** Caminho relativo POSIX, ex.: `src/a.ts`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `globToRegExp`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `globToRegExp(glob: string): RegExp`
- **Usada por:** `isAnalyzedSource()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Converte um glob simples (`**/`, `**`, `*`) em expressão regular ancorada, para casar caminhos relativos.
- **Entrada:** `glob`: padrão, ex.: `**/fixtures/**`.
- **Saída:** `RegExp` que casa o caminho inteiro.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isAnalyzedSource`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isAnalyzedSource(relativePath: string, config: DocsConfig): boolean`
- **Usada por:** `openProject()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Decide se um arquivo entra na análise: termina em `.ts`, não é `.d.ts`, não é teste e não casa com nenhum glob de `ignore`.
- **Entrada:** `relativePath`: caminho relativo; `config`: configuração do docs.
- **Saída:** `true` se o arquivo deve ser analisado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `openProject`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `openProject(rootDir: string, config: DocsConfig): Project`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Cria o projeto ts-morph com módulo/resolução NodeNext, adiciona os `.ts` das pastas configuradas e remove os que `isAnalyzedSource()` rejeita.
- **Entrada:** `rootDir`: raiz do repositório; `config`: configuração do docs.
- **Saída:** `Project` do ts-morph pronto para análise.
- **Efeitos:** Lê arquivos do disco.
- **Erros:** Erros de leitura do sistema de arquivos propagam.

### `signatureOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `signatureOf(fn: FunctionDeclaration): string`
- **Usada por:** `collectFileFunctions()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Monta a assinatura legível de uma função: `async` se houver, nome, parâmetros como escritos e tipo de retorno (declarado ou inferido).
- **Entrada:** `fn`: declaração de função do ts-morph.
- **Saída:** Texto como `slugify(title: string): string`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectFileFunctions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[]`
- **Usada por:** `collectFunctions()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista as funções de topo nomeadas de um arquivo, com arquivo relativo e assinatura.
- **Entrada:** `rootDir`: raiz; `file`: arquivo-fonte do ts-morph.
- **Saída:** Lista de `FunctionInfo` na ordem do arquivo.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectFunctions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFunctions(rootDir: string, project: Project): FunctionInfo[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista todas as funções de topo do projeto, arquivos em ordem alfabética.
- **Entrada:** `rootDir`: raiz; `project`: projeto ts-morph aberto.
- **Saída:** Lista de `FunctionInfo` (o registro de funções).
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `isDataDeclaration`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isDataDeclaration(declaration: VariableDeclaration): boolean`
- **Usada por:** `collectFileConstants()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Decide se uma declaração de variável é dado/constante e não uma função atribuída a `const` (arrow ou function expression).
- **Entrada:** `declaration`: declaração de variável do ts-morph.
- **Saída:** `true` para dados (inclusive sem inicializador).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `collectFileConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFileConstants(rootDir: string, file: SourceFile): ConstantInfo[]`
- **Usada por:** `collectConstants()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista as constantes exportadas de topo de um arquivo, excluindo funções atribuídas a variáveis.
- **Entrada:** `rootDir`: raiz; `file`: arquivo-fonte.
- **Saída:** Lista de `ConstantInfo`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectConstants(rootDir: string, project: Project): ConstantInfo[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista as constantes exportadas de todo o projeto, para a tabela "Dados e constantes".
- **Entrada:** `rootDir`: raiz; `project`: projeto ts-morph.
- **Saída:** Lista de `ConstantInfo`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `isIgnoredReference`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isIgnoredReference(node: Node): boolean`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Decide se um nó de referência deve ser ignorado no índice: a própria declaração, especificadores de import/export, cláusula de import e `export default`.
- **Entrada:** `node`: nó de referência retornado pelo ts-morph.
- **Saída:** `true` para ignorar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `ownerLabelOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `ownerLabelOf(rootDir: string, node: Node): string`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Descobre quem contém uma referência: a função de topo que a envolve (`nome()`) ou, fora de função, o módulo do arquivo (`arquivo (módulo)`).
- **Entrada:** `rootDir`: raiz; `node`: nó de referência.
- **Saída:** Rótulo usado em "Usada por".
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `findDeclaration`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `findDeclaration(rootDir: string, project: Project, info: FunctionInfo): FunctionDeclaration | undefined`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Localiza a declaração de uma função do registro no projeto, pelo arquivo e nome.
- **Entrada:** `rootDir`: raiz; `project`: projeto; `info`: função do registro.
- **Saída:** A `FunctionDeclaration`, ou `undefined` se arquivo/função não existirem.
- **Efeitos:** Nenhum.
- **Erros:** Nenhum.

### `buildReferenceIndex`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `buildReferenceIndex(rootDir: string, project: Project, functions: readonly FunctionInfo[]): ReferenceIndex`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Monta o índice de referências: para cada função, o conjunto de rótulos de quem a chama ou a passa como valor (via `findReferencesAsNodes`, filtrado por `isIgnoredReference()`).
- **Entrada:** `rootDir`: raiz; `project`: projeto; `functions`: registro.
- **Saída:** `ReferenceIndex` (nome → rótulos).
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `buildCallGraph`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `buildCallGraph(functions: readonly FunctionInfo[], references: ReferenceIndex): CallGraph`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Inverte o índice de referências em grafo de chamadas: função → funções do registro que ela usa. Referências do nível de módulo não geram aresta.
- **Entrada:** `functions`: registro; `references`: índice de referências.
- **Saída:** `CallGraph` com uma entrada por função.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/checks.ts`

### `checkFunctionsDocumented`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkFunctionsDocumented(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Compara registro e seções: aponta função sem seção (`FUNCAO_SEM_DOC`) e seção sem função (`DOC_SEM_FUNCAO`).
- **Entrada:** `functions`: registro; `sections`: seções do FUNCTIONS.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkSectionModules`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkSectionModules(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta seção colocada sob o heading `## arquivo` errado (`SECAO_NO_MODULO_ERRADO`).
- **Entrada:** `functions`: registro; `sections`: seções.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkUniqueNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkUniqueNames(functions: readonly FunctionInfo[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta nome de função definido em mais de um arquivo (`NOME_DUPLICADO`).
- **Entrada:** `functions`: registro.
- **Saída:** Lista de `Issue`, uma por nome repetido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkGeneratedBlocks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkGeneratedBlocks(inventory: Inventory, sections: readonly FunctionSection[], citations: ProcessCitations): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Recalcula o bloco gerado de cada função documentada e compara com o texto atual (`BLOCO_GERADO_DESATUALIZADO`), mostrando esperado e encontrado.
- **Entrada:** `inventory`: inventário; `sections`: seções; `citations`: citações de processos.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkManualFields`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkManualFields(sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Confere os cinco campos manuais de cada seção: ausente (`CAMPO_MANUAL_FALTANDO`) ou ainda com o marcador `PLACEHOLDER` (`CAMPO_MANUAL_VAZIO`).
- **Entrada:** `sections`: seções.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkProcessCitations`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkProcessCitations(functions: readonly FunctionInfo[], citations: ProcessCitations): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta função citada em PROCESSES.md que não existe no código (`PROCESSO_CITA_FUNCAO_INEXISTENTE`).
- **Entrada:** `functions`: registro; `citations`: citações por processo.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkStructure`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkStructure(versionedDirs: readonly string[], structureMarkdown: string): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta pasta versionada ausente de STRUCTURE.md (`PASTA_SEM_DOC`).
- **Entrada:** `versionedDirs`: pastas com barra final; `structureMarkdown`: texto do STRUCTURE.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkUiComponents`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkUiComponents(components: readonly string[], uiMarkdown: string | null): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta componente de UI sem menção em UI.md (`COMPONENTE_SEM_DOC`) ou UI.md ausente quando há componentes (`UI_DOC_FALTANDO`).
- **Entrada:** `components`: nomes dos componentes; `uiMarkdown`: texto do UI.md ou `null`.
- **Saída:** Lista de `Issue` (vazia sem componentes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkTests`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkTests(inventory: Inventory): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta função cujo nome não aparece em nenhum arquivo de teste e não está nas exceções (`FUNCAO_SEM_TESTE`), e exceção que cita função inexistente (`EXCECAO_DE_TESTE_OBSOLETA`).
- **Entrada:** `inventory`: inventário.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aponta constante exportada ausente da tabela "Dados e constantes" (`CONSTANTE_SEM_DOC`); só o trecho a partir desse heading conta.
- **Entrada:** `inventory`: inventário; `functionsMarkdown`: texto do FUNCTIONS.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runAllChecks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `runAllChecks(inventory: Inventory, docs: DocsTexts, citations: ProcessCitations): Issue[]`
- **Usada por:** `runCheck()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Extrai as seções do FUNCTIONS.md e roda todas as checagens puras, concatenando os problemas na ordem fixa.
- **Entrada:** `inventory`: inventário; `docs`: textos dos documentos; `citations`: citações de processos.
- **Saída:** Lista completa de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/cli.ts`

### `runDocsCli`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/cli.ts`
- **Assinatura:** `async runDocsCli(args: readonly string[]): Promise<number>`
- **Usada por:** `tools/docs/cli.ts (módulo)`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Interpreta o comando (`check` padrão ou `generate`), executa e imprime o resultado.
- **Entrada:** `args`: argumentos da linha de comando.
- **Saída:** Código de saída: 0 ok, 1 problemas, 2 comando desconhecido.
- **Efeitos:** Escreve no stdout/stderr; `generate` regrava FUNCTIONS.md.
- **Erros:** Propaga erros de configuração para o processo (sai com erro).

## `tools/docs/config.ts`

### `mergeDocsConfig`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/config.ts`
- **Assinatura:** `mergeDocsConfig(partial: unknown): DocsConfig`
- **Usada por:** `loadDocsConfig()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Mescla um objeto parcial sobre `DEFAULT_DOCS_CONFIG` e valida `sourceDirs` e `uiDir`.
- **Entrada:** `partial`: valor lido do JSON (qualquer tipo).
- **Saída:** `DocsConfig` completa.
- **Efeitos:** Nenhum (pura).
- **Erros:** `Error` com mensagem em português se não for objeto, se `sourceDirs` estiver vazio ou se `uiDir` tiver tipo inválido.

### `loadDocsConfig`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/config.ts`
- **Assinatura:** `loadDocsConfig(rootDir: string): DocsConfig`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê `docs.config.json` da raiz e devolve a configuração completa; sem arquivo, usa os padrões.
- **Entrada:** `rootDir`: raiz do repositório.
- **Saída:** `DocsConfig`.
- **Efeitos:** Lê um arquivo.
- **Erros:** JSON malformado ou inválido (`mergeDocsConfig()`) lança `Error`.

## `tools/docs/inventory.ts`

### `listGitFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listGitFiles(rootDir: string): string[] | null`
- **Usada por:** `listVersionedDirs()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista arquivos versionados e não ignorados via `git ls-files --cached --others --exclude-standard`.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Lista de caminhos relativos, ou `null` se o git falhar/não existir.
- **Efeitos:** Executa o git como subprocesso.
- **Erros:** Nenhum (falhas viram `null`).

### `walkFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `walkFiles(rootDir: string, relativeDir = ''): string[]`
- **Usada por:** `listUiComponents()`, `listVersionedDirs()`, `readTestFilesText()`, `walkFiles()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Percorre o disco recursivamente listando arquivos, pulando `WALK_IGNORED_DIRS`.
- **Entrada:** `rootDir`: raiz; `relativeDir`: subpasta (interno, padrão vazio).
- **Saída:** Lista de caminhos relativos a `rootDir`.
- **Efeitos:** Lê diretórios do disco.
- **Erros:** Erros de leitura propagam.

### `dirsFromFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `dirsFromFiles(files: readonly string[]): string[]`
- **Usada por:** `listVersionedDirs()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Deriva de uma lista de arquivos todas as pastas, inclusive as intermediárias, com barra final e ordenadas.
- **Entrada:** `files`: caminhos relativos.
- **Saída:** Lista de pastas como `a/`, `a/b/`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `listVersionedDirs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listVersionedDirs(rootDir: string): string[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista as pastas versionadas do repositório, pelo git ou, sem git, pelo disco.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Lista de pastas com barra final.
- **Efeitos:** Git ou leitura de disco.
- **Erros:** Erros de leitura propagam.

### `readTestFilesText`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `readTestFilesText(rootDir: string, config: DocsConfig): string`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Concatena o conteúdo de todos os arquivos de teste das pastas de código (pelo sufixo configurado).
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Texto único com todos os testes.
- **Efeitos:** Lê arquivos do disco.
- **Erros:** Erros de leitura propagam.

### `listUiComponents`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listUiComponents(rootDir: string, config: DocsConfig): string[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lista nomes de componentes de UI: arquivos `.tsx` da pasta `uiDir`, sem os de teste, ordenados.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Lista de nomes (vazia se `uiDir` for `null` ou não existir).
- **Efeitos:** Lê diretórios do disco.
- **Erros:** Nenhum.

### `loadTestExceptions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `async loadTestExceptions(rootDir: string, config: DocsConfig): Promise<TestExceptionEntry[]>`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Importa dinamicamente o arquivo de exceções de teste e devolve `TEST_EXCEPTIONS`.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Promise com a lista de exceções (vazia se o arquivo não existir).
- **Efeitos:** Importa um módulo em tempo de execução.
- **Erros:** `Error` se `TEST_EXCEPTIONS` não for uma lista.

### `buildInventory`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `async buildInventory(rootDir: string, config: DocsConfig): Promise<Inventory>`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Monta o inventário completo: funções, constantes, referências, grafo de chamadas, pastas versionadas, texto dos testes, componentes de UI e exceções.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Promise com `Inventory`.
- **Efeitos:** Lê disco, executa git, importa módulo.
- **Erros:** Propaga erros das etapas.

## `tools/docs/markdown.ts`

### `firstGroup`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `firstGroup(match: RegExpMatchArray): string`
- **Usada por:** `checkManualFields()`, `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Devolve o primeiro grupo de captura de um match de regex, ou string vazia.
- **Entrada:** `match`: resultado de `exec`/`matchAll`.
- **Saída:** Texto do grupo 1.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `stripCodeBlocks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `stripCodeBlocks(markdown: string): string`
- **Usada por:** `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Remove blocos de código cercados por ``` ou ~~~ para que exemplos não contem como citações.
- **Entrada:** `markdown`: texto.
- **Saída:** Texto sem os blocos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractCalledNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractCalledNames(text: string): Set<string>`
- **Usada por:** `extractProcessCitations()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Extrai nomes citados como `` `nome()` `` fora de blocos de código.
- **Entrada:** `text`: markdown.
- **Saída:** `Set` de nomes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sliceBetween`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `sliceBetween(text: string, start: string, end: string): string | null`
- **Usada por:** `buildSection()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Extrai o texto entre dois marcadores, sem espaços nas pontas.
- **Entrada:** `text`; `start` e `end`: marcadores.
- **Saída:** Miolo, ou `null` se algum marcador faltar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `replaceBetween`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `replaceBetween(text: string, markers: readonly [string, string], content: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Substitui o conteúdo entre dois marcadores, mantendo-os; sem marcadores devolve o texto intacto.
- **Entrada:** `text`; `markers`: par início/fim; `content`: novo miolo.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractFunctionSections`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractFunctionSections(markdown: string): FunctionSection[]`
- **Usada por:** `applyGenerated()`, `pruneOrphanSections()`, `runAllChecks()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Divide o markdown em seções `### \`nome\``, registrando o heading `## ...` acima de cada uma, o bloco gerado e o texto manual; ignora blocos de código.
- **Entrada:** `markdown`: texto do FUNCTIONS.md.
- **Saída:** Lista de `FunctionSection`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `buildSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `buildSection(name: string, moduleHeading: string | null, raw: string): FunctionSection`
- **Usada por:** `extractFunctionSections()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Monta uma `FunctionSection` a partir do texto bruto de uma seção, separando bloco gerado e texto manual.
- **Entrada:** `name`; `moduleHeading` (ou `null`); `raw`: texto da seção.
- **Saída:** `FunctionSection`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractProcessCitations`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractProcessCitations(markdown: string): ProcessCitations`
- **Usada por:** `generateFunctionsDoc()`, `runCheck()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê PROCESSES.md: para cada heading `## Pnn ...`, as funções citadas como `` `nome()` ``.
- **Entrada:** `markdown`: texto do PROCESSES.md.
- **Saída:** `ProcessCitations` (id → nomes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractDocumentedDirs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractDocumentedDirs(markdown: string): Set<string>`
- **Usada por:** `checkStructure()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê as pastas documentadas em STRUCTURE.md: trechos em crase terminados em `/`.
- **Entrada:** `markdown`: texto do STRUCTURE.md.
- **Saída:** `Set` de pastas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractBacktickedNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractBacktickedNames(markdown: string): Set<string>`
- **Usada por:** `checkConstants()`, `checkUiComponents()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê identificadores simples em crase (`` `Nome` ``) fora de blocos de código.
- **Entrada:** `markdown`: texto.
- **Saída:** `Set` de nomes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/render.ts`

### `formatList`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `formatList(items: readonly string[]): string`
- **Usada por:** `renderGeneratedBlock()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Formata uma lista para markdown: itens em crase separados por vírgula, ou `—` se vazia.
- **Entrada:** `items`: textos.
- **Saída:** Texto formatado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderGeneratedBlock`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string`
- **Usada por:** `applyGenerated()`, `checkGeneratedBlocks()`, `renderNewSection()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Renderiza as quatro linhas do bloco gerado (Arquivo, Assinatura, Usada por, Processos).
- **Entrada:** `info`: função; `data`: usada-por e processos calculados.
- **Saída:** Texto do bloco, sem os marcadores.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderNewSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderNewSection(info: FunctionInfo, data: GeneratedData): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Renderiza uma seção nova completa: heading, bloco gerado com marcadores e campos manuais com o marcador `PLACEHOLDER`.
- **Entrada:** `info`: função; `data`: dados gerados.
- **Saída:** Texto da seção.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderModuleIndex`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderModuleIndex(functions: readonly FunctionInfo[]): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Renderiza o índice por módulo: uma linha por arquivo com links para suas funções.
- **Entrada:** `functions`: registro.
- **Saída:** Texto do índice.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `computeGeneratedData`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `computeGeneratedData(name: string, references: ReferenceIndex, processesByFunction: ReadonlyMap<string, ReadonlySet<string>>): GeneratedData`
- **Usada por:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Calcula "Usada por" e "Processos" de uma função, ordenados, a partir do índice de referências e do mapa função → processos.
- **Entrada:** `name`; `references`; `processesByFunction`.
- **Saída:** `GeneratedData`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `closureOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `closureOf(graph: CallGraph, roots: ReadonlySet<string>): Set<string>`
- **Usada por:** `processesByFunction()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Fecho transitivo em um grafo: as raízes mais tudo o que elas chamam, direta ou indiretamente.
- **Entrada:** `graph`: grafo de chamadas; `roots`: nomes iniciais.
- **Saída:** `Set` com todos os alcançados (inclui raízes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `processesByFunction`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `processesByFunction(citations: ProcessCitations, graph: CallGraph): Map<string, Set<string>>`
- **Usada por:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Inverte as citações: para cada processo, expande o fecho das funções citadas e registra o processo em cada uma.
- **Entrada:** `citations`: processo → citadas; `graph`: grafo de chamadas.
- **Saída:** `Map` função → ids de processo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `replaceSectionBlock`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `replaceSectionBlock(markdown: string, name: string, block: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Substitui o bloco gerado da seção de uma função específica.
- **Entrada:** `markdown`; `name`; `block`: novo conteúdo.
- **Saída:** Texto atualizado (intacto se a seção não existir).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `appendSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `appendSection(markdown: string, info: FunctionInfo, section: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Acrescenta uma seção nova sob o heading `## arquivo` da função, antes do próximo heading; cria o heading antes da tabela de dados se faltar.
- **Entrada:** `markdown`; `info`: função; `section`: texto da seção.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `insertBeforeDataTable`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `insertBeforeDataTable(markdown: string, text: string): string`
- **Usada por:** `appendSection()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Insere texto antes de `## Dados e constantes`, ou no fim se a tabela não existir.
- **Entrada:** `markdown`; `text`.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `applyGenerated`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `applyGenerated(markdown: string, functions: readonly FunctionInfo[], dataOf: (name: string) => GeneratedData): string`
- **Usada por:** `generateFunctionsDoc()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Aplica o gerador ao FUNCTIONS.md: atualiza o índice, substitui blocos gerados existentes e acrescenta seções para funções novas.
- **Entrada:** `markdown`: texto atual; `functions`: registro; `dataOf`: função que calcula os dados gerados por nome.
- **Saída:** Novo texto do FUNCTIONS.md.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `removeSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `removeSection(markdown: string, name: string): string`
- **Usada por:** `pruneOrphanSections()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Remove a seção da função (heading `###` com o nome) inteira, do heading até o próximo heading `##`/`###` ou o fim do texto.
- **Entrada:** `markdown`: texto do FUNCTIONS.md; `name`: nome da função.
- **Saída:** Markdown sem a seção (intacto se ela não existir).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `removeEmptyModules`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `removeEmptyModules(markdown: string): string`
- **Usada por:** `pruneOrphanSections()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Remove headings de módulo (`##` com o caminho do arquivo) sem nenhuma seção abaixo e normaliza para uma única quebra de linha final.
- **Entrada:** `markdown`: texto do FUNCTIONS.md.
- **Saída:** Markdown sem módulos vazios.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pruneOrphanSections`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Remove as seções de funções que não existem mais no código e, se removeu alguma, os módulos que ficaram vazios.
- **Entrada:** `markdown`: texto do FUNCTIONS.md; `functions`: funções do inventário.
- **Saída:** Markdown podado (o mesmo texto se não houver órfãs).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/run.ts`

### `readOptional`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `readOptional(rootDir: string, relativePath: string): string | null`
- **Usada por:** `readDocsTexts()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê um arquivo de texto relativo à raiz, ou `null` se não existir.
- **Entrada:** `rootDir`; `relativePath`.
- **Saída:** Conteúdo ou `null`.
- **Efeitos:** Lê um arquivo.
- **Erros:** Erros de leitura (fora de "não existe") propagam.

### `readDocsTexts`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Lê FUNCTIONS, PROCESSES, STRUCTURE (vazios se ausentes) e UI (`null` se ausente).
- **Entrada:** `rootDir`; `config`.
- **Saída:** `DocsTexts`.
- **Efeitos:** Lê arquivos.
- **Erros:** Erros de leitura propagam.

### `formatIssues`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `formatIssues(issues: readonly Issue[]): string`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Formata os problemas para o terminal: `✔` sem problemas, ou lista numerada `[CODIGO] mensagem`.
- **Entrada:** `issues`: lista de `Issue`.
- **Saída:** Texto pronto para imprimir.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runCheck`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `async runCheck(rootDir: string): Promise<Issue[]>`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Executa a checagem completa: carrega configuração, inventário e documentos e roda `runAllChecks()`.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Promise com a lista de `Issue`.
- **Efeitos:** Lê disco, executa git, importa módulo.
- **Erros:** Propaga erros de configuração.

### `generateFunctionsDoc`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string`
- **Usada por:** `runGenerate()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Calcula o novo texto do FUNCTIONS.md a partir do inventário e dos documentos atuais.
- **Entrada:** `inventory`; `docs`: textos.
- **Saída:** Novo texto do FUNCTIONS.md.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runGenerate`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `async runGenerate(rootDir: string): Promise<boolean>`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02

<!-- gerado:fim -->

- **Faz:** Regrava o FUNCTIONS.md com índice, blocos gerados e seções novas, só se houver mudança.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Promise com `true` se o arquivo mudou.
- **Efeitos:** Lê e grava `docs/FUNCTIONS.md`.
- **Erros:** Propaga erros de configuração e de escrita.

## `tools/init/cli.ts`

### `runInitCli`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/cli.ts`
- **Assinatura:** `runInitCli(args: readonly string[]): number`
- **Usada por:** `tools/init/cli.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Interpreta os argumentos, inicializa o projeto e imprime os arquivos alterados.
- **Entrada:** `args`: argumentos da linha de comando.
- **Saída:** Código de saída: 0 ok, 1 erro.
- **Efeitos:** Grava arquivos; escreve no stdout/stderr.
- **Erros:** Nenhum (erros viram mensagem e código 1).

## `tools/init/init.ts`

### `parseKeyValueArgs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `parseKeyValueArgs(args: readonly string[]): Map<string, string>`
- **Usada por:** `parseInitArgs()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte `--chave valor ...` em um mapa.
- **Entrada:** `args`: argumentos.
- **Saída:** `Map` chave → valor (valor vazio se faltar).
- **Efeitos:** Nenhum (pura).
- **Erros:** `Error` se um argumento não começar com `--`.

### `requireArg`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `requireArg(values: ReadonlyMap<string, string>, key: string): string`
- **Usada por:** `parseInitArgs()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Devolve o valor obrigatório de uma chave.
- **Entrada:** `values`: mapa; `key`: chave.
- **Saída:** Valor não vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** `Error` "Falta o argumento --chave" se ausente ou vazio.

### `parseInitArgs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `parseInitArgs(args: readonly string[]): InitValues`
- **Usada por:** `runInitCli()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê `--name`, `--description` e `--owner` e normaliza o nome com `slugify()`.
- **Entrada:** `args`: argumentos.
- **Saída:** `InitValues`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Propaga os erros de `parseKeyValueArgs()` e `requireArg()`.

### `replacePlaceholders`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `replacePlaceholders(text: string, values: InitValues): string`
- **Usada por:** `initFile()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Substitui `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{GITHUB_OWNER}}` e `{{YEAR}}`; marcadores desconhecidos ficam como estão.
- **Entrada:** `text`; `values`: valores do projeto.
- **Saída:** Texto substituído.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `initFile`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `initFile(rootDir: string, relativePath: string, values: InitValues): boolean`
- **Usada por:** `initProject()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Aplica `replacePlaceholders()` a um arquivo via `rewriteFile()`.
- **Entrada:** `rootDir`; `relativePath`; `values`.
- **Saída:** `true` se o arquivo mudou (`false` se não existe ou não tinha marcadores).
- **Efeitos:** Lê e grava um arquivo.
- **Erros:** Erros de escrita propagam.

### `initProject`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `initProject(rootDir: string, values: InitValues): string[]`
- **Usada por:** `runInitCli()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Inicializa o projeto: marcadores em `TEMPLATE_FILES`, nome do pacote em `PACKAGE_FILES` e "Não lançado" vazio no CHANGELOG.
- **Entrada:** `rootDir`; `values`.
- **Saída:** Lista dos arquivos alterados.
- **Efeitos:** Grava arquivos.
- **Erros:** Erros de escrita propagam.

### `applyPackageValues`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `applyPackageValues(text: string, values: InitValues): string`
- **Usada por:** `initProject()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Troca o nome do pacote (raiz e, no lock, o pacote `""`) e a descrição, só se o campo existir.
- **Entrada:** `text`: JSON de `package.json` ou `package-lock.json`; `values`.
- **Saída:** JSON reformatado com 2 espaços e quebra de linha final.
- **Efeitos:** Nenhum (pura).
- **Erros:** JSON inválido lança `SyntaxError`.

### `resetChangelog`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `resetChangelog(text: string): string`
- **Usada por:** `initProject()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Esvazia a seção `## [Não lançado]` do CHANGELOG, mantendo o heading e as versões seguintes.
- **Entrada:** `text`: conteúdo do CHANGELOG.
- **Saída:** Texto com "Não lançado" vazio; intacto se a seção não existir.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `rewriteFile`

<!-- gerado:inicio -->

- **Arquivo:** `tools/init/init.ts`
- **Assinatura:** `rewriteFile(rootDir: string, relativePath: string, transform: (text: string) => string): boolean`
- **Usada por:** `initFile()`, `initProject()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê um arquivo, aplica `transform` e grava só se o conteúdo mudou.
- **Entrada:** `rootDir`; `relativePath`; `transform`: função texto → texto.
- **Saída:** `true` se gravou; `false` se nada mudou ou o arquivo não existe.
- **Efeitos:** Grava o arquivo.
- **Erros:** Erros de escrita e os lançados por `transform` propagam.

## Dados e constantes

| Nome                  | Arquivo                   | O que é                                                                   |
| --------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `MAX_SLUG_LENGTH`     | `src/core/slug.ts`        | Tamanho máximo de um slug gerado por `slugify`.                           |
| `TEST_EXCEPTIONS`     | `src/test-exceptions.ts`  | Lista única de funções sem teste automatizado, com motivo e teste manual. |
| `DEFAULT_DOCS_CONFIG` | `tools/docs/config.ts`    | Configuração padrão do `docs:check`; `docs.config.json` sobrescreve.      |
| `MODULE_SCOPE_SUFFIX` | `tools/docs/ast.ts`       | Sufixo do rótulo de referência feita fora de função (`arquivo (módulo)`). |
| `WALK_IGNORED_DIRS`   | `tools/docs/inventory.ts` | Pastas puladas ao percorrer o disco sem git.                              |
| `GENERATED_START`     | `tools/docs/markdown.ts`  | Marcador de início do bloco gerado em FUNCTIONS.md.                       |
| `GENERATED_END`       | `tools/docs/markdown.ts`  | Marcador de fim do bloco gerado.                                          |
| `INDEX_START`         | `tools/docs/markdown.ts`  | Marcador de início do índice por módulo.                                  |
| `INDEX_END`           | `tools/docs/markdown.ts`  | Marcador de fim do índice por módulo.                                     |
| `PLACEHOLDER`         | `tools/docs/markdown.ts`  | Texto `_preencher_` deixado nos campos manuais novos.                     |
| `MANUAL_FIELDS`       | `tools/docs/render.ts`    | Ordem fixa dos campos manuais (Faz, Entrada, Saída, Efeitos, Erros).      |
| `TEMPLATE_FILES`      | `tools/init/init.ts`      | Arquivos do template que contêm marcadores `{{...}}`.                     |
| `PACKAGE_FILES`       | `tools/init/init.ts`      | Manifestos npm cujo nome e descrição o init troca editando o JSON.        |
| `CHANGELOG_FILE`      | `tools/init/init.ts`      | CHANGELOG cuja seção "Não lançado" o init esvazia.                        |
