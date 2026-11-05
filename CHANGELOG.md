# Changelog

Todas as mudanças relevantes ficam aqui. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [SemVer](https://semver.org/lang/pt-BR/). As seções de versão são geradas pelo release-please
a partir dos commits; a seção "Não lançado" é mantida à mão.

## [Não lançado]

### Adicionado

- Estrutura inicial do template: documentação como fonte da verdade, `docs:check`/`docs:generate` por AST,
  hooks, CI, release-please, skills do Claude Code e esqueleto executável.
- Ciclo de contexto pequeno do Claude Code: `docs/STATE.md` como handoff, skill `/handoff`, hooks `Stop`
  (cobra handoff após commit), `SessionStart` (injeta o estado) e `PreCompact` (handoff automático).

### Corrigido

- `npm run init` agora renomeia o pacote no `package.json`/`package-lock.json` e esvazia o histórico do
  template no CHANGELOG.
- `docs/STATE.md` passou a ser local de cada clone (fora do git): o handoff pós-merge não suja mais a `main`
  nem o PR seguinte. O hook `Stop` deixou de cobrar handoff por commits trazidos via `git pull`.
- Título do PR validado pelo próprio commitlint (tipos e escopos num lugar só).
- `scripts/setup-github.sh` avisa e segue quando o GitHub recusa branch protection (privado no plano
  gratuito); `secrets:check` local falha sem gitleaks, salvo `SECRETS_CHECK=skip`.
- `npm run docs:generate` remove seções órfãs do FUNCTIONS.md; actions do CI fixadas por SHA.

- CodeQL e `dependency-review` pulados em repositório privado, onde exigem GitHub Advanced Security /
  Code Security; CodeQL ganha a permissão `actions: read`.
