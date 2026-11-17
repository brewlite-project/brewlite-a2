# BrewLite A2 — Ingredient Inventory Decision & Specification

**Phiên bản:** 1.0 — Decision baseline; D-01..D-08 approval recorded.
**Trạng thái:** DESIGN BASELINE COMPLETE — chờ final consistency review, commit/PR/merge và Jira closure; implementation, migration, test và deployment vẫn NOT EXECUTED nếu không có evidence riêng.
**Owners:** Khang (leader/acceptance), Hoàng (implementation/concurrency).
**Phạm vi:** Chuyển từ trừ `Product.stock` theo số ly sang quản lý tồn kho **nguyên liệu thực tế** trong luồng Order/Inventory, không viết lại Payment.
**Nguồn đối chiếu:** `orders.service.ts`, `inventory-policy.ts`, `cart-pricing.ts`, Prisma schema + SQL migrations tại commit làm việc; Payment Architecture Phase 2; API Contract hiện hành. Tên bảng/file mới trong tài liệu là đề xuất, không tuyên bố đã tồn tại.
**Tài liệu khác:** `02_Implementation_and_Work_Plan_v1.0.md`, `03_Test_and_Release_Gates_v1.0.md`.

## 1. Mục tiêu và bất biến

1. Khi tạo một Order hợp lệ, Backend tính **định lượng từng nguyên liệu** từ công thức sản phẩm + size + topping, cộng gộp theo nguyên liệu trên toàn giỏ, và **giữ/trừ** nguyên liệu trong **cùng DB transaction** tạo Order.
2. Nếu bất kỳ nguyên liệu nào không đủ, trả lỗi nghiệp vụ 409 và **không tạo Order, không giảm một phần nguyên liệu, không giữ coupon**.
3. Khi Order `PENDING` / `PAYMENT_FAILED` được hủy do hết hạn, phục hồi **đúng số lượng nguyên liệu đã giữ của Order đó, một lần duy nhất**, không tính lại bằng công thức hiện hành.
4. Order đã `PAID` không được tự động trả nguyên liệu do duplicate IPN, QueryDR, scheduler hoặc retry.
5. Không thay đổi hợp đồng `POST /payments/vnpay/initiate`, IPN, QueryDR, `GET /orders/me`, JWT/ownership, payment idempotency, coupon/loyalty, giá tiền, Order TTL 15 phút và VNPay Grace 5 phút.
6. Duy trì tính cạnh tranh an toàn khi **hai sản phẩm khác nhau sử dụng chung nguyên liệu**; không bán vượt nguyên liệu.
7. Policy yêu cầu A1, A2 Local và A2 Production độc lập về database/volume. Trạng thái isolation triển khai thực tế là **NOT VERIFIED** trong repository review. Không sửa VNPay merchant IPN configuration cho giai đoạn này.
8. Không hứa hẹn 100% không lỗi: dùng kiểm thử, release gates, dữ liệu dự phòng và fallback để giảm rủi ro.

## 2. Phạm vi giới hạn

**IN:** Ingredient catalog, recipe theo size, công thức topping, reservation snapshot, reserve/restore transaction, quy tắc tồn/khả dụng, seed demo, migration additive, API compatibility, regression và integration tests, README/báo cáo sau khi nghiệm thu.

**OUT:** POS, nhập kho/xuất kho giao diện admin, giá vốn, kế toán, nhiều kho, lô/hạn dùng, tự động mua hàng, refund, thay thuật toán VNPay, đổi IPN URL, thiết kế lại JWT, đổi UI checkout lớn, làm lại toàn bộ tài liệu cũ.

**Nguyên tắc:** Chỉ thay đổi đường đi Inventory cần thiết; không biến đợt nâng cấp thành một refactor toàn hệ thống.

## 3. Khác biệt với code hiện tại (đã quan sát ở snapshot source)

