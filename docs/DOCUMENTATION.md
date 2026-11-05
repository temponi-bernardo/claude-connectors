# Guia de documentação

Todo PR que mexe em código atualiza a documentação **no mesmo PR**. Este guia diz qual doc muda para cada
tipo de mudança, em que formato, e o que a máquina confere.

## Mudança → qual doc atualizar → modelo

| Mudança                                                   | Doc(s)                                            | Modelo                                                                      | Conferido por                |
| --------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------- |
| Função nova, renomeada ou removida                        | FUNCTIONS.md                                      | [Função](#função) — `npm run docs:generate` (cria e poda seções) e preencha | `docs:check`                 |
| Assinatura, chamadores ou processos de uma função mudaram | FUNCTIONS.md                                      | `npm run docs:generate`                                                     | `docs:check`                 |
| Constante exportada nova                                  | FUNCTIONS.md, tabela "Dados e constantes"         | [Linha de constante](#linha-de-constante)                                   | `docs:check`                 |
| Fluxo novo ou alterado                                    | PROCESSES.md                                      | [Processo](#processo)                                                       | `docs:check` (citações) + PR |
| Pasta nova                                                | STRUCTURE.md (árvore + tabela)                    | [Linha de pasta](#linha-de-pasta)                                           | `docs:check`                 |
| Componente de UI novo                                     | UI.md                                             | [Componente](#componente)                                                   | `docs:check`                 |
| Tarefa do roadmap começou/terminou                        | ROADMAP.md                                        | [Estado de tarefa](#estado-de-tarefa)                                       | PR                           |
| Tarefa ou passo grande concluído                          | STATE.md (sobrescrever; local, fora do git)       | Skill `/handoff`                                                            | Hook `Stop` + PR             |
| Mudança visível ao usuário                                | CHANGELOG.md, seção "Não lançado"                 | [Entrada de changelog](#entrada-de-changelog)                               | PR                           |
| Decisão de arquitetura                                    | docs/adr/NNNN-titulo.md + adr/README.md           | [ADR](#adr) (`adr/0000-modelo.md`)                                          | PR                           |
| Camada, dependência ou serviço externo novo               | ARCHITECTURE.md                                   | Prosa + tabela de dependências                                              | PR                           |
| Decisão de produto, plano, preço                          | PRODUCT.md                                        | Pergunta aberta → decisão com data                                          | PR                           |
| Comando, hook, regra de fluxo                             | WORKFLOW.md, CLAUDE.md                            | Prosa curta                                                                 | PR                           |
| Regra de código nova                                      | CODING-STANDARDS.md e, se possível, regra de lint | Prosa + exemplo                                                             | PR                           |
| Termo novo                                                | GLOSSARY.md                                       | `**Termo** — definição.`                                                    | PR                           |
| Passo repetido com o Claude                               | `.claude/skills/<nome>/SKILL.md`, CLAUDE.md       | Ver `/melhorar-skills`                                                      | PR                           |

## Formatos padrão

### Função

Gerada por `npm run docs:generate`; só os cinco campos manuais são escritos à mão.

```markdown
### `nomeDaFuncao`

<!-- gerado:inicio -->

- **Arquivo:** `src/pasta/arquivo.ts`
- **Assinatura:** `nomeDaFuncao(a: string, b: number): Resultado`
- **Usada por:** `outraFuncao()`, `src/main.ts (módulo)`
- **Processos:** P01, P03

<!-- gerado:fim -->

- **Faz:** uma frase no presente, sem "e" (se precisar de "e", a função faz duas coisas).
- **Entrada:** cada parâmetro, com o que é e restrições.
- **Saída:** o que devolve, inclusive casos vazios/nulos.
- **Efeitos:** `Nenhum (pura).` ou o que toca (disco, rede, stdout, estado).
- **Erros:** `Nenhum.` ou cada erro lançado e quando.
```

Regras: a seção fica sob o heading `` ## `caminho/do/arquivo.ts` ``; nunca escreva o marcador de
preenchimento em um campo manual; nunca edite o bloco gerado.

### Linha de constante

```markdown
| `NOME_DA_CONSTANTE` | `src/arquivo.ts` | O que é e para que serve. |
```

### Processo

```markdown
## P05 — Nome do fluxo (gatilho curto)

- **Gatilho:** o que dispara.
- **Passos:**
  1. `funcaoA()` faz X.
  2. `funcaoB()` faz Y com o resultado.
- **Resultado:** o que o usuário/sistema tem no fim.
- **Falhas:** o que pode dar errado e o que acontece.
```

Numere em sequência (P01, P02...). Cite funções sempre como `` `nome()` ``: é assim que o `docs:check`
preenche o campo **Processos**.

### Linha de pasta

```markdown
| `src/pasta/` | O que tem, em uma linha | `arquivo-principal.ts`, `outro.ts` |
```

Adicione também a pasta na árvore `text` do topo do STRUCTURE.md quando for de primeiro nível.

### Componente

```markdown
### `NomeDoComponente`

- **Para que serve:** ...
- **Props:** `nome: tipo` — significado.
- **Variantes/estados:** padrão, hover, desabilitado, erro, carregando...
- **Tokens usados:** `color.primary`, `space.2`...
- **Acessibilidade:** papel, rótulo, foco, teclado.
```

### Estado de tarefa

```markdown
| F1.3 | Descrição curta | 🟨 | Pronto quando: critério verificável |
```

Estados: ⬜ não começou · 🟨 em andamento · ✅ pronto · ⏸️ pausado. Atualize também a seção "Próxima tarefa"
do topo do ROADMAP.md.

### Entrada de changelog

Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), na seção `## [Não lançado]`, sob
`### Adicionado`, `### Alterado`, `### Corrigido`, `### Removido` ou `### Segurança`:

```markdown
- Descrição voltada ao usuário, no passado, em português. (#123)
```

O release-please gera as seções de versão a partir dos commits; a seção "Não lançado" é a visão humana do
que está por sair.

### ADR

Copie `docs/adr/0000-modelo.md` para `docs/adr/NNNN-titulo-curto.md` (próximo número livre), preencha e
adicione a linha na tabela de `docs/adr/README.md`. ADR aceito não se edita: decisão nova cria um ADR que
marca o antigo como "Substituído por NNNN".

## Estilo de escrita

- Português do Brasil, frases curtas, voz ativa, presente do indicativo.
- Identificadores de código sempre em crase e em inglês, como estão no código.
- Explique o **porquê** nos docs de decisão (ADR, PRODUCT) e o **o quê** nos docs de referência
  (FUNCTIONS, STRUCTURE).
- Sem redundância entre docs: cada fato vive em um lugar; os outros linkam.
- Sem documentação de código morto: removeu a função, removeu a seção.

## Automação

| Comando                    | Faz                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run docs:generate`    | Atualiza índice, blocos gerados e cria seções novas em FUNCTIONS.md                                   |
| `npm run docs:check`       | Falha em qualquer divergência docs × código (ver tabela em [README.md](README.md#quem-confere-o-quê)) |
| Hook `Stop` do Claude Code | Roda `docs:check` no fim de cada resposta que alterou código ou docs e devolve os erros ao Claude     |
| Hook `Stop` (handoff)      | Bloqueia o encerramento se há commit seu novo sem `docs/STATE.md` atualizado                          |
| Hook `SessionStart`        | Injeta `docs/STATE.md` e a próxima tarefa do roadmap no início de toda sessão                         |
| Hook `PreCompact`          | Gera handoff automático em `docs/STATE.md` via `claude -p` antes de compactar a conversa              |
| Hook `pre-push`/`pr:check` | Rodam `npm run check`, que inclui `docs:check`                                                        |
