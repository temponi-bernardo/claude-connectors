# Segurança

## Reportar uma vulnerabilidade

Não abra issue pública. Em repositório público, use "Report a vulnerability" na aba Security (GitHub
Private Vulnerability Reporting). Em repositório privado esse recurso não existe: escreva ao mantenedor.
Resposta inicial em até 72 horas.

## Práticas deste repositório

- Segredos só em variáveis de ambiente; `.env` nunca é versionado e o Claude Code não pode lê-lo.
- `gitleaks` no CI em todo PR; localmente via `npm run secrets:check` se instalado.
- Dependabot semanal; `dependency-review` em PRs e CodeQL só em repositório público.
- `main` protegida: PR + CI verde obrigatórios, sem force push.
- Nenhuma dependência de produção até a stack ser escolhida (ADR); toda dependência nova passa por revisão.
