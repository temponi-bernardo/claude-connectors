# Changelog

Todas as mudanças relevantes ficam aqui. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [SemVer](https://semver.org/lang/pt-BR/). As seções de versão são geradas pelo release-please
(CLI local, ADR 0006) a partir dos commits; a seção "Não lançado" é mantida à mão.

## [0.1.0](https://github.com/temponi-bernardo/claude-connectors/compare/v0.1.0...v0.1.0) (2026-11-14)


### ⚠ BREAKING CHANGES

* **tools:** quem usava a extensão .mcpb ou o plugin local precisa reinstalar pelo marketplace e entrar com um token do Canvas.
* **canvas:** quem usava a extensão .mcpb ou o plugin local precisa reinstalar pelo marketplace e entrar com um token do Canvas.

* **tools:** instalar o gitleaks pelo Go nas sessões da nuvem ([#26](https://github.com/temponi-bernardo/claude-connectors/issues/26)) ([9ec5d71](https://github.com/temponi-bernardo/claude-connectors/commit/9ec5d713943ad5a78e28816e6339605e3bfc3502))


### Adicionado

* **canvas:** baixar arquivos e ler .doc/.docx ([#19](https://github.com/temponi-bernardo/claude-connectors/issues/19)) ([04a1994](https://github.com/temponi-bernardo/claude-connectors/commit/04a199435d01d2055a158f1be602b258b32e3e0b))
* **canvas:** instalar conectores pelo marketplace de plugins do Claude ([#9](https://github.com/temponi-bernardo/claude-connectors/issues/9)) ([5c7fb83](https://github.com/temponi-bernardo/claude-connectors/commit/5c7fb83eb5804f3860032c13ab7d4e224c850c2c))
* **canvas:** remover o modo local e instalar só pelo marketplace na nuvem ([#23](https://github.com/temponi-bernardo/claude-connectors/issues/23)) ([5113c24](https://github.com/temponi-bernardo/claude-connectors/commit/5113c241e7e83b6406e6c884d2afa8a25f365aff))
* **gmail:** adicionar conector Gmail remoto multi-conta só leitura no Workers ([#25](https://github.com/temponi-bernardo/claude-connectors/issues/25)) ([372a068](https://github.com/temponi-bernardo/claude-connectors/commit/372a068f88e9ca0df15a130de40fa02dced8275d))
* **gmail:** tornar o conector Gmail público e multiusuário ([#28](https://github.com/temponi-bernardo/claude-connectors/issues/28)) ([8b2a53a](https://github.com/temponi-bernardo/claude-connectors/commit/8b2a53ac5c5608b04f422388b09e7cf0d535a3d2))
* **remote:** adicionar conector Canvas remoto com OAuth para a nuvem ([#11](https://github.com/temponi-bernardo/claude-connectors/issues/11)) ([e8f545c](https://github.com/temponi-bernardo/claude-connectors/commit/e8f545c4a87de0b298c5723a1dedc906a8bbbb46))
* **remote:** publicar o conector Canvas remoto no Cloudflare Workers ([#12](https://github.com/temponi-bernardo/claude-connectors/issues/12)) ([75b6a00](https://github.com/temponi-bernardo/claude-connectors/commit/75b6a009f02c73acc219704e876f895daa0ddd65))
* **remote:** renovar sozinho a validade do token do Canvas no refresh do OAuth ([#18](https://github.com/temponi-bernardo/claude-connectors/issues/18)) ([14aefc1](https://github.com/temponi-bernardo/claude-connectors/commit/14aefc1f0e5afe60dfb46219a95d93de3c0151d1))
* **site:** publicar página do serviço no GitHub Pages ([#22](https://github.com/temponi-bernardo/claude-connectors/issues/22)) ([8e66f69](https://github.com/temponi-bernardo/claude-connectors/commit/8e66f69bb195dd34f81874d9bd87aa17f1a77b09))
* **whatsapp:** adicionar conector WhatsApp pessoal remoto (Workers + Containers) ([#27](https://github.com/temponi-bernardo/claude-connectors/issues/27)) ([4a711d4](https://github.com/temponi-bernardo/claude-connectors/commit/4a711d4a413fac2671b392db5578343770bdd36d))


### Corrigido

* **canvas:** usar o proxy do ambiente no plugin para funcionar na nuvem ([#20](https://github.com/temponi-bernardo/claude-connectors/issues/20)) ([2ceb4fa](https://github.com/temponi-bernardo/claude-connectors/commit/2ceb4fa8f5ed004aac48a37f38cceb83f3d90dd3))
* **remote:** enviar User-Agent nas chamadas ao Canvas pelo Worker ([#13](https://github.com/temponi-bernardo/claude-connectors/issues/13)) ([2594501](https://github.com/temponi-bernardo/claude-connectors/commit/259450127f624d63f358cc9db69961b62493c3f2))
* **remote:** liberar o retorno do OAuth no form-action da página de login ([#14](https://github.com/temponi-bernardo/claude-connectors/issues/14)) ([7c76778](https://github.com/temponi-bernardo/claude-connectors/commit/7c76778fab97f3bb597137772681b5099dc4cabd))

## [Não lançado]

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
