# BrewLite Assignment 2 — Implementation Plan

**Status:** PROPOSED / NOT APPROVED
**Date:** 2026-11-08
**Baseline:** `A1-final` → `1951dc124c83359556f04adb6ba3f0ee9f22fce4`
**Repo:** `brewlite-project/brewlite-a2`
**Jira:** reuse existing BrewLite Jira project; create new A2 Epic/issues; do not rewrite A1 issue history.

## Objectives and non-goals

Deliver the existing BrewLite app as an auditable A2 process: requirements → modeling → architecture → Sprint 1/CI → Sprint 2/CD → online production deployment. Keep current Next.js, NestJS, TypeScript, PostgreSQL, Prisma and Docker stack.

**Non-goals:** feature rewrite, redesign, new admin module, DB schema overhaul without an A2 requirement, untested production payment bypass. A1 repository, tag, local DB volume and demo environment remain untouched.

## Git and evidence policy

1. `main` = release branch, `dev` = integration. Feature branches start at up-to-date `dev` (`git switch dev && git pull --ff-only origin dev`).
2. Each A2 Jira issue uses an issue key in branch/commits/PR title; PR base `dev`. A reviewer approves and required CI checks pass before merge.
3. Planning may be committed independently, but acceptance of **Task 1 → Task 2 → Task 3 → Task 4 → Task 5** must be sequential and evidenced. Do not fabricate commit dates, Scrum meetings or already-completed work.
4. `A1-final` is a provenance tag, not A2 release. A2 final release gets a new tag (e.g., `A2-v1.0.0`) only after verification.
5. Keep secrets out of commit, CI logs, screenshots and PR descriptions.

## Timeline (target, not guarantee)

| Date | Target / evidence | Dependency |
|---|---|---|
| 08 Nov | Repo baseline verified; planning docs; choose production hosting; draft Task 1 requirements and begin diagrams | A1 tag and A2 repo complete |
| 09 Nov | Task 1/2/3 gated merges; controlled path migration; CI gate and Sprint 1 MVP validation | Written source of truth and hosting ADR |
| 10 Nov | Sprint 2, browser E2E, isolated DB/Compose, real CD deploy, production smoke, release notes/rollback/demo evidence | CI and hosting access |
| 11 Nov | Class-ready demo and instructor feedback; no major change unless needed | Reachable production |
| 12–14 Nov | Buffer: regression, remediation, rehearsal, oral-defense preparation | All critical requirements met |
| 15 Nov | Grading milestone (date reported by group; confirm with instructor) | Release evidence |

**Schedule risk:** two-day completion of production + CI/CD is ambitious. Start feasibility checks immediately; parallel preparation is allowed, but formal Task acceptance must remain ordered.

## Proposed work breakdown (Jira keys TBD)

| Stage | Proposed issue / deliverable | Suggested role (confirm assignment) | Acceptance gate |
|---|---|---|---|
| Planning | Gap Analysis, Risk Register, hosting decision | Leader + platform lead | Reviewed decision record |
| T1 | Context & scope; stakeholders | Requirements owner | Required Markdown + review |
| T1 | SRS FR/NFR/MoSCoW/AC and overall UC | Requirements + modeling owner | Stable IDs / testable AC |
| T1 | Detailed checkout/payment UC | Requirements + payment reviewer | Alternative/exception paths and FR links |
| T2 | Activity + Sequence source/render | Modeling owners | Covers JWT, DB transaction, idempotency, payment branches |
| T2 | Domain Class Diagram | Modeling + DB owner | Required classes, enums, multiplicities |
| T3 | Architecture doc + ADRs | Backend/platform owners | Clear modules, trade-offs, operations |
| T3 | Deployment diagram | Platform owner | Mirrors chosen real platform |
| T4 | Root structure migration + scripts/Compose | Platform + FE/BE owners | Post-move build/tests/demo PASS |
| T4 | PR CI and branch protection | CI owner | Install→Lint→Unit→Build with green/fail evidence |
| T4 | MVP re-verification and mobile-first | FE + BE owners | API/UX tests and responsive evidence |
| T5 | Browser E2E + integration/migration | QA + FE/BE owners | Reliable isolated test run |
| T5 | Production deployment + CD + rollback | Platform owner + leader | Real HTTPS URLs; image, migration and smoke evidence |
| T5 | Traceability, README, review/retro/demo | Docs owners + leader | Links and acceptance records |

