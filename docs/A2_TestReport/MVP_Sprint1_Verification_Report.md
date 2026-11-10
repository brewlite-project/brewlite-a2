# Báo cáo Kiểm chứng MVP Sprint 1 — Menu & Mobile-first UI (`SCRUM-112` / `A2-T4.3`)

- **Mã công việc:** `SCRUM-112` / `A2-T4.3`
- **Tên công việc:** Kiểm chứng MVP Sprint 1 — Menu & Mobile-first UI
- **Branch kiểm chứng:** `SCRUM-112-a-2-t-4-3-kiem-chung-mvp-sprint-1-menu-mobile-first-ui`
- **Base branch:** `dev` (`34cbbc0`)
- **Nguồn đối chiếu (Source of Truth):**
  1. `docs/a1-archive/api/BrewLite_API_Contract_v4.0.md` & `docs/a1-archive/api/BrewLite_API_Contract_v3.0.md` (Phụ lục A v2.1)
  2. SRS (`docs/requirements/srs.md`) & `docs/TRACEABILITY.md`
  3. `docs/planning/A2_Implementation_Plan.md` & `docs/planning/A2_Gap_Analysis.md`
  4. `apps/api/prisma/schema.prisma` & `apps/api/prisma/seed.ts`

---

## 1. Tóm tắt Kết quả Build & Test Hiện tại (Baseline)

| Khu vực | Lệnh thực thi | Kết quả | Chi tiết |
| :--- | :--- | :---: | :--- |
| **Backend (`apps/api`)** | `npm run lint` | **PASS** | 0 errors, 1 warning (ở file test VNPay) |
| **Backend (`apps/api`)** | `npm run test:unit` | **PASS** | **34** test files, **325/325** tests passed (trong đó Product Catalog có 25 unit/HTTP tests) |
| **Backend (`apps/api`)** | `npm run test:e2e -- test/products.e2e-spec.ts` | **PASS** | **11/11** E2E tests cho `GET /products` & `GET /products/:id` passed |
| **Backend (`apps/api`)** | `npm run build` | **PASS** | NestJS build thành công |
| **Frontend (`apps/web`)** | `npm run lint` | **PASS** | 0 errors, 23 warnings (unused vars & `<img>`) |
| **Frontend (`apps/web`)** | `npm run test:unit` | **PASS** | **37** suites, **166/166** tests passed (nhưng **chưa có** test suite riêng cho Menu & Product Detail Sprint 1) |
| **Frontend (`apps/web`)** | `npm run build` | **PASS** | Next.js 16.3.8 production build thành công (`/`, `/products/[id]`, `/api/backend/[[...path]]`, v.v.) |

---

## 2. Những hạng mục ĐÃ ĐẠT (PASS)

### 2.1. Backend API `GET /products` & `GET /products/:id` (`apps/api`)
- **Endpoint `GET /products`** (`apps/api/src/products/products.controller.ts`, `apps/api/src/products/products.service.ts`):
  - **PASS — Public & Response Shape:** Không yêu cầu JWT, trả `200 OK` với `{ items: ProductItemDto[] }` đúng chuẩn API Contract v2.1. Khi DB rỗng trả `{ items: [] }` (không trả `404`).
  - **PASS — Thứ tự sắp xếp (Sorting):** Sắp xếp ổn định theo `name ASC`, tie-breaker `id ASC`.
  - **PASS — Quy tắc `isAvailable`:** Tính toán chính xác `product.stock > 0 && product.category.isActive`. Sản phẩm thuộc danh mục `isActive = false` vẫn xuất hiện trong danh sách nhưng có `isAvailable: false`.
  - **PASS — Bảo mật & An toàn dữ liệu:** Không làm lộ `stock`, `createdAt` hoặc chi tiết lỗi Prisma/DB. Chuyển đổi `BigInt -> number` cho `basePriceVnd` có kiểm tra giới hạn `0 .. Number.MAX_SAFE_INTEGER`.
