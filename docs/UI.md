# Interface

**This project has no application interface.** `docs.config.json` has `"uiDir": null`, so `docs:check` does not
require components. The only screen is the **remote connector's authorization page** (ADR 0009): static HTML,
no script, produced by `renderLoginPage()` in `src/remote/login-page.ts`, styled by `LOGIN_PAGE_CSS` and the
tokens below (light and dark via `prefers-color-scheme`). The GitHub Pages **public site** (ADR 0012:
`docs/index.html`, `privacy.html`, `terms.html`; `privacidade.html` and `termos.html` only redirect) uses the same tokens in `docs/site.css`, with no script. The Gmail
connector's pages (consent, link confirmation with the masked owner email and the warning in `--danger`, and link
result and the "Not the owner of this link" refusal, `connectors/gmail/src/pages.ts`) use the same `LOGIN_PAGE_CSS`. The login page may show one optional
permission as an unticked checkbox (`grantCheckbox()`, class `.option`: inline checkbox, normal weight), e.g. the
Canvas write opt-in. WhatsApp's
`/pair` page (`renderPairPage()` in `connectors/whatsapp/src/pair-page.ts`, ADR 0015) uses `LOGIN_PAGE_CSS` plus
`PAIR_PAGE_CSS` (pairing code in a large mono font, QR on a white background, `secondary` and `danger` buttons).
States: needs pairing (code and QR forms), connecting, connected, no response from the bridge, error
(`role="alert"`) and message (`role="status"`); with a code or QR on screen, it reloads every 20 s; the CSP allows
only `img-src data:` for the QR.

## When there is an interface

1. Create the design system package (e.g. `src/ui/`) with **tokens** (colors, typography, spacing, radius,
   shadow) and **components** (button, field, card...). No screen is styled "by hand": it only uses tokens and
   components from here.
2. Set `"uiDir": "src/ui"` in `docs.config.json`. From then on every `.tsx` file in that folder needs a section
   here (template in [DOCUMENTATION.md](DOCUMENTATION.md#component)).
3. Record the UI stack decision in an ADR and update ARCHITECTURE.md (the connector entry).
4. If platforms differ (web × desktop × mobile), create `docs/PLATFORMS.md` and link it here.
5. Design (icons, illustrations, images) is always original — nothing copied from third-party libraries without a
   compatible license, nothing that imitates someone else's brand.

## Tokens

| Token       | Value (light / dark)  | Use                                  |
| ----------- | --------------------- | ------------------------------------ |
| `--bg`      | `#f6f7f9` / `#121417` | Page and field background            |
| `--surface` | `#fff` / `#1c1f24`    | Central card                         |
| `--text`    | `#1d2129` / `#e8eaed` | Main text                            |
| `--muted`   | `#5b6270` / `#a3a9b3` | Supporting text                      |
| `--accent`  | `#2357d9` / `#7aa2ff` | Button and links                     |
| `--danger`  | `#b42318` / `#ff8a80` | Error message (`role="alert"`)       |
| `--line`    | `#d9dde3` / `#30343b` | Borders                              |
| `--space`   | `16px`                | Base spacing                         |
| `--radius`  | `10px`                | Card radius (fields and button: 8px) |

## Components

_None yet._
