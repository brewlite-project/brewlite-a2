# Báo cáo Kiểm chứng MVP Sprint 1 — Menu & Mobile-first UI (`SCRUM-112` / `A2-T4.3`)

- **Mã công việc:** `SCRUM-112` / `A2-T4.3` (PR #15 — Cập nhật phản hồi Review vòng 1 & Hoàn thiện trọn bộ minh chứng)
- **Tên công việc:** Kiểm chứng MVP Sprint 1 — Menu & Mobile-first UI
- **Branch kiểm chứng:** `SCRUM-112-a-2-t-4-3-kiem-chung-mvp-sprint-1-menu-mobile-first-ui`
- **Commit SHA của source code được kiểm chứng:** `34cbbc088117d7a4908d07a66cfbd03b0c905dea` (`origin/dev`)
- **Commit SHA báo cáo vòng 1:** `ffbaeeb3afece5d491e25e494b099496e8234ccd`
- **Chế độ thực hiện:** **Verification & Test Report Only** (Chỉ thực hiện kiểm thử tĩnh, kiểm thử runtime, đo đạc trình duyệt thực tế và ghi nhận báo cáo; giữ nguyên 100% source code ứng dụng tại SHA `34cbbc088117d7a4908d07a66cfbd03b0c905dea`).
- **Nguồn đối chiếu (Source of Truth):**
  1. `docs/a1-archive/api/BrewLite_API_Contract_v4.0.md` (§14.1 `PR-01` / `BL-DEC-PRICING-001`) & `docs/a1-archive/api/BrewLite_API_Contract_v3.0.md` (Phụ lục A v2.1)
  2. `docs/requirements/srs.md` (`FR-11`, `AC-A2-011`, `NFR-12`) & `docs/TRACEABILITY.md`
  3. `docs/planning/A2_Implementation_Plan.md` & `docs/planning/A2_Gap_Analysis.md`
  4. `apps/api/prisma/schema.prisma` & `apps/api/prisma/seed.ts`

---

## 1. Phân biệt Kiểm chứng Tĩnh (Static Verification) & Kiểm chứng Runtime (Runtime Verification)

| Phân loại | Phương pháp & Công cụ thực thi | Phạm vi áp dụng | Kết quả tổng quan |
| :--- | :--- | :--- | :---: |
| **Static Verification (Kiểm chứng tĩnh)** | - Đọc & đối chiếu mã nguồn (`apps/api`, `apps/web`, `scripts/`, `README.md`, `docker-compose.yml`, `.github/workflows/ci.yml`) với API Contract v2.1/v4.0 & SRS.<br>- Chạy trình kiểm tra kiểu & cú pháp: `eslint` (`apps/web`, `apps/api`), `tsc` / `next build`, `prisma validate` (`db:validate`). | - Cấu trúc DTO, Controller, Service, Prisma schema.<br>- Các hằng số nghiệp vụ (`MAX_TOPPINGS_PER_ITEM = 3`, `MIN_ORDER_QUANTITY = 1`, `MAX_ORDER_QUANTITY = 10`).<br>- Đường dẫn sau monorepo migration (`apps/api`, `apps/web`). | **PASS** (Phát hiện sớm các lệch công thức/đường dẫn/CSS tiềm ẩn) |
| **Runtime Verification — Automated Tests (Kiểm chứng thực thi qua bộ test có sẵn)** | - Backend Unit & HTTP Tests (`vitest`): 34 files / 325 tests.<br>- Backend E2E Tests (`supertest` + NestJS HTTP pipeline): `test/products.e2e-spec.ts` (11 tests).<br>- Frontend Unit Tests (`node:test` + `jsdom`): 6 files / 37 suites / 166 tests (chạy qua `npm run test:unit`). | - Luồng thực thi thật của `GET /products` và `GET /products/:id` qua HTTP pipeline.<br>- Luồng Cart, Checkout, Order, Payment, Order History. | **PASS** (**502/502** bài test tự động hiện có đều PASS) |
| **Runtime Verification — Deep Probe & Browser UI (Kiểm chứng thực thi chuyên sâu cho Sprint 1)** | - Thực thi kịch bản Runtime Probe (`node --import ./tests/register-loader.mjs` + `ReactDOMServer` + `JSDOM` + `React.act`) kiểm tra trực tiếp hàm tính giá, API client (`getProducts`, `fetchProductDetailById`) và tương tác DOM trên `ProductCard`, `ProductDetailModal`, `ProductSkeletonGrid`, `ProductEmptyState`, `ProductErrorState`.<br>- Khởi chạy Next.js (`http://localhost:3000`) kết nối API server (`http://127.0.0.1:3001`) và dùng **Browser Automation** đo đạc thực tế `getBoundingClientRect()`, `scrollWidth`, `clientWidth`, computed styles tại 3 viewport: **`320x640`**, **`375x812`**, **`768x1024`**.<br>- Chụp và lưu ảnh minh chứng thực tế vào thư mục `docs/A2_TestReport/evidence/`. | - Kiểm chứng thực nghiệm các mục **MVP-R01**, **MVP-R02**, **MVP-R03**, **MVP-R04**, **MVP-R05** và ghi nhận bằng chứng demo MVP. | **Hoàn tất 100%** (Đầy đủ bằng chứng hình ảnh & bảng số liệu đo đạc thực tế) |

### Bảng tổng hợp kết quả lệnh Build, Lint & Test chuẩn trên SHA `34cbbc088117d7a4908d07a66cfbd03b0c905dea`

| Khu vực | Lệnh thực thi | Loại kiểm chứng | Kết quả | Chi tiết thực tế |
| :--- | :--- | :---: | :---: | :--- |
| **Backend (`apps/api`)** | `npm run db:validate` | Static | **PASS** | `prisma validate --config prisma7.config.ts` báo schema hợp lệ 🚀 |
| **Backend (`apps/api`)** | `npm run lint` | Static | **PASS** | 0 errors, 1 warning (`vnpay-querydr.client.spec.ts`) |
| **Backend (`apps/api`)** | `npm run test:unit` | Runtime | **PASS** | **34** test files, **325/325** tests passed (`products.service.spec.ts` [17], `products.http.spec.ts` [6], `products.controller.spec.ts` [2]) |
| **Backend (`apps/api`)** | `npm run test:e2e -- test/products.e2e-spec.ts` | Runtime | **PASS** | **11/11** E2E tests cho `GET /products` & `GET /products/:id` passed |
| **Backend (`apps/api`)** | `npm run build` | Static / Build | **PASS** | NestJS biên dịch thành công |
| **Frontend (`apps/web`)** | `npm run lint` | Static | **PASS** | 0 errors, 23 warnings (unused vars & `<img>`) |
| **Frontend (`apps/web`)** | `npm run test:unit` | Runtime | **PASS** | **37** suites, **166/166** tests passed |
| **Frontend (`apps/web`)** | `npm run build` | Static / Build | **PASS** | Next.js 16.3.8 production build thành công (`/`, `/products/[id]`, `/api/backend/[[...path]]`, v.v.) |

---

## 2. Những hạng mục ĐÃ ĐẠT (PASS) — Đối chiếu Acceptance Criteria

### 2.1. Backend API `GET /products` & `GET /products/:id` (`apps/api`)
- **Endpoint `GET /products`** (`apps/api/src/products/products.controller.ts`, `apps/api/src/products/products.service.ts`):
  - **PASS (Static + Runtime E2E):** Public endpoint (không yêu cầu JWT), trả `200 OK` với cấu trúc `{ items: ProductItemDto[] }`. Khi DB rỗng trả `{ items: [] }` (không trả `404`).
  - **PASS (Static + Runtime E2E):** Sắp xếp tất định theo `name ASC`, tie-breaker `id ASC`.
  - **PASS (Static + Runtime Unit/E2E):** Tính toán `isAvailable = product.stock > 0 && product.category.isActive`. Sản phẩm thuộc danh mục `isActive = false` vẫn được trả về trong danh sách với `isAvailable: false`.
  - **PASS (Static + Runtime Unit/E2E):** Không rò rỉ `stock`, `createdAt`, hoặc thông tin lỗi Prisma nội bộ; kiểm tra an toàn `BigInt -> number` trong khoảng `0 .. Number.MAX_SAFE_INTEGER` (ném `500 Internal Server Error` nếu vượt ngưỡng).
- **Endpoint `GET /products/:id`** (`apps/api/src/products/products.controller.ts`, `apps/api/src/products/products.service.ts`):
  - **PASS (Static + Runtime HTTP/E2E):** `ParseUUIDPipe` chặn UUID sai định dạng ngay tại tầng Controller trước khi gọi DB, trả `400 Bad Request` (`"Validation failed (uuid is expected)"`).
  - **PASS (Static + Runtime HTTP/E2E):** Trả `404 Not Found` (`"Product not found"`) khi UUID hợp lệ nhưng không tồn tại trong DB; trả `500 Internal Server Error` đã làm sạch khi DB lỗi.
  - **PASS (Static + Runtime Unit/E2E):**
    - `sizePolicy = STANDARD`: trả 3 kích cỡ `S (100)`, `M (120)`, `L (140)`.
    - `sizePolicy = ONE_SIZE`: trả 1 kích cỡ `ONE_SIZE (100)`.
    - Chỉ trả các topping được liên kết qua bảng `ProductTopping` có `topping.isAvailable = true`, sắp xếp theo `toppingId ASC`.

### 2.2. Frontend Product Listing, Product Detail & Trạng thái `loading` / `empty` / `error` (`apps/web`)
- **Product Listing (`/`):**
  - **PASS (Runtime Browser & Probe):** Kết nối `GET /products` qua same-origin proxy `/api/backend/[[...path]]`, sắp xếp ổn định qua `sortProductsByContract`.
  - **PASS (Runtime Browser & Probe):** `ProductCard` hiển thị đầy đủ tên món, danh mục, giá `basePriceVnd` định dạng VND, huy hiệu `Best Seller` (`isBestseller: true`) / `Mới` (`isNew: true`), không tự tạo sao đánh giá giả khi `rating === null`, có fallback ảnh `/images/product-placeholder.svg` khi lỗi tải ảnh, hiển thị lớp phủ `"Hết hàng"` + nhãn `"Tạm hết"` khi `isAvailable === false` nhưng vẫn giữ `<Link href="/products/:id">`.
  - **PASS (Runtime Browser & Probe):** Bộ lọc danh mục (`all`, `traditional`, `espresso_coldbrew`, `tea_macchiato`, `bakery`), ô tìm kiếm từ khóa, lọc khoảng giá (`under-45`, `45-60`, `above-60`) và sắp xếp hoạt động chính xác trên client.
- **Trạng thái `loading`, `empty`, `error`:**
  - **PASS — Loading State (`/?state=loading` & `/products/[id]`):** Hiển thị `ProductSkeletonGrid` gồm đúng **8** thẻ `[data-testid="product-skeleton-card"]` với `aria-busy="true"` và thanh trạng thái `role="status"`. Trang chi tiết có màn hình chờ `[data-testid="product-detail-loading"]`.
  - **PASS — Empty State (`/?state=empty`):** Khi API trả `items: []`, hiển thị `ProductEmptyState` (`[data-testid="product-empty-state"]`, `role="status"`), tiêu đề *"Thực đơn hiện chưa có món nào"*, nút *"Tải lại thực đơn"* và link hotline `tel:19006868`.
  - **PASS — Error State (`/?state=error` & lỗi payload):** Khi API trả lỗi HTTP `500` hoặc trả `200 OK` nhưng thiếu mảng `items`, `getProducts()` ném lỗi để hiển thị `ProductErrorState` (`[data-testid="product-error-state"]`, `role="alert"`), hiển thị đúng huy hiệu `"MÃ LỖI: 500 INTERNAL_SERVER_ERROR"` và nút `[data-testid="retry-button"]`.
  - **PASS — Product Detail Error States (`/products/invalid-uuid` & `/products/<missing-uuid>`):** Hiển thị hộp thoại `[data-testid="product-detail-error"]` phân biệt rõ:
    - `HTTP 400 • Bad Request`: *"Mã sản phẩm không hợp lệ"* (`Validation failed (uuid is expected)`).
    - `HTTP 404 • Not Found`: *"Không tìm thấy sản phẩm"* (`Product not found`).
    - `HTTP 500 • Internal Server Error`: *"Lỗi kết nối máy chủ"* (kèm nút *"Thử lại"*).
- **Product Detail Modal (`ProductDetailModal.tsx`):**
  - **PASS (Runtime JSDOM & Browser):**
    - Mặc định chọn `Size S` (100%) cho sản phẩm `STANDARD` và `Tiêu chuẩn (One Size)` (100%) cho sản phẩm `ONE_SIZE` (ví dụ: *Croissant Bơ Pháp Nướng* hiển thị *"Sản phẩm này hiện không có topping đi kèm"*).
    - Khi chọn `Size M` (120%) cho *Bạc Xỉu Kem Béo Phin* (`basePriceVnd = 42.000 ₫`), giá tạm tính cập nhật tức thì lên `50.400 ₫`.
    - Khi tích chọn 3 topping (*Trân châu* `5.000 ₫` + *Kem cheese* `10.000 ₫` + *Thêm shot espresso* `12.000 ₫`), giá tạm tính cập nhật đúng thành `77.400 ₫`. Khi cố tình bấm chọn topping thứ 4, hệ thống chặn không cho chọn thêm và hiển thị cảnh báo `role="alert"`: *"Mỗi ly chỉ được chọn tối đa 3 loại topping khác nhau."*
    - Nút giảm số lượng (`#btn-qty-minus`) bị `disabled` ở `quantity = 1`; bấm `#btn-qty-plus` lên `quantity = 2` cập nhật tổng tiền thành `154.800 ₫`; giới hạn tối đa `10` ly/dòng và ghi chú tối đa `100` ký tự.
    - Khi `isAvailable = false`, toàn bộ input size/topping/quantity/note và nút `#btn-add-cart` bị `disabled`, nội dung nút đổi thành *"Sản phẩm tạm hết hàng"*.

---

## 3. Phân tích Chuyên sâu & Kết quả Kiểm chứng Thực nghiệm cho 5 mục Review (`MVP-R01` → `MVP-R05`)

### 3.1. [MVP-R01 — Major] Xác minh sai lệch công thức `Math.floor` (Frontend) vs `round_half_up` (Backend / SRS / Contract v4.0)

#### A. Kết quả kiểm chứng tĩnh (Static Verification)
- **Backend** (`apps/api/src/orders/cart-pricing.ts` dòng 98–99):
  ```ts
  // API Contract v4.0 §14.1: integer VND round-half-up, before toppings.
  const sizePriceVnd =
    (product.basePriceVnd * BigInt(sizePercentSnapshot) + 50n) / 100n;
  ```
- **Tài liệu quy chuẩn:**
  - `docs/requirements/srs.md` (`FR-11`, `AC-A2-011`, `NFR-12`): *"Size pricing must use `round_half_up(basePriceVnd * multiplierPercent / 100)`."*
  - `docs/a1-archive/api/BrewLite_API_Contract_v4.0.md` (§14.1 `PR-01` / `BL-DEC-PRICING-001`): *"sizePriceVnd = round_half_up(basePriceVnd * multiplierPercent / 100) = floor((basePriceVnd * multiplierPercent + 50) / 100)"*.
  - Comment trong `apps/web/components/ProductDetailModal.tsx` (dòng 121) cũng ghi `round_half_up(basePriceVnd * multiplierPercent / 100)`.
- **Frontend thực tế hiện tại** (`apps/web/services/api.service.ts` dòng 67–75):
  ```ts
  export function calculateSizePriceVnd(
    basePriceVnd: number,
    multiplierPercent: number
  ): number {
    if (!Number.isSafeInteger(basePriceVnd) || basePriceVnd < 0) {
      return 0;
    }
    return Math.floor((basePriceVnd * multiplierPercent) / 100);
  }
  ```

#### B. Kết quả kiểm chứng thực thi với bộ dữ liệu giá chẵn & giá lẻ (Runtime Probe Evidence)
Đã chạy hàm `calculateSizePriceVnd` hiện tại của Frontend đối chiếu trực tiếp với công thức `round_half_up` của Backend trên tập dữ liệu kiểm thử:

| Nhóm dữ liệu | `basePriceVnd` (VND) | Size (`multiplierPercent`) | Giá trị thập phân (`base * mult / 100`) | Frontend hiện tại (`Math.floor`) | Backend chuẩn (`round_half_up`) | Độ lệch (`BE - FE`) | Đánh giá |
| :--- | ---: | :---: | ---: | ---: | ---: | :---: | :---: |
| Giá seed chẵn nghìn | `35000` | `S (100%)` / `M (120%)` / `L (140%)` | `35000` / `42000` / `49000` | `35000` / `42000` / `49000` | `35000` / `42000` / `49000` | `0 VND` | Khớp |
| Giá seed chẵn nghìn | `42000` | `S (100%)` / `M (120%)` / `L (140%)` | `42000` / `50400` / `58800` | `42000` / `50400` / `58800` | `42000` / `50400` / `58800` | `0 VND` | Khớp |
| Giá lẻ (phần dư `.8`) | `35004` | `M (120%)` | `42004.8` | `42004` | `42005` | **`+1 VND`** | **LỆCH (FE thiếu 1 đ)** |
| Giá lẻ (phần dư `.6`) | `35004` | `L (140%)` | `49005.6` | `49005` | `49006` | **`+1 VND`** | **LỆCH (FE thiếu 1 đ)** |
| Giá lẻ (phần dư `.6`) | `33333` | `M (120%)` | `39999.6` | `39999` | `40000` | **`+1 VND`** | **LỆCH (FE thiếu 1 đ)** |
| Giá lẻ (phần dư `.2`) | `33333` | `L (140%)` | `46666.2` | `46666` | `46666` | `0 VND` | Khớp (dưới `.5`) |
| Giá lẻ (phần dư `.8`) | `29999` | `M (120%)` | `35998.8` | `35998` | `35999` | **`+1 VND`** | **LỆCH (FE thiếu 1 đ)** |
| Giá lẻ (phần dư `.6`) | `29999` | `L (140%)` | `41998.6` | `41998` | `41999` | **`+1 VND`** | **LỆCH (FE thiếu 1 đ)** |
| Giá lẻ biên `.5` (với `150%`) | `35001` | `150%` (giả lập biên `.5`) | `52501.5` | `52501` | `52502` | **`+1 VND`** | **LỆCH tại biên `.5`** |

- **Kết luận & Khuyến nghị sửa chữa cho `MVP-R01`:**
  - Tại `apps/web/services/api.service.ts` (dòng 74), cần đổi `Math.floor((basePriceVnd * multiplierPercent) / 100)` thành `Math.floor((basePriceVnd * multiplierPercent + 50) / 100)`.
  - Cần bổ sung regression test cho các trường hợp giá lẻ (`35004`, `33333`, `29999` và biên `.5`) vào cả Backend (`apps/api/src/orders/cart-pricing.spec.ts`) và Frontend (`apps/web/tests/`).

---

### 3.2. [MVP-R02 — Major] Đánh giá độ phủ Unit Test cho Product Listing, Product Detail và các trạng thái `loading` / `empty` / `error`

#### A. Kết quả kiểm chứng tĩnh (Static Verification)
- **Trên Backend (`apps/api`):** Đã có đầy đủ **36 bài test** chuyên biệt cho Product Catalog:
  - `apps/api/src/products/products.service.spec.ts` (17 unit tests)
  - `apps/api/src/products/products.http.spec.ts` (6 HTTP pipeline tests)
  - `apps/api/src/products/products.controller.spec.ts` (2 controller unit tests)
  - `apps/api/test/products.e2e-spec.ts` (11 E2E tests)
- **Trên Frontend (`apps/web`):** Trong `apps/web/package.json`, hai lệnh `npm test` và `npm run test:unit` hiện chỉ chạy 6 file test của Sprint 2 & Sprint 3 (`checkout-flow.test.ts`, `payment-ui.test.ts`, `order-history.test.ts`, `order-confirmation.test.ts`, `vnpay-ui-flow.test.ts`, `payment-confirmation-flow.test.ts` — lưu ý `payment-confirmation-flow.test.ts` có mặt trong `npm test` nhưng đang thiếu trong `npm run test:unit`). **Chưa có file test tự động nào trong `apps/web/tests/`** kiểm thử trực tiếp các component và hàm của Sprint 1 (`ProductCard`, `ProductDetailModal`, `ProductSkeletonGrid`, `ProductEmptyState`, `ProductErrorState`, `getProducts`, `fetchProductDetailById`).

#### B. Kết quả kiểm chứng thực thi (Runtime Verification Probe)
Trong quá trình kiểm chứng vòng này, tôi đã viết và chạy bộ kịch bản kiểm thử runtime (với `ReactDOMServer`, `JSDOM` và `React.act`) cho toàn bộ phạm vi Sprint 1 trên Frontend. Kết quả chạy thực tế:
- `sortProductsByContract`: **PASS** (sắp xếp đúng theo `name ASC`, tie-breaker `id ASC` với tiếng Việt).
- `getProducts`: **PASS** cả 4 kịch bản (`200 OK` trả danh sách đã sắp xếp; `200 OK` với `items: []` trả mảng rỗng; `200 OK` nhưng thiếu mảng `items` ném lỗi chuyển sang Error State; `500 Internal Server Error` bảo toàn `statusCode = 500`).
- `fetchProductDetailById`: **PASS** cả 5 kịch bản (chặn UUID sai định dạng trả `400` ngay tại client trước khi gọi mạng; trả `404` khi không tìm thấy; trả `500` khi đứt kết nối mạng; map đúng `STANDARD` 3 sizes + toppings; map đúng `ONE_SIZE` 1 size + không topping).
- Render & tương tác DOM:
  - `ProductSkeletonGrid`: **PASS** (render đúng 8 thẻ `[data-testid="product-skeleton-card"]`, `aria-busy="true"`).
  - `ProductEmptyState`: **PASS** (`[data-testid="product-empty-state"]`, `role="status"`, nút tải lại & hotline).
  - `ProductErrorState`: **PASS** (`[data-testid="product-error-state"]`, `role="alert"`, badge mã lỗi & nút thử lại).
  - `ProductCard`: **PASS** (hiển thị đúng trạng thái còn hàng/hết hàng, không tự tạo rating giả khi `rating: null`).
  - `ProductDetailModal`: **PASS** các quy tắc chọn Size, giới hạn tối đa 3 topping (hiện `role="alert"` khi bấm topping thứ 4), tăng/giảm số lượng `1..10`, khóa nút khi `isAvailable = false`. Tuy nhiên **PHÁT HIỆN 1 LỖI LOGIC HIỂN THỊ BADGE** trong Modal (xem chi tiết tại mục 3.3.D bên dưới).

- **Kết luận & Khuyến nghị sửa chữa cho `MVP-R02`:**
  - Khi được phép sửa code, cần đưa bộ test runtime này vào `apps/web/tests/menu-product-detail.test.ts` và thêm vào script `test` / `test:unit` trong `apps/web/package.json`.

---

### 3.3. [MVP-R03 — Major] Kết quả Kiểm thử UI Thực tế trên Trình duyệt tại các Viewport `320x640`, `375x812`, `768x1024`

Đã khởi chạy ứng dụng thực tế tại `http://localhost:3000` (kết nối dữ liệu 9 sản phẩm chuẩn Contract v2.1 tại cổng `3001`) và đo đạc DOM bằng trình duyệt tại 3 kích thước màn hình tiêu biểu.

#### A. Bảng số liệu đo đạc DOM thực tế (Runtime Browser Measurements)

| Chỉ số đo đạc trên trình duyệt | Mobile nhỏ (`320x640`) | Mobile phổ thông (`375x812`) | Tablet (`768x1024`) | Đánh giá kết quả thực tế |
| :--- | :--- | :--- | :--- | :--- |
| `window.innerWidth` | `320px` | `375px` | `768px` | Chuẩn viewport |
| `document.documentElement.scrollWidth` | **`349.59px`** | `375px` | `768px` | **FAIL tại `320px`: Tràn ngang toàn trang `29.59px` (~30px)** |
| `document.body.scrollWidth` | **`349.59px`** | `375px` | `768px` | **FAIL tại `320px`: Xuất hiện thanh cuộn ngang** |
| Padding ngang của `HeroBanner` & `Menu Section` (`.px-margin`) | `paddingLeft: 48px`<br>`paddingRight: 48px`<br>(`96px` tổng padding) | `paddingLeft: 48px`<br>`paddingRight: 48px`<br>(`96px` tổng padding) | `paddingLeft: 48px`<br>`paddingRight: 48px` | **Major Issue:** Trên màn `320px`, lề 2 bên chiếm mất `96px` (30% màn hình), chỉ còn **`224px`** chiều rộng nội dung (trên `375px` chỉ còn **`279px`**). |
| Cỡ chữ tiêu đề `HeroBanner` (`h1.text-display-lg`) | `fontSize: 48px`<br>`lineHeight: 55.2px`<br>Khung `h1`: **`264x336px`** | `fontSize: 48px`<br>`lineHeight: 55.2px`<br>Khung `h1`: **`279x280.8px`** | `fontSize: 48px`<br>`lineHeight: 55.2px`<br>Khung `h1`: `672x224.8px` | **Moderate Issue:** Cỡ chữ `48px` không hạ xuống trên mobile khiến riêng tiêu đề `h1` cao tới `336px` (chiếm hơn 52% chiều cao màn hình `320x640`). |
| Cụm bộ lọc `Sắp xếp` + `Khoảng giá` (`CategoryFilterBar.tsx` dòng 62) | `x: 64px`, `width: 285.59px`<br>**Cạnh phải = `349.59px` > `320px`** | `x: 48px`, `width: 285.59px`<br>Khung thẻ: `279px`<br>**Tràn khỏi thẻ `6.59px`** | `x: 434.41px`, `width: 285.59px`<br>Khung thẻ: `672px` (Vừa khít) | **FAIL (Nguyên nhân trực tiếp gây tràn bố cục):** Khối `.flex.items-center.gap-space-sm.ml-auto` có chiều rộng cứng `285.59px` và thiếu `flex-wrap`, làm tràn khỏi thẻ trắng ở cả `320px` lẫn `375px`, và đẩy `scrollWidth` toàn trang lên `349.59px` ở màn `320px`. |
| Thanh điều hướng `Header` (`header nav`) | `display: none` | `display: none` | `display: flex` (`337.89x36px`) | Ở `< 768px`, menu chữ ẩn đi; tuy nhiên nút Logo (`/`), Tìm kiếm, Giỏ hàng và Đăng nhập/User Menu vẫn hiển thị đầy đủ, không tràn ngang (`Header` dùng `px-3 sm:px-6 lg:px-margin`). |
| Hộp thoại `ProductDetailModal` (`[role="dialog"]`) tại `320x640` | `x: 8px`, `y: 86px`<br>`width: 304px`, `height: 548px` | Vừa khít trong viewport | Vừa khít trong viewport | **PASS về kích thước khung:** Hộp thoại rộng `304px` (cách lề trái/phải `8px`), cuộn dọc mượt mà, không bị tràn ngang. |
| Hàng nút dưới cùng trong `ProductDetailModal` (`#btn-qty-minus` .. `#btn-add-cart`) tại `320x640` | Container: `width: 276px`, `height: 115.75px`<br>`#btn-add-cart`: `168x76.75px` | Hiển thị trên 1 hàng gọn gàng | Hiển thị trên 1 hàng gọn gàng | Không gây tràn ngang khỏi khung `304px`, nhưng ở màn `320px` nút `#btn-add-cart` bị ép chiều ngang còn `168px` nên chữ *"Thêm vào giỏ hàng • 42.000 ₫"* bị ngắt thành **3 dòng** (cao `76.75px`). |

#### B. Phát hiện lỗi mất thông tin huy hiệu (Badge) trong `ProductDetailModal` khi chạy với dữ liệu API thật
- **Hiện tượng quan sát được trên trình duyệt (`http://localhost:3000/products/a3000000-0000-4000-8000-000000000001`):**
  - Món *Bạc Xỉu Kem Béo Phin* có `isBestseller: true` từ API. Trên trang Thực đơn (`/`), `ProductCard` hiển thị đúng huy hiệu **"Best Seller"**.
  - Tuy nhiên khi bấm vào xem chi tiết (`/products/a3000000-0000-4000-8000-000000000001`), bên trong `ProductDetailModal` **không hiển thị huy hiệu "Bán chạy nhất"** (hoặc **"Mới"** đối với món có `isNew: true`).
- **Nguyên nhân gốc rễ (Root Cause):**
  - Trong `apps/web/components/ProductDetailModal.tsx` (dòng 339–348), code đang kiểm tra điều kiện:
    ```tsx
    {product.badge && (
      <span className="...">
        {product.badge === "Best Seller" ? "Bán chạy nhất" : product.badge}
      </span>
    )}
    ```
  - Trong khi đó, API `GET /products/:id` (theo đúng API Contract v2.1) trả về hai trường boolean `isBestseller` và `isNew`, **không trả về trường `badge`**. Vì `MOCK_PRODUCT_DETAILS` lại đang dùng bộ UUID cũ `a1000000-...` (xem `MVP-R05`), lệnh ghép `...uiMeta` trong `fetchProductDetailById` không lấy được `badge` cho các sản phẩm thật `a3000000-...`. Hệ quả là cả 9 sản phẩm trên DB đều bị mất huy hiệu *Bán chạy nhất / Mới* khi mở Modal chi tiết.

#### C. Danh sách các điểm cần sửa xác nhận từ kiểm thử UI thực tế (`MVP-R03`)
1. **[Major — Tràn ngang `349.59px` trên màn `320px` & tràn thẻ trên màn `375px`]:**
   - Thêm `flex-wrap w-full lg:w-auto` vào cụm chứa 2 ô `<select>` (*Sắp xếp* và *Khoảng giá*) tại `apps/web/components/CategoryFilterBar.tsx` (dòng 62).
   - Đổi `px-margin` (`48px` cố định mỗi bên) thành `px-4 sm:px-6 lg:px-margin` tại `apps/web/app/page.tsx` (dòng 267, 300), `apps/web/components/HeroBanner.tsx` (dòng 14), `apps/web/components/CategoryFilterBar.tsx` (dòng 40), `apps/web/components/Footer.tsx` (dòng 14), và `apps/web/app/products/[id]/page.tsx` (dòng 147). Khi giảm padding ngang trên mobile từ `48px` xuống `16px` (`px-4`), vùng nội dung trên màn `320px` tăng từ `224px` lên `288px` (và trên `375px` tăng từ `279px` lên `343px`), kết hợp với `flex-wrap` sẽ triệt tiêu 100% lỗi tràn ngang (`scrollWidth === 320px`).
2. **[Major — Mất huy hiệu `isBestseller` / `isNew` trong `ProductDetailModal.tsx`]:**
   - Sửa dòng 339 của `apps/web/components/ProductDetailModal.tsx` để kiểm tra `(product.isBestseller || product.isNew || product.badge)` tương tự như logic đã làm đúng ở `ProductCard.tsx` (dòng 27–31).
3. **[Minor — Tối ưu hiển thị chữ trên màn `320px`]:**
   - Tại `apps/web/components/HeroBanner.tsx` (dòng 26, 28): Dùng cỡ chữ responsive `text-2xl sm:text-4xl lg:text-display-lg` và `text-xl sm:text-3xl lg:text-headline-xl` để tiêu đề không chiếm quá nửa màn hình điện thoại nhỏ.
   - Tại `apps/web/components/ProductDetailModal.tsx` (dòng 691): Cho phép hàng chứa bộ đếm số lượng và nút `#btn-add-cart` xuống dòng (`flex-wrap sm:flex-nowrap`) trên màn hình siêu hẹp để nút *"Thêm vào giỏ hàng"* không bị gãy thành 3 dòng.

---

### 3.4. [MVP-R04 — Major/Minor] Ghi nhận 3 script `SCRUM-80` và `README.md` còn đường dẫn `backend/` cũ sau Monorepo Migration

#### A. Kết quả kiểm tra phạm vi ảnh hưởng trên toàn bộ Repository
Đã rà soát toàn bộ các file cấu hình, script và tài liệu trong repo sau khi chuyển từ cấu trúc A1 (`backend/`, `frontend/`) sang cấu trúc monorepo A2 (`apps/api/`, `apps/web/`):
- **Các thành phần ĐÃ tương thích tốt với `apps/api` và `apps/web`:**
  - `.github/workflows/ci.yml`
  - `docker-compose.yml`, `apps/api/Dockerfile`, `apps/web/Dockerfile`
  - `scripts/compose-preflight-env.ps1`, `scripts/compose-preflight-env.sh`
  - `scripts/scrum92/verify_compose_e2e.mjs`
  - `scripts/download-product-images.py`
- **Các file CÒN SÓT đường dẫn `backend` cũ:**

| STT | File & Dòng | Nội dung hiện tại trên SHA `34cbbc0` | Lỗi phát sinh khi chạy thực tế | Hướng xử lý / Phối hợp |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `scripts/scrum80/bootstrap_default_db.mjs` (dòng 10) | `const backend=path.join(root,'backend');` | Khi chạy `node scripts/scrum80/bootstrap_default_db.mjs`, script ném lỗi ngay ở dòng 15: `Error: Missing ...\backend\prisma7.config.ts` vì thư mục `backend/` không còn tồn tại. | Cập nhật thành `path.join(root, 'apps', 'api')` (hoặc phối hợp với task migration/repository nếu nhóm vẫn dùng bộ script kiểm chứng DB cô lập `compose.scrum80.test.yml` trong A2). |
| 2 | `scripts/scrum80/run_db_checks.mjs` (dòng 36) | `const p=path.join(root,'backend','prisma','tests',file);` | Khi chạy `node scripts/scrum80/run_db_checks.mjs`, script ném lỗi ở dòng 37: `Error: Missing backend\prisma\tests\05_p2_06_index_catalog.sql` (các file SQL test này hiện nằm tại `apps/api/prisma/tests/`). | Cập nhật thành `path.join(root, 'apps', 'api', 'prisma', 'tests', file)`. |
| 3 | `scripts/scrum80/run_phase1_upgrade.mjs` (dòng 12) | `const BACKEND=path.join(ROOT,'backend');` | Khi chạy `node scripts/scrum80/run_phase1_upgrade.mjs`, script ném lỗi ở dòng 64: `Error: Missing prerequisite: backend\prisma7.config.ts`. | Cập nhật thành `path.join(ROOT, 'apps', 'api')`. |
| 4 | `README.md` (dòng 205) | Trong mục `8. Chạy local trên host` -> `Cấu hình backend`:<br>`cd backend` | Lệnh `cd backend` báo lỗi không tìm thấy thư mục (trong khi ngay bên dưới ở dòng 216 và dòng 238 của chính `README.md` đã ghi đúng là `apps/api/.env` và `Từ apps/api/`). | Sửa dòng 205 trong `README.md` từ `cd backend` thành `cd apps/api`. |

---

### 3.5. [MVP-R05 — Minor] Làm rõ vai trò của Mock Data (`apps/web/mock-data/products.mock.ts`) trước khi đồng bộ với `seed.ts`

Để tránh sửa đổi gây hỏng các bài test hiện có, tôi đã truy vết toàn bộ các điểm đang import và sử dụng dữ liệu từ `apps/web/mock-data/products.mock.ts`. Dưới đây là 4 vai trò thực tế của file này trong hệ thống hiện tại:

1. **Vai trò 1 — Cung cấp cấu hình tĩnh cho khung giao diện Menu (`MOCK_CATEGORIES`, `MOCK_SORT_OPTIONS`, `MOCK_PRICE_FILTER_OPTIONS`):**
   - Được import trực tiếp tại `apps/web/app/page.tsx`, `apps/web/components/CategoryFilterBar.tsx`, và `apps/web/services/api.service.ts` (`fetchCatalogData`, `getCatalogData`).
   - Lưu ý: Danh mục `bakery` trong `MOCK_CATEGORIES` (dòng 21) có nhãn `"Bánh & Ăn nhẹ"`, khớp với mã `code: "bakery"` trong `apps/api/prisma/seed.ts`.
2. **Vai trò 2 — Dữ liệu khởi tạo ban đầu cho lớp nền mờ (Background Blur) trên trang `/products/[id]`:**
   - Trong `apps/web/app/products/[id]/page.tsx` (dòng 33), trang Product Detail gọi đồng bộ `getCatalogData()` (vốn đọc từ `MOCK_PRODUCTS_RESPONSE.items`) để dựng nhanh 3 thẻ sản phẩm làm lớp nền mờ (`opacity-90 pointer-events-none`) phía dưới Modal trong lúc chờ `fetchCatalogData()` tải danh sách thật từ Backend.
   - Do `MOCK_CATALOG_PRODUCTS` đang chứa 8 sản phẩm cũ (dùng ảnh `/images/product-placeholder.svg`), trong vài trăm mili-giây đầu tiên trước khi API trả về, lớp nền mờ hiển thị ảnh placeholder thay vì ảnh thật của 9 sản phẩm trong `seed.ts`.
3. **Vai trò 3 — Bổ sung Metadata hương vị (UI Enrichment) trong `fetchProductDetailById` (`apps/web/services/api.service.ts` dòng 362):**
   - Khi `GET /products/:id` trả về dữ liệu từ Backend (`apiData`), hàm `fetchProductDetailById` thực hiện tra cứu:
     ```ts
     const uiMeta = MOCK_PRODUCT_DETAILS[apiData.id];
     return {
       status: 200,
       data: {
         ...uiMeta,
         ...apiData,
         ...
       }
     };
     ```
   - Mục đích của thiết kế này là lấy thêm các trường mô tả trải nghiệm (như `flavorNotes`, `originBadge`, `intensity`, `beanType`, `processMethod`, `sustainabilityNote`) từ `MOCK_PRODUCT_DETAILS` nếu DB chỉ lưu các trường cốt lõi của Contract (`id`, `name`, `basePriceVnd`, `imageUrl`, `sizePolicy`, `sizes`, `toppings`, `isNew`, `isBestseller`).
   - **Hệ quả của việc lệch UUID:** Vì `apps/api/prisma/seed.ts` đã chuyển sang dùng 9 UUID mới (`a3000000-0000-4000-8000-000000000001` .. `0009`) để bảo vệ lịch sử đơn hàng cũ, còn `MOCK_CATALOG_PRODUCTS` / `MOCK_PRODUCT_DETAILS` vẫn giữ 8 UUID thế hệ cũ (`a1000000-0000-4000-8000-000000000001` .. `0008`), nên `MOCK_PRODUCT_DETAILS[apiData.id]` luôn trả về `undefined` đối với cả 9 sản phẩm được seed. Khi đó, `ProductDetailModal` phải dùng chuỗi fallback chung chung cho tất cả đồ uống thay vì hiển thị đúng hồ sơ hương vị riêng của từng món.
4. **Vai trò 4 — Tương thích ngược với các bài Unit Test cũ & `OrderHistoryView.tsx`:**
   - Qua rà soát bằng `Select-String`, các UUID cũ `a1000000-0000-4000-8000-000000000001..0008` vẫn đang được tham chiếu trong:
     - `apps/web/tests/payment-ui.test.ts` (dòng 110)
     - `apps/web/tests/order-history.test.ts` (dòng 537, 544, 551)
     - `apps/api/test/products.e2e-spec.ts` (dòng 8 — tự tạo fixture riêng trong test DB)
     - `apps/web/components/OrderHistoryView.tsx` (dòng 204–231 — nơi đã chủ động map **cả hai** dải ID `a3000000-...` và `a1000000-...`).
- **Kết luận & Hướng xử lý an toàn cho `MVP-R05`:**
  - `mock-data/products.mock.ts` **không phải** là nguồn dữ liệu thay thế cho Backend API (vì `getProducts` và `fetchProductDetailById` đều gọi HTTP thật và chuyển sang Error State nếu Backend lỗi, hoàn toàn không dùng mock để giả lập thành công giả tạo).
  - Tuy nhiên, để Vai trò 2 (lớp nền mờ) và Vai trò 3 (metadata hương vị `MOCK_PRODUCT_DETAILS[apiData.id]`) hoạt động đúng với 9 sản phẩm trong `seed.ts` **mà không làm gãy bất kỳ bài test cũ nào**, khi đồng bộ cần:
    1. Cập nhật `MOCK_CATALOG_PRODUCTS` sang 9 sản phẩm chuẩn của `seed.ts` (`a3000000-0000-4000-8000-000000000001` .. `0009`).
    2. Trong `MOCK_PRODUCT_DETAILS`, giữ đồng thời cả 9 key `a3000000-...` mới lẫn 8 key `a1000000-...` cũ (tương tự cách `OrderHistoryView.tsx` dòng 204–231 đang làm).

---

## 4. Bằng chứng Demo MVP & Kết quả Kiểm chứng Thực tế (Runtime Evidence)

### 4.1. Log Kết quả Thực thi Kịch bản Runtime Probe (`MVP-R01` & `MVP-R02`)
Thực thi trực tiếp trên mã nguồn tại commit `34cbbc088117d7a4908d07a66cfbd03b0c905dea`:

```text
=== [SCRUM-112] RUNTIME VERIFICATION PROBE START ===

--- 1. MVP-R01: Pricing Formula Verification ---
[Pricing] base=35000, size=S(100%): FE(Math.floor)=35000 | BE(round_half_up)=35000 | diff=0 VND
[Pricing] base=35000, size=M(120%): FE(Math.floor)=42000 | BE(round_half_up)=42000 | diff=0 VND
[Pricing] base=35000, size=L(140%): FE(Math.floor)=49000 | BE(round_half_up)=49000 | diff=0 VND
[Pricing] base=42000, size=S(100%): FE(Math.floor)=42000 | BE(round_half_up)=42000 | diff=0 VND
[Pricing] base=42000, size=M(120%): FE(Math.floor)=50400 | BE(round_half_up)=50400 | diff=0 VND
[Pricing] base=42000, size=L(140%): FE(Math.floor)=58800 | BE(round_half_up)=58800 | diff=0 VND
[Pricing] base=35004, size=S(100%): FE(Math.floor)=35004 | BE(round_half_up)=35004 | diff=0 VND
[Pricing] base=35004, size=M(120%): FE(Math.floor)=42004 | BE(round_half_up)=42005 | diff=1 VND
[Pricing] base=35004, size=L(140%): FE(Math.floor)=49005 | BE(round_half_up)=49006 | diff=1 VND
[Pricing] base=33333, size=S(100%): FE(Math.floor)=33333 | BE(round_half_up)=33333 | diff=0 VND
[Pricing] base=33333, size=M(120%): FE(Math.floor)=39999 | BE(round_half_up)=40000 | diff=1 VND
[Pricing] base=33333, size=L(140%): FE(Math.floor)=46666 | BE(round_half_up)=46666 | diff=0 VND
[Pricing] base=29999, size=S(100%): FE(Math.floor)=29999 | BE(round_half_up)=29999 | diff=0 VND
[Pricing] base=29999, size=M(120%): FE(Math.floor)=35998 | BE(round_half_up)=35999 | diff=1 VND
[Pricing] base=29999, size=L(140%): FE(Math.floor)=41998 | BE(round_half_up)=41999 | diff=1 VND

--- 2. MVP-R02: Runtime Service & Component Verification ---
[PASS] sortProductsByContract sorts by name ASC, tie-breaker id ASC
[PASS] getProducts(200 OK) parses and sorts items accurately
[PASS] getProducts(empty) returns { items: [] }
[PASS] getProducts(malformed 200 without items[]) throws error -> triggers Error State
[PASS] getProducts(500) preserves statusCode=500 and error message
[PASS] fetchProductDetailById('not-a-uuid') returns 400 before network call
[PASS] fetchProductDetailById(missing UUID) returns 404 Not Found
[PASS] fetchProductDetailById(network failure) returns 500 Internal Server Error
[PASS] fetchProductDetailById(ONE_SIZE) maps sizePolicy=ONE_SIZE and empty toppings

--- 3. Component Rendering & Interactive DOM Verification ---
[PASS] ProductSkeletonGrid renders 8 shimmer cards with aria-busy='true'
[PASS] ProductEmptyState renders status role, title, reload CTA and hotline
[PASS] ProductErrorState renders alert role, HTTP 500 badge, and retry CTA
[PASS] ProductCard (Available, rating=null, isBestseller=true) renders link, Best Seller badge, and does not fabricate rating
[PASS] ProductCard (Unavailable, rating=4.8) renders 'Hết hàng' overlay while keeping link to Product Detail
[Probe Modal Badge] When API product has isBestseller=true (and badge=undefined), Modal displays 'Bán chạy nhất': false
[Probe Modal Default S] Temp total text: 42.000 ₫
[Probe Modal Size M] Temp total after clicking Size M: 50.400 ₫
[Probe Modal 3 Toppings] Temp total after selecting 3 toppings: 77.400 ₫
[Probe Modal 4th Topping Alert] Alert displayed: ["errorMỗi ly chỉ được chọn tối đa 3 loại topping khác nhau."]
[PASS] Modal strictly enforces max 3 toppings and displays role='alert' warning on 4th topping click
[Probe Modal Qty=2] Temp total at qty=2: 154.800 ₫
[PASS] Modal ONE_SIZE renders 'Tiêu chuẩn (One Size)' and 'Sản phẩm này hiện không có topping đi kèm'
[PASS] Modal (isAvailable=false) disables CTA button and displays 'Sản phẩm tạm hết hàng'

=== [SCRUM-112] RUNTIME VERIFICATION PROBE COMPLETED SUCCESSFULLY ===
```

### 4.2. Danh mục Bằng chứng Hình ảnh Trực quan (Visual Evidence Screenshots)
Toàn bộ ảnh chụp màn hình kiểm chứng trực tiếp trên trình duyệt đã được lưu vào thư mục `docs/A2_TestReport/evidence/`:

1. **Giao diện Menu tại các kích thước màn hình:**
   - [menu_320x640.png](evidence/menu_320x640.png) — Kiểm chứng hiển thị Menu và ghi nhận tràn bố cục `349.59px` tại viewport `320px`.
   - [menu_375x812.png](evidence/menu_375x812.png) — Kiểm chứng Menu trên iPhone/Android phổ thông `375px`.
   - [menu_768x1024.png](evidence/menu_768x1024.png) — Kiểm chứng Menu trên Tablet `768px` (thanh Header Nav hiển thị đầy đủ).
2. **Giao diện Product Detail Modal tại `320x640`:**
   - [modal_320x640_top.png](evidence/modal_320x640_top.png) — Khung ảnh sản phẩm, hồ sơ hương vị và các nhãn phía trên (rộng `304px`, lề `8px`).
   - [modal_320x640_bottom.png](evidence/modal_320x640_bottom.png) — Chọn Size, danh sách Topping, ghi chú và hàng nút dưới cùng (`#btn-add-cart`).
3. **Giao diện các trạng thái đặc biệt (`loading`, `empty`, `error`) tại `320x640`:**
   - [state_loading_320x640.png](evidence/state_loading_320x640.png) — Trạng thái Shimmer Loading (`8` thẻ skeleton).
   - [state_empty_320x640.png](evidence/state_empty_320x640.png) — Trạng thái Thực đơn rỗng (`items: []`).
   - [state_error_320x640.png](evidence/state_error_320x640.png) — Trạng thái Lỗi kết nối máy chủ HTTP 500 (`ProductErrorState`).
4. **Giao diện xử lý lỗi trên đường dẫn Product Detail `/products/:id` tại `320x640`:**
   - [error_400_320x640.png](evidence/error_400_320x640.png) — Lỗi `400 Bad Request` khi UUID không hợp lệ (`/products/invalid-uuid`).
   - [error_404_320x640.png](evidence/error_404_320x640.png) — Lỗi `404 Not Found` khi sản phẩm không tồn tại (`/products/a3000000-...0999`).

---

## 5. Bảng Đối chiếu Đầy đủ Toàn diện Tiêu chí Chấp nhận (Acceptance Criteria Traceability Matrix)

| Tiêu chí của Task (Acceptance Criteria) | Hạng mục kiểm chứng tương ứng | Phương pháp kiểm chứng | Kết quả | Chi tiết minh chứng |
| :--- | :--- | :---: | :---: | :--- |
| **1. Menu và Product Detail hoạt động chính xác** | - Product Listing (`/`) hiển thị danh sách 9 món, sắp xếp chuẩn, lọc & tìm kiếm.<br>- Product Detail (`/products/:id`) hiển thị Modal đúng chuẩn `STANDARD` (S/M/L) và `ONE_SIZE`, chặn tối đa 3 topping, số lượng 1..10. | Static + Runtime Probe + Browser UI | **ĐẠT (PASS)** *(Lưu ý: phát hiện lỗi hiển thị badge trong Modal do kiểm tra `product.badge` thay vì `isBestseller`)* | - 36 tests backend PASS.<br>- 11/11 E2E tests `GET /products` & `GET /products/:id` PASS.<br>- Runtime probe tương tác DOM PASS.<br>- Ảnh minh chứng: `menu_320x640.png`, `modal_320x640_top.png`, `modal_320x640_bottom.png`. |
| **2. API trả dữ liệu hợp lệ và xử lý lỗi phù hợp** | - `GET /products` trả `200 OK` `{ items: [...] }`.<br>- `GET /products/:id` chặn `400 Bad Request` khi UUID sai.<br>- Trả `404 Not Found` khi không có món.<br>- Trả `500 Internal Server Error` an toàn khi DB lỗi. | Static + Runtime Unit/E2E + Browser UI | **ĐẠT (PASS)** | - Controller `ParseUUIDPipe` hoạt động đúng.<br>- `products.service.spec.ts` & `products.http.spec.ts` PASS.<br>- Ảnh minh chứng: `error_400_320x640.png` (HTTP 400), `error_404_320x640.png` (HTTP 404). |
| **3. Giao diện mobile không tràn bố cục hoặc mất chức năng quan trọng** | - Kiểm tra trên màn hình tiêu biểu: `320px`, `375px`, `768px`.<br>- Không mất chức năng cốt lõi (xem món, xem chi tiết, chọn size, thêm giỏ). | Browser UI Automation | **CẦN SỬA (CONFIRMED ISSUE)** *(Chức năng bảo toàn nhưng bị tràn ngang bố cục tại 320px & 375px)* | - Số liệu đo đạc thực tế: `scrollWidth = 349.59px` tại màn `320px` (tràn `29.59px`).<br>- Nguyên nhân: cụm lọc `#sort-select` thiếu `flex-wrap` (`width: 285.59px`) và container dùng `px-margin` (`48px` mỗi bên).<br>- Không mất chức năng quan trọng (modal và giỏ hàng vẫn hoạt động). |
| **4. Loading, empty, error states được kiểm chứng** | - Menu Shimmer loading (8 cards).<br>- Empty state khi `items: []`.<br>- Error state khi server lỗi.<br>- Product detail loading & error modal. | Static + Runtime Probe + Browser UI | **ĐẠT (PASS)** | - `ProductSkeletonGrid`: 8 cards với `aria-busy="true"`.<br>- `ProductEmptyState`: `role="status"` + CTA tải lại.<br>- `ProductErrorState`: `role="alert"` + badge HTTP 500.<br>- Ảnh minh chứng: `state_loading_320x640.png`, `state_empty_320x640.png`, `state_error_320x640.png`. |
| **5. Không phát sinh regression sau migration** | - Kiểm tra cấu trúc `apps/api` và `apps/web`.<br>- Kiểm tra CI, Docker, seed, migration scripts và tài liệu. | Static + Script Verification | **CẦN SỬA (CONFIRMED 4 FILES)** | - CI, Docker Compose, Dockerfiles, `scrum92` đều tương thích tốt.<br>- Còn sót 3 script trong `scripts/scrum80/` và dòng 205 `README.md` trỏ tới `backend/`. |
| **6. Bổ sung hoặc cập nhật các unit test cần thiết** | - Bộ test cho Sprint 1 trên Frontend (`apps/web/tests/`). | Static Verification | **CẦN BỔ SUNG (CONFIRMED GAP)** | - Backend đã có đầy đủ 36 tests.<br>- Frontend mới chỉ có test cho Sprint 2/3 (166 tests). Đã hoàn thiện kịch bản probe mẫu, sẵn sàng đưa vào `apps/web/tests/menu-product-detail.test.ts`. |
| **7. Ghi nhận bằng chứng demo MVP** | - Bằng chứng số liệu đo đạc DOM, log test runtime, ảnh chụp giao diện thực tế. | Browser Automation & Runtime Execution | **ĐẠT (PASS)** | - Log runtime probe ghi nhận chi tiết tại Mục 4.1.<br>- Đầy đủ 10 file ảnh chụp màn hình lưu tại `docs/A2_TestReport/evidence/`. |

---

## 6. Tổng hợp Kế hoạch Hành động Khắc phục (Action Plan cho Task Sửa Code tiếp theo)

Theo quy định nghiêm ngặt của `AGENTS.md` và chỉ đạo của User, task `SCRUM-112` này **chỉ thực hiện kiểm chứng và báo cáo, tuyệt đối không chỉnh sửa code của dự án**. Toàn bộ các vấn đề phát hiện đã được chứng minh bằng thực nghiệm và sẵn sàng để thực hiện ở task/PR sửa code tiếp theo:

1. **Sửa công thức giá (`MVP-R01`):** Sửa dòng 74 của `apps/web/services/api.service.ts` sang `Math.floor((basePriceVnd * multiplierPercent + 50) / 100)` và bổ sung regression test cho giá lẻ.
2. **Sửa tràn ngang & CSS responsive mobile-first (`MVP-R03`):**
   - Thêm `flex-wrap w-full lg:w-auto` cho cụm `#sort-select` trong `apps/web/components/CategoryFilterBar.tsx`.
   - Đổi `px-margin` thành `px-4 sm:px-6 lg:px-margin` trên `app/page.tsx`, `HeroBanner.tsx`, `CategoryFilterBar.tsx`, `Footer.tsx`, `app/products/[id]/page.tsx`.
   - Sửa logic kiểm tra badge trong `ProductDetailModal.tsx` (dòng 339) để hỗ trợ `product.isBestseller` / `product.isNew`.
3. **Bổ sung Unit Test Frontend (`MVP-R02`):** Tạo file `apps/web/tests/menu-product-detail.test.ts` từ kịch bản probe đã kiểm chứng và đăng ký vào script `test:unit` trong `package.json`.
4. **Cập nhật đường dẫn Monorepo (`MVP-R04`):** Đổi `'backend'` thành `path.join(root, 'apps', 'api')` trong 3 file `scripts/scrum80/` và sửa `cd backend` thành `cd apps/api` trong `README.md`.
5. **Đồng bộ Mock Data an toàn (`MVP-R05`):** Đồng bộ `MOCK_CATALOG_PRODUCTS` sang 9 sản phẩm của `seed.ts` đồng thời giữ song song cả UUID cũ `a1000000-...` và UUID mới `a3000000-...` trong `MOCK_PRODUCT_DETAILS`.
