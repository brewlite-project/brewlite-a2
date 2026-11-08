# BrewLite Assignment 2 — Gap Analysis (A1 → A2)

**Status:** DRAFT — review required, not an approved acceptance record
**Prepared:** 2026-11-08
**Baseline:** repository `brewlite-project/brewlite`, annotated tag `A1-final`, commit `1951dc124c83359556f04adb6ba3f0ee9f22fce4`
**Target:** repository `brewlite-project/brewlite-a2`, branches `main` and `dev` initially at the same baseline commit
**Primary specification:** `Assignment2-BrewLite`, version 1.0, sections 1–9. A1 source: `BrewLite-CongNghePhanMem`, version 1.0.

> **Assessment rules:** `BASELINE` = relevant A1 artifacts/code are known to exist but must be mapped to A2; `VERIFY` = evidence incomplete or current code not inspected to acceptance depth; `NEW` = required A2 deliverable not yet demonstrated; `DEFERRED` = approved A1 limitation, not an A2 PASS. No checkmark here constitutes professor acceptance.

## 0. Confirmed baseline and boundaries

- A1 final tag and production-release branch for *A1* are at the commit above. Local manual regression was reported PASS for menu, cart, authentication, order, VNPay Sandbox successful payment and history. Three Compose services were healthy; GET backend/products/proxy returned HTTP 200; catalog count was 9.
- A1 is a **local demo**, not an internet-accessible production deployment. The containers' running image provenance relative to the tagged commit has **not** been independently recorded.
- A1 and A2 repositories are separate. At creation, A2 inherited Git object history and tag, **not** GitHub PR reviews, issues or Jira history.
- A2 must not share A1's database volume or Docker Compose project name. A2 does **not** inherit A1 running containers.
- A1's previously approved ADR defers **QueryDR Sandbox E2E** to A2; synthetic/local tests cannot be recorded as actual Sandbox E2E.
- A1 README records a frontend call to `GET /payments/:paymentId/status` without a matching backend route at the reviewed commit. Recheck in A2 and decide whether to implement or adapt UI/contract; do not mark fixed merely because one VNPay happy path worked.

## 1. Task 1 — Requirements (2 points)

| A2 requirement (spec §3) | A1 starting point | Status | Required action / acceptance evidence |
|---|---|---|---|
| `docs/requirements/context-and-scope.md`: problem, stakeholders, goals, in/out scope, assumptions, constraints, risks | Requirements, project charter and use cases existed | BASELINE | Create concise source-controlled file with stakeholder matrix and explicit boundaries; review with leader |
| SRS with `FR-01...` / `NFR-01...` | Deep A1 Requirements | BASELINE | Establish stable IDs and source-of-truth mapping; include menu, details, cart, auth, checkout, payment, history, state, performance, security, usability, deployment |
| MoSCoW and verifiable acceptance criteria for each requirement | A1 User Stories/AC | VERIFY | Assign Must/Should/Could/Won't; link each criterion to reproducible evidence |
| Overall use-case diagram | A1 use-case work | VERIFY | Source + rendered output; reconcile actors and A2 scope |
| Detailed high-value use case with actors, trigger, pre/postconditions, main/alternative/exception flows and FR mapping | A1 checkout/payment UCs | BASELINE | Select *Place and pay order*; explicitly model out-of-stock, unauthenticated, payment failed and retry; reconcile with current implementation |

**Task 1 gate:** files merged into A2 repo with clear PR history, links and acceptance criteria; *then* Task 2 may be accepted.

## 2. Task 2 — Modeling (2 points)

| A2 requirement (spec §4) | A1 starting point | Status | Required action / acceptance evidence |
|---|---|---|---|
| Activity Diagram(s): start/end, actor/system actions, decisions/merges, swimlanes, out-of-stock/not logged in/payment failure | A1 Activity Diagrams | VERIFY | Update to latest UC and payment lifecycle; save source and export |
| Sequence Diagram for Task 1.3: Customer → Next UI → Nest API → DB → Payment Service | A1 Sequence Diagrams | VERIFY | JWT, DTO validation, transaction, stock, success/failure, idempotency/retry and final user result; save source `.puml`/`.mmd` and `.svg`/`.pdf` |
| Domain Class Diagram incl. User, Product, Order, OrderItem, Payment, Promotion, LoyaltyTransaction | Domain model/Prisma ERD | VERIFY | Proper classes, attributes, relationships, multiplicities, status enums, not just ERD table boxes |
| Cross-document consistency | A1 requirements and API v4.0 exist | VERIFY | Review SRS ↔ UC ↔ diagrams ↔ schema/code and log decisions |

**Task 2 gate:** all three model types, sources and rendered exports committed, checked against accepted Task 1.

## 3. Task 3 — Architecture (2 points)

| A2 requirement (spec §5) | A1 starting point | Status | Required action / acceptance evidence |
|---|---|---|---|
| Architecture (C4 or layered): Next.js mobile-first/PWA, NestJS modules, PostgreSQL + migrations, mock payments, logging/health/config | A1 stack, Docker and payment architecture docs | BASELINE | Produce `docs/architecture/architecture.md` with interactions, operations, limitations and trade-offs |
| Short ADRs in `docs/architecture/adr/` | A1 decisions/ADRs | BASELINE | Preserve original decisions; create A2 ADRs for repository layout, environment isolation, hosting, CI/CD and payment demo |
| Deployment Diagram mapping actual selected production provider/CDN/API/DB/registry, HTTPS, private DB, secrets, health/log, local/CI/prod boundaries | No verified production environment | NEW | Select platform first, implement then update diagram to accurately reflect actual deploy |

