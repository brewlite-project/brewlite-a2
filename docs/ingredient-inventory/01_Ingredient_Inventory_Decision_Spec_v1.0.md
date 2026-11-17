# BrewLite A2 — Ingredient Inventory Decision & Specification

**Phiên bản:** 1.0 — Proposed baseline for implementation; D-01/D-02 approval recorded.
**Trạng thái:** CONDITIONAL GO — D-01/D-02 đã được hai owner chốt trong phạm vi DEMO; chỉ bắt đầu code khi giảng viên chính thức xác nhận dời lịch và D-03..D-08 được xử lý theo quyết định owner.
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
7. A1, A2 Local và A2 Production phải độc lập về database/volume. Không sửa VNPay merchant IPN configuration cho giai đoạn này.
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

- `id` UUID PK; `code` UNIQUE, `name`; `base_unit` (`G`, `ML`, `UNIT` hoặc đơn vị quy chuẩn đã chốt).
- `stock_quantity` **integer/bigint ở đơn vị nhỏ nhất**, `>= 0`; `is_active`; `created_at`, `updated_at`.
- Không dùng Float cho số lượng nguyên liệu. Nếu cần độ chia nhỏ, chọn **đơn vị integer nhỏ hơn** (ví dụ mg thay vì g), ghi rõ conversion; không âm thầm làm tròn.

### `recipe_ingredients`

- `id`, `product_id`, `size`, `ingredient_id`, `quantity_per_unit` (integer > 0).
- Unique `(product_id, size, ingredient_id)`, FK và check; công thức size `ONE_SIZE` được hỗ trợ.
- Một công thức phải có đủ nguyên liệu cần dùng; không fallback sang `Product.stock` khi thiếu recipe.

### `topping_ingredients`

- `id`, `topping_id`, `ingredient_id`, `quantity_per_topping` (integer > 0), unique `(topping_id, ingredient_id)`.
- Áp dụng cho mỗi topping được chọn trên mỗi ly; kiểm tra cùng nguyên liệu có xuất hiện cả trong sản phẩm và topping.

### `order_ingredient_reservations`

