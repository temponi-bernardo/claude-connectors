# 0008 — Conectores também como plugins de um marketplace do Claude Code

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** ADR 0007, F1.4

## Contexto

O dono quer instalar os conectores pela tela de marketplace de plugins do Claude ("Adicionar marketplace" com
`temponi-bernardo/claude-connectors`). Um plugin é copiado só a partir da própria pasta, o Claude não roda
build e só roda `npm install` se a pasta tiver `package.json` + `package-lock.json`. O login do Canvas depende
do `playwright-core`, que lê arquivos próprios em tempo de execução e não pode ser unido pelo esbuild.

## Decisão

1. O repositório é um marketplace (`.claude-plugin/marketplace.json`) e cada `connectors/<nome>/` é um plugin
   (`.claude-plugin/plugin.json` com `userConfig` + `.mcp.json`), sem `version` fixa: atualizações seguem os
   commits da pasta. Os dois arquivos são **gerados** do `manifest.json` do `.mcpb`, que é a fonte única de nome,
   descrição, comando e campos de configuração.
2. `npm run pack` passa a gerar dentro da pasta do conector o runtime versionado: `server/index.js` (bundle),
   `package.json` e `package-lock.json` só com as dependências externas. O `pr:check` falha se ele estiver
   desatualizado. O mesmo runtime vai para o `.mcpb` (ADR 0007 continua valendo).
3. O `playwright-core` é carregado só quando o login pelo navegador é necessário (`loadPlaywright()`): primeiro
   do `node_modules` (instalado pelo Claude ou pelo `.mcpb`), senão de `~/.canvas-puc/runtime`, instalando lá
   na primeira vez.

## Alternativas consideradas

| Alternativa                                    | Por que não                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Unir o playwright-core no bundle               | Testado: depende de `__dirname`, `package.json` próprio e módulos opcionais. |
| Versionar `node_modules` no repositório        | ~10 MB por versão no histórico do git.                                       |
| Plugin só com token (sem login pelo navegador) | Volta o problema do token de 30 dias da PUC.                                 |
| `version` fixa no `plugin.json`                | Exigiria lembrar de subir a versão a cada mudança, senão ninguém atualiza.   |

## Consequências

- Positivas: instalação e atualização pela interface do Claude; o mesmo bundle serve plugin e `.mcpb`.
- Negativas / custos aceitos: bundle gerado versionado (~780 KB) e PRs maiores quando o código muda; o repo
  privado exige credenciais git funcionando no PC (SSH sem senha ou `gh auth setup-git`).
- O que muda nos docs: ARCHITECTURE (empacotamento), STRUCTURE, PROCESSES (P05, P07), WORKFLOW (`pr:check`),
  READMEs.