- `inventoryQuantities(dto.items)` cộng số ly theo `productId`; `reserveInventory` gọi `tx.product.updateMany` với `stock >= quantity` rồi giảm `Product.stock`.
- `expireOrderInTransaction` xét trạng thái, DB clock, VNPay pending/Grace; `cancelLockedOrderAndReleaseInTransaction` hoàn `Product.stock` từ `order_items`.
- `priceCart` tính **giá bán** từ `basePriceVnd`, hệ số size và giá topping. Giá bán và định lượng nguyên liệu là hai bài toán độc lập; không dùng tỷ lệ giá để suy ra nguyên liệu.
- `orders.service.create` hiện kết hợp price, stock, coupon và tạo Order/OrderItems trong transaction; đây là điểm cần tích hợp reservation nguyên liệu.

**Cảnh báo:** Source trích từ các file đã gửi trước; team phải đối chiếu với HEAD mới nhất trước khi coding. Tài liệu này không thay thế audit repository.

## 4. Đề xuất data model (đặt tên tạm cho đến khi audit Prisma)

### `ingredients`

- `id` UUID PK; `code` UNIQUE, `name`; mỗi ingredient có đúng một `base_unit` thuộc `G`, `ML`, `MG`, `UNIT`.
- MVP dùng Prisma `Int` / PostgreSQL `INTEGER`: `stock_quantity` là integer không âm trong `0..2,147,483,647`; `is_active`; `created_at`, `updated_at`. BigInt **không** là lựa chọn MVP; mọi migration BigInt trong tương lai cần design approval riêng.
- Không dùng Float cho số lượng nguyên liệu. `quantity_per_unit` và `quantity_per_topping` phải là integer dương trong PostgreSQL `INTEGER` bounds. Nếu cần độ chia nhỏ, chọn **đơn vị integer nhỏ hơn** (ví dụ MG thay vì G); chỉ conversion chính xác tại input/seed/admin boundary, không âm thầm làm tròn hoặc convert trong checkout transaction.
- Trước write phải checked multiplication (`cart quantity × recipe quantity`), aggregation theo ingredient và conversion tại boundary; reject overflow, fractional canonical result hoặc unit không hỗ trợ để transaction rollback toàn bộ.

### `recipe_ingredients`

- `id`, `product_id`, `size`, `ingredient_id`, `quantity_per_unit` (integer > 0).
- Unique `(product_id, size, ingredient_id)`, FK và check; công thức size `ONE_SIZE` được hỗ trợ.
- Một công thức phải có đủ nguyên liệu cần dùng; không fallback sang `Product.stock` khi thiếu recipe.

### `topping_ingredients`

- `id`, `topping_id`, `ingredient_id`, `quantity_per_topping` (integer > 0), unique `(topping_id, ingredient_id)`.
- Áp dụng cho mỗi topping được chọn trên mỗi ly; kiểm tra cùng nguyên liệu có xuất hiện cả trong sản phẩm và topping.

### `order_ingredient_reservations` — D-06 APPROVED Option A

- `id`, `order_id`, `ingredient_id`, `quantity_reserved`, `created_at`, `released_at` (nullable) là required fields trừ `released_at`; dùng FK hợp lệ và `UNIQUE (order_id, ingredient_id)`, `CHECK (quantity_reserved > 0)`. `ingredients.stock_quantity` phải có `CHECK >= 0`.
- Lưu aggregate snapshot immutable của toàn Order, tạo atomically cùng Order creation và ingredient stock deduction; không tính lại recipe hoặc `Product.stock` khi restore.
- Không tạo `ReservationStatus` enum. Suy từ `orders.status` + `released_at`: `PENDING`/`PAYMENT_FAILED` = **RESERVED**; `PAID` và các fulfillment state sau paid = **CONSUMED**; `CANCELLED` qua cancellation unpaid hợp lệ với `released_at` populated = **RELEASED**. One-time release phải dựa lock transaction và conditional Order transition, không dựa riêng `released_at`.
- Phải có cơ chế snapshot-integrity có thể kiểm chứng để phát hiện thiếu hoặc bị sửa reservation data; row count không đủ. Persistence design cụ thể để owner SCRUM-121/123 đề xuất và review; checksum đơn lẻ không được tuyên bố ngăn được authorized tampering.

### Tương thích `products.stock`

