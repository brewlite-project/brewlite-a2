# BrewLite A2 — Ingredient & Recipe Master v1.0

**Trạng thái:** **PROPOSED DEMO design — D-01/D-02 APPROVED by Khang/Hoang; implementation remains pending**
**Jira:** SCRUM-120 / INV-02 — Design Decisions
**Phạm vi:** Ingredient Master và DEMO recipe dataset cho verification software.
**Không phải:** production recipe specification, supplier specification, seed authorization, migration authorization hoặc bằng chứng implementation/test/deployment. Approval D-01/D-02 chỉ áp dụng đúng phạm vi DEMO nêu trong Decision Spec.

## 1. Status, scope và provenance

### 1.1 Quy ước trạng thái

- **VERIFIED:** fact đọc trực tiếp từ source hiện tại.
- **APPROVED BUSINESS DECISION:** quyết định B-01…B-07 được project owners xác nhận cho tài liệu này.
- **ASSUMED DEMO DATA:** định lượng chỉ để implement/test software; **NOT VERIFIED** là công thức thương mại, vận hành bếp hay supplier-approved recipe.
- **OPEN:** D-03..D-08; opening stock, seed idempotency và detailed seed process cũng vẫn OPEN cho SCRUM-122.

### 1.2 Provenance đã kiểm chứng

| Nguồn                                                  | Nội dung dùng làm authority                                                    | Trạng thái                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------- |
| `apps/api/prisma/seed-catalog.fixtures.ts:10-28`       | 9 Product IDs/names, 5 Topping IDs/codes, ProductTopping eligibility fixture   | VERIFIED catalog fixture   |
| `apps/api/prisma/schema.prisma:27-73`                  | Product/Topping/ProductTopping model hiện hữu; chưa có Ingredient/Recipe model | VERIFIED                   |
| `apps/api/src/products/products.service.ts:126-155`    | STANDARD → S/M/L; ONE_SIZE → ONE_SIZE; topping detail API                      | VERIFIED                   |
| `apps/api/src/orders/cart-pricing.ts:46-118`           | Validate size/topping eligibility; price multiplier chỉ dùng price             | VERIFIED                   |
| `apps/api/src/orders/orders.service.ts:144-303`        | Create Order, stock/coupon/order transaction hiện tại                          | VERIFIED                   |
| `apps/api/src/orders/inventory-policy.ts:7-141`        | Product-stock reserve/release/expiry hiện tại                                  | VERIFIED                   |
| `01_Ingredient_Inventory_Decision_Spec_v1.0.md:38-118` | Target schema/lifecycle/transaction proposal                                   | PROPOSED                   |
| B-01…B-07 trong SCRUM-120 brief                        | Inventory boundary và DEMO dataset constraints                                 | APPROVED BUSINESS DECISION |

