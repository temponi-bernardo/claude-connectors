# claude-connectors

Conectores MCP para o Claude, empacotados como extensões .mcpb, começando pelo Canvas da PUC Minas.

## Conectores

| Conector                                        | O que faz                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| [`canvas-puc`](connectors/canvas-puc/README.md) | Canvas LMS da PUC Minas: entregas, tarefas, notas, avisos, arquivos |

## Começando

```bash
nvm use                         # Node 22 (.nvmrc)
npm install                     # instala e ativa os git hooks
npm run check                   # formato, lint, tipos, testes, docs, segredos
npm run pack -- canvas-puc      # gera dist/connectors/canvas-puc-<versão>.mcpb
```

Instale o `.mcpb` no Claude Desktop em **Configurações → Extensões → Instalar extensão**.

Requisitos: Node 22, Chrome ou Edge (login dos conectores) e gitleaks (`winget install Gitleaks.Gitleaks`).

## Sem GitHub Actions

Nada roda no GitHub: o portão de PR é `npm run pr:check -- "<título do PR>"` e a release usa a CLI do
release-please localmente ([ADR 0006](docs/adr/0006-sem-github-actions-checagens-locais.md)).

## Documentação

Comece por [`docs/README.md`](docs/README.md). Regras de desenvolvimento em [`CLAUDE.md`](CLAUDE.md).

## Licença

[MIT](LICENSE).
