# Segurança

## Reportar uma vulnerabilidade

Não abra issue pública. Em repositório público, use "Report a vulnerability" na aba Security (GitHub
Private Vulnerability Reporting). Em repositório privado esse recurso não existe: escreva ao mantenedor.
Resposta inicial em até 72 horas.

## Práticas deste repositório

- Segredos só em variáveis de ambiente; `.env` nunca é versionado e o Claude Code não pode lê-lo.
- `gitleaks` obrigatório localmente via `npm run secrets:check` (no `pre-push` e no `pr:check`); não há CI.
- Dependabot semanal para npm.
- `main` só recebe PR com `npm run pr:check` verde, sem force push.
- Nenhuma dependência de produção até a stack ser escolhida (ADR); toda dependência nova passa por revisão.
