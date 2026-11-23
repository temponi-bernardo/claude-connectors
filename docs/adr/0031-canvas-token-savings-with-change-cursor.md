# 0031 — Canvas token savings: compact JSON and a stateless change cursor

- **Status:** Accepted
- **Date:** 2026-11-23
- **Related:** task F2.14, ADR 0010, ADR 0030

## Context

Every Canvas call spends model tokens on what the tool returns, not on the HTTP request. Two costs dominated:
the results were indented JSON (`JSON.stringify(data, null, 2)`), and refreshing a snapshot the user already
has (the semester plan, a routine) re-read every assignment, announcement, forum and message. A server-side
cache would save Canvas requests and latency, but the model would still receive the same text, so it would
not save tokens. It would also store student data on the server, against `docs/security/isolation.md`.

## Decision

Tool results are compact JSON for every connector (`textResult()`). The Canvas listings `list_assignments`,
`list_announcements`, `list_discussions` and `list_conversations` accept `changed_since` and always end with a
`checked_at=<ISO>` note; given a cursor they return only the items whose latest date (edit, submission,
grading, post, reply, last message) is at or after it. The cursor travels with the call; the snapshot lives on
the client (the plan artifact, `generatedAt`).

## Alternatives considered

| Alternative                                     | Why not                                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Server cache in KV per user                     | Saves Canvas calls, not tokens; stores student data server side; needs invalidation       |
| Server keeps the last seen fingerprint per user | Stateful, per-user storage of content hashes; breaks when two clients share an account    |
| ETag / `If-Modified-Since` on Canvas            | Canvas listings rarely honor it, and an unchanged page still returns the whole body to us |
| Only compact JSON                               | Helps every call (~20–30% less text) but a refresh still re-reads everything              |

## Consequences

- Positive: smaller results everywhere; a plan update reads only deltas; nothing new is stored.
- Negative / accepted costs: items with no date are always returned (conservative); `checked_at` uses the
  server clock, so callers that build their own cursor should subtract a margin. Canvas is still read in full;
  only the result is filtered. With a cursor, `list_announcements` searches from the cursor (not the last
  `days`) and `list_conversations` reads up to 100 conversations, so older changes are not cut off.
- Docs that change: PROCESSES (P03 step 8), FUNCTIONS, connector README, `/planejamento-faculdade` skill.
