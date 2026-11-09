# ADR-005: Production Hosting Target — Vercel + Render

## Status

**Proposed — not Accepted, not Deployed.**

## Context

The deployment view proposes Vercel Hobby for Next.js, Render Web Service for NestJS, Render PostgreSQL for managed data, and VNPay Sandbox for payment integration ([deployment.md](../deployment.md#2-deployment-nodes-và-artifacts), dòng 51-66). It explicitly records missing URLs, provider IDs, tier, region, branch, runtime configuration and deployment evidence ([deployment.md](../deployment.md#8-đối-chiếu-môi-trường-thực-tế-trước-nghiệm-thu-cuối), dòng 281-320).

## Decision

Treat the following topology as a **candidate target**, pending Leader approval and deployment evidence:

- Vercel Hobby hosts the Next.js frontend and proxy/server runtime.
- Render Web Service hosts the NestJS backend.
- Render PostgreSQL hosts the managed database through private backend connectivity.
- VNPay Sandbox remains the simulated external payment integration.

No provider, plan/tier, workspace, region, branch, deployment trigger, URL or secret configuration is asserted as configured.

## Alternatives Considered

- **Single-host deployment:** may reduce cross-provider networking, but requires a separately evaluated frontend/API/database offering and operational fit.
- **Container registry plus separately promoted API image:** improves explicit image provenance, but adds registry, credential and release-management work.
- **Managed platform other than Vercel/Render:** remains possible if eligibility, cost, networking or scheduler behaviour makes the candidate unsuitable.
- **Local Docker Compose as production:** rejected; it is a local architecture and not production deployment evidence.

## Rationale

The candidate separates frontend delivery, backend runtime and managed PostgreSQL responsibilities while preserving public HTTPS boundaries for browser/VNPay communication and a private path for backend-to-database traffic. It is documented as target design so that hosting assumptions remain reviewable before implementation.

## Consequences

**Positive:** clear frontend/API/database separation; expected public endpoint shape for VNPay IPN; candidate private DB connectivity; deployment view includes explicit evidence gates.

**Negative:** cross-provider frontend-to-backend communication may require CORS/fallback verification; free-tier restrictions can affect availability, scheduler execution, retention and provider eligibility.

**Risks:** private DB access, external DB disablement, backend availability/cold starts, migration rollout, rollback, CI/CD compatibility, IPN public reachability and QueryDR outbound source IP are all **UNVERIFIED**. A Vercel/Render diagram is not runtime evidence.

## Verification / Acceptance Conditions

- Leader accepts or rejects the candidate after cost, eligibility, tier, region and branch decisions.
- Public frontend/backend origins, HTTPS, proxy behaviour and CORS fallback are tested without exposing secrets.
- Backend and database private connectivity, external-access policy and persistence/retention are evidenced safely.
- An approved migration runner, CI/CD trigger, commit/artifact provenance and rollback procedure exist before deployment acceptance.
- VNPay Return, public IPN callback and QueryDR behaviour are verified in the selected environment; QueryDR Sandbox E2E remains open until external evidence exists.

## References

- [Deployment View](../deployment.md)
- [Architecture Overview](../architecture.md#10-deployment-view)
- [`frontend/app/api/backend/[[...path]]/route.ts`](../../../frontend/app/api/backend/[[...path]]/route.ts)
- [`backend/src/main.ts`](../../../backend/src/main.ts)
