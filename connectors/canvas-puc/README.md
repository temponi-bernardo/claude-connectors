# Canvas PUC Minas (`canvas-puc`)

Conector MCP que dá ao Claude acesso ao Canvas LMS da PUC Minas: agenda de entregas, tarefas com enunciado e
rubrica, notas, avisos, módulos, páginas, arquivos, fóruns e calendário.

## Instalar

**Como plugin (recomendado):**

1. No Claude, **Adicionar marketplace** → `temponi-bernardo/claude-connectors`.
2. Instale o plugin **canvas-puc** e preencha o formulário: endereço (já vem preenchido), "Permitir envios" e
   token (pode ficar em branco).
3. O Claude instala o `playwright-core` sozinho; as atualizações chegam quando o marketplace é atualizado.

**Como extensão `.mcpb`:** `npm run pack -- canvas-puc` e instale `dist/connectors/canvas-puc-<versão>.mcpb`
em **Configurações → Extensões → Instalar extensão**.

Use só um dos dois para não ter as ferramentas duplicadas.

## Login

Na primeira vez, peça ao Claude para usar `conectar_canvas` (ou qualquer ferramenta: sem sessão ela abre a
janela sozinha). Uma janela do Chrome abre, num perfil só do conector:

1. O botão **"Aluno / Professor (@pucminas.edu.br)"** é clicado sozinho.
2. Entre com a conta **`<matrícula>@pucminas.edu.br`** (não o e-mail `@sga.pucminas.br`, que dá erro
   AADSTS50020) e marque **"Manter conectado"**.
3. A janela fecha sozinha. A sessão fica em `~/.canvas-puc/` e é renovada em segundo plano quando expira.

## Configuração (variáveis de ambiente)

| Variável              | Padrão                             | Para quê                                                        |
| --------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `CANVAS_BASE_URL`     | `https://pucminas.instructure.com` | Endereço do Canvas                                              |
| `CANVAS_ALLOW_WRITE`  | desligado                          | `true` registra `entregar_tarefa_texto` e `responder_discussao` |
| `CANVAS_API_TOKEN`    | —                                  | Reserva caso o login pelo navegador falhe                       |
| `CANVAS_LOGIN_BUTTON` | `pucminas.edu.br`                  | Texto do botão da instituição na tela de login                  |
| `CANVAS_DATA_DIR`     | `~/.canvas-puc`                    | Onde ficam a sessão e o perfil do navegador                     |

## Ferramentas

| Ferramenta              | Faz                                                                    |
| ----------------------- | ---------------------------------------------------------------------- |
| `conectar_canvas`       | Login pela janela do navegador                                         |
| `desconectar_canvas`    | Apaga a sessão salva                                                   |
| `quem_sou_eu`           | Perfil (teste de conexão)                                              |
| `listar_cursos`         | Cursos com nota atual                                                  |
| `proximas_entregas`     | O que vence nos próximos dias, em todos os cursos                      |
| `listar_tarefas`        | Tarefas de um curso com status (filtros: futuras, atrasadas...)        |
| `ver_tarefa`            | Enunciado, rubrica, prazos e feedback                                  |
| `notas`                 | Resumo de notas ou notas por tarefa                                    |
| `avisos`                | Avisos recentes                                                        |
| `modulos`               | Módulos e itens                                                        |
| `ver_pagina`            | Conteúdo de uma página                                                 |
| `arquivos`              | Arquivos com link de download                                          |
| `ler_arquivo_texto`     | Conteúdo de arquivos de texto/código                                   |
| `discussoes`            | Fóruns do curso                                                        |
| `ver_discussao`         | Postagens de um fórum                                                  |
| `calendario`            | Eventos do calendário                                                  |
| `buscar`                | Busca em tarefas, páginas, arquivos e módulos                          |
| `entregar_tarefa_texto` | Entrega texto/link (só com envios permitidos; o Claude confirma antes) |
| `responder_discussao`   | Responde fórum (só com envios permitidos; o Claude confirma antes)     |

Fluxos internos: [P03, P04 e P05 em PROCESSES.md](../../docs/PROCESSES.md). Decisão de arquitetura:
[ADR 0007](../../docs/adr/0007-conectores-como-extensoes-mcpb.md).
