---
name: atualizar-docs
description: Use depois de alterar código e antes de abrir ou atualizar um PR, para levantar o diff, classificar cada mudança pela tabela de docs/DOCUMENTATION.md, aplicar as atualizações na ordem certa e rodar o docs:check.
---

# Atualizar a documentação a partir do diff

Guia e modelos: `docs/DOCUMENTATION.md`. Índice do que existe: `docs/README.md`.

## Passos

1. **Levante o diff:** `git diff main...HEAD --stat` e `git diff main...HEAD -- src tools` (ou o
   intervalo da tarefa). Liste: funções criadas/renomeadas/removidas, assinaturas alteradas, constantes
   exportadas novas, pastas novas, componentes de UI novos, fluxos alterados, dependências novas.
2. **Classifique** cada item pela tabela "Mudança → qual doc atualizar" de `docs/DOCUMENTATION.md`.
3. **Aplique nesta ordem:**
   1. `npm run docs:generate` (índice, blocos gerados, seções novas em FUNCTIONS.md).
   2. Preencha os campos manuais das seções novas (Faz, Entrada, Saída, Efeitos, Erros); remova seções de
      funções apagadas; adicione constantes à tabela "Dados e constantes".
   3. PROCESSES.md: crie/edite o processo citando as funções como `` `nome()` ``; depois rode
      `npm run docs:generate` de novo (o campo Processos depende disso).
   4. STRUCTURE.md (pastas), UI.md (componentes), ARCHITECTURE.md (camadas, serviços), ADR se houve
      decisão, PRODUCT.md se houve decisão de produto, WORKFLOW.md/CLAUDE.md se mudou comando ou regra.
   5. ROADMAP.md (estado e "Próxima tarefa") e CHANGELOG.md ("Não lançado").
   6. `.env.example` se surgiu variável nova; GLOSSARY.md se surgiu termo novo.
4. **`npm run docs:check`** até `✔`. Leia cada mensagem: ela diz exatamente o que falta ou sobra.
5. **Relate** no corpo do PR usando o checklist do template: para cada doc, "atualizado" ou "não se aplica:
   motivo".
