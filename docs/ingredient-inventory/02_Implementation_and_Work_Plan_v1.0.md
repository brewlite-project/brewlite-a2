# BrewLite A2 — Ingredient Inventory Implementation & Work Plan

**Version:** 1.0 | **Status:** Planning, NOT authorized for code changes until official schedule update and D-01..D-08 decisions.
**Owners:** Khang (leader), Hoàng (implementation).
**Contract:** `01_Ingredient_Inventory_Decision_Spec_v1.0.md`. **Test gates:** `03_Test_and_Release_Gates_v1.0.md`.

## 1. Nguyên tắc Git / Environment / CD

- `feature/*` và `dev` là **Git branches**, không phải Local/Staging. Local dùng Docker / PostgreSQL theo môi trường developer; deployment target và Production DB hiện tại là **NOT VERIFIED** từ repository review và phải được SCRUM-129 xác minh.
- Auto-deploy trigger, provider target và deployed commit hiện tại là **NOT VERIFIED** từ repository review. SCRUM-129 phải xác minh cấu hình deploy, commit mapping và rollback/recovery evidence; không push/merge thử vào `main` để suy luận hành vi.
- Commit `365f352` chỉ là historical reference được tài liệu cũ nêu, không là bằng chứng Production baseline/current deployed version. Trước triển khai, SCRUM-129 phải xác minh release HEAD và evidence thực tế.
- Phát triển qua branch theo Jira issue; PR nhỏ vào `dev` sau review/CI. Không push trực tiếp vào `main`.
- Chạy Docker từ đúng working tree. Nếu cần hai người test song song, mỗi người dùng DB/Compose volume độc lập, tránh nhầm môi trường. Không xóa volume khi chưa backup.
- Khi thay code/backend/schema, **rebuild/recreate Docker có kiểm soát**; với docs-only không cần. Đồng bộ bằng `git pull --ff-only origin dev`.
- `main` chỉ nhận PR release **sau** khi Local/Staging PASS và có quyết định GO được ghi trong PR. Không được tự động merge chỉ vì GitHub Actions xanh.

## 2. Ngày 0 — Chuẩn bị (chỉ đọc, không thay Production)

1. Xác nhận chính thức lịch chấm mới; nếu chưa xác nhận → không triển khai tính năng.
2. Kiểm tra `git status`, `git fetch --prune origin`, `git log -1 origin/main`, `origin/dev`; đảm bảo repo đúng `brewlite-a2`.
3. Review `schema.prisma`, SQL migrations, `orders.service.ts`, `inventory-policy.ts`, `cart-pricing.ts`, `order-expiration.service.ts`, `payment-finalization.service.ts`, Product API/FE stock display, seeds, Docker Compose và tests.
4. Lập Inventory Dependency Map: ai đang đọc/ghi `products.stock`, ai đang hoàn stock, ai dùng stock response. Tìm `stock`, `reserveInventory`, `inventoryQuantities`, `expireOrderInTransaction` và mọi references, không chỉ file tiêu biểu.
5. Kiểm tra mọi size, topping, product demo có công thức xác định. Thu thập recipe được nhóm/giảng viên chấp nhận.
6. Khang + Hoàng chốt D-01..D-08 bằng comment/PR mô tả quyết định; tạo Jira issues và phụ thuộc.
7. Ghi snapshot trạng thái và backup local/staging; xác định phạm vi khôi phục.

## 3. Chia việc rõ owner, không sửa đè cùng file

| Workstream                                 | Owner chính      | Output                                                    | Phối hợp                |
| ------------------------------------------ | ---------------- | --------------------------------------------------------- | ----------------------- |
| W1. Scope/decision/API compatibility       | Khang            | D-01..D-08; acceptance, mapping UI/DTO                    | Hoàng review            |
| W2. Prisma additive schema + migrations    | Hoàng            | ingredients, recipes, reservations, constraints           | Khang duyệt             |
| W3. Recipe seed/fixture validation         | Khang            | recipe hoàn chỉnh, unit conversion, deterministic seed    | Hoàng review            |
| W4. Ingredient calculation/reserve/release | Hoàng            | transaction-safe inventory implementation                 | Khang regression review |
| W5. Order API/FE compatibility             | Khang            | không phá `GET /products`, checkout, `/orders/me`, errors | Hoàng hỗ trợ            |
| W6. Concurrency/integration tests          | Hoàng            | deterministic tests + DB invariants                       | Khang review            |
| W7. VNPay/production regression evidence   | Khang            | signed-IPN integration; sandbox smoke after deploy        | Hoàng kiểm database     |
| W8. Release review/rollback                | Khang quyết định | PR summary, migration rehearsal, GO/NO-GO                 | Hoàng ký xác nhận       |

### 3.1 Jira ownership và dependency chain

`INV-03`…`INV-12` trong bảng này là **Jira work-item labels**. Chúng khác với `INV-01`…`INV-15` trong Test Matrix, là **test identifiers**, không phải Jira tasks.