- Đề xuất: giữ cột legacy tạm để migration tránh phá code, **không dùng nó làm nguồn quyết định bán** sau khi bật inventory ingredients.
- Các API/Product UI hiện tiêu thụ `stock` phải được audit: hoặc chuyển sang **số ly tối đa có thể bán tính từ recipe** hoặc hiển thị trạng thái availability có nguồn duy nhất. Không để Product.stock giả gây sai lệch trong UI/validation.
- Việc xóa cột cũ là **ngoài phạm vi MVP**.

## 5. Cách tính nguyên liệu (ví dụ theo DEMO Recipe Master đã duyệt)

Order: Cà Phê Muối Cố Đô size M × 2, mỗi ly thêm topping Kem cheese (`CHEESE_FOAM`).

Đây là tổ hợp Product/Size/Topping hợp lệ theo Recipe Master v1.0. Các định lượng là dữ liệu DEMO đã duyệt, không phải công thức thương mại.

| Nguồn               | Ingredient     |  Mỗi ly | Tổng 2 ly |
| ------------------- | -------------- | ------: | --------: |
| Recipe M            | COFFEE_BEANS   |    20 G |      40 G |
| Recipe M            | CONDENSED_MILK |   18 ML |     36 ML |
| Recipe M            | FRESH_MILK     |   60 ML |    120 ML |
| Recipe M            | DAIRY_CREAM    |   20 ML |     40 ML |
| Recipe M            | SALT           | 1000 MG |   2000 MG |
| Topping CHEESE_FOAM | CHEESE_FOAM    |   30 ML |     60 ML |

**Tính:** Với mỗi cart line, xác thực Product/Size và topping eligibility, resolve base recipe và topping recipe, nhân với quantity, sau đó cộng gộp theo `ingredient_id` trên toàn Order. Khóa nguyên liệu theo thứ tự xác định và reserve atomically trong cùng transaction tạo Order. Nếu thiếu recipe, ingredient inactive hoặc không đủ tồn kho, rollback toàn bộ; không mặc định lượng tiêu hao bằng 0.

### Quy tắc tồn kho khả dụng

- Tồn gốc là số lượng ingredients. Một sản phẩm có thể không đủ nguyên liệu dù chỉ còn thiếu một thành phần.
- Nếu nhiều sản phẩm dùng chung một nguyên liệu, mọi request phải kiểm tra/trừ cùng hàng ingredient ở database.
- `quantity_per_unit` và `stock_quantity` phải cùng base unit; conversion làm ở seed/admin boundary, không ở transaction thanh toán.

## 6. Transaction và concurrency

Pseudocode nghiệp vụ:

```ts
return prisma.$transaction(async (tx) => {
  // 1. Verify authenticated user and active Order policy.
  // 2. priceCart(): preserve the CURRENT pricing contract.
  // 3. Calculate aggregated required ingredients using validated recipes.
  // 4. Acquire / update ingredient rows in deterministic ingredient-id order.
  //    UPDATE ... SET stock_quantity = stock_quantity - :q
  //    WHERE id = :id AND stock_quantity >= :q;
  //    If affected rows != 1: classify inside this transaction; only valid
  //    ingredient with insufficient stock returns 409 INSUFFICIENT_STOCK.
  // 5. Reserve coupon under existing policy.
  // 6. Create Order + OrderItems + Toppings + OrderIngredientReservations.
  // 7. Commit all or rollback all.
});
```

**Lock order:** D-07 chốt contract cụ thể bên dưới. Không thêm HTTP gateway call trong transaction.

**Concurrent invariants:** Không âm stock; không oversell; không partial reserve; không double release; không tạo 2 active Order trên 1 user; mỗi ingredient reservation duy nhất cho 1 Order.

### D-07 — Transaction locking, retry và concurrency (APPROVED — Option A)

