# BrewLite A2 — Architecture Overview

| Thuộc tính | Giá trị |
| --- | --- |
| Task | SCRUM-107 — A2-T3.1 Architecture & ADR |
| Trạng thái | **REVIEWED — Technical Content Approved; final integration pending** |
| Phạm vi source audit | Branch `SCRUM-107-architecture-and-adr` tại thời điểm viết tài liệu |
| Deployment View | [deployment.md](../deployment.md) — target design riêng, không phải bằng chứng production đang chạy |
| Ngoài phạm vi | Thay đổi source, schema, Docker, CI/CD, deployment và migration |

## 1. Mục đích, phạm vi và quy ước bằng chứng

Tài liệu mô tả kiến trúc hiện hữu của BrewLite A2 và ranh giới kiến trúc được đề xuất. Đây là baseline cho ADR của SCRUM-107; không thay thế API Contract, Requirements, Use Case hay tài liệu Payment Architecture chi tiết.

Các nhãn bằng chứng được dùng xuyên suốt:

| Nhãn | Ý nghĩa |
| --- | --- |
| **IMPLEMENTED** | Có source/configuration/migration tracked chứng minh cơ chế tồn tại. Không tự suy ra runtime hiện đang healthy. |
| **PLANNED** | Được mô tả cho công việc tương lai nhưng chưa có implementation/evidence runtime. |
| **UNVERIFIED** | Có thể cần runtime, external service, Leader approval hoặc evidence ngoài repository. |
| **DEFERRED** | Đã biết nhưng thuộc task/quyết định khác; không triển khai trong SCRUM-107. |
| **NOT FOUND** | Không tìm thấy bằng chứng implementation trong phạm vi audit. |

Không có một nguồn luôn thắng mọi lĩnh vực. Mỗi nguồn có vai trò riêng:

| Lĩnh vực | Nguồn diễn giải | Vai trò |
| --- | --- | --- |
| Requirements, Use Case, Business Rules | Tài liệu được Leader xác nhận | Intended business behaviour |
| HTTP interface | API Contract đã approved | Request/response, HTTP status, error code, authentication contract |
| ORM | `schema.prisma` | ORM representation và type mapping |
| Physical database | SQL migrations | Schema history và PostgreSQL-specific partial indexes/CHECK constraints |
| Runtime behaviour | Implementation source | Actual source behaviour tại commit được audit |
| Design description | DBML, architecture/deployment diagrams | Design documentation, cần đối chiếu lại source và quyết định approved |

