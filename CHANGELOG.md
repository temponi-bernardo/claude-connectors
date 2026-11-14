# Changelog

Todas as mudanças relevantes ficam aqui. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [SemVer](https://semver.org/lang/pt-BR/). As seções de versão são geradas pelo release-please
(CLI local, ADR 0006) a partir dos commits; a seção "Não lançado" é mantida à mão.

## [Não lançado]

### Adicionado

- Comandos **`/config-canvas`**, **`/config-gmail`** e **`/config-whatsapp`** (skills dos plugins): configuração
  guiada de cada conector no chat, com conexão, login pelo navegador, vínculo de contas ou pareamento e um teste.
- Skills de uso nos plugins: Canvas (`/resumo-semana`, `/preparar-entrega`, `/estudar-disciplina`), Gmail
  (`/triagem-email`, `/achar-documento`, `/resumir-conversa`) e WhatsApp (`/resumo-whatsapp`,
  `/pendencias-whatsapp`, `/buscar-whatsapp`). Funcionam no chat, no Cowork e no Claude Code.

### Adicionado

- Hook `SessionEnd` (`session-end-handoff.sh`): no `/clear` ou fim de sessão sem handoff, gera o `docs/STATE.md`
  via `claude -p` se houve edição ou commit depois do último handoff (ADR 0017).

## [0.1.0](https://github.com/temponi-bernardo/claude-connectors/releases/tag/v0.1.0) (2026-11-14)

### Alterado

- Canvas (v2.0.0): o conector roda só na nuvem. O plugin do marketplace aponta para o servidor remoto
  (`https://canvas-puc-remote.bftemponi.workers.dev/mcp`) e o login é pela página de OAuth, colando o token
  do Canvas uma vez. Funciona igual no claude.ai, no Cowork, no celular e no Claude Code (ADR 0013).
- `npm run pack`/`pack:all` viraram `npm run build`: valida que o `.mcp.json` de cada conector é remoto
  (`http` com `https://`) e gera o `server/remote.js` usado pelo Dockerfile.

### Adicionado

- Conector **WhatsApp pessoal** (`connectors/whatsapp`, template self-host no Cloudflare Workers + Containers,
  ADR 0015): `whatsapp_status`, `list_chats`, `get_messages`, `search_messages`, `search_contacts` e `get_media`;
  envio (`send_message`) atrás de `ENABLE_SEND`, desligado, com allowlist e limite por hora. Container sob demanda
  (dorme após 5 min), sessão em backup cifrado no R2, página `/pair` com código ou QR e login do dono pelo GitHub.
- Conector remoto: login delegado a um provedor de identidade (GitHub com `ALLOWED_EMAILS`), além do login por
  credencial colada (`src/remote/github-login.ts`).
- **Conector Gmail remoto** (`connectors/gmail`, ADR 0014 e ADR 0016): público e multiusuário. Quem instala
  o plugin `gmail` entra com a própria conta Google (já vinculada no login) e só vê as contas que vinculou; mais
  contas entram por um link de uso único (`link_account`) e saem com `unlink_account`, que revoga o acesso no
  Google. Ferramentas de leitura `list_accounts`, `search_threads`, `get_thread`, `get_message`, `list_labels` e
  `get_attachment_text` (PDF, Word, HTML e texto), com `account` (`all` onde faz sentido). OAuth 2.1 com
  `@cloudflare/workers-oauth-provider`, refresh tokens cifrados (AES-256-GCM) no Workers KV, limites de 120
  req/min por sessão e 30 req/min por IP nas rotas públicas. `ALLOWED_EMAILS` opcional para modo privado. Roda
  só sob demanda (`npm run gmail:deploy`).
- Site: a política de privacidade cobre o Gmail, com a declaração de Uso Limitado das APIs do Google.
- `src/core/pdf.ts`: extração de texto de PDF sem dependências (fluxos comprimidos, fluxos de objetos e
  mapas ToUnicode).

- Site público no GitHub Pages (`https://temponi-bernardo.github.io/claude-connectors/`) com página inicial,
  política de privacidade e termos de uso, para usar como link do serviço em produção; o manifesto do Canvas
  aponta para ele (ADR 0013).
- Canvas: o plugin agora funciona nas sessões do Claude Code na nuvem. O `.mcp.json` liga
  `NODE_USE_ENV_PROXY=1`, e o Node passa a usar o proxy do ambiente, que injeta o token do Canvas. Basta
  preencher o campo "Token de acesso" do plugin com qualquer texto (ex.: `proxy`).

- Canvas: ferramenta `baixar_arquivo`, que traz o conteúdo de um arquivo do curso (PDF, slides, imagem; até
  10 MB) para a conversa, no conector local e no remoto.
- Canvas: `ler_arquivo_texto` agora lê também documentos do Word (`.docx` e `.doc` 97-2003), sem dependências
  novas (`src/core/zip.ts`, `src/core/cfb.ts`, `src/core/word.ts`).
- Conector remoto do Canvas renova sozinho a validade do token da PUC a cada refresh do OAuth: não é
  mais preciso reconectar todo mês (ADR 0011).
- Repositório de conectores criado a partir do `template-new-project`: docs como fonte da verdade, checagens
  por AST, TDD, hooks e skills do Claude Code.
- Conector **Canvas PUC Minas** (`connectors/canvas-puc`, v1.3.0): 20 ferramentas (agenda de entregas,
  tarefas, notas, avisos, módulos, páginas, arquivos, fóruns, calendário, busca, entregar tarefa e responder
  fórum).
- Login no Canvas por janela do Chrome/Edge com renovação silenciosa da sessão; token só como reserva.
- `npm run pack` / `pack:all`: empacota cada conector numa extensão `.mcpb` enxuta (bundle esbuild, ~3 MB).
- `npm run pr:check`: portão local de PR no lugar do CI.
- Repositório como **marketplace de plugins** do Claude: cada conector instala por "Adicionar marketplace",
  com formulário de configuração e atualização pelos commits.
- **Conector Canvas remoto** (`server/remote.js`, ADR 0009): servidor HTTP com OAuth para usar o Canvas no
  claude.ai, no Cowork e no celular, autorizando com o token de acesso do Canvas; publicado no Cloudflare Workers
  (`npm run worker:deploy`) ou em qualquer host Docker.

### Corrigido

- Conector Canvas remoto no Cloudflare Workers: as chamadas ao Canvas mandam `User-Agent` (sem ele o Canvas
  respondia 403) e a página de login libera o retorno ao claude.ai na CSP (antes o botão Conectar não fazia nada).

### Removido

- Canvas: toda a parte local. Saíram o servidor stdio (`server/index.js`), a extensão `.mcpb`, o login pelo
  navegador (`playwright-core`, sessão em `~/.canvas-puc/`) e as ferramentas `conectar_canvas` e
  `desconectar_canvas`. Também saiu o formulário de configuração do plugin.
- GitHub Actions (CI, CodeQL, release-please em workflow): checagens e release rodam localmente, sem custo.
