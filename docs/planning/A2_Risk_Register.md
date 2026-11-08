# BrewLite Assignment 2 — Risk Register

**Status:** DRAFT
**Date:** 2026-11-08
**Rule:** Probability/impact are initial planning judgments, not measured statistics. Reassess daily and attach links to evidence. Do not record mitigations as completed before testing.

| ID | Risk | Likelihood | Impact | Early warning | Prevention / mitigation | Contingency | Proposed owner | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | Production provider cannot deploy Next/Nest/PG within time or quota | High | Critical | Account provisioning fails; builds/timeouts | Decide platform immediately; tiny proof-of-deployment before final architecture sign-off | Switch provider/topology; keep minimal cloud design that satisfies HTTPS/API/private DB | Platform lead TBD | OPEN |
| R-02 | Changes to repo layout break builds, imports, Compose or Prisma paths | High | High | CI fails after `git mv` | Dedicated move-only PR; inventory paths; test before/after; no feature refactor | Revert move PR in A2 only; A1 remains intact | FE/BE lead TBD | OPEN |
| R-03 | A2 Compose accidentally reuses A1 DB/volume/containers | Medium | Critical | `docker compose config` shows A1 project/volume | Unique `-p`/COMPOSE_PROJECT_NAME, DB name and volume; inspect config before `up` | Stop A2 project without `-v`; restore known A1 environment if affected | Platform lead TBD | OPEN |
| R-04 | CI green despite missing required test stage or unprotected merge | High | High | PR merged with skipped/missing tests | Separate required jobs; branch protection; capture green and controlled failure proof | Block merge, fix pipeline, rerun PR | CI owner TBD | OPEN |
| R-05 | Browser E2E flaky or absent | Medium | High | Only JSDOM suites or intermittent browser failure | Minimal deterministic menu→checkout flow on isolated DB; avoid VNPay live external dependency | Record blocker honestly; prioritize reproducibility and separate manual Sandbox proof | QA owner TBD | OPEN |
| R-06 | Production payment can't use local Mock mode; Sandbox IPN target mismatch | High | High | Mock blocked in NODE_ENV production; IPN unresolved | Decide demo payment policy early; keep separate secrets, verify callback configuration, no secret logs | Provide compliant simulated wallet/card path with security review; do not falsely claim Sandbox E2E | Backend/payment lead TBD | OPEN |
| R-07 | Migration/seed fails on fresh A2 production DB | Medium | Critical | Startup succeeds but catalog empty / migration error | Run clean migration/seed on isolated DB, preflight allowlists; test production-compatible execution | Restore backup/snapshot; rollback app, do not destructive reset live DB | DB lead TBD | OPEN |
| R-08 | Deployment diagram/ADR disagrees with actual hosting | Medium | Medium | Services shown that don't exist | Update docs after proof-of-deployment; link services and source paths | Flag limitation and revise documentation before Task 3 acceptance | Architecture owner TBD | OPEN |
| R-09 | Historical A1 commits misrepresented as A2 workflow evidence | Medium | High | Task 1–5 share one late commit with no reviews | Separate A2 PRs and sequence acceptance, GitHub/Jira links | Rebuild evidence trail prospectively, never fake dates | Leader | OPEN |
| R-10 | Secrets appear in repo, logs or screenshots | Medium | Critical | Scans or PR reviewers detect credentials | `.gitignore`, GitHub secrets, redact logs, security review | Rotate exposed secrets immediately, purge where appropriate and document incident | All contributors | OPEN |
| R-11 | A2 production DB exposed publicly | Medium | Critical | Public inbound PostgreSQL endpoint | Private networking/access controls; no public `5432`; verify reachability | Lock down endpoint and rotate credentials, redeploy safely | Platform lead TBD | OPEN |
| R-12 | Payment status endpoint mismatch remains hidden by successful happy path | Medium | High | UI polls 404 / stale result after return | Verify `/payments/:paymentId/status` vs v4 Contract and frontend; explicit decision/task | Implement owner-safe endpoint or adjust UI/contract with tests | Payment lead TBD | OPEN |
| R-13 | QueryDR Sandbox E2E incorrectly marked PASS | Medium | Medium | Evidence uses synthetic/local gateway only | Link approved deferral ADR; keep real sandbox evidence separate | Document not verified and do not count it as acceptance | Payment lead TBD | OPEN |
| R-14 | Deadline leaves no time for smoke/rollback/demo | High | High | No production URL by end of 09 Nov | Prioritize provider/CD first; reserve 11–14 Nov buffer | Reduce nonessential polish; retain functioning deploy and evidence | Leader | OPEN |

## Response priorities

1. Resolve **R-01 / R-06 / R-07** early: cloud topology, production payment path, migration safety.
2. Keep **R-03 / R-10 / R-11** as mandatory safety gates before any production-like work.
3. Enforce **R-02 / R-04 / R-05** through source-controlled PR and test evidence.
4. Update risk status at each Task acceptance and assign a concrete Jira issue to each unresolved critical risk.

## Review record

| Reviewed on | Reviewer | Changes / evidence |
|---|---|---|
| TBD | TBD | Initial risk register awaiting owner confirmation |
