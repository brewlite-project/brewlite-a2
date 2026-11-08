# ADR-002: Database Schema Authority and Migration Policy

## Status

**Accepted.**

## Context

BrewLite uses multiple artifacts that describe different aspects of the system. Prisma models provide ORM mapping; tracked SQL migrations contain PostgreSQL-specific partial indexes and CHECK constraints that Prisma cannot fully express. For example, the active-order partial unique index is defined in SQL ([`20261022011000_scrum36_active_order_coupon_constraints/migration.sql:6-12`](../../../backend/prisma/migrations/20261022011000_scrum36_active_order_coupon_constraints/migration.sql#L6-L12)); Phase 2 payment constraints are also SQL migration content ([`20261031190100_scrum76_payment_gateway_delta/migration.sql:78-117`](../../../backend/prisma/migrations/20261031190100_scrum76_payment_gateway_delta/migration.sql#L78-L117)).

## Decision

Classify authorities by domain rather than impose one universal precedence order:

| Artifact | Responsibility |
| --- | --- |
| Requirements / Use Case / Business Rules | Intended business behaviour |
| Approved API Contract | HTTP interface contract |
| `schema.prisma` | ORM representation and generated-client mapping |
| SQL migrations | Physical schema history and PostgreSQL-specific constraints |
| Source implementation | Actual behaviour at the reviewed commit |
| DBML / diagrams | Design documentation requiring reconciliation |

Schema changes require an updated Prisma schema when applicable, a reviewed tracked migration, and explicit consideration of PostgreSQL-specific constraints. Existing migration history is immutable; new changes are additive migrations rather than rewrites. A tracked migration is not evidence that it has executed on any particular database.

## Alternatives Considered

- **DBML as universal source of truth:** rejected; it cannot replace approved HTTP/business contracts or applied migration history.
- **Prisma schema as complete physical schema authority:** rejected; partial indexes and CHECK constraints are maintained in SQL.
- **Source code as the only authority:** rejected; it cannot document intended behaviour or prove physical DB constraints.

## Rationale

The decision avoids a false hierarchy across unrelated concerns while making migration review the required place to verify physical PostgreSQL invariants.

## Consequences

**Positive:** clearer review responsibility; preserves database history; makes DB-specific enforcement explicit.

**Negative:** a schema change can require synchronized updates across several artifacts.

**Risks:** conflicting documentation can mislead implementers. Such conflicts must be recorded for review, not silently resolved by an assumption.

## Verification / Acceptance Conditions

- New schema changes include a reviewed migration file and relevant Prisma mapping.
- Migration review checks indexes, CHECK constraints, foreign keys and rollback/compatibility risk.
- Runtime migration status is captured only from an approved environment; it is **UNVERIFIED** by repository inspection alone.

## References

- [Architecture Overview](../architecture.md#6-postgresql-prisma-and-schema-management)
- [`backend/prisma/schema.prisma`](../../../backend/prisma/schema.prisma)
- [`backend/prisma/migrations/`](../../../backend/prisma/migrations/)
