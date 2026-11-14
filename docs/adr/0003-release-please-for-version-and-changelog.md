# 0003 — release-please for version, tag and changelog

- **Status:** Accepted
- **Date:** 2026-10-01
- **Related:** F0.1, F2.2

## Context

The version must live in a single place, the CHANGELOG must reflect the commits, and the `vX.Y.Z` tag may only
be created with human confirmation. An initial proposal had a custom version-sync script and manual CHANGELOG
editing before creating the tag.

## Decision

Use `release-please` (GitHub Action). It reads the Conventional Commits on `main` and opens a release PR with
the version bump in `package.json` and a generated CHANGELOG; **merging that PR is the human confirmation** and
creates the tag and a draft release. Squash merge + PR title validation in CI ensure `main` only has
conventional commits.

## Alternatives considered

| Alternative                     | Why not                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| Custom bump script + manual tag | More code to maintain and test; reinvents what the action does     |
| changesets                      | Great for monorepos with many packages; overkill for one package   |
| semantic-release                | Publishes directly with no human step; we want confirmation via PR |

## Consequences

- Positive: single source of version (`package.json`, mirrored in `.release-please-manifest.json`), automatic
  changelog, tag only after a human merge.
- Negative: the CHANGELOG "Não lançado" section is kept by hand as a human view and must be moved into the
  version in the release PR (the `/lancar-versao` skill handles this).
- Docs that change: WORKFLOW.md (release section), CHANGELOG.md.
