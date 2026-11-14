# Canvas PUC Minas (`canvas-puc`)

Conector MCP que dá ao Claude acesso ao Canvas LMS da PUC Minas: agenda de entregas, tarefas com enunciado e
rubrica, notas, avisos, módulos, páginas, arquivos, fóruns e calendário.

## Instalar

Depois de instalar o plugin, digite **`/setup-canvas`** no chat: o Claude abre a página de tokens do Canvas,
guia a conexão e faz um teste. O passo a passo manual é este:

O conector roda só na nuvem. Nada é instalado no computador ([ADR 0013](../../docs/adr/0013-remote-only-connector-via-marketplace.md)).

1. No Claude (claude.ai, Cowork ou Claude Code), **Adicionar marketplace** → `temponi-bernardo/claude-connectors`.
2. Instale o plugin **canvas-puc**. Ele aponta para `https://canvas-puc-remote.bftemponi.workers.dev/mcp`.
3. Na primeira vez, o Claude abre a página **"Conectar o Canvas ao Claude"**. No Canvas, vá em **Conta →
   Configurações → Novo token de acesso**, copie o token, cole na página e clique em **Conectar**.
4. Pronto: o conector funciona na web, no Cowork, no app do celular e no Claude Code.

No Claude Code, os passos 1 e 2 cabem num comando só:

```text
/plugin install canvas-puc --marketplace temponi-bernardo/claude-connectors
```

O token da PUC vale no máximo 30 dias, mas o conector estende a validade dele sozinho a cada renovação do
acesso (ADR 0011). Só se você ficar mais de 30 dias sem usar o conector (ou revogar o token) as ferramentas
avisam: gere outro token e reconecte o conector nas configurações do Claude.

Segurança: o token do Canvas nunca é gravado no servidor; ele só viaja cifrado dentro dos tokens OAuth.
Qualquer pessoa com um token válido do Canvas pode usar o servidor, mas só acessa a própria conta.

## Comandos do plugin

- **`/setup-canvas`** — configuração guiada (token, conexão e teste).
- **`/weekly-summary`** — entregas, atrasos, avisos e notas da semana.
- **`/prepare-submission`** — enunciado, rubrica, checklist, plano e revisão; envia só com confirmação.
- **`/study-course`** — resumo dos módulos, conceitos, questões de revisão e plano até a prova.

Também dá para pedir em linguagem natural ("o que vence essa semana?"): o Claude usa a skill certa.

## Servidor remoto (mantenedor)

O plugin usa o servidor HTTP com OAuth ([ADR 0009](../../docs/adr/0009-remote-http-oauth-connector.md)),
publicado no Cloudflare Workers ([ADR 0010](../../docs/adr/0010-remote-connector-on-cloudflare-workers.md)).
Também dá para adicioná-lo direto como conector personalizado no claude.ai, com a mesma URL `/mcp`.

**1. Publicar no Cloudflare Workers (plano grátis, [ADR 0010](../../docs/adr/0010-remote-connector-on-cloudflare-workers.md)):**

1. Autentique o `wrangler`: no PC, `npx wrangler login`; na nuvem do Claude Code, um token de API com o modelo
   **"Edit Cloudflare Workers"** na variável `CLOUDFLARE_API_TOKEN` das configurações do ambiente.
2. Uma vez só, grave a chave dos selos como secret do Worker:

   ```bash
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SEAL_KEY --config connectors/canvas-puc/wrangler.toml
   ```

3. Publique (e repita depois de cada merge que mexer no conector):

   ```bash
   npm run worker:deploy
   ```

4. O endereço sai no fim do deploy: `https://canvas-puc-remote.<sua-conta>.workers.dev`.

`wrangler.toml` já liga os envios (`CANVAS_ALLOW_WRITE=true`). O Worker não dorme: responde na hora.
Para testar local antes: `npm run worker:dev` (precisa de `SEAL_KEY`, ex.: `--var SEAL_KEY:<chave>`).

**2. Atualizar o plugin:** se o endereço do Worker mudar, troque a `url` em `plugin/.mcp.json` e rode `npm run build`
(ele recusa servidor que não seja `http` com `https://`).

**Outros hosts (Docker):**

```bash
docker build -t canvas-puc-remote connectors/canvas-puc
```

```bash
docker run -p 8080:8080 -e PUBLIC_URL=https://seu-dominio -e SEAL_KEY=<32 bytes em base64> -e CANVAS_ALLOW_WRITE=true canvas-puc-remote
```

| Variável               | Padrão                             | Para quê                                                         |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `PUBLIC_URL`           | — (no Worker: o próprio endereço)  | Endereço público em https (obrigatório no Docker)                |
| `SEAL_KEY`             | —                                  | Chave dos selos OAuth; trocar desconecta todo mundo              |
| `PORT`                 | `8080`                             | Porta HTTP                                                       |
| `OAUTH_REDIRECT_HOSTS` | `claude.ai,claude.com,localhost`   | Para onde o OAuth pode devolver o acesso                         |
| `CANVAS_BASE_URL`      | `https://pucminas.instructure.com` | Canvas fixo do servidor                                          |
| `CANVAS_ALLOW_WRITE`   | desligado                          | `true` registra `submit_text_assignment` e `reply_to_discussion` |

**Problemas comuns:**

| Sintoma                                     | Causa e solução                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| "O Canvas respondeu 403" na página          | Chamada sem `User-Agent`; o Worker manda `CANVAS_USER_AGENT` desde o PR #13. Publique a versão atual. |
| **Conectar** não faz nada com token válido  | CSP barrando o 302 para o claude.ai; corrigido no PR #14 (`pageSecurityPolicy()`). Publique de novo.  |
| "Configuração do Worker inválida: SEAL_KEY" | Secret ausente ou ainda propagando logo após o `secret put`; espere alguns segundos.                  |

## Ferramentas

| Ferramenta               | Faz                                                                    |
| ------------------------ | ---------------------------------------------------------------------- |
| `whoami`                 | Perfil (teste de conexão)                                              |
| `list_courses`           | Cursos com nota atual                                                  |
| `upcoming_assignments`   | O que vence nos próximos dias, em todos os cursos                      |
| `list_assignments`       | Tarefas de um curso com status (filtros: upcoming, overdue...)         |
| `get_assignment`         | Enunciado, rubrica, prazos e feedback                                  |
| `get_grades`             | Resumo de notas ou notas por tarefa                                    |
| `list_announcements`     | Avisos recentes                                                        |
| `list_modules`           | Módulos e itens                                                        |
| `get_page`               | Conteúdo de uma página                                                 |
| `list_files`             | Arquivos com link de download                                          |
| `read_file_text`         | Conteúdo de arquivos de texto/código, inclusive `.doc` e `.docx`       |
| `download_file`          | Traz PDF, slides ou imagem (até 10 MB) para a conversa                 |
| `list_discussions`       | Fóruns do curso                                                        |
| `get_discussion`         | Postagens de um fórum                                                  |
| `get_calendar`           | Eventos do calendário                                                  |
| `search`                 | Busca em tarefas, páginas, arquivos e módulos                          |
| `submit_text_assignment` | Entrega texto/link (só com envios permitidos; o Claude confirma antes) |
| `reply_to_discussion`    | Responde fórum (só com envios permitidos; o Claude confirma antes)     |

Fluxos internos: [PROCESSES.md](../../docs/PROCESSES.md). Decisão de arquitetura:
[ADR 0013](../../docs/adr/0013-remote-only-connector-via-marketplace.md).
