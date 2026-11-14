# Registros de decisão de arquitetura (ADR)

Um arquivo por decisão, numerado em sequência. ADR **aceito não se edita**: decisão nova cria um ADR que
marca o antigo como "Substituído por NNNN". Modelo em [0000-template.md](0000-template.md).

| #                                                        | Título                                                           | Estado                               | Data       |
| -------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------ | ---------- |
| [0001](0001-typescript-node-as-template-base.md)         | TypeScript sobre Node como base do template                      | Aceito                               | 2026-10-01 |
| [0002](0002-ast-verified-documentation.md)               | Documentação verificada e gerada por análise de AST              | Aceito                               | 2026-10-01 |
| [0003](0003-release-please-for-version-and-changelog.md) | release-please para versão, tag e changelog                      | Substituído em parte por 0006        | 2026-10-01 |
| [0004](0004-context-handoff-in-state-md-with-hooks.md)   | Handoff de contexto em `docs/STATE.md` com hooks                 | Substituído em parte por 0005        | 2026-10-19 |
| [0005](0005-state-md-local-per-clone.md)                 | `docs/STATE.md` como estado local de cada clone                  | Aceito                               | 2026-10-19 |
| [0006](0006-no-github-actions-local-checks.md)           | Sem GitHub Actions: checagens e release locais                   | Aceito                               | 2026-11-05 |
| [0007](0007-connectors-as-mcpb-extensions.md)            | Conectores como extensões `.mcpb` com sessão do navegador        | Substituído por 0012                 | 2026-11-05 |
| [0008](0008-connectors-as-marketplace-plugins.md)        | Conectores também como plugins de um marketplace                 | Substituído em parte por 0012        | 2026-11-05 |
| [0009](0009-remote-http-oauth-connector.md)              | Conector remoto por HTTP com OAuth e token do Canvas             | Substituído em parte por 0010 e 0011 | 2026-11-05 |
| [0010](0010-remote-connector-on-cloudflare-workers.md)   | Conector remoto hospedado no Cloudflare Workers                  | Aceito                               | 2026-11-05 |
| [0011](0011-automatic-canvas-token-renewal.md)           | Renovação automática do token do Canvas no refresh do OAuth      | Aceito                               | 2026-11-05 |
| [0012](0012-public-site-on-github-pages.md)              | Site público no GitHub Pages, servido da pasta `docs/`           | Aceito                               | 2026-11-14 |
| [0013](0013-remote-only-connector-via-marketplace.md)    | Conector só remoto, instalado pelo marketplace                   | Substituído em parte por 0020        | 2026-11-14 |
| [0014](0014-on-demand-remote-gmail-on-workers.md)        | Gmail remoto multi-conta, só leitura, sob demanda no Workers     | Substituído em parte por 0016 e 0019 | 2026-11-14 |
| [0015](0015-whatsapp-on-cloudflare-containers.md)        | WhatsApp pessoal no Cloudflare Workers + Containers, sob demanda | Aceito                               | 2026-11-14 |
| [0016](0016-public-multi-user-gmail.md)                  | Gmail remoto público e multiusuário                              | Substituído em parte por 0019        | 2026-11-14 |
| [0017](0017-automatic-handoff-on-session-end.md)         | Handoff automático no SessionEnd                                 | Aceito                               | 2026-11-14 |
| [0018](0018-whatsapp-plugin-without-bundled-server.md)   | Plugin do WhatsApp sem servidor embutido                         | Aceito                               | 2026-11-14 |
| [0019](0019-full-gmail-management.md)                    | Gmail com gerenciamento completo (`gmail.modify`)                | Aceito                               | 2026-11-14 |
| [0020](0020-plugin-content-in-plugin-subfolder.md)       | Plugin content lives in a `plugin/` subfolder                    | Aceito                               | 2026-11-14 |
| [0021](0021-english-across-the-repository.md)            | English across the repository                                    | Aceito                               | 2026-11-14 |
| [0022](0022-version-per-plugin.md)                       | One version per plugin                                           | Aceito                               | 2026-11-14 |
