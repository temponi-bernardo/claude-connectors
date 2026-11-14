# 0012 — Public site on GitHub Pages, served from the `docs/` folder

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** F2.9, ADR 0006, ADR 0009

## Context

To put the connector in production (OAuth consent screen, connector directories, `.mcpb` manifest), the
services ask for a public link with the service's home page and privacy policy. The project does not use
GitHub Actions (ADR 0006) and has no paid hosting. Without Actions, GitHub Pages only publishes from the root
or the `/docs` folder of a branch.

## Decision

1. The site (home, privacy and terms) lives in `docs/` as HTML with front matter, built by GitHub Pages' own
   Jekyll with the `docs/_layouts/site.html` layout and the `docs/site.css` stylesheet (tokens from UI.md).
2. `docs/_config.yml` excludes `*.md`, `adr` and `STATE.md`: internal documentation is not published.
3. Pages is configured in **Settings → Pages → Deploy from a branch → `main` / `/docs`**. Address:
   `https://temponi-bernardo.github.io/claude-connectors/`.
4. The `.mcpb` manifest points `homepage` and `privacy_policies` at the site.
5. No scripts, cookies or analytics; CSP `default-src 'none'` via `<meta>`.

## Alternatives considered

| Alternative                            | Why not                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| Separate `gh-pages` branch             | Sits outside the PR flow and `pr:check`; site and docs would drift apart.      |
| Pages with GitHub Actions              | The project does not use Actions (ADR 0006).                                   |
| Serve the pages from the Canvas Worker | Mixes the public site with the OAuth server; every Worker deploy affects it.   |
| `.nojekyll` with plain HTML            | Header and footer repeated on every page (the "nothing repeated" rule) and the |
|                                        | internal `.md` files would be published raw.                                   |

## Consequences

- Positive: a free public link, versioned and reviewed in the same PR that changes the behavior it describes.
- Negative / accepted costs: with a private repository, GitHub Pages requires the GitHub Pro plan (or making the
  repository public); the site is published after the merge to `main`, not in the PR. Privacy policy and terms
  must be reviewed whenever the connector changes what it accesses or where it is hosted.
- Docs that change: STRUCTURE (`docs/_layouts/`, `tools/site/`), ARCHITECTURE (external service), UI.md,
  WORKFLOW (`site` scope), ROADMAP (F2.9).