1. Mở rộng helper/architecture hiện có, không tạo global coordinator hoặc global lock serialize mọi user/Order. Giữ user advisory lock của Create, Order/Payment/Coupon/VNPay architecture và Payment Order-first, Payment-second locking. Không tạo Ingredient → Payment locking cho cùng Order.
2. Create Order: validate/price theo contract; aggregate toàn Order, normalize `ingredient_id`, validate demand; conditional decrement từng Ingredient theo ascending `ingredient_id`; rồi reserve Coupon theo policy hiện có; tạo Order/items/immutable reservation snapshot trong cùng transaction. Không phụ thuộc Cart/Product iteration order và không partial commit.
3. Expire/cancel: lock Order trước, recheck TTL/VNPay Grace/Payment safeguards và snapshot integrity; conditional transition eligible Order sang `CANCELLED`; restore exact Ingredient quantities theo cùng order xác định, write `released_at`, rồi release Coupon trong một transaction. Path mutate cả hai phải giữ Ingredient-before-Coupon; audit implicit row/FK locks khi implementation. Finalization SUCCESS/PAID không release; financial exception/cancellation tái dùng cùng release primitive.
4. Conditional decrement phải dùng `stock_quantity >= demand` và assert đúng một affected row. `affectedRows = 0` phải được phân loại trong transaction: ingredient hợp lệ nhưng thiếu stock → `409 INSUFFICIENT_STOCK`; missing/inactive/invalid ingredient hoặc corrupt config → integrity/availability error theo policy đã duyệt, không tự tạo public code mới và không TOCTOU read ngoài transaction.
5. Numeric safety bắt buộc: recipe/cart positive integer, checked multiply/aggregate, `Number.isSafeInteger`, bound Prisma `Int`/PostgreSQL `INTEGER`, và conditional underflow/overflow protection. Vi phạm rollback toàn bộ transaction.
6. `runInventoryTransaction` là VERIFIED baseline cho Create, scheduler và lazy expiration: `READ COMMITTED`, `lock_timeout=1500ms`, `maxWait=2000ms`, timeout `8000ms`, tối đa 3 attempts, retry `P2034`/`40P01`/`40001`/`55P03`. Đây không phải thông số tối ưu đã chốt; chỉ reassess bằng PostgreSQL concurrency tests và owner review. Retry whole aborted transaction tại đúng owner, không retry uncertain commit và không nest retry loop độc lập trong Payment/IPN/QueryDR boundary. Contention/retry exhaustion không được báo `INSUFFICIENT_STOCK`, fake Payment `FAILED` hoặc Order `CANCELLED`.
7. Không giữ interactive DB transaction qua VNPay QueryDR HTTP. Bắt buộc PostgreSQL tests thật: Product khác chia sẻ Ingredient; A/B reverse cart order; Create vs scheduler/lazy expiration; scheduler vs VNPay SUCCESS; concurrent cancel; duplicate IPN/QueryDR; partial rollback; snapshot corruption/missing; retryable failure/exhaustion; underflow/overflow; Coupon/Payment regressions. Approval chỉ covers design, không xác nhận migration, implementation, test execution hay production readiness.

## 7. Cancel / TTL / VNPay Grace / Payment safety

- Reuse `expireOrderInTransaction()` và `cancelLockedOrderAndReleaseInTransaction()` hiện có; thay phần restore `Product.stock` bằng restore từ `order_ingredient_reservations`.
- Giữ nguyên đánh giá TTL/Grace dựa DB clock và trạng thái VNPay PENDING. Việc hết 15 phút không tự động hủy Order có VNPay pending đang còn trong Grace.
- Mỗi Order CANCELLED phải hoàn inventory **đúng một lần**, kể cả scheduler chạy lại hoặc lazy cleanup từ Create Order.
- Khi IPN hợp lệ → PAID, nguyên liệu đã reserve được coi là thuộc Order đã thanh toán, không hoàn. Payment Finalization, idempotency, coupon/loyalty tiếp tục hoạt động như trước.
- Late financial SUCCESS sau Order CANCELLED là ngoại lệ tài chính; không tự phục hồi Order/stock, không tạo đơn mới hay giao hàng từ callback.
- QueryDR không được suy diễn FAILED từ timeout; không yêu cầu thay đổi VNPay signing/callback trong đợt Inventory.

### D-06 — Reservation lifecycle (APPROVED — Option A)