**VERIFIED:** source hiện tại chưa có Ingredient, recipe hoặc order ingredient reservation; Product stock hiện là inventory source theo số product. [schema.prisma:27-73](../../apps/api/prisma/schema.prisma#L27-L73), [Inventory Dependency Map:22-30](Inventory_Dependency_Map.md#L22-L30)

**APPROVED BUSINESS DECISION:** Khang và Hoàng jointly approved D-01 canonical units và D-02 25 Product/Size + 5 topping DEMO recipes. D-03..D-08, opening stock, seed idempotency và detailed seed process vẫn OPEN; approval không xác nhận implementation. [Decision Spec:143-158](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L143-L158)

## 2. Confirmed business decisions

| ID   | Quyết định đã xác nhận                                                                   | Ảnh hưởng trong tài liệu                                          |
| ---- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| B-01 | Quản lý inventory theo ingredient, gồm primary ingredient và selected semi-finished item | Tất cả recipe demand tham chiếu Ingredient Master                 |
| B-02 | Không track ICE hoặc plain water trong MVP                                               | Không có `ICE`, `WATER` trong master hoặc recipe                  |
| B-03 | Croissant tiêu hao baking ingredients, không dùng finished-goods UNIT stock              | Croissant ONE_SIZE có recipe WHEAT_FLOUR/BUTTER/...               |
| B-04 | CHEESE_FOAM, WHIPPED_CREAM, LIQUID_EGG là independently stocked semi-finished inputs     | Không mở rộng manufacturing recipe cho ba input này               |
| B-05 | Mỗi Product/size hợp lệ có recipe riêng                                                  | Có 25 product-size recipe; không suy từ price multiplier          |
| B-06 | Cả 5 topping tiêu hao ingredient; phải tôn trọng ProductTopping eligibility              | Có 5 topping recipe; runtime vẫn cần eligibility validation       |
| B-07 | Định lượng là DEMO assumptions cho software verification                                 | Không dùng làm công thức thương mại hoặc supplier-approved recipe |

## 3. Proposed Ingredient Master — 22 ingredients

Tất cả 22 dòng sau là **ASSUMED DEMO DATA / NOT VERIFIED** về supplier, opening stock và recipe authenticity. `base_unit` là policy đề xuất, chưa phải Prisma schema đã tồn tại.

|   # | Code             | Vietnamese display name | Base unit | Inventory boundary / classification                     | Data origin và approval status               |
| --: | ---------------- | ----------------------- | --------- | ------------------------------------------------------- | -------------------------------------------- |
|   1 | `COFFEE_BEANS`   | Hạt cà phê              | G         | Primary ingredient; shared base coffee input            | B-01/B-07; ASSUMED DEMO, not recipe-approved |
|   2 | `FRESH_MILK`     | Sữa tươi                | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|   3 | `CONDENSED_MILK` | Sữa đặc                 | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|   4 | `DAIRY_CREAM`    | Kem sữa                 | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|   5 | `CHEESE_FOAM`    | Kem cheese              | ML        | Selected independently stocked semi-finished input      | B-04; ASSUMED DEMO                           |
|   6 | `WHIPPED_CREAM`  | Kem tươi                | ML        | Selected independently stocked semi-finished input      | B-04; ASSUMED DEMO                           |
|   7 | `SALT`           | Muối                    | MG        | Primary ingredient; mg precision required               | B-01/B-07; ASSUMED DEMO                      |
|   8 | `ORANGE_JUICE`   | Nước cam                | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|   9 | `LEMONGRASS`     | Sả                      | G         | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  10 | `HERBAL_BLEND`   | Hỗn hợp thảo mộc        | G         | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  11 | `LYCHEE_SYRUP`   | Syrup vải               | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  12 | `ROSE_SYRUP`     | Syrup hoa hồng          | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  13 | `CARAMEL_SAUCE`  | Sốt caramel             | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  14 | `BLACK_TEA_LEAF` | Trà đen                 | G         | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  15 | `PEACH_SYRUP`    | Syrup đào               | ML        | Primary ingredient                                      | B-01/B-07; ASSUMED DEMO                      |
|  16 | `PEARL`          | Trân châu               | G         | Topping ingredient / independently stocked input        | B-06/B-07; ASSUMED DEMO                      |
|  17 | `GRASS_JELLY`    | Sương sáo               | G         | Topping ingredient / independently stocked input        | B-06/B-07; ASSUMED DEMO                      |
|  18 | `WHEAT_FLOUR`    | Bột mì                  | G         | Croissant baking ingredient                             | B-03/B-07; ASSUMED DEMO                      |
|  19 | `BUTTER`         | Bơ                      | G         | Croissant baking ingredient                             | B-03/B-07; ASSUMED DEMO                      |
|  20 | `YEAST`          | Men                     | MG        | Croissant baking ingredient; mg precision required      | B-03/B-07; ASSUMED DEMO                      |
|  21 | `SUGAR`          | Đường                   | G         | Croissant baking ingredient                             | B-03/B-07; ASSUMED DEMO                      |
|  22 | `LIQUID_EGG`     | Trứng lỏng              | ML        | Independently stocked semi-finished input for Croissant | B-03/B-04/B-07; ASSUMED DEMO                 |

**Explicit exclusions:** ICE và plain water không phải stocked ingredient trong MVP theo B-02. Không có `UNIT` consumer trong 22 ingredients hiện tại, nhưng `UNIT` vẫn là supported unit type trong policy đề xuất ở phần 6.

## 4. Product Recipe Master — 25 valid Product/Size recipes

### 4.1 Catalog identity và size basis

**VERIFIED:** fixture catalog định nghĩa 8 Product `STANDARD` và 1 Product `ONE_SIZE`; source Product API converts STANDARD to S/M/L and ONE_SIZE to ONE_SIZE. [seed-catalog.fixtures.ts:10-20](../../apps/api/prisma/seed-catalog.fixtures.ts#L10-L20), [products.service.ts:126-133](../../apps/api/src/products/products.service.ts#L126-L133)

All amounts below are **ASSUMED DEMO DATA / NOT VERIFIED**. Omitted ingredients mean zero demand. Every amount is a positive integer in its Ingredient Master base unit.

| Product ID                             | Exact catalog display name | Size     | Proposed per-sold-product ingredient demand                                                                             |
| -------------------------------------- | -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `a3000000-0000-4000-8000-000000000001` | Bạc Xỉu Kem Béo Phin       | S        | `COFFEE_BEANS=18 G`; `CONDENSED_MILK=30 ML`; `FRESH_MILK=80 ML`; `DAIRY_CREAM=20 ML`                                    |
| `a3000000-0000-4000-8000-000000000001` | Bạc Xỉu Kem Béo Phin       | M        | `COFFEE_BEANS=20 G`; `CONDENSED_MILK=35 ML`; `FRESH_MILK=100 ML`; `DAIRY_CREAM=25 ML`                                   |
| `a3000000-0000-4000-8000-000000000001` | Bạc Xỉu Kem Béo Phin       | L        | `COFFEE_BEANS=22 G`; `CONDENSED_MILK=40 ML`; `FRESH_MILK=120 ML`; `DAIRY_CREAM=30 ML`                                   |
| `a3000000-0000-4000-8000-000000000002` | Cà Phê Đen Đá Cầu Đất      | S        | `COFFEE_BEANS=18 G`                                                                                                     |
| `a3000000-0000-4000-8000-000000000002` | Cà Phê Đen Đá Cầu Đất      | M        | `COFFEE_BEANS=20 G`                                                                                                     |
| `a3000000-0000-4000-8000-000000000002` | Cà Phê Đen Đá Cầu Đất      | L        | `COFFEE_BEANS=22 G`                                                                                                     |
| `a3000000-0000-4000-8000-000000000003` | Cà Phê Muối Cố Đô          | S        | `COFFEE_BEANS=18 G`; `CONDENSED_MILK=15 ML`; `FRESH_MILK=50 ML`; `DAIRY_CREAM=15 ML`; `SALT=1000 MG`                    |
| `a3000000-0000-4000-8000-000000000003` | Cà Phê Muối Cố Đô          | M        | `COFFEE_BEANS=20 G`; `CONDENSED_MILK=18 ML`; `FRESH_MILK=60 ML`; `DAIRY_CREAM=20 ML`; `SALT=1000 MG`                    |
| `a3000000-0000-4000-8000-000000000003` | Cà Phê Muối Cố Đô          | L        | `COFFEE_BEANS=22 G`; `CONDENSED_MILK=20 ML`; `FRESH_MILK=70 ML`; `DAIRY_CREAM=25 ML`; `SALT=1000 MG`                    |
| `a3000000-0000-4000-8000-000000000004` | Cà phê Sữa Đá Sài Gòn      | S        | `COFFEE_BEANS=18 G`; `CONDENSED_MILK=35 ML`                                                                             |
| `a3000000-0000-4000-8000-000000000004` | Cà phê Sữa Đá Sài Gòn      | M        | `COFFEE_BEANS=20 G`; `CONDENSED_MILK=40 ML`                                                                             |
| `a3000000-0000-4000-8000-000000000004` | Cà phê Sữa Đá Sài Gòn      | L        | `COFFEE_BEANS=22 G`; `CONDENSED_MILK=45 ML`                                                                             |
| `a3000000-0000-4000-8000-000000000005` | Cold Brew Cam Sả Thảo Mộc  | S        | `COFFEE_BEANS=25 G`; `ORANGE_JUICE=30 ML`; `LEMONGRASS=3 G`; `HERBAL_BLEND=2 G`                                         |
| `a3000000-0000-4000-8000-000000000005` | Cold Brew Cam Sả Thảo Mộc  | M        | `COFFEE_BEANS=30 G`; `ORANGE_JUICE=40 ML`; `LEMONGRASS=4 G`; `HERBAL_BLEND=3 G`                                         |
| `a3000000-0000-4000-8000-000000000005` | Cold Brew Cam Sả Thảo Mộc  | L        | `COFFEE_BEANS=35 G`; `ORANGE_JUICE=50 ML`; `LEMONGRASS=5 G`; `HERBAL_BLEND=4 G`                                         |
| `a3000000-0000-4000-8000-000000000006` | Cold Brew Vải Hoa Hồng     | S        | `COFFEE_BEANS=25 G`; `LYCHEE_SYRUP=30 ML`; `ROSE_SYRUP=8 ML`                                                            |
| `a3000000-0000-4000-8000-000000000006` | Cold Brew Vải Hoa Hồng     | M        | `COFFEE_BEANS=30 G`; `LYCHEE_SYRUP=40 ML`; `ROSE_SYRUP=10 ML`                                                           |
| `a3000000-0000-4000-8000-000000000006` | Cold Brew Vải Hoa Hồng     | L        | `COFFEE_BEANS=35 G`; `LYCHEE_SYRUP=50 ML`; `ROSE_SYRUP=12 ML`                                                           |
| `a3000000-0000-4000-8000-000000000007` | Espresso Macchiato Caramel | S        | `COFFEE_BEANS=18 G`; `FRESH_MILK=30 ML`; `CARAMEL_SAUCE=10 ML`                                                          |
| `a3000000-0000-4000-8000-000000000007` | Espresso Macchiato Caramel | M        | `COFFEE_BEANS=20 G`; `FRESH_MILK=40 ML`; `CARAMEL_SAUCE=12 ML`                                                          |
| `a3000000-0000-4000-8000-000000000007` | Espresso Macchiato Caramel | L        | `COFFEE_BEANS=22 G`; `FRESH_MILK=50 ML`; `CARAMEL_SAUCE=15 ML`                                                          |
| `a3000000-0000-4000-8000-000000000008` | Trà Đào Cam Sả Hoàng Gia   | S        | `BLACK_TEA_LEAF=4 G`; `PEACH_SYRUP=35 ML`; `ORANGE_JUICE=20 ML`; `LEMONGRASS=3 G`                                       |
| `a3000000-0000-4000-8000-000000000008` | Trà Đào Cam Sả Hoàng Gia   | M        | `BLACK_TEA_LEAF=5 G`; `PEACH_SYRUP=45 ML`; `ORANGE_JUICE=25 ML`; `LEMONGRASS=4 G`                                       |
| `a3000000-0000-4000-8000-000000000008` | Trà Đào Cam Sả Hoàng Gia   | L        | `BLACK_TEA_LEAF=6 G`; `PEACH_SYRUP=55 ML`; `ORANGE_JUICE=30 ML`; `LEMONGRASS=5 G`                                       |
| `a3000000-0000-4000-8000-000000000009` | Croissant Bơ Pháp Nướng    | ONE_SIZE | `WHEAT_FLOUR=60 G`; `BUTTER=25 G`; `FRESH_MILK=15 ML`; `YEAST=1000 MG`; `SUGAR=8 G`; `LIQUID_EGG=20 ML`; `SALT=1000 MG` |

### 4.2 Product recipe notes

- **VERIFIED:** `priceCart` rejects an incompatible size and validates topping eligibility, but its size multiplier is price-only. Do not derive any recipe line from 100/120/140 price multipliers. [cart-pricing.ts:69-102](../../apps/api/src/orders/cart-pricing.ts#L69-L102)
- **APPROVED BUSINESS DECISION B-05:** each of the 25 rows is explicit, including the ONE_SIZE Croissant row.
- **ASSUMED DEMO DATA:** Cold Brew demand is allocated per cup from ingredients, not represented as a production-batch model.

## 5. Topping Recipe Master — 5 topping recipes

**VERIFIED:** all five codes and IDs below exist in current catalog fixture. Existing ProductTopping eligibility is listed in the last column and must continue to be enforced by runtime validation. [seed-catalog.fixtures.ts:11-28](../../apps/api/prisma/seed-catalog.fixtures.ts#L11-L28), [cart-pricing.ts:83-91](../../apps/api/src/orders/cart-pricing.ts#L83-L91)

All quantities are **ASSUMED DEMO DATA / NOT VERIFIED**, per one topping application to one sold product.

| Topping ID                             | Code            | Vietnamese display name | Proposed ingredient demand | Existing eligible products                                                                                                                   |
| -------------------------------------- | --------------- | ----------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `b2000000-0000-4000-8000-000000000001` | `PEARL`         | Trân châu               | `PEARL=30 G`               | Trà Đào Cam Sả Hoàng Gia                                                                                                                     |
| `b2000000-0000-4000-8000-000000000002` | `CHEESE_FOAM`   | Kem cheese              | `CHEESE_FOAM=30 ML`        | Bạc Xỉu Kem Béo Phin; Cà Phê Muối Cố Đô                                                                                                      |
| `b2000000-0000-4000-8000-000000000003` | `EXTRA_SHOT`    | Thêm shot espresso      | `COFFEE_BEANS=18 G`        | Bạc Xỉu Kem Béo Phin; Cà Phê Đen Đá Cầu Đất; Cà Phê Muối Cố Đô; Cà phê Sữa Đá Sài Gòn; Cold Brew Cam Sả Thảo Mộc; Espresso Macchiato Caramel |
| `b2000000-0000-4000-8000-000000000004` | `GRASS_JELLY`   | Sương sáo               | `GRASS_JELLY=35 G`         | Trà Đào Cam Sả Hoàng Gia                                                                                                                     |
| `b2000000-0000-4000-8000-000000000005` | `WHIPPED_CREAM` | Kem tươi                | `WHIPPED_CREAM=25 ML`      | Bạc Xỉu Kem Béo Phin; Cà phê Sữa Đá Sài Gòn; Espresso Macchiato Caramel                                                                      |

**VERIFIED cart semantics:** each selected topping belongs to each cart line and line has a `quantity`; implementation must multiply topping recipe demand by that product quantity. [cart-pricing.ts:83-113](../../apps/api/src/orders/cart-pricing.ts#L83-L113)

## 6. Unit và numeric integrity rules

U-01…U-11 là phạm vi **APPROVED** của D-01/D-02 cho DEMO verification data. U-12 vẫn là target-cutover rule **PROPOSED** vì Product API/legacy stock compatibility thuộc D-03 đang OPEN. Không rule nào trong phần này là bằng chứng implementation đã tồn tại.

| ID   | Rule                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------- |
| U-01 | Mỗi ingredient có đúng một `base_unit`.                                                                                 |
| U-02 | Supported unit types là `G`, `ML`, `MG`, `UNIT`; 22 ingredients hiện có dùng G/ML/MG, chưa có ingredient dùng UNIT.     |
| U-03 | `stockQuantity`, recipe quantities và reservation quantities là integer-only.                                           |
| U-04 | `stockQuantity >= 0`.                                                                                                   |
| U-05 | Recipe/reservation quantity phải `> 0`.                                                                                 |
| U-06 | Conversion chỉ thực hiện tại input/seed/admin boundary; checkout transaction chỉ nhận canonical base-unit integer.      |
| U-07 | Reject quantity fractional hoặc unsupported unit; không silent rounding/conversion.                                     |
| U-08 | Khuyến nghị Prisma `Int` cho MVP, với điều kiện không vượt PostgreSQL INTEGER bound và demand aggregation được checked. |
| U-09 | Chống overflow khi `product quantity × recipe quantity` và khi cộng ingredient demand shared.                           |
| U-10 | Validate base-unit consistency giữa stock, recipe và reservation của cùng ingredient.                                   |
| U-11 | Reject missing/inactive/invalid recipe; không implicit zero demand.                                                     |
| U-12 | Sau ingredient cutover, không fallback `Product.stock` để quyết định bán.                                               |

### 6.1 Lý do MG cho SALT và YEAST

`SALT=1000 MG` và `YEAST=1000 MG` là 1 gram expressed in canonical MG. Đây là **ASSUMED DEMO DATA** nhằm chứng minh mixed base-unit handling mà vẫn integer-only; không tuyên bố 1 gram là recipe thương mại đúng. Không được cộng G với MG, hoặc tự đổi 1G ↔ 1000MG bên trong reservation transaction.

### 6.2 Prisma Int recommendation and boundary

**VERIFIED:** Product stock hiện là Prisma `Int`, còn money fields dùng `BigInt`; existing HTTP boundary converts money BigInt to checked JavaScript number. [schema.prisma:27-38](../../apps/api/prisma/schema.prisma#L27-L38), [cart-pricing.ts:39-43](../../apps/api/src/orders/cart-pricing.ts#L39-L43)

**APPROVED D-01 MVP policy:** dùng Prisma `Int` cho ingredient quantities với pre-write checked multiplication/sum trong PostgreSQL INTEGER range (`0..2,147,483,647`). Nếu future opening stock/throughput có thể vượt bound, cần quyết định BigInt và DTO serialization policy riêng trước khi thay đổi phạm vi. Không được copy helper `money()` cho quantities mà không kiểm tra semantic/range.

**APPROVED D-01 numeric bounds:** Ingredient stock must be a non-negative integer within `0..2,147,483,647`. Recipe quantity and reservation quantity must be positive integers within PostgreSQL `INTEGER` bounds. Backend must check multiplication and aggregate demand for overflow before writing. Stock reservation must use atomic conditional updates in PostgreSQL, and inventory replenishment must reject updates that exceed the integer upper bound. Invalid or overflowing input must fail without partial stock changes.

### 6.3 Initial stock and unit conversion policy

**D-01 approved boundary; SCRUM-122 seed details remain OPEN:**

- Initial ingredient stock may be provisioned through a seed process only after separate SCRUM-122 approval.
- Each ingredient stores stock quantity as an integer in its canonical `base_unit`.
- Seed data must use canonical base-unit integers directly.
- Input conversion policy remains OPEN; if later approved, only explicitly supported and exact conversions may be used during data preparation.
- Reject unsupported units, fractional canonical results, negative quantities and integer overflow.
- No unit conversion is performed inside the Create Order transaction.
- The MVP does not include a customer-facing or admin-facing stock receiving API.
- Any future inventory replenishment operation must enforce non-negative stock, integer bounds and atomic updates.
- Opening stock quantities, seed idempotency and input conversion policy remain OPEN until separate SCRUM-122 design approval.

## 7. Order aggregation / reservation principles

All principles here are **PROPOSED**. Chúng giữ Payment/TTL/VNPay behavior hiện hữu, không yêu cầu đổi Payment State Machine.

1. Resolve valid base recipe by exact `(productId, size)`.
2. Validate every selected topping is eligible via existing ProductTopping relation before calculating topping demand.
3. Multiply each base recipe and topping recipe amount by cart-line product quantity.
4. Aggregate base and topping demand by `ingredientId` across the whole cart.
5. Validate integer/base-unit/range before writing; lock/decrement ingredient rows deterministically in ingredient-ID order.
6. Reserve availability and create Order, OrderItem, topping snapshots, coupon state and aggregate ingredient reservations in one DB transaction.
7. Snapshot actual deducted aggregate quantities on Order creation.
8. On eligible cancellation only, release snapshot quantities exactly once; never recalculate an old reservation from a later recipe version.
9. A PAID order never releases ingredient reservation because of scheduler, retry, duplicate IPN or QueryDR.
10. Preserve current Order TTL/VNPay grace policy; only replace Product-stock reserve/release internals after approved implementation.

**VERIFIED current contrast:** current code aggregates by Product ID and conditionally decrements `Product.stock`; cancellation restores from `order_items`. [inventory-policy.ts:7-46](../../apps/api/src/orders/inventory-policy.ts#L7-L46), [inventory-policy.ts:102-141](../../apps/api/src/orders/inventory-policy.ts#L102-L141)

**PROPOSED target alignment:** Decision Spec requires aggregate ingredient reservation in the same transaction and immutable reservation snapshots. [Decision Spec:57-61](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L57-L61), [Decision Spec:90-109](01_Ingredient_Inventory_Decision_Spec_v1.0.md#L90-L109)

## 8. Demo limitations và assumptions

- **B-02:** ICE và plain water bị loại khỏi stocked demand; điều này không khẳng định chúng không được dùng trong vận hành thực tế.
- **B-04:** CHEESE_FOAM, WHIPPED_CREAM và LIQUID_EGG tiêu hao trực tiếp như independently stocked semi-finished input; không có manufacturing/BOM recipe cho chúng trong MVP.
- **B-03:** Croissant được trừ theo ingredient per sale, không thực hiện batch manufacturing, yield, scrap/waste hoặc finished-goods accounting.
- Cold Brew demand được phân bổ theo cup; không model production batch, steeping yield hoặc brew loss.
- All recipe amounts are software DEMO assumptions, not certified food recipes, commercial recipes, allergen data or supplier specifications.
- Opening ingredient stock, initial replenishment units và receiving policy **NOT VERIFIED**; thuộc SCRUM-122 / INV-04 sau khi D-01/D-02 được reviewed.
- Không migration, schema change, seed, production data write hoặc deployment nào được ủy quyền bởi tài liệu này.
- Fixture catalog itself labels prices and stocks as example values; không suy diễn opening ingredient stock từ legacy Product stock. [seed-catalog.fixtures.ts:8-9](../../apps/api/prisma/seed-catalog.fixtures.ts#L8-L9)

## 9. Traceability to D-01, D-02, SCRUM-121 và SCRUM-122

| Item                    | Tài liệu này cung cấp                                                 | Điều còn thiếu trước implementation                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-01 — Ingredient units | **APPROVED:** 22 canonical base units; G/ML/MG/UNIT; integer/Int/bound/overflow rules; no ICE/plain water; no receiving API MVP | Opening stock, seed idempotency and detailed input conversion/seed process remain OPEN for SCRUM-122. |
| D-02 — Recipe coverage  | **APPROVED:** 25 Product/Size + 5 topping DEMO recipes; Croissant ingredient consumption; eligibility/aggregate/snapshot principles | Commercial certification is out of scope. Implementation, migration, seed and test evidence remain pending. |
| SCRUM-121 / INV-03      | Candidate schema fields and constraints                               | Prisma schema/migration requires separate review; no migration created here.                                                                                        |
| SCRUM-122 / INV-04      | Catalog IDs and proposed demo quantities                              | Opening stock and idempotent seed behavior are not yet approved.                                                                                                    |
| SCRUM-123 / INV-05      | Ingredient aggregation and reservation principles                     | Implement after schema, seed and transaction design approval.                                                                                                       |
| SCRUM-124 / INV-06      | Reservation snapshot and one-time release principles                  | Implement only after the reservation schema exists.                                                                                                                 |

## 10. Consistency check results

| Check                                                            | Result                          | Evidence / explanation                                                                                                                           |
| ---------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| C-01: exactly 22 unique ingredient codes                         | **PASS — document count**       | Ingredient Master rows #1–#22; code set is unique.                                                                                               |
| C-02: exactly 25 valid product-size recipes                      | **PASS — document count**       | 8 STANDARD products × S/M/L + 1 ONE_SIZE Croissant = 25; catalog size policy VERIFIED.                                                           |
| C-03: exactly 5 topping recipes                                  | **PASS — document count**       | Five rows in Topping Recipe Master match five fixture toppings.                                                                                  |
| C-04: every recipe ingredient reference exists                   | **PASS — document cross-check** | Every code in sections 4–5 occurs once in 22-row Ingredient Master.                                                                              |
| C-05: all quantities positive integers                           | **PASS — document cross-check** | All stated quantities are positive decimal integers; omitted means zero demand, not stored recipe row.                                           |
| C-06: SALT/YEAST use MG, not G                                   | **PASS — document cross-check** | Master uses MG; product recipes use `1000 MG`.                                                                                                   |
| C-07: no ICE/plain-water demand                                  | **PASS — document cross-check** | Neither code exists in master/recipe demand.                                                                                                     |
| C-08: no duplicate ingredient per recipe                         | **PASS — document cross-check** | Each row lists each code at most once.                                                                                                           |
| C-09: exact catalog names/sizes/topping codes                    | **PASS — fixture cross-check**  | IDs/names/codes copied from `seed-catalog.fixtures.ts:10-28`; valid size behavior from Product API.                                              |
| C-10: no accidental ASSUMED label as VERIFIED/APPROVED           | **PASS — documentation review** | Source facts marked VERIFIED; approved D-01/D-02 and B-01…B-07 are scoped explicitly; quantities remain ASSUMED DEMO / NOT VERIFIED.             |
| C-11: no conflict with existing stock/cancel/TTL/VNPay semantics | **NO STATIC CONTRADICTION FOUND — NOT EXECUTED** | Document preserves lifecycle intent and explicitly does not implement/change Payment, TTL, grace or IPN. PostgreSQL integration, concurrency, TTL and VNPay regression tests have not been run. |
| C-12: no change to existing source files                         | **PASS — task-scope review**    | This task creates only this Markdown document; source/schema/migration/seed are not modified.                                                    |

`PASS — document cross-check` is not a test execution result or production-readiness claim. D-01/D-02 approval does not approve implementation, migration, seed, deployment or Production state.

## 11. Remaining approval checklist

- [x] Khang and Hoàng jointly approved the 22 canonical base units and D-01 boundaries for MVP DEMO verification.
- [x] Khang and Hoàng jointly approved 25 Product/Size DEMO recipes and five topping DEMO recipes for software verification.
- [x] Khang and Hoàng approved MG canonical units for SALT/YEAST and Prisma `Int` MVP bounds/overflow policy.
- [ ] Decide ingredient opening stock, stock receiving conversion and seed ownership in SCRUM-122.
- [ ] Confirm target error-code/API compatibility and Product availability behavior before cutover.
- [ ] Review legacy active Order policy before any schema/read-write switch.
- [ ] Add real PostgreSQL concurrency/rollback tests before release; test matrix remains PROPOSED until executed.
- [ ] Keep D-03..D-08 **OPEN** until the required owner approvals and evidence exist.

**Final status:** D-01/D-02 approved DEMO design scope; implementation remains pending. This document does not authorize code, migration, seed, deployment, commit, push, PR, or production change.
