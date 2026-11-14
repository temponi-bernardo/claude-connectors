# claude-connectors

Conectores MCP para o Claude, que rodam na nuvem e se instalam pelo marketplace de plugins, começando pelo Canvas da PUC Minas.

## Conectores

| Conector                                        | O que faz                                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [`canvas-puc`](connectors/canvas-puc/README.md) | Canvas LMS da PUC Minas: entregas, tarefas, notas, avisos, arquivos          |
| [`gmail`](connectors/gmail/README.md)           | Gmail multi-conta: ler, enviar, responder, encaminhar, rascunhos e organizar |

## Instalar no Claude

No Claude (claude.ai, Cowork ou Claude Code), **Adicionar marketplace** → `temponi-bernardo/claude-connectors`
e instale o plugin desejado. Nada é instalado no computador: o plugin aponta para o servidor remoto do
conector, e o login acontece na primeira vez, numa página de OAuth ([ADR 0013](docs/adr/0013-remote-only-connector-via-marketplace.md)).

## Desenvolver

```bash
nvm use            # Node 22 (.nvmrc)
npm install        # instala e ativa os git hooks
npm run check      # formato, lint, tipos, testes, docs, segredos
npm run build      # valida o plugin (só remoto) e gera server/remote.js
npm run worker:deploy   # publica o servidor remoto no Cloudflare Workers
```

Requisitos: Node 22 e gitleaks (`winget install Gitleaks.Gitleaks`; na nuvem do Claude Code ele é instalado
sozinho pelo Go, com `scripts/install-gitleaks.sh`).

## Site

Página pública do serviço, política de privacidade e termos: <https://temponi-bernardo.github.io/claude-connectors/>
(GitHub Pages servido de `docs/`, ADR 0012).

## Sem GitHub Actions

Nada roda no GitHub: o portão de PR é `npm run pr:check -- "<título do PR>"` e a release usa a CLI do
release-please localmente ([ADR 0006](docs/adr/0006-no-github-actions-local-checks.md)).

## Documentação

Comece por [`docs/README.md`](docs/README.md). Regras de desenvolvimento em [`CLAUDE.md`](CLAUDE.md).

## Licença

[MIT](LICENSE).
