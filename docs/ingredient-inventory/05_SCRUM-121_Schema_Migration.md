# SCRUM-121 / INV-03 — Prisma schema và additive migration

Owner: Nguyễn Khải Hoàng. Reviewer theo task: Khang. PR base: `dev`.
Trạng thái: [PR #38](https://github.com/brewlite-project/brewlite-a2/pull/38) vào dev.
**Source rehearsal:** `4e9f1f0d23e4daac49d060af4b76bc72c2430738` cộng exact working
snapshot được lưu trong artifact (§6.3).
**Commit bàn giao provenance/evidence:** `05385eb65922efe302a16f9dfb53f0d5c440f595`,
đã commit/push; core `57fa0486…` và temporal `4e9f1f0…` là các mốc trước đó.
Revision hiện tại chỉ sửa metadata tài liệu; không đổi source rehearsal/evidence.
Reviewer Ryannguyxn xác nhận R-01/R-03 đã xử lý tại 05385eb trong
[comment 6951340446](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6951340446)
lúc 2026-11-17 14:44:26 UTC; đây không phải formal PR approval hoặc task Done.
Leader đã chốt merge core trước/defer persistence; required CI và merge vẫn là
điều kiện cần xác minh riêng.

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

Git đầu lượt implementation lịch sử (trước commit 57fa048): `main`, HEAD `2d80e15aa5c4d2a4a69f2222eafedf44e007fc48`, sạch cả
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
- `ck_order_ingredient_reservations_release_time`: released_at IS NULL OR
  released_at >= created_at; nằm trong follow-up migration `20261117130000_scrum121_reservation_release_time`.

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

Migration core ban đầu: `20261117110000_scrum121_ingredient_inventory`.
Sinh bằng Prisma 7.10.1 `migrate diff --from-schema <baseline.prisma>
--to-schema prisma/schema.prisma --script --output <migration.sql>`, sau đó review,
bọc BEGIN/COMMIT và thêm 4 CHECK thủ công. Diff schema-to-schema tránh Prisma
đề xuất xóa PostgreSQL CHECK/partial index baseline không biểu diễn trong Prisma.

PR #38 comment 6948316418 được xử lý bằng **migration additive tiếp theo**
`20261117130000_scrum121_reservation_release_time`: BEGIN/COMMIT, chỉ ADD CHECK
temporal lên bảng reservation hiện có. SQL core đã commit/push/apply giữ nguyên;
không migrate reset/resolve hoặc viết lại checksum. Prisma schema chỉ thêm
comment vì CHECK không biểu diễn bằng Prisma attributes. ADD CHECK validate
mọi row cũ ngay; nếu có released_at < created_at thì deploy phải fail, không
tự sửa timestamps hoặc bỏ validation. Preflight read-only có thể đếm các row
vi phạm, nhưng không thay thế validation trong migration. Constraint có thể
scan/lock bảng reservation; cần rehearsal và runbook trước release.

SQL core chỉ CREATE enum/bảng/index, ADD FK/CHECK vào bảng mới; follow-up chỉ ADD
CHECK lên reservation. Không DROP, UPDATE,
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
cho subprocess. Revision mới tạo ba DB tên ngẫu nhiên: clean, legacy upgrade
và core upgrade; không ghi đè DB cũ.
Sau review, mọi Node/Prisma/Vitest/Git/tar subprocess đều nhận env riêng từ cùng
`subprocessEnv`: lọc tên biến không phân biệt hoa/thường, ép
`SEED_RENDER_PG_INTEGRATION=0`, loại bỏ `SEED_RENDER_INTEGRATION_DATABASE_URL`,
ép `PAYMENT_CONCURRENCY_TESTS=0` để kết quả opt-in nhất quán. Vẫn giữ PATH và
OS/tool variables; không sửa terminal process.env hoặc file môi trường người dùng.
Chế độ env-only inject cờ bật và target sentinel ngoài phạm vi vào một parent
object, tạo Node child chỉ assert env đã lọc, không import driver hay kết nối DB.
Runner kiểm tra cả ba tên DB đúng prefix task và chưa tồn tại trước CREATE DATABASE;
không DROP/tái sử dụng database hoặc khởi động lại stack khác.
Baseline source lấy bằng `git archive` SHA cố định, giải nén trong temp;
generate client cũ tại source snapshot, dùng dependencies đã cài chung qua junction.
Không thay code/test baseline để né guard môi trường.

Evidence kết quả cuối được ghi tại [SCRUM-121-evidence.json](SCRUM-121-evidence.json).
File gồm baseline, SHA-256 từng file được kiểm tra, thời điểm UTC, PostgreSQL/
Node/Prisma versions, DB IDs, câu lệnh/method và kết quả. Raw logs, catalog, toàn
bộ fixture before/after nằm trong thư mục temp của run, không chứa dữ liệu demo.
Top-level là run mới nhất. Source snapshot bàn giao cùng manifest và verifier
được mô tả ở §6.3. Evidence trước revision được giữ byte-for-byte tại
`SCRUM-121-evidence.history.json`, gồm nested historicalRuns/provenance của các lượt trước. Không biến
hai assertions cũ bị review thành bằng chứng đầy đủ cho FK mới.
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

### 6.1 Lịch sử sửa findings env/FK và rehearsal trước commit 57fa048

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

### 6.2 Lịch sử PR #38 — temporal CHECK trước commit 4e9f1f0

Đã đọc lại [comment temporal](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6948316418)
và [comment integrity](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6948319016)
cùng timeline PR trước sửa; không thấy human response mới hơn hai comment lúc
2026-11-17 12:40:50/12:40:57 UTC. Git đầu lượt sạch, không có staged/untracked;
HEAD local/remote PR là `57fa0486c9fce5633f7be0f58c4ce99028ff2f22`, base/dev sau
fetch vẫn `3a183d67c12658432100298eefd2b4ffe0bbfb7a`. Không đổi branch/tích hợp dev.

Trước thêm migration, đã kiểm tra cluster riêng/data directory ở port 55421 và
DB test cũ: 11 migrations finished, không rolled back; migrate status up-to-date;
core migration checksum `feee2c114603c531a21d930a593de0eee973c7f4fed6c159c9b02747ac4d96f0`.
Theo AGENTS.md/ADR-002 và convention SQL migrations, thêm migration mới thay vì
sửa core đã áp dụng. Không reset/resolve/checksum overwrite hoặc sửa timestamps.

**Run cuối: 2026-11-17 12:56:50–12:58:11 UTC (19:56:50–19:58:11 UTC+7).**
PostgreSQL 18.6 / Node 26.13.1 / Prisma & Client 7.10.1 / Vitest 4.1.11.
Code đang kiểm tra = HEAD `57fa0486…` + working diff; hash chính xác ở evidence,
không gán SHA commit cho thay đổi chưa commit. Raw logs/catalog/snapshots:
`%TEMP%\brewlite-scrum121-rehearsal-Qq7yVI`.

| Đường kiểm chứng / lệnh hoặc phương pháp | Kết quả thực tế |
| --- | --- |
| Env-only và full runner env proof | PASS; seed/concurrency opt-ins bị tắt, target seed bị loại; không kết nối sentinel ngoài phạm vi |
| Clean `scrum121_clean_e750a0d544ec` | PASS deploy đủ 12 migrations → status → redeploy không pending |
| Legacy upgrade `scrum121_upgrade_e750a0d544ec` | PASS 10 migrations tại baseline 3a183d67 + fixture → 12 migrations → status/redeploy; whole-row 13 bảng legacy bằng nhau |
| Core upgrade `scrum121_core_upgrade_e750a0d544ec` | PASS export source/config/migrations từ head 57fa0486, deploy 11; thêm fixture có Ingredient/Recipe/Topping và 3 reservation persisted với NULL/equal/later; deploy chỉ follow-up thứ 12 → status/redeploy |
| Core upgrade preservation | PASS whole-row cả 17 bảng (13 legacy + 4 mới); giữ quantity/timestamps/quan hệ/stock; 11 migration history rows/checksums giữ nguyên, chỉ thêm một migration record |
| Catalog cả ba DB | PASS; temporal constraint đúng tên/definition và convalidated=true; 23 columns, 4 PK, 6 FK, **5 CHECK**, 22 NOT NULL, 11 indexes; catalogs giống nhau |
| Negative assertions cả ba DB | **53 mỗi DB PASS**: 50 ca cũ vẫn đúng FK/constraint/column + 3 temporal failures; SAVEPOINT/ROLLBACK cho từng lỗi và rollback toàn bộ assertion fixtures |
| Temporal positive assertions | 6 ca mỗi DB PASS: INSERT và UPDATE released_at NULL/equal/later; timestamp UTC cố định, không phụ thuộc clock execution |
| Temporal negative assertions | INSERT early release, UPDATE early release, UPDATE created_at vượt released_at đều trả SQLSTATE **23514** + **ck_order_ingredient_reservations_release_time** |
| Prisma validate/generate + build + Client mới roundtrip | PASS đúng config/scripts tương đương repo |
| Unit suite | **479 passed, 6 skipped**; seed one-shot guard suite bị tắt SEED_RENDER_PG_INTEGRATION=0, không tính skipped là PASS |
| Runtime code/client baseline 3a183d67 trên DB đã nâng cấp | **103 passed, 10 skipped**, 4 suites passed; 7 payment + 3 promotion concurrency cases tắt PAYMENT_CONCURRENCY_TESTS=0 |

Các ca temporal dùng created_at `2026-11-17T00:00:00.000Z`, early release
`2026-11-16T23:59:59.000Z`, later release `2026-11-17T00:00:01.000Z`.
UPDATE created_at vi phạm dùng `2026-11-17T00:00:02.000Z`. Ca INSERT lỗi có
ingredient/pair riêng hợp lệ, tránh PASS bởi FK/unique; errors kiểm tra structured
DatabaseError.code/constraint, không so thông báo. Valid cases và errors không
để lại rows làm sai các assertions khác. Không gặp timestamp lỗi trong fixture
nâng cấp; preflight và ADD CHECK sẽ chặn thay vì repair nếu có dữ liệu vi phạm.

Whole-row legacy before = after:
`baa2210722bd6a6a8fd792e993736bf1d7d620627ee3ac6b481954e3ef86a0b1`.
Whole-row core before = after:
`5ca144c099d2020ba58043e45f8a64d27a808b7b876127d4d08d7bb69eed49ad`.
Migration temporal hash:
`b97bf7478f27ad3549abfccee049d5f59634891e5c162576c1e6215d1d5a9caf`.
Runner hash:
`b5e32f2ae98945496c08e6ca51d3a0e835c56ab7496f7cb019bafd170df0b545`.

Checksum provenance: core export Windows có CRLF, byte hash `08a61dae…`; file
workspace/Git blob có LF, hash `feee2c11…`. Canonical LF content khớp hoàn toàn.
Không sửa cả hai file hoặc metadata đã áp dụng để làm chúng cùng byte hash.
`coreMigrationsBefore`/`coreMigrationsAfter` chứng minh 11 records cũ, gồm checksum,
không đổi **trong cùng DB**; `coreMigrationEncoding` giữ đầy đủ cả hai raw hashes.
Lượt functional trước ở `%TEMP%\brewlite-scrum121-rehearsal-zq2DjQ` và diagnostic
line-ending được giữ; run cuối bổ sung check history trước/sau, không dùng
reset/resolve che mismatch. Các evidence đã publish trước revision được giữ
nguyên trong historicalRuns, không chuyển 48/50 assertions cũ thành 53 mới.

Giới hạn: temporal CHECK chỉ bảo đảm thứ tự timestamp. Manifest/immutable guards,
reserve/release/concurrency chưa triển khai; xem đề xuất §8.1. Không test restore,
real VNPay Sandbox, Docker/UI/full E2E hoặc Production. Không chạy thêm build/test
ngoài runner trừ env-only và chẩn đoán checksum có mục đích. Không thay đổi demo/
Production, không sửa cấu hình người dùng hoặc dừng/restart stack trong lượt này.

### 6.3 Lịch sử rehearsal provenance — source 4e9f1f0 + snapshot, bàn giao tại 05385eb

Nguồn review: [Major 6949549474](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6949549474),
Ryannguyxn, created/updated **2026-11-17T13:33:42Z**. Ở lượt provenance lịch sử này,
Git đầu lượt sạch, local và
PR head cùng `4e9f1f0d23e4daac49d060af4b76bc72c2430738`; dev/base vẫn
`3a183d67c12658432100298eefd2b4ffe0bbfb7a`. Không tích hợp dev hoặc đổi branch.

**Nguyên nhân đã xác minh bằng bytes, không sửa hash cũ:**

| Input cũ | Hash raw đã ghi và working tree lúc điều tra | Canonical CRLF→LF / Git blob tại 4e9f1f0 | Kết luận |
| --- | --- | --- | --- |
| schema.prisma | `6979d0c58e553d84266681dc4e57d05548b5cfd07630d30c334fcb44b597104e` | `618eee5245fa7a6fb5b7d5ea6bc809de77035372ed45ca663fafeae76e4132bd` | 447 CRLF; chỉ khác EOL, canonical nội dung khớp Git |
| Core migration | `feee2c114603c531a21d930a593de0eee973c7f4fed6c159c9b02747ac4d96f0` | Cùng hash | Không khác nội dung/bytes |
| Temporal migration | `b97bf7478f27ad3549abfccee049d5f59634891e5c162576c1e6215d1d5a9caf` | Cùng hash | Không khác nội dung/bytes; file chưa tồn tại tại core baseline 57fa048 |
| Runner cũ | `b5e32f2ae98945496c08e6ca51d3a0e835c56ab7496f7cb019bafd170df0b545` | Cùng hash | Không khác nội dung/bytes |

Đọc-only `.gitattributes`, `git ls-files --eol`, `git check-attr` và
`git config --show-origin --get-regexp`: API paths không có eol override;
`core.autocrlf=true` đến từ `C:/Program Files/Git/etc/gitconfig`. Không sửa config
Git hoặc normalize repository. `headAtRun=57fa048` + working diff của lượt cũ
không tự chứng minh test sai; bốn input hashes đối chiếu được tới bytes hiện
có, nhưng lượt cũ thiếu snapshot đầy đủ bàn giao nên không đủ provenance độc lập
cho toàn bộ source. Giữ nguyên lịch sử đó và chạy evidence mới, không gán SHA
commit tương lai hoặc thay hash thủ công để giả khớp.

Revision mới chỉ thêm hai rule `.gitattributes` **-text cho source snapshot và
evidence history JSON** để Git giữ exact artifact bytes trên Windows. Không đổi
EOL policy API hoặc normalize toàn repo. `git check-attr` xác nhận text=unset;
`git hash-object --path=...` bằng `--no-filters`, chứng minh artifact không bị
Git EOL conversion. `.gitattributes` là input đã hash nên thay đổi này được chạy
lại full rehearsal; không chỉnh input sau run cuối.

**Source snapshot mới:** [SCRUM-121-source-snapshot.json](SCRUM-121-source-snapshot.json),
format `brewlite-scrum121-source-v1`. Base commit truy xuất được `4e9f1f0…` cộng
manifest **191 input files**. Unchanged files tham chiếu Git blob và explicit
EOL transform; source mới/đổi/mixed-EOL lưu exact base64 bytes. Có cả helper mới
chưa tracked lúc capture (đã được bàn giao tại 05385eb), không phụ thuộc git diff
có thể bỏ sót untracked. Mỗi file có size,
raw SHA-256 và canonical-LF SHA-256. Canonical chỉ thay CRLF→LF trên UTF-8, không
trim/reformat; raw mới là bằng chứng exact bytes. Artifact hash được khóa trong
evidence; đây không phải cơ chế chữ ký chống actor sửa đồng thời cả artifacts.

Scope gồm API src (trừ generated), test, prisma và **toàn bộ migration inputs**,
Prisma/build/test config, package.json/package-lock.json và .gitattributes. Không
snapshot node_modules, generated/build output, .env, credentials hoặc DB/user data.
Docs/evidence/source-artifact output nằm ngoài tập input để tránh tự tham chiếu.
Runtime dependencies dùng node_modules hiện có qua junction, không chụp dependency
tree; package/lockfile và versions thực Node/Prisma/Client/adapter/pg/Vitest/
TypeScript/Nest CLI/Git/platform được ghi. Chưa chứng minh clean dependency install.

Runner materialize exact source vào `%TEMP%\...\tested-source`, verify raw manifest
rồi chạy migrate/build/unit/Client từ đó. Legacy source riêng tại commit `3a183d67…`,
core-upgrade source riêng tại `57fa0486…`; đều có manifest actual inputs trước/sau,
không thay core baseline thành head temporal. Current workspace và tested-source
được hash trước/sau; drift làm kết quả FAIL/INVALID_SOURCE_CHANGED với exit khác 0.
Self-test tạo bản sao temp, xác nhận content drift, thêm file input và EOL-only
được phân biệt; không sửa workspace hoặc kết nối DB.

**Run evidence cuối:** 2026-11-17 **14:06:27–14:07:39 UTC**
(21:06:27–21:07:39 UTC+7). Branch `SCRUM-121-ingredient-inventory-schema`,
headAtRun `4e9f1f0d23e4daac49d060af4b76bc72c2430738`, dirty=true vì tại thời điểm
chạy, source provenance còn local; snapshot khóa working source đó, sau này được
bàn giao tại commit 05385eb. PostgreSQL 18.6 / Node 26.13.1 /
Prisma & Client 7.10.1 / Vitest 4.1.11; xem `versions.tools` cho công cụ khác.

| Kiểm chứng thực thi mới | Kết quả |
| --- | --- |
| Provenance self-test, env isolation | PASS; không kết nối target ngoài phạm vi |
| Clean `scrum121_clean_861e8c42e3b7` | Deploy 12 migrations → status/redeploy PASS |
| Legacy `scrum121_upgrade_861e8c42e3b7` | Upgrade 10→12, status/redeploy, whole-row 13 bảng PASS |
| Core `scrum121_core_upgrade_861e8c42e3b7` | Upgrade 11→12, status/redeploy, whole-row 17 bảng và 11 history/checksum records giữ nguyên PASS |
| Catalog + constraint assertions cả ba DB | 5 CHECK validated; **53 negative + 6 temporal positive cases mỗi DB PASS**, SQLSTATE/constraint names giữ nguyên |
| Validate/generate/build/Client roundtrip | PASS từ tested-source snapshot |
| Unit | **479 passed / 6 skipped**; seed integration opt-in bị ép 0 |
| Baseline runtime | **103 passed / 10 skipped**; 7 payment + 3 promotion concurrency opt-in bị ép 0 |
| Source before/after | PASS 191 files raw bytes, cả workspace/tested-source; baseline sources không đổi |
| Subprocesses | **19 commands, tất cả exit 0**; từng lệnh có startedAt/finishedAt/exitCode do runner sinh |

Evidence mới được copy **nguyên bytes runner output**, không thêm PASS/đếm tests
bằng tay. Output gốc: `%TEMP%\brewlite-scrum121-rehearsal-fjZC3l`.
Source artifact SHA-256:
`ff202387a81b316d9187f90e3e5b5024dadff4a76c67e425557c8422558135be`.
Evidence lịch sử byte SHA-256:
`4fe4973a9e9afa39c6deeeb18c746a68bb682068ea796ed7b4333380b121a819`.
Legacy before=after `46fc4a72ab2741cf48886b9861f69b1f581d5f7aa0a406b4c2520b1e6c9b0751`;
core before=after `27a64dea5f719723112a6c75292d758fe9ee8361f2257de8071d81c3d363ac37`.
Lượt provenance trung gian 13:58:20–13:59:46 UTC trước khi thêm scoped artifact
attributes được giữ tại `%TEMP%\brewlite-scrum121-rehearsal-77wjd7`; không dùng
kết quả đó thay run cuối sau thay đổi input `.gitattributes`.

Reviewer chạy từ `apps/api` (không truy cập DB):

```powershell
node test/ingredient-source.provenance.mjs --verify ../../docs/ingredient-inventory/SCRUM-121-evidence.json
```

Default bắt buộc raw exact. Nếu checkout Git khác EOL, có thể chạy thêm
`--canonical-lf`: vẫn reconstruct/verify exact snapshot raw, nhưng đối chiếu
workspace theo canonical và báo số raw EOL differences rõ ràng; không cho content
drift PASS. `--self-test` kiểm tra các trường hợp drift bằng temp copy. Full
rehearsal: `SCRUM121_TEST_PORT=55421` rồi `node test/ingredient-schema.rehearsal.mjs`;
chỉ chạy khi cluster task được xác minh, tạo ba DB mới, không reuse/drop DB có sẵn.

Sau run cuối không sửa hashed input. Chỉ cập nhật báo cáo/index và publish
evidence/source/history artifacts ngoài scope; verifier cuối xác nhận lại sau
mọi chỉnh tài liệu. Không chạy lại toàn bộ tests cho docs-only. Skips, restore,
real VNPay, ingredient persistence/reserve/release/concurrency, remote CI và merge
vẫn là giới hạn/gates riêng; không ghi deferred implementation/tests là PASS.

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
Evidence provenance §6.3 xác định chính xác ba DB test. Việc restart để nạp
cluster_name thuộc lượt khởi tạo cluster lịch sử; revision metadata hiện tại
không truy cập DB hoặc restart/dừng stack.

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
- D-06 persistence integrity **deferred sang SCRUM-123 theo quyết định Leader**;
  chi tiết thiết kế vẫn là đề xuất chưa triển khai:
  manifest tại Order (version, expected canonical ingredient/quantity digest và
  count), tạo cùng transaction với snapshot; kiểm tra lại trước release. Cần
  phân biệt legacy với ingredient-backed Order và phát hiện snapshot thiếu/sửa.
  Hash trong cùng DB không ngăn authorized tampering; cần policy write/audit và
  failure tests. Không tự thêm manifest/trigger chưa được owner chốt trong PR này.
  Cơ chế snapshot-integrity kiểm chứng được là yêu cầu bắt buộc của D-06;
  ranh giới defer đã được Ryannguyxn chốt tại [comment 6949554030](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6949554030)
  lúc **2026-11-17 13:33:54 UTC**. Chi tiết persistence/guards/permissions chưa
  được comment này phê duyệt riêng; implementation/test gates vẫn chưa hoàn tất.
- SCRUM-125/126/127: availability, API Contract verification, numeric/concurrency,
  signed gateway và cross-module regression tiếp theo. SCRUM-128/129/130 sở hữu
  restore rehearsal, drain, controlled release, real VNPay Sandbox E2E và signoff.

Quyết định Leader đã có, không hỏi lại hai phương án cũ: core schema được phép
merge trước; persistence deferred sang SCRUM-123; SCRUM-123/124/126 phải hoàn
thành implementation/test gates trước bật ingredient-backed Orders. Cho phép
merge về phạm vi không đồng nghĩa formal PR approval, CI PASS hoặc đã merge.

Schema core hỗ trợ aggregate snapshot và released_at. Không thêm
manifest/version/digest/count hoặc tự bỏ yêu cầu integrity; transaction
reserve/release và concurrency vẫn thuộc các task tiếp theo.

### 8.1 Thiết kế snapshot-integrity đề xuất — defer sang SCRUM-123 đã được Leader chốt

Nguồn: [D-06, Decision Spec §4 và §7](01_Ingredient_Inventory_Decision_Spec_v1.0.md),
[comment PR #38](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6948319016).
Comment 6948319016 ban đầu cho phép đề xuất defer; sau đó Leader **Ryannguyxn**
đã chốt defer tại [6949554030](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6949554030),
created/updated **2026-11-17T13:33:54Z**. Quyết định này chốt scope/task/gate,
không phê duyệt riêng phương án fields/guards/permissions dưới đây. Chúng là thiết kế đề xuất,
**chưa có trong Prisma/migration, chưa được triển khai hoặc test**. Temporal CHECK
là phần triển khai riêng, không thay thế integrity/immutability/one-time release.

**Phương án A đề xuất:** manifest tại Order, snapshot aggregate được seal một
lần, DB guards bảo vệ immutable data kết hợp runtime role hạn chế và application
verification trong cùng transaction. Không có ReservationStatus enum mới.

#### A. Marker, manifest và canonicalization

Tên logic đề xuất (tên/type cuối cần review trong migration SCRUM-123):

| Nơi lưu | Giá trị / nullability đề xuất | Vai trò |
| --- | --- | --- |
| Order.inventorySource | Nullable, default NULL ở bước expand; giá trị explicit LEGACY_PRODUCT hoặc INGREDIENT_V1 | Marker tồn tại độc lập reservation rows; NULL = chưa phân loại, không tự kết luận legacy |
| Order.inventorySnapshotVersion | Nullable Int, không default; v1 xác định canonical format + SHA-256 | Chọn verifier; unknown version fail-closed |
| Order.inventorySnapshotCount | Nullable Int, không default; > 0 khi ingredient-backed | Số ingredient aggregate khác nhau, không phải tổng quantity |
| Order.inventorySnapshotDigest | Nullable fixed-length 64 hex lowercase, không default | SHA-256 canonical bytes; không coi là chữ ký chống authorized tampering |

Đề xuất shape constraint cuối transaction: INGREDIENT_V1 phải có đủ version,
count và digest hợp lệ; LEGACY_PRODUCT không có manifest và không có ingredient
reservation; NULL/partial metadata không được đưa vào ingredient release path.
Trong lúc dựng snapshot, có thể tạm chưa seal **chỉ trong transaction chưa commit**.
Không dùng count default 0 hoặc digest của danh sách rỗng để che missing snapshot.

Canonical format v1 (UTF-8, chỉ ASCII trong payload, LF, có trailing LF):

```text
brewlite:ingredient-reservation:v1
order=<canonical-order-uuid>
count=<decimal-count>
<canonical-ingredient-uuid>:<decimal-positive-quantity>
... mỗi ingredient đúng một dòng ...
```

- Parse UUID hợp lệ, serialize lowercase hyphenated UUID; aggregate theo cùng
  canonical ingredient ID, reject duplicate persisted pairs.
- Sort ingredient UUID bằng thứ tự byte ASCII xác định; không dùng localeCompare.
- Quantity là canonical-unit positive Int trong PostgreSQL INTEGER bounds;
  serialize decimal ASCII, không dấu cộng, leading zeros, fraction/exponent.
- Hash toàn bộ bytes, gồm domain/version/order ID/count; không hash released_at
  vì đây là trường lifecycle được phép đổi. Row ID/created_at không ở digest
  nhưng phải được immutable guard bảo vệ. Ingredient.baseUnit không được đổi
  ngầm khi có recipe/snapshot tham chiếu; cần unit mới thì dùng identity mới hoặc
  migration dữ liệu được duyệt riêng.

Create trong **một Prisma transaction**: giữ user/active Order safeguards hiện
có; tính và checked aggregate demand; decrement Ingredient sorted → reserve
Coupon theo D-07; tạo Order với INGREDIENT_V1; insert snapshot từ demand thực tế
đã trừ; đọc lại persisted rows và so exact map với demand; tính count/digest rồi
seal manifest một lần trước commit. Không HTTP trong transaction. Lỗi bất kỳ
bước nào rollback Order, stock, Coupon, rows và manifest. Manifest chứng minh
snapshot không đổi sau seal, không chứng minh recipe ban đầu đúng nếu creation
logic đã sai; phép so demand/persisted/decrement và regression tests vẫn bắt buộc.

Verifier dùng persisted manifest và **toàn bộ** reservation rows của Order,
kể cả released rows; kiểm tra source, version, count, positive quantities,
uniqueness và digest. Chạy trước release, ở creation trước commit và các
consistency checks được owner quy định. Thiếu một/all rows, partial manifest,
unknown version hoặc mismatch đều abort transaction, ghi operational error theo
policy hiện hữu, không sửa stock/status/marker một phần. Không tự thêm public
error code hoặc lấy recipe hiện hành để dựng lại snapshot đã mất.

#### B. Legacy và cutover

- Ingredient-backed có marker INGREDIENT_V1 đã seal độc lập với rows. Xóa hết
  rows vẫn để lại marker + expected count > 0, nên verifier phát hiện lỗi.
- NULL source = legacy/unknown chưa phân loại, **không đủ chứng cứ để fallback**.
  New ingredient path phải fail-closed. Existing Order History vẫn đọc dữ liệu
  cũ; không bắt legacy PAID Order phải có ingredient snapshot.
- Không backfill mọi Order thành ingredient-backed. Không dùng current recipe,
  ngày tạo hoặc việc không có rows làm chứng cứ duy nhất.
- Nếu cần backfill LEGACY_PRODUCT: chỉ làm với cohort Order được freeze và đối
  soát trước cutover theo D-05, có provenance rằng chúng do Product-stock writer
  tạo, không có ingredient-backed traffic; lưu danh sách/cohort evidence. Có
  reservation nhưng marker NULL/legacy là inconsistency, không silent classify.
- Expand nullable/default NULL cho phép schema đọc bởi code baseline. Trước bật
  ingredient writer: D-05 block/drain/reconcile; loại old writer khỏi Create;
  review guard tại DB/runtime để mọi **Order mới** phải explicit INGREDIENT_V1
  và manifest đầy đủ, reject NULL/LEGACY_PRODUCT ở new-write path. Guard áp dụng
  sau cutover không được cấm đọc/giữ lịch sử legacy. Default NULL chỉ phục vụ
  expansion, không phải quyền tiếp tục tạo legacy Order sau cutover.
- Nullability/default/backfill và guard cutover phải có migration/runbook được
  Leader duyệt, rehearsal trên dữ liệu cũ, rollback/recovery evidence. Việc core
  schema hiện backward-compatible không cấp phép chạy old writer sau cutover.

#### C. Bảo vệ snapshot và tradeoffs

Đề xuất DB guard: sau seal, cấm INSERT thêm rows, DELETE/TRUNCATE snapshot, thay
id/order_id/ingredient_id/quantity_reserved/created_at hoặc marker/manifest.
Chặn xóa Order làm mất bằng chứng. Không cho application tự đặt session flag để
bypass. Parent UUID không được mutate khi có snapshot: guard có thể làm FK
ON UPDATE CASCADE hiện tại bị reject; không âm thầm đổi FK hoặc identity policy.

Chỉ cho released_at NULL → timestamp >= created_at; cấm reset NULL hoặc đổi
timestamp đã ghi, cho no-op cùng giá trị khi policy retry cho phép. Release phải
đi qua primitive đã lock Order, recheck safeguards và verify manifest; chuyển
Order eligible sang CANCELLED, restore exact quantity, set markers, release
Coupon atomically. Mixed released markers là integrity failure; PAID không
restore. Temporal CHECK hoặc marker tự thân không chứng minh đã hoàn stock.

Không dùng immediate count/hash check cho từng INSERT vì snapshot nhiều rows
chưa hoàn chỉnh. Đề xuất deferred constraint guard đọc lại trạng thái cuối
transaction để reject ingredient Order chưa seal/manifest mismatch; không dựa
vào row image cũ khi kiểm tra batch cuối. PostgreSQL hỗ trợ constraint trigger
chạy cuối transaction; đây là lựa chọn thiết kế cần review, chưa có trigger trong
PR này. [PostgreSQL 18 CREATE TRIGGER](https://www.postgresql.org/docs/18/sql-createtrigger.html)

Runtime role phải tách migration owner, không quyền DDL/disable trigger/TRUNCATE,
không UPDATE immutable columns hoặc sửa manifest đã seal. Audit cả table grants,
column grants, role membership và SECURITY DEFINER functions; quyền table-level
rộng không được làm vô hiệu ý định hạn chế column. Permissions cần được kiểm
chứng bằng đúng runtime role. [PostgreSQL 18 Privileges](https://www.postgresql.org/docs/18/ddl-priv.html)

| Lựa chọn | Lợi ích | Chi phí / giới hạn |
| --- | --- | --- |
| A: ORM transaction + immutable/deferred guards + limited runtime role | Giữ architecture Prisma/transaction helper, phát hiện corruption và chặn thay đổi sau seal | Cần guard batch construction/seal/release, quyền runtime và migrations mới; phức tạp hơn core schema |
| B: Runtime chỉ EXECUTE các DB functions create/seal/release hẹp | Ranh giới ghi mạnh hơn; không cấp raw DML cho snapshot/manifest | Nhiều logic DB, tích hợp Prisma/locks/Coupon khó hơn, cần design review riêng |
| Application guard + digest đơn thuần | Ít DDL, triển khai nhanh | Không ngăn raw SQL hoặc actor sửa đồng thời rows và digest; không đủ làm protection theo đề xuất này |

Đề xuất A là phương án để Leader cân nhắc; B là tradeoff nếu yêu cầu boundary
mạnh hơn. Ngay cả A không chống superuser/migration owner disable guards hoặc
ghi lại cả snapshot và bằng chứng. Digest cùng DB không phải tamper-proof audit;
cần audit quyền/operational change control, không tuyên bố ngăn authorized tampering.

#### D. Ownership đề xuất và acceptance gates

Đối chiếu Work Plan và quyết định Leader: 121 core schema/migration/handoff;
persistence deferred sang 123; 124 release; 126 concurrency. Chi tiết triển khai
trong bảng là đề xuất; không ghi implementation/tests đã hoàn tất:

| Task | Trách nhiệm đề xuất |
| --- | --- |
| SCRUM-121 | Core schema, temporal CHECK đã yêu cầu, thiết kế handoff này và evidence; không thêm manifest/triggers chưa duyệt |
| SCRUM-123 | Persistence đã được deferred về task này; đề xuất additive migration, identity/source/manifest shape, guards/permissions phối hợp owner DB; tạo snapshot/evidence atomically và verifier |
| SCRUM-124 | Gọi verifier trước release, hoàn exact snapshot và one-time release trong transaction; không fallback recipe |
| SCRUM-126 | Test deterministic concurrency/corruption/failure injection bằng đúng runtime role, phối hợp 123/124 |

Acceptance tests bắt buộc trước hoàn tất 123/124 (đều NOT EXECUTED cho phương án
này; corruption fixture dùng quyền test riêng, không tạo bypass cho runtime):

| Case | Expected |
| --- | --- |
| Xóa một hoặc toàn bộ rows | Runtime delete bị chặn; corruption cưỡng bức ở DB test bị verifier phát hiện từ marker/count/digest, không kết luận legacy |
| Quantity đổi sang số dương khác | Runtime update bị chặn; verifier phát hiện digest mismatch khi inject corruption |
| Thêm row/thay ingredient hoặc order | Guard reject sau seal; verifier count/digest/domain phát hiện corruption |
| Marker/version/count/digest thiếu, sai hoặc version lạ | Fail-closed; không restore hoặc tự repair; kể cả sửa cả rows+manifest bằng runtime role phải bị guard/permissions chặn |
| Legacy cohort hợp lệ / NULL unknown / old writer sau cutover | Legacy theo D-05; unknown không fallback; new old-writer Create bị chặn |
| Recipe thay đổi sau tạo Order | Snapshot/digest giữ nguyên, release dùng lượng đã reserve |
| Crash/lỗi trước seal hoặc sau một phần stock/Coupon write | Không commit partial Order/reservation/manifest; batch construction commit chỉ khi đã seal đầy đủ |
| Release lặp hoặc đồng thời, scheduler/lazy/payment races | Chỉ một stock release; PAID never restored; duplicate không tăng stock |
| Integrity failure trong release / lỗi giữa nhiều Ingredient updates | Rollback stock, Order status, Coupon và released_at; không partial changes |
| Reset/đổi released_at, sửa identity/base unit, bypass qua runtime permissions | Reject đúng boundary; test role có owner privilege không được dùng để chứng minh runtime protection |

**Dependency/gate:** Không bật ingredient reserve/release trước khi persistence,
guards, verifier, atomic transaction và các tests liên quan được implement,
chạy PostgreSQL thật và review theo gates SCRUM-123/124/126. Scope merge core trước
và defer 123 đã chốt; A/B cùng nullability/backfill/permissions vẫn cần design
review trong task thực thi. Không coi quyết định scope là PASS của persistence,
formal PR approval, CI PASS hoặc merge; không tự resolve/đánh dấu Done.

## 9. PR nháp và danh sách đề nghị commit

Title: `feat(SCRUM-121): add ingredient inventory schema and additive migration`

Body cập nhật đề xuất cho PR #38 (base dev, reviewer Khang; chưa đăng):

> Bổ sung Ingredient, RecipeIngredient, ToppingIngredient và
> OrderIngredientReservation theo D-01…D-08; giữ Product.stock và mọi nghiệp vụ
> Order/Payment/Coupon/Loyalty hiện tại. Dùng canonical-unit Int, unique aggregate,
> FK Restrict/Update Cascade và CHECK trong SQL migrations.
>
> Temporal review fix dùng migration tiếp theo
> `20261117130000_scrum121_reservation_release_time`, ADD CHECK
> `(released_at IS NULL OR released_at >= created_at)`; giữ nguyên migration core
> đã commit/push/apply. Không backfill/seed/cutover/reset/resolve hoặc sửa timestamps.
>
> Provenance fix: source snapshot truy xuất được từ commit nền 4e9f1f0 + exact
> changed/new files, manifest 191 inputs, raw SHA-256 và canonical-LF hash tách riêng;
> schema mismatch cũ là EOL, không thay nội dung. Snapshot gồm all migrations,
> config/package/lock/source/tests, không .env/dependencies/generated/user data.
> API tests chạy từ materialized source, raw source workspace/snapshot trước–sau
> không đổi. Verifier độc lập phát hiện content drift/file mới và phân biệt EOL.
>
> Evidence mới do runner sinh 14:06:27–14:07:39 UTC ngày 2026-11-17, HEAD 4e9f1f0
> + working snapshot; legacy baseline 3a183d67, core baseline 57fa0486 riêng. 19
> commands exit 0: clean 12 migrations, upgrade 10→12/11→12, status/redeploy,
> preservation/history/checksums/catalog PASS; 53 negative + 6 temporal positive
> assertions mỗi DB, validate/generate/build/Client roundtrip PASS. Unit 479 passed/
> 6 skipped; baseline runtime 103 passed/10 skipped. Snapshot/verifier/history và
> command timestamps/exit codes xem §6.3, không tính skipped là PASS.
>
> Chi tiết thiết kế snapshot-integrity §8.1 vẫn là **đề xuất**: marker + version/count/digest
> tại Order, canonicalization xác định, atomic seal/verify, legacy classification,
> immutable guards/permissions và acceptance tests; chưa thêm fields/triggers vào
> schema. 121 core/temporal/handoff; persistence đã deferred sang SCRUM-123;
> 124 verify/exact one-time release, phối hợp 126 concurrency/corruption. Leader
> Ryannguyxn đã cho phép merge core trước/defer persistence sang SCRUM-123 tại
> comment 6949554030 lúc 2026-11-17 13:33:54 UTC. Chi tiết thiết kế vẫn đề xuất;
> SCRUM-123/124/126 phải hoàn thành implementation/test gates trước ingredient-backed
> Orders. Không coi scope decision là formal PR approval/CI PASS/đã merge.
>
> Giới hạn: seed, ingredient reserve/release/concurrency, availability, restore và
> real VNPay Sandbox/full E2E/Production chưa kiểm chứng bởi revision này. Required
> remote CI/review/merge còn pending; không đổi Payment/VNPay/Product.stock, không
> deploy hoặc tự đánh dấu Done. Source rehearsal là 4e9f1f0 + exact working
> snapshot; commit bàn giao provenance/evidence là 05385eb. Revision hiện tại
> chỉ sửa metadata documentation, không đổi source/evidence hoặc chạy lại rehearsal.

Files của revision provenance đã bàn giao tại 05385eb (danh sách lịch sử):

1. `.gitattributes` — giữ exact bytes cho hai artifact, không normalize repository.
2. `apps/api/test/ingredient-schema.rehearsal.mjs`
3. `apps/api/test/ingredient-source.provenance.mjs`
4. `docs/ingredient-inventory/05_SCRUM-121_Schema_Migration.md`
5. `docs/ingredient-inventory/SCRUM-121-evidence.json`
6. `docs/ingredient-inventory/SCRUM-121-source-snapshot.json`
7. `docs/ingredient-inventory/SCRUM-121-evidence.history.json`
8. `docs/ingredient-inventory/README.md`

Revision metadata hiện tại chỉ sửa tài liệu 05 này và README index; không có
thay đổi executable inputs, evidence JSON/source snapshot/history hoặc hashes.

DoD còn pending: formal review/approval, required CI cho source revision mới và
merge dev. Scope core/defer đã được Leader chốt; persistence/implementation/tests
SCRUM-123/124/126 còn pending trước enable. Không tự stage/commit/push/sửa PR/
đăng comment/merge, không gửi thông báo hoặc đóng Jira.

Snapshot review temporal lịch sử ngày 2026-11-17 (trước commit 4e9f1f0): HEAD `57fa0486…`, PR #38 base
dev `3a183d67…`. Chỉ sáu file trong danh sách trên thay đổi; migration lịch sử
nguyên vẹn. Đã đọc lại schema, SQL mới, runner và tài liệu/evidence. Follow-up chỉ
thêm CHECK trên reservation, không UPDATE dữ liệu hoặc ALTER cột legacy.
`git diff --check` PASS; file mới kiểm tra bằng `git diff --no-index --check -- NUL
<path>` không có whitespace errors (Git chỉ cảnh báo autocrlf). Không có staged
files, conflict markers hoặc secret patterns trong phạm vi thay đổi. Đây là
self-review local, không thay thế review/approval của Khang hoặc required CI.

## 10. Phản hồi review provenance/metadata dự thảo — chưa đăng hoặc resolve

**Cho comment 6949549474 — provenance:**

> Đã xác minh schema raw hash 6979d0c5… khớp bytes checkout CRLF; canonical-LF
> 618eee52… khớp Git blob 4e9f1f0. Migrations và runner cũ khớp; không sửa hash
> lịch sử. headAtRun 57fa048 + working diff không tự là lỗi test, nhưng thiếu
> source bundle bàn giao đã được khắc phục. Runner mới tạo source snapshot từ
> commit nền 4e9f1f0 + exact changed/new files, raw/canonical manifest 191 inputs;
> materialize chạy tests và reject source drift trước/sau. Evidence mới §6.3,
> SCRUM-121-evidence.json và SCRUM-121-source-snapshot.json: 19 commands exit 0,
> ba đường migration/preservation/constraints/build/Client PASS; unit 479/6 skipped,
> baseline runtime 103/10 skipped. Evidence cũ giữ byte-for-byte trong history.
> Reviewer chạy từ apps/api: `node test/ingredient-source.provenance.mjs --verify
> ../../docs/ingredient-inventory/SCRUM-121-evidence.json` (không truy cập DB).
> Source rehearsal giữ nguyên 4e9f1f0 + exact snapshot; provenance/evidence đã được
> bàn giao tại commit 05385eb. Đoạn phản hồi này được cập nhật metadata, không đổi
> kết quả/hash của lần chạy hoặc tự resolve comment.

**Cho comment 6949554030 — metadata và quyết định Leader:**

> Metadata phân biệt source rehearsal 4e9f1f0 + exact snapshot với commit bàn giao
> provenance/evidence 05385eb; revision hiện tại chỉ sửa metadata tài liệu.
> Các SHA/ngày/evidence của run lịch sử và core baseline 57fa048 được giữ có nhãn.
> Đã ghi nhận quyết định của Ryannguyxn tại chính comment này, created/updated
> 2026-11-17T13:33:54Z: core schema được phép merge trước; persistence deferred
> sang SCRUM-123; SCRUM-123/124/126 phải hoàn thành implementation/test gates trước
> ingredient-backed Orders. Không hỏi lại hai phương án cũ. Chi tiết §8.1 vẫn là
> thiết kế đề xuất, chưa implement/PASS; scope decision không thay formal approval,
> required CI hoặc merge. Báo cáo/index và PR body draft đã đồng bộ; chưa tự đăng
> comment, sửa PR hoặc resolve thread.

**Cho comment 6951340446 — metadata sau bàn giao provenance:**

> Đã sửa báo cáo và README để phân biệt Source rehearsal: 4e9f1f0 + exact working
> snapshot với Commit bàn giao provenance/evidence: 05385eb65922efe302a16f9dfb53f0d5c440f595.
> Các trạng thái local của lượt chạy cũ được gắn nhãn lịch sử; không hardcode SHA
> commit documentation tương lai dưới nhãn PR HEAD hiện tại. Đã bỏ câu defer có
> điều kiện: persistence deferred sang SCRUM-123, gates 123/124/126 phải hoàn tất
> trước ingredient-backed Orders. Giữ nguyên evidence/headAtRun/hashes và executable
> inputs. Provenance verifier không truy cập DB và git diff --check PASS; không
> chạy lại tests/rehearsal. Revision này chỉ documentation, chưa tự đăng/resolve.