1. Khi cancellation unpaid đủ điều kiện: lock Order; recheck TTL, VNPay pending/Grace và payment safeguards hiện có; validate snapshot-integrity; conditional transition Order sang `CANCELLED`; restore đúng aggregate `quantity_reserved` theo ingredient order xác định; write `released_at` cho mọi snapshot tương ứng; release coupon theo policy hiện có; rồi commit atomically. Áp dụng final cross-module lock ordering và retry rule của D-07.
2. Nếu bất kỳ bước nào fail, rollback toàn bộ: không partial ingredient restore, coupon release, `released_at` hoặc false `CANCELLED`. Missing, incomplete hoặc corrupt snapshot là integrity failure: abort transaction, surface operational error để điều tra; không coi là zero demand và không silent repair bằng recipe hiện tại.
3. Order `PAID` và paid fulfillment state không được đi vào unpaid release path. Duplicate IPN, QueryDR hoặc scheduler retry không được gây duplicate release. Legacy Order không có ingredient snapshot theo D-05 không được đi vào ingredient release path và không tạo synthetic reservation.
4. Bắt buộc PostgreSQL integration tests thật cho: scheduler vs lazy expiration; concurrent cancellation; scheduler vs VNPay SUCCESS; duplicate IPN/QueryDR; rollback sau partial ingredient update; snapshot-integrity failure; PAID Order never restored; deadlock/serialization retry. Approval này chỉ covers design, không xác nhận migration, implementation, test execution hay production readiness.

## 8. API compatibility và hiển thị

- Giữ body/response của `POST /orders`, `GET /orders/me` và payment API. D-03 quy định cụ thể compatibility cho Product API bên dưới.
- D-04 giữ HTTP `409` và business code `INSUFFICIENT_STOCK` cho thiếu tồn ingredient thực tế khi tạo Order. Không đổi sang `INSUFFICIENT_INGREDIENT_STOCK`; UI đang xử lý `INSUFFICIENT_STOCK` phải được regression test khi implementation.
- `GET /orders/me` phải giữ Order snapshots/payment summary/pagination; không có dữ liệu ingredient reservation trong response nếu không cần.

### D-03 — Product Availability (APPROVED — Option B)

1. Giữ `GET /products` và `GET /products/:id`; không tạo endpoint mới.
2. Sau ingredient inventory cutover, `Product.isAvailable` là `true` **chỉ khi** Category của Product active, có ít nhất một Product/Size được hỗ trợ mà base recipe đã duyệt có thể được đáp ứng bởi tồn ingredient hiện tại, và mọi ingredient/recipe được tham chiếu hợp lệ, active khi áp dụng. Availability của từng size phải tính từ đúng base recipe Product/Size đó.
3. `GET /products` giữ nguyên JSON response shape và field `isAvailable`; chỉ thay nguồn ngữ nghĩa từ `Product.stock` sang ingredient availability theo mục 2. Không public raw ingredient stock, recipe nội bộ hoặc reservation.
4. `GET /products/:id` được mở rộng additive bằng `sizes[].isAvailable: boolean` và `toppings[].isAvailable: boolean`. Implementation phải cập nhật active API documentation, Swagger và DTO cùng nhau; không âm thầm sửa API Contract đã lưu trữ. API Contract baseline đã phê duyệt vẫn cần được xác minh.
5. Chỉ topping được phép bởi `ProductTopping` và active/available về nghiệp vụ mới ở trong response. Topping đủ điều kiện vẫn hiển thị khi thiếu ingredient; `toppings[].isAvailable` là `false` nếu topping recipe không đáp ứng được tồn ingredient hoặc recipe không hợp lệ. Topping optional không khả dụng không làm base Product hoặc size không khả dụng.
6. Frontend phải giữ các field availability size/topping trong TypeScript type và API mapping, mặc định size khả dụng đầu tiên, disable size/topping không khả dụng, và không thêm lựa chọn không khả dụng vào Cart. Giữ nguyên xử lý lỗi checkout hiện có.
7. Availability từ GET là UI hint tại một thời điểm, không phải bảo đảm reservation. `POST /orders` vẫn là source of truth: phải tự validate Product/Size/Topping và aggregate demand rồi reserve inventory atomically, không tin availability từ client.
8. Giữ cột legacy `Product.stock` trong additive migration, nhưng không dùng nó làm fallback availability sau ingredient cutover. SCRUM-125 sở hữu implementation Product API/Frontend của quyết định này; không tạo Jira task mới.