**Task 3 gate:** hosting/platform decision recorded and deployment diagram traceable to actual services and configuration, not hypothetical architecture.

## 4. Task 4 — Sprint 1 (2 points)

| A2 requirement (spec §6) | A1 starting point | Status | Required action / acceptance evidence |
|---|---|---|---|
| Repository + `apps/web`, `apps/api`, `docs`, branch/PR process, README, `.gitignore`, `.env.example`, backlog/DoD | A2 repo exists; directories still `frontend/`, `backend/` | NEW | Baseline validation; move *without feature refactor* in separate PR, update external paths, build/test/Compose independently |
| All Task 1–3 artifacts under `docs` | A1 documents and A2 planning started | NEW | Commit docs with review history; ensure canonical sources are identified |
| MVP menu: GET products/detail, mobile-first UI, loading/empty/error, seed, minimal API/component tests | Core A1 implementation present | VERIFY | Re-run tests after move, review mobile viewport and actual states |
| PR CI **Install → Lint → Unit Test → Build**, fail blocks merge | A1 tests exist; A2 pipeline not established | NEW | GitHub Actions, required status checks, real green PR and intentionally failed check evidence (safe test PR); do not bypass policy |

**Task 4 gate:** clean clone can build/test and run core MVP after path migration; mandatory CI proven on PR and enforced.

## 5. Task 5 — Sprint 2, CI/CD, Delivery (2 points)

| A2 requirement (spec §7–9) | A1 starting point | Status | Required action / acceptance evidence |
|---|---|---|---|
| Detail/options, cart, JWT, order, simulated wallet/card payment, confirmation, status/history, validation | A1 functional tests reported PASS | VERIFY | Repeat on A2; check Mock Payment environment policy and customer-facing production demo path |
| Unit, PostgreSQL integration, at least one *browser* E2E menu→confirmation | Many A1 unit/integration/Node-JSDOM suites | VERIFY | Run targeted suites on isolated DB; implement/verify browser E2E (e.g. Playwright) and preserve log |
| Reproducible migration/seed, Compose web/API/DB, health endpoint | A1 Compose and Prisma migration/seed | VERIFY | Separate A2 project + volume, safe seed policy, fresh-clone reproduction, meaningful DB-ready health check |
| Next.js mobile-first/PWA | Responsive UI exists but PWA not established | VERIFY | Verify manifest, icons, installability and realistic supported PWA behavior; test mobile widths |
| CD: quality gates → tagged image → registry if required → production deploy → migration → smoke → halt/rollback | No A2 CD yet | NEW | Implement GitHub Actions/deployment, release strategy and documented rollback |
| Production HTTPS frontend, API/health, non-public DB, secret hygiene | A1 local only | NEW | Real accessible URLs and connectivity; no secret in repo or logs |
| Release tag/notes, README run/test/build/deploy/rollback, demo, Sprint Review & Retro | A1 README/evidence provide base | NEW | Create A2-specific deliverables and links |
| Mandatory `docs/traceability-matrix.md` linking requirement → UC/US → design → code/API → test | No A2 matrix verified | NEW | Build IDs and links as Task 1–5 artifacts mature |

**Task 5 gate:** actual production URLs online at grading; reliable browser E2E, CI/CD evidence, release and rollback instructions. A local-only Compose deployment is insufficient.

## 6. Highest-risk dependencies / blockers

1. **Production feasibility:** provider choice, pricing/free-tier limits, deploy and private PostgreSQL connectivity; must verify early.
2. **Payment in production:** A1 Mock Payment policy disallows unsafe production enablement; choose a properly isolated demo/sandbox option, avoid bypassing protections. Confirm merchant IPN routing before relying on VNPay.
3. **Repository migration:** root paths, Compose build contexts, `.dockerignore`, Next/Nest scripts, Prisma and GitHub workflows must change together and be regression-tested.
4. **Historical evidence:** inherited A1 commits are not substitutes for A2 Task 1–5 PR/CI evidence; create visible A2 milestones in sequence.
5. **Source consistency:** outstanding payment-status API mismatch and QueryDR E2E deferral; explicitly triage.
6. **Time:** target engineering completion by 2026-11-10 is *aspirational*, not assured; prioritize deploy and CI groundwork alongside documents without accepting Task n+1 before Task n.

## 7. Decisions pending (do not mark approved yet)

- Production topology and platform for web/API/PostgreSQL/registry; domain/HTTPS strategy, cost and quota.
- Payment demo policy: Mock under safe non-production mode vs VNPay Sandbox in hosted deployment, and whether A2's required wallet/card simulation can be verified securely.
- A2 Compose project name, DB name, env files, seed test policy and local port collision rules.
- Responsible Jira owners for each task; exact Sprint date boundaries, reviews and resource availability.
- Source of truth for final SRS/UC/API/Prisma and authoritative diagrams.
- Acceptance decision on missing payment-status endpoint and scope of QueryDR Sandbox E2E.

## 8. Evidence index (populate with A2 PRs)

| Gate | PR / commit | Checks/log evidence | Reviewer | Approved on |
|---|---|---|---|---|
| Task 1 | TBD | TBD | TBD | TBD |
| Task 2 | TBD | TBD | TBD | TBD |
| Task 3 | TBD | TBD | TBD | TBD |
| Task 4 | TBD | TBD | TBD | TBD |
| Task 5 | TBD | TBD | TBD | TBD |

**This matrix is a planning artifact, not the required `docs/traceability-matrix.md`.**