| Jira | Work-item label | Phạm vi / owner | Dependency thực tế |
| --- | --- | --- | --- |
| SCRUM-121 | INV-03 — Schema & Migration | Hoàng | Phải hoàn thành trước mọi seed/reserve/release phụ thuộc schema. |
| SCRUM-122 | INV-04 — Ingredient & Recipe Seed | Khang | Cung cấp Recipe Master đã approved và opening stock sau khi giá trị/process seed được phê duyệt riêng. Phụ thuộc SCRUM-121. |
| SCRUM-123 | INV-05 — Atomic Ingredient Reserve | Hoàng | Dùng schema của SCRUM-121 và recipe/opening-stock data của SCRUM-122; cung cấp atomic reserve và reservation snapshots. |
| SCRUM-124 | INV-06 — Cancellation / Release | Hoàng | Phụ thuộc reservation snapshots từ SCRUM-123; restore đúng snapshot khi cancellation/expiration hợp lệ. |
| SCRUM-125 | INV-07 — Product API / Frontend / Checkout | Khang | Phụ thuộc ingredient feasibility từ schema/data/reserve; triển khai availability API/UI và checkout compatibility. |
| SCRUM-126 | INV-08 — PostgreSQL Concurrency Tests | Hoàng | Xác minh hành vi reserve/release/lock/retry sau SCRUM-123 và SCRUM-124. |
| SCRUM-127 | INV-09 — Regression Tests | Khang | Xác minh cross-feature Auth/Orders/Payment/Coupon/API/UI sau các thay đổi implementation liên quan. |
| SCRUM-128 | INV-10 — Migration Rehearsal | Hoàng | Rehearse additive migration, data validation, backup/restore và cutover trên DB riêng sau schema/seed. |
| SCRUM-129 | INV-11 — Controlled Production Release | Khang | Chỉ deploy/cutover sau khi release gates, legacy drain và rehearsal evidence đều đạt. |
| SCRUM-130 | INV-12 — VNPay Sandbox E2E / Final Freeze | Khang | Thực hiện controlled real VNPay Sandbox E2E trước reopening normal traffic; final freeze chỉ sau evidence hợp lệ. |

Dependency chain này là kế hoạch thực hiện, không phải task status hay bằng chứng rằng implementation/test/release đã xảy ra.

**Codex role:** audit read-only trước khi viết code, sau đó sửa có phạm vi theo từng workstream, tạo unit/integration tests, xuất diff/test logs. Codex không được tự sửa Payment State Machine, đổi IPN hoặc tự merge `main`.

## 4. Kế hoạch kỹ thuật theo pha

### Pha A — Audit + design (Day 1)

- Inventory Dependency Map + schema decision + recipe/data validation.
- Identify risk with Product API `stock`/FE. Confirm backward-compatibility.
- PR docs **mới** nếu cần, không chỉnh lịch sử docs.
- **Exit:** mọi quyết định OPEN đã xử lý, có owner, acceptance tests.

### Pha B — Schema + seed (Day 2)

- Migration chỉ thêm bảng/index/check; không DROP legacy column.
- Prisma client generated, test migration từ DB sạch **và** DB dữ liệu tồn tại.
- Seed đủ cho catalog demo; idempotent seed và không xóa user/orders.
- **Exit:** `prisma migrate deploy` local PASS, rollback/restore rehearsal PASS.

### Pha C — Inventory integration (Day 3)

- Resolve recipe/size/topping; aggregate ingredient quantities; atomic decrement with `stock >= demand`.
- Store immutable order ingredient reservation snapshot in same transaction.
- On cancellation use snapshot and one-time flag/order transition to restore.
- Preserve transaction boundaries; do not alter payment gateway code.
- **Exit:** unit tests + happy/negative order integration PASS.

### Pha D — Concurrency + edge cases (Day 4)

- Concurrent different products same ingredient; multi-item, multi-size, topping shared ingredient.
- Duplicate expiration/scheduler and lazy cleanup, recipe changed after reservation.
- DB invariant assertions; lock timeout/deadlock handling; coupon interactions.
- **Exit:** critical cases deterministic PASS repeatedly.

### Pha E — Regression & Staging (Day 5)

- End-to-end Local: auth, catalog, cart, create order, coupon, history; payment signed fixtures, duplicate IPN, pending/grace/cancel; ZERO_AMOUNT/Mock if applicable.
- Rebuild/recreate only affected containers, run CI equivalent locally.
- Stage data/migration on isolated DB where possible; do not point staging to production.
- **Exit:** no critical/major regressions; failed tests addressed, documented gaps.

### Pha F — Controlled release (Day 6, only if GO)

