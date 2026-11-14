---
paths:
  - 'docs/**/*.md'
  - 'CHANGELOG.md'
---

# Ao editar documentação

- Siga os modelos de `docs/DOCUMENTATION.md`; um fato vive em um lugar só, os outros linkam.
- Nunca edite o conteúdo entre `<!-- generated:start -->` e `<!-- generated:end -->` — rode `npm run docs:generate`.
- ADR aceito não se edita: crie um novo que substitui o antigo.
- Ao terminar uma tarefa, atualize o estado em `docs/ROADMAP.md` e a "Próxima tarefa" no topo, e sobrescreva
  `docs/STATE.md` com `/handoff` (arquivo local, fora do git).
- Mudança visível ao usuário → entrada em `CHANGELOG.md`, seção "Não lançado".
- English (ADR 0021), short sentences, code identifiers in backticks. Existing Portuguese text is translated in
  roadmap phase F4.