- **Endpoint `GET /products/:id`** (`apps/api/src/products/products.controller.ts`, `apps/api/src/products/products.service.ts`):
  - **PASS — Validate UUID (`400 Bad Request`):** Dùng `ParseUUIDPipe` chặn ngay tại tầng Controller trước khi gọi DB, trả đúng `{ statusCode: 400, message: "Validation failed (uuid is expected)", error: "Bad Request" }`.
  - **PASS — Xử lý `404 Not Found` & `500 Internal Server Error`:** Trả `404` khi UUID hợp lệ nhưng không tồn tại; ẩn chi tiết lỗi nội bộ khi DB gặp sự cố (`500`).
  - **PASS — Size Options & Toppings:**
    - `sizeMode = STANDARD` trả đủ 3 size `S (100)`, `M (120)`, `L (140)`.
    - `sizeMode = ONE_SIZE` trả duy nhất `ONE_SIZE (100)`.
    - Chỉ trả các topping được liên kết qua bảng `ProductTopping` có `topping.isAvailable = true`, sắp xếp theo `toppingId ASC`.
- **Unit Test & E2E Test Backend:**
  - Đã có đầy đủ 36 test cases tại `apps/api/src/products/products.service.spec.ts`, `apps/api/src/products/products.http.spec.ts`, `apps/api/src/products/products.controller.spec.ts`, và `apps/api/test/products.e2e-spec.ts`.

### 2.2. Frontend Product Listing, Product Detail & States (`apps/web`)
- **Product Listing (`/`):**
  - **PASS — Kết nối dữ liệu thật & Proxy:** Gọi `GET /products` qua same-origin proxy `/api/backend/[[...path]]`, bảo toàn thứ tự `name ASC, id ASC` qua `sortProductsByContract`.
  - **PASS — Hiển thị `ProductCard`:** Hiển thị đúng tên, danh mục, giá `basePriceVnd` định dạng VND, huy hiệu `Best Seller` (`isBestseller`) / `Mới` (`isNew`), không tự bịa `rating` khi `rating === null`, xử lý ảnh lỗi (`onError` chuyển về `/images/product-placeholder.svg`), phủ lớp `"Hết hàng"` khi `isAvailable === false` nhưng vẫn cho phép bấm vào xem chi tiết `/products/:id`.
  - **PASS — Bộ lọc & Tìm kiếm client-side:** Lọc theo danh mục (`category.slug`), tìm kiếm từ khóa (bỏ dấu tiếng Việt), lọc khoảng giá và sắp xếp hoạt động đúng trên tập dữ liệu.
- **Trạng thái `loading`, `empty`, `error`:**
  - **PASS — Menu Loading State:** Có `apps/web/app/loading.tsx` và `ProductSkeletonGrid` (8 thẻ shimmer + banner `role="status"`).
  - **PASS — Menu Empty State:** `ProductEmptyState` (`data-testid="product-empty-state"`) hiển thị khi `items: []`, có nút tải lại danh mục; phân biệt rõ với trạng thái lọc/tìm kiếm không khớp kết quả.
  - **PASS — Menu Error State:** `ProductErrorState` (`role="alert"`, `data-testid="product-error-state"`) hiển thị mã lỗi HTTP thực tế và nút `"Thử lại ngay"`. Không âm thầm nuốt lỗi thành danh sách rỗng nếu payload sai định dạng.
  - **PASS — Product Detail States (`/products/[id]`):** Có trạng thái đang tải (`data-testid="product-detail-loading"`) và trạng thái lỗi (`data-testid="product-detail-error"`) phân biệt rõ 3 trường hợp: `400` (*"Mã sản phẩm không hợp lệ"*), `404` (*"Không tìm thấy sản phẩm"*), và `500`/Network (*"Lỗi kết nối máy chủ"* kèm nút `"Thử lại"`).
- **Product Detail Modal (`ProductDetailModal.tsx`):**
  - **PASS — Ràng buộc nghiệp vụ:** Mặc định chọn size `S` (với `STANDARD`) hoặc `ONE_SIZE` (với `ONE_SIZE`); giới hạn tối đa 3 loại topping (`MAX_TOPPINGS_PER_ITEM = 3`); số lượng từ `1..10`; ghi chú tối đa `100` ký tự; vô hiệu hóa toàn bộ nút chọn & nút thêm vào giỏ (*"Sản phẩm tạm hết hàng"*) khi `isAvailable === false`.

