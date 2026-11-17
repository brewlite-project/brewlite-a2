# SCRUM-119 — Ingredient Inventory Dependency Map

## Trạng thái và phạm vi audit

- **Jira audit:** SCRUM-119 / INV-01.
- **Trạng thái:** Audit read-only; **không phải** kết luận SCRUM-119 Done.
- **Branch đã quan sát:** `SCRUM-119-audit-ingredient-inventory`.
- **HEAD đã quan sát:** `2870875bf047f31746f8db4d72131cdce1ae208e`.
- **Git status đã quan sát:** `.postman/`, `postman/` và `docs/ingredient-inventory/` đang untracked. Vì vậy các tài liệu trong thư mục này không thuộc tracked HEAD tại thời điểm audit.
- **Giới hạn:** Không có truy cập Production; không chạy migration, seed, Docker hoặc test. Mọi trạng thái Production, migration đã apply, backup/restore và test execution là **NOT VERIFIED**.

### Quy ước bằng chứng

- **VERIFIED:** trực tiếp đọc từ source/migration tại HEAD nêu trên.
- **PROPOSED:** nội dung thiết kế chưa được phê duyệt hoặc chưa tồn tại trong source; đặc biệt là ba specification PROPOSED.
- **NOT VERIFIED:** thiếu source, dữ liệu môi trường hoặc evidence chạy thực tế.

### Phân biệt mã công việc và mã test

`INV-01` trong `SCRUM-119 / INV-01` là **Jira task**. `INV-01` trong `03_Test_and_Release_Gates_v1.0.md` là **test case**. Trong tài liệu này, công việc luôn ghi đủ `SCRUM-xxx / INV-xx`; test case ghi `Test INV-xx` hoặc `Test CON-xx`.

## Baseline schema và source of truth hiện tại

