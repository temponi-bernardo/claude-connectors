# Documentation — index

The documentation is this repository's source of truth: a new Claude Code session (or a new person) should
find everything here without scanning the code. When docs and code diverge, `npm run docs:check` fails.

## I want to... → read...

| I want to...                                               | Read...                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| Understand what the project is, who it is for, how it pays | [PRODUCT.md](PRODUCT.md)                                |
| Pick up what the previous session left                     | [STATE.md](STATE.md) (local handoff, injected at start) |
| Know what to do now                                        | [ROADMAP.md](ROADMAP.md) — "Next task" section          |
| Know where each thing lives and where to put something new | [STRUCTURE.md](STRUCTURE.md)                            |
| Know how the system is split and who may import whom       | [ARCHITECTURE.md](ARCHITECTURE.md)                      |
| Understand a flow end to end                               | [PROCESSES.md](PROCESSES.md)                            |
| Know what a function does, who uses it, what it can throw  | [FUNCTIONS.md](FUNCTIONS.md)                            |
| Write code to the project's standard                       | [CODING-STANDARDS.md](CODING-STANDARDS.md)              |
| Write or fix tests                                         | [TESTING.md](TESTING.md)                                |
| Create a branch, commit, PR, release                       | [WORKFLOW.md](WORKFLOW.md)                              |
| Know which doc to update after a change                    | [DOCUMENTATION.md](DOCUMENTATION.md)                    |
| Understand or record an architecture decision              | [adr/README.md](adr/README.md)                          |
| Know what a term means                                     | [GLOSSARY.md](GLOSSARY.md)                              |
| Work on the interface (if the project has one)             | [UI.md](UI.md)                                          |
| Know how to report a vulnerability                         | [../SECURITY.md](../SECURITY.md)                        |
| Know how user data is kept apart (isolation map)           | [security/isolation.md](security/isolation.md)          |
| Prepare a connector for Anthropic's Connectors Directory   | [DIRECTORY-LISTING.md](DIRECTORY-LISTING.md)            |
| Know which Spotify endpoints exist in 2026 (and what not)  | [SPOTIFY-API.md](SPOTIFY-API.md)                        |
| See the Spotify use-case brainstorm                        | [SPOTIFY-IDEAS.md](SPOTIFY-IDEAS.md)                    |

## Who checks what

| Rule                                                                       | Machine (command)                         | PR checklist                                |
| -------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| Every function documented in FUNCTIONS.md, in the right module             | `docs:check`                              | —                                           |
| Generated blocks (File, Signature, Used by, Processes) up to date          | `docs:check` (`docs:generate` fixes it)   | —                                           |
| Manual fields filled in (Does, Input, Output, Effects, Errors)             | `docs:check` (only detects the marker)    | Content is correct and useful               |
| Function names unique in the repository                                    | `docs:check`                              | —                                           |
| Function cited in PROCESSES.md exists                                      | `docs:check`                              | Process steps match the code                |
| Every versioned folder in STRUCTURE.md                                     | `docs:check`                              | Folder description makes sense              |
| Every UI component in UI.md                                                | `docs:check` (if `uiDir` is configured)   | States and variants documented              |
| Every function has a test (or a justified exception)                       | `docs:check`                              | Test covers the behavior, not just the name |
| Exported constant in the "Data and constants" table                        | `docs:check`                              | —                                           |
| Minimum coverage of 90%                                                    | `test:coverage`                           | —                                           |
| No duplication                                                             | `dup:check` (jscpd)                       | Similar but not identical logic unified?    |
| Functions ≤ 25 lines, ≤ 3 parameters, complexity ≤ 8, top-level `function` | `lint` (ESLint)                           | Does the function do a single job?          |
| Strict types                                                               | `typecheck`                               | —                                           |
| Formatting                                                                 | `format` (Prettier)                       | —                                           |
| Secrets                                                                    | `secrets:check` (gitleaks, required)      | —                                           |
| Conventional Commits                                                       | `commit-msg` hook and title in `pr:check` | Right scope?                                |
| Nothing straight to `main`                                                 | Branch protection on GitHub               | —                                           |
| ROADMAP, CHANGELOG, PRODUCT, ARCHITECTURE, ADRs updated                    | —                                         | PR template checklist                       |
| Skills updated                                                             | —                                         | PR template checklist                       |
