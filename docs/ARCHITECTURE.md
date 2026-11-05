# Arquitetura

Repositório de **conectores MCP** para o Claude. Cada conector é um servidor MCP (stdio) independente,
empacotado como extensão `.mcpb` e instalado no Claude Desktop (Configurações → Extensões). Decisão em
[ADR 0007](adr/0007-conectores-como-extensoes-mcpb.md).

## Camadas

```text
┌───────────────────────────────────────────────┐
│  conector  (connectors/<nome>/src/)            │  entrada (main.ts), tools, cliente da API,
│                                                │  autenticação, formatação das respostas
├───────────────────────────────────────────────┤
│  mcp  (src/mcp/)                               │  definição/registro de ferramentas, resultados
├───────────────────────────────────────────────┤
│  core  (src/core/)                             │  lógica pura compartilhada: decide, não faz
└───────────────────────────────────────────────┘
        tools/  (docs, hooks, pack) — ferramentas do repositório, fora dos pacotes
```

Dentro de um conector, a mesma regra vale em escala menor: funções puras (`config`, `format`, `helpers`,
partes de `session`/`auth`) separadas das que fazem efeito (`client` → rede, `session` → disco,
`browser-login` → navegador, `main` → stdio).

## Regras de dependência (quem pode importar quem)

| De ↓ / Para → | core | mcp | conector (o próprio) | outro conector | tools |
| ------------- | ---- | --- | -------------------- | -------------- | ----- |
| **core**      | ✅   | ❌  | ❌                   | ❌             | ❌    |
| **mcp**       | ✅   | ✅  | ❌                   | ❌             | ❌    |
| **conector**  | ✅   | ✅  | ✅                   | ❌             | ❌    |
| **tools**     | ✅   | ❌  | ❌                   | ❌             | ✅    |

- Conectores **não** importam uns dos outros: lógica usada por dois conectores sobe para `src/core/` ou `src/mcp/`.
- `core` nunca importa Node (`node:fs`, `node:http`) nem bibliotecas com efeito; testes de `core` não usam mocks.

## Fluxo de dados

O Claude chama uma ferramenta → `src/mcp` valida os argumentos (zod) → a ferramenta do conector usa o cliente
da API → o cliente autentica e pagina → as respostas são reduzidas a objetos enxutos em português → o
resultado volta como texto JSON. Detalhe em [PROCESSES.md](PROCESSES.md) (P03–P05).

## Empacotamento

`npm run pack:all` (P05) une o código de cada conector num único `server/index.js` com o esbuild. Só o que
não pode ser unido (`RUNTIME_EXTERNALS`, hoje `playwright-core`) vai em `node_modules` dentro do pacote.
Resultado: `dist/connectors/<nome>-<versão>.mcpb` (o do Canvas tem ~3 MB).

## Serviços externos

| Serviço                   | Usado para                        | Onde está o adaptador                        | Segredo                                                |
| ------------------------- | --------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| API REST do Canvas LMS    | Cursos, tarefas, notas, avisos... | `connectors/canvas-puc/src/client.ts`        | Sessão em `~/.canvas-puc/session.json` (fora do repo)  |
| Login SSO da instituição  | Obter a sessão do Canvas          | `connectors/canvas-puc/src/browser-login.ts` | Perfil do navegador em `~/.canvas-puc/browser-profile` |
| Token de acesso do Canvas | Reserva se o login falhar         | `connectors/canvas-puc/src/auth.ts`          | `CANVAS_API_TOKEN` (campo sensível da extensão)        |

Nada de credencial no repositório: a configuração vem do formulário da extensão (variáveis de ambiente) e a
sessão fica na pasta do usuário.

## Dependências de runtime

| Pacote                      | Para quê                                                          |
| --------------------------- | ----------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | Servidor MCP em stdio                                             |
| `zod` (v3)                  | Esquemas de entrada das ferramentas                               |
| `playwright-core`           | Controlar o Chrome/Edge instalado no login (sem baixar navegador) |

Dev: `esbuild` (bundle) e `@anthropic-ai/mcpb` (gera o `.mcpb`), além das ferramentas do template.

## Ferramentas internas (`tools/`)

`tools/docs/` é o verificador/gerador de documentação, `tools/hooks/` testa os hooks do Claude Code e
`tools/pack/` empacota os conectores. Seguem as mesmas regras do código de produto (documentação, testes,
lint), mas não entram nos pacotes.

## Decisões

Histórico e justificativas em [adr/README.md](adr/README.md).