- **1. Pre-release validation:** xác minh reviewed PR/CI, migration compatibility, backup/restore route, required PostgreSQL/regression evidence và rollback/recovery plan. Pre-release real VNPay Sandbox E2E chỉ có thể ghi `NOT EXECUTED — accepted residual risk` cho controlled deployment khi không thể thực hiện mà không đổi live IPN configuration; không miễn post-deploy E2E.
- **2. D-05 legacy drain và reconciliation:** bật Backend-level maintenance gate chặn normal `POST /orders`, drain request in-flight, ngăn legacy/new inventory write overlap, block payment initiation mới cho legacy unpaid Order, và reconcile stock-release/financial outcome trước cutover. Vẫn giữ valid VNPay IPN, QueryDR và finalization paths.
- **3. Controlled deployment/cutover:** chỉ deploy trong release slot sau khi các gate trước đó có evidence; giữ `Product.stock` schema compatibility và không blind rollback về Product stock sau khi ingredient-backed Order tồn tại.
- **4. Post-deploy verification trong controlled state:** khi normal customer Order creation vẫn bị block, dùng secure test-only Order creation procedure đã được authorized hoặc cơ chế tương đương đã verified. Chạy production smoke và real VNPay Sandbox E2E với merchant IPN URL/signing được SCRUM-129/130 xác minh và không thay đổi trong scope này; xác minh ingredient reserve, Payment SUCCESS, Order PAID, không release ingredient của PAID Order, `GET /orders/me` và DB reservation/stock invariants.
- **5. Reopen normal traffic:** chỉ sau khi mọi mandatory post-deploy gate có evidence PASS. Nếu E2E fail, không thể chạy hoặc thiếu evidence thì **NO-GO**, giữ maintenance/controlled state và dùng recovery plan an toàn đã review.

### D-05 — Legacy active Order drain checklist trước cutover

Đây là **approved design requirement** của D-05. Cơ chế Backend, evidence database và Production runbook tương ứng vẫn phải được implementation/rehearsal/verification riêng; không mục nào bên dưới xác nhận chúng đã tồn tại hoặc đã chạy.

1. Xác minh có cơ chế Backend-level để block request `POST /orders` mới; không dựa riêng vào việc ẩn control Frontend.
2. Drain mọi Create Order request đang in-flight và ngăn legacy `Product.stock` write overlap với ingredient-inventory write trong lúc cutover.
3. Block payment initiation **mới** cho legacy unpaid Order trong controlled drain; vẫn giữ các path VNPay IPN, QueryDR và finalization hợp lệ để xác minh outcome.
4. Reconcile mọi legacy Order còn nghĩa vụ restore stock hoặc financial resolution; không suy diễn financial finality chỉ từ TTL 15 phút và VNPay Grace 5 phút.
5. Xác nhận bằng DB evidence rằng không còn legacy stock-release obligation hoặc unknown VNPay payment outcome trước khi switch inventory source of truth.
6. Giữ legacy PAID Order trong Order History; không tạo synthetic ingredient reservation snapshot cho Order cũ.
7. Giữ backup/restore và safe recovery procedure đã được chuẩn bị; nếu bất kỳ drain gate nào fail hoặc không thể verify thì **NO-GO**.

### Pha G — Freeze & defend (Day 7)

- Freeze release, evidence, README/report update after actual results only; prepare architecture story and limitations.
- No scope expansion and no unreviewed commits.

## 5. Handoff workflow giữa Khang và Hoàng

- Một Jira task = một branch = một PR với: **business rule**, impacted files, DB migration, tests, example request/response, rollout impact.
- PR nhỏ, merge `dev` có reviewer thật; kiểm tra conflict trên `inventory-policy.ts`, `orders.service.ts` trước khi đồng thời sửa.
- Sau khi merge vào `dev`, đồng bộ với `git pull --ff-only origin dev`, rebuild Docker nếu code/runtime changed.
- Khang kiểm tra các bất biến bằng Postman + SQL, không chỉ xem UI xanh; Hoàng đính kèm concurrency logs.
- Không thay đổi secrets, merchant IPN, `main`, production DB trong giai đoạn develop.

## 6. Audit prompt cho Codex (chỉ đọc)

```text
You are auditing BrewLite A2 ingredient-level inventory enhancement. READ-ONLY mode.
Do not edit files, run migrations, seeds, docker compose down -v, or push.
Inspect HEAD current of apps/api, apps/web, prisma/schema, SQL migrations, tests and docs.
Find EVERY usage of Product.stock and every inventory reservation/release path.
Map dependencies among OrdersService.create, priceCart, inventory-policy,
OrderExpirationService, PaymentFinalizationService, VNPay IPN/QueryDR,
Product API/UI and GET /orders/me.
Compare against 01_Ingredient_Inventory_Decision_Spec_v1.0.md.
Output: (1) observed facts with file:line; (2) risk-ranked impact map;
(3) minimal schema additions and compatibility plan;
(4) lock-order/conflict risks; (5) proposed test cases; (6) OPEN questions.
Treat current source as authoritative for implementation. Do not infer production health
from source or change VNPay merchant IPN URL.
```

## 7. STOP conditions

- Chưa có lịch chấm mới chính thức.
- Recipe/size/topping data không thể chốt đủ.
- Không thể xác định source of truth cho `stock` hoặc active legacy orders.
- Không test được invariant nhiều sản phẩm chung nguyên liệu, duplicate release, rollback.
- VNPay Payment/Order state regression không đạt hoặc buộc phải rewrite Payment logic.
- Migration không tương thích hoặc chưa thử backup restore.
- Chưa đủ thời gian cho release rehearsal và dự phòng. **Giữ baseline, trình bày improvement design nếu stop.**
