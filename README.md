# BrewLite — Assignment 2

Ứng dụng đặt và thanh toán đồ uống: Next.js → NestJS → Prisma → PostgreSQL.
Repository: [brewlite-project/brewlite-a2](https://github.com/brewlite-project/brewlite-a2).
Nhánh tích hợp `dev`, stable/release `main`; PR tính năng và tài liệu vào `dev`.

**Baseline kiểm tra mới 14/11/2026:** workspace `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`, HEAD/PR17 `6ee4199acaab709471144295adc98ac34e9f11c3`; fetch xác nhận dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`, main `02452f228712c3501c8d27f0f1ae737ad206785d`. Working tree/index sạch trước sửa; app/config tại HEAD trùng dev. Bản report tổng hợp mới đang sửa tài liệu, chưa stage/commit/push. Các SHA91e6f99/3543a55 và kiểm tra ngày13/11 là lịch sử.

[PR #17](https://github.com/brewlite-project/brewlite-a2/pull/17) open, draft=false, base dev; 21 files ở head đã commit. CI43543439775 API/Web SUCCESS cho6ee4199, không đại diện thay đổi chưa commit. Title/body vẫn chưa cập nhật (lần trước connector403); Leader chưa review/nghiệm thu. Không cập nhật PR trong lượt này.

Báo cáo là bản tổng hợp **toàn đồ án A1 → A2**, từ bài toán/yêu cầu/thiết kế đến hiện thực, kiểm thử, Scrum, triển khai và đánh giá. Hồ sơ sẵn sàng review tài liệu không đồng nghĩa release đã phát hành/nghiệm thu. Bảng đối chiếu nội dung đề ở [report README](docs/report/README.md#đối-chiếu-báo-cáo-toàn-đồ-án-với-đề-a2-v10).

## Tài liệu và bàn giao

- [Documentation center](docs/README.md), [Task/PR traceability](docs/TRACEABILITY.md), [Requirement → UC → design → code/test matrix](docs/traceability-matrix.md).
- [SRS A2](docs/requirements/srs.md), [Checkout Use Case](docs/requirements/A2_T1.3_Checkout_Use_Case_Specification.md), [Architecture](docs/architecture/architecture.md).
- [Deployment, environment, migration/seed và rollback](docs/deployment.md).
- [Readiness, release mapping, demo, bàn giao quyền và checklist nộp](docs/delivery/SCRUM-117-delivery.md).
- [Release notes A2 và nội dung PR nháp](docs/delivery/release-notes-A2.md).
- Báo cáo nháp: [LaTeX entrypoint](docs/report/main.tex), [hướng dẫn build và giới hạn](docs/report/README.md). [PDF tổng hợp đã build và render](docs/report/output/main.pdf); xem QA/giới hạn tại README báo cáo.
- [CI gates](docs/ci/README.md), [MVP Sprint 1 evidence kế thừa](docs/A2_TestReport/MVP_Sprint1_Verification_Report.md). Kết quả lịch sử không thay kiểm tra release hiện tại.

| Endpoint triển khai | Hiện trạng / bằng chứng |
|---|---|
| Frontend public HTTPS | https://brewlite-a2-three.vercel.app/; HTTP GET 200 ngày13/11 và14/11; browser smoke NOT VERIFIED do công cụ. Domain → deployed SHA chưa bind |
| Backend public HTTPS | https://brewlite-a2-api-hntn.onrender.com/; Render Auto-Deploy Live02452f2 theo ảnh, GET / và /products200/9 items ngày13/11 và14/11 |
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

- CI dùng **Node.js 24**, Dockerfiles dùng **Node.js 26**. Chọn Node 24 cho host local khớp CI; Node 26 cho containers. Node 22.18.0 trên máy kiểm tra SCRUM-117 thấp hơn yêu cầu một số dependency, chưa dùng để xác nhận build.
- Cả hai app có `package-lock.json` lockfileVersion 3, chưa khai báo `packageManager` hoặc root `engines` để pin npm riêng. Dùng npm đi kèm Node được chọn, ghi `npm --version` khi kiểm chứng; cài bằng `npm ci` trong từng app, không thay lockfile để chạy hướng dẫn.
- PostgreSQL 18 cho local theo Compose; Docker Engine + Compose v2 nếu dùng containers.
- Git; PowerShell hoặc Bash. Kiểm tra `node --version`, `npm --version`, `docker compose version` trước setup.
- Stack resolve trong working tree hiện tại (HEAD6ee4199, app source trùng dev 0e43bcb): web Next.js 16.4.6, React 19.2.8; API NestJS core 12.1.2, Prisma 7.10.1. Next.js 16.3.8 là snapshot 7dfc7ca lịch sử; `npm ci` phải dùng lockfile của checkout hiện tại, không trộn hai baseline.

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

Mở `http://localhost:3000`, API `http://localhost:3001/`, Swagger `http://localhost:3001/api-docs`. Kiểm tra `GET /products` trực tiếp và `GET /api/backend/products` qua frontend; `{ items: [] }` là DB rỗng hợp lệ, chưa có catalog demo. Các lệnh setup này được đối chiếu source, **chưa được chạy lại trong SCRUM-117**.

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

## Deployment, release và giới hạn

[Deployment](docs/deployment.md) tách target design và evidence thực: FE Vercel URL đã có, Render Live được báo cáo trong PR26; backend URL/Auto-Deploy02452f2 và DB tier/region/network đã có ảnh; actual Internal usage/runner vẫn thiếu. CI main/API-Web success trước event Render phù hợp cấu hình After CI Checks Pass. [Delivery readiness](docs/delivery/SCRUM-117-delivery.md) là nơi ghi evidence và người tiếp nhận; [release notes](docs/delivery/release-notes-A2.md) còn nháp. Rollback app và phục hồi DB là hai việc riêng; revert Git không đảo migration.

Tại HEAD 91e6f99, frontend có helper gọi payment-status route chưa có trong backend; UI `/payment` và `/order-confirmation` hiện polling `GET /orders/me`, nên không suy toàn bộ Return UI hỏng từ gap API-03. PR26 báo payment Sandbox PAID/SUCCESS/+10 qua Order History; chưa chứng minh riêng IPN/QueryDR lost-IPN, và một giao dịch vẫn cần manual reconciliation. PR25 thêm diagnostics, không sửa network timeout. [Nguồn, tác động và quyết định release cần xác nhận](docs/delivery/SCRUM-117-delivery.md#phạm-vi-release-gap-và-quyết-định-cần-xác-nhận) được ghi riêng: không tự đóng gap, cũng không mặc định hai vấn đề chặn toàn bộ release. ADR lịch sử chỉ chấp nhận giới hạn QueryDR trong A1, không miễn A2.

[8 AC SCRUM-117 do người dùng cung cấp](docs/delivery/SCRUM-117-delivery.md#2-readiness-theo-acceptance-criteria) và [đề A2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) là nguồn đối chiếu. [Checklist nộp theo §9.1 của đề](docs/delivery/SCRUM-117-delivery.md#7-checklist-nộp-bài-và-khả-năng-truy-cập-của-người-chấm) đã có mapping tạo phẩm; chưa phải kết luận đã đủ evidence. Hướng dẫn rollback là yêu cầu; rehearsal chưa thực hiện và không được đề v1.0 yêu cầu. HTTP FE reachability có evidence mới ở delivery §13; browser, direct backend/DB readiness, DB external policy và observed CD chưa đủ evidence; không dùng CI/target design thay thế. [CI push run 42782530478](https://github.com/brewlite-project/brewlite-a2/actions/runs/42782530478) tại 7dfc7ca đã success, chỉ chứng minh lint/unit/build trong workflow hiện có.

## Provenance A1

A1 repository: [brewlite-project/brewlite](https://github.com/brewlite-project/brewlite). `A1-final` peeled commit `1951dc124c83359556f04adb6ba3f0ee9f22fce4` chỉ là provenance, không phải release A2. Giữ nguyên [archive provenance](docs/a1-archive/PROVENANCE.md) và toàn bộ archive.

Các test, IPN Sandbox và quyết định Deferred A1 chỉ có giá trị ở source/môi trường/thời điểm của chúng: xem [SCRUM94 evidence lịch sử](docs/a1-archive/verification/SCRUM94_Verification_Evidence.md) và [ADR QueryDR](docs/a1-archive/decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md). Không chuyển các kết quả đó thành nghiệm thu A2. Thông tin 6 thành viên/MSSV/GVHD đã có nguồn báo cáo A1 và được kế thừa trong report A2; thay đổi roster (nếu có), phân công vận hành/tiếp nhận và chỉ dẫn nộp bổ sung vẫn cần Leader xác nhận.

## Bổ sung evidence và PDF ngày14/11/2026

**Cập nhật tiếp 14/11/2026:** HEAD91e6f99/dev0e43bcb giữ nguyên, 10 docs unstaged đầu vào được bảo toàn. Backend https://brewlite-a2-api-hntn.onrender.com/ có ảnh Render Auto-Deploy Live02452f2 (fullSHA02452f228712c3501c8d27f0f1ae737ad206785d), deployed field13/11/2026 08:39:19Z. GET mới / và /products200 lúc16:24:59Z ngày13/11, catalog9 items; GET không xuất processSHA. DB Free18/Singapore/1GB/Available, expiry10/12/2026; external3 /32 restricted, chưa private-only. Bỏ Edge/Computer Use theo yêu cầu; Người dùng đính chính ngày 14/11/2026: Leader chưa kiểm tra/nghiệm thu SCRUM-117. Evidence và các giới hạn tại dossier §14.

[PDF A2](docs/report/output/main.pdf), [kết quả build/QA](docs/report/README.md#kết-quả-build-và-qa-ngày-14112026), [evidence Render/AC](docs/delivery/SCRUM-117-delivery.md#14-evidence-render-backup-và-pdf--cập-nhật-14112026). Backup/restore mới là hướng dẫn, chưa thực thi; xem deployment §11.5/11.6. PDF được build không đồng nghĩa release đã nghiệm thu.