### 2.3. Tương thích Monorepo (`apps/web` & `apps/api`)
- **PASS — Cấu trúc chính:** CI workflow (`.github/workflows/ci.yml`), `docker-compose.yml`, `apps/api/Dockerfile`, `apps/web/Dockerfile`, `scripts/scrum92/verify_compose_e2e.mjs`, và bộ 9 ảnh sản phẩm trong `apps/web/public/images/` đều đã khớp với cấu trúc `apps/api` và `apps/web`.

---

## 3. Những điểm CẦN SỬA CHỮA / ĐIỀU CHỈNH (Needs Fixing)

### 3.1. [Major] Lệch công thức làm tròn giá theo Size giữa Frontend và Backend / SRS FR-11 / API Contract v4.0
- **Vị trí file:**
  - `apps/web/services/api.service.ts` (dòng 70–75: `calculateSizePriceVnd`)
  - `apps/web/context/CartContext.tsx` (dòng 291–294: `syncCartPrices`)
- **Chuyện gì đang xảy ra:**
  - Tại Frontend, hàm `calculateSizePriceVnd` đang dùng công thức làm tròn xuống (`Math.floor`):
    ```ts
    return Math.floor((basePriceVnd * multiplierPercent) / 100);
    ```
  - Trong khi đó, comment ngay tại `ProductDetailModal.tsx` dòng 121, tài liệu SRS (`FR-11`, `AC-A2-011`, `NFR-12`), `BrewLite_API_Contract_v4.0.md` §14.1 (`PR-01` / `BL-DEC-PRICING-001`) và Backend `apps/api/src/orders/cart-pricing.ts` dòng 99 đều quy định bắt buộc dùng `round_half_up`:
    ```ts
    Math.floor((basePriceVnd * multiplierPercent + 50) / 100)
    ```
- **Tại sao quan trọng & Rủi ro:**
  - Dù dữ liệu seed hiện tại có giá chẵn nghìn đồng (nên `floor` và `round_half_up` cho kết quả trùng nhau ở 100%, 120%, 140%), nhưng với bất kỳ đơn giá lẻ nào (hoặc khi chạy bộ test kiểm chứng `AC-A2-011` / `FR-11`), giá tạm tính trên Product Detail / Giỏ hàng ở Frontend sẽ bị lệch `1 VND` so với giá thực tế mà Backend tính khi tạo Order.
- **Hành động khắc phục cụ thể:**
  - Cập nhật `calculateSizePriceVnd` trong `apps/web/services/api.service.ts` và công thức tính `sizePrice` trong `apps/web/context/CartContext.tsx` sang `Math.floor((basePriceVnd * multiplierPercent + 50) / 100)`.

---

### 3.2. [Major] Thiếu bộ Unit Test Frontend cho Menu & Product Detail (Sprint 1)
- **Vị trí file:**
  - Thư mục `apps/web/tests/` và script `test:unit` trong `apps/web/package.json`.
- **Chuyện gì đang xảy ra:**
  - Hiện tại `apps/web/tests/` có 6 file test (`checkout-flow.test.ts`, `payment-ui.test.ts`, `order-history.test.ts`, `order-confirmation.test.ts`, `vnpay-ui-flow.test.ts`, `payment-confirmation-flow.test.ts`) nhưng tất cả đều kiểm thử luồng Sprint 2 & Sprint 3 (Checkout, Order, Payment).
  - **Chưa có file unit test nào** kiểm chứng luồng Sprint 1 trên Frontend: Product Listing (`ProductCard`, `ProductEmptyState`, `ProductErrorState`, `ProductSkeletonGrid`, `CategoryFilterBar`), Product Detail (`ProductDetailModal` với `STANDARD` vs `ONE_SIZE`, giới hạn 3 topping, số lượng `1..10`, ghi chú `100` ký tự, trạng thái `isAvailable: false`, lỗi `400/404/500`), và các hàm tính giá/sắp xếp trong `api.service.ts`.
- **Tại sao quan trọng & Rủi ro:**
  - Yêu cầu trực tiếp của task `SCRUM-112` là *"Bổ sung hoặc cập nhật các unit test cần thiết"* và *"Loading, empty, error states được kiểm chứng"*, đồng thời được nêu trong `docs/planning/A2_Gap_Analysis.md` mục 4.
