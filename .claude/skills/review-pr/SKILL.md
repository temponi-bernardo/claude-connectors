---
name: review-pr
description: Use once per PR, after the last commit and a green pr:check, before opening the PR (a /task step), for the independent review of the whole PR by the reviewer agent and one round of fixes. No review loop.
---

# Independent review, once per PR

One review and **one** round of fixes. There is no second review: what is left goes into the PR body
([ADR 0029](../../../docs/adr/0029-lean-claude-code-layer.md)).

## Steps

1. **Clean tree and checks done:** `git status --porcelain` empty and `npm run pr:check` already green in this
   session. `/review-pr` does not run the checks again.
2. **PR range:** `git fetch origin main` and `git merge-base origin/main HEAD`. The range is `<merge-base>..HEAD`.
3. **Review with the `reviewer` agent**, passing only the range. It does not get this session's history, on
   purpose.
4. **Fix once.** For each finding: fix what holds or note why not, run only the tests of what changed and commit
   the fixes. **Don't call the reviewer again.** If a fix touched code, rerun `npm run pr:check` before merging.
5. **Report** to the user in at most 5 lines: verdict, what was fixed and what was left. A finding that was left
   goes into the PR body ("Review" section).

## Don't

Don't run `/review-pr` on every commit; don't enter a review loop; don't skip it on a PR that changes code.