**VERIFIED:** `Product.stock` là `Int` trong Prisma; `Product` liên kết `OrderItem` và `ProductTopping`, nhưng schema không có model `Ingredient`, recipe, hoặc `OrderIngredientReservation`. [apps/api/prisma/schema.prisma:27-49](../../apps/api/prisma/schema.prisma#L27-L49), [apps/api/prisma/schema.prisma:201-285](../../apps/api/prisma/schema.prisma#L201-L285)

**VERIFIED:** migration `20261020143341_init_product_catalog` tạo `products.stock INTEGER NOT NULL` và constraint `stock >= 0`. [apps/api/prisma/migrations/20261020143341_init_product_catalog/migration.sql:2-34](../../apps/api/prisma/migrations/20261020143341_init_product_catalog/migration.sql#L2-L34)

**VERIFIED:** Order hiện lưu snapshot product/price/size/quantity và topping price snapshot, không lưu định lượng ingredient snapshot. [apps/api/prisma/schema.prisma:228-263](../../apps/api/prisma/schema.prisma#L228-L263)

**NOT VERIFIED:** dữ liệu recipe, unit conversion, ingredient catalog, trạng thái migration thực tế và dữ liệu active Order ngoài source.

## Luồng hiện tại: Create → Reserve → Payment → Expire/Cancel → Release

1. **Create — VERIFIED.** `OrdersService.create` chuẩn hóa `userId`, lấy PostgreSQL advisory transaction lock theo user, tìm active Order và gọi expiry lazy trước khi cho tạo đơn mới. [apps/api/src/orders/orders.service.ts:144-175](../../apps/api/src/orders/orders.service.ts#L144-L175)
2. **Price và Reserve — VERIFIED.** Service aggregate DTO theo `productId`, gọi `priceCart`, rồi `reserveInventory` trước coupon. Sau đó tạo Order, OrderItems, topping snapshots và CouponRedemption HELD trong cùng transaction. [apps/api/src/orders/orders.service.ts:176-249](../../apps/api/src/orders/orders.service.ts#L176-L249)
3. **Reserve behavior — VERIFIED.** `inventoryQuantities` canonicalize/sort Product ID; `reserveInventory` conditional-update `products.stock` với `stock >= quantity`, decrement stock và trả `409 INSUFFICIENT_STOCK` nếu không reserve được. [apps/api/src/orders/inventory-policy.ts:7-46](../../apps/api/src/orders/inventory-policy.ts#L7-L46)
4. **Payment — VERIFIED.** VNPay finalization lock Order rồi Payment; SUCCESS consume coupon HELD, award loyalty, set Payment SUCCESS và Order PAID. Đoạn SUCCESS này không update Product stock. [apps/api/src/payments/payment-finalization.service.ts:149-186](../../apps/api/src/payments/payment-finalization.service.ts#L149-L186), [apps/api/src/payments/payment-finalization.service.ts:596-641](../../apps/api/src/payments/payment-finalization.service.ts#L596-L641)
5. **Expire/Cancel — VERIFIED.** Expiry lock Order, kiểm tra DB clock, expiry và VNPay PENDING/grace; chỉ active Order mới cancel. [apps/api/src/orders/inventory-policy.ts:54-95](../../apps/api/src/orders/inventory-policy.ts#L54-L95)
6. **Release — VERIFIED.** Cancellation đổi status sang `CANCELLED` trước, aggregate `order_items`, increment `products.stock`, rồi release coupon HELD trong cùng caller transaction. [apps/api/src/orders/inventory-policy.ts:102-141](../../apps/api/src/orders/inventory-policy.ts#L102-L141)
7. **Scheduler/QueryDR — VERIFIED.** Expiration scheduler chọn candidate rồi gọi shared expiry primitive trong transaction retry; QueryDR cũng dùng shared finalization/expiry path. [apps/api/src/orders/order-expiration.service.ts:65-109](../../apps/api/src/orders/order-expiration.service.ts#L65-L109), [apps/api/src/payments/vnpay-querydr.service.ts:68-159](../../apps/api/src/payments/vnpay-querydr.service.ts#L68-L159)

**PROPOSED:** thay điểm reserve/release ở trên bằng ingredient aggregate và reservation snapshot, nhưng không thay Payment State Machine hoặc merchant VNPay IPN.

## Inventory Dependency Map

| Module/function            | File và line range                                                   | Read/write behavior hiện tại                                                                                                                                                                                 | Dependencies                            | Rủi ro                                                                             | Hướng xử lý tối thiểu                                                                     | Jira phụ trách                         |
| -------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| Product stock schema       | `schema.prisma:27-49`; migration `20261020143341...:2-34`            | `Product.stock Int`; DB CHECK không âm                                                                                                                                                                       | Product API, reserve, release, fixtures | Critical: đây là source of truth theo ly, không mô tả ingredient                   | Additive schema; giữ legacy column trong MVP cho đến khi compatibility được chốt          | SCRUM-121 / INV-03                     |
| `inventoryQuantities`      | `inventory-policy.ts:7-17`                                           | Read DTO; aggregate/sort theo Product ID                                                                                                                                                                     | reserve/release                         | High: sort Product ID không serialize Product khác nhau dùng chung ingredient      | Hàm aggregate demand mới theo `ingredient_id` và deterministic sort                       | SCRUM-123 / INV-05                     |
| `reserveInventory`         | `inventory-policy.ts:20-46`                                          | Conditional write `products.stock -= quantity`; 409                                                                                                                                                          | Create Order, API error contract        | Critical: không thể chống oversell shared ingredient                               | Reserve ingredient bằng conditional decrement trong cùng transaction                      | SCRUM-123 / INV-05                     |
| `priceCart`                | `cart-pricing.ts:46-118`                                             | Read Product/Category/Topping, validate size/topping, price snapshots; không read stock                                                                                                                      | Create Order, coupon preview            | High: không có recipe/unit validation                                              | Tách recipe resolver khỏi price; không suy định lượng từ giá                              | SCRUM-123 / INV-05                     |
| `OrdersService.create`     | `orders.service.ts:144-303`                                          | Advisory lock; write Product/Coupon/Order/Items                                                                                                                                                              | expiry, coupon, checkout                | Critical: vị trí transaction integration của ingredient                            | Preserve one transaction và active-order policy; add reservation rows atomically          | SCRUM-123 / INV-05                     |
| Coupon policy              | `promotion-policy.ts:74-149`                                         | Lock Coupon, reserve quota; release HELD after cancelled                                                                                                                                                     | Create, cancellation, payment           | High: ingredient/coupon lock ordering phải nhất quán                               | Giữ coupon business behavior; chốt lock sequence trước code                               | SCRUM-123 / INV-05; SCRUM-124 / INV-06 |
| Expiry primitive           | `inventory-policy.ts:54-141`                                         | Lock Order, transition CANCELLED, restore Product stock, release coupon                                                                                                                                      | scheduler, lazy cleanup, payment        | Critical: restore từ mutable Product mapping/order item, không snapshot ingredient | Restore reservation snapshot exactly once, after valid terminal transition                | SCRUM-124 / INV-06                     |
| Expiration scheduler       | `order-expiration.service.ts:65-109`                                 | Candidate scan then transaction retry/expiry                                                                                                                                                                 | TTL, grace, cancellation                | High: duplicate sweep must remain idempotent                                       | Reuse primitive; test scheduler/lazy cleanup race                                         | SCRUM-124 / INV-06; SCRUM-126 / INV-08 |
| Transaction helper         | `inventory-transaction.ts:5-41`                                      | `READ COMMITTED`, lock timeout 1500ms, timeout 8s, Retry các lỗi transaction thuộc nhóm có thể retry, với giới hạn tối đa 2 lần theo helper hiện tại (cần đối chiếu cách đếm attempts/retries trong source). | Create and expiry                       | High: new locks can alter deadlock/retry profile                                   | Preserve boundary; define and test ingredient order/retry metrics                         | SCRUM-126 / INV-08                     |
| Payment finalization       | `payment-finalization.service.ts:149-186, 489-512, 596-641, 874-892` | Locks Order→Payment; PAID has coupon/loyalty mutation; expired failure/financial exception may cancel/release                                                                                                | IPN, QueryDR, Mock, Zero Amount         | Critical: inventory release reaches here indirectly                                | Do not rewrite state machine; replace only release implementation behind shared primitive | SCRUM-127 / INV-09                     |
| VNPay IPN                  | `vnpay-ipn.service.ts:16-48`                                         | Verify callback then transaction/shared finalization                                                                                                                                                         | Payment finalization                    | Critical: no change to merchant IPN/payment state machine allowed                  | Regression signed fixture and duplicate test only                                         | SCRUM-127 / INV-09; SCRUM-130 / INV-12 |
| VNPay QueryDR/grace        | `vnpay-querydr.service.ts:27-54, 68-159, 194-205`                    | Order then Payment locking; expiry after grace; HTTP outside transaction                                                                                                                                     | scheduler/IPN/finalization              | Critical: concurrent terminal outcomes                                             | Preserve lock convention/grace; test race with ingredient release                         | SCRUM-127 / INV-09; SCRUM-126 / INV-08 |
| Product API                | `products.service.ts:21-70, 78-156`                                  | Reads stock; `isAvailable = stock > 0 && category active`                                                                                                                                                    | Catalog, Cart, Checkout                 | High: legacy stock causes false availability after cutover                         | Decide derived availability semantic; retain response shape if possible                   | SCRUM-125 / INV-07                     |
| Checkout FE error UX       | `CartDrawer.tsx:2215-2229`                                           | Handles exact `INSUFFICIENT_STOCK`                                                                                                                                                                           | `POST /orders` error                    | High: renamed code breaks retry/edit-cart path                                     | Keep code initially or coordinate FE/API contract change                                  | SCRUM-125 / INV-07                     |
| Product FE availability    | `ProductCard.tsx:53-70`; `ProductDetailModal.tsx:154-173`            | Reads `isAvailable` and blocks add-to-cart                                                                                                                                                                   | Product API                             | High: UI is only as correct as API availability                                    | Contract tests for unavailable ingredient state                                           | SCRUM-125 / INV-07                     |
| Order history              | `orders.service.ts:40-132`; `get-my-orders-response.dto.ts:93-160`   | Read snapshots/payment summary; no ingredient reservation response                                                                                                                                           | History FE                              | Medium: expanding response unnecessarily may be breaking/noise                     | Keep response unchanged unless approved business need                                     | SCRUM-127 / INV-09                     |
| PostgreSQL inventory tests | `test/inventory-postgres.integration-spec.ts:159-735`                | Existing product-stock concurrency/rollback baseline                                                                                                                                                         | Order/Coupon/expiry                     | High: cannot prove ingredient invariants                                           | Add deterministic real PostgreSQL tests without deleting baseline coverage                | SCRUM-126 / INV-08                     |

## Transaction, locking và concurrency

### VERIFIED controls hiện hữu

- Same-user Create Order dùng `pg_advisory_xact_lock`; DB có partial unique index `uq_orders_one_active_per_user` cho `PENDING` và `PAYMENT_FAILED`. [apps/api/src/orders/orders.service.ts:161-175](../../apps/api/src/orders/orders.service.ts#L161-L175), [apps/api/prisma/migrations/20261022011000_scrum36_active_order_coupon_constraints/migration.sql:6-11](../../apps/api/prisma/migrations/20261022011000_scrum36_active_order_coupon_constraints/migration.sql#L6-L11)
- Reserve/release Product dùng cùng sorted Product IDs. [apps/api/src/orders/inventory-policy.ts:7-29](../../apps/api/src/orders/inventory-policy.ts#L7-L29), [apps/api/src/orders/inventory-policy.ts:129-140](../../apps/api/src/orders/inventory-policy.ts#L129-L140)
- Payment/QueryDR lock theo thứ tự Order rồi Payment. [apps/api/src/payments/payment-finalization.service.ts:157-171](../../apps/api/src/payments/payment-finalization.service.ts#L157-L171), [apps/api/src/payments/vnpay-querydr.service.ts:194-205](../../apps/api/src/payments/vnpay-querydr.service.ts#L194-L205)
- Create cleanup được commit trước reservation mới để tránh đảo chiều Coupon→Product lock với Product→Coupon. [apps/api/src/orders/orders.service.ts:277-286](../../apps/api/src/orders/orders.service.ts#L277-L286)

### Rủi ro cần xử lý

1. **Critical — shared ingredient:** Product-ID lock ordering không bảo vệ hai Product khác nhau dùng chung ingredient. Ingredient rows phải được aggregate và lock/update theo `ingredient_id` deterministic.
2. **Critical — partial reserve:** nếu ingredient decrement/coupon/order/reservation tách thành nhiều transaction, failure sẽ để tồn/coupon/order sai lệch. Reservation và Order create phải chung transaction.
3. **High — double release:** scheduler, lazy cleanup, payment failure và financial-exception paths đều tới cancellation. Cần unique `(order_id, ingredient_id)` cùng conditional one-time release marker, được kiểm thử parallel.
4. **High — two active orders/user:** advisory lock và partial unique index phải giữ nguyên; recipe resolution không được xảy ra ở transaction riêng làm bypass active-order invariant.
5. **High — deadlock/retry:** chốt lock order chỉ sau prototype compatible: hiện Create là user advisory → Order check → Product(s) → Coupon; Payment là Order → Payment. **PROPOSED:** sau Order policy, ingredient sorted → Coupon; không thêm HTTP gateway call vào transaction.

## API compatibility

**VERIFIED:** `GET /products` và `GET /products/:id` không expose numerical stock trong DTO nhưng server compute `isAvailable` từ `stock > 0` và Category active. [apps/api/src/products/products.service.ts:21-70](../../apps/api/src/products/products.service.ts#L21-L70), [apps/api/src/products/products.service.ts:78-156](../../apps/api/src/products/products.service.ts#L78-L156)

**VERIFIED:** Orders Swagger advertises `INSUFFICIENT_STOCK`; Checkout handles exactly that error code. [apps/api/src/orders/orders.controller.ts:88-132](../../apps/api/src/orders/orders.controller.ts#L88-L132), [apps/web/components/CartDrawer.tsx:2215-2229](../../apps/web/components/CartDrawer.tsx#L2215-L2229)

**PROPOSED:** retain `409 INSUFFICIENT_STOCK` initially and return no ingredient details until disclosure/contract policy is approved. Change Product availability to a single, defined ingredient-derived semantic. Do not expose reservation data in `GET /orders/me` without an approved use case.

## Legacy Orders và release blockers

**VERIFIED:** legacy OrderItem rows only have product/size/quantity and price snapshots, not ingredient reservations. [apps/api/prisma/migrations/20261021153059_extend_user_order_orderitem/migration.sql:40-128](../../apps/api/prisma/migrations/20261021153059_extend_user_order_orderitem/migration.sql#L40-L128)

**PROPOSED:** do not infer a legacy reservation from the current recipe on cancel; either drain active legacy orders before cutover or apply a separately approved migration policy backed by trustworthy historical recipe snapshots.

Release blockers:

- D-01 through D-08 remain OPEN.
- Complete, approved recipe/unit data is absent from source.
- Active legacy order count/state is NOT VERIFIED.
- Additive migration rehearsal on clean and existing DB is NOT VERIFIED.
- Backup/restore rehearsal is NOT VERIFIED.
- Local signed-IPN tests and production VNPay E2E are NOT VERIFIED.
- No conclusion about Production health, deployment, merchant routing or data can be drawn from this audit.

## D-01 đến D-08 — giữ nguyên OPEN

| Decision                     | VERIFIED fact                                                | Thiếu thông tin                           | Quyết định cần human review                                                 |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------- |
| D-01 — ingredient unit       | Chưa có ingredient schema/source                             | Unit, conversion, precision               | Integer base unit cho từng ingredient; không float hay conversion ngầm      |
| D-02 — recipe coverage       | Product/Topping có trong schema, recipe không có             | Catalog-size-topping recipe được xác nhận | Phạm vi product demo và owner phê duyệt dữ liệu                             |
| D-03 — legacy stock API      | `isAvailable` đang dựa Product.stock                         | Semantic/caching availability mới         | Legacy stock coexistence và source of truth API                             |
| D-04 — error code            | Backend/Swagger/FE dùng `INSUFFICIENT_STOCK`                 | Approved API change policy                | Giữ code cũ hay version/error contract mới                                  |
| D-05 — active legacy order   | Không có reservation snapshot                                | Actual active rows và historical recipe   | Drain/cutover/migration policy; không infer recipe hiện tại                 |
| D-06 — reservation lifecycle | `CANCELLED` là marker release hiện tại                       | DB lifecycle representation               | `released_at`, status/constraint và one-time conditional update             |
| D-07 — locking/retry         | Product sort, Order→Payment, retry helper tồn tại            | Ingredient/Coupon full lock order         | Lock order, timeout/retry acceptance criteria                               |
| D-08 — release readiness     | VNPay source supports IPN/QueryDR; runtime evidence không có | E2E callback evidence, Go/No-Go authority | Accept/decline residual risk khi không pre-release Sandbox callback độc lập |

Các quyết định trên vẫn OPEN theo Decision Spec. [docs/ingredient-inventory/01_Ingredient_Inventory_Decision_Spec_v1.0.md:137-148](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L137-L148)

## Traceability: finding → work item → test evidence

| Finding                                             | Jira task xử lý                        | Test cases cần evidence                                                        |
| --------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| Chưa có ingredient/recipe/reservation schema        | SCRUM-120 / INV-02; SCRUM-121 / INV-03 | Test INV-01, INV-02, INV-03, INV-07, INV-14                                    |
| Recipe/seed completeness unknown                    | SCRUM-122 / INV-04                     | Test INV-01 đến INV-07, INV-15                                                 |
| Create vẫn reserve Product.stock                    | SCRUM-123 / INV-05                     | Test INV-01 đến INV-07; Test CON-01, CON-02, CON-04                            |
| Cancel restores Product.stock from OrderItems       | SCRUM-124 / INV-06                     | Test INV-08 đến INV-10, INV-13, INV-14; Test CON-05, CON-06                    |
| Product API/Cart relies on stock availability/error | SCRUM-125 / INV-07                     | Test INV-15; regression catalog/cart/checkout                                  |
| Lock/deadlock/rollback behavior changes             | SCRUM-126 / INV-08                     | Test CON-01 đến CON-08                                                         |
| Payment/coupon/loyalty/history regression           | SCRUM-127 / INV-09                     | Test INV-11 đến INV-13; Test CON-06, CON-07; payment/order history regressions |
| Existing-data migration safety                      | SCRUM-128 / INV-10                     | Migration clean/existing DB, Test INV-14, restore rehearsal                    |
| Deploy/cutover operational safety                   | SCRUM-129 / INV-11                     | Approved release gates, rollback/monitoring evidence                           |
| Real callback post-release and freeze               | SCRUM-130 / INV-12                     | Signed fixture pre-release; controlled VNPay production smoke after release    |

Test IDs in this table are **Test Matrix IDs**, not Jira task identifiers. Test expectations are PROPOSED until run and evidenced. [docs/ingredient-inventory/03_Test_and_Release_Gates_v1.0.md:17-44](03_Test_and_Release_Gates_v1.0.md#L17-L44)

## Jira work-item map

| Jira task          | Scope                             |
| ------------------ | --------------------------------- |
| SCRUM-119 / INV-01 | Audit — current document          |
| SCRUM-120 / INV-02 | Design Decisions                  |
| SCRUM-121 / INV-03 | Prisma Schema & Migration         |
| SCRUM-122 / INV-04 | Ingredient & Recipe Seed          |
| SCRUM-123 / INV-05 | Ingredient Reserve & Create Order |
| SCRUM-124 / INV-06 | Ingredient Release & Expiration   |
| SCRUM-125 / INV-07 | Product API / Cart / Checkout     |
| SCRUM-126 / INV-08 | Concurrency & Rollback Tests      |
| SCRUM-127 / INV-09 | Regression Auth/Orders/Payment    |
| SCRUM-128 / INV-10 | Migration Rehearsal               |
| SCRUM-129 / INV-11 | Production Release                |
| SCRUM-130 / INV-12 | Production VNPay E2E & Freeze     |

## So sánh với specification PROPOSED

Chưa phát hiện mâu thuẫn nội tại rõ ràng giữa các tài liệu PROPOSED được đối chiếu. Những khác biệt giữa source hiện tại và thiết kế mục tiêu được phân loại là implementation gaps. Kết luận này không thay thế consistency review sau khi D-01 đến D-08 được APPROVED.

Các điểm cần Khang và Hoàng quyết định trước implementation:

1. D-01…D-08 chưa được approved; đây là release/implementation blockers.
2. Decision Spec đề xuất ingredient reservation snapshot, trong khi source cancellation hiện restore `Product.stock` từ `order_items`; đây là **gap cần implementation**, không phải evidence rằng design đã tồn tại. [docs/ingredient-inventory/01_Ingredient_Inventory_Decision_Spec_v1.0.md:38-80](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L38-L80), [apps/api/src/orders/inventory-policy.ts:102-141](../../apps/api/src/orders/inventory-policy.ts#L102-L141)
3. Decision Spec đề xuất availability ingredient-derived, trong khi Product API hiện computes by `Product.stock`; semantic/API compatibility phải chốt ở SCRUM-120 và SCRUM-125. [docs/ingredient-inventory/01_Ingredient_Inventory_Decision_Spec_v1.0.md:38-80](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L38-L80), [apps/api/src/products/products.service.ts:51-70](../../apps/api/src/products/products.service.ts#L51-L70)
4. Test/Release Gate là PROPOSED; không có PASS evidence trong audit này. [docs/ingredient-inventory/03_Test_and_Release_Gates_v1.0.md:101-134](03_Test_and_Release_Gates_v1.0.md#L101-L134)

## Human-review evidence còn cần

- Approved API Contract version và accepted semantics cho Product availability/error details.
- Ingredient master, recipe per product/size/topping, base unit và conversion rules được business xác nhận.
- Read-only report về active legacy Orders/Payments trước cutover.
- Migration SQL review, clean/existing DB rehearsal, backup/restore proof.
- Deterministic PostgreSQL test logs/SQL invariant outputs cho Test INV-01…INV-15 và Test CON-01…CON-08.
- Signed VNPay IPN/QueryDR fixture evidence và explicit Go/No-Go authority/risk acceptance.

**Final status:** SCRUM-119 / INV-01 audit artifact đã được soạn từ source HEAD, nhưng SCRUM-119 **không được tự đánh dấu Done** cho tới khi human review chấp nhận kết quả và Jira owner quyết định trạng thái.
