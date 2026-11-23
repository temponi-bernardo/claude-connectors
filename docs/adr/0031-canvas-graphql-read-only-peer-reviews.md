# 0031 — Read-only Canvas GraphQL for the student's peer reviews

- **Status:** Accepted
- **Date:** 2026-11-23
- **Related:** ADR 0010, ADR 0027

## Context

Peer reviews assigned to a student showed in the Canvas app's "To do" but not in the connector. Two causes:
`upcoming_assignments` started its planner window at "now", so a review due at 00:00 today was already out; and
no tool listed the reviews to do. Calls with a real student token on 2026-11-23 showed:

| Route                                                                                  | Student result                                                                                                 |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `GET /api/v1/planner/items`                                                            | 200; peer reviews come as `plannable_type: "assessment_request"`, `html_url` of the review page                |
| `GET /api/v1/courses/:c/assignments/:a/peer_reviews`                                   | 200, but only the reviews **of the student's own submission** (who reviews them), not the ones they must do    |
| `GET /api/v1/courses/:c/assignments/:a/submissions/self?include[]=assessment_requests` | 200, but `assessment_requests` is ignored                                                                      |
| `GET /api/v1/users/self/todo`                                                          | 200, submissions only; no peer reviews                                                                         |
| `GET /api/v1/courses/:c/assignments/:a/anonymous_submissions/:anonymous_id`            | 200 with the reviewee's URL, one review at a time and only pending ones (ids from the planner)                 |
| `POST /api/graphql` → `assignment.assessmentRequestsForCurrentUser`                    | 200; every review to do, pending and completed, with anonymous id, reviewee (null if anonymous) and submission |

## Decision

1. `list_peer_reviews` reads `Assignment.assessmentRequestsForCurrentUser` through Canvas GraphQL, one query per
   assignment that has `peer_reviews: true` (found with the paginated REST listing).
2. GraphQL is **read-only** in this connector: the client's `query` sends only the connector's constant query
   documents, and `isReadOnlyGraphql()` refuses any document with `mutation` or `subscription` before calling
   Canvas. Variables carry the ids; ids are validated as digits (`canvasIdSchema`).
3. When the instructor turns on anonymous peer reviews, Canvas returns `user: null`. The tool says the name is
   hidden and never tries to unmask the reviewee (for example through the submission's `preview_url`).
4. The planner window starts at 00:00 of today in `America/Sao_Paulo`, and `assessment_request` is shown as
   `peer_review`.
5. Every Canvas call times out after 30 s (`CANVAS_TIMEOUT_MS`), and the course sweep runs at most
   `PEER_REVIEW_CONCURRENCY` calls at once per level.

## Consequences

- The connector depends on one GraphQL field besides REST. If Canvas changes it, `list_peer_reviews` fails with
  the GraphQL error message and `upcoming_assignments` still shows the pending reviews.
- Sweeping every active course costs one REST listing per course plus one GraphQL query per peer-review
  assignment.
- No new host or permission: GraphQL is on the same Canvas host, with the same user token.
