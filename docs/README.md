# Documentação — índice

A documentação é a fonte da verdade deste repositório: uma sessão nova do Claude Code (ou uma pessoa nova)
deve encontrar tudo aqui, sem varrer o código. Quando docs e código divergem, `npm run docs:check` falha.

## Quero... → leia...

| Quero...                                                      | Leia...                                                  |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| Entender o que o projeto é, para quem e como ganha dinheiro   | [PRODUCT.md](PRODUCT.md)                                 |
| Retomar o que a sessão anterior deixou                        | [STATE.md](STATE.md) (handoff local, injetado no início) |
| Saber o que fazer agora                                       | [ROADMAP.md](ROADMAP.md) — seção "Próxima tarefa"        |
| Saber onde cada coisa fica e onde colocar algo novo           | [STRUCTURE.md](STRUCTURE.md)                             |
| Saber como o sistema é dividido e quem pode importar quem     | [ARCHITECTURE.md](ARCHITECTURE.md)                       |
| Entender um fluxo de ponta a ponta                            | [PROCESSES.md](PROCESSES.md)                             |
| Saber o que uma função faz, quem a usa, o que ela pode lançar | [FUNCTIONS.md](FUNCTIONS.md)                             |
| Escrever código no padrão do projeto                          | [CODING-STANDARDS.md](CODING-STANDARDS.md)               |
| Escrever ou corrigir testes                                   | [TESTING.md](TESTING.md)                                 |
| Criar branch, commit, PR, release                             | [WORKFLOW.md](WORKFLOW.md)                               |
| Saber qual doc atualizar depois de uma mudança                | [DOCUMENTATION.md](DOCUMENTATION.md)                     |
| Entender ou registrar uma decisão de arquitetura              | [adr/README.md](adr/README.md)                           |
| Saber o significado de um termo                               | [GLOSSARY.md](GLOSSARY.md)                               |
| Mexer na interface (se o projeto tiver)                       | [UI.md](UI.md)                                           |
| Saber como reportar uma vulnerabilidade                       | [../SECURITY.md](../SECURITY.md)                         |

## Quem confere o quê

| Regra                                                                     | Máquina (comando)                        | Checklist do PR                                 |
| ------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Toda função documentada em FUNCTIONS.md, no módulo certo                  | `docs:check`                             | —                                               |
| Blocos gerados (Arquivo, Assinatura, Usada por, Processos) em dia         | `docs:check` (`docs:generate` corrige)   | —                                               |
| Campos manuais preenchidos (Faz, Entrada, Saída, Efeitos, Erros)          | `docs:check` (detecta só o marcador)     | Conteúdo correto e útil                         |
| Nomes de função únicos no repositório                                     | `docs:check`                             | —                                               |
| Função citada em PROCESSES.md existe                                      | `docs:check`                             | Passos do processo refletem o código            |
| Toda pasta versionada em STRUCTURE.md                                     | `docs:check`                             | Descrição da pasta faz sentido                  |
| Todo componente de UI em UI.md                                            | `docs:check` (se `uiDir` configurado)    | Estados e variantes documentados                |
| Toda função tem teste (ou exceção justificada)                            | `docs:check`                             | Teste cobre o comportamento, não só o nome      |
| Constante exportada na tabela "Dados e constantes"                        | `docs:check`                             | —                                               |
| Cobertura mínima de 90%                                                   | `test:coverage`                          | —                                               |
| Nenhuma duplicação                                                        | `dup:check` (jscpd)                      | Lógica parecida sem ser idêntica foi unificada? |
| Funções ≤ 25 linhas, ≤ 3 parâmetros, complexidade ≤ 8, `function` no topo | `lint` (ESLint)                          | Função faz um único trabalho?                   |
| Tipos estritos                                                            | `typecheck`                              | —                                               |
| Formatação                                                                | `format` (Prettier)                      | —                                               |
| Segredos                                                                  | `secrets:check` (gitleaks, obrigatório)  | —                                               |
| Conventional Commits                                                      | hook `commit-msg` e título no `pr:check` | Escopo certo?                                   |
| Nada direto na `main`                                                     | Branch protection no GitHub              | —                                               |
| ROADMAP, CHANGELOG, PRODUCT, ARCHITECTURE, ADRs atualizados               | —                                        | Checklist do template de PR                     |
| Skills atualizadas                                                        | —                                        | Checklist do template de PR                     |
