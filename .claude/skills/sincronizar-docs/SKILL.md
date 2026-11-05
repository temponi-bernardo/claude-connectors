---
name: sincronizar-docs
description: Use para auditar a documentação inteira contra o código quando houver suspeita de divergência que a máquina não pega (campos Faz/Entrada/Saída/Efeitos/Erros desatualizados, processos que não refletem o fluxo real, ROADMAP ou ARCHITECTURE defasados), por exemplo a cada fase concluída ou antes de uma release.
context: fork
agent: general-purpose
---

# Auditoria docs × código

O `docs:check` garante presença e consistência estrutural. Esta skill cobre o **conteúdo**: o que a máquina
não lê. Trabalhe em um subagente e devolva só o relatório e as correções.

## Passos

1. Rode `npm run docs:check` e `npm run docs:generate`; se algo mudou, isso já é uma divergência a reportar.
2. **FUNCTIONS.md, função por função:** abra o arquivo indicado e confira os cinco campos manuais contra o
   código. Preste atenção em: efeitos não declarados (console, disco, rede), erros lançados que não estão em
   "Erros", parâmetros que mudaram de significado, "Faz" com "e" (função que faz duas coisas → anote como
   dívida).
3. **PROCESSES.md:** para cada processo, siga o fluxo real a partir do gatilho e confira se os passos, a
   ordem, o resultado e as falhas batem. Processos sem gatilho real ou fluxos reais sem processo → corrija.
4. **STRUCTURE.md:** descrições de pasta ainda verdadeiras? "Arquivos principais" existem? Tabela "Onde
   colocar algo novo" cobre os tipos de arquivo que surgiram?
5. **ARCHITECTURE.md:** `grep -r "from '" src tools` e confira as importações contra a tabela de
   dependências; serviços externos usados constam? ADRs aceitos ainda descrevem o que está implementado?
6. **ROADMAP.md / CHANGELOG.md / PRODUCT.md:** estados coerentes com o que existe; "Próxima tarefa"
   correta; decisões de produto tomadas em conversas/PRs registradas com data.
7. **CLAUDE.md e skills:** comandos listados existem no `package.json`? Skills referenciam docs que existem?
8. **Corrija** tudo o que for objetivo; o que for decisão, liste como pergunta.
9. **Relatório final:** tabela "Doc | Divergência | Correção aplicada ou pergunta", seguida de
   `npm run docs:check` verde. Abra um PR `docs(docs): sincronizar documentação com o código`.
