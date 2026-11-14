# Arquitetura

Repositório de **conectores MCP remotos** para o Claude. Cada conector é um servidor HTTP com OAuth hospedado na
nuvem (Cloudflare Workers, [ADR 0010](adr/0010-conector-remoto-no-cloudflare-workers.md)) e publicado como plugin
do marketplace deste repositório: o plugin só aponta para a URL do servidor. Nada roda no computador de quem
instala ([ADR 0013](adr/0013-conector-so-remoto-pelo-marketplace.md)). O conector **Gmail**
(`connectors/gmail/`) segue o mesmo modelo, com OAuth da biblioteca `@cloudflare/workers-oauth-provider` e estado
no Workers KV ([ADR 0014](adr/0014-gmail-remoto-sob-demanda-no-workers.md)). O conector **WhatsApp**
(`connectors/whatsapp/`) é um template self-host: Worker + Durable Object + container com uma ponte em Go, sob
demanda, com login do dono pelo GitHub ([ADR 0015](adr/0015-whatsapp-no-cloudflare-containers.md)).

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
- No WhatsApp, `config`, `format`, `pair-page` e os planos (`planSend()`) são puros; `lifecycle`, `snapshots`, `pair`
  e `tools` fazem efeito por portas injetadas (testáveis com fakes) e só `container.ts`/`index.ts` tocam o runtime.
- `src/core/` também guarda leitores de formato usados por mais de um conector (Word, ZIP, PDF).
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

| Serviço                    | Usado para                                 | Onde está o adaptador                                  | Segredo                                                          |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------- |
| API REST do Canvas LMS     | Cursos, tarefas, notas, avisos...          | `connectors/canvas-puc/src/client.ts`                  | Token do usuário, só selado nos tokens OAuth                     |
| Token de acesso do Canvas  | Única credencial do conector               | `connectors/canvas-puc/src/remote.ts`                  | Só selado nos tokens OAuth (`SEAL_KEY` no servidor)              |
| Cloudflare Workers         | Rodar o conector remoto                    | `connectors/canvas-puc/src/worker.ts`, `wrangler.toml` | `SEAL_KEY` (secret do Worker); deploy com `CLOUDFLARE_API_TOKEN` |
| GitHub Pages               | Site público (início, privacidade, termos) | `docs/_config.yml`, `docs/_layouts/site.html`          | Nenhum (ADR 0012)                                                |
| Google OAuth / OIDC        | Login do dono e vínculo de contas          | `connectors/gmail/src/google-oauth.ts`, `id-token.ts`  | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (secrets do Worker)   |
| Gmail API (só leitura)     | Buscar e ler e-mails e anexos              | `connectors/gmail/src/gmail-api.ts`                    | Refresh token selado no KV com `TOKEN_ENC_KEY`                   |
| Workers KV / rate limit    | Grants OAuth, contas e limite (Gmail)      | `connectors/gmail/src/worker.ts`, `wrangler.toml`      | `CONSENT_SECRET`, `ALLOWED_EMAILS` (secrets do Worker)           |
| GitHub OAuth App           | Login do dono (WhatsApp)                   | `src/remote/github-login.ts`                           | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_EMAILS`     |
| Cloudflare Containers + DO | Ponte do WhatsApp sob demanda              | `connectors/whatsapp/src/container.ts`, `lifecycle.ts` | `BRIDGE_TOKEN` (Worker ↔ ponte)                                  |
| Cloudflare R2              | Backup cifrado da sessão (WhatsApp)        | `connectors/whatsapp/src/snapshots.ts`                 | `SNAPSHOT_KEY` (só no container)                                 |
| WhatsApp (whatsmeow)       | Mensagens do número pareado                | `connectors/whatsapp/bridge/` (Go)                     | Sessão do aparelho, dentro do snapshot                           |

Nada de credencial no repositório nem no servidor: o token do Canvas só existe selado (AES-GCM com a `SEAL_KEY`)
dentro dos tokens OAuth que o Claude guarda.

## Dependências de runtime

| Pacote                               | Para quê                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| `@modelcontextprotocol/sdk`          | Servidor MCP em Streamable HTTP                            |
| `zod` (v3)                           | Esquemas de entrada das ferramentas                        |
| `@cloudflare/workers-oauth-provider` | OAuth 2.1 do conector Gmail (DCR, PKCE, consentimento, KV) |
| `@cloudflare/containers`             | Classe `Container` do Durable Object da ponte do WhatsApp  |

A ponte do WhatsApp é um módulo Go à parte (`connectors/whatsapp/bridge/go.mod`: whatsmeow, SQLite), com licenças
em `connectors/whatsapp/NOTICE.md` (atenção: `go.mau.fi/libsignal` é GPL-3.0).

Dev: `esbuild` (bundle do Dockerfile) e `wrangler` (Worker, ADR 0010), além
das ferramentas do template.

## Ferramentas internas (`tools/`)

`tools/docs/` é o verificador/gerador de documentação, `tools/hooks/` testa os hooks do Claude Code e
`tools/bundle/` confere os plugins e gera o bundle do servidor. Seguem as mesmas regras do código de produto (documentação, testes,
lint), mas não entram no servidor.

## Decisões

Histórico e justificativas em [adr/README.md](adr/README.md).
