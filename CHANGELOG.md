# Changelog

Todas as mudanças relevantes ficam aqui. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [SemVer](https://semver.org/lang/pt-BR/). As seções de versão são geradas pelo release-please
(CLI local, ADR 0006) a partir dos commits; a seção "Não lançado" é mantida à mão.

## [Não lançado]

### Adicionado

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

- GitHub Actions (CI, CodeQL, release-please em workflow): checagens e release rodam localmente, sem custo.
