# Security

## Reporting a vulnerability

Do not open a public issue. In a public repository, use "Report a vulnerability" in the Security tab (GitHub
Private Vulnerability Reporting). Private repositories do not have that feature: write to the maintainer.
Initial response within 72 hours.

## Practices in this repository

- Secrets only in environment variables; `.env` is never committed and Claude Code cannot read it.
- `gitleaks` required locally via `npm run secrets:check` (in `pr:check`); there is no CI.
- Weekly Dependabot for npm.
- `main` only receives PRs with a green `npm run pr:check`, no force push.
- No production dependency until the stack is chosen (ADR); every new dependency is reviewed.