- **Hành động khắc phục cụ thể:**
  - Tạo mới file test `apps/web/tests/menu-product-detail.test.ts` và đăng ký vào script `test` / `test:unit` trong `apps/web/package.json` để kiểm thử toàn diện:
    1. Các hàm `calculateSizePriceVnd` (kể cả biên `round_half_up`), `calculateUnitPriceVnd`, `calculateLineTotalVnd`, `sortProductsByContract`.
    2. `getProducts` & `fetchProductDetailById` (mapping API `200`, xử lý lỗi `400`, `404`, `500`, chống payload sai cấu trúc).
    3. Render DOM cho `ProductCard` (còn hàng, hết hàng, badge, không bịa rating), `ProductSkeletonGrid` (loading), `ProductEmptyState` (empty), `ProductErrorState` (error).
    4. Render & tương tác trên `ProductDetailModal` (`STANDARD` vs `ONE_SIZE`, chọn tối đa 3 topping, tăng/giảm số lượng `1..10`, khóa nút khi `isAvailable = false`).

---

### 3.3. [Major] Giao diện Mobile-first bị hẹp ngang / tràn bố cục trên màn hình nhỏ (`320px` – `375px`)
- **Vị trí file:**
  1. `apps/web/app/page.tsx` (dòng 267, 300)
  2. `apps/web/components/HeroBanner.tsx` (dòng 14, 26, 48)
  3. `apps/web/components/CategoryFilterBar.tsx` (dòng 40, 62)
  4. `apps/web/components/Footer.tsx` (dòng 14)
  5. `apps/web/app/products/[id]/page.tsx` (dòng 147)
  6. `apps/web/components/ProductDetailModal.tsx` (dòng 301, 339, 677)
- **Chuyện gì đang xảy ra:**
  1. **Padding ngang `px-margin` cố định `3rem` (`48px` mỗi bên) trên mobile:** Trong `globals.css` dòng 55, `--spacing-margin` được đặt cứng là `3rem` (`48px`). Trong khi `Header.tsx` đã dùng `px-3 sm:px-6 lg:px-margin`, thì `app/page.tsx`, `HeroBanner.tsx`, `CategoryFilterBar.tsx`, `Footer.tsx`, và `app/products/[id]/page.tsx` lại dùng thẳng `px-margin` cho mọi kích thước màn hình. Trên màn hình mobile `320px` – `375px`, riêng lề hai bên đã chiếm mất `96px`, chỉ còn `224px` – `279px` cho nội dung.
  2. **Thanh bộ lọc `CategoryFilterBar.tsx` bị tràn ngang trên mobile:** Tại dòng 62, khối chứa 2 ô `<select>` (*"Sắp xếp"* và *"Khoảng giá"*) dùng `flex items-center gap-space-sm ml-auto` mà **không có `flex-wrap`** và `w-full lg:w-auto`. Khi hiển thị trên màn hình `320px` – `375px`, 2 hộp chọn này nằm ép trên cùng 1 hàng gây tràn chiều ngang.
  3. **Chữ tiêu đề `HeroBanner.tsx` quá lớn trên mobile:** Dòng 26 dùng trực tiếp `text-display-lg` (`48px`, line-height `56px`) và dòng 48 dùng `text-headline-xl` (`36px`) không có responsive prefix (`text-2xl sm:text-4xl lg:text-display-lg`), làm chữ bị ngắt dòng vụn và chiếm hết chiều dọc màn hình điện thoại.
  4. **Nút dưới cùng và huy hiệu trong `ProductDetailModal.tsx`:**
     - Dòng 677: Hàng chứa cụm tăng/giảm số lượng và nút `"Thêm vào giỏ hàng • 65.000 ₫"` dùng `flex items-center justify-between gap-3` trên màn hình `320px` dễ bị ép chữ; nên hỗ trợ `flex-col sm:flex-row` hoặc co giãn linh hoạt trên màn hình siêu nhỏ.
     - Dòng 339: Kiểm tra `product.badge` thay vì `product.isBestseller` / `product.isNew` từ API `GET /products/:id`, khiến các sản phẩm thật từ Backend không hiển thị huy hiệu `Best Seller` / `Mới` bên trong Modal chi tiết.
