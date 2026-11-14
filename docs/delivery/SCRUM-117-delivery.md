# SCRUM-117 / A2-T5.4 — Readiness, demo và bàn giao

**Trạng thái: DRAFT — hồ sơ chuẩn bị review; chưa phát hành, chưa nghiệm thu, không đề xuất Jira Done.**

**Snapshot trước khi cập nhật PR17 ngày 14/11/2026:** các mô tả HEAD/index/remote và kiểm tra bên dưới ghi tại lúc chuẩn bị bộ tài liệu. Người dùng đã giao quyền hoàn thiện, gồm commit/push hồ sơ và cập nhật PR17. Xem head, CI và trạng thái review hiện hành trên PR17; quyền này không thay kết quả nghiệm thu của nhóm.

**Baseline kiểm tra 13/11/2026:** workspace `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`; `origin/dev` sau fetch lượt trước và đối chiếu lại là `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Đầu lượt 13/11 khoảng14Z working tree/index sạch. Lượt 23:20+07 tiếp nhận nguyên 10 docs unstaged; ngày14/11 tiếp tục PDF, index vẫn giữ nguyên. Source ứng dụng/config tại HEAD trùng origin/dev; diff ba chấm chỉ 10 tài liệu SCRUM-117. Merge dev trong HEAD là lịch sử đã có trước lượt này, không phải thao tác vừa thực hiện.

[PR #17](https://github.com/brewlite-project/brewlite-a2/pull/17) đã tồn tại, **open, draft=false**, head remote `3543a55d4fed63cd343f5da59d28500f124490be`, base `dev` (API snapshot base SHA `5021743`). Local HEAD đi trước remote branch 20 commits. PR files API hiện liệt kê đúng 10 file docs; nội dung local mới chưa có trên PR. Chưa có review trong API trả về. Chỉ chuẩn bị nội dung cập nhật PR, không tạo trùng/chuyển Draft/push trong lượt này.

**Cách đọc lịch sử:** §1 và các evidence E117-01/R/C, §9–12 giữ nguyên ngày/SHA/môi trường của lần kiểm tra cũ. Những câu “chưa commit/chưa có PR/9 migrations/chưa có URL” trong các snapshot đó chỉ đúng lúc ghi nhận. Hiện trạng dùng §2–4 và §14; §13 giữ snapshot trước khi có backend URL/ảnh Render; không copy từ worktree TEMP.

## 1. Phạm vi và snapshot trước khi sửa (lịch sử 10/11/2026)

- Ngày kiểm tra: 10/11/2026, múi giờ UTC+07. Evidence mới thuộc workspace Windows, không thuộc production.
- Repository/remote: `https://github.com/brewlite-project/brewlite-a2.git`.
- Branch ban đầu `SCRUM-102-normalize-requirements`, HEAD `7efaf64dd2788a1370a8fd5259646f844289e990`, working tree sạch. Không sửa branch này.
- `git ls-remote origin refs/heads/dev` xác nhận trực tiếp remote lúc khoảng 19:44–19:51: `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`. Remote-tracking cũ là `b542ee4`; đã fetch, không pull/merge.
- Branch tài liệu `SCRUM-117-production-release-delivery` tạo từ đúng `origin/dev` trên. Source kiểm tra trong phần còn lại là **7dfc7ca**; nội dung SCRUM-117 chưa có commit.
- Đã đọc AGENTS.md, planning, requirements, architecture, deployment, CI, scripts/package manifests, Docker/Compose, env **mẫu**, migrations/seed và LaTeX. Không đọc populated env/credential.
- **Nguồn AC:** 8 Acceptance Criteria của SCRUM-117 đã được người dùng cung cấp và xác nhận; dùng trực tiếp tại §2, không yêu cầu lại bản export Jira. Lượt tiếp tục đã tìm và đọc [Assignment2-BrewLite.pdf — v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) trong Drive nguồn môn học: SGU/Khoa CNTT, học kỳ I 2026–2027; metadata modified `2026-10-13T01:46:22.978Z`, 87.063 bytes. §7.4 là delivery, §8.1 là traceability, §9.1 là checklist nộp bài. Nếu giảng viên có bản thay thế mới hơn, cần đối chiếu phiên bản đó; không còn yêu cầu gửi lại bản v1.0 đã tìm được. Template SGU trong Downloads là mẫu báo cáo riêng, không phải rubric.

## 2. Readiness theo Acceptance Criteria

Cập nhật 14/11/2026, Windows/GitHub read-only; GET/deployment giữ thời điểm riêng ngày 13/11. Nguồn là đúng 8 AC người dùng cung cấp, đối chiếu đề A2 v1.0. VERIFIED chỉ trong phạm vi đã chứng minh; NOT VERIFIED là chưa đủ bằng chứng, không có nghĩa đã chạy và thất bại. Hồ sơ chưa nghiệm thu.

| AC | Evidence và kết quả | Commit / môi trường / thời điểm | Trạng thái | Việc tiếp theo / dependency |
|---|---|---|---|---|
| 1. Frontend production HTTPS hoạt động | URL người dùng: https://brewlite-a2-three.vercel.app/; Vercel commit status success tại main 02452f2. HTTP GET read-only xem §13; bỏ Edge/Computer Use theo yêu cầu; người dùng đính chính 14/11: Leader chưa kiểm tra/nghiệm thu | URL hiện tại; status 02452f2 lúc 2026-11-13T08:38:39Z; audit 13/11 | NOT VERIFIED toàn AC; có deployment/HTTP evidence một phần | SCRUM-116 bind domain → deployment ID/SHA, ghi phạm vi review thực tế khi diễn ra và quyền người chấm; không yêu cầu chạy lại browser trong lượt này |
| 2. Backend API và health endpoint truy cập được | Backend https://brewlite-a2-api-hntn.onrender.com/: GET /200 Hello World!, /products200 JSON9 items; source liveness và Prisma read tách riêng; ảnh Auto-Deploy Live02452f2 | Render deployed field2026-11-13T08:39:19Z; GET kế thừa16:12:30/31Z, GET mới16:24:59Z; fullSHA §14 | VERIFIED phạm vi public API/liveness/catalog tại thời điểm probe | GET không xuất version; chưa xác minh process SHA phục vụ từng request, DB identity/Internal usage hoặc mọi failure case |
| 3. PostgreSQL production cấu hình phù hợp, không công khai trực tiếp | Ảnh DB Free18/Singapore/1GB/Available, expiry10-12-2026; DB3 /32 giao với workspace/environment0.0.0.0/0. External restricted, chưa private-only | Ảnh người dùng, capture time chưa rõ, đọc13/11; source/deploy02452f2 riêng | PARTIAL / NOT VERIFIED AC3 | Xác nhận rule đã lưu/chủ/thời hạn, chốt private-only hoặc việc chấp nhận admin external restricted; xác nhận backend dùng Internal, runner/backup/restore |
| 4. Có release/tag, release notes và hướng dẫn rollback | Notes/runbook đã cập nhật; GitHub Releases API trả []; local tag chỉ A1-final. Main #26/#28 là merge promotion, chưa phải A2 tag/release | main 03668e3/02452f2; API đọc 13/11; docs local | NOT VERIFIED | Chốt release SHA/tag, bind FE/BE rollback targets theo tier/compatibility. A2-v1.0.0 chỉ đề xuất; rehearsal khuyến nghị |
| 5. README và tài liệu bàn giao đầy đủ | 10 file docs có trong HEAD và PR #17; đã đồng bộ seed/migration/CD/evidence, có demo/Review/Retro templates và report source/PDF 53 trang đã build/render | HEAD 91e6f99 + unstaged docs / Windows / 13/11 | NOT VERIFIED toàn AC; hồ sơ sẵn sàng review tài liệu | Bổ sung metadata vận hành còn thiếu và review tài liệu; phân công tại §6 là đề xuất tổ chức của nhóm |
| 6. Có bằng chứng demo và Sprint Review/Retrospective | #26 là báo cáo kết quả Sandbox một scenario; SCRUM-112 có ảnh/report local lịch sử. Chưa tìm thấy video/biên bản Review/Retro A2 cuối | #26 13/11; report 34cbbc0; audit 13/11 | NOT VERIFIED | Nhóm/Leader cung cấp biên bản và video thật, thời gian/increment/feedback; §5 là mẫu chuẩn bị |
| 7. Các tạo phẩm bắt buộc có trên repository | SRS/diagrams/source/CI và 48 FR + 49 NFR matrix có trong checkout/PR; checklist đề §9.1 tại §7. CD end-to-end và final demo còn mở; PDF local đã build/render, chưa đưa lên repository remote | HEAD 91e6f99, dev 0e43bcb; PR17 remote 3543a55 / 13/11 | NOT VERIFIED toàn bộ | Hoàn tất checklist, review PDF đã build/render, evidence release/CD/demo và phiên bản nộp; cập nhật PR khi được phép |
| 8. Có PR review và nghiệm thu | PR #17 open không phải Draft, chưa có review; #26/#27 có APPROVED riêng, không thay acceptance SCRUM-117 | #26 review 2026-11-13T07:26:07Z; #27 08:20:00Z; PR17 đọc 13/11 | NOT VERIFIED | Sau review local/cho phép Git: cập nhật PR17 vào dev, reviewer/Leader quyết định nghiệm thu |

Không có AC nào được ghi “đã test thất bại” chỉ từ thiếu evidence/công cụ. CI không thay CD; payment success không chứng minh QueryDR; agenda không thay cuộc họp. SRS AC-OPS-07 cần xác nhận cửa áp dụng, không tự thêm rollback rehearsal thành gate.

## 3. Sổ bằng chứng

Mọi evidence bổ sung phải có: ID, UTC timestamp, environment, source SHA **FE và BE**, artifact/deploy ID, cách kiểm tra, expected/actual, kết quả, người thực hiện, link cho reviewer/người chấm và quyền truy cập. Redact JWT, signed VNPay URL, connection string, webhook/token và dữ liệu cá nhân trước khi lưu.

