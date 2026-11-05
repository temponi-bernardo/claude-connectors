## O que muda

<!-- Uma ou duas frases. Tarefa do roadmap: F?.? -->

## Como testar

<!-- Comandos e o que observar. -->

## Checklist de documentação (docs/DOCUMENTATION.md)

Para cada item: marque se atualizou **ou** escreva "não se aplica: motivo".

- [ ] `docs/FUNCTIONS.md` — `npm run docs:generate` rodado e campos manuais preenchidos
- [ ] `docs/PROCESSES.md` — fluxos novos/alterados citam as funções
- [ ] `docs/STRUCTURE.md` — pastas novas
- [ ] `docs/ROADMAP.md` — estado da tarefa e "Próxima tarefa"
- [ ] `CHANGELOG.md` — seção "Não lançado" (se visível ao usuário)
- [ ] `docs/ARCHITECTURE.md` — camadas, dependências, serviços externos
- [ ] `docs/adr/` — decisão de arquitetura registrada
- [ ] `docs/PRODUCT.md` — decisão de produto registrada com data
- [ ] `docs/UI.md` — componentes novos (se houver interface)
- [ ] `docs/WORKFLOW.md` / `CLAUDE.md` — comandos, regras, escopos de commit
- [ ] `.claude/skills/` — skill criada/atualizada (regra 9)
- [ ] `.env.example` — variáveis novas

## Checklist de qualidade

- [ ] `npm run check` verde localmente
- [ ] Testes escritos antes do código (ou teste que reproduz o bug)
- [ ] Nenhuma função nova sem teste (ou exceção justificada em `src/test-exceptions.ts`)
- [ ] Título do PR no formato `tipo(escopo): descrição em português`