### D-04 — Error Compatibility (APPROVED — Option A)

1. Khi aggregate demand của một Order thiếu bất kỳ ingredient thực tế nào, trả HTTP `409` với business code `INSUFFICIENT_STOCK`. Giữ envelope lỗi hiện hữu gồm `statusCode`, `error`, `code`, `message` và `details` khi có; source hiện tại dùng `{ statusCode: 409, error: "Conflict", code: "INSUFFICIENT_STOCK", message: "Insufficient product stock", details: [...] }` cho thiếu legacy Product stock.
2. Ingredient-shortage `details` là optional trong MVP. Không yêu cầu public ingredient ID, lượng tồn, lượng cần, raw recipe hoặc reservation; implementation không được coi shape `details` legacy hiện tại là contract bắt buộc cho ingredient inventory.
3. Missing recipe, invalid recipe hoặc inactive ingredient phải bị từ chối theo validation/business-error rules hiện hành, nhưng không được báo sai là `INSUFFICIENT_STOCK`. Product/Size/Topping input không hợp lệ tiếp tục dùng các validation/business-error rules hiện có; D-04 không phê duyệt public error code mới hoặc tự gán code cho các tình huống đó.
4. Lock timeout, deadlock và retry exhaustion là concurrency failure thuộc quyết định D-07; không tự map các lỗi này thành `INSUFFICIENT_STOCK`.
5. Nếu thiếu ingredient, transaction phải rollback toàn bộ: không tạo Order, không trừ một phần ingredient, không reserve coupon và không tạo partial reservation snapshot.
6. Frontend `CartDrawer` tiếp tục nhận diện `INSUFFICIENT_STOCK` và giữ error UX hiện có. Actual HTTP/Swagger/Frontend regression tests vẫn pending implementation, chưa được thực thi hoặc xác nhận bởi quyết định này.

## 9. Chính sách migration / dữ liệu cũ

1. **Additive migration**: tạo bảng/cột/index/check mới trước khi đổi read/write logic; không DROP `Product.stock` trong MVP.
2. Local hoặc staging database riêng; backup trước và thử restore. Không chạy seed phá dữ liệu Production.
3. D-05 Option A (xem subsection bên dưới) thay thế mọi phương án backfill legacy: phải drain toàn bộ legacy active Order trước cutover, block Create Order ở Backend, drain request in-flight, block payment initiation mới cho legacy unpaid Order nhưng giữ IPN/QueryDR/finalization hợp lệ, rồi reconcile stock-release/financial outcome bằng evidence DB/payment. Legacy PAID Order giữ trong history; không tạo synthetic ingredient reservation, không restore bằng ingredient recipe hiện tại. Nếu còn obligation/outcome unresolved hoặc drain không verify được thì **NO-GO**; áp dụng backup/restore/recovery an toàn.
4. Gắn việc đổi source of truth với release gate. Nếu cần code cũ chạy được trên schema mới, migration phải backward-compatible; rollback code không đồng nghĩa rollback migration.
5. Snapshot/reseed data chỉ là test fixture, không phải công thức thật trừ khi được hai owner chốt.

### D-05 — Legacy active Order cutover (APPROVED — Option A: drain trước cutover)