| ID | Loại / cách thu | Commit, môi trường, thời điểm | Kết quả và giới hạn |
|---|---|---|---|
| E117-01 | Mới: git status/remote/rev-parse, ls-remote, fetch; tạo branch | 7dfc7ca / Windows repo / 10-11-2026 khoảng 19:44–19:51 +07 | Remote dev đối chiếu trực tiếp; working tree đầu vào sạch; không commit/push |
| E117-02 | Mới: đọc source workflow, controller, Dockerfile, 9 migration directories, seed | 7dfc7ca / static / 10-11-2026 | Xác nhận CI có, CD chưa có trong tree; / là liveness; runtime không có Prisma CLI; không thực thi migration |
| E117-03 | Mới: GitHub connector search PR theo SCRUM-114/115/116; search repo PR, tối đa 40 | GitHub live / 10-11-2026 khoảng 19:48–19:51 +07 | Không trả PR 114/115/116; danh sách trả #1–15. Không chứng minh không có công việc ngoài repo/quyền truy cập |
| E117-04 | Mới: connector fetch_commit_workflow_runs cho 7dfc7ca | GitHub live / 10-11-2026 | Trả rỗng; wrapper chỉ lọc pull-request-triggered runs, trang đầu. **Không kết luận push CI không chạy** |
| E117-05 | Mới: git ls-remote --tags và --heads với mẫu 114/115/116/117 | GitHub live / 10-11-2026 khoảng 19:51 +07 | Chỉ A1-final (peeled 1951dc1); không trả branch theo mẫu. Không kiểm chứng danh sách GitHub Releases bằng API |
| E117-R1 | Mới lượt review tiếp: GitHub REST `pulls?state=all&per_page=100&page=1`, page 2 và commit search qua GitHub connector; đọc body/diff PR liên quan, không chỉ key | GitHub live / 10-11-2026; source dev 7dfc7ca | 15 PR #1–15, tất cả closed, #13 chưa merge; 14 PR khác merged; page 2 rỗng. Không thấy PR cho SCRUM-114/115/116. Các PR #6/#9/#12/#15 liên quan nhưng không tự gán cho ba task này |
| E117-R2 | Mới: GET GitHub REST `actions/runs?per_page=100`, run details và jobs qua GitHub connector | [Push CI 42782530478](https://github.com/brewlite-project/brewlite-a2/actions/runs/42782530478), SHA **7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb**, event push/dev; `2026-11-10T08:25:31Z` → `08:27:13Z`; thu lại 10-11 | completed/success; API CI và Web CI đều success, install/lint/unit/build, API có Prisma generate. **VERIFIED CI trên baseline**, không integration/E2E/CD; không thay CI cho docs SCRUM-117 chưa commit |
| E117-R3 | Mới: run details/jobs qua GitHub connector | [PR CI 42780158363](https://github.com/brewlite-project/brewlite-a2/actions/runs/42780158363), SHA **e942cbe9be479e53ba76f8c3bf99e3e489db93f6**, event pull_request, branch SCRUM-112; `2026-11-10T08:07:17Z` → `08:08:49Z`; thu lại 10-11 | completed/success, cùng hai CI jobs. SHA PR khác SHA merge 7dfc7ca và source runtime 34cbbc0 được báo cáo SCRUM-112 kiểm tra; không đồng nhất ba version |
| E117-R4 | Mới: REST `releases?per_page=100`; đối chiếu `.github/workflows/ci.yml` và list Actions | GitHub live / 10-11-2026, repository A2 | Releases trả rỗng; 11 runs trả về đều workflow CI, không thấy CD/deploy trong tập kết quả. Không xác minh dashboard/provider integrations ngoài GitHub |
| E117-C1 | Mới lượt tiếp tục: Drive search BrewLite/Assignment 2 và fetch text của PDF đã xác định MIME/metadata | Đề A2 v1.0, ID `1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi`; thu ngày 10-11, khoảng 22:28 +07 | Đã đọc toàn bộ text đề; checklist §9.1 và yêu cầu trace §8.1 có nguồn. Chưa render PDF đề; không dùng text extraction để khẳng định layout |
| E117-C2 | Mới: làm lại repo PR search/read metadata và REST Actions/releases | GitHub live / 10-11, khoảng 22:28–22:31 +07; source dev vẫn 7dfc7ca | Vẫn 15 PR #1–15; chưa có PR SCRUM-117 hoặc PR xác nhận 114/115/116. REST Actions trả total_count=11, push 42782530478 success đúng full SHA 7dfc7ca; releases rỗng. Connector deployments/tags endpoint bị từ chối INVALID_ARGUMENT, **không phải production fail** |
| E117-C3 | Mới: lấy metadata/jobs CI failure và CI success | [Failure 42626286395](https://github.com/brewlite-project/brewlite-a2/actions/runs/42626286395), SHA `779dacdeabc0cea6a69c1ff52c494dce7e16506b`; `2026-11-09T13:31:55Z`–`13:33:12Z`; thu lại 10-11 | Web CI lint failure, unit/build skipped; API CI success. So với [success 42629605254](https://github.com/brewlite-project/brewlite-a2/actions/runs/42629605254) tại SHA `5472f03ee46643b3e51439741515a7e5b0dbdbdc`, có bằng chứng CI phát hiện lỗi/phục hồi theo đề §6.4. Chưa chứng minh branch protection thực sự chặn merge hoặc đã rà mọi CI log chứa secret |
| E112-H | Kế thừa: [MVP Sprint 1 report](../A2_TestReport/MVP_Sprint1_Verification_Report.md) + ảnh | Source 34cbbc088117d7a4908d07a66cfbd03b0c905dea; local, thời điểm theo report | Không rerun trong SCRUM-117; không production. Report gọi test:unit là 6 files nhưng package script liệt kê 5: cần QA giải thích trước dùng tổng số làm gate |
| EA1-H | Kế thừa: [ADR QueryDR](../a1-archive/decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md), [SCRUM94](../a1-archive/verification/SCRUM94_Verification_Evidence.md) | A1, source/time theo archive | IPN lịch sử và local/synthetic test; không đóng gap QueryDR A2 bằng chứng này |

### Phạm vi release, gap và quyết định cần xác nhận

| Nguồn / vấn đề | Implementation / test / acceptance | Tác động và đầu vào còn thiếu |
|---|---|---|
| Payment-status: SRS FR-34/§8, API v4 §5, payment.service.ts:2153, payments controllers | Tại HEAD 91e6f99 (= dev 0e43bcb cho app), helper fetchPaymentStatusApi gọi GET /payments/:paymentId/status nhưng backend chưa có route tương ứng. Helper được re-export ở order-confirmation.service.ts; chưa thấy component gọi helper này. PaymentPageView.tsx:616/818 và order-confirmation/page.tsx:119/193 polling GET /orders/me | Gap endpoint/contract API-03 vẫn mở; caller dùng helper sẽ không có route. Không suy toàn bộ Return UI mất server truth: hai UI hiện dùng orders/me. Order History success không đóng gap API-03. Leader/API owner chốt task hoặc giới hạn A2 bằng văn bản |
| QueryDR: ADR A1 APPROVED 03/11/2026; PR #25/#26 | Có client/scheduler và tests; #25 thêm diagnostics DNS/network/TLS/timeout/HTTP/gateway, không đổi signature/state/retry/timeout. #26 không có log QueryDR thành công | Sandbox QueryDR/lost-IPN recovery NOT VERIFIED. ADR A1 chỉ deferred sang A2/SCRUM-95, không miễn A2. Leader/QA xác nhận cửa nghiệm thu và xử lý timeout |
| VNPay payment success theo PR #26 | PR body báo Sandbox E2E PASS, Order PAID, Payment SUCCESS, Loyalty +10 qua Order History; backend Render Live source 2216b7a, FE Vercel Live. Review APPROVED cho patch, chưa phải nghiệm thu SCRUM-117 | Ghi nhận **PASS theo người báo cáo cho scenario payment success**, chưa có transaction/event/log/time/FE SHA kèm theo để tái kiểm chứng. Không suy đã xác minh IPN ACK/HMAC/idempotency hoặc QueryDR |
| Giao dịch Sandbox trước còn manual financial reconciliation (#26) | Chỉ biết flagged, chưa có ID đã che dữ liệu, time/amount, gateway outcome, internal state, owner hay quyết định xử lý trong body/comments | Chưa xác định root cause hoặc đánh dấu resolved/refunded. Có rủi ro chênh gateway–Order/Payment; không tự retry/finalize/hoàn tiền. Leader/QA và người vận hành được xác nhận cung cấp kết quả đối soát, phạm vi ảnh hưởng và quyết định release |
| Mock demo theo đề §7.1 và policy | Source chặn Mock khi NODE_ENV=production; Sandbox success không tự thay requirement Ví/Thẻ mô phỏng | Leader/SCRUM-114 chốt môi trường demo Mock được phép và phạm vi Sandbox bổ sung, không bật Mock production |
| Hosting/CD theo #27 và ảnh R117-I1 | Vercel/Render có evidence provider; ADR-005 vẫn Proposed trong nguồn. apps/api/README.md ghi main, apps/api, Dockerfile, After CI Checks Pass; ảnh R117-I1 xác nhận một Auto-Deploy Live source02452f2 | VERIFIED một lần CD backend theo ảnh và CI §14. SCRUM-116 cần deploy events/artifact/image version, runner, smoke/failure handling; tier/network/rollback target chưa có |

### Evidence các task phụ thuộc sau tìm kiếm rộng (13/11/2026)

Đã đọc title/body/diff và comments PR liên quan, không chỉ Jira key. Không tìm thấy PR xác nhận SCRUM-114/115 độc lập trong tập PR #1–28; không có nghĩa task chưa làm ở nguồn ngoài quyền truy cập.

| Task | Evidence hiện có | Phần vẫn cần xác nhận |
|---|---|---|
| SCRUM-114 — MVP | #15/SCRUM-112 report local source 34cbbc0; #24 mô tả catalog Render; #26 báo Sandbox success + Order History. Source hiện có auth/cart/orders/payment, status route vẫn gap | Scope/PR/commit/giới hạn đã được duyệt cho 114; mapping phần kế thừa, lựa chọn Mock/Sandbox; không tự coi file code là nghiệm thu |
| SCRUM-115 — integration/E2E | #25 body: focused 38/38, full Vitest 479 PASS, 6 opt-in PostgreSQL integration skipped, build/TypeScript PASS; không nêu OS/Node/DB/time run. #26 Sandbox payment success được báo cáo; #15 Products E2E local lịch sử | Report integration/menu→confirmation đúng SHA/environment/scenarios/results; IPN/QueryDR evidence riêng. Không lấy 479 PASS làm PostgreSQL integration PASS |
| SCRUM-116 — CD/deploy | #18–23 seed/guard/TLS code, #24 migration/catalog runtime claim; #27 cấu hình auto-deploy trong README; GitHub CI success và Vercel status có link ở §13 | Backend origin/IDs/SHA hiện tại, actual runner/log migration, image tag/digest, CD event sau checks + smoke/failure path, tier/DB policy/backup/rollback targets |

Các đầu mối ở đây là **dependency theo task**, chưa có tên executor/receiver đã xác nhận. Không gán người làm hosting/DB chỉ từ tác giả PR hoặc vai trò Leader.

## 4. Release/tag → source → deployments → runs → smoke

| Release / nguồn | Source SHA | Frontend deployment | Backend deployment | CI/CD | Smoke / khác biệt |
|---|---|---|---|---|---|
| A1-final — provenance | 1951dc124c83359556f04adb6ba3f0ee9f22fce4 | Không mapping A2 | Không mapping A2 | Không dùng làm CI A2 | Archive giữ nguyên |
| Dev lịch sử | 7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb | Chưa xác minh | Chưa xác minh | CI 42782530478 success | Report runtime 34cbbc0 khác SHA; không production |
| PR16 merge lịch sử | 5021743e99d73c2ce795df72ee5aaa90b04bb0da | Chưa xác minh | Chưa xác minh | CI 42846397766 success | Chỉ Next/proxy; giữ giờ/SHA §12 |
| Promotion #24 | 1b394f1dae75fd0a11c1b1b3f4390a588dedf18f (main); source dev 95906b5 | Vercel follow-up theo body | Render deployed theo body; ID/SHA deployed không ghi | CI 43230923812 success 2026-11-12T13:49:03Z | #24 báo 10 migrations, marker, GET products 200/9 products và detail/toppings 200. Không phải smoke mới tại merge SHA |
| Payment scenario #26 trước merge | 2216b7a246b21491cf81cd2f2196f907c0aa7a98 | Vercel Live theo body, SHA chưa có; Preview Ready 36hKnqgZCX4NvuX8o24VgDUPW8W9 tại 06:50:37Z không phải production-domain proof | Render Live 2216b7a theo body; ID/origin chưa có | CI 43372690322 success 2026-11-13T05:32:33Z | Payment PAID/SUCCESS/+10 theo body, chưa IPN/QueryDR proof. Manual reconciliation còn mở |
| Promotion #26 | 03668e36b85a9958d5a6e1cd2b468295fdb0fb2d (main) | ID/SHA chưa bind | ID/SHA chưa bind | CI 43385759238 success 07:26:20Z | Body nói final alignment/smoke sau merge; không chuyển test 2216b7a sang merge SHA |
| PR27 / dev hiện tại | 0e43bcb80f64d6a5fa558cd80f71a199029535d0; head 7dbad80602fb936b35e375beafe9f99739b0fb33 | Preview Ready 614zH4B1wpb5aWFCgtTMAhHwkwx8 (08:09:14Z); không production | README mô tả auto-deploy main, chưa observed event | CI head 43390995680 và push/dev 43392423041 success 08:09:18Z/08:20:14Z | Chỉ README đổi trong #27; không có CD workflow mới |
| Promotion #28 / main hiện tại | 02452f228712c3501c8d27f0f1ae737ad206785d | Vercel status success, [deployment AayabZWzjhJAquCMYXjoaDppJWsi](https://vercel.com/brewlite-a2/brewlite-a2/AayabZWzjhJAquCMYXjoaDppJWsi), updated 08:38:39Z; domain alias chưa bind | Render Auto-Deploy Live02452f2, dep-dbrcpdu8bjmc73bl81u0; ảnh deployed field08:39:19Z; URL backend đã có | [CI 43394783298](https://github.com/brewlite-project/brewlite-a2/actions/runs/43394783298) success, API end08:38:47Z/Web end08:39:15Z | HTTP ở URL người dùng không chứng minh chính SHA này; backend GET mới / và /products200 lúc16:24:59Z; browser bỏ theo yêu cầu |
| Local SCRUM-117, PR17 cập nhật đang chuẩn bị | 91e6f99bfd02353616b2e481fe613b7ea91118af + docs unstaged | Không deploy | Không deploy | PR17 CI cũ 42875834011 trên 3543a55, không cho local mới | App/config trùng dev 0e43bcb; remote PR17 head còn 3543a55 |
| A2-v1.0.0 — chỉ tên đề xuất | Chờ SHA được nhóm duyệt | Chờ deployment/domain/SHA | Chờ deployment/image/SHA | Chờ CI/CD đúng version | Chờ smoke và nghiệm thu |

Giờ trong các dòng 13/11 là UTC, lấy từ GitHub; provider IDs là link an toàn, không phải credential. Release API trả rỗng, local tags chỉ A1-final; không tạo tag/release. Các status/deploy assertions không thay browser/DB policy hoặc migration runner evidence. [Notes và PR17 body nháp](release-notes-A2.md).

## 5. Demo và Scrum evidence (chưa thực hiện)

Điều kiện đầu vào: Leader chốt scope/contract, deployment mapping, tài khoản demo cấp riêng, dữ liệu được phép, QA xác nhận payment path, quyền tạo giao dịch Sandbox riêng. Lượt SCRUM-117 **không tạo tài khoản, đơn, giao dịch hoặc thay đổi production**.

| Thời lượng dự kiến | Bước trình bày | Expected result | Evidence cần thu |
|---|---|---|---|
| 1 phút | Mở README, release mapping, FE HTTPS ở browser không đăng nhập provider | Đúng SHA, UI tải, không interstitial/mixed content | URL sạch, screenshot, giờ/viewport |
| 1 phút | Menu, chi tiết, size/topping; thêm/sửa giỏ trên client | Giá/giới hạn theo contract, loading/empty/error trình bày khi có fixture được duyệt | Video thao tác và API public đọc DB |
| 2 phút | Auth → tạo đơn tại demo environment được phép | JWT/ownership server-side; tổng tiền từ backend | Step log đã lọc dữ liệu, SHA/environment |
| 2 phút | VNPay Sandbox đã được cho phép, Return và authoritative outcome | Return không tự finalize; xác minh riêng nguồn IPN/QueryDR và Payment/Order nhất quán | Gateway + callback + DB evidence; nêu rõ UI polling orders/me, API-03 status gap và quyết định scope, không lấy một success scenario làm mọi scenario PASS |
| 1 phút | Xác nhận/lịch sử và giới hạn | UI phản ánh trạng thái thật; nêu gap chưa đóng | Video, expected/actual |
| 1 phút | CI/CD, rollback và bàn giao | Chỉ trình bày run/rehearsal thực có | Link run/deploy, runbook; chưa thử thì nói chưa thử |

Không dùng Mock trong NODE_ENV=production; local Mock phải gắn nhãn local. QueryDR lost-IPN scenario chỉ demo nếu được duyệt và đã chuẩn bị môi trường phù hợp, không cố tình phá production.

**Sprint Review agenda chờ tổ chức:** xác nhận thời gian/người dự; đối chiếu AC với increment; demo; ghi feedback nguyên văn/tóm tắt đúng ý; reviewer quyết định accepted/rejected/pending; ghi action, owner, hạn và link evidence. **Chưa có biên bản**.

**Retrospective agenda chờ tổ chức:** thu điều làm tốt/vấn đề/căn nguyên; chọn action cải tiến có owner và hạn; xác nhận cách theo dõi. Không điền ngày họp, thành viên, feedback hoặc approval trước sự kiện.

| Tạo phẩm Scrum | Vị trí chuẩn dự kiến | Hiện trạng |
|---|---|---|
| Video/ảnh/log demo cuối | Link kho evidence do Leader xác nhận, dẫn tại bảng này | Chưa được cung cấp |
| Sprint Review / Retrospective | Link biên bản do nhóm xác nhận, dẫn tại bảng này | Chưa được cung cấp; agenda trên chỉ để chuẩn bị |

### Mẫu ghi nhận demo end-to-end

**TEMPLATE — chưa thực hiện.** Người chạy điền sau thao tác thật; chỉ thực hiện các bước ghi auth/order/payment sau khi được cấp quyền riêng trên môi trường được chỉ định. Không dùng mẫu như log test đã chạy.

| Trường | Dữ liệu cần điền |
|---|---|
| Thời gian bắt đầu/kết thúc (UTC và múi giờ hiển thị) | Chưa điền |
| Người chạy / người quan sát | Chưa xác nhận |
| Environment và quyền thao tác ghi | Chưa xác nhận; production chỉ read-only trong lượt SCRUM-117 này |
| Release/tag, source FE/BE và deployment IDs | Chờ mapping §4 |
| URL FE/BE sạch, browser/version/viewport | Chưa điền; không lưu signed URL/token |
| Video/log/screenshot và quyền người chấm | Chưa có link |

| Bước ghi nhận | Expected | Actual (điền sau khi chạy) | Result / evidence timestamp |
|---|---|---|---|
| Mở UI/menu → API/DB | UI/asset tải được; dữ liệu public thực, không trang bảo vệ hosting | Chưa thực hiện | NOT RUN |
| Chọn size/topping, sửa giỏ | Giá/giới hạn theo contract, phản hồi lỗi rõ | Chưa thực hiện | NOT RUN |
| Auth → tạo đơn trong environment được phép | JWT/ownership server-side, amount từ backend | Chưa được phép/chưa thực hiện | NOT RUN |
| Payment theo scope đã duyệt | Ví/Thẻ mô phỏng ở environment cho phép hoặc Sandbox theo quyết định tương ứng; không suy Return là thành công | Scope chờ quyết định; chưa thực hiện | NOT RUN |
| Xác nhận/trạng thái/lịch sử | Outcome từ server, dữ liệu đúng người dùng, không báo paid sai | Chưa thực hiện; status gap xem §3 | NOT RUN |

### Mẫu Sprint Review

**TEMPLATE — không phải biên bản đã tổ chức.** Điền ngày/múi giờ, Sprint/Goal, thành viên thực dự, increment SHA/environment và link demo. Tại buổi Review, dùng từng AC ở §2 để ghi evidence và feedback; decision thuộc reviewer/Leader, không pre-fill Accepted.

| AC / scenario | Evidence được xem | Feedback thực tế | Quyết định reviewer | Action / người nhận / hạn |
|---|---|---|---|---|
| Chưa điền | Chưa có | Chưa có | Chưa quyết định | Chưa xác nhận |

Sau buổi họp: người ghi biên bản xác nhận link/thời gian và người review xác nhận quyết định; tách backlog follow-up khỏi phần increment đã chấp nhận. Video demo có thể được dẫn tại đây, nhưng không thay biên bản feedback/quyết định Review.

### Mẫu Sprint Retrospective

**TEMPLATE — không phải sự kiện đã diễn ra.** Điền ngày/múi giờ, người thực dự và khoảng Sprint được nhìn lại; ghi quan sát có căn cứ thay vì tự đặt feedback.

| Quan sát / evidence | Nguyên nhân đã thống nhất | Action cải tiến | Owner đã nhận | Hạn / cách đo kết quả |
|---|---|---|---|---|
| Chưa ghi nhận | Chưa thống nhất | Chưa chốt | Chưa xác nhận | Chưa xác nhận |

Lưu link biên bản thực và quyền đọc; action cần người nhận xác nhận. Không coi agenda, video hệ thống hay bảng trống này là Retrospective evidence.

## 6. Tiếp nhận quyền vận hành

**Phương án bàn giao trong nhóm:** nhóm BrewLite tiếp tục quản lý dự án; các thành viên đang có quyền nền tảng duy trì công việc trong phạm vi được giao. Bảng dưới là mẫu phân công và chuyển quyền khi cần. Chưa có tên cá nhân được xác nhận. Việc có người tiếp nhận riêng hoặc ký biên bản riêng là khuyến nghị tổ chức, không phải AC mới của SCRUM-117. Khi chưa có thay đổi người quản lý, bàn giao gồm source, hướng dẫn vận hành, báo cáo và evidence cho nhóm/reviewer.

| Tài nguyên | Người phụ trách đã xác nhận | Người tiếp nhận đã xác nhận | Cách cấp quyền cần thống nhất | Kiểm tra đề xuất khi chuyển quyền |
|---|---|---|---|---|
| Frontend hosting | Chưa xác nhận | Chưa xác nhận | Invite vào project/scope bằng tài khoản cá nhân, role theo plan; nếu plan không hỗ trợ nhóm, Leader chốt phương án hợp lệ | Người nhận mở project, kiểm tra domain/deployment/env names và hiểu cách rollback |
| Backend hosting | Chưa xác nhận | Chưa xác nhận | Invite vào workspace/service với role tối thiểu; không bàn giao password tài khoản chủ | Người nhận đọc được logs/deploy history, hiểu port/health/scheduler và runner thực |
| PostgreSQL/backup | Chưa xác nhận | Chưa xác nhận | Cấp role/workspace hoặc DB role qua kênh secret được duyệt; không chia sẻ password tài khoản chủ | Xem được expiry/policy, chạy kiểm tra read-only được phép; xác minh nơi lưu backup |
| GitHub release/CD | Chưa xác nhận | Chưa xác nhận | Repo/team role và environment approval tối thiểu; token ở secret store, không trong hồ sơ | Người nhận xem run/artifact/release và hiểu gate phát hành |
| Demo và báo cáo | Chưa xác nhận | Chưa xác nhận | Quyền đọc/chỉnh sửa kho evidence/report qua invite; người chấm có quyền riêng được nhóm duyệt | Người nhận tự mở video/biên bản, build report bằng toolchain được chốt và biết bộ nộp phiên bản nào |

**Mẫu ký nhận (chưa ký):** tài nguyên/project ID an toàn; người giao/nhận đã xác nhận; thời gian UTC; role được cấp; kiểm tra người nhận tự truy cập; version/docs/evidence bàn giao; hạn hosting/DB và việc còn mở; link xác nhận của hai bên. Chỉ ghi cách cấp quyền và trạng thái, không ghi credential. Release/rollback executor chưa được xác nhận chỉ bằng việc ai đang là Leader.

Khang được nhắc là Leader trong planning, nhưng **không suy ra** là chủ hosting, DBA hay release executor. Chỉ bổ sung tên khi có xác nhận của nhóm; chưa có thời hạn bàn giao được xác nhận.

## 7. Checklist nộp bài và khả năng truy cập của người chấm

Nguồn: **Assignment 2 v1.0 §9.1**, bổ sung chi tiết bắt buộc ở §6.4, §7.2–7.4, §8.1. Đây là checklist đã đối chiếu với bản đề tìm được, không còn chỉ dựa Jira/planning. Cột trạng thái không phải điểm nghiệm thu. Mọi tạo phẩm cuối cần khóa về release SHA/tag được chọn; checkout hiện tại HEAD 91e6f99, app source trùng dev 0e43bcb; 7dfc7ca là baseline evidence lịch sử. Bản docs cũ đã ở commit 3543a55/PR17; cập nhật mới chưa stage.

| Mục theo đề | Vị trí chuẩn của tạo phẩm | Evidence/phiên bản hiện có | Trạng thái và việc còn lại |
|---|---|---|---|
| Link repo và quyền giảng viên | [Repository A2](https://github.com/brewlite-project/brewlite-a2), [README](../../README.md) | GitHub connector đọc được; chưa thử bằng tài khoản/quyền giảng viên | NOT VERIFIED: người chấm phải clone/đọc được release; chưa có xác nhận quyền |
| SRS, use-case và requirement matrix | [SRS](../requirements/srs.md), [UC](../requirements/A2_T1.3_Checkout_Use_Case_Specification.md), [traceability-matrix.md](../traceability-matrix.md) | SRS/UC ở 7dfc7ca; matrix mới map 48 FR + 49 NFR, có design/code/test inventory | Matrix đã có ở commit 3543a55/PR17; cập nhật local chưa publish; reviewer chưa xác nhận coverage/runtime evidence. [TRACEABILITY.md](../TRACEABILITY.md) là ma trận task/PR riêng |
| Activity, sequence, class, deployment | [Diagram sources/exports](../diagrams/), [architecture](../architecture/architecture.md) | Source và exports hiện có, xem task/merge SHA trong TRACEABILITY | Deployment còn target design; cần SCRUM-116 đối chiếu actual topology, image/registry/provider theo đề §5.2 |
| Frontend, backend và migrations | [apps/web](../../apps/web/), [apps/api](../../apps/api/), [migrations](../../apps/api/prisma/migrations/) | HEAD 91e6f99 / app trùng dev 0e43bcb, 10 migration directories | VERIFIED tồn tại source; build/deploy release và migration production chưa xác minh |
| Unit, integration và ít nhất một E2E menu→confirmation | [API tests](../../apps/api/test/), [web tests](../../apps/web/tests/), [matrix lookup](../traceability-matrix.md#3-design-codeapi-và-test-lookup) | Có test files; local report SCRUM-112 source 34cbbc0; CI chỉ unit/build | NOT VERIFIED cho Sprint 2/release: SCRUM-115 cung cấp đúng scenario, SHA/environment/result; không dùng JSDOM/Mock làm Sandbox E2E |
| CI/CD chạy thành công | [CI workflow](../../.github/workflows/ci.yml), §3 E117-C2/C3 | CI success/failure có run/SHA; #27 mô tả Render auto-deploy; ảnh mới xác nhận Live02452f2 tại §14 | PARTIAL: cần CD build/tag image, deploy, safe migration, health/smoke và failure handling theo §7.3; branch protection chưa xác minh |
| Production frontend/API/health, DB không public | [deployment §8/11](../deployment.md), mapping §4 | FE URL đã có; Vercel status có ID/SHA; backend origin và ảnh DB Networking đã có ở §14 | PARTIAL; backend HTTP/liveness/catalog VERIFIED snapshot §14; FE alias và actual Internal DB usage còn mở |
| Release notes, README, rollback | [notes](release-notes-A2.md), [README](../../README.md), [runbook](../deployment.md#11-runbook-scrum-117--migration-seed-và-rollback) | Tài liệu nháp; A2-v1.0.0 chỉ đề xuất | Chưa tag/release; rollback cần actual tier/target/compatibility. Đề không yêu cầu rehearsal |
| Video/demo và Sprint Retrospective; Sprint Review theo §7.4 | §5: script, mẫu ghi nhận và link evidence chờ điền | Chưa có video/biên bản cuối được cung cấp | NOT VERIFIED: phải demo luồng end-to-end thật và lưu Review/Retro; template không thay evidence |

**Báo cáo LaTeX/PDF theo yêu cầu người dùng:** source chuẩn `docs/report/main.tex`, PDF tại `docs/report/output/main.pdf` đã build/render 53 trang, QA tại §14; chưa commit/push. Đề v1.0 không quy định tên/vị trí PDF tổng hợp hay đưa PDF này thành một mục riêng trong §9.1; không gọi vị trí đề xuất là quy định giảng viên. Deadline/portal, quy cách tên file và thay đổi roster A2 (nếu có) cần nhóm xác nhận; GVHD/thành viên đã kế thừa có nguồn từ báo cáo A1, không gán ownership vận hành. Học kỳ I 2026–2027 đã có nguồn từ bìa đề.

**Sai khác layout cần reviewer xem:** đề §9 minh họa root `.env.example` và `tests/`; repo hiện có env mẫu trong từng app/compose và tests trong app. Các path hiện hành được README/matrix dẫn đúng; chưa có quyết định yêu cầu di chuyển/tạo bản trùng. SCRUM-117 không sửa config hoặc test layout để tự coi tương đương.

**Điều kiện người chấm ở §7.4:** clone repository, chạy hệ thống theo README, truy cập production. Chưa thực hiện clean-clone setup ở một môi trường mới trong lượt này; không lấy static script review làm bằng chứng tái tạo thành công. Khi có URL/quyền, browser riêng phải tải UI/asset, kiểm tra TLS/mixed content, FE→API menu đọc DB. Mở/phát video, mở PDF đúng phiên bản và đọc/download từng evidence; trang login/HTTP 200 không đủ. FE URL đã có và HTTP probe xem §13; browser/asset/mixed-content/quyền người chấm còn NOT VERIFIED do công cụ. Demo cuối chưa có; PDF local đã build/render, chưa xác minh quyền người chấm trên bản remote.

## 8. Trình tự còn lại và điều kiện thực hiện

1. Giữ 8 AC tại §2 và đề A2 v1.0 đã tìm được tại §1/7. Leader bổ sung chỉ dẫn giảng viên mới hơn nếu có, roster tiếp nhận và URLs/evidence; xác nhận scope/contract/payment demo và hosting/tier, không yêu cầu lại nguồn đã có.
2. SCRUM-114/115/116 cung cấp PR/merge SHA, test/migration/CD/deploy evidence. Leader triage status-route gap và QueryDR E2E; SCRUM-117 không sửa ứng dụng/CD.
3. Reviewer đọc diff và PDF đã build/render theo §14. Rebuild bằng toolchain đã cài nếu source thay đổi; cập nhật checksum và kết quả QA. Metadata nhóm/GVHD đã có nguồn A1.
4. Sau người dùng cho phép riêng: stage/commit/push cập nhật branch và **PR17 đã có vào dev**, không mở trùng; CI/review phải đạt rồi mới xin/thi hành merge theo quy trình. Lượt này chưa thực hiện các bước đó.
5. Theo workflow repo đã được Leader xác nhận, chọn commit phát hành trên nhánh release (`main` là nhánh stable; không tự tạo nhánh release mới/merge). CI/CD phải gắn với **commit phát hành thực**, không chỉ SHA feature; kiểm tra cả FE/BE, migrations và rollback compatibility.
6. Chỉ khi được cấp quyền riêng: release executor chạy deploy/CD/migration theo SCRUM-116; QA thu production smoke và Sandbox E2E được phép. Trong lượt này chỉ chuẩn bị quy trình và kiểm tra read-only nếu có URL.
7. Chốt mapping §4, demo/Review/Retro thực, PDF/bộ nộp đúng checklist được cung cấp; thử quyền người chấm; kiểm tra quyền thành viên khi nhóm thực sự chuyển người quản lý. Xác nhận version khôi phục/compatibility; rehearsal khuyến nghị ở môi trường riêng được phép, không tự làm gate nếu chưa có quy định áp dụng.
8. Sau nghiệm thu/release approval: người được phân công tạo/push tag A2 theo quy ước đã chốt, publish release và gắn notes/evidence đúng SHA. Không tag commit chưa nghiệm thu; A1-final giữ provenance. Reviewer/Leader quyết định Jira Done cuối cùng.

> **Lưu ý lịch sử cho §9–12:** giữ nguyên kết quả/ngày/SHA và mô tả index/PR tại thời điểm ghi; hiện trạng 13/11 dùng §2–4/13.

## 9. Kết quả kiểm tra tài liệu SCRUM-117

Lần kiểm tra mới ngày 10/11/2026 lúc 20:13 +07, Windows workspace trên source 7dfc7ca + 9 file tài liệu SCRUM-117 chưa commit. Dùng Node 22.18.0 có sẵn qua absolute path chỉ để đọc/kiểm tra text, không dùng version này chứng minh app build.

| Kiểm tra thực chạy | Cách kiểm tra / kết quả | Giới hạn |
|---|---|---|
| Local Markdown links/path/anchors | Script Node đọc 9 file thay đổi, kiểm tra **177** local references, không thiếu target/anchor | Không fetch external URL, không thử quyền người chấm; không validate nội dung evidence |
| LaTeX inputs và assets | 8 input files của main và graphics dùng path gốc/diagram macro đều tồn tại | Static dependency check, không chứng minh TeX syntax/build/layout |
| Package scripts và migrations | Đối chiếu các script README dùng với manifests API/Web; 9 migration directories | Không cài/chạy app, migrate, seed, integration hoặc browser/Sandbox test |
| Whitespace/conflicts | Script đọc cả file mới chưa tracked: không trailing whitespace/conflict marker; `git diff --check` exit 0 cho tracked diff | Git cảnh báo LF→CRLF theo cấu hình máy, không phải lỗi whitespace |
| Secret pattern check | 9 file: không thấy private-key block, GitHub/AWS token pattern hoặc JWT pattern được dò; đọc diff chỉ tên biến/placeholders | Scan có giới hạn, không chứng minh không có mọi dạng secret; không đọc populated env |
| LaTeX compile | Thực gọi `pdflatex ... docs/report/main.tex`: command not found | **BLOCKED**: chưa có PDF, chưa render/visual QA/TOC/reference check. Không ghi PDF PASS |
| Đồng nhất nội dung | Đọc đối chiếu README/deployment/delivery/notes/LaTeX: cùng source 7dfc7ca, không production URLs, chưa tag/release, 9 migrations, runtime thiếu CLI, status/QueryDR gaps còn mở | Reviewer vẫn cần kiểm tra AC/rubric và metadata nhóm |

Không chạy build/test ứng dụng vì chỉ thay tài liệu và máy có Node 22.18.0 thấp hơn cấu hình CI/Docker. Các kết quả E112-H/EA1-H là **kế thừa**, không nằm trong test PASS của SCRUM-117. Không có request production, deploy, migration/seed/rollback hoặc giao dịch được thực hiện. Không sửa source app, workflows, Prisma schema/migrations hay `docs/a1-archive/`.

**Sau lượt chuẩn bị:** đã có tạo phẩm để review tài liệu; readiness runtime, PDF cuối, quyền truy cập người chấm, phát hành và nghiệm thu chưa đạt điều kiện. Các dependency/owner còn thiếu ở §2, §6–8 giữ nguyên, chưa được ai xác nhận bổ sung trong lượt này.

## 10. Review tiếp và kết quả kiểm chứng

> Phần này giữ kết quả lượt review khoảng 21:08 +07. Lượt tiếp tục sau đó đã
> tìm được đề v1.0 và nhận trạng thái 9 file staged; hiện trạng mới nhất ở §11.
> Các yêu cầu bổ sung checklist trong ghi nhận cũ đã được giải quyết bằng nguồn
> đề tại §1/7, không yêu cầu người dùng gửi lại.

**Snapshot lượt review:** ngày 10/11/2026, Windows; HEAD và remote dev được truy vấn lại trực tiếp vẫn `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`. Giữ branch `SCRUM-117-production-release-delivery` và 9 file tài liệu có sẵn, index không có staged changes. Không reset/stash/switch/merge, không sửa app/API/schema/pipeline/archive A1. §9 là kết quả lần kiểm tra đầu; phần này là kết quả lượt review tiếp, không viết lại evidence lịch sử.

### Findings và xử lý trong phạm vi tài liệu

| ID / mức | Finding, vì sao quan trọng | Nguồn/vị trí xử lý và kết quả |
|---|---|---|
| R117-01 / Major | Nhận định chưa có AC không đúng nguồn người dùng đã cung cấp, làm sai readiness | Delivery §1–2, TRACEABILITY §6, notes/README/LaTeX: thay bằng đủ 8 AC; chỉ thiếu checklist giảng viên |
| R117-02 / Major | Dùng rehearsal chưa có căn cứ bắt buộc thành gate, mở rộng AC4 | Deployment §11.3, delivery §2/8, notes/LaTeX: hướng dẫn bắt buộc, rehearsal khuyến nghị/chưa làm; nguồn SRS DRAFT và điều kiện xác nhận được ghi riêng |
| R117-03 / Major | Gộp status/QueryDR thành blocker cả release hoặc coi A1 Deferred là miễn A2 đều không đúng | Delivery §3 dẫn API v4 §5, SRS FR-34/38 §8 và ADR APPROVED §2.2; phân loại scenario impact và quyết định A2 cần xác nhận, đồng bộ các trang liên quan |
| R117-04 / Major | Rollback mô tả chung chưa chỉ rõ khả năng theo provider/tier và env/auto-deploy behavior | Deployment §11.3 bổ sung thao tác Vercel/Render, giới hạn target/retention, env/API/schema, DB recovery riêng; **khả năng thực thi trên host thật chưa xác minh** vì thiếu IDs/tier/target |
| R117-05 / Major | Thiếu pdflatex không đủ kết luận engine, paths không chứng minh report build | Report README: xác định pdfLaTeX từ preamble và log template; phân biệt fixture fontspec; hướng dẫn local/Overleaf đúng root và source bundle allowlist; main thêm engine hint. Chưa compile/render PDF mới |
| R117-06 / Minor | Manifest range và resolved version khác nhau; seed đặt liền trong setup và preflight không lặp đúng hướng dẫn | README: lockfileVersion 3, npm chưa pin, Nest core resolve 12.1.2; seed opt-in riêng; preflight/exit guard từng bước Compose. Không chạy seed/Compose |
| R117-07 / Minor | Wrapper workflow chỉ trả PR runs khiến chưa có evidence CI push; search task key có thể bỏ sót PR khác tên | Delivery §3–4/TRACEABILITY/README: search toàn bộ PR pages/body/diff và Actions REST; thu push CI success đúng 7dfc7ca, không suy CD/E2E |
| R117-08 / Minor | Ví dụ đóng gói PowerShell chưa load assembly ZipArchiveMode trước khi gọi, không chạy được ở PowerShell hiện tại | Thực chạy bắt lỗi thiếu type; sửa report README để load cả System.IO.Compression và FileSystem, rerun tạo ZIP và so SHA256 từng entry với source thành công |

### Phân loại trạng thái dùng khi review

- **Planned/Target Design:** ADR-005/topology/runner chưa có proof triển khai.
- **Implemented:** cấu hình hoặc source tồn tại, ví dụ ci.yml và GET /; không tự VERIFIED runtime.
- **Verified:** đúng môi trường/SHA/method/result có evidence, ví dụ push CI E117-R2 và static docs check; không mở rộng sang production.
- **Approved:** chỉ theo quyết định/review có nguồn áp dụng; ADR QueryDR Approved là điều chỉnh phạm vi A1, không overall A2 approval.
- **Released:** cần tag/release và mapping deployment/evidence thật; bản notes/PR draft không mang trạng thái này.

### Kiểm tra mới ở lượt review

Engine discovery đã chạy lúc 21:04 +07: `Get-Command` cho pdflatex/xelatex/lualatex/tectonic/latexmk và kiểm tra paths MiKTeX, TeX Live 2024–2026, cargo. Không có executable được tìm thấy; không kết luận mọi nơi trên máy đều không có TeX. Log SGU xác nhận pdfLaTeX lịch sử, không phải build BrewLite. **PDF mới vẫn chưa compile/render; font, tiếng Việt, bảng/hình, mục lục, tham chiếu và overflow/crop chưa được xác minh trực quan.** Người dùng có thể chạy đúng engine/packages local hoặc tự upload bundle sang Overleaf theo report README; không có upload được thực hiện trong lượt này.

Kết quả mới trên source 7dfc7ca + tài liệu chưa commit, Windows ngày 10/11/2026 lúc 21:08 +07:

| Kiểm tra đã chạy | Kết quả | Giới hạn |
|---|---|---|
| Node static audit 9 file | **PASS:** 189 local Markdown links/path/anchors; 8 LaTeX inputs; 19 primary graphics references tồn tại; không dangling label reference theo phép dò tĩnh | Không xác minh external link permissions, compile, render, font embedding hoặc layout |
| Manifests/config/scripts | **PASS đối chiếu tĩnh:** scripts local/test/build/migrate/seed tồn tại; lockfileVersion 3; Node CI 24/Docker 26; health/proxy/env names theo source | Không chạy install/build/test, Compose hoặc DB writes |
| Whitespace/conflicts/sensitive patterns | **PASS phạm vi dò:** 9 file không lỗi whitespace/conflict, không match private-key/GitHub/AWS/JWT patterns đã chọn; `git diff --check` exit 0 | Không tuyên bố không có secret tuyệt đối; không đọc populated env. Git có cảnh báo LF→CRLF theo cấu hình máy |
| Bộ nguồn portable | **PASS:** tạo ZIP allowlist trong TEMP, root main.tex giữ nguyên bytes từ docs/report/main.tex; **31 entries**, đọc lại ZIP và SHA256 từng entry khớp source | Không upload; chỉ source snapshot nháp, không PDF build PASS hoặc bộ nộp đã nghiệm thu. Path/hash ZIP được bàn giao cùng kết quả lượt này |
| Phạm vi Git | Chỉ 9 file docs/README; index không staged; không diff apps, workflows, migrations, schema hoặc archive A1 | Không commit/push/open PR/tag/release/deploy |

Lần audit script đầu bị lỗi encoding stdin PowerShell, đã sửa truyền UTF-8 và rerun thành công; không tính lần lỗi là PASS. Ví dụ ZIP cũng đã được sửa sau lỗi type như R117-08 và chạy lại thành công. Không chạy toàn bộ app tests vì chỉ chỉnh tài liệu. Các run CI/E112-H/EA1-H là evidence kế thừa/thu lại, không phải test ứng dụng do SCRUM-117 vừa chạy.

### Đầu vào còn cần, không yêu cầu lại AC

1. SCRUM-114/115: scope MVP/giới hạn được chấp nhận, PR/commit và run/report integration/E2E với môi trường/scenarios; xác nhận cách kế thừa report SCRUM-112 nếu có.
2. SCRUM-116: origins FE/BE sạch, deploy IDs/SHA, CD integration/run, provider/tier/region, DB access policy đã lọc secret, migration runner và rollback target/compatibility thực. Không gửi credential vào chat.
3. Leader: checklist giảng viên, metadata báo cáo/bộ nộp, người phụ trách/tiếp nhận và quyết định cửa nghiệm thu payment-status/QueryDR của release A2 lần này. Không tự nhận hai gap là đã được miễn.
4. Nhóm: demo/video, Review/Retro thật và quyền người chấm; người dùng chọn máy/toolchain để compile PDF hoặc tự dùng Overleaf, rồi review PDF thực.

**Đánh giá hồ sơ:** sau khi static checks bên trên đạt, có thể mở draft PR tài liệu để review trước khi production hoàn tất, chỉ sau người dùng cho phép commit/push/tạo PR. Thiếu runtime inputs, checklist/PDF và các quyết định nhóm được trình bày rõ là phần mở; không cần giả lập chúng để mở draft. Không đề nghị Done hoặc coi release đã nghiệm thu.

## 11. Kết quả lượt tiếp tục hoàn thiện

Ngày 10/11/2026, bắt đầu khoảng 22:23 +07; kiểm tra static mới lúc 23:03 +07. Repo/branch đúng yêu cầu; HEAD và remote dev đều 7dfc7ca. **9 file đầu vào đã staged**, chưa commit/push; thay đổi lượt này được giữ unstaged và requirement matrix mới chưa stage. Không reset/stash/switch/merge hoặc tự cập nhật index.

### Phần đã hoàn thành thực tế

- Tìm và đọc đề A2 v1.0 qua Drive, nhận diện §7.4/8.1/9.1 và ánh xạ checklist chuẩn; không còn thiếu AC hoặc nguồn checklist v1.0. Không suy ra quy cách PDF/deadline/portal mà đề không ghi.
- Tạo `docs/traceability-matrix.md` theo path đề yêu cầu: 48 FR + 49 NFR từ SRS, US/UC nguyên nguồn, lookup design/code/API/test thật. Không đánh dấu các requirement đã nghiệm thu.
- Hoàn thiện template ghi nhận demo, Review/Retro, ký nhận bàn giao; tách frontend/backend/DB/release/demo-report và chỉ ghi người đã được xác nhận (hiện chưa có).
- Làm mới PR/Actions/releases và tag refs. Chưa có PR SCRUM-117; chưa thấy nguồn xác nhận task 114/115/116 hoàn tất. Remote tags vẫn chỉ A1-final; GitHub releases trả rỗng. Deployments endpoint bị connector từ chối, không kết luận production thất bại/không tồn tại.
- Thu CI success/failure theo E117-C2/C3; cập nhật nguồn scope Mock/VNPay và image tag theo đề, giữ các quyết định A2 còn mở đúng nguồn.
- Đồng bộ README, deployment, docs index, task traceability, notes và LaTeX; giữ ba chỉnh sửa README người dùng đã chốt (migrate deploy có thể thay schema, terminal bắt đầu root, cột hiện trạng/bằng chứng).

### Kiểm tra và giới hạn lần này

| Kiểm tra | Kết quả thực | Commit/môi trường và giới hạn |
|---|---|---|
| Paths/anchors, source và references | PASS: **10 files, 771 local references, 8 TeX inputs, 19 primary graphics references**, không thiếu static label ref; matrix có đủ 48 FR + 49 NFR | Windows, 7dfc7ca + docs chưa commit, 23:03 +07. Không phải compile/layout/test coverage |
| Whitespace/conflicts/sensitive patterns | `git diff --check` và `git diff --cached --check` PASS; không match mẫu nhạy cảm được dò ở docs | Không đọc populated env, không tuyên bố không có mọi secret; không suy CI logs/production đã an toàn từ docs scan |
| Source/package check | Scripts/lockfile/path đang dùng đúng source; không diff app, workflows, schema/migrations hoặc archive A1 | Không chạy lại app tests, migration/seed hoặc Compose; không có clean-clone runtime verification mới |
| Toolchain report | Preamble/hash/log SGU đối chiếu lại, pdfLaTeX vẫn đúng engine; không tìm thấy engine native tại nơi kiểm tra. WSL list chỉ có docker-desktop, chưa xác định được môi trường TeX khả dụng | Đã hỏi quyền cài MiKTeX user + MuPDF portable; chưa cài công cụ hoặc thay đổi hệ thống khi chưa được phép. Chưa compile/render PDF mới |
| Production | **NOT RUN**, chưa có URL/deploy ID/SHA hoặc DB policy input mới | Không gửi request ghi, không tạo account/order/payment, không port scan hoặc tự deploy/rollback |
| Bộ nguồn portable | PASS: ZIP allowlist đã thêm matrix, **32 entries**, đọc lại SHA256 từng entry khớp source; root main giữ nguyên bytes từ docs/report/main.tex | Chỉ source nháp; ZIP/hash không chứng minh PDF hợp lệ. Không upload Overleaf |

Đã so sánh lại blob IDs của cả 9 staged files với snapshot đầu lượt: **index giữ nguyên**. Các thay đổi mới chưa stage; không đưa requirement matrix mới vào index tự động. Người dùng cần review cả staged/unstaged trước khi quyết định cập nhật stage và commit.

### Các bước cụ thể chờ xác nhận

1. Nhóm gửi các link/metadata còn thiếu đã hỏi một lần: PR/run/task 114/115/116, origins/deploy SHA, dashboard policy đã che dữ liệu, owner/receiver, scope release và demo/Review/Retro thật. Đề v1.0 đã tìm được, không yêu cầu gửi lại.
2. Người dùng xác nhận cài MiKTeX user + MuPDF portable, chỉ đường dẫn toolchain có sẵn, hoặc tự build Overleaf theo report README. Sau đó mới compile, sửa lỗi tích hợp và render/QA toàn PDF; chưa có approval cài thì không thực hiện bước này.
3. Khi có deployment input: kiểm tra GET và browser read-only đúng version; quyền DB phải dựa evidence thật. Nếu cần demo ghi dữ liệu, chuẩn bị môi trường/scenario và xin quyền riêng trước.
4. Phạm vi PR dự kiến: **10 file tài liệu**, branch `SCRUM-117-production-release-delivery` → `dev`; checkout hiện ở HEAD `5021743`. Draft body tại release-notes-A2.md; chưa commit/push hoặc mở PR GitHub.

**Kết luận:** hồ sơ có đủ nguồn và nội dung cụ thể để review bằng Draft PR; chưa sẵn sàng nghiệm thu release. AC1–3,4,6,8 và phần runtime/metadata của AC5/7 vẫn chưa đủ evidence; PDF cũng chưa build/render. Không đổi Jira Approved/Done và không nhận thay approval của reviewer/Leader.

## 12. Đối chiếu dev mới 5021743, chưa tích hợp

**Phạm vi lịch sử:** nhãn “chưa tích hợp” mô tả thời điểm audit 10/11 trên branch cũ ở `7dfc7ca`; trạng thái hiện tại nằm ở đầu dossier.

**Ghi nhận ngày 10/11/2026, tổng hợp lúc 16:25:57 UTC:** được người dùng cho phép
fetch origin để đọc nguồn mới; không pull/merge/rebase/switch. HEAD của task vẫn
`7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`, remote dev là
`5021743e99d73c2ce795df72ee5aaa90b04bb0da` (ahead 2 commits so với HEAD local).
9 file đầu vào có staged và unstaged changes; `docs/traceability-matrix.md` còn
untracked. Bản sao đầy đủ 10 file ngoài repo đã được đối chiếu SHA256, cùng
staged.patch, unstaged.patch, index-state/status/HEAD/dev và manifest; không
xóa hoặc thay đổi index. Snapshot này là bản dự phòng trước sửa docs cho nguồn mới.

### Nguồn mới và kết quả đúng phạm vi

| Evidence / cách kiểm tra | SHA, thời điểm, môi trường | Kết quả / giới hạn |
|---|---|---|
| Git fetch + log/diff 7dfc7ca..origin/dev; đọc bằng git show/grep | Local Git objects mới từ remote, đọc 10-11 khoảng 16:20 UTC; source 5021743 | Chỉ 3 file web đổi. Working tree ứng dụng chưa cập nhật; không build/test source mới local |
| [PR #16 / SCRUM-116](https://github.com/brewlite-project/brewlite-a2/pull/16), metadata/body/review | Head e8b1498ab0fe70a1bacd0f2b221492c46796643f; merge 5021743e99d73c2ce795df72ee5aaa90b04bb0da; review APPROVED 15:37:54Z, PR merged 15:38:05Z ngày 10-11 | Review/merge cho phần code Next/proxy. Body ghi CD, Render/Vercel deployment và production smoke là follow-up; không overall nghiệm thu SCRUM-116 |
| [PR CI 42845148086](https://github.com/brewlite-project/brewlite-a2/actions/runs/42845148086), Actions metadata | e8b1498; pull_request; 15:31:04Z–15:32:49Z | completed/success; CI lint/unit/build, không deployment/Sandbox smoke |
| [Push CI 42846397766](https://github.com/brewlite-project/brewlite-a2/actions/runs/42846397766), Actions metadata/jobs | 5021743; push/dev; 15:38:07Z–15:39:50Z | completed/success, API CI/Web CI success. Không thay E112-H runtime SHA 34cbbc0 hoặc các CI 7dfc7ca/e942cbe lịch sử |

### Những nhận định đã đối chiếu lại

- **Payment status:** inventory controller trên 5021743 vẫn chỉ có payments
  POST/initiate, IPN GET và zero-amount controller; không có GET status. Toàn bộ
  `apps/api` không đổi so với 7dfc7ca. Giữ implementation gap/scenario impact
  tại §3, không tự kết luận chặn toàn bộ release.
- **QueryDR:** source backend, tests và mọi docs/evidence không đổi trong diff
  mới; PR #16 không cung cấp Sandbox E2E mới. Giữ trạng thái chưa xác minh,
  không coi đây là một lần chạy thất bại mới hoặc là đã được miễn A2.
- **CD/production/health:** tree vẫn chỉ `.github/workflows/ci.yml`; không có
  workflow/config deploy mới, origins FE/BE, health/smoke production hoặc DB
  Networking/migration evidence trong thay đổi/PR mới. GET / liveness, GET
  /products đọc DB và policy startup không đổi. Merge #16 không đủ đóng AC1–3/4.
- **Setup/test/build:** package scripts, Node CI 24/Docker 26, React 19.2.8,
  env names và proxy target resolution không đổi. Remote Next đổi 16.3.8 →
  16.4.6, lockfile tương ứng; eslint-config-next vẫn 16.3.8 theo source. Tại audit
  chưa chạy `npm ci` hoặc build source mới local tại thời điểm đó; checkout hiện tại
  dùng lockfile này nhưng chưa rerun app install/build trong lượt cập nhật tài liệu.
- **Proxy runtime:** response bỏ connection/keep-alive/transfer-encoding/
  content-length/content-encoding; message 502 public thành generic; error log
  phía server. Đây là implementation đã merge và CI success, chưa phải FE→API
  production smoke, không đóng root cause 502 lịch sử hoặc claim logs sạch secret.
- **Migration/seed/rollback/report:** Dockerfiles, Compose, env mẫu, scripts,
  Prisma/schema/9 migrations/seed, deployment doc và LaTeX sources/assets không
  đổi trên dev. Runbook vẫn cần actual provider/tier/target/compatibility;
  rehearsal chỉ khuyến nghị khi chưa có nguồn buộc. PDF chưa compile/render.
- **Traceability:** SRS/US/UC/diagrams/API/test paths không đổi, mapping 48 FR +
  49 NFR được giữ; thêm source audit mới, không rewrite baseline/acceptance cũ.
  PR #16 chỉ đóng phần implementation được review, không chứng minh 114/115
  hoặc toàn bộ task 116 đã nghiệm thu.

### Kế hoạch đồng bộ lịch sử và phạm vi trùng

Remote delta chỉ có `apps/web/package.json`, `apps/web/package-lock.json` và
`apps/web/app/api/backend/[[...path]]/route.ts`; task delta chỉ 10 docs/README.
**Giao tập đường dẫn rỗng**, không có docs mới/đổi tên/xóa ở dev để đụng các file
task. Không thấy conflict văn bản hoặc file untracked bị dev ghi đè dựa trên
delta tại 5021743; chưa thực hiện merge để tuyên bố merge đã thành công. Trùng
ngữ nghĩa cần tránh: không viết lại phần Next/proxy của #16 hoặc dùng body
SCRUM-116 như proof của CD; giữ notes/source versions theo đúng commit.

**Hoạt động worktree riêng đã thực hiện ở lượt trước:** tạo branch `SCRUM-117-production-release-delivery-sync` từ SHA `5021743e99d73c2ce795df72ee5aaa90b04bb0da` tại `C:/Users/Khai Hoang/AppData/Local/Temp/SCRUM-117-production-release-delivery-sync` và chép 10 file tài liệu vào đó. Đây là provenance lịch sử; checkout được dùng hiện nay là `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`. Không lấy lại file từ worktree TEMP để thay nội dung hiện tại.

Đợt audit lúc 10/11 ghi nhận delta dev chỉ có ba file web, không trùng 10 tài liệu; CI evidence và findings giữ ở SHA/giờ lịch sử trong các bảng trên.

**Phương án thay thế đã cân nhắc ở thời điểm audit (không còn là hướng dẫn hiện tại):** cần người dùng cho phép commit
trọn bộ docs đã review để working tree sạch, rồi phê duyệt merge dev vào branch
đó; không dùng rebase/history rewrite. Đây là phương án khác, có thay đổi trạng
thái staged/unstaged và phát sinh commit/merge, nên không làm trong lượt đang
tạm hoãn Git. Snapshot/patches giữ ranh giới các thay đổi đầu vào để đối chiếu.

AC ở §2 vẫn chưa đủ evidence nghiệm thu. Source hiện tại đã ở HEAD 5021743; các thay đổi tài liệu chưa có commit/push và PR draft chưa được mở. Không deploy, migration/seed, rollback, tag/release hoặc đổi Jira Done.

**Kiểm tra lịch sử sau cập nhật, 10/11/2026 lúc 16:28 UTC:** 10 file tài liệu có
776 local links/anchors, 8 TeX inputs, 19 primary graphics references đều tìm
được; không thiếu static label ref. Kiểm tra trực tiếp 55 code/config paths
được matrix dẫn trong Git tree 5021743 đều tồn tại. `git diff --check` và
`git diff --cached --check` đạt; staged blob IDs so với đầu lượt giữ nguyên;
không diff app/workflow/archive A1. Giao tập ba file remote và 10 docs là rỗng.
Không chạy lại app tests/compile PDF hoặc production smoke; CI đã dẫn là kết
quả GitHub được đọc lại, không phải test local SCRUM-117 vừa chạy.

## 13. Audit hiện hành ngày 13/11/2026

### Git, PR và CI

- Đã đọc diff origin/dev...HEAD và đối chiếu hai tree app/config: chỉ 10 file tài liệu; source #18–23/#25/#27 **đã có trong checkout**, không phải code chỉ ở remote. origin/main 02452f2 là merge promotion #28 trên remote; không checkout main hoặc thay SHA evidence cũ bằng SHA main.
- Index fingerprint đầu lượt (git ls-files -s | git hash-object --stdin): `1f0b18c9612ec41f7977c4d9c514406afa7c8e06`; không stage/reset/stash. Fetch đã thực hiện ở lượt trước; lượt này chỉ đọc refs và API, không pull/merge/rebase/switch/copy worktree.
- PR17 remote có đúng 10 docs; body null, review list []; draft=false. Nội dung cập nhật đề xuất ở notes, chưa gửi lên GitHub. PR26/27 review APPROVED bởi KhaiHoang275 cho commit 2216b7a/7dbad80; không gán người này làm release/DB owner hoặc nghiệm thu SCRUM-117.
- Đã truy call sites payment-status: helper có request API-03 nhưng PaymentPageView và Order Confirmation hiện refetch orders/me/auth/me. Nhận định lịch sử “Return UI không đọc được authoritative state do thiếu status route” cần thu hẹp như §3; không giữ kết luận tác động rộng đó làm hiện trạng. Đây là static call-flow audit, chưa browser test.
- Actions collection 36 runs trả về (per_page=100), đều CI; API CI/Web CI của run 43392423041 success với install/Prisma generate/lint/unit/build. Không có step deploy/migration/post-deploy smoke. #27 chỉ sửa apps/api/README.md, không workflow. Render integration ngoài Actions có thể tồn tại; README config là assertion, cần observed deployment record.

### Evidence mới đọc lại từ PR/diff

| Evidence | Commit / thời điểm gốc UTC / môi trường | Nội dung xác minh và giới hạn |
|---|---|---|
| N18 — PR18 | 6e004d764ca9027290f100c0f010d7e5c33824ac; merged 2026-11-11T08:20:50Z / source | Thêm guarded Render demo seed, internal policy, dist-seed build/runtime artifact và tests; không chứng minh đã chạy trên cloud |
| N19 — PR19 | 63b9195c64b8f4c58c674bbe0ecad5eb8d8d55d0; 11-11T09:24:36Z / source | Sanitized seed diagnostic codes; giữ execution policy, không coi lỗi đã được giải quyết ở production chỉ từ patch |
| N20 — PR20 | f674897d7f9c02c537fcc84828d73f54e3a9bfbe; 11-11T09:57:19Z / source | Catalog-drift diagnostics và tests; không tự sửa dữ liệu DB |
| N21 — PR21 | 3d412b45cf53a282e5594994b343402e14826f55; 11-11T11:34:37Z / source | Align bakery category fixture theo Render; fixture/test thay đổi, không phải approval toàn catalog |
| N22 — PR22 | af31196125e93243b2b89a02b33134a764eeddc9; 12-11T12:02:33Z / source | Migration thứ 10 seed_executions, schema model, one-shot marker + Serializable/advisory lock, integration opt-in, runbook. Không chạy migration/test DB ở SCRUM-117 |
| N23 — PR23 | 95906b56c1a2842eb04cdbd7bf60a267ef98fbf9; 12-11T13:19:22Z / source | Prisma Pool Internal exact target/TLS exception và unit specs; direct/default mode giữ khác. Không chứng minh DB external policy |
| N24 — PR24 | 1b394f1dae75fd0a11c1b1b3f4390a588dedf18f; 12-11T13:49:00Z / Render theo body | Báo 10 migrations applied, seed một marker, API products/detail 200; không có raw log/runner ID/deployed SHA/time từng phép kiểm tra |
| N25 — PR25 | 2216b7a246b21491cf81cd2f2196f907c0aa7a98; 13-11T05:32:30Z / tests theo body | 38 focused PASS, Vitest 479 PASS + 6 PostgreSQL opt-in skipped; TypeScript/build PASS. Diagnostics không sửa QueryDR network timeout; environment/time run chưa ghi |
| N26 — PR26 | head 2216b7a; merge 03668e36b85a9958d5a6e1cd2b468295fdb0fb2d, 13-11T07:26:17Z / Render/Vercel + VNPay Sandbox theo body | Payment success được báo cáo; IPN và QueryDR riêng chưa có trace; một giao dịch còn manual reconciliation. Comments chỉ bot Preview, không có dữ liệu đối soát thêm |
| N27 — PR27 | head 7dbad80602fb936b35e375beafe9f99739b0fb33; merge 0e43bcb80f64d6a5fa558cd80f71a199029535d0, 13-11T08:20:11Z / source | README mô tả main/Render/After CI Checks Pass và **sẽ** bổ sung verification; không phải đã quan sát CD. CI head 43390995680 + push 43392423041 success |
| N28 — main/Vercel status | 02452f228712c3501c8d27f0f1ae737ad206785d; status updated 13-11T08:38:39Z / GitHub Vercel integration | success + deployment link tại §4; chưa bind domain người dùng hoặc backend cùng SHA |

Các số PR trong bảng dẫn trực tiếp theo mẫu https://github.com/brewlite-project/brewlite-a2/pull/18 (thay số tương ứng); evidence được đọc 13/11 khoảng 14:03–14:20Z. Không phải test ứng dụng do SCRUM-117 vừa chạy.

### Production read-only và giới hạn

- URL FE https://brewlite-a2-three.vercel.app/ do người dùng cung cấp. Browser host unavailable; fallback Edge bị Computer Use dừng vì không xác định URL đủ tin cậy. **Browser smoke NOT VERIFIED**, không tiếp tục Computer Use và không ghi là website fail.
- HTTP GET bằng PowerShell ở sandbox, batch bắt đầu 2026-11-13T14:12:17Z, không kết nối được; đó là môi trường probe, chưa kết luận production down. Lặp read-only ngoài sandbox được phép, batch bắt đầu 14:13:16Z: FE / trả **200**, Content-Type text/html; charset=utf-8, 100359 bytes. TLS mặc định không bypass certificate. Đây là HTTP reachability, không render/menu/assets/mixed-content hay quyền người chấm. Timestamp là lúc bắt đầu batch, không phải thời điểm hoàn tất từng request; không đo latency riêng.
- GET proxy https://brewlite-a2-three.vercel.app/api/backend/products trong cùng batch trả **200**, application/json; charset=utf-8, 2767 bytes, body có items với id/name/basePriceVnd/category. Không suy dữ liệu từ HTML/UI; chưa có upstream request log/current deployment mapping để khẳng định dữ liệu DB production trực tiếp. Backend public origin chưa tìm được trong repo, PR bodies/comments và status metadata được đọc; không đoán hostname hoặc hỏi connection string. Direct liveness/DB readiness NOT VERIFIED, dependency SCRUM-116.
- Không đăng ký, tạo đơn, thanh toán, gọi callback/QueryDR hay sửa dữ liệu. Không port-scan DB. Policy DB external access chưa có nên AC3 chưa verified.

### Báo cáo, dependency và kết luận

Đã đọc text báo cáo A1 từ Google Docs và đề A2 v1.0 ngày 13/11; roster 6 người/GVHD/mã học phần kế thừa ghi ở main/report README. Không chỉnh Docs hoặc upload. Đọc lại SGU preamble và log: pdfTeX/format pdflatex TeX Live 2024 là build template lịch sử, không phải báo cáo mới. Chưa tìm thấy pdfLaTeX/render tool trong PATH; chưa có PDF mới, nguồn portable giữ pdfLaTeX + VnTeX. Quyền cài MiKTeX user + MuPDF portable đã hỏi, chưa tự cài.

Đầu vào thực sự còn thiếu: (1) SCRUM-114/Leader xác nhận scope/giới hạn/payment demo và gap status; (2) SCRUM-115/QA report integration + menu→confirmation, IPN/QueryDR và kết quả giao dịch cần đối soát đã che dữ liệu; (3) SCRUM-116 backend origin, current deploy IDs/SHA/CI event mapping, runner/log migrations, image version, provider/tier/network/backup/rollback targets; (4) nhóm cung cấp video/Review/Retro thật, quyền người chấm, người tiếp nhận và release decision; (5) toolchain được phép để build/render PDF. Chưa xác nhận cá nhân chịu trách nhiệm các mục này; không xin password/token/connection string.

Hồ sơ đủ để **review cập nhật PR17**, chưa sẵn sàng review nghiệm thu release cuối. PR17 đang open thường, không gọi là Draft đã tồn tại; chuyển Draft chỉ khi được cho phép. Không commit/push/update PR, tag/release/deploy hoặc Jira Done.

### Kết quả kiểm tra mới — 13/11/2026, khoảng 14:27–14:32Z

| Kiểm tra | Kết quả thực | Giới hạn |
|---|---|---|
| Phạm vi/index | Chỉ 10 docs tracked được sửa unstaged; staged diff rỗng; index fingerprint cuối khớp 1f0b18c9612ec41f7977c4d9c514406afa7c8e06 đầu lượt | HEAD/branch không đổi; không stage/commit/push/update PR; không sửa app/schema/pipeline/archive |
| Whitespace | git diff --check và git diff --cached --check PASS | Cảnh báo LF→CRLF theo config Git không phải lỗi whitespace; không sửa Git config |
| Markdown local paths/anchors | Node 22.18.0 kiểm tra 776 local references trong 10 file: PASS | Không kiểm tra quyền người chấm hoặc fetch mọi external link; source GitHub/Drive và official provider/Overleaf được đọc riêng |
| TeX dependencies/references | 9 TeX files gồm main + 8 inputs, 15 graphics references ở nhánh IfFileExists được chọn theo repository root đều tồn tại; 23 labels kể cả LastPage do package cung cấp, 6 cite uses/5 bibitems không thiếu key; begin/end environments cân bằng | Static check không phải TeX compile hoặc visual QA; không đánh giá font/ngắt bảng/tràn/cắt/trang trống |
| Requirement matrix | Đủ 48 FR + 49 NFR | Mapping coverage, không implementation/test coverage hoặc acceptance |
| Conflict/sensitive patterns | Không match conflict markers/private-key/GitHub-AWS-token/JWT/credential URL/signed-query patterns được dò trong 10 docs; diff đã rà phạm vi | Scan có giới hạn, không chứng minh “không có mọi secret”; không đọc env thật hoặc audit toàn bộ CI/provider logs |
| Runtime tests/build | Không chạy app tests/build/migration/seed/Compose; chỉ HTTP GET read-only và kiểm tra docs/source | CI/PR test claims là evidence thu lại/kế thừa, không ghi thành test local mới |
| PDF | Chưa build/render vì toolchain không tìm thấy, quyền cài đang chờ trả lời | Nguồn portable/hướng dẫn đã có; không tạo ZIP/PDF giả hoặc upload dịch vụ ngoài |

Checker đầu tiên đếm cả fallback graphics không được chọn nên báo missing paths; đã sửa checker hiểu IfFileExists và whitespace trước graphics argument, chạy lại PASS. Một lệnh Node inline bị lỗi quoting PowerShell trước khi ghi file; đã dùng patch trực tiếp và kiểm tra lại. Không coi các lần lỗi công cụ đó là build PDF/app fail. Script kiểm tra/chỉnh sửa tạm đã được loại khỏi bộ PR; danh sách PR vẫn đúng 10 docs tại release notes.

## 14. Evidence Render, backup và PDF — cập nhật 14/11/2026

Git trước tiếp tục PDF: HEAD91e6f99/dev0e43bcb không đổi; 10 docs unstaged và 5 ảnh evidence mới giữ nguyên. Fetch ở lượt13/11 xác nhận remote dev0e43bcb/main02452f228712c3501c8d27f0f1ae737ad206785d. PR17 vẫn open/draft=false/head3543a55/base dev, chưa cập nhật. Index fingerprint1f0b18c9612ec41f7977c4d9c514406afa7c8e06.

### Evidence và thời điểm

| ID / nguồn | Version / thời điểm / môi trường | Kết quả và giới hạn |
|---|---|---|
| B117-H1: kết quả phiên trợ lý trước do người dùng cung cấp | Backend public; GET /2026-11-13T16:12:30.8778669Z; /products16:12:31.6476271Z | Kế thừa HTTP200 Hello World!/JSON products. SHA tiến trình chưa xác minh trực tiếp; không đổi thành kiểm tra vừa chạy |
| B117-N1: GET mới PowerShell | / bắt đầu16:24:58.7373521Z, kết thúc16:24:59.1098808Z; /products bắt đầu16:24:59.1644372Z, kết thúc16:24:59.4284827Z ngày13/11 | HTTP200 Hello World!, HTTP200 application/json9 items. HTTPS mặc định không bypass cert; không ghi dữ liệu |
| R117-I1: [ảnh deploy](evidence/render-deploy-02452f2.png) do người dùng cung cấp | Render Live/Auto-Deploy source02452f2; deployed field15:39:19GMT+7 =08:39:19Z ngày13/11; duration39.4s | Nest started15:39:54, service live15:39:59GMT+7; URL backend khớp. Capture time ảnh chưa có. Không nhầm deploy time với GET16:24Z |
| R117-I2: [ảnh DB expiry đã che](evidence/render-db-expiry-redacted.png) | Free/Available; expires December10/2026 | Che toàn popup External URL và serviceID không cần thiết; ảnhraw không lưu repo/PDF, bản sau che đã mở kiểm tra |
| R117-I3: [ảnh plan](evidence/render-db-plan.png) | PostgreSQL18/Singapore/1GB, Available; ảnh do người dùng, đọc13/11 | Không suy web-service tier từ DB Free; autoscaling/pool disabled ở thời điểm ảnh |
| R117-I4: [connections đã che](evidence/render-db-connections-redacted.png) | Dashboard có Internal/External fields | Không chứng minh env app thực dùng Internal. Che cả host/user/database/URL và command không cần thiết |
| R117-I5: [network đã che IP](evidence/render-db-network-redacted.png) | DB3 /32, workspace/environment0.0.0.0/0 | Mô tả rules local migration/demo seed/current localIP/diagnostics; exact IP không đưa vào repo. Chưa có chủ/thời hạn/policy sign-off |
| C117-N1: GitHub CI43394783298/jobs | main02452f228712c3501c8d27f0f1ae737ad206785d; API success08:38:47Z, Web success08:39:15Z | Auto-Deploy event08:39:19Z phù hợp README After CI Checks Pass. VERIFIED một lần CD backend; chưa full image tag/migration/failure/rollback chain |
| V117-N1: GitHub status/checks/public deployments REST | Vercel success02452f2, updated08:38:39Z; deployment [AayabZWzjhJAquCMYXjoaDppJWsi](https://vercel.com/brewlite-a2/brewlite-a2/AayabZWzjhJAquCMYXjoaDppJWsi) | Public deployments REST trả[]; checks chỉ API/Web CI; bot comments là Preview. Production URL người dùng chưa có alias→deployment binding. Không suy GitHub không records là chưa deploy |
| U117-H1: đính chính của người dùng ngày 14/11/2026 | Người dùng xác nhận Leader chưa kiểm tra | Thay thông tin PASS thuật lại trước đó. Chưa có Leader review/acceptance SCRUM-117. Yêu cầu bỏ Edge/Computer Use tiếp tục áp dụng |

### Liveness, DB và AC3

Backend origin hiện có: https://brewlite-a2-api-hntn.onrender.com/. Source AppController→getHello không query DB. ProductsController→ProductsService.findAll→Prisma product.findMany (products.service.ts:21–43). HTTP catalog cùng source/deploy evidence hỗ trợ khả năng đọc dữ liệu qua ứng dụng; chưa phải direct DB inspection, chưa chứng minh identity/Internal transport hay readiness liên tục. Cần manager xác nhận mode/target-match/region/service association bằng metadata không có secret, không gửi DATABASE_URL.

Theo [Render Combining IP rules](https://render.com/docs/inbound-ip-rules#combining-ip-rules), IP external phải được mọi cấp áp dụng cho phép; cấp trên0.0.0.0/0 không làm union thêm IP ngoài3 /32. Rules public không áp private networking. Kết luận external restricted, chưa private-only; chưa chạy thử connect/deny từ nhiềuIP. Cần xác nhận rules đã lưu và quyết định AC3 có chấp nhận admin external có hạn hay phải private-only. Đổi policy chỉ sau phê duyệt riêng, không làm trong lượt này. Ảnh#2 nguồn có credential một phần: bản raw không đưa repo; nhóm cần đánh giá exposure/rotation qua quy trình riêng, không gửi secret vào hồ sơ.

DB expiry **10/12/2026 theo dashboard**; không tính lại từ created3daysago. Trước đó chọn nâng tier hoặc export/restore sang đích phù hợp; grace sau expiry không phải thời gian demo khả dụng. Chưa có backup/restore verified. Runbook mới tại [deployment §11.5](../deployment.md#115-backuprestore-postgresql18-và-hết-hạn-db). pg_dump/pg_restore18.6 đã có, chỉ chạy --version, không kết nối DB.

### Các quyết định còn thiếu

SCRUM116/manager: FE production alias/SHA, FE/web tier, Internal config thực và migration runner/log/status, image version/rollback eligible targets. DB owner/Leader: policy3 /32, kế hoạch trước10/12, backup retention/restore evidence/người vận hành/tiếp nhận. SCRUM114/115: scope Mock/status/QueryDR, kết quả giao dịch còn đối soát, integration/menu→confirmation và IPN/QueryDR đúng SHA/environment. Nhóm: review thực tế, video/Review/Retro, release/tag/acceptance PR17. Phân công người quản lý tài nguyên là việc tổ chức nội bộ theo §6. Không có PR mới sau#28 hoặc ceremony evidence mới tìm thấy; templates §5 giữ chưa điền.


### Kết quả build/render trước hiệu chỉnh Leader — 14/11/2026

- Fetch origin lúc khoảng07:42 GMT+7 ngày14/11 thành công; HEAD91e6f99, origin/dev0e43bcb và origin/main02452f2 không đổi. Không pull/merge/đổi branch; các bằng chứng GET ngày13/11 không được đổi thành probe ngày14/11.
- MiKTeX26.5 user, pdfTeX1.40.29/pdfLaTeX + VnTeX; MuPDF portable1.28.5. Không đổi engine, không đổi PATH hệ thống. Lượt cuối pass9 exit0; aux/toc ổn định so với pass8. TeX log không có Overfull, LaTeX/Package warning, undefined reference/citation hoặc duplicate destination. Nhắc MiKTeX chưa check updates nằm ngoài TeX log, không phải compile failure.
- [PDF local](../report/output/main.pdf): **53 trang, 3.175.225 bytes**, SHA256 **9B9D7837FE08DE39FB353AEFE580E747E95F9235D246895E21D202BB4957EC94**. PDF giữ DRAFT; chưa commit/push. Source layout bổ sung ngoài 10 docs đầu vào: context-and-scope, requirements-summary, sequence-diagram; thêm production-evidence.tex, 5 ảnh an toàn và PDF. Không sửa app/schema/pipeline/archive.
- Render toàn53 trang100dpi; đã xem6 contact sheets toàn bộ và các trang chi tiết bìa/TOC/diagram/longtable/evidence/references. Kiểm tra lại trang41/46–48 sau chỉnh kiến trúc/header và trang47 sau sửa AC7. Tiếng Việt/font, bảng tiếp trang, hình landscape/captions/footer và nội dung không tràn/cắt qua kiểm tra trực quan. Sơ đồ overview dày cần zoom, đã có các hình pha chi tiết. Text bbox nằm trong kích thước trang; không trang trống theo ngưỡng30 ký tự, không replacement glyph U+FFFD. Kiểm tra tự động không thay visual QA.
- MuPDF có Unicode bookmarks và internal destinations; font information có16 fonts. Không kiểm tra toàn bộ external link hoặc quyền người chấm. Chưa chạy lại app tests vì chỉ sửa tài liệu; CI/PR claims giữ nguyên nguồn, SHA và môi trường lịch sử.
- Kiểm tra static14 file text thay đổi: local paths/anchors, 10 TeX files/9 inputs/18 graphics nhánh được chọn, 27 labels, 6 cite uses/5 bibitems, 48 FR +49 NFR; không thiếu reference. Conflict markers và các mẫu private key/token/JWT/credential URL/signed query được dò không có match; không khẳng định loại trừ mọi secret. Năm ảnh evidence an toàn đã xem sau che, ảnh raw có credential không được lưu repo/PDF.
- Log/aux/toc/render PNG và scripts tạm không thuộc bộ PR. Index fingerprint vẫn1f0b18c9612ec41f7977c4d9c514406afa7c8e06; staged diff rỗng. git diff --check và git diff --cached --check kiểm tra riêng. Không stage/commit/push/update PR/tag/release/deploy hoặc đánh dấu Done. Hồ sơ sẵn sàng review cập nhật PR17; chưa đủ điều kiện nghiệm thu release.


### Review hoàn thiện theo ủy quyền người dùng — 14/11/2026

- Fetch origin xác nhận dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`, main `02452f228712c3501c8d27f0f1ae737ad206785d`; HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`. Diff source HEAD với dev chỉ gồm tài liệu SCRUM-117. PR17 open, draft=false, head remote3543a55; comments/reviews REST đều trả rỗng. Releases REST trả rỗng, PR collection vẫn đến #28.
- GitHub status của main02452f2 tiếp tục success, deployment Vercel AayabZWzjhJAquCMYXjoaDppJWsi. Trang overview public trả200 với tiêu đề deployment nhưng phần HTML nhận được không có domain brewlite-a2-three.vercel.app; deployments REST trả[]. Chưa đủ bằng chứng bind alias. Không suy alias sai hoặc production thất bại.
- Người dùng đính chính **Leader chưa kiểm tra/nghiệm thu**. §2, §14 và các bản Markdown/LaTeX hiện hành đã đồng bộ. Phương án tài liệu tại §6 là nhóm tiếp tục quản lý, chưa gán tên cá nhân. Người tiếp nhận riêng/ký nhận riêng và rehearsal là khuyến nghị, không bổ sung AC.
- Sửa checklist §7 đã lỗi thời về backend origin/network; sửa nhận định CD ở bảng gap theo ảnh Live02452f2. Giữ phần migration runner/Internal usage còn thiếu bằng chứng thực.
- PDF hiện hành 53 trang, 3175123 bytes, SHA256 `F796B94AA56D2D80F341F182627E21FB64F58F6B705843911EBD05C35E5B9CCB`. Ba lượt build cuối exit0. MuPDF render 53 trang, đã xem sáu contact sheets và chi tiết trang47/49. Không có Overfull/undefined references-citations/LaTeX-Package Warning. Có Underfull hbox do căn đều, không thấy cắt/chồng chữ khi xem các trang vừa sửa. Hai lần công cụ gặp giới hạn quyền/path đã xử lý; thư mục build nhầm trong workspace đã được dọn, build cuối ở TEMP.
- Các kết quả GET ngày13/11 giữ nguyên timestamp, không có production probe mới trong lượt này. Review tài liệu không thay review/acceptance của nhóm.

- Bộ hồ sơ quyết định dùng `A2-v1.0.0` làm tên đề xuất cho release đầu A2; source đích là commit stable sau khi hồ sơ và phạm vi release được review/merge. Main02452f2 hiện là bản ứng dụng đã có deployment evidence, chưa chứa bộ báo cáo mới. Candidate rollback backend2216b7a giữ trạng thái đề xuất vì chưa có retained deployment ID; runbook đã nêu cách chọn artifact tương thích.
