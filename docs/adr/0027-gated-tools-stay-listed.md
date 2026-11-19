# 0027 — Gated tools stay listed, and Canvas writing can be turned on without a new token

- **Status:** Accepted
- **Date:** 2026-11-19
- **Related:** ADR 0009, ADR 0010, ADR 0026 (point 4 superseded), isolation audit finding #2

## Context

After the isolation audit (PR #62), Canvas write tools were only **registered** for tokens that carried the
`write` grant ticked at sign-in. Every connection made before that change became read-only, and `send_message`
simply vanished from `tools/list`. Meanwhile `find_recipients` still said "Returns the user ID that send_message
needs". A user who asked Claude to message a teacher with an attachment got a model that could not tell
"never implemented" from "hidden by a permission", and the only way back was to reconnect, which means pasting a
Canvas token again (Canvas shows a token only once, so in practice: generate another one). The published Worker
matched the code; nothing warned anyone that the tool list diverged from what descriptions promised.

## Decision

1. **A tool that depends on a flag or a permission is always listed.** `gateToolSpecs()` (`src/mcp/tool-gate.ts`)
   keeps its name, schema and annotations, appends `UNAVAILABLE on this connection: <reason>` to its description
   and makes every call answer an error result with the reason, without running it. Canvas write tools
   (writing off for the user or on the server) and WhatsApp `send_message` (`ENABLE_SEND` off) use it.
2. **Canvas writing can be turned on later without a new token.** A read-only connection's refusal carries a link
   to `/write-access?t=<seal>`; the seal (15 minutes, `aud` = issuer) holds only the SHA-256 fingerprint of the
   Canvas token. On that page the user clicks "Allow writing" (or turns it off); the opt-in is stored in Workers
   KV (`CANVAS_KV`) as `write:<fingerprint>` → `on`. Writing is on when the server allows it AND the user ticked
   the box at sign-in OR stored the opt-in. The token itself is never stored. A KV failure counts as "off".
3. **Contracts.** Each connector has `tool-contract.json` (name + read-only). Unit tests compare it with the tools
   each server lists in every configuration, and fail when a description mentions a snake_case tool name that is
   not registered (`unregisteredToolMentions()`).
4. **Post-deploy smoke test.** Each remote server answers a public `GET /tools` with its real `tools/list` (built
   with `listOnlyContext()`, no user data, nothing can run). Every `*:deploy` script runs `npm run smoke --
<connector>`, which compares it with the contract and exits 1 (failing the deploy command) when they differ.
   There is no CI (ADR 0006), so the deploy script is where the check lives.

## Alternatives considered

| Alternative                                            | Why not                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Keep hiding gated tools, only fix the description      | The model still cannot explain why sending is impossible or how to enable it                                                               |
| Grandfather pre-#62 tokens as writers                  | Reverses the audit's decision (#2): nobody opted in                                                                                        |
| Show a "reconnect code" that replaces the Canvas token | The code would grant full account access if leaked from the transcript; the link only toggles writing for a connection that already exists |
| Unauthenticated `tools/list` on `/mcp`                 | Bends the MCP auth contract clients rely on; a separate `GET /tools` is explicit                                                           |
| Smoke test with a real user token                      | The Worker's seal key is a secret the deploy machine does not hold                                                                         |

## Consequences

- Positive: no description can point at an invisible tool; a disabled tool explains itself; read-only users enable
  writing in one click; a deploy that drops or adds a tool fails immediately.
- Negative / accepted costs: the Canvas Worker now has state (one KV key per user who opts in later; one KV read
  per MCP request of a read-only user); KV is eventually consistent (up to a minute); the public `GET /tools`
  reveals the tool schemas (they are already public in this repository).
- Docs that change: PROCESSES (P03), FUNCTIONS, STRUCTURE, Canvas and WhatsApp READMEs, isolation map, CHANGELOGs.
