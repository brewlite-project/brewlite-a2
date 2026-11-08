# ADR-003: Payment Finalization, Locking and Idempotency

## Status

**Accepted.**

## Context

Payment can affect Order state, inventory, coupon redemption and loyalty points. The audited implementation documents `PaymentFinalizationService.finalizeInTransaction()` as a shared finalization boundary whose caller owns the database transaction ([`backend/src/payments/payment-finalization.service.ts:143-152`](../../../backend/src/payments/payment-finalization.service.ts#L143-L152)). The method locks Order first, then VNPay Payment where applicable ([`payment-finalization.service.ts:153-185`](../../../backend/src/payments/payment-finalization.service.ts#L153-L185), [`:388-409`](../../../backend/src/payments/payment-finalization.service.ts#L388-L409)).

## Decision

Use shared payment finalization within caller-owned PostgreSQL transactions. Preserve Order-first locking, bounded transaction retry/timeout policy, provider-specific idempotency controls, and database constraints as complementary controls.

The architecture includes:

- conditional inventory reservation and transactional release on cancellation;
- held/consumed/released coupon consistency and loyalty award in finalization;
- Mock, ZERO_AMOUNT and VNPay providers with provider-aware validation;
- verified VNPay IPN callback and QueryDR reconciliation path;
- VNPay grace handling and financial-exception/review state.

Provider idempotency boundaries are intentionally distinct:

- **Mock:** request hash, `Idempotency-Key`, advisory lock, unique `(user_id, idempotency_key)` constraint and persisted response-snapshot replay are implemented in `PaymentsService` ([`backend/src/payments/payments.service.ts:77-166`](../../../backend/src/payments/payments.service.ts#L77-L166), [`:223-240`](../../../backend/src/payments/payments.service.ts#L223-L240)).
- **ZERO_AMOUNT:** provider-specific request hash and the same user/key advisory-lock ordering are implemented in `ZeroAmountPaymentService`; replay is resolved through shared finalization ([`backend/src/payments/zero-amount-payment.service.ts:57-112`](../../../backend/src/payments/zero-amount-payment.service.ts#L57-L112), [`:126-160`](../../../backend/src/payments/zero-amount-payment.service.ts#L126-L160)).
- **VNPay:** verified gateway event identity, duplicate-event detection, persisted Payment state, event uniqueness and shared finalization protect callback/reconciliation processing ([`backend/src/payments/payment-finalization.service.ts:408-420`](../../../backend/src/payments/payment-finalization.service.ts#L408-L420); [`backend/prisma/schema.prisma:326-353`](../../../backend/prisma/schema.prisma#L326-L353)). VNPay is not asserted to use the Mock/ZERO_AMOUNT advisory-lock workflow.

## Alternatives Considered

- **Independent provider-specific finalizers:** rejected because duplicated side-effect logic risks divergent inventory/coupon/loyalty behaviour.
- **Client-determined payment outcome:** rejected; finalization must use persisted Order state and verified gateway evidence.
- **No idempotency/locking:** rejected because retries and concurrent attempts could duplicate financial side effects.
- **Automatically fail pending VNPay on timeout:** rejected; timeout or missing IPN is not proof of failed payment.

## Rationale

The design keeps Payment, Order, Coupon and Loyalty changes atomic when invoked by the caller-owned transaction, and uses Order-first locking to establish a consistent mutation order. Database constraints protect selected invariants; provider-specific application logic protects request replay or gateway-event duplication and cross-row lifecycle rules.

## Consequences

**Positive:** replayable requests, one-success safeguards, controlled stock release and a verified-gateway path.

**Negative:** payment code is transaction/lock-order sensitive and requires careful regression review.

**Risks:** this architectural decision does not prove exclusive use of the finalizer across every repository path, nor prove concurrency tests were run in SCRUM-107. QueryDR Sandbox E2E remains **UNVERIFIED**.

## Verification / Acceptance Conditions

- Payment changes preserve shared-finalization, ownership, Order-first locking and the applicable provider-specific idempotency boundary.
- Relevant automated/integration evidence must be run in an approved isolated environment before acceptance claims.
- IPN/QueryDR production or Sandbox E2E claims require external evidence; repository code alone is insufficient.
- Financial-exception and grace-period behaviour must remain traceable to source, contract and approved business rules.

## References

- [Architecture Overview](../architecture.md#8-payment-architecture)
- [`backend/src/orders/inventory-policy.ts`](../../../backend/src/orders/inventory-policy.ts)
- [`backend/src/payments/payment-finalization.service.ts`](../../../backend/src/payments/payment-finalization.service.ts)
- [ADR-P2 QueryDR Sandbox E2E Deferred](../../decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md)
