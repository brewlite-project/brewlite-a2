# BrewLite — đồ án đặt và thanh toán đồ uống

Ứng dụng đặt và thanh toán đồ uống: Next.js → NestJS → Prisma → PostgreSQL.
Repository: [brewlite-project/brewlite-a2](https://github.com/brewlite-project/brewlite-a2).
Nhánh tích hợp `dev`, stable/release `main`; PR tính năng và tài liệu vào `dev`.

## Bài toán, chức năng và kiến trúc

BrewLite hỗ trợ khách của một cửa hàng xem menu, chọn size/topping, quản lý giỏ, đăng ký/đăng nhập, đặt hàng, thanh toán và xem lịch sử. Backend quyết định giá, kiểm ownership JWT, giữ tồn kho/coupon trong transaction và xử lý idempotency/finalization; coupon và loyalty được tích hợp trong vòng đời đơn. Code hỗ trợ Mock, ZERO_AMOUNT và VNPay Sandbox; không gọi mọi luồng đã PASS hoặc VNPay production đã nghiệm thu.

Next.js/React/Tailwind cung cấp UI và Route Handler proxy → NestJS REST/JSON (Controller/DTO/Guard → Service) → Prisma/PostgreSQL. Backend là modular monolith, không phải tập microservice. Argon2 hash mật khẩu; JWT và secrets lấy từ environment. Timers expiry/reconciliation cùng vòng đời process backend. API và schema hiện hành được dẫn trong tài liệu bên dưới.

## Tài liệu và bàn giao

- [Documentation center](docs/README.md), [Task/PR traceability](docs/TRACEABILITY.md), [Requirement → UC → design → code/test matrix](docs/traceability-matrix.md).
- [SRS A2](docs/requirements/srs.md), [Checkout Use Case](docs/requirements/A2_T1.3_Checkout_Use_Case_Specification.md), [Architecture](docs/architecture/architecture.md).
- [Deployment, environment, migration/seed và rollback](docs/deployment.md).
- [Readiness, release mapping, demo, bàn giao quyền và checklist nộp](docs/delivery/SCRUM-117-delivery.md).
- [Release notes A2 và nội dung PR nháp](docs/delivery/release-notes-A2.md).
- Báo cáo đồ án: [LaTeX entrypoint](docs/report/main.tex), [hướng dẫn build và thông tin tạo phẩm](docs/report/README.md). [PDF tổng hợp đã build và render](docs/report/output/main.pdf); xem QA/giới hạn tại README báo cáo.
- [Phân công toàn bộ104 issue và provenance](docs/planning/BrewLite_Task_Allocation.md): 102 Task,1 Subtask,1 Epic, theo thành viên và nhóm công việc; Sprint/giai đoạn gốc giữ trong bảng đối chiếu.
- [Use Case tổng quát vector](docs/report/assets/use-case-overview.pdf), [ERD database hiện hành](docs/report/assets/database-erd.pdf), [source/export diagrams](docs/diagrams/README.md#erd-lưu-trữ-và-use-case-tổng-quát-trong-báo-cáo).
- [API Contract v4.0 kế thừa](docs/a1-archive/api/BrewLite_API_Contract_v4.0.md), [diagram source/export](docs/diagrams/README.md), [data/API/hiện thực trong report](docs/report/sections/data-api-implementation.tex).
- [CI gates](docs/ci/README.md), [MVP Sprint 1 evidence kế thừa](docs/A2_TestReport/MVP_Sprint1_Verification_Report.md). Kết quả lịch sử không thay kiểm tra release hiện tại.

| Endpoint triển khai | Hiện trạng / bằng chứng |
|---|---|
| Frontend public HTTPS | https://brewlite-a2-three.vercel.app/ — HTTP và proxy catalog có kết quả truy cập ngày14/11/2026; không thay kiểm thử toàn luồng trình duyệt |
| Backend public HTTPS | https://brewlite-a2-api-hntn.onrender.com/ — GET / và /products trả200, catalog9 sản phẩm tại lần ghi nhận ngày14/11/2026 |
| Backend liveness | GET /200 Hello World! là liveness; /products200 có Prisma read theo source, không suy DB Internal identity hoặc readiness liên tục |
| API đọc DB | `GET /products`; kiểm tra riêng, không suy DB-ready từ `GET /` |

## Cấu trúc

```text
apps/web/             Next.js UI, Route Handler proxy, tests
apps/api/             NestJS, Prisma schema/migrations/seed, tests
.github/workflows/    CI (API CI, Web CI); chưa có CD trong baseline
scripts/              Compose preflight, verifier và tooling kế thừa
docs/                 Tài liệu A2, report, diagrams, evidence
docs/a1-archive/      Snapshot A1 bất biến và PROVENANCE.md
docker-compose.yml    Stack local A2: postgres → migrate → backend → frontend
compose.env.example   Mẫu cấu hình Compose; không chứa credential thật
```

Không có root `package.json`/npm workspace; chạy npm trong đúng app. Không sửa archive như tài liệu A2 hiện hành.

## Prerequisite

- CI dùng **Node.js 24**, Dockerfiles dùng **Node.js 26**. Chọn Node24 cho host local khớp CI; Node26 cho containers.
- Cả hai app có `package-lock.json` lockfileVersion 3, chưa khai báo `packageManager` hoặc root `engines` để pin npm riêng. Dùng npm đi kèm Node được chọn, ghi `npm --version` khi kiểm chứng; cài bằng `npm ci` trong từng app, không thay lockfile để chạy hướng dẫn.
- PostgreSQL 18 cho local theo Compose; Docker Engine + Compose v2 nếu dùng containers.
- Git; PowerShell hoặc Bash. Kiểm tra `node --version`, `npm --version`, `docker compose version` trước setup.
- Phiên bản theo lockfile: Next.js16.4.6, React19.2.8, NestJS core12.1.2 và Prisma7.10.1. Dùng lockfile của checkout đang chạy.

## Local setup bằng host (PowerShell)

Từ repository root, tạo env **chỉ khi chưa tồn tại**, không ghi đè env của người khác:

```powershell
if (!(Test-Path apps/api/.env)) { Copy-Item apps/api/.env.example apps/api/.env }
if (!(Test-Path apps/web/.env.local)) { Copy-Item apps/web/.env.example apps/web/.env.local }
```

Sửa local env riêng, không commit:

- API: `DATABASE_URL` tới PostgreSQL local riêng. Nếu muốn catalog seed, dùng DB mới tên `brewlite_seed_<suffix>`; tạo DB trước bằng công cụ PostgreSQL được phép. Env mẫu trỏ port 5433 nhưng phải khớp instance thực tế. Điền `JWT_SECRET` và `INTERNAL_SECRET` ngẫu nhiên, khác nhau.
- Local development: `NODE_ENV=development`, `PAYMENT_RECONCILIATION_ENABLED=false`; chỉ bật `MOCK_PAYMENT_ENABLED=true` nếu demo Mock được phép. Production phải có reconciliation/VNPay config hợp lệ, không dùng cấu hình local này để deploy.
- Web host: `BACKEND_INTERNAL_URL=http://127.0.0.1:3001`, `NEXT_PUBLIC_API_URL=http://localhost:3001`. Giá trị `http://backend:3001` trong env mẫu chỉ dùng cho Compose. Không dùng `NEXT_PUBLIC_AUTH_MODE=mock` để nghiệm thu auth thật.
- Không đưa `DATABASE_URL`, JWT signing key hay VNPay HashSecret vào frontend. Bảng tên biến/mục đích/nơi quản lý ở [deployment §5](docs/deployment.md#5-environment-và-vị-trí-secrets).

Terminal API, bắt đầu từ repository root:

```powershell
cd apps/api
npm ci
npm run db:generate
npm run db:validate
npm run db:migrate
npx --no-install prisma migrate status --config prisma7.config.ts
npm run start:dev
```

`db:migrate` chạy **migrate deploy** để áp dụng các migration đã có và có thể thay đổi cấu trúc database; không sinh file migration mới. Nếu cần catalog demo, dừng API rồi chạy riêng `npm run db:seed` trong `apps/api/`, chỉ trên DB demo đã qua seed guard, sau đó start lại API. Seed là thao tác ghi dữ liệu, không phải prerequisite tự động của production; không chạy trên DB đang dùng chung. Mỗi lệnh npm phải exit 0 trước khi tiếp tục, PowerShell không tự dừng cả block khi native command lỗi.

Terminal web, từ repository root:

```powershell
cd apps/web
npm ci
npm run dev
```

Mở `http://localhost:3000`, API `http://localhost:3001/`, Swagger `http://localhost:3001/api-docs`. Kiểm tra `GET /products` trực tiếp và `GET /api/backend/products` qua frontend; `{ items: [] }` là DB rỗng hợp lệ, chưa có catalog demo. Xem runbook để chuẩn bị database, seed và kiểm tra môi trường.

## Local Docker Compose

Từ repository root, dùng DB/project/volume A2 riêng; không dùng tài nguyên A1. Đọc [preflight](scripts/compose-preflight-env.ps1) trước khi chạy.

```powershell
if (!(Test-Path compose.env)) { Copy-Item compose.env.example compose.env }
# Điền local secrets và config hợp lệ trong compose.env trước các lệnh sau.
& ./scripts/compose-preflight-env.ps1
if ($LASTEXITCODE -ne 0) { throw 'Compose preflight failed' }
docker compose --env-file compose.env config --services
if ($LASTEXITCODE -ne 0) { throw 'Compose config failed' }
& ./scripts/compose-preflight-env.ps1
if ($LASTEXITCODE -ne 0) { throw 'Compose preflight failed' }
docker compose --env-file compose.env up --build -d
if ($LASTEXITCODE -ne 0) { throw 'Compose startup failed' }
& ./scripts/compose-preflight-env.ps1
if ($LASTEXITCODE -ne 0) { throw 'Compose preflight failed' }
docker compose --env-file compose.env ps
```

Preflight phải đạt trước **mỗi** lệnh Compose; không in toàn bộ `docker compose config` vì có thể lộ env. Mặc định frontend `http://localhost:13000`, backend `http://localhost:13001`, PostgreSQL loopback port `15492`. `migrate` phải exit 0 trước backend. Default backend là production mode và cần cấu hình reconciliation/VNPay hợp lệ; không dùng placeholder để mong backend tự healthy. Không tự chuyển Mock production hoặc tắt fail-fast để lách gate.

Seed Compose là thao tác riêng, sau xác minh DB demo đúng tên `brewlite_a2`, host nội bộ `postgres:5432`, đúng project và catalog được phép:

```powershell
& ./scripts/compose-preflight-env.ps1
if ($LASTEXITCODE -ne 0) { throw 'Compose preflight failed' }
docker compose --env-file compose.env run --rm --no-deps -e ALLOW_COMPOSE_DEMO_SEED=true migrate npm run db:seed
```

Seed local upsert catalog 9 sản phẩm, sửa tên/giá/metadata và topping, giữ stock hiện có, không xóa order/legacy products; từ chối sản phẩm ngoài catalog. Đây vẫn là thao tác ghi. Các seed user/coupon phụ trợ không nằm trong lệnh catalog và không phải seed production; xem [runbook](docs/deployment.md#11-runbook-scrum-117--migration-seed-và-rollback).

Render có **tooling seed demo riêng** từ #18–22, không phải db:seed local: runtime có dist-seed và script seed:render-internal, policy exact target, dry-run mặc định, Apply cần phê duyệt riêng, migration thứ 10/marker render-demo-v1. Không chạy lại seed như bước startup thông thường; không xóa marker để ép reseed. [Runbook seed](docs/deployment.md#112-migration-và-seed-an-toàn).

## Test và build

Chạy trong `apps/api/`:

```bash
npm run lint
npm run test:unit
npm run build
# Chỉ sau chuẩn bị DB test disposable và env đúng guard:
npm run test:integration
npm run test:e2e
```

Chạy trong `apps/web/`:

```bash
npm run lint
npm run test:unit
npm run build
# Bao gồm payment-confirmation-flow, cần backend/PostgreSQL test riêng:
npm test
```

API integration/E2E cần env/DB theo config từng suite; không trỏ production hay nới guard DB để chạy. Web unit dùng Node/JSDOM, không phải browser E2E. CI hiện chỉ install → lint → unit → build (API có generate Prisma), không chứng minh DB integration, Sandbox, CD hoặc production smoke. Xem [CI docs](docs/ci/README.md).

## Triển khai và vận hành

[Runbook](docs/deployment.md) hướng dẫn environment, migration/seed, backup/restore và rollback. Rollback ứng dụng và phục hồi database là hai thao tác khác nhau; revert Git không đảo migration. [Hồ sơ kỹ thuật](docs/delivery/SCRUM-117-delivery.md) giữ metadata triển khai, lịch sử kiểm chứng và checklist bàn giao.

Các giới hạn chính gồm khác biệt payment-status/rounding, phạm vi kiểm thử QueryDR Sandbox, khả năng cài đặt PWA và cấu hình vận hành cần đối chiếu thêm. Báo cáo trình bày ảnh hưởng trong mục Hạn chế; chi tiết kỹ thuật và quyết định phát hành nằm trong dossier.

## Nguồn gốc và ngữ cảnh repository

Repository này là bản tiếp nối phục vụ Assignment2 của đồ án BrewLite. Nguồn [repository A1](https://github.com/brewlite-project/brewlite/tree/1951dc124c83359556f04adb6ba3f0ee9f22fce4) được cố định tại tag `A1-final`, commit `1951dc124c83359556f04adb6ba3f0ee9f22fce4`; [archive và provenance](docs/a1-archive/PROVENANCE.md) giữ nguyên. Setup lịch sử backend/frontend xem tại nguồn đó; hướng dẫn trên dùng apps/api/apps/web hiện tại. Evidence lịch sử giữ SHA/ngày/môi trường riêng trong report và dossier, không được hiểu là test hiện tại.

## Báo cáo và tạo phẩm

[PDF báo cáo BrewLite](docs/report/output/main.pdf) trình bày bài toán, yêu cầu, thiết kế, hiện thực, kiểm thử, vận hành, quản lý dự án và phân công104 issue. [Nguồn LaTeX và hướng dẫn build](docs/report/README.md) nằm hoàn toàn trong repository này. Hình thức trình nộp không thay kết quả đánh giá hoặc nghiệm thu.
