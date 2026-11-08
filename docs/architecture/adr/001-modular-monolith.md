# ADR-001: Modular Monolith and Domain Boundaries

## Status

**Accepted.**

## Context

BrewLite has one Next.js frontend and one NestJS backend. The backend imports `ProductsModule`, `AuthModule`, `OrdersModule`, `PaymentsModule`, and `CouponsModule` into one `AppModule` ([`backend/src/app.module.ts:4-14`](../../../backend/src/app.module.ts#L4-L14)). Prisma is the shared persistence boundary for PostgreSQL ([`backend/src/prisma/prisma.service.ts:6-33`](../../../backend/src/prisma/prisma.service.ts#L6-L33)). Order, inventory, coupon, loyalty and payment-finalization work require coordinated database transactions.

## Decision

Use a Next.js frontend with a NestJS **modular monolith** organized by domain modules, backed by Prisma and PostgreSQL. Controllers remain HTTP boundaries; services own domain orchestration; Prisma is injected through `PrismaModule`. Background expiration and reconciliation remain in the NestJS process unless a separately approved decision changes that boundary.

## Alternatives Considered

- **Microservices per domain:** rejected for current scope; it would add deployment, contract, distributed-tracing and cross-service consistency work.
- **Single unstructured NestJS module:** rejected because it weakens ownership of Auth, Orders, Payments and other domain boundaries.
- **Serverless functions per endpoint:** not selected; long-running scheduler and transaction/locking concerns need separate design evidence.

## Rationale

The modular monolith matches the existing implementation and preserves a single ACID database boundary for payment finalization and order mutations. It is proportionate to the team/project scope while retaining module-level separation. It does not claim that modules can be deployed independently.

## Consequences

**Positive:** simpler local topology; shared TypeScript conventions; direct transactional coordination; focused module ownership.

**Negative:** one backend deployment/process is a shared availability boundary; module coupling must be controlled in code review.

**Risks:** in-process timers depend on backend availability; multi-instance scaling behaviour is **UNVERIFIED**.

## Verification / Acceptance Conditions

- Module boundaries remain visible in `AppModule` and domain module definitions.
- Cross-domain changes identify transaction and ownership consequences.
- Any move to independently deployed services requires a new approved ADR and operational evidence.

## References

- [Architecture Overview](../architecture.md#4-backend-modular-monolith-architecture)
- [`backend/src/app.module.ts`](../../../backend/src/app.module.ts)
- [`backend/src/payments/payments.module.ts`](../../../backend/src/payments/payments.module.ts)
