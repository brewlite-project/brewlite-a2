# ADR-004: A2 Runtime and Environment Isolation

## Status

**Accepted (Architectural Decision).**

## Context

Assignment 2 must be independent from A1 in repository, runtime, database, Docker project/volume and secrets. Git read-only comparison with the available `A1-final` baseline confirms that A1 and the current A2 tracked `docker-compose.yml` and `compose.env.example` are identical. Therefore the current configuration has a **CONFIRMED CONFIGURATION COLLISION**: Compose project `brewlite_compose`, default PostgreSQL database `brewlite_compose`, logical volume `brewlite_pgdata`, network `brewlite_net`, and default host ports `15432`, `3001`, `3000` are the same ([`docker-compose.yml:1-15`](../../../docker-compose.yml#L1-L15), [`:65-104`](../../../docker-compose.yml#L65-L104); [`compose.env.example:5-17`](../../../compose.env.example#L5-L17)). The logical volume derives the same Docker volume resource name when the Compose project is the same. No `container_name` is declared; default container identity is still scoped by the colliding Compose project and service names.

## Decision

Maintain A2 as an isolated environment:

- separate repository and Git workflow;
- implementation target: Compose project `brewlite_a2`;
- database, volume/network identifiers and host ports selected specifically for A2 and not colliding with A1;
- environment-specific variables and independent secrets;
- no reuse of A1 runtime/deployment/database credentials or volumes;
- local, CI and production data/secrets remain separate trust domains.

This Accepted architectural requirement is not yet satisfied by the current tracked Compose implementation. Task 4 owns the configuration change; Task 5 owns runtime-isolation verification.

## Alternatives Considered

- **Reuse A1 Compose project/volume/database:** rejected due to collision, accidental data mutation and non-reproducible A2 evidence.
- **Share A1 secrets/runtime for speed:** rejected due to secret hygiene and inability to establish independent A2 provenance.
- **Use one environment for local, CI and production:** rejected due to unsafe data and credential coupling.

## Rationale

Isolation is necessary to make A2 deployment, migration and testing evidence attributable to A2 without changing or depending on A1 resources.

## Consequences

**Positive:** once implemented, reduces cross-assignment data loss and secret leakage risk; supports reproducible environment-specific evidence.

**Negative:** requires separate configuration and operator discipline.

**Negative / implementation blocker:** current tracked configuration does not meet this ADR. Starting A2 with the inherited project may reconcile or reuse A1-named Compose resources; the same derived volume/database and host-port bindings can cause data reuse or bind collisions.

**Risks:** the collision is confirmed at tracked-configuration level, not evidence that A1 runtime/data has already been affected. Actual A1/A2 runtime non-overlap remains **UNVERIFIED** until Task 5 evidence is reviewed. Local `compose.env` values and live Docker resources were not read in SCRUM-107.

## Verification / Acceptance Conditions

- **Task 4:** change Compose project to `brewlite_a2`; define non-colliding A2 database, volume/network identifiers and host ports; align sample environment/documentation without committing secret values.
- **Task 5:** verify isolated runtime resources, database/volume separation and port bindings in an approved environment; record evidence safely without credential values.
- CI and production use separate databases and secret scopes.
- This ADR does not require starting A1 or A2 during SCRUM-107.

## References

- [Architecture Overview](../architecture.md#10-deployment-view)
- [Deployment View](../deployment.md#11-local--ci--production-là-các-phạm-vi-riêng)
- [`docker-compose.yml`](../../../docker-compose.yml)
- [`compose.env.example`](../../../compose.env.example)
- `A1-final:docker-compose.yml` and `A1-final:compose.env.example` (Git read-only comparison)
