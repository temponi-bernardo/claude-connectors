# Arquitetura

Repositório de **conectores MCP** para o Claude. Cada conector é um servidor MCP (stdio) independente,
empacotado como extensão `.mcpb` e instalado no Claude Desktop (Configurações → Extensões). Decisão em
[ADR 0007](adr/0007-conectores-como-extensoes-mcpb.md). Um conector pode ter também um **modo remoto**: servidor
HTTP com OAuth para o claude.ai, o Cowork e o celular ([ADR 0009](adr/0009-conector-remoto-http-oauth.md)).

## Camadas

```text
┌───────────────────────────────────────────────┐
│  conector  (connectors/<nome>/src/)            │  entrada (main.ts), tools, cliente da API,
│                                                │  autenticação, formatação das respostas
├───────────────────────────────────────────────┤
│  remote  (src/remote/)                         │  servidor HTTP: OAuth sem estado, página de login,
│                                                │  /mcp sem sessão (só o modo remoto usa)
├───────────────────────────────────────────────┤
│  mcp  (src/mcp/)                               │  definição/registro de ferramentas, resultados
├───────────────────────────────────────────────┤
│  core  (src/core/)                             │  lógica pura compartilhada: decide, não faz
└───────────────────────────────────────────────┘
        tools/  (docs, hooks, pack) — ferramentas do repositório, fora dos pacotes
```

Dentro de um conector, a mesma regra vale em escala menor: funções puras (`config`, `format`, `helpers`,
partes de `session`/`auth`) separadas das que fazem efeito (`client` → rede, `session` → disco,
`browser-login` → navegador, `main` → stdio, `remote-main` → HTTP).

## Regras de dependência (quem pode importar quem)

| De ↓ / Para → | core | mcp | remote | conector (o próprio) | outro conector | tools |
| ------------- | ---- | --- | ------ | -------------------- | -------------- | ----- |
| **core**      | ✅   | ❌  | ❌     | ❌                   | ❌             | ❌    |
| **mcp**       | ✅   | ✅  | ❌     | ❌                   | ❌             | ❌    |
| **remote**    | ✅   | ❌  | ✅     | ❌                   | ❌             | ❌    |
| **conector**  | ✅   | ✅  | ✅     | ✅                   | ❌             | ❌    |
| **tools**     | ✅   | ❌  | ❌     | ❌                   | ❌             | ✅    |

- Conectores **não** importam uns dos outros: lógica usada por dois conectores sobe para `src/core/` ou `src/mcp/`.
- `remote` não conhece conector nenhum: recebe um `RemoteConnector` (textos da página, verificação da credencial e
  fábrica de `McpServer`). Usa `node:crypto` e `node:http`, por isso não está em `core`.
- `core` nunca importa Node (`node:fs`, `node:http`) nem bibliotecas com efeito; testes de `core` não usam mocks.

## Fluxo de dados

O Claude chama uma ferramenta → `src/mcp` valida os argumentos (zod) → a ferramenta do conector usa o cliente
da API → o cliente autentica e pagina → as respostas são reduzidas a objetos enxutos em português → o
resultado volta como texto JSON. Detalhe em [PROCESSES.md](PROCESSES.md) (P03–P05).

## Empacotamento e instalação

`npm run pack:all` (P05) une o código de cada conector num único `connectors/<nome>/server/index.js` com o
esbuild e grava ao lado um `package.json`/`package-lock.json` só com o que não pode ser unido
(`RUNTIME_EXTERNALS`, hoje `playwright-core`). Esse runtime é versionado e serve a dois formatos:

| Formato                  | Como instala                                                        | Decisão  |
| ------------------------ | ------------------------------------------------------------------- | -------- |
| Plugin do marketplace    | Claude → Adicionar marketplace `temponi-bernardo/claude-connectors` | ADR 0008 |
| Extensão `.mcpb` (~3 MB) | Claude Desktop → Configurações → Extensões → Instalar extensão      | ADR 0007 |
| Conector remoto (HTTP)   | `npm run worker:deploy` (Cloudflare Workers) e adicionar a URL      | ADR 0010 |

O `playwright-core` só é carregado quando o login pelo navegador é necessário (`loadPlaywright()`).

## Serviços externos

| Serviço                   | Usado para                        | Onde está o adaptador                                  | Segredo                                                          |
| ------------------------- | --------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| API REST do Canvas LMS    | Cursos, tarefas, notas, avisos... | `connectors/canvas-puc/src/client.ts`                  | Sessão em `~/.canvas-puc/session.json` (fora do repo)            |
| Login SSO da instituição  | Obter a sessão do Canvas          | `connectors/canvas-puc/src/browser-login.ts`           | Perfil do navegador em `~/.canvas-puc/browser-profile`           |
| Token de acesso do Canvas | Reserva se o login falhar         | `connectors/canvas-puc/src/auth.ts`                    | `CANVAS_API_TOKEN` (campo sensível da extensão)                  |
| Token de acesso (remoto)  | Única credencial do modo remoto   | `connectors/canvas-puc/src/remote.ts`                  | Só selado nos tokens OAuth (`SEAL_KEY` no servidor)              |
| Cloudflare Workers        | Rodar o conector remoto           | `connectors/canvas-puc/src/worker.ts`, `wrangler.toml` | `SEAL_KEY` (secret do Worker); deploy com `CLOUDFLARE_API_TOKEN` |

Nada de credencial no repositório: a configuração vem do formulário da extensão (variáveis de ambiente) e a
sessão fica na pasta do usuário.

## Dependências de runtime

| Pacote                      | Para quê                                                          |
| --------------------------- | ----------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | Servidor MCP em stdio e em Streamable HTTP (modo remoto)          |
| `zod` (v3)                  | Esquemas de entrada das ferramentas                               |
| `playwright-core`           | Controlar o Chrome/Edge instalado no login (sem baixar navegador) |

Dev: `esbuild` (bundle), `@anthropic-ai/mcpb` (gera o `.mcpb`) e `wrangler` (Worker remoto, ADR 0010), além
das ferramentas do template.

## Ferramentas internas (`tools/`)

`tools/docs/` é o verificador/gerador de documentação, `tools/hooks/` testa os hooks do Claude Code e
`tools/pack/` empacota os conectores. Seguem as mesmas regras do código de produto (documentação, testes,
lint), mas não entram nos pacotes.

## Decisões

Histórico e justificativas em [adr/README.md](adr/README.md).
