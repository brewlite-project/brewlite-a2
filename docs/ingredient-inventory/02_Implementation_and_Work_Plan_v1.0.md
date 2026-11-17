# BrewLite A2 — Ingredient Inventory Implementation & Work Plan

**Version:** 1.0 | **Status:** Planning, NOT authorized for code changes until official schedule update and D-01..D-08 decisions.
**Owners:** Khang (leader), Hoàng (implementation).
**Contract:** `01_Ingredient_Inventory_Decision_Spec_v1.0.md`. **Test gates:** `03_Test_and_Release_Gates_v1.0.md`.

## 1. Nguyên tắc Git / Environment / CD

- `feature/*` và `dev` là **Git branches**, không phải Local/Staging. Local = Docker / PostgreSQL trên laptop; Production = code đang chạy trên Vercel + Render và Production DB.
- **Render A2 auto-deploy khi `main` có commit mới**, theo cấu hình đã xác minh: `After CI Checks Pass`. Do đó không push/merge thử vào `main`.
- Giữ Production baseline demo thành công tại `365f352` làm mốc tham chiếu; trước triển khai phải `git fetch` và xác minh HEAD hiện tại (commit này có thể đã lỗi thời).
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

- Verify `dev` diff from `main`, reviewed PR, CI green, migration compatibility and rollback plan.
- Backup Production DB and verify restore route, check old active Order policy.
- Merge `dev` → `main` only during planned release slot; observe Render Auto-Deploy commit and logs.
- Run production smoke including one real VNPay **Sandbox** payment using existing IPN config; verify Order/Payment, inventory, history.
- **Exit:** live health, migration, operational smoke PASS; otherwise activate incident/rollback procedure.

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