1. Trước production cutover phải block tạo Order mới tại Backend; chỉ ẩn control Frontend là không đủ. Runbook phải chờ mọi Create Order request đang in-flight hoàn tất hoặc rollback, để legacy Product-stock write và ingredient-inventory write không overlap.
2. Trong drain, block payment initiation mới cho legacy unpaid Order, nhưng giữ nguyên các path IPN/QueryDR/finalization hợp lệ đã tồn tại để xác minh outcome. Không đổi Payment state machine, VNPay signing, IPN URL, QueryDR, coupon hoặc TTL semantics.
3. Chỉ GO khi database/payment verification xác nhận mọi legacy Order có nghĩa vụ release stock đã được resolve hoặc reconcile, không còn legacy payment outcome financially uncertain. TTL 15 phút và VNPay Grace 5 phút không tự là bằng chứng drain đủ.
4. Cancellation/expiration legacy áp dụng logic hiện hữu: chỉ Order `PENDING`/`PAYMENT_FAILED` được chuyển `CANCELLED` và restore `Product.stock` một lần trong transaction khi áp dụng. Order `PAID` tiếp tục có trong Order History, không cần ingredient reservation và không được release inventory.
5. Không bao giờ tạo synthetic `order_ingredient_reservations` cho Order cũ bằng recipe hiện tại. Giữ `Product.stock` trong MVP để backward-compatible schema và xử lý legacy, nhưng không dùng nó cho new inventory decision sau ingredient cutover.
6. Trước switch source of truth, bắt buộc backup, migration rehearsal, restore verification, validation ingredient schema/data/seed và required integration/regression tests. GO/NO-GO checklist phải xác nhận: Backend đã block Create Order mới và in-flight đã drain; không còn legacy Order cần release; không còn unknown legacy payment outcome; ingredient schema/data hợp lệ; test bắt buộc PASS; và có recovery plan an toàn.
7. Rollback phải an toàn cho Order đã dùng ingredient inventory. Revert application code đơn thuần không phải rollback hợp lệ sau khi đã có Order mới; phải dùng recovery plan đã được chuẩn bị và được xác minh. Cơ chế maintenance gate, drain, reconciliation, backup/restore và recovery là implementation/release work pending verification, không phải feature đã hoàn thành bởi quyết định này.

## 10. VNPay: giữ nguyên cấu hình, tách kiểm thử

**Quyết định đã chốt:** Không cấu hình lại Merchant Sandbox IPN URL, không sửa signing/QueryDR, không đổi production secrets. Khách chỉ chuyển sang VNPay **sau khi POST /orders tạo Order hợp lệ** và inventory đã được reserve.

**Operational state — NOT VERIFIED:** Repository không chứng minh current merchant IPN URL/callback target, deployed version, Production traffic, maintenance/test-only access hoặc rollback capability. SCRUM-129 phải xác minh maintenance/drain/recovery và deployment evidence; SCRUM-130 phải xác minh merchant callback target cùng real Sandbox E2E trước reopen normal traffic.

- **Local pre-release:** Test trực tiếp Order → Payment integration bằng unit/integration tests, fixtures IPN có chữ ký hợp lệ, replay callback, expiration/grace và DB assertions. Những test này **không tương đương VNPay Sandbox E2E thật** nếu merchant callback target đã xác minh không trỏ về môi trường test đó.
- **Pre-release với sandbox thật:** Chỉ tính E2E khi có một môi trường callback độc lập được kết nối đúng hoặc một kỹ thuật thử nghiệm không làm thay đổi IPN Production và được chứng minh; nếu không, đánh dấu E2E sandbox trước release là **NOT EXECUTED**.
- **Post-release:** Chạy ngay một giao dịch VNPay Sandbox qua deployment target đã được SCRUM-129/130 xác minh, giữ IPN đã xác minh không đổi; xác minh Payment SUCCESS, Order PAID, ingredient reservation không bị hoàn, GET /orders/me và database. Nếu lỗi nghiêm trọng phải dừng nhận traffic theo phương án rollback có chuẩn bị, không đoán trạng thái thanh toán.

### D-08 — Controlled Production Release & GO/NO-GO (APPROVED — Option A)