- **Tại sao quan trọng & Rủi ro:**
  - Vi phạm trực tiếp Acceptance Criteria: *"Giao diện mobile không tràn bố cục hoặc mất chức năng quan trọng"*.
- **Hành động khắc phục cụ thể:**
  - Chuyển `px-margin` trên các container sang responsive mobile-first: `px-4 sm:px-6 lg:px-margin`.
  - Thêm `flex-wrap w-full lg:w-auto` cho cụm bộ lọc Sort / Khoảng giá trong `CategoryFilterBar.tsx`.
  - Điều chỉnh cỡ chữ responsive cho `HeroBanner.tsx` (`text-2xl sm:text-4xl lg:text-display-lg`).
  - Sửa hiển thị badge trong `ProductDetailModal.tsx` dựa trên `product.isBestseller` / `product.isNew` (kèm fallback `product.badge`) và tối ưu bố cục thanh CTA dưới cùng trên màn hình hẹp.

---

### 3.4. [Major] Sót đường dẫn `backend/` cũ sau khi chuyển sang `apps/api` và `apps/web`
- **Vị trí file:**
  1. `scripts/scrum80/run_db_checks.mjs` (dòng 36)
  2. `scripts/scrum80/bootstrap_default_db.mjs` (dòng 10)
  3. `scripts/scrum80/run_phase1_upgrade.mjs` (dòng 12)
  4. `README.md` (dòng 205)
- **Chuyện gì đang xảy ra:**
  - Ba script kiểm tra DB trong `scripts/scrum80/` vẫn đang nối đường dẫn cứng tới `path.join(root, 'backend', ...)` thay vì `path.join(root, 'apps', 'api', ...)`. Nếu chạy các script này sẽ báo lỗi `ENOENT: no such file or directory` ngay lập tức vì thư mục `backend/` đã được chuyển thành `apps/api/`.
  - Trong `README.md` dòng 205 (mục 8: Cấu hình backend), hướng dẫn lệnh vẫn ghi `cd backend` thay vì `cd apps/api`.
- **Tại sao quan trọng & Rủi ro:**
  - Nằm trong hạng mục công việc: *"Kiểm tra tương thích sau khi chuyển sang `apps/web` và `apps/api`"* và Acceptance Criteria: *"Không phát sinh regression sau migration"*.
- **Hành động khắc phục cụ thể:**
  - Cập nhật đường dẫn từ `'backend'` sang `path.join(root, 'apps', 'api')` trong 3 file thuộc `scripts/scrum80/` và sửa `cd backend` thành `cd apps/api` tại dòng 205 của `README.md`.

---

### 3.5. [Minor] Dữ liệu `MOCK_PRODUCTS` / `MOCK_PRODUCT_DETAILS` chưa đồng bộ ID với 9 sản phẩm trong `seed.ts`
- **Vị trí file:**
  - `apps/web/mock-data/products.mock.ts` (dòng 1–132)
  - `apps/web/services/api.service.ts` (dòng 362)
- **Chuyện gì đang xảy ra:**
  - `apps/api/prisma/seed.ts` tạo 9 sản phẩm với UUID `a3000000-0000-4000-8000-000000000001` .. `0009` và ảnh `/images/ca-phe-sua-da.jpg`...
  - Trong khi đó, `apps/web/mock-data/products.mock.ts` vẫn giữ 8 sản phẩm cũ từ giai đoạn đầu (`a1000000-...0001` .. `0008`). Khi `fetchProductDetailById` tra cứu `MOCK_PRODUCT_DETAILS[apiData.id]` để bổ sung ghi chú hương vị (`flavorNotes`) hoặc khi trang `/products/[id]` hiển thị lưới nền mờ ban đầu từ `getCatalogData()`, dữ liệu mock không khớp với 9 sản phẩm thật của DB.
- **Hành động khắc phục cụ thể:**
  - Đồng bộ danh sách trong `apps/web/mock-data/products.mock.ts` khớp với 9 sản phẩm chuẩn của `apps/api/prisma/seed.ts`.
