# Glossário

**ADR** — Architecture Decision Record; registro curto de uma decisão de arquitetura, seu contexto e
consequências. Vive em `docs/adr/`.

**Bloco gerado** — Trecho de FUNCTIONS.md entre `<!-- gerado:inicio -->` e `<!-- gerado:fim -->`, escrito
por `npm run docs:generate` a partir do código.

**Campos manuais** — Faz, Entrada, Saída, Efeitos e Erros de cada função em FUNCTIONS.md; escritos à mão.

**Check** — `npm run check`: formato, lint, tipos, testes com cobertura, docs, duplicação e segredos. O
portão completo de PR é o `pr:check` (não há CI, ADR 0006).

**Conector** — Servidor MCP remoto de um serviço externo (ex.: Canvas), numa pasta de `connectors/`, com
o plugin do marketplace que aponta para ele e as ferramentas para o Claude.

**Core** — Camada de lógica pura (`src/core/`): decide, não faz.

**Conventional Commits** — Formato `tipo(escopo): descrição` das mensagens de commit e títulos de PR.

**Decidir vs. fazer** — Separação entre funções puras (decidir) e funções com efeito (fazer).

**docs:check** — Verificador que falha quando documentação e código divergem.

**Exceção de teste** — Entrada em `src/test-exceptions.ts` que isenta uma função de teste automatizado,
com motivo e teste manual.

**Fase / Tarefa (F1.2)** — Unidades do ROADMAP.md: fase agrupa tarefas; `F<fase>.<n>` identifica uma.

**Índice de referências** — Mapa função → quem a chama ou passa como valor, calculado por AST; vira o campo
"Usada por".

**Inventário** — Tudo o que o `docs:check` extrai do repositório antes de comparar com os docs.

**MVP** — Conjunto mínimo de fases que entrega valor real; definido no ROADMAP.md.

**Processo (P01)** — Fluxo de ponta a ponta descrito em PROCESSES.md.

**Registro de funções** — Lista de funções de topo (`function nome`) encontradas no código.

**Marketplace de plugins** — Repositório com `.claude-plugin/marketplace.json` de onde o Claude instala
plugins; aqui, cada conector é um plugin.

**pr:check** — `npm run pr:check -- "<título>"`: o portão local de PR que substitui o CI (check, build
dos conectores, commitlint dos commits e do título).

**Release-please** — Ferramenta que gera PR de release, versão e changelog a partir dos commits; aqui roda pela CLI local.

**Skill** — Procedimento reutilizável do Claude Code em `.claude/skills/<nome>/SKILL.md`, invocado como
`/nome`.

**Squash merge** — Merge que condensa a branch em um commit na `main`; o título do PR vira a mensagem.

**Conector remoto** — Modo de um conector servido por HTTP (`server/remote.js`) e adicionado no claude.ai como
conector personalizado; autoriza por OAuth e funciona na web, no Cowork e no celular (ADR 0009).

**Ponte (WhatsApp)** — Servidor Go com whatsmeow dentro do container (`connectors/whatsapp/bridge/`), com API HTTP
interna protegida por `BRIDGE_TOKEN`; o Worker fala com ela pelo Durable Object `WhatsAppBridge`.

**Pareamento** — Vincular o número ao conector como "aparelho conectado" do WhatsApp, por código (PairPhone) ou
QR, na página `/pair`.

**Login delegado (upstream)** — Variante do OAuth do conector remoto em que o `/authorize` manda o navegador a um
provedor de identidade (GitHub) e o segredo selado é o e-mail aceito em `ALLOWED_EMAILS`.

**Snapshot (WhatsApp)** — Cópia cifrada (formato `WAS1`, AES-256-GCM) da sessão e do banco de mensagens da ponte,
guardada no R2 e restaurada quando o container acorda.

**Selo** — Texto cifrado e autenticado (AES-256-GCM, chave `SEAL_KEY`) que carrega `client_id`, código e tokens
do OAuth sem estado; só o servidor abre e ninguém altera.

**Template** — `template-new-project`, repositório de origem desta estrutura (docs, checagens, skills).
