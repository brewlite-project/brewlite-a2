# BrewLite A2 — Release notes nháp

**DRAFT, cập nhật15/11/2026. Hồ sơ chưa nghiệm thu; SCRUM-117 không tạo tag/release hoặc deploy. Main đã có promotion #24/#26/#28 của nhóm, không đồng nghĩa A2 release/tag đã phát hành.**

**Snapshot lịch sử trước push21749cc:** đối chiếu khoảng10:31 UTC ngày14/11: PR17/head6ee4199, dev0e43bcb và main02452f2 không đổi; CI head hiện tại success, reviews rỗng, bodyPR còn trống. Remote chỉ tagA1-final, Releases API[]. GET frontend/backend/proxy catalog đều200, hai catalog có9sản phẩm. Bản65trang/22file vẫn local, không thuộc CI này. Chi tiết và giới hạn ở [delivery§16](SCRUM-117-delivery.md#16-đối-chiếu-git-và-khả-năng-hoàn-thiện-ngày14112026); không thay evidence lịch sử hoặc nâng trạng thái AC.

## Phiên bản và nguồn

- Tag đề xuất: `A2-v1.0.0`, theo ví dụ trong planning; nhóm chưa xác nhận quy ước cuối. Không dùng `A1-final` làm release A2.
- Snapshot lịch sử dùng ở lần soạn đầu: `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb` trên remote `dev`; đây **không phải commit phát hành đã chốt**.
- Snapshot soạn13/11: branch SCRUM-117-production-release-delivery, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`, app/config trùng origin/dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Remote main `02452f228712c3501c8d27f0f1ae737ad206785d`; không phải source được checkout. Bản docs cũ ở 3543a55/PR17, cập nhật mới chưa stage. SHA 7dfc7ca/5021743 và test evidence cũ giữ lịch sử.
- Commit release: chờ review, required CI, dependency merge, quy trình release qua nhánh stable và approval của Leader. Notes phải cập nhật theo final diff/commit khi được phép phát hành.
- [Mapping release → FE/BE deploy → CI/CD → smoke](SCRUM-117-delivery.md#4-releasetag--source--deployments--runs--smoke).

## Thay đổi thực tế đã merge vào dev

| Phạm vi | PR / merge commit | Ý nghĩa và giới hạn |
|---|---|---|
| Planning, Context, SRS, Checkout UC | #1/#2/#7/#3; mapping SHA trong [TRACEABILITY](../TRACEABILITY.md) | Chuẩn hóa yêu cầu A2, không tự phê duyệt mọi requirement |
| Activity, Sequence, Domain, Architecture, Deployment target | #4/#8/#5/#9/#6; SHA trong TRACEABILITY | Có source/export; target hosting vẫn chưa được nghiệm thu runtime |
| Monorepo và A1 provenance | [#11](https://github.com/brewlite-project/brewlite-a2/pull/11), `4b8098742aa5346d116b7a2ba3e3c1956462acf7` | `apps/web`, `apps/api`, archive A1 bất biến; Compose A2 riêng |
| CI quality gates | [#12](https://github.com/brewlite-project/brewlite-a2/pull/12), `e4d3185750e0956950e67c552c611295286200e2` | Node 24, API/Web lint/unit/build; chưa CD/DB integration/Sandbox |
| Docs navigation/traceability | [#14](https://github.com/brewlite-project/brewlite-a2/pull/14), `34cbbc088117d7a4908d07a66cfbd03b0c905dea` | Merge xác minh từ Git; nội dung matrix cũ bên trong giữ provenance riêng |
| MVP Sprint 1 report | [#15](https://github.com/brewlite-project/brewlite-a2/pull/15), `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb` | Evidence local kế thừa chạy source 34cbbc0, không production smoke |
| Next.js/proxy hardening, phần PR SCRUM-116 | [#16](https://github.com/brewlite-project/brewlite-a2/pull/16), `5021743e99d73c2ce795df72ee5aaa90b04bb0da`; head `e8b1498ab0fe70a1bacd0f2b221492c46796643f` | Next 16.4.6 + lockfile, lọc 5 response headers và message 502 chung. CI mới success; PR ghi deployment/CD/production smoke là follow-up, không coi toàn task 116 hoàn tất |
| Render guarded demo seed và diagnostics | [#18](https://github.com/brewlite-project/brewlite-a2/pull/18) 6e004d764ca9027290f100c0f010d7e5c33824ac; #19 63b9195; #20 f674897; #21 3d412b4 | Runtime dist-seed, exact target policy, drift diagnostics và bakery fixture; không gán tự động đã chạy cloud |
| One-shot seed / migration 10 | [#22](https://github.com/brewlite-project/brewlite-a2/pull/22) af31196125e93243b2b89a02b33134a764eeddc9 | seed_executions marker + lock/transaction/tests/runbook, không xóa marker để reseed |
| Prisma Internal TLS | [#23](https://github.com/brewlite-project/brewlite-a2/pull/23) 95906b56c1a2842eb04cdbd7bf60a267ef98fbf9 | Exact target profile, TLS exception cho self-signed Internal; không chứng minh DB external access đã tắt |
| QueryDR diagnostics | [#25](https://github.com/brewlite-project/brewlite-a2/pull/25) 2216b7a246b21491cf81cd2f2196f907c0aa7a98 | Classify lỗi, duration, sanitized metadata/tests; không sửa underlying timeout/state/signature/retry |
| Render CD configuration docs | [#27](https://github.com/brewlite-project/brewlite-a2/pull/27) 0e43bcb80f64d6a5fa558cd80f71a199029535d0 | Chỉ apps/api/README.md: main, Dockerfile, After CI Checks Pass; README tại thời điểm merge chưa có event; ảnh mới xác nhận một Live02452f2, dossier§14/15 |

SCRUM-117 README/runbook/report/delivery/matrix là **docs đề xuất của PR17, chưa merge**. #24/#26/#28 promote dev vào main, không phải tag/release; #26 báo Sandbox payment thành công trên source 2216b7a trước merge, chưa bind final deployment. Full SHA/ngày/môi trường từng evidence tại delivery §13.

## Environment và database

- Paths chạy npm chuyển sang app tương ứng; không có root npm workspace. CI Node 24 khác Docker Node 26, ghi version thực của artifact khi release.
- Runtime variables, proxy/public origins, JWT/internal/VNPay secrets xem [deployment §5](../deployment.md#5-environment-và-vị-trí-secrets). Chưa xác nhận cấu hình thật trên host; tên secret CD trong target design còn dự kiến.
- Source hiện có 10 migrations; SCRUM-117 không thêm migration/schema. Runner production chưa xác minh; runtime image không có Prisma CLI. Chỉ runner được duyệt chạy `db:migrate` (= migrate deploy).
- Catalog seed local có guard/upsert; seed Render riêng insert-only/dry-run/apply có marker/approval. PR24 báo cloud seed/migration thành công nhưng actual runner/status/current deployment còn cần evidence. Đọc [migration/rollback runbook](../deployment.md#11-runbook-scrum-117--migration-seed-và-rollback).

## Known limitations và quyết định còn mở

- Payment-status GET/API-03 còn thiếu tại HEAD 91e6f99; FE có helper gọi route và re-export, nhưng PaymentPageView/Order Confirmation hiện polling GET /orders/me. Không suy toàn bộ Return UI hỏng từ gap API-03. Order History success không chứng minh endpoint theo contract đã có; Leader/API owner cần quyết định/task cụ thể.
- PR26 báo VNPay Sandbox payment PASS, Order PAID/Payment SUCCESS/Loyalty +10, backend Render Live 2216b7a, FE Vercel Live. Chưa có trace để xác nhận riêng IPN validation/ACK/duplicate handling hay QueryDR Sandbox/lost-IPN recovery. #25 chỉ thêm observability, không sửa network timeout.
- PR26 ghi một giao dịch Sandbox trước vẫn cần manual financial reconciliation; chưa có ID đã lọc/time/state/outcome/owner/resolution. Không claim resolved/refunded hoặc tự chấp nhận giới hạn tài chính; cần quyết định nhóm trước nghiệm thu phạm vi liên quan.
- FE URL đã có; backend origin và Auto-Deploy02452f2 được ảnh xác nhận, GET / và /products200/9 items. Vercel status02452f2 success nhưng production alias chưa bind. Bỏ browser theo yêu cầu; Người dùng xác nhận Leader chưa kiểm tra/nghiệm thu. DB Free18/Singapore/1GB/expiry10-12/3 external /32 có ảnh, Internal usage/runner/backup/rollback targets vẫn chưa đủ.
- #27 mô tả Render After CI Checks Pass; ảnh mới và CI jobs xác nhận một lần Auto-Deploy backend02452f2 sau checks success. Chưa chứng minh pipeline đầy đủ image tag → migration → smoke/failure handling theo đề §7.3. Không tự kết luận GitHub phải có CD workflow riêng nếu provider integration hợp lệ; cần observed event chain.
- Demo/Review/Retro cuối và acceptance PR17 chưa có; report PDF đã build/render, chưa nghiệm thu. Rollback guide có điều kiện theo provider/tier; rehearsal khuyến nghị, chưa thực hiện.

Các giới hạn không tự waive requirement A2 hoặc mặc định chặn mọi AC; xem bảng 8 AC/dependency tại delivery §2/3.

## Điều kiện chốt notes và phát hành

Xem [delivery §8](SCRUM-117-delivery.md#8-trình-tự-còn-lại-và-điều-kiện-thực-hiện). Chốt source SHA sau merge/release workflow, thu CI/CD + deploy IDs + smoke đúng SHA, hoàn thiện PDF/bộ nộp và quyền người chấm, ghi cách nhóm tiếp tục quản lý tài nguyên, rồi chốt bước tạo/push tag và publish theo quyền được cấp. Mỗi bước ngoài lượt tài liệu này cần quyền theo AGENTS.md; không thay đổi Jira Approved/Done tự động.

## Snapshot body PR17 trước bổ sung phân công — không dùng làm body hiện hành

**Title:** `docs(SCRUM-117): complete whole-project report and production delivery evidence`

**Body trước bổ sung phân công (lịch sử):**

Bản báo cáo trước đã có yêu cầu/use case/sơ đồ nhưng mô tả dữ liệu/API, hiện thực toàn hệ thống, kiểm thử, Scrum và đánh giá còn mỏng. PR hoàn thiện **báo cáo toàn đồ án BrewLite từ A1 đến A2**, đồng thời chuẩn hóa production delivery evidence; không chỉ trình bày deployment/release.

## Thay đổi

- Tái sử dụng bối cảnh/stakeholder/SRS/use case/activity/sequence/domain/architecture đã có; giữ nguồn A1 và cập nhật mô tả theo source A2. Không sửa archive hoặc bản nộp A1; kết quả A1 không thành acceptance A2.
- Bổ sung mô hình dữ liệu thực (13models/10migrations), quan hệ/constraints, API inventory và auth/ownership, walkthrough UI--proxy--NestJS--Prisma, transaction/payment/security; chỉ mô tả implementation có nguồn.
- Mở rộng chiến lược/mức kiểm thử và bảng kết quả theo commit/môi trường. Report502/502 trên34cbbc0 và PR25/26 là evidence kế thừa, không phải test local mới. Gap rounding FE floor/BE half-up, payment-status và QueryDR được giữ rõ.
- Bổ sung Scrum theo mốc PR có bằng chứng, đánh giá so với mục tiêu và hướng phát triển. Kế hoạch PROPOSED không được biến thành kết quả Sprint; không bịa meeting/feedback/approval.
- Báo cáo **65 trang**, **pdfLaTeX + VnTeX**, logo gốc SGU;12 phần chính,2 phụ lục,19 hình/23 bảng có caption. Chuyển8 AC/ảnh production sang phụ lục, giữ nhật ký/checklist dài ở dossier.
- Đồng bộ README/index/traceability/deployment/release notes/report README; giữ migration/seed/backup/restore/rollback hướng dẫn đúng tác dụng, provider/tier có điều kiện. Không sửa app/schema/pipeline hoặc thao tác production.

## Baseline và evidence production

- Baseline hiện tại: HEAD/PR17 `21749cce2ff536a5f1f99a74cf951bc4fc78dce6`, base dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Báo cáo65 trang/E3A8956E… đã commit/push tại21749cc; [CI43587629629](https://github.com/brewlite-project/brewlite-a2/actions/runs/43587629629) API CI/Web CI SUCCESS cho commit đó. CI ứng dụng không build/render LaTeX. Các bổ sung lịch sử A1–Phase2–A2/phân công trong lượt này chưa commit và chưa có CI riêng; Leader chưa review/nghiệm thu.
- Render Auto-Deploy Live02452f2 theo ảnh, deployed field13/11/2026 08:39:19Z; CI main43394783298 cùng SHA success. Không dùng GET để xác định processSHA.
- HTTP GET mới14/11: frontend/200 lúc09:47:56Z; backend/200 Hello World! và/products200 JSON9items lúc09:48:20Z. FEproxy timeout20s rồi retry200/9items lúc09:53:38Z; nguyên nhân chưa xác minh. Browser smoke NOT VERIFIED, không dùng Computer Use. GET/deployment13/11 giữ timestamp riêng ở dossier.
- DB ảnh Render Free/PostgreSQL18/Singapore/1GB, expiry10/12/2026;3 external /32 restricted, chưa private-only. Actual Internal app usage không được suy từ Internal URL. Chưa có actual backup/restore mới.
- FE Vercel status main02452f2 success/deployment AayabZWzjhJAquCMYXjoaDppJWsi; production alias chưa bind. Releases API[]; A2-v1.0.0 là đề xuất, chưa có release source/tag được chốt.

Audit kế thừa§16 ngày14/11 lúc10:31 UTC đã được tích hợp vào LaTeX/PDF: cả4 public GET200, hai catalog9items; không thay lần proxy timeout09:48 hoặc xác nhận nguyên nhân đã sửa. PR reviews[] nghĩa chưa có review, không phải bị từ chối. Remote chỉ A1-final/Releases[] tại thời điểm audit. Không chạy lại HTTP/GitHub trong lượt tích hợp; không gán SHA Render cho từng request. PDF65trang/E69A… trước lần này và PDF53trang/B11CE… ở6ee4199 giữ là lịch sử.

## Validation và giới hạn

- Snapshot PDF đã push21749cc tại docs/report/output/main.pdf khi đó: 65 trang/3932356 bytes, SHA256 `E3A8956E269950261286A22CB6DBD46862E4F8C3E207FDBEBCDF090CE676B59F`. Checksum B11CE… là PDF53 trang có logo tại6ee4199; F796… và pass9 là các bản lịch sử.
- pdfLaTeX cuối exit0, aux/TOC/LoF/LoT/out ổn định; không Overfull/undefined refs/citations/LaTeX-Package warnings cuối.14 Underfull hbox đã kiểm tra trực quan. MuPDF render toàn65 trang; xem toàn bộ contact sheets và các trang nội dung mới/ảnh/bảng, không thấy tràn/cắt hoặc trang trống bất thường.
- Static local links/anchors, TeX inputs/graphics/labels/citations,48FR/49NFR, whitespace working/staged riêng, conflict/sensitive patterns được kiểm tra; số liệu/giới hạn tại dossier§15. Không khẳng định loại trừ mọi secret; ảnh UI/Render dùng source có provenance và đã kiểm tra an toàn.
- [CI43543439775](https://github.com/brewlite-project/brewlite-a2/actions/runs/43543439775) **API CI và Web CI SUCCESS** cho head đã commit6ee4199 (14/11 01:57:00Z); không đại diện thay đổi mới. CI không build LaTeX hoặc chứng minh PostgreSQL integration/production Sandbox E2E. Không chạy lại toàn suite app cho lượt docs.

## Leader cần review / việc còn mở

- Kiểm tra tính đầy đủ báo cáo theo đề§1–9.1, cách kế thừa A1/cập nhật A2 và trạng thái Planned/Implemented/Verified/Approved/Released; bảng đối chiếu ở docs/report/README.md.
- SCRUM114/115: scope payment-status/Mock/QueryDR, rounding task, full menu→confirmation/integration; PR26 PAID/SUCCESS/+10 không chứng minh riêng IPN/QueryDR. Giao dịch cần manual reconciliation chưa có resolution xác nhận.
- SCRUM116: FE production alias/SHA, actual Internal DB usage, migration runner/log/status, image/eligible rollback artifacts, network policy và kế hoạch bảo toàn dữ liệu trước10/12.
- Nhóm: demo/video, Review/Retro thật, quyền người chấm, release/tag/source cuối và nghiệm thu. Chưa tự gán cá nhân vận hành hoặc thêm AC ngoài8 AC được cung cấp.

**Leader CHƯA review/nghiệm thu SCRUM-117. Báo cáo DRAFT sẵn sàng review không đồng nghĩa release đã Released hoặc Accepted. Không merge/deploy/tag/release/đánh dấu Done trong lượt chuẩn bị này.**

## Bổ sung body PR17 — evidence/PDF14-11 (lịch sử trước tổng hợp toàn đồ án)

**Cập nhật tiếp 14/11/2026:** HEAD91e6f99/dev0e43bcb giữ nguyên, 10 docs unstaged đầu vào được bảo toàn. Backend https://brewlite-a2-api-hntn.onrender.com/ có ảnh Render Auto-Deploy Live02452f2 (fullSHA02452f228712c3501c8d27f0f1ae737ad206785d), deployed field13/11/2026 08:39:19Z. GET mới / và /products200 lúc16:24:59Z ngày13/11, catalog9 items; GET không xuất processSHA. DB Free18/Singapore/1GB/Available, expiry10/12/2026; external3 /32 restricted, chưa private-only. Bỏ Edge/Computer Use theo yêu cầu; Người dùng đính chính ngày 14/11/2026: Leader chưa kiểm tra/nghiệm thu SCRUM-117. Evidence và các giới hạn tại dossier §14.

Title đề nghị: docs(SCRUM-117): complete A2 report PDF and production delivery evidence.

Nội dung bổ sung dùng kèm body cập nhật PR17: thêm Render evidence đã che và báo cáo PDF53 trang, bộ build/render/QA có nguồn; AC2 VERIFIED snapshot, AC3 vẫn PARTIAL. Hướng dẫn backup/restore PostgreSQL18 và candidate rollback được chuẩn bị, chưa backup/restore/rollback production. Không gọi PDF hoàn tất là release nghiệm thu. Chưa stage/commit/push/update PR17.


### Hiệu chỉnh trước review PR17 ngày 14/11

Người dùng xác nhận Leader chưa kiểm tra/nghiệm thu. Bỏ các nhận định Leader PASS, dùng phương án nhóm tiếp tục quản lý tài nguyên và giữ mẫu chuyển quyền là khuyến nghị. Sửa checklist/backend/CD đã lỗi thời. PDF53 trang được build/render lại; checksum hiện hành ở report README. Ba lượt build cuối exit0; log không có Overfull/undefined refs/citations/LaTeX-Package Warning, có Underfull hbox đã kiểm tra trực quan. GitHub/Vercel đã được tra lại, còn thiếu alias binding và nguồn runtime Internal DB usage.


## Danh sách22 file ở lượt tổng hợp đã commit21749cc (lịch sử)

- `README.md`
- `docs/README.md`
- `docs/TRACEABILITY.md`
- `docs/delivery/SCRUM-117-delivery.md`
- `docs/delivery/release-notes-A2.md`
- `docs/deployment.md`
- `docs/diagrams/deployment-figure.tex`
- `docs/diagrams/domain-class-figure.tex`
- `docs/report/README.md`
- `docs/report/main.tex`
- `docs/report/output/main.pdf`
- `docs/report/sections/activity-diagram.tex`
- `docs/report/sections/checkout-use-case.tex`
- `docs/report/sections/context-and-scope.tex`
- `docs/report/sections/data-api-implementation.tex`
- `docs/report/sections/deployment-release-delivery.tex`
- `docs/report/sections/production-evidence.tex`
- `docs/report/sections/project-evaluation.tex`
- `docs/report/sections/release-readiness.tex`
- `docs/report/sections/requirements-summary.tex`
- `docs/report/sections/sequence-diagram.tex`
- `docs/traceability-matrix.md`

Danh sách22 file trên thuộc lượt trước, đã commit/push21749cc; không phải danh sách thay đổi mới. Log/render/checker ở TEMP không đưa vào PR. Không cập nhật PR trong lượt này. Khi được cho phép và có quyền: mở PR17 → Edit → dán Title/Body ở mục hiện hành trên; không tạo PR trùng. Lỗi connector403 trước đây là giới hạn quyền integration, không đọc token/credential để vượt quyền.


Tích hợp audit16 vào PDF thực tế đã hoàn tất; metadata/QA snapshot65 trang ở [report README](../report/README.md#bản-pdf-hiện-hành), log tích hợp ở [dossier§17](SCRUM-117-delivery.md#17-tích-hợp-audit16-vào-báo-cáo-và-pdf). Title/body chỉ được chuẩn bị, chưa gửi hoặc cập nhật PR. Giữ nguyên8AC và các quyết định còn mở.


## Snapshot body PR17 — trước điều chỉnh cách trình bày sản phẩm

Title: `docs(SCRUM-117): complete BrewLite A1–Phase2–A2 report and delivery evidence`

Body dưới đây dùng cho lượt bổ sung hiện tại; metadata PDF cuối và danh sách file ở cuối tài liệu. Các body/QA phía trên là snapshot lịch sử, không dùng thay cho bản này.

BrewLite cần một báo cáo tổng hợp từ bài toán/yêu cầu, phân tích/thiết kế, hiện thực, kiểm thử tới vận hành và bàn giao. PR này kế thừa nguồn A1 có provenance, phân biệt Phase2 với Assignment2; chuẩn hóa README hiện tại và tích hợp nội dung hệ thống, diagrams, traceability, report LaTeX/PDF có logo SGU, nhãn DRAFT.

Bổ sung phụ lục phân công104 issue theo Jira (102 Task,1 Subtask,1 Epic), đủ A1/Sprint0–3, Phase2/Sprint4 và A2; mapping sáu thành viên bằng mã task trong bảng A1. Không dùng Jira Done làm test hoặc acceptance. Runbook có migration/seed, rollback ứng dụng/khôi phục DB, backup PostgreSQL18 và bàn giao quyền; chưa thực hiện production changes.

Render Live02452f228712c3501c8d27f0f1ae737ad206785d ngày13/11 và HTTP frontend/backend/proxy200 ngày14/11 là evidence riêng; GET không xác định serving SHA, browser smoke hoặc Internal DB usage. Lịch sử proxy timeout được giữ cùng snapshot thành công về sau.

Bản65 trang/E3A8956E… đã commit21749cc và CI43587629629 API/Web SUCCESS. PDF/validation mới của lượt bổ sung có metadata ở report README; chưa commit nên chưa có CI riêng. CI ứng dụng không build/render PDF. Không chạy lại app suite cho thay đổi docs.

Leader cần review tính đầy đủ toàn đồ án, provenance/phân công và mức chứng minh8AC. Vẫn mở FE production alias→deployment/SHA, actual Internal DB, migration runner/log/policy/rollback target và bảo toàn DB trước10/12; payment-status/rounding/QueryDR và giao dịch đối soát; demo/Review/Retro, release/tag và nghiệm thu. Leader chưa review/nghiệm thu SCRUM-117. Hồ sơ sẵn sàng review không đồng nghĩa release đã Accepted/Released.

Chỉ chuẩn bị nội dung; không cập nhật PR trong lượt này. Khi được phép, sửa PR17 hiện có vào dev, không tạo trùng; nếu connector403, người dùng dán body thủ công, không trích credential.


Validation cho body hiện hành: PDF DRAFT mới **79 trang/3979222 bytes**, SHA256 `DBB676AE9E3507D9C2A2178BC86260C3685E32C8CD994F4256B1336DB6ED78E0`; pdfLaTeX+VnTeX/MiKTeX, MuPDF render toàn bộ và QA bảng nhiều trang, references ổn định. Kiểm đủ104 issue trong Markdown/TeX/PDF và roster6 người; local links/anchors/TeX/whitespace/conflict/sensitive-pattern checks có kết quả ở dossier§18/report README. Source/PDF mới chưa commit, không lấy CI21749cc thay cho CI mới. Bộ thay đổi của snapshot trước điều chỉnh cấu trúc là14 file theo git status khi đó, khác danh sách22 file lịch sử ở trên.

## File đề nghị commit sau review lượt bổ sung phân công

- `README.md`
- `docs/README.md`
- `docs/TRACEABILITY.md`
- `docs/traceability-matrix.md`
- `docs/delivery/SCRUM-117-delivery.md`
- `docs/delivery/release-notes-A2.md`
- `docs/planning/BrewLite_Task_Allocation.md` (mới; nguồn đối chiếu tối thiểu, không có CSV all-fields)
- `docs/report/README.md`
- `docs/report/main.tex`
- `docs/report/output/main.pdf`
- `docs/report/sections/deployment-release-delivery.tex`
- `docs/report/sections/project-evaluation.tex`
- `docs/report/sections/release-readiness.tex`
- `docs/report/sections/task-allocation.tex` (mới; phụ lục đủ104 issue)

Chưa stage/commit/push/cập nhật PR. File tạm/log/render không thuộc danh sách này. Chỉ dùng PR17 hiện có vào dev khi người dùng cho phép bước tiếp theo.


## Snapshot body PR17 — trước hoàn thiện findings diagram/UI

Title: `docs(SCRUM-117): complete BrewLite system report and delivery evidence`

Báo cáo trình bày BrewLite như một đồ án phần mềm hoàn chỉnh: bài toán/phạm vi, yêu cầu, mô hình và thiết kế, database/kiến trúc/API, hiện thực frontend/backend và nghiệp vụ, kiểm thử, triển khai/vận hành/bảo trì/bàn giao, quản lý dự án và kết luận. README ưu tiên chức năng và setup hiện hành; nguồn gốc repository được giữ ngắn gọn. Các sơ đồ, đặc tả và evidence lịch sử được bảo toàn; provenance và bảng đối chiếu phiên bản nằm ở phụ lục, không dùng tiến trình A1/Phase2/A2 làm trục trình bày.

Bảng PDF giữ đủ104 issue, nhóm theo thành viên/chuyên môn với năm cột: Thành viên, Nhóm công việc, Mã task, Nhiệm vụ cụ thể, Tạo phẩm phụ trách. Assignee/mã/ý nghĩa task không đổi; Epic98 và Subtask4 chưa phân công ghi riêng. Markdown chuẩn giữ tiêu đề nguyên bản cùng Sprint/giai đoạn gốc. Không suy đóng góp hay acceptance từ số task/Jira Done.

Runbook, release notes, traceability và production evidence vẫn giữ giới hạn: Render Live02452f2 ngày13/11 riêng với HTTP snapshots14/11; chưa bind mọi serving SHA hoặc FE production alias. Vẫn mở Internal DB usage, runner/log/policy/rollback target và bảo toàn DB; payment-status/rounding/QueryDR/đối soát; demo/Review/Retro, release/tag và nghiệm thu. Leader chưa review/nghiệm thu SCRUM-117.

PDF DRAFT dùng pdfLaTeX+VnTeX và logo SGU; số trang/checksum/QA mới tại report README. CI43587629629 API/Web SUCCESS chỉ cho21749cc đã commit, không thay CI của chỉnh sửa mới hoặc PDF QA. Chưa stage/commit/push/update PR; hồ sơ sẵn sàng review không đồng nghĩa release đã Accepted/Released.


Validation bản trình bày hệ thống hiện hành: PDF DRAFT 81 trang vật lý, 3987564 bytes; SHA256 `DC8CD6867C32345D2AC545AC929F894A1EF89C238AF0637E98B493C4E8CAF8AA`; pdfLaTeX+VnTeX/MiKTeX, MuPDF render toàn bộ và QA bảng nhiều trang, mục lục/references ổn định. Không dùng checksum79 trang hoặc CI21749cc thay cho PDF/CI mới. [QA chi tiết](../report/README.md#bản-pdf-hiện-hành).

## File đề nghị review sau điều chỉnh cấu trúc

- `README.md`
- `docs/README.md`
- `docs/TRACEABILITY.md`
- `docs/delivery/SCRUM-117-delivery.md`
- `docs/delivery/release-notes-A2.md`
- `docs/planning/BrewLite_Task_Allocation.md`
- `docs/report/README.md`
- `docs/report/main.tex`
- `docs/report/output/main.pdf`
- `docs/report/sections/activity-diagram.tex`
- `docs/report/sections/checkout-use-case.tex`
- `docs/report/sections/context-and-scope.tex`
- `docs/report/sections/data-api-implementation.tex`
- `docs/report/sections/deployment-release-delivery.tex`
- `docs/report/sections/production-evidence.tex`
- `docs/report/sections/project-evaluation.tex`
- `docs/report/sections/release-readiness.tex`
- `docs/report/sections/requirements-summary.tex`
- `docs/report/sections/sequence-diagram.tex`
- `docs/report/sections/task-allocation.tex`
- `docs/traceability-matrix.md`

21 file gồm cả thay đổi đầu vào được bảo toàn và chỉnh sửa cấu trúc mới; danh sách14/22 file ở các snapshot trên là lịch sử. File helper/log/render ở TEMP, không đưa vào PR. Dừng trước stage/commit/push/update PR17.


## Snapshot body PR17 — trước biên tập bản trình nộp

Title: `docs(SCRUM-117): complete BrewLite report diagrams and delivery evidence`

Báo cáo BrewLite cần thể hiện đầy đủ hệ thống và bằng chứng có nguồn, thay vì chỉ link sơ đồ hoặc mô tả theo task. PR hoàn thiện cấu trúc bài toán/yêu cầu/thiết kế/hiện thực/kiểm thử/vận hành/quản lý dự án/kết luận, đồng thời giữ provenance và các giới hạn nghiệm thu.

Chèn Use Case tổng quát vector (4 actor/14 UC/17 association), ERD storage theo Prisma/SQL (13 bảng/15 FK, PK/FK/cardinality), bổ sung6 bước hành trình UI và ảnh local modal-bottom/404 có nguồn; dọn wording/review IDs khỏi phần chính; ghép Subtask4 chưa phân công và Epic98, giữ đủ104 issue và mapping CSV. Lưu generator/SVG/PDF và hướng dẫn build/portable trong A2; không sửa app/schema/pipeline/archive/A1 hoặc production.

Validation: PDF DRAFT 87 trang vật lý, 4982132 bytes, 22 hình/31 bảng; SHA256 `CE0868B8DF0D3D24F5ED10A1B493211F7E9622C7740C8AC37F48315A012CDED6`; pdfLaTeX+VnTeX ổn định references, MuPDF render toàn bộ từ PDF cuối và QA các hình/bảng mới. CSV hash/mapping104 issue,15 FK/3 partial indexes, SVG idempotence, local links/anchors/TeX/whitespace/conflict/sensitive-pattern checks đã thực hiện; không chạy lại app suite cho thay đổi docs.

Ảnh thực cho auth/cart/checkout/payment/confirmation/history còn thiếu; phần mô tả lấy từ source, không dùng mockup hoặc tự tạo giao dịch. Production vẫn giữ evidence Render02452f2/HTTP snapshots lịch sử; còn FE alias/source, Internal DB/migration/rollback/backup, payment-status/rounding/QueryDR/đối soát, demo/Review/Retro, release/tag và review/nghiệm thu. Leader chưa review/nghiệm thu SCRUM-117. CI43587629629 API/Web SUCCESS chỉ cho21749cc đã commit, không cho thay đổi mới hoặc PDF QA.

Hồ sơ sẵn sàng review tài liệu không đồng nghĩa release Accepted/Released. Chưa stage/commit/push/update PR17; không merge/deploy/tag/release/Done.

## File đề nghị review sau hoàn thiện findings

- `README.md`
- `docs/README.md`
- `docs/TRACEABILITY.md`
- `docs/delivery/SCRUM-117-delivery.md`
- `docs/delivery/release-notes-A2.md`
- `docs/diagrams/README.md`
- `docs/diagrams/brewlite-database-erd.svg`
- `docs/diagrams/render_report_diagrams.cjs`
- `docs/planning/BrewLite_Task_Allocation.md`
- `docs/report/README.md`
- `docs/report/assets/database-erd.pdf`
- `docs/report/assets/use-case-overview.pdf`
- `docs/report/main.tex`
- `docs/report/output/main.pdf`
- `docs/report/sections/activity-diagram.tex`
- `docs/report/sections/checkout-use-case.tex`
- `docs/report/sections/context-and-scope.tex`
- `docs/report/sections/data-api-implementation.tex`
- `docs/report/sections/deployment-release-delivery.tex`
- `docs/report/sections/production-evidence.tex`
- `docs/report/sections/project-evaluation.tex`
- `docs/report/sections/release-readiness.tex`
- `docs/report/sections/requirements-summary.tex`
- `docs/report/sections/sequence-diagram.tex`
- `docs/report/sections/task-allocation.tex`
- `docs/requirements/diagrams/use-case-overview-report.svg`
- `docs/traceability-matrix.md`

Tổng27 file gồm thay đổi đầu vào được bảo toàn và source/assets mới. Các danh sách14/21/22 file trước là snapshot lịch sử. Log/render/helper giữ TEMP, không thuộc bộ PR.


## Body PR17 hiện hành — bản trình nộp BrewLite

Title: `docs(SCRUM-117): prepare BrewLite project report for submission`

Báo cáo đã có nội dung toàn hệ thống nhưng còn trình bày nhiều checklist và nhật ký tác nghiệp. PR biên tập thành Báo cáo đồ án BrewLite: bài toán/yêu cầu, mô hình use case/activity/sequence, kiến trúc/domain/database/API, hiện thực, kiểm thử, vận hành, quản lý dự án/phân công và kết luận.

Bỏ DRAFT khỏi bìa/footer/metadata và banner domain trong bản trình bày; chuyển checklist8AC, lịch sử Git/CI/checksum/audit sang dossier. Giữ nguồn canonical, provenance kiểm thử/ảnh local, giới hạn thực chất tại mục Hạn chế và đầy đủ104 issue theo CSV (102 Task,1 Epic,1 Subtask). Không suy task được giao là đã hoàn thành hoặc một người thực hiện toàn bộ.

PDF: 70 trang vật lý, 19 hình, 24 bảng, 4,589,955 bytes; SHA256 `006997E90EE869B8AFBABC68B40AC0BEF87E7C3151404DCF5C1D8F77A784C574`. pdfLaTeX+VnTeX ổn định references, MuPDF render toàn bộ bản cuối; đã xem tất cả contact sheets và các trang liên quan. Đối chiếu104 issue/roster/MSSV, ERD13 bảng/15FK, local links/anchors/TeX, whitespace và mẫu nhạy cảm trong phạm vi tài liệu. Không chạy lại app tests hoặc production checks; CI43587629629 chỉ cho21749cc lịch sử.

README hướng dẫn hệ thống hiện tại; source/assets/build portable nằm trong repo A2, không sửa A1/archive/app/schema/pipeline. Production/HTTP/CI kế thừa giữ nguồn và giới hạn; các gap payment-status/rounding/QueryDR, vận hành DB/deployment, demo/Review/Retro và quyết định release vẫn ở dossier. Hình thức trình nộp không công bố Leader/giảng viên đã review/nghiệm thu hoặc mọi yêu cầu đều đạt.

Phạm vi Leader review: tính chính xác mô tả hệ thống, kết quả và giới hạn, phân công Jira, tạo phẩm nộp và các quyết định kỹ thuật còn mở. Chưa stage/commit/push/update PR17 theo ranh giới lượt này.

### Bộ file hiện có để review

- `README.md`
- `docs/README.md`
- `docs/TRACEABILITY.md`
- `docs/delivery/SCRUM-117-delivery.md`
- `docs/delivery/release-notes-A2.md`
- `docs/diagrams/README.md`
- `docs/diagrams/brewlite-database-erd.svg`
- `docs/diagrams/deployment-figure.tex`
- `docs/diagrams/domain-class-figure.tex`
- `docs/diagrams/render_report_diagrams.cjs`
- `docs/planning/BrewLite_Task_Allocation.md`
- `docs/report/README.md`
- `docs/report/assets/database-erd.pdf`
- `docs/report/assets/domain-class-report.svg`
- `docs/report/assets/domain-model-report.pdf`
- `docs/report/assets/domain-types-report.svg`
- `docs/report/assets/use-case-overview.pdf`
- `docs/report/main.tex`
- `docs/report/output/main.pdf`
- `docs/report/sections/activity-diagram.tex`
- `docs/report/sections/checkout-use-case.tex`
- `docs/report/sections/context-and-scope.tex`
- `docs/report/sections/data-api-implementation.tex`
- `docs/report/sections/deployment-release-delivery.tex`
- `docs/report/sections/production-evidence.tex`
- `docs/report/sections/project-evaluation.tex`
- `docs/report/sections/release-readiness.tex`
- `docs/report/sections/requirements-summary.tex`
- `docs/report/sections/sequence-diagram.tex`
- `docs/report/sections/task-allocation.tex`
- `docs/requirements/diagrams/use-case-overview-report.svg`
- `docs/traceability-matrix.md`

Tổng32 file gồm công việc đã có được bảo toàn và phần biên tập mới. Log/render/helper chỉ ở TEMP.
