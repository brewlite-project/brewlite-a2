# SCRUM-121 / INV-03 — Prisma schema và additive migration

Owner: Nguyễn Khải Hoàng. Reviewer theo task: Khang. PR base: `dev`.
Trạng thái: implementation local; chưa stage/commit/push/PR, chưa nghiệm thu/Done.

## 1. Nguồn, baseline và phạm vi

- Baseline sau `git fetch origin` ngày 2026-11-17:
  `3a183d67c12658432100298eefd2b4ffe0bbfb7a` (`origin/dev`).
- [SCRUM-119 / PR #36](https://github.com/brewlite-project/brewlite-a2/pull/36):
  audit commit `7932de93aa79dfc7e782c2617d7401b295c2edd2`, merge
  `11e17d10a2f87e55efb078de4145a0d69c195a2a`; GitHub review APPROVED bởi
  `KhaiHoang275` lúc 2026-11-17 06:32:40 UTC.
- [SCRUM-120 / PR #37](https://github.com/brewlite-project/brewlite-a2/pull/37):
  unit/recipe decision `7b4c839d39ae14149d91cf4c6f513c45b7313a67`, final design
  `2165d51a944894a7d8f73ca11e2696f169db8742`, merge bằng baseline trên;
  GitHub review APPROVED bởi `KhaiHoang275` lúc 2026-11-17 09:53:52 UTC.
- Đã đọc [Dependency Map](Inventory_Dependency_Map.md), đầy đủ D-01…D-08 của
  [Decision Spec](01_Ingredient_Inventory_Decision_Spec_v1.0.md), Work Plan,
  Test/Release Gates và Recipe Master. Audit ghi OPEN là snapshot lịch sử;
  Decision Spec ở commit mới ghi APPROVED DESIGN. Không sửa lại lịch sử audit.
- Phê duyệt design nằm trong nội dung Decision Spec §11 và Recipe Master;
  bằng chứng merge/review ở trên xác nhận tích hợp tài liệu, không thay thế
  nghiệm thu implementation, test, release hoặc Jira closure.
- API Contract v4.0 lưu trữ có metadata approval chưa nhất quán. SCRUM-120 đã
  ghi active API Contract verification thuộc SCRUM-125. Task này không đổi HTTP,
  DTO, public errors hay nghiệp vụ Payment; không tự xác nhận toàn bộ API Contract.
- Đã đọc AGENTS.md, ADR-002, schema, cả 10 migrations baseline, Prisma config,
  package scripts, catalog/size/pricing, reserve/release/expiry và Payment callers.

Git đầu lượt: `main`, HEAD `2d80e15aa5c4d2a4a69f2222eafedf44e007fc48`, sạch cả
staged/unstaged/untracked. Remote đúng repository yêu cầu. Worktree khác
`SCRUM-117-production-release-delivery-sync` được giữ nguyên. Đã thông báo trước
khi tạo/chuyển branch `SCRUM-121-ingredient-inventory-schema` từ `origin/dev`.
Không pull/merge/rebase/stash/reset/cherry-pick. Đã tìm PR theo task và toàn bộ
PR base dev, bao gồm tiêu đề không có mã Jira; chưa tìm thấy PR SCRUM-121 để cập nhật.

## 2. Mô hình/luồng hiện tại và thay đổi

Baseline: Product có integer `stock`, `ProductSizePolicy`; DrinkSize đã có
S/M/L/ONE_SIZE. ProductTopping giới hạn topping hợp lệ. Controller gọi OrdersService,
service dùng pricing và Prisma transaction để giảm Product.stock, giữ Coupon,
tạo Order/items/snapshots. Expiry khóa Order, kiểm tra TTL/Grace/Payment, chuyển
CANCELLED, hoàn Product.stock rồi release Coupon trong transaction. Payment
finalization dùng khóa Order → Payment; SUCCESS tiêu thụ Coupon/cộng loyalty vào
User, không hoàn inventory. Không có bảng Loyalty riêng.

Task này chỉ bổ sung bốn model và relation ngược. Code baseline tiếp tục dùng
Product.stock; chưa cutover sang ingredient. Không seed công thức/tồn mở đầu,
không backfill legacy reservation, không đổi Payment/VNPay/Coupon/Loyalty.

## 3. Yêu cầu → quyết định → cấu trúc → kiểm tra

| Yêu cầu / decision | Nguồn đã duyệt | Model / constraint hoặc ranh giới | Kiểm chứng |
| --- | --- | --- | --- |
| D-01: canonical units, integer bounds | Decision §4, §11; Master §3 | IngredientBaseUnit = G/ML/MG/UNIT; Int/INTEGER cho mọi quantity; stock >= 0 | Cả 4 units; 0 stock; max Int; âm, fraction, overflow, unit sai bị reject |
| D-02: nhiều ingredient theo Product/Size | Decision §4–5; Master §4 | RecipeIngredient, unique(productId,size,ingredientId), quantity > 0 | S/M/L/ONE_SIZE; nhiều ingredient; duplicate/0/âm/FK/null bị reject |
| D-02: nhiều ingredient theo topping | Decision §4; Master §5 | ToppingIngredient, unique(toppingId,ingredientId), quantity > 0 | Multi-ingredient, duplicate/0/âm/FK/null |
| D-03: availability và legacy stock | Decision D-03 | Giữ Product.stock; không đổi API; availability thuộc SCRUM-125 | Whole-row before/after; code baseline runtime |
| D-04: HTTP 409 INSUFFICIENT_STOCK | Decision D-04 | Không đổi HTTP/errors/DTO | Baseline inventory/payment/promotion tests; unit suite |
| D-05: legacy drain, không synthetic snapshot | Decision D-05 | Không thêm required column trên Order; bảng reservation mới rỗng | Dữ liệu Order/Payment/Coupon/loyalty/stock giữ nguyên; 0 legacy reservations |
| D-06: aggregate snapshot + release marker | Decision §4, D-06 | OrderIngredientReservation; unique(orderId,ingredientId); quantity > 0; releasedAt nullable | Snapshot không đổi khi sửa/xóa recipe; Order states; FK Restrict; marker roundtrip |
| D-06: integrity/immutability/one-time release | Decision D-06 | Schema không tự bảo đảm các transaction invariants; persistence integrity còn cần owner review | Chưa triển khai; handoff SCRUM-123/124, không đánh dấu PASS |
| D-07: deterministic locks/retry/atomicity | Decision D-07 | Unique aggregate + reverse ingredient indexes hỗ trợ logic sau; không thay transaction helper | Baseline concurrency regression; ingredient concurrency thuộc SCRUM-126 |
| D-08: controlled release gates | Decision D-08 | Chỉ local/test migration; không release/cutover | Không Production access; Khang/CI/merge còn pending |

## 4. Models, fields và database constraints

Conventions: Prisma PascalCase/camelCase, database snake_case qua `@map`/`@@map`;
UUID ID, TIMESTAMPTZ(6), mã VARCHAR(50), tên VARCHAR(255). Fields dưới đây đều
NOT NULL trừ reservation.released_at. `uuid()` sinh bởi Prisma Client, SQL không
có UUID default; raw SQL cần truyền UUID. Không thay enum dùng chung.

| Model / bảng | Fields / defaults |
| --- | --- |
| Ingredient / ingredients | id UUID PK; code VARCHAR(50) unique; name VARCHAR(255); base_unit ingredient_base_unit, không default; stock_quantity INTEGER default 0; is_active BOOLEAN default true; created_at/updated_at TIMESTAMPTZ(6) default CURRENT_TIMESTAMP |
| RecipeIngredient / recipe_ingredients | id UUID PK; product_id UUID; size drink_size; ingredient_id UUID; quantity_per_unit INTEGER, không default |
| ToppingIngredient / topping_ingredients | id UUID PK; topping_id UUID; ingredient_id UUID; quantity_per_topping INTEGER, không default |
| OrderIngredientReservation / order_ingredient_reservations | id UUID PK; order_id UUID; ingredient_id UUID; quantity_reserved INTEGER, không default; created_at default CURRENT_TIMESTAMP; released_at TIMESTAMPTZ(6) nullable, không default |

Ingredient.updatedAt có Prisma `@updatedAt`; raw SQL writer phải tự touch timestamp.
Ingredient.baseUnit là canonical unit của recipe/topping/reservation; các bảng con
không lưu unit khác để tránh hai nguồn đơn vị. Không cho phép ngầm đổi unit khi
đã có tồn/recipe/snapshot; policy kiểm soát write thuộc task nghiệp vụ tiếp theo.

CHECKs chỉ nằm trong migration SQL:

- `ck_ingredients_stock_nonnegative`: stock_quantity >= 0.
- `ck_recipe_ingredients_quantity_positive`: quantity_per_unit > 0.
- `ck_topping_ingredients_quantity_positive`: quantity_per_topping > 0.
- `ck_order_ingredient_reservations_quantity_positive`: quantity_reserved > 0.

INTEGER tự giới hạn -2,147,483,648…2,147,483,647; CHECK giới hạn miền không âm/dương.
Prisma không biểu diễn CHECK; các migration sau phải bảo toàn chúng và chạy lại
catalog/negative assertions. Không dùng `db push` thay cho migrations.

Unique indexes:

- `ingredients_code_key` (code).
- `uq_recipe_ingredients_product_size_ingredient` (product_id, size, ingredient_id).
- `uq_topping_ingredients_topping_ingredient` (topping_id, ingredient_id).
- `uq_order_ingredient_reservations_order_ingredient` (order_id, ingredient_id).

Ba nonunique indexes `ix_{recipe_ingredients,topping_ingredients,order_ingredient_reservations}_ingredient_id`
phục vụ FK/reverse lookup. Không thêm index product_id/topping_id/order_id vì
leftmost prefix của unique đã phục vụ. Tổng cộng 11 indexes gồm 4 PK + 4 unique + 3 reverse.

Sáu FK đều `ON DELETE RESTRICT ON UPDATE CASCADE`: recipe → Product/Ingredient,
topping recipe → Topping/Ingredient, reservation → Order/Ingredient. Restrict
theo convention lịch sử OrderItem/CouponRedemption, tránh xóa cascade snapshot
hoặc âm thầm mất cấu hình. Update Cascade giữ relation khi đổi PK theo convention
baseline; không làm thay đổi quantity snapshot. Recipe có thể được sửa/xóa rõ
ràng mà reservation không lệ thuộc recipe. Hard-delete trực tiếp reservation
và sửa quantity vẫn khả thi qua DB quyền ghi: chưa có immutable/audit trigger.

ONE_SIZE dùng `DrinkSize.ONE_SIZE` sẵn có, required size không nullable. Schema
cho phép lưu enum size hợp lệ; không có cross-table CHECK rằng size khớp
Product.sizePolicy. Validator seed/checkout phải kiểm tra policy, ProductTopping
eligibility và recipe coverage; SQL CHECK không thể kiểm tra bảng khác. Không
thêm trigger hay đổi ý nghĩa size ngoài design đã duyệt.

## 5. Migration strategy và rủi ro

Migration mới: `20261117110000_scrum121_ingredient_inventory`.
Sinh bằng Prisma 7.10.1 `migrate diff --from-schema <baseline.prisma>
--to-schema prisma/schema.prisma --script --output <migration.sql>`, sau đó review,
bọc BEGIN/COMMIT và thêm 4 CHECK thủ công. Diff schema-to-schema tránh Prisma
đề xuất xóa PostgreSQL CHECK/partial index baseline không biểu diễn trong Prisma.

SQL chỉ CREATE enum/bảng/index, ADD FK/CHECK vào bảng mới. Không DROP, UPDATE,
DELETE, TRUNCATE, backfill hay ALTER cột legacy. FK cần lock metadata ở bảng cha;
DDL vẫn có thể chờ transaction đang chạy. Cần rehearsal, maintenance/drain và
approved runbook trước release. Không tự thêm global lock_timeout vào migration.

Chạy từ `apps/api`, trỏ DATABASE_URL/SHADOW_DATABASE_URL tới database test riêng:
`npm run db:validate`, `npm run db:generate`, `npm run db:migrate`;
`npx prisma migrate status --config prisma7.config.ts`. Không dùng `.env` demo.
Deploy lần hai phải báo không pending. Prisma config thực tế dùng schema
`prisma/schema.prisma`, migrations `prisma/migrations`, client
`src/generated/prisma` (ignored, không commit). Không dùng db:seed trong task này.

Rollback ứng dụng và phục hồi DB là hai việc khác nhau. Revert Git không đảo
migration. Trước ingredient cutover, code baseline đã được test với schema mở
rộng trong phạm vi §6. Sau khi có ingredient-backed Order, không blind rollback
về Product.stock. Không cung cấp destructive down migration; recovery phải bảo
toàn Order/Payment/stock mới, dùng backup/restore hoặc forward fix đã review.
Backup/restore rehearsal đầy đủ thuộc SCRUM-128, chưa chạy trong lượt này.

## 6. Migration test report và backward compatibility

Runner: [ingredient-schema.rehearsal.mjs](../../apps/api/test/ingredient-schema.rehearsal.mjs).
Từ `apps/api`: đặt `SCRUM121_TEST_PORT=55421`, chạy
`node test/ingredient-schema.rehearsal.mjs`.
Kiểm chứng env riêng, không cần port/DB: `node test/ingredient-schema.rehearsal.mjs --check-env-only`.

Runner chỉ chấp nhận loopback:55421, user scrum121, PostgreSQL 18 và cluster_name
`brewlite_scrum121_test`. Không nhận DATABASE_URL có sẵn; override cả
DATABASE_URL, SHADOW_DATABASE_URL, AUTH_TEST_DATABASE_URL, ORDERS_TEST_DATABASE_URL
cho subprocess. Mỗi lần tạo hai DB tên ngẫu nhiên mới, không ghi đè DB cũ.
Sau review, mọi Node/Prisma/Vitest/Git/tar subprocess đều nhận env riêng từ cùng
`subprocessEnv`: lọc tên biến không phân biệt hoa/thường, ép
`SEED_RENDER_PG_INTEGRATION=0`, loại bỏ `SEED_RENDER_INTEGRATION_DATABASE_URL`,
ép `PAYMENT_CONCURRENCY_TESTS=0` để kết quả opt-in nhất quán. Vẫn giữ PATH và
OS/tool variables; không sửa terminal process.env hoặc file môi trường người dùng.
Chế độ env-only inject cờ bật và target sentinel ngoài phạm vi vào một parent
object, tạo Node child chỉ assert env đã lọc, không import driver hay kết nối DB.
Runner kiểm tra hai tên DB đúng prefix task và chưa tồn tại trước CREATE DATABASE;
không DROP/tái sử dụng database hoặc khởi động lại stack khác.
Baseline source lấy bằng `git archive` SHA cố định, giải nén trong temp;
generate client cũ tại source snapshot, dùng dependencies đã cài chung qua junction.
Không thay code/test baseline để né guard môi trường.

Evidence kết quả cuối được ghi tại [SCRUM-121-evidence.json](SCRUM-121-evidence.json).
File gồm baseline, SHA-256 từng file được kiểm tra, thời điểm UTC, PostgreSQL/
Node/Prisma versions, DB IDs, câu lệnh/method và kết quả. Raw logs, catalog, toàn
bộ fixture before/after nằm trong thư mục temp của run, không chứa dữ liệu demo.
Top-level là run sau sửa review; `historicalRuns[0]` giữ nguyên toàn bộ giá trị
evidence trước review. `historicalReview` ghi hạn chế đã phát hiện, không biến
hai assertions cũ thành bằng chứng đầy đủ cho FK mới.
Không publish raw connection strings hoặc password/token/secret vào báo cáo.

<!-- SCRUM121_RESULTS -->
Run lịch sử trước review: **2026-11-17 11:12:11–11:13:21 UTC** (18:12:11–18:13:21 UTC+7).
PostgreSQL **18.6**, Node **26.13.1**, Prisma/Client **7.10.1**; Vitest **4.1.11**.
Baseline `3a183d67c12658432100298eefd2b4ffe0bbfb7a`; thay đổi kiểm tra được khóa
bằng `changeHashes` trong evidence, không giả lập commit cho working diff.

| Yêu cầu / phương pháp đã chạy | Kết quả thực tế |
| --- | --- |
| A — migrate deploy toàn bộ 11 migrations trên clean DB, status, deploy lại | PASS; status up-to-date; deploy lần hai “No pending migrations to apply” |
| B — deploy 10 migrations baseline, fixture liên kết, deploy migration mới, status/redeploy | PASS; chỉ migration SCRUM-121 mới được áp dụng khi nâng cấp |
| B — so sánh toàn bộ row trong 13 bảng legacy | PASS; beforeHash = afterHash = `fdb43e1e6d5add4590c1d4bb14e5edb491b55be23e41772c2a3579896dae0de8` |
| A/C — pg_catalog/information_schema trên cả hai DB | PASS; 4 tables, 23 columns, 4 PK, 6 FK, 4 CHECK, 22 NOT NULL (PostgreSQL 18), 11 indexes; catalog hai DB giống nhau |
| C — valid + invalid database assertions | Runner cũ báo PASS cho **48 negative assertions mỗi DB** theo SQLSTATE; review xác định hai ca topping/history-order restrict có thể bị FK baseline chặn, chưa chứng minh riêng FK mới |
| D — Prisma validate/generate | PASS; đúng config và output thực tế |
| D — build rồi Prisma Client mới roundtrip | PASS; create/read relations/defaults/ONE_SIZE và snapshot giữ nguyên khi recipe đổi; fixture mới được xóa trong transaction test |
| D — backend build và unit tests | PASS build; **479 passed, 6 skipped**, 39 files passed/1 skipped; skipped không tính PASS |
| D — client sinh từ schema baseline + source/config/tests baseline trên DB nâng cấp | **103 passed, 10 skipped**, 4 suites passed; 10 opt-in Payment/Promotion concurrency cases chưa bật PAYMENT_CONCURRENCY_TESTS, không tính PASS |
| Final — git diff --check, conflict-marker scan và scope review | PASS; diff tracked và kiểm tra whitespace file mới không có lỗi; không conflict markers/secret patterns/destructive SQL; staging rỗng |

DB run lịch sử: `scrum121_clean_73fc6a314aa6` và
`scrum121_upgrade_73fc6a314aa6`. Evidence/log/catalog/snapshots gốc:
`%TEMP%\brewlite-scrum121-rehearsal-6FEIKU`.
Các lần chẩn đoán trước run cuối có lỗi harness/environment (Prisma shadow URL
rỗng, SQLSTATE RESTRICT, thứ tự fixture, TS loader và guard port baseline);
không ghi những lần đó PASS. Logs/temp test resources được giữ lại, không chỉnh
migration lịch sử hay source baseline để xử lý các lỗi harness.
<!-- /SCRUM121_RESULTS -->

### 6.1 Sửa findings và kết quả rehearsal mới

Trước sửa đã đọc lại AGENTS.md, branch/HEAD/staging/working files: vẫn là
`SCRUM-121-ingredient-inventory-schema`, HEAD `3a183d67c12658432100298eefd2b4ffe0bbfb7a`,
staging rỗng, bảo toàn sáu file đang thay đổi. Không fetch/tích hợp dev hoặc đổi
branch trong lượt sửa này. Schema và SQL migration không thay đổi so với run cũ.

Run mới: **2026-11-17 11:27:47–11:28:52 UTC** (18:27:47–18:28:52 UTC+7), baseline
vẫn là SHA trên; PostgreSQL **18.6**, Node **26.13.1**, Prisma/Client **7.10.1**,
Vitest **4.1.11**. Đã xác minh lại cluster_name/user/version/data directory của
cluster task ở port 55421 trước chạy. Tạo hai DB mới:
`scrum121_clean_8d6deb4dbe8b`, `scrum121_upgrade_8d6deb4dbe8b`; không xóa/tái sử
dụng DB nào. Raw evidence/logs: `%TEMP%\brewlite-scrum121-rehearsal-1pv30K`.

| Finding / kiểm tra thực sự chạy | Kết quả mới |
| --- | --- |
| Major — `--check-env-only` và env proof đầu full runner | PASS; Node child nhận seed opt-in=0, không có seed target, payment concurrency=0, chỉ URL task; parent object và OS/tool variables nguyên vẹn; không kết nối target sentinel |
| Minor — isolated fixtures + exact PostgreSQL error fields | PASS cả clean/upgrade; topping chỉ được ToppingIngredient tham chiếu; Order mới không có OrderItem/Payment/CouponRedemption, chỉ được reservation tham chiếu |
| Clean deploy/status/redeploy | PASS toàn bộ 11 migrations, không pending khi deploy lại |
| Baseline 10 migrations + fixture upgrade/status/redeploy | PASS, toàn bộ row của 13 bảng legacy trước/sau bằng nhau |
| Catalog + negative assertions | PASS **50 negative assertions mỗi DB**; sáu delete-restrict ca riêng; SAVEPOINT/ROLLBACK giữ các bước độc lập |
| Prisma validate/generate, backend build, client mới roundtrip | PASS, dùng đúng config/output như trước |
| Unit suite trong runner | **479 passed, 6 skipped**; sáu seed guard integration tests bị tắt rõ ràng bằng SEED_RENDER_PG_INTEGRATION=0, không tính PASS |
| Source/client/config baseline trên DB nâng cấp | **103 passed, 10 skipped**, bốn suite passed; PAYMENT_CONCURRENCY_TESTS=0 tắt 7 payment + 3 promotion concurrency tests, không tính PASS |

Hai ca được review nay bắt đúng `23001` và tên mới:

- Topping restrict: `topping_ingredients_topping_id_fkey`.
- History Order restrict: `order_ingredient_reservations_order_id_fkey`.

Đã siết cả bốn ca delete-restrict còn lại, sáu ca FK insert, bốn ca unique và các
CHECK bằng tên constraint thực tế từ migration; NOT NULL kiểm tra cả tên column.
Raw `pg` trả DatabaseError trực tiếp (`code`, `constraint`, `column`), không có
wrapper cần unwrap và không dùng matching thông báo lỗi. Range/enum parse errors
không có tên constraint thì vẫn so SQLSTATE chính xác. Từng observed case được
lưu tại `checks[].detail.negativeCases` trong evidence mới.

Checksum runner mới: `b734c6c9c0182e7eec3217f0079cd0e3c8f87bdd6ea0981aa8466ccdc35ba765`.
Whole-row hash before = after:
`4883626e22f5aaed1f2dab8dccdbe9932f61bf762bfd4c1932d83fe5c28dc5d6`.
Schema/migration hashes giữ nguyên run cũ; xem đầy đủ trong `changeHashes`.
Không chạy thêm build/test ngoài runner vì kết quả không phát sinh lý do mới.
Các giới hạn runtime/VNPay/restore/remote CI bên dưới vẫn giữ nguyên.

Assertions hợp lệ: đủ G/ML/MG/UNIT; stock 0 và max Int; quantity dương; nhiều
ingredient; S/M/L/ONE_SIZE; reservation cho PENDING/PAYMENT_FAILED/PAID/CANCELLED;
released_at null/set; snapshot không đổi sau sửa/xóa recipe; FK update cascade.
Negative cases chạy bằng SAVEPOINT/ROLLBACK, cuối transaction luôn rollback.

Database upgrade có fixture Product STANDARD/ONE_SIZE, Topping/ProductTopping,
4 Users với loyalty=125, Coupon, 4 Orders (paid/cancelled/pending/failed),
OrderItem/topping price/name snapshots, CouponRedemption và 3 Mock Payments.
Before/after so sánh JSONB toàn bộ row của 13 bảng legacy, gồm ID, tất cả columns,
giá, status, timestamps, stock=47, loyalty, JSON payment, các FK; không chỉ row count.
Không chụp hoặc kết nối Production. Seed fixture ở schema baseline trước deploy
mới là quy trình nâng cấp tương đương, không sao chép dữ liệu thật.

Giới hạn runtime: bốn suite baseline inventory/order-lifecycle/payments/promotions
chạy với client sinh từ schema baseline trên DB nâng cấp, xác minh Create Order,
stock reserve/rollback/release, expiration, PAID không restore, Mock payment,
idempotency, Coupon hold/consume/release, loyalty và Order History theo test names.
Không tuyên bố full runtime compatibility hay ingredient concurrency đã chứng minh.
Suite grace, signed-IPN/QueryDR và ZERO_AMOUNT có guard khóa cứng
localhost:5433/brewlite_test; không đổi guard/không dùng port đó. Lần thử được
ghi FAIL môi trường, không PASS. VNPay Sandbox thật, full E2E/UI/Docker, Production,
restore recovery và required remote CI chưa được kiểm chứng trong lượt này.

## 7. Môi trường test và dọn riêng

Docker CLI không có trong PATH; dùng native PostgreSQL 18.6 đã cài, cùng major 18
với `postgres:18-alpine` trong compose. Cluster mới nằm tại
`%TEMP%\brewlite-scrum121-pg18\data`, log ở thư mục cha; bind 127.0.0.1:55421,
cluster_name `brewlite_scrum121_test`. Đã kiểm tra path chưa tồn tại và không có
listener ở port trước initdb. Cluster dành riêng fixture, không dùng password
thật; không expose ra network. Không sửa compose.env/.env demo; datasource và
test environment được override trước khi Prisma/Nest nạp dotenv.

Tài nguyên được giữ để review: cluster test mới, các DB `scrum121_clean_*` và
`scrum121_upgrade_*` của các lần rehearsal (kể cả lần harness lỗi), các thư mục
`%TEMP%\brewlite-scrum121-rehearsal-*`, và baseline.prisma temp của migrate diff.
Run cuối xác định chính xác hai DB trong evidence JSON. Lượt này chỉ restart
cluster test mới để nạp cluster_name; không restart/dừng stack có sẵn.

Dọn sau review: xác minh `pg_ctl status -D <đúng path trên>` và cluster_name,
dừng riêng bằng `pg_ctl -D <đúng path trên> -m fast -w stop`; sau đó kiểm tra
resolved absolute path đúng thư mục task trước khi xóa thư mục cluster/temp.
Không dùng compose down -v, không drop DB ngoài cluster này. Junction node_modules
trong snapshot trỏ dependencies workspace: bỏ junction trước khi xóa snapshot,
không recurse qua junction vào node_modules thật. Không tự dọn tài nguyên có sẵn.

## 8. Handoff và việc chưa triển khai

- SCRUM-122: dùng IngredientBaseUnit G/ML/MG/UNIT, Int bounds, unique code và
  exact Product/Size/Topping mapping theo Master. Seed idempotency/opening stock/
  conversion còn cần approval riêng; không suy stock từ Product.stock. Không
  hard-delete Ingredient đã được recipe/snapshot tham chiếu. Validate size policy,
  positive integer và coverage trước commit seed transaction.
- SCRUM-123: aggregate theo ingredientId trên toàn cart; checked multiply/sum;
  lock sorted Ingredient rồi Coupon; conditional decrement; tạo aggregate
  reservation atomically với Order. Fields snapshot là lượng thực tế đã trừ.
- SCRUM-124: lock Order/recheck safeguards/conditional transition, validate
  snapshot-integrity, hoàn exact snapshot và set releasedAt cùng transaction với
  Coupon; PAID/legacy không đi vào ingredient release. Marker/unique một mình
  không chứng minh release đúng một lần.
- D-06 persistence integrity **đề xuất để review, chưa phê duyệt/triển khai**:
  manifest tại Order (version, expected canonical ingredient/quantity digest và
  count), tạo cùng transaction với snapshot; kiểm tra lại trước release. Cần
  phân biệt legacy với ingredient-backed Order và phát hiện snapshot thiếu/sửa.
  Hash trong cùng DB không ngăn authorized tampering; cần policy write/audit và
  failure tests. Không tự thêm manifest/trigger chưa được owner chốt trong PR này.
  Cơ chế snapshot-integrity kiểm chứng được là yêu cầu bắt buộc của D-06;
  persistence cụ thể và ranh giới task vẫn cần **Khang quyết định trước approval/merge**.
  Không coi handoff này là phê duyệt dời persistence sang SCRUM-123.
- SCRUM-125/126/127: availability, API Contract verification, numeric/concurrency,
  signed gateway và cross-module regression tiếp theo. SCRUM-128/129/130 sở hữu
  restore rehearsal, drain, controlled release, real VNPay Sandbox E2E và signoff.

Câu hỏi chuẩn bị cho Khang, chưa gửi:

1. Chấp nhận schema core trong SCRUM-121 và bổ sung persistence bằng migration
   SCRUM-123 trước khi bật luồng mới?
2. Hay chốt thiết kế persistence và bổ sung ngay SCRUM-121?

Schema core hỗ trợ aggregate snapshot và released_at. Không thêm
manifest/version/digest/count hoặc tự bỏ yêu cầu integrity; transaction
reserve/release và concurrency vẫn thuộc các task tiếp theo.

## 9. PR nháp và danh sách đề nghị commit

Title: `feat(SCRUM-121): add ingredient inventory schema and additive migration`

Body đề xuất (base dev, reviewer Khang; chưa tạo PR):

> Bổ sung Ingredient, RecipeIngredient, ToppingIngredient và
> OrderIngredientReservation theo D-01…D-08; giữ Product.stock và mọi nghiệp vụ
> Order/Payment/Coupon/Loyalty hiện tại. Dùng canonical-unit Int, unique aggregate,
> FK Restrict/Update Cascade và CHECK trong SQL migration transaction.
>
> Strategy: additive migration, không backfill/seed/cutover. Đã kiểm chứng trên
> PostgreSQL 18 riêng từ baseline 3a183d67: clean deploy/status/redeploy, baseline
> fixture upgrade + whole-row preservation, catalog/negative constraints, Prisma
> roundtrip, build/unit và runtime baseline. Kết quả chính xác, file hashes và
> giới hạn xem §6 cùng SCRUM-121-evidence.json.
>
> Đã sửa review findings: env riêng cho mọi subprocess, tắt seed ngoài phạm vi,
> env-only proof không kết nối DB; isolated delete-restrict fixtures assert đúng
> SQLSTATE + tên FK. Run mới 50 negative assertions mỗi DB PASS, unit 479 passed/6
> skipped, baseline runtime 103 passed/10 skipped. Evidence cũ được giữ cùng ghi
> chú hai assertions cũ có hạn chế; không tính skipped là PASS.
>
> Chưa triển khai snapshot-integrity persistence/transaction immutability,
> ingredient reserve/release/concurrency, seed hoặc availability. Khang cần quyết
> định persistence D-06 và ranh giới SCRUM-121/123 trước approval/merge; chưa tự
> phê duyệt defer. Remote CI/review/merge còn pending;
> không triển khai Production và không tự đánh dấu Done.

Files đề nghị commit sau review:

1. `apps/api/prisma/schema.prisma`
2. `apps/api/prisma/migrations/20261117110000_scrum121_ingredient_inventory/migration.sql`
3. `apps/api/test/ingredient-schema.rehearsal.mjs`
4. `docs/ingredient-inventory/05_SCRUM-121_Schema_Migration.md`
5. `docs/ingredient-inventory/SCRUM-121-evidence.json`
6. `docs/ingredient-inventory/README.md`

DoD còn pending: Khang review/approval, xử lý quyết định integrity theo scope đã
thống nhất, cho phép stage/commit/push/tạo hoặc cập nhật PR, required CI PASS và
merge dev. Không tự gửi thông báo thành viên, không tự đóng Jira.

Review cuối local ngày 2026-11-17: HEAD vẫn bằng baseline đã fetch. Chỉ sáu file
trong danh sách trên thay đổi; toàn bộ migration lịch sử nguyên vẹn. Đã đọc lại
schema, SQL mới, runner và tài liệu/evidence; SQL không thay dữ liệu/cột legacy.
`git diff --check` PASS; file mới kiểm tra bằng `git diff --no-index --check -- NUL
<path>` không có whitespace errors (Git chỉ cảnh báo autocrlf). Không có staged
files, conflict markers hoặc secret patterns trong phạm vi thay đổi. Đây là
self-review local, không thay thế review/approval của Khang hoặc required CI.
