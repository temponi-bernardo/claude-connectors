---
name: release
description: Use when the person asks to prepare, review or publish a release (new version, tag, changelog), to drive release-please through the local CLI described in docs/WORKFLOW.md without creating a tag without human confirmation.
disable-model-invocation: true
---

# Ship a release

Full flow in `docs/WORKFLOW.md` (release section) and decisions in `docs/adr/0003`, `0006` and `0022` (there are
no GitHub Actions: release-please runs through the local CLI).

## Steps

1. **Check `main`:** `git fetch && git switch main && git pull`, `git log --oneline -20` (all conventional?) and
   a green `npm run check` on `main`.
2. **Human changelog:** read the "Unreleased" section of `CHANGELOG.md`. Is anything missing that the `feat`/`fix`
   commits since the last tag point to (`git log <last-tag>..origin/main --oneline`)? Complete it in a
   `docs(release): ...` PR before going on.
3. **Release PR:** dry-run first (`release-pr --dry-run`, it takes minutes: run it in the background with a log). A
   package with no GitHub release for its manifest version gets a wrong bump: pin it with `release-as` in
   `release-please-config.json` (own PR) and remove the pin after the release (`docs/WORKFLOW.md`). Then
   `npx release-please release-pr --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`
   opens or updates the PR (`gh pr list --label "autorelease: pending"`). Open the PR and check: proposed version
   consistent with the commits (feat → minor, fix → patch, BREAKING → major), readable generated CHANGELOG.
   The PR covers the root package (`.` → `package.json`, `vX.Y.Z`) and each plugin package
   (`connectors/<name>` → `plugin/.claude-plugin/plugin.json` `version`, `<name>-vX.Y.Z`, ADR 0022). Check that
   every plugin whose connector changed got a bump in its `plugin.json` (without it users see "already at the
   latest version") and that no marketplace entry got a `version`.
4. **Move "Unreleased"** into the version in the release PR if the human text is better than the generated one
   (edit the release-please branch; it keeps manual edits to the CHANGELOG).
5. **Merge** the release PR without asking for confirmation (`gh pr merge --squash`), like any PR with a green
   `pr:check` (`docs/WORKFLOW.md`). Never create a tag by hand.
6. **Tag and draft:** after the merge,
   `npx release-please github-release --draft --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`
   creates the `vX.Y.Z` tag (and `<name>-vX.Y.Z` for each released plugin) and the draft with the notes. There is
   no attachment: the plugin points to the remote server (ADR 0013). Publishing is the person's decision
   (`gh release edit vX.Y.Z --draft=false`).
7. **Remote server:** if the release touched the connector, run `npm run worker:deploy` on `main` (needs
   `CLOUDFLARE_API_TOKEN`); without it, whoever installed from the marketplace stays on the old Worker version.
8. **After:** confirm that `package.json` and each `plugin.json` have the same version as
   `.release-please-manifest.json` on `main` (`npm test` checks the plugins) and that `npm run plugin:validate`
   passes; open a new empty "Unreleased" section in the CHANGELOG if release-please did not; ROADMAP: mark the
   release task as ✅.