1. D-08 chỉ phê duyệt design release gate, không xác lập production readiness. Các phase bắt buộc tách riêng: pre-release validation; D-05 legacy Order drain; controlled deployment/cutover; post-deploy verification; rồi mới reopen normal traffic.
2. Pre-release chỉ đạt khi: D-01..D-07 design baseline approved; schema/migration rehearsal, backup và restore đã verified; Ingredient Master/Recipe cùng opening-stock values và fixture source đã được SCRUM-122 phê duyệt rồi validated; atomic reserve/exact one-time release, snapshot-integrity, concurrency/failure-injection và Payment/Coupon/Order regressions đã PASS trên evidence thực; monitoring và recovery procedure đã sẵn sàng.
3. Trước cutover, áp dụng D-05: Backend block normal Create Order, drain in-flight request, reconcile legacy Order/release obligation và uncertain VNPay payment. TTL 15 phút hoặc Grace 5 phút không tự là proof đủ. Giữ merchant Sandbox configuration, IPN URL, signing, callback và QueryDR semantics trừ khi có approval riêng; pre-release payment integration/replay tests là bắt buộc.
4. Nếu real VNPay Sandbox E2E trước cutover không thể chạy mà không đổi live IPN configuration, phải ghi đúng `NOT EXECUTED — accepted residual risk` chỉ cho controlled deployment; không waive post-deploy E2E gate. Controlled E2E phải vẫn khả thi khi general Create Order bị block, qua secure test-only access đã explicitly authorized hoặc controlled procedure tương đương đã verified; tài liệu này không khẳng định mechanism đó đã tồn tại.
5. Trước reopen normal traffic, phải PASS production health/smoke và một controlled real VNPay Sandbox E2E: Order creation, ingredient reserve, Payment SUCCESS, Order PAID, không release ingredient khi PAID, `GET /orders/me`, DB reservation/stock invariants, và không có unresolved financial exception từ test transaction. Fail, không thể execute, hoặc thiếu evidence là NO-GO; giữ maintenance/controlled state.
6. Rollback/recovery plan phải bảo toàn Order/Payment/Ingredient data; không blindly revert về `Product.stock` sau khi đã có ingredient-backed Order. Phân biệt safe code rollback với database/data recovery; owner review và verification bắt buộc trước khi restore traffic. SCRUM-128 sở hữu migration-rehearsal evidence, SCRUM-129 controlled release/cutover, SCRUM-130 real VNPay E2E/final freeze.

## 11. Quyết định và trạng thái owner review

| ID   | Quyết định                                                            | Đề xuất                                                                                                                                                                            | Trạng thái |
| ---- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-01 | Đơn vị từng ingredient                                                | 22 ingredient canonical base units theo Recipe Master; G/ML/MG/UNIT, integer-only, Prisma Int MVP với bound/overflow/atomic update; không ICE/plain water, không receiving API MVP | APPROVED   |
| D-02 | Công thức đủ mọi sản phẩm demo/size/topping                           | 25 Product/Size DEMO recipes + 5 topping DEMO recipes; Croissant theo baking ingredients; ProductTopping eligibility, aggregate ingredientId và immutable reservation snapshot     | APPROVED   |
| D-03 | Product availability trên API                                         | Option B đã duyệt: giữ hai endpoint; `isAvailable` theo ingredients, detail thêm availability theo size/topping; không fallback `Product.stock` sau cutover                         | APPROVED   |
| D-04 | Error compatibility khi thiếu nguyên liệu                            | Option A đã duyệt: giữ HTTP `409` + `INSUFFICIENT_STOCK`; details optional, không nhầm recipe/ingredient invalid với thiếu stock                                                     | APPROVED   |
| D-05 | Legacy active Order khi deploy                                        | Option A đã duyệt: Backend drain trước cutover, reconcile legacy release/payment; không synthetic ingredient reservation                                                             | APPROVED   |
| D-06 | Reservation lifecycle schema                                          | Option A đã duyệt: Order status + `released_at`, immutable aggregate snapshot, transaction one-time release; không ReservationStatus enum                                         | APPROVED   |
| D-07 | Lock order/transaction retry                                          | Option A đã duyệt: extend helper hiện có; Ingredient sorted, Ingredient→Coupon, Order→Payment; bounded whole-transaction retry                                                     | APPROVED   |
| D-08 | Controlled Production Release & GO/NO-GO                              | Option A đã duyệt: mandatory gates, controlled post-deploy VNPay E2E trước reopen traffic; evidence-based GO/NO-GO                                                               | APPROVED   |

**Approval scope D-01/D-02:** dữ liệu recipe là DEMO verification data, không phải commercial/supplier-certified recipe. Opening stock values, seed idempotency và detailed seed process vẫn OPEN cho SCRUM-122. Approval này không xác nhận implementation, migration, seed, test, deployment hoặc Production state.

**D-01..D-08 đã APPROVED ở phạm vi design. Không suy diễn approval này thành implementation, test PASS, production readiness hoặc Jira closure.**