**People currently known:** Khang (leader), Thụy, Hoàng, Khánh, CKhang, Lập. No fixed A2 ownership or Scrum role is asserted until the group confirms availability and capabilities.

## Execution and gate sequence

### Preparation
- Check Git baseline/remote/tag and do not start inherited Compose in the A2 directory.
- Choose production hosting topology. Record costs and operational limitations.
- Decide A2 environment identity (unique Compose project and DB volume); never reuse A1 volumes.

### Task 1: Requirements
- Normalize current requirements into `docs/requirements/context-and-scope.md`, `srs.md`, chosen `use-case.md`, plus overall UC diagram source/render.
- Generate traceable FR/NFR IDs and AC.
- **Gate:** review and merge Task 1 PR(s), record commit and reviewer.

### Task 2: Modeling
- Activity, Sequence and domain Class Diagrams with source + exports.
- Compare against accepted Task 1 and actual schemas/payment lifecycle.
- **Gate:** review and merge Task 2 PR(s).

### Task 3: Architecture
- Create C4/layered architecture and concise ADRs; deployment diagram matching selected production provider.
- Include private PostgreSQL, HTTPS, secrets, health, logs, registry (if used), CI boundary and rollback.
- **Gate:** review and merge Task 3 PR(s).

### Task 4: Sprint 1
- Perform a read-only baseline health test in *isolated A2* environment first.
- Move `frontend/ → apps/web/`, `backend/ → apps/api/` in one dedicated PR; avoid concurrent feature refactor. Update paths in Compose, Dockerfiles, CI, scripts, Prisma and docs. `git mv` helps record intent but rename detection is heuristic.
- Install/build/test all packages; verify menu endpoint and mobile UI states.
- Implement PR CI: install, lint, unit test, build, with required checks and both green/fail evidence.
- **Gate:** PR checks enforced, isolated startup and basic MVP proved.

### Task 5: Sprint 2 and Delivery
- Verify full checkout (use isolated database and no real financial credentials in tests), one automated browser E2E and relevant integration tests.
- Produce reproducible migrations + seeds, health and Compose setup.
- Build/tag image and deploy via secrets; migrate safely; run production smoke and define rollback behavior.
- Record frontend/API URLs, release notes, demo, Sprint Review/Retro, updated `docs/traceability-matrix.md`.
- **Gate:** production URLs accessible to an outsider, required checks passed, release/rollback evidence complete.

## Decision log (to complete before distributing tasks)

| Decision ID | Topic | Status | Decision/owner |
|---|---|---|---|
| DEC-A2-01 | A1 baseline/provenance | CHOSEN | `A1-final` / `1951dc1` |
| DEC-A2-02 | Jira | CHOSEN | Same BrewLite project; distinct A2 Epic/issues and Sprint 1/2 |
| DEC-A2-03 | A1 runtime isolation | CHOSEN | Separate repo, Compose project, DB/volume, secrets |
| DEC-A2-04 | Hosting architecture | OPEN | Provider, price, web/API/DB layout |
| DEC-A2-05 | Production payment demo | OPEN | Environment-safe Mock/VNPay strategy |
| DEC-A2-06 | Branch protections + CI gating | OPEN | Exact required checks and GitHub settings |
| DEC-A2-07 | Task ownership and sprint scheduling | OPEN | Confirmed names and due dates |

## Pre-merge checks for planning PR

- [ ] Claims distinguish historical A1 evidence from A2 validation.
- [ ] Files reside under `docs/planning/`.
- [ ] No secrets, absolute personal paths or invented Jira IDs.
- [ ] Markdown links and filenames are correct.
- [ ] `git diff --check` passes; reviewer confirms status is PROPOSED until signed off.
