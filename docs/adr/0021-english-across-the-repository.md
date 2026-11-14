# 0021 — English across the repository

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** CLAUDE.md rules 8 and 10, roadmap F4.4–F4.6

## Context

The repository mixes languages. Docs, skills, commit descriptions, tool descriptions and the Canvas tool names
(`listar_cursos`, `proximas_entregas`...) and output fields (`titulo`, `enunciado`) are Portuguese, while Gmail and
WhatsApp tools are English. Skill names are Portuguese (`/resumo-semana`). The owner wants one language, in line
with the identifiers and with Anthropic's plugin and connector ecosystem.

## Decision

English is the only language of the repository: tool names, input and output fields, tool descriptions and error
messages, plugin and project skills (names and content), manifests, READMEs, the public site, `docs/` (ADRs
included), `CLAUDE.md`, rules, hook messages, commit descriptions and the changelog. Portuguese names are
discontinued with no aliases. New text is written in English from this ADR on; existing text is translated in
the roadmap's F4 tasks. The ADR metadata labels (`Estado`, `Data`, `Relacionado`) stay until the docs tooling is
translated, so old and new ADRs parse the same.

## Alternatives considered

| Alternative                             | Why not                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------- |
| English identifiers, Portuguese prose   | Keeps the mix the owner asked to remove                                   |
| English only in user-facing plugin text | Docs and skills of the project would still be Portuguese                  |
| Keep old Canvas tool names as aliases   | Doubles the tool list the model sees; the owner asked to discontinue them |

## Consequences

- Positive: one language everywhere; tool names consistent across the three connectors.
- Negative / accepted costs: breaking change for current users — saved permissions with old tool names and
  `/resumo-semana`-style commands stop working (Canvas goes to a new major version). `docs:check` parses
  Portuguese field labels (Faz/Entrada/Saída/Efeitos/Erros) and must be changed before `FUNCTIONS.md` is
  translated. Large translation effort, split into small PRs.
- Docs that change: CLAUDE.md, `.claude/rules/docs.md`, WORKFLOW (commit language), DOCUMENTATION, every doc
  during F4.