- `id`, `order_id`, `ingredient_id`, `quantity_reserved`, `created_at`, `released_at` (nullable), unique `(order_id, ingredient_id)`.
- Lưu aggregate snapshot của toàn Order, không tính lại recipe lúc hoàn.
- Vòng đời đề xuất: **RESERVED** khi Order active; **CONSUMED** về nghĩa nghiệp vụ khi Order PAID; **RELEASED** khi CANCELLED. Để tránh thêm nhiều trạng thái ngoài nhu cầu, có thể suy từ `orders.status` và cờ release, nhưng phải chứng minh one-time release ở DB transaction. `released_at` chỉ được set khi thực sự hoàn kho.
- Được phép thêm `recipe_version`/audit fields nếu có lợi, nhưng không cần hoàn thiện versioning công thức trong MVP.

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
  //    If affected rows != 1: throw 409 INSUFFICIENT_INGREDIENT_STOCK.
  // 5. Reserve coupon under existing policy.
  // 6. Create Order + OrderItems + Toppings + OrderIngredientReservations.
  // 7. Commit all or rollback all.
});
```

**Lock order:** Cần audit đồng thời `orders.service`, expiration/cancellation, coupon, payment finalization, scheduler. Chốt thứ tự Order → Ingredient sorted → Coupon theo các quy tắc khóa hiện hành; không áp đặt thứ tự này nếu audit thấy nó xung đột. Không thêm HTTP gateway call trong transaction.

**Concurrent invariants:** Không âm stock; không oversell; không partial reserve; không double release; không tạo 2 active Order trên 1 user; mỗi ingredient reservation duy nhất cho 1 Order.

## 7. Cancel / TTL / VNPay Grace / Payment safety

- Reuse `expireOrderInTransaction()` và `cancelLockedOrderAndReleaseInTransaction()` hiện có; thay phần restore `Product.stock` bằng restore từ `order_ingredient_reservations`.
- Giữ nguyên đánh giá TTL/Grace dựa DB clock và trạng thái VNPay PENDING. Việc hết 15 phút không tự động hủy Order có VNPay pending đang còn trong Grace.
- Mỗi Order CANCELLED phải hoàn inventory **đúng một lần**, kể cả scheduler chạy lại hoặc lazy cleanup từ Create Order.
- Khi IPN hợp lệ → PAID, nguyên liệu đã reserve được coi là thuộc Order đã thanh toán, không hoàn. Payment Finalization, idempotency, coupon/loyalty tiếp tục hoạt động như trước.
- Late financial SUCCESS sau Order CANCELLED là ngoại lệ tài chính; không tự phục hồi Order/stock, không tạo đơn mới hay giao hàng từ callback.
- QueryDR không được suy diễn FAILED từ timeout; không yêu cầu thay đổi VNPay signing/callback trong đợt Inventory.

## 8. API compatibility và hiển thị

- Cố gắng giữ body/response của `POST /orders`, `GET /orders/me`, `GET /products`, `GET /products/:id`, payment API.
- Chỉ thay mã lỗi nếu không thể tránh và cập nhật tài liệu **mới** ở đây; UI đang xử lý `INSUFFICIENT_STOCK` cần test compatibility trước khi đổi thành `INSUFFICIENT_INGREDIENT_STOCK`. **Đề xuất ưu tiên giữ mã `INSUFFICIENT_STOCK`**, có `details` chỉ ra nguyên liệu nếu an toàn/được chấp nhận, để giảm thay đổi FE.
- Nếu Product API có `stock` và FE dựa vào stock, phải chọn semantic mới có thể giải thích được. Không trả giá trị legacy như tồn khả dụng thật.
- `GET /orders/me` phải giữ Order snapshots/payment summary/pagination; không có dữ liệu ingredient reservation trong response nếu không cần.

## 9. Chính sách migration / dữ liệu cũ

1. **Additive migration**: tạo bảng/cột/index/check mới trước khi đổi read/write logic; không DROP `Product.stock` trong MVP.
2. Local hoặc staging database riêng; backup trước và thử restore. Không chạy seed phá dữ liệu Production.
3. Order cũ **không có ingredient reservations** không được hoàn bằng công thức hiện tại. Phải xác định quy tắc xử lý legacy trước production release: có thể yêu cầu không còn active legacy orders khi switch, hoặc backfill qua snapshot và recipe đáng tin cậy; tuyệt đối không tự sinh reservation giả.
4. Gắn việc đổi source of truth với release gate. Nếu cần code cũ chạy được trên schema mới, migration phải backward-compatible; rollback code không đồng nghĩa rollback migration.
5. Snapshot/reseed data chỉ là test fixture, không phải công thức thật trừ khi được hai owner chốt.

## 10. VNPay: giữ nguyên cấu hình, tách kiểm thử

**Quyết định đã chốt:** Không cấu hình lại Merchant Sandbox IPN URL, không sửa signing/QueryDR, không đổi production secrets. Khách chỉ chuyển sang VNPay **sau khi POST /orders tạo Order hợp lệ** và inventory đã được reserve.

- **Local pre-release:** Test trực tiếp Order → Payment integration bằng unit/integration tests, fixtures IPN có chữ ký hợp lệ, replay callback, expiration/grace và DB assertions. Những test này **không tương đương VNPay Sandbox E2E thật** nếu IPN vẫn trỏ đến Render production.
- **Pre-release với sandbox thật:** Chỉ tính E2E khi có một môi trường callback độc lập được kết nối đúng hoặc một kỹ thuật thử nghiệm không làm thay đổi IPN Production và được chứng minh; nếu không, đánh dấu E2E sandbox trước release là **NOT EXECUTED**.
- **Post-release:** Chạy ngay một giao dịch VNPay Sandbox qua Vercel/Render với IPN đã giữ nguyên; xác minh Payment SUCCESS, Order PAID, ingredient reservation không bị hoàn, GET /orders/me và database. Nếu lỗi nghiêm trọng phải dừng nhận traffic theo phương án rollback có chuẩn bị, không đoán trạng thái thanh toán.

## 11. Quyết định và trạng thái owner review

| ID   | Quyết định                                                            | Đề xuất                                                                                                                                                                            | Trạng thái |
| ---- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-01 | Đơn vị từng ingredient                                                | 22 ingredient canonical base units theo Recipe Master; G/ML/MG/UNIT, integer-only, Prisma Int MVP với bound/overflow/atomic update; không ICE/plain water, không receiving API MVP | APPROVED   |
| D-02 | Công thức đủ mọi sản phẩm demo/size/topping                           | 25 Product/Size DEMO recipes + 5 topping DEMO recipes; Croissant theo baking ingredients; ProductTopping eligibility, aggregate ingredientId và immutable reservation snapshot     | APPROVED   |
| D-03 | Legacy `products.stock` trên API                                      | availability suy từ ingredients, không dùng stock cũ                                                                                                                               | OPEN       |
| D-04 | Mã lỗi thiếu nguyên liệu                                              | ưu tiên giữ `409 INSUFFICIENT_STOCK` để tương thích                                                                                                                                | OPEN       |
| D-05 | Old active Order khi deploy                                           | cần policy riêng, không dùng recipe hiện hành để hoàn                                                                                                                              | OPEN       |
| D-06 | Reservation lifecycle schema                                          | unique/order/ingredient, one-time release in transaction                                                                                                                           | OPEN       |
| D-07 | Lock order/transaction retry                                          | chốt sau audit source hiện tại                                                                                                                                                     | OPEN       |
| D-08 | Production release readiness nếu không test VNPay Sandbox pre-release | ghi rõ residual risk, leader quyết định GO/NO-GO                                                                                                                                   | OPEN       |

**Approval scope D-01/D-02:** dữ liệu recipe là DEMO verification data, không phải commercial/supplier-certified recipe. Opening stock values, seed idempotency và detailed seed process vẫn OPEN cho SCRUM-122. Approval này không xác nhận implementation, migration, seed, test, deployment hoặc Production state.

**D-03..D-08 vẫn OPEN; không coi các mục OPEN đã approved.**