Khi các nguồn mâu thuẫn, tài liệu ghi nhận mâu thuẫn để Leader review thay vì tự động tuyên bố một nguồn luôn đúng. Header API Contract v4.0 còn ghi metadata chưa approved; version HTTP contract canonical vẫn cần Leader xác nhận ([deployment.md](../deployment.md#9-nguồn-dự-án-và-lưu-ý-baseline), dòng 324-330).

## 2. Architecture overview theo C4

**IMPLEMENTED:** BrewLite là một **modular monolith**. Một Next.js frontend gọi một NestJS application; NestJS imports các domain module trong cùng process và Prisma truy cập một PostgreSQL database. `AppModule` imports `ProductsModule`, `AuthModule`, `OrdersModule`, `PaymentsModule`, `CouponsModule` tại [`apps/api/src/app.module.ts:4-14`](../../apps/api/src/app.module.ts#L4-L14). Đây không phải microservices architecture.

**PLANNED:** Production hosting target là Vercel Hobby cho frontend, Render Web Service cho backend và Render PostgreSQL cho database. Đây chỉ là target design; không có production URL, service ID hay runtime evidence ([deployment.md](../deployment.md#8-đối-chiếu-môi-trường-thực-tế-trước-nghiệm-thu-cuối), dòng 281-303).

### 2.1 System Context Diagram

```mermaid
C4Context
    title BrewLite A2 — System Context (logical communication; deployment unverified)
    Person(customer, "Customer", "Đăng nhập, đặt hàng và thanh toán")
    System(brewlite, "BrewLite", "Next.js UI, NestJS modular monolith, PostgreSQL")
    System_Ext(vnpay, "VNPay Sandbox", "Hosted payment page, IPN, QueryDR")

    Rel(customer, brewlite, "Uses UI; requests Return URL after browser redirect", "HTTPS / REST JSON")
    Rel(brewlite, customer, "Returns signed payment URL through frontend API response", "REST/JSON")
    Rel(customer, vnpay, "Browser redirect to hosted payment page", "HTTPS")
    Rel(vnpay, customer, "Redirect response to BrewLite Return URL (navigation only)", "HTTPS")
    Rel(brewlite, vnpay, "QueryDR transaction-status request", "HTTPS")
    Rel(vnpay, brewlite, "IPN callback to NestJS backend", "HTTPS")
```

VNPay là external service hiện có trong source: payment module đăng ký initiation, IPN và QueryDR services tại [`apps/api/src/payments/payments.module.ts:14-19`](../../apps/api/src/payments/payments.module.ts#L14-L19). NestJS tạo signed payment URL trong xử lý initiation nội bộ và trả URL trong API response; browser mới dùng URL đó để redirect tới hosted payment page. Return chỉ là browser navigation tới frontend, không phải authoritative payment notification; authoritative finalization xử lý gateway outcome đã được backend xác minh. IPN vẫn là callback server-to-server vào backend.

### 2.2 Container Diagram

```mermaid
C4Container
    title BrewLite A2 — Container View (logical communication; deployment unverified)
    Person(customer, "Customer")
    System_Boundary(bl, "BrewLite A2") {
      Container(web, "Next.js frontend", "TypeScript, React", "UI, client state, API proxy route")
      Container(api, "NestJS backend", "TypeScript", "REST API, JWT, domain modules, schedulers")
      ContainerDb(db, "PostgreSQL", "PostgreSQL", "Transactional application data")
    }
    System_Ext(vnpay, "VNPay Sandbox", "Payment provider")

    Rel(customer, web, "Uses UI; requests Return URL after browser redirect", "HTTPS")
    Rel(web, api, "Initiates payment and calls API", "REST/JSON")
    Rel(api, web, "Returns signed payment URL in initiation response", "REST/JSON")
    Rel(api, db, "Reads/writes", "Prisma / PostgreSQL")
    Rel(customer, vnpay, "Browser redirect to hosted payment page", "HTTPS")
    Rel(vnpay, customer, "Redirect response to BrewLite /payment (navigation only)", "HTTPS")
    Rel(api, vnpay, "QueryDR transaction-status request", "HTTPS")
    Rel(vnpay, api, "IPN callback", "HTTPS")
```

Container source evidence:

- Next.js proxy supports every common HTTP method at [`apps/web/app/api/backend/[[...path]]/route.ts:13-68`](../../apps/web/app/api/backend/[[...path]]/route.ts#L13-L68).
- NestJS bootstraps `AppModule` and listens on `PORT` or `3001` at [`apps/api/src/main.ts:5-25`](../../apps/api/src/main.ts#L5-L25).
- `PrismaService` creates the PostgreSQL adapter from `DATABASE_URL`, connects on module init and disconnects on destroy at [`apps/api/src/prisma/prisma.service.ts:11-33`](../../apps/api/src/prisma/prisma.service.ts#L11-L33).

## 3. Frontend architecture

### 3.1 Next.js application and API boundary

**IMPLEMENTED:** The frontend uses Next.js App Router, React and TypeScript; scripts and dependencies are declared in [`apps/web/package.json:5-27`](../../apps/web/package.json#L5-L27). `next.config.ts` uses `output: "standalone"` ([`apps/web/next.config.ts:1-7`](../../apps/web/next.config.ts#L1-L7)).

The browser normally calls `/api/backend/*`; the Route Handler selects `BACKEND_INTERNAL_URL`, then `NEXT_PUBLIC_API_URL`, then a localhost fallback ([`apps/web/app/api/backend/[[...path]]/route.ts:5-23`](../../apps/web/app/api/backend/[[...path]]/route.ts#L5-L23)). It forwards client request headers except `host` and `content-length` ([`route.ts:25-48`](../../apps/web/app/api/backend/[[...path]]/route.ts#L25-L48)). This proxy minimizes browser CORS dependence for normal client traffic; it is not a `next.config` rewrite.

**UNVERIFIED:** Direct browser fallbacks to a public backend must be tested after deployment. Backend bootstrap has no `enableCors()` call ([`apps/api/src/main.ts:5-25`](../../apps/api/src/main.ts#L5-L25)); no claim is made that cross-origin direct calls work.

### 3.2 Authentication state and responsive UI

**IMPLEMENTED:** Frontend payment and order requests send `Authorization: Bearer <token>` through the proxy; examples are in [`apps/web/services/payment.service.ts:870-880`](../../apps/web/services/payment.service.ts#L870-L880) and [`apps/web/services/order.service.ts:1014-1030`](../../apps/web/services/order.service.ts#L1014-L1030). Authentication service persists token/user state in `localStorage` ([`apps/web/services/auth.service.ts:206-259`](../../apps/web/services/auth.service.ts#L206-L259)). This is a deliberate current-client implementation, not HttpOnly-cookie authentication.

**Trade-off:** `localStorage` makes client bearer-token use straightforward but increases exposure if an XSS flaw exists. Server-side JWT verification and ownership checks remain mandatory; frontend state is never authorization proof.

**IMPLEMENTED:** Responsive Tailwind breakpoints are present, for example catalog grid adapts from one to four columns at [`apps/web/components/ProductSkeletonGrid.tsx:117`](../../apps/web/components/ProductSkeletonGrid.tsx#L117) and product cards adapt at [`apps/web/app/page.tsx:360-365`](../../apps/web/app/page.tsx#L360-L365). This is evidence of responsive/mobile-oriented UI code only.

**NOT FOUND:** No PWA manifest, service worker, Workbox configuration, or installability evidence was found; a favicon alone is not PWA implementation. PWA must not be marked PASS. The A2 gap analysis independently records PWA as needing verification ([`docs/planning/A2_Gap_Analysis.md:70-73`](../planning/A2_Gap_Analysis.md#L70-L73)).

## 4. Backend modular-monolith architecture

### 4.1 Module boundaries

| Module | Responsibility evidenced in source | Status |
| --- | --- | --- |
| `AuthModule` | Registration, login, JWT strategy/guard, profile lookup | IMPLEMENTED; [`apps/api/src/auth/auth.module.ts:11-29`](../../apps/api/src/auth/auth.module.ts#L11-L29) |
| `ProductsModule` | Product catalog API/domain | IMPLEMENTED; imported by `AppModule` at [`app.module.ts:4-11`](../../apps/api/src/app.module.ts#L4-L11) |
| `OrdersModule` | Order creation/history, inventory policy, expiration scheduler, internal order API | IMPLEMENTED; [`apps/api/src/orders/orders.module.ts:1-32`](../../apps/api/src/orders/orders.module.ts#L1-L32) |
| `CouponsModule` | Coupon preview/domain API | IMPLEMENTED; [`apps/api/src/coupons/coupons.module.ts:1-12`](../../apps/api/src/coupons/coupons.module.ts#L1-L12) |
| `PaymentsModule` | Mock, ZERO_AMOUNT, VNPay, shared finalization and reconciliation | IMPLEMENTED; [`apps/api/src/payments/payments.module.ts:34-66`](../../apps/api/src/payments/payments.module.ts#L34-L66) |
| `PrismaModule` | Shared Prisma client dependency | IMPLEMENTED; [`apps/api/src/prisma/prisma.module.ts:1-10`](../../apps/api/src/prisma/prisma.module.ts#L1-L10) |

Controllers are HTTP boundaries; services contain domain and persistence orchestration. For example, Orders controller derives the actor from `request.user` and delegates to `OrdersService` ([`apps/api/src/orders/orders.controller.ts:42-47`](../../apps/api/src/orders/orders.controller.ts#L42-L47), [`:113-132`](../../apps/api/src/orders/orders.controller.ts#L113-L132)).

### 4.2 Internal jobs

**IMPLEMENTED:** Order expiration and payment reconciliation are timers inside the NestJS process, not separately deployed workers. `OrderExpirationService` starts an interval at application bootstrap ([`apps/api/src/orders/order-expiration.service.ts:18-39`](../../apps/api/src/orders/order-expiration.service.ts#L18-L39)); reconciliation uses the same lifecycle pattern ([`apps/api/src/payments/payment-reconciliation.scheduler.ts:19-41`](../../apps/api/src/payments/payment-reconciliation.scheduler.ts#L19-L41)).

**Operational limitation:** Availability of these timers depends on backend process availability. Hosting sleep/restart behaviour and multi-instance operation are **UNVERIFIED**.

## 5. REST API and security architecture

### 5.1 Authentication and authorization

**IMPLEMENTED:** `AuthModule` configures JWT HS256, a one-hour access token TTL, and verification restricted to HS256 ([`apps/api/src/auth/auth.module.ts:15-23`](../../apps/api/src/auth/auth.module.ts#L15-L23); [`apps/api/src/auth/jwt.config.ts:3-10`](../../apps/api/src/auth/jwt.config.ts#L3-L10)). `JwtStrategy` accepts Bearer tokens and validates UUID `sub`; Passport verifies signature and expiry before `validate()` ([`apps/api/src/auth/jwt.strategy.ts:12-42`](../../apps/api/src/auth/jwt.strategy.ts#L12-L42)).

Protected controllers apply `JwtAuthGuard`, including Orders ([`apps/api/src/orders/orders.controller.ts:42-45`](../../apps/api/src/orders/orders.controller.ts#L42-L45)) and Payments ([`apps/api/src/payments/payments.controller.ts:35-44`](../../apps/api/src/payments/payments.controller.ts#L35-L44)). Services use the verified user ID for ownership-sensitive lookups; Mock payment checks `orderId` and `userId` before idempotency state is exposed ([`apps/api/src/payments/payments.service.ts:89-107`](../../apps/api/src/payments/payments.service.ts#L89-L107)).

### 5.2 Password security and request validation

**IMPLEMENTED:** Password hashing uses Argon2id, `memoryCost: 19456`, `timeCost: 2`, `parallelism: 1` and 32-byte hashes ([`apps/api/src/auth/password-hash.ts:3-23`](../../apps/api/src/auth/password-hash.ts#L3-L23)). Login compares a dummy Argon2id hash for unknown users to reduce account enumeration timing differences and avoids logging credentials/hashes ([`apps/api/src/auth/auth.service.ts:21-25`](../../apps/api/src/auth/auth.service.ts#L21-L25), [`:39-73`](../../apps/api/src/auth/auth.service.ts#L39-L73)).

DTO validation is implemented per controller/endpoint. Auth registration/login use `ValidationPipe` with `transform`, `whitelist` and `forbidUnknownValues` ([`apps/api/src/auth/auth.controller.ts:87-106`](../../apps/api/src/auth/auth.controller.ts#L87-L106), [`:157-180`](../../apps/api/src/auth/auth.controller.ts#L157-L180)); order creation does the same ([`apps/api/src/orders/orders.controller.ts:113-132`](../../apps/api/src/orders/orders.controller.ts#L113-L132)). Payments uses provider-specific custom validation pipes ([`apps/api/src/payments/payment-validation.pipe.ts:18-69`](../../apps/api/src/payments/payment-validation.pipe.ts#L18-L69)).

## 6. PostgreSQL, Prisma and schema management

**IMPLEMENTED:** Prisma models map application entities including users, orders, coupons, payments and gateway events ([`apps/api/prisma/schema.prisma:167-354`](../../apps/api/prisma/schema.prisma#L167-L354)). Prisma maintains application-facing type mappings; physical PostgreSQL CHECK constraints and partial indexes are represented in tracked SQL migrations, as the schema comment notes ([`schema.prisma:1-5`](../../apps/api/prisma/schema.prisma#L1-L5)).

There are tracked migrations under `apps/api/prisma/migrations/`; Compose runs `prisma migrate deploy` through the separate `migrate` service before backend startup ([`docker-compose.yml:25-39`](../../docker-compose.yml#L25-L39); [`apps/api/package.json:24-29`](../../apps/api/package.json#L24-L29)). Runtime deployment execution is **UNVERIFIED** and is not performed by this task.

Important database-enforced invariants include:

- One active `PENDING`/`PAYMENT_FAILED` order per user via partial unique index ([`20261022011000_scrum36_active_order_coupon_constraints/migration.sql:6-12`](../../apps/api/prisma/migrations/20261022011000_scrum36_active_order_coupon_constraints/migration.sql#L6-L12)).
- One successful payment per order and non-negative payment amount ([`20261026065408_add_payment_schema/migration.sql:37-45`](../../apps/api/prisma/migrations/20261026065408_add_payment_schema/migration.sql#L37-L45)).
- Order total equals subtotal minus discount; money, quantity and loyalty bounds have CHECK constraints ([`20261021153059_extend_user_order_orderitem/migration.sql:170-233`](../../apps/api/prisma/migrations/20261021153059_extend_user_order_orderitem/migration.sql#L170-L233)).
- Phase 2 payment provider/reconciliation/event shapes and a single pending VNPay payment per order are constrained in SQL ([`20261031190100_scrum76_payment_gateway_delta/migration.sql:78-117`](../../apps/api/prisma/migrations/20261031190100_scrum76_payment_gateway_delta/migration.sql#L78-L117)).

**Architecture caution:** the Prisma header says `database/schema.dbml` is source of truth and calls the Phase 2 extension “proposed” ([`schema.prisma:1-5`](../../apps/api/prisma/schema.prisma#L1-L5)), while tracked Phase 2 migration and source depend on those fields. Leader must confirm canonical source hierarchy before final acceptance; this document treats applied migration history as evidence of physical-schema intent, not a substitute for approval.

## 7. Transactions, locking and consistency

### 7.1 Order and inventory

**IMPLEMENTED:** Order creation executes through a transaction wrapper using `ReadCommitted`, local lock timeout, bounded retry for serialization/deadlock/lock failures and finite transaction timeout ([`apps/api/src/orders/inventory-transaction.ts:19-41`](../../apps/api/src/orders/inventory-transaction.ts#L19-L41)). Same-customer order creation uses a transaction-scoped advisory lock before active-order and inventory handling ([`apps/api/src/orders/orders.service.ts:161-186`](../../apps/api/src/orders/orders.service.ts#L161-L186)).

Inventory reservation is a conditional `updateMany` decrement requiring stock `gte` quantity; failure raises `INSUFFICIENT_STOCK` ([`apps/api/src/orders/inventory-policy.ts:19-46`](../../apps/api/src/orders/inventory-policy.ts#L19-L46)). Cancellation transitions an active order to `CANCELLED` first, then restores aggregate product inventory and releases held coupon within the same caller-owned transaction ([`inventory-policy.ts:98-141`](../../apps/api/src/orders/inventory-policy.ts#L98-L141)).

### 7.2 Coupon, loyalty and expiration

**IMPLEMENTED:** Successful payment consumes exactly the held coupon redemption and conditionally increments loyalty points before Order/Payment persistence ([`apps/api/src/payments/payment-finalization.service.ts:274-350`](../../apps/api/src/payments/payment-finalization.service.ts#L274-L350)); `consumeHeldCoupon` requires exactly one held redemption when a coupon exists ([`payment-finalization.service.ts:366-386`](../../apps/api/src/payments/payment-finalization.service.ts#L366-L386)).

Order expiration locks the Order, uses database time, and preserves a pending VNPay attempt through the configured grace interval ([`apps/api/src/orders/inventory-policy.ts:54-95`](../../apps/api/src/orders/inventory-policy.ts#L54-L95)). This is application transaction logic; database constraints alone cannot enforce all cross-row lifecycle semantics.

## 8. Payment architecture

### 8.1 Payment providers and shared finalization

**IMPLEMENTED:** Existing providers are `MOCK`, `VNPAY`, and `ZERO_AMOUNT` in the Prisma enum ([`apps/api/prisma/schema.prisma:132-136`](../../apps/api/prisma/schema.prisma#L132-L136)). Payments module registers Mock, ZERO_AMOUNT, VNPay initiation/IPN/QueryDR and a single `PaymentFinalizationService` ([`apps/api/src/payments/payments.module.ts:41-65`](../../apps/api/src/payments/payments.module.ts#L41-L65)).

Shared Payment Finalization is a **documented architectural boundary** in the audited service: its comment states that `finalizeInTransaction()` is the method intended to mutate financial payment/order state, and that its caller owns the transaction ([`apps/api/src/payments/payment-finalization.service.ts:143-152`](../../apps/api/src/payments/payment-finalization.service.ts#L143-L152)). The audit does not prove exclusive use across every repository path. Atomicity depends on the caller-owned database transaction plus the implemented Order/Payment/Coupon/Loyalty invariants; it does not mean SCRUM-107 executed or passed concurrency tests. The method locks the Order first ([`payment-finalization.service.ts:153-185`](../../apps/api/src/payments/payment-finalization.service.ts#L153-L185)); VNPay finalization subsequently locks the Payment and validates persisted ownership/provider/amount identity ([`payment-finalization.service.ts:388-409`](../../apps/api/src/payments/payment-finalization.service.ts#L388-L409)).

### 8.2 Idempotency, IPN and reconciliation

**IMPLEMENTED:** Mock payment derives a request hash and uses a transaction-scoped advisory lock keyed by user and idempotency key, then locks the Order and rechecks replay state ([`apps/api/src/payments/payments.service.ts:77-166`](../../apps/api/src/payments/payments.service.ts#L77-L166)). The DB also has a unique `(user_id, idempotency_key)` constraint ([`apps/api/prisma/schema.prisma:326`](../../apps/api/prisma/schema.prisma#L326)). ZERO_AMOUNT follows the same ownership/key/order locking order ([`apps/api/src/payments/zero-amount-payment.service.ts:77-112`](../../apps/api/src/payments/zero-amount-payment.service.ts#L77-L112)).

VNPay IPN is public because it is a gateway-to-server callback, not a customer request ([`apps/api/src/payments/vnpay-ipn.controller.ts:7-16`](../../apps/api/src/payments/vnpay-ipn.controller.ts#L7-L16)). The IPN service verifies signature, merchant, transaction identity and amount before calling shared finalization ([`apps/api/src/payments/vnpay-ipn.service.ts:16-46`](../../apps/api/src/payments/vnpay-ipn.service.ts#L16-L46)).

**IMPLEMENTED in source / UNVERIFIED against Sandbox runtime:** reconciliation scans eligible pending VNPay payments, claims work through PostgreSQL coordination and does not infer failure merely from timeout or missing IPN ([`apps/api/src/payments/payment-reconciliation.scheduler.ts:14-18`](../../apps/api/src/payments/payment-reconciliation.scheduler.ts#L14-L18), [`:62-131`](../../apps/api/src/payments/payment-reconciliation.scheduler.ts#L62-L131)). QueryDR Sandbox E2E remains an open gate; automated/local evidence is not equivalent to external Sandbox acceptance.

**Known functional dependency:** frontend contains `GET /payments/:paymentId/status` handling ([`apps/web/services/payment.service.ts:2150-2196`](../../apps/web/services/payment.service.ts#L2150-L2196)), but no matching backend controller route was found during audit. This route is not added in SCRUM-107; its resolution is **DEFERRED** to an approved implementation task.

Payment policy details, protocol fields and approved business-rule provenance remain in the existing payment architecture and decision documents; this section deliberately records boundaries only.

## 9. Configuration, secrets and operations

**IMPLEMENTED:** Configuration is environment-variable based. `DATABASE_URL` is required by Prisma ([`apps/api/src/prisma/prisma.service.ts:11-24`](../../apps/api/src/prisma/prisma.service.ts#L11-L24)); JWT secret validation requires at least 32 bytes ([`apps/api/src/auth/jwt.config.ts:5-10`](../../apps/api/src/auth/jwt.config.ts#L5-L10)); VNPay config validates required server-side environment values and HTTPS Sandbox URLs ([`apps/api/src/payments/vnpay.config.ts:15-23`](../../apps/api/src/payments/vnpay.config.ts#L15-L23), [`:94-136`](../../apps/api/src/payments/vnpay.config.ts#L94-L136)).

Compose keeps credentials interpolated from a local env file rather than hardcoded in the Compose definition ([`docker-compose.yml:7-10`](../../docker-compose.yml#L7-L10), [`:45-64`](../../docker-compose.yml#L45-L64)); the sample instructs locally generated independent secrets and warns against using placeholders ([`compose.env.example:19-22`](../../compose.env.example#L19-L22)). Secret values are intentionally not reproduced here.

**IMPLEMENTED but limited:** Root `GET /` is a liveness endpoint only ([`apps/api/src/app.controller.ts:10-18`](../../apps/api/src/app.controller.ts#L10-L18)); Compose explicitly documents that it does not query PostgreSQL ([`docker-compose.yml:70-76`](../../docker-compose.yml#L70-L76)). A database-aware readiness endpoint is **DEFERRED**, not implemented.

**IMPLEMENTED but limited:** Services use Nest `Logger`, including Auth and payment reconciliation ([`apps/api/src/auth/auth.service.ts:27-30`](../../apps/api/src/auth/auth.service.ts#L27-L30); [`apps/api/src/payments/payment-reconciliation.scheduler.ts:20-23`](../../apps/api/src/payments/payment-reconciliation.scheduler.ts#L20-L23)). Structured logs, correlation IDs, metrics, tracing and centralized retention are **NOT FOUND** in this audit; production observability must not be claimed.

## 10. Deployment View

The complete deployment topology, network trust boundaries, Vercel/Render target assumptions, secret placement, CI/CD proposal, migration gate and post-deploy evidence checklist are maintained in [deployment.md](../deployment.md).

Key architecture boundary: local Docker Compose has `postgres`, `migrate`, `backend` and `frontend` services ([`docker-compose.yml:3-104`](../../docker-compose.yml#L3-L104)). The Vercel + Render view is **PLANNED** and explicitly has no production runtime evidence ([deployment.md](../deployment.md#8-đối-chiếu-môi-trường-thực-tế-trước-nghiệm-thu-cuối), dòng 281-320). Do not infer that a diagram, provider choice or local Compose configuration proves a production deployment.

The architectural requirement is isolation between A1 and A2 repository, runtime, database, volume and secrets. Git read-only comparison against `A1-final` confirms a **CONFIRMED CONFIGURATION COLLISION**: the current A2 tracked Compose project is `brewlite_compose`, default database is `brewlite_compose`, logical volume is `brewlite_pgdata`, network is `brewlite_net`, and default host ports match A1 ([`docker-compose.yml:1-15`](../../docker-compose.yml#L1-L15), [`:65-104`](../../docker-compose.yml#L65-L104); [`compose.env.example:5-17`](../../compose.env.example#L5-L17)). This is not evidence that live A1 data has been affected; actual runtime non-overlap remains **UNVERIFIED**. ADR-004 accepts the isolation requirement but records current implementation as a Task 4 blocker and Task 5 verification gate.

## 11. Architecture trade-offs

| Decision | Benefit | Trade-off / boundary |
| --- | --- | --- |
| Modular monolith | Simple deployment and shared ACID transaction boundary for order/payment/inventory | Modules share one process/database; not independent services |
| Prisma plus SQL migrations | Type-safe application access plus PostgreSQL-specific CHECK/index enforcement | Prisma schema does not express all partial indexes/CHECKs; migrations must remain authoritative for those constraints |
| Order-first locking + idempotency | Reduces duplicate financial side effects and conflicting payment transitions | Requires careful lock order, retry policy and production contention monitoring |
| Next.js proxy | Same-origin browser API route in normal UI flow | Public-backend fallback/CORS still needs deployed-browser verification |
| JWT in localStorage | Straightforward current SPA integration | XSS exposure risk; no HttpOnly-cookie protection is implemented |
| VNPay IPN + QueryDR reconciliation | Gateway callbacks and recovery path are server-owned | Sandbox QueryDR E2E and hosting behaviour remain unverified |
| Vercel + Render target | Separates frontend/API/managed DB responsibilities | Provider eligibility, tier limits, migration runner, CI/CD and runtime evidence are open gates |

## 12. ADR index

The ADR files below exist. Their individual status does not mark all SCRUM-107 work, runtime verification, or deployment acceptance as complete.

| ADR | Status | Scope |
| --- | --- | --- |
| [ADR-001 Modular Monolith and Domain Boundaries](adr/001-modular-monolith.md) | Accepted | Next.js/NestJS/PostgreSQL module boundary |
| [ADR-002 Database Authority and Migration Policy](adr/002-database-schema-authority.md) | Accepted | Contract, Prisma and SQL migration hierarchy |
| [ADR-003 Payment Finalization, Locking and Idempotency](adr/003-payment-consistency.md) | Accepted | Shared finalization and provider-specific consistency boundaries |
| [ADR-004 A2 Runtime and Environment Isolation](adr/004-a2-environment-isolation.md) | Accepted architectural requirement; **implementation blocker** | A1/A2 repository, runtime, DB, volume and secret separation |
| [ADR-005 Production Hosting Target: Vercel + Render](adr/005-production-hosting.md) | **Proposed, not Accepted** | Hosting target only; requires Leader approval and deployment evidence |

## 13. Known limitations and verification gaps

| Item | Status | Required evidence / next owner decision |
| --- | --- | --- |
| PWA manifest, service worker and installability | NOT FOUND | Implement and verify only in an approved future task |
| Production Vercel/Render deployment | UNVERIFIED | Public URLs, deployment IDs, regions, configured environment scope and smoke evidence |
| CI/CD workflow and branch protection | NOT FOUND | Reviewed workflow and actual guarded PR run; no `.github` workflow was found during audit |
| Database readiness | DEFERRED | Approved DB-aware readiness design and runtime proof; liveness is insufficient |
| Private production DB and disabled external access | UNVERIFIED | Hosting configuration evidence without credentials |
| Migration rollout in hosted private network | UNVERIFIED | Approved runner/process, migration status and rollback evidence |
| QueryDR Sandbox E2E | UNVERIFIED | Verified external QueryDR response and recovery scenario |
| Payment status backend endpoint | DEFERRED | Contract/implementation task resolving frontend/backend mismatch |
| A1/A2 Compose configuration isolation | **CONFIRMED CONFIGURATION COLLISION** | Task 4 must replace inherited A1 project/database/volume/network/port identifiers with A2-specific configuration |
| A1/A2 live runtime non-overlap | UNVERIFIED | Task 5 evidence must verify isolated runtime resources; collision confirmation alone does not prove live A1 impact |
| Production observability | NOT FOUND | Selected logging/metrics/tracing approach and deployment evidence |

### 13.1 Decision Register

Các nội dung sau chưa cần ADR riêng trong SCRUM-107, nhưng phải được giữ rõ trạng thái trong tài liệu chính thức:

| Decision area | Current status | Boundary |
| --- | --- | --- |
| CI/CD, private migration runner và rollback | PLANNED / UNVERIFIED | Không có workflow tracked; deployment view mô tả target và evidence gates |
| Production payment demo | OPEN / UNVERIFIED | VNPay Sandbox source flow tồn tại; QueryDR Sandbox E2E chưa được chứng minh |
| Health, readiness và observability | IMPLEMENTED but limited / DEFERRED | Liveness `GET /` và Nest Logger tồn tại; DB readiness/structured telemetry chưa có evidence |

## 14. Traceability status with Task 1 and Task 2

Planning baseline has been **APPROVED by Leader**, even where inherited planning-file metadata has not yet been updated. This confirmation does not close individual technical decisions marked OPEN, nor does it convert missing runtime evidence into PASS. The A2 Gap Analysis still marks architecture artifacts as baseline and requires cross-document verification ([`docs/planning/A2_Gap_Analysis.md:43-51`](../planning/A2_Gap_Analysis.md#L43-L51)); Task 2 also requires reconciliation of requirements, diagrams and schema ([`A2_Gap_Analysis.md:32-41`](../planning/A2_Gap_Analysis.md#L32-L41)).

Therefore traceability is **PENDING** until Leader confirms the canonical Requirements, Use Case, API Contract and Task 1/2 acceptance evidence. This document may be linked from the future traceability matrix, but it does not create or approve such a matrix.

## 15. Verification Gates and Outstanding Decisions

| Gate or decision | Current state | Evidence needed before an acceptance claim |
| --- | --- | --- |
| Canonical requirements, use case, business rules and API Contract | OPEN | Leader-confirmed version set and recorded conflict resolution |
| Production Hosting Target: Vercel + Render | PROPOSED | Leader decision plus provider eligibility, deploy branch, tier, region and private DB configuration |
| CI/CD, migration and rollback | PLANNED / UNVERIFIED | Reviewed workflow, isolated test evidence, hosted migration process and rollback evidence |
| Payment return status endpoint | DEFERRED | Approved implementation/contract resolution and authenticated end-to-end verification |
| VNPay QueryDR recovery | UNVERIFIED | Sandbox E2E evidence for signed QueryDR response and missed-IPN recovery |
| Database readiness and production observability | DEFERRED / NOT FOUND | Approved scope, implementation and runtime evidence |
| A1/A2 Compose isolation implementation | BLOCKED | Task 4 configuration change to `brewlite_a2` and non-colliding DB/volume/network/ports |
| A1/A2 runtime isolation | UNVERIFIED | Task 5 isolated-runtime evidence without exposing secret values |

Until these gates are met, this document remains a technical architecture baseline. It is not proof of production readiness, runtime acceptance or Task completion.
