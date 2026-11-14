# Arquitetura

Repositório de **conectores MCP remotos** para o Claude. Cada conector é um servidor HTTP com OAuth hospedado na
nuvem (Cloudflare Workers, [ADR 0010](adr/0010-conector-remoto-no-cloudflare-workers.md)) e publicado como plugin
do marketplace deste repositório: o plugin só aponta para a URL do servidor. Nada roda no computador de quem
instala ([ADR 0013](adr/0013-conector-so-remoto-pelo-marketplace.md)).

## Camadas

```text
┌───────────────────────────────────────────────┐
│  conector  (connectors/<nome>/src/)            │  entrada (worker.ts), tools, cliente da API,
│                                                │  OAuth do serviço, formatação das respostas
├───────────────────────────────────────────────┤
│  remote  (src/remote/)                         │  servidor HTTP: OAuth sem estado, página de login,
│                                                │  /mcp sem sessão
├───────────────────────────────────────────────┤
│  mcp  (src/mcp/)                               │  definição/registro de ferramentas, resultados
├───────────────────────────────────────────────┤
│  core  (src/core/)                             │  lógica pura compartilhada: decide, não faz
└───────────────────────────────────────────────┘
        tools/  (bundle, docs, hooks) — ferramentas do repositório, fora do servidor
```

Dentro de um conector, a mesma regra vale em escala menor: funções puras (`format`, `helpers`, partes de
`remote`) separadas das que fazem efeito (`client` → rede, `worker` → Workers, `remote-main` → HTTP no Node).

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

## Instalação e deploy

| Peça                         | Como chega ao usuário                                                       | Decisão  |
| ---------------------------- | --------------------------------------------------------------------------- | -------- |
| Plugin do marketplace        | Claude → Adicionar marketplace `temponi-bernardo/claude-connectors`         | ADR 0013 |
| Servidor (Cloudflare Worker) | `npm run worker:deploy` compila `src/worker.ts` e publica                   | ADR 0010 |
| Servidor em Node (Docker)    | Alternativa: `npm run build` gera `server/remote.js`, usado pelo Dockerfile | ADR 0009 |

O plugin tem só `.claude-plugin/plugin.json` e `.mcp.json` (servidor `http` com a URL do Worker). `npm run build`
(P05) recusa qualquer `.mcp.json` com servidor local.

## Serviços externos

| Serviço                   | Usado para                                 | Onde está o adaptador                                  | Segredo                                                          |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------- |
| API REST do Canvas LMS    | Cursos, tarefas, notas, avisos...          | `connectors/canvas-puc/src/client.ts`                  | Token do usuário, só selado nos tokens OAuth                     |
| Token de acesso do Canvas | Única credencial do conector               | `connectors/canvas-puc/src/remote.ts`                  | Só selado nos tokens OAuth (`SEAL_KEY` no servidor)              |
| Cloudflare Workers        | Rodar o conector remoto                    | `connectors/canvas-puc/src/worker.ts`, `wrangler.toml` | `SEAL_KEY` (secret do Worker); deploy com `CLOUDFLARE_API_TOKEN` |
| GitHub Pages              | Site público (início, privacidade, termos) | `docs/_config.yml`, `docs/_layouts/site.html`          | Nenhum (ADR 0012)                                                |

Nada de credencial no repositório nem no servidor: o token do Canvas só existe selado (AES-GCM com a `SEAL_KEY`)
dentro dos tokens OAuth que o Claude guarda.

## Dependências de runtime

| Pacote                      | Para quê                            |
| --------------------------- | ----------------------------------- |
| `@modelcontextprotocol/sdk` | Servidor MCP em Streamable HTTP     |
| `zod` (v3)                  | Esquemas de entrada das ferramentas |

Dev: `esbuild` (bundle do Dockerfile) e `wrangler` (Worker, ADR 0010), além
das ferramentas do template.

## Ferramentas internas (`tools/`)

`tools/docs/` é o verificador/gerador de documentação, `tools/hooks/` testa os hooks do Claude Code e
`tools/bundle/` confere os plugins e gera o bundle do servidor. Seguem as mesmas regras do código de produto (documentação, testes,
lint), mas não entram no servidor.

## Decisões

Histórico e justificativas em [adr/README.md](adr/README.md).
