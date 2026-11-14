#!/usr/bin/env bash
# Configures the repository on GitHub after the first push:
#   bash scripts/setup-github.sh <owner>/<repo> [--template]
# - branch protection for main (no force push/delete, linear history). No required status checks:
#   there is no CI (ADR 0006); the gate is the local `npm run pr:check`.
# - GitHub Actions disabled (no minutes cost)
# - squash merge as the only mode, delete branch after merge
# - vulnerability alerts, Dependabot security updates, private vulnerability reporting
# - --template marks the repository as a template
set -euo pipefail

repo="${1:?usage: setup-github.sh <owner>/<repo> [--template]}"
template_flag="${2:-}"

echo "→ GitHub Actions: disabled (ADR 0006)"
gh api -X PUT "repos/$repo/actions/permissions" -F enabled=false >/dev/null

echo "→ merges: squash only, delete branch, suggest updating branch"
gh repo edit "$repo" \
  --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false \
  --delete-branch-on-merge \
  --allow-update-branch >/dev/null

echo "→ security: alerts, Dependabot security updates, private reporting"
gh api -X PUT "repos/$repo/vulnerability-alerts" >/dev/null || true
gh api -X PUT "repos/$repo/automated-security-fixes" >/dev/null || true
gh api -X PUT "repos/$repo/private-vulnerability-reporting" >/dev/null || true

echo "→ branch protection: main"
# On a private repository on the free plan, the API returns 403 ("Upgrade to GitHub Pro"): warn and go on,
# so the rest (e.g. --template) still runs.
if ! gh api -X PUT "repos/$repo/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON' >/dev/null
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "lock_branch": false
}
JSON
then
  protection_failed=1
  echo "⚠ branch protection not applied. A private repository needs GitHub Pro/Team; alternatives:" >&2
  echo "  make the repository public or protect main by hand after upgrading." >&2
  echo "  Without it, only the local hooks (guard-bash, pre-push) prevent direct pushes to main." >&2
fi

if [ "$template_flag" = "--template" ]; then
  echo "→ marking as template"
  gh repo edit "$repo" --template >/dev/null
fi

if [ "${protection_failed:-0}" = "1" ]; then
  echo "✔ GitHub configured for $repo, EXCEPT branch protection (see the warning above)"
  exit 1
fi
echo "✔ GitHub configured for $repo"
