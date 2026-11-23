# Plan JSON (`schema: 1`)

The only data of the page. `scripts/plan.mjs validate` checks every rule below; unknown fields are rejected.
Dates are `YYYY-MM-DD` (São Paulo), times are free text (`"23:59"`, `"9:00–10:20"`). Text fields accept only
`**bold**` as markup. No classmate names, email addresses, student IDs or personal chat content.

## Top level

| Field            | Type                    | Notes                                                                    |
| ---------------- | ----------------------- | ------------------------------------------------------------------------ |
| `schema`         | `1`                     |                                                                          |
| `planKey`        | slug                    | `plano-<year>-<half>`, e.g. `plano-2026-2`; also the checklist store key |
| `term`           | `"2026/2"`              | Title: "Plano do Semestre 2026/2"                                        |
| `program`        | text                    | The student's program (curso)                                            |
| `generatedAt`    | ISO instant with offset | `"2026-11-23T07:00:00-03:00"`: shown as "Situação em 23/11/2026, 07h00"  |
| `goal`           | number                  | 60 by default                                                            |
| `sources`        | text[] (≥ 1)            | Sources consulted, e.g. `"Canvas PUC Minas"`, `"planos de ensino"`       |
| `missingSources` | text[]                  | Connectors not connected: `"Gmail"`, `"WhatsApp"`                        |
| `assumptions`    | `{kind, text}[]`        | `kind`: `informed` (grade the student gave), `estimate`, `change` (date) |
| `focus`          | `{from, to, blocks}`    | "Hoje e amanhã"                                                          |
| `courses`        | course[] (≥ 1)          |                                                                          |
| `study`          | study day[]             | Strictly increasing dates                                                |
| `timeline`       | timeline day[]          | Strictly increasing dates                                                |
| `undated`        | timeline item[]         | "Sem data" block                                                         |
| `questions`      | question[]              | "Perguntar aos professores"                                              |
| `whatsappGroups` | `{jid, name, course}[]` | Group → course mapping confirmed by the student (not rendered)           |

## Course

| Field           | Type                                                           | Notes                                                     |
| --------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `id`            | slug                                                           | Card anchor `#curso-<id>`; unique                         |
| `code`          | ≤ 12 chars                                                     | The tag (sigla), unique; items and questions reference it |
| `name`          | text                                                           |                                                           |
| `teacher`       | text (may be empty)                                            | "Prof. …"                                                 |
| `canvasId`      | digits, optional                                               | Canvas course id (used by the routines)                   |
| `goal`          | number, optional                                               | Only when the syllabus says something other than the plan |
| `points`        | `{sure, pend, open, lost}`                                     | **Must add up to 100**                                    |
| `needsRecovery` | boolean, optional                                              | Passing depends on a recovery exam → Risco alto           |
| `assessments`   | `{title, max, score, estimated?, informedByStudent?, date?}[]` | `score: null` = not graded ("— / max")                    |
| `path`          | text                                                           | One concrete way to the goal                              |
| `rules`         | `{text, source, date}[]`                                       | "Regras e avisos": each with its source and date          |

## Focus block (`focus.blocks[]`)

`{date, label, title, critical, text?, steps[]}` — `label` is the small line on top ("Seg 23/11 · GAAL ·
P3 na qui 26/11, 12:20"); `steps` are numbered actions; `critical: true` highlights the block.

## Checklists

- Study day: `{date, focus, hours, items[]}`; item `{id?, course, task, duration, optional?, status}`.
- Timeline day: `{date, conflict?, items[]}`; item `{id?, course, title, time?, points?, optional?, status}`.
- `status`: `open`, `done` (starts ticked), `dropped` (kept, shown as cancelled, not counted).
- `optional: true` draws the item dashed (only if recovery is needed).
- `course` is a course code or another short tag (`"ENADE"`, `"PUC"`), drawn neutral.

**Ids are permanent.** The student's ticks are stored under them. Keep every id from the previous version,
even when the text changes. New items may omit `id`: `build` reuses the id of the same item in the previous
page (same kind, date, course and title, ignoring case and accents) or creates a stable one. Format:
`^[a-z0-9][a-z0-9-]{1,63}$`, unique across study, timeline, undated and questions.

## Question

`{id?, course, text, status, sentOn?}` — `course` must be a course code; `status: "sent"` shows "aguardando
resposta (enviada em DD/MM)". When an answer arrives, record it as a rule (with source and date) and remove
the question; when partly answered, rewrite it.
