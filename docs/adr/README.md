# Registros de decisão de arquitetura (ADR)

Um arquivo por decisão, numerado em sequência. ADR **aceito não se edita**: decisão nova cria um ADR que
marca o antigo como "Substituído por NNNN". Modelo em [0000-modelo.md](0000-modelo.md).

| #                                                         | Título                                                      | Estado                               | Data       |
| --------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ | ---------- |
| [0001](0001-typescript-node-como-base-do-template.md)     | TypeScript sobre Node como base do template                 | Aceito                               | 2026-10-01 |
| [0002](0002-documentacao-verificada-por-ast.md)           | Documentação verificada e gerada por análise de AST         | Aceito                               | 2026-10-01 |
| [0003](0003-release-please-para-versao-e-changelog.md)    | release-please para versão, tag e changelog                 | Substituído em parte por 0006        | 2026-10-01 |
| [0004](0004-handoff-de-contexto-em-state-md-com-hooks.md) | Handoff de contexto em `docs/STATE.md` com hooks            | Substituído em parte por 0005        | 2026-10-19 |
| [0005](0005-state-md-local-por-clone.md)                  | `docs/STATE.md` como estado local de cada clone             | Aceito                               | 2026-10-19 |
| [0006](0006-sem-github-actions-checagens-locais.md)       | Sem GitHub Actions: checagens e release locais              | Aceito                               | 2026-11-05 |
| [0007](0007-conectores-como-extensoes-mcpb.md)            | Conectores como extensões `.mcpb` com sessão do navegador   | Aceito                               | 2026-11-05 |
| [0008](0008-conectores-como-plugins-do-marketplace.md)    | Conectores também como plugins de um marketplace            | Aceito                               | 2026-11-05 |
| [0009](0009-conector-remoto-http-oauth.md)                | Conector remoto por HTTP com OAuth e token do Canvas        | Substituído em parte por 0010 e 0011 | 2026-11-05 |
| [0010](0010-conector-remoto-no-cloudflare-workers.md)     | Conector remoto hospedado no Cloudflare Workers             | Aceito                               | 2026-11-05 |
| [0011](0011-renovacao-automatica-do-token-do-canvas.md)   | Renovação automática do token do Canvas no refresh do OAuth | Aceito                               | 2026-11-05 |
