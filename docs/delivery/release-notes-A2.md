# BrewLite A2 — Release notes nháp

**DRAFT, cập nhật 13/11/2026. Hồ sơ chưa nghiệm thu; SCRUM-117 không tạo tag/release hoặc deploy. Main đã có promotion #24/#26/#28 của nhóm, không đồng nghĩa A2 release/tag đã phát hành.**

## Phiên bản và nguồn

- Tag đề xuất: `A2-v1.0.0`, theo ví dụ trong planning; nhóm chưa xác nhận quy ước cuối. Không dùng `A1-final` làm release A2.
- Snapshot lịch sử dùng ở lần soạn đầu: `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb` trên remote `dev`; đây **không phải commit phát hành đã chốt**.
- Checkout chính: branch SCRUM-117-production-release-delivery, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`, app/config trùng origin/dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Remote main `02452f228712c3501c8d27f0f1ae737ad206785d`; không phải source được checkout. Bản docs cũ ở 3543a55/PR17, cập nhật mới chưa stage. SHA 7dfc7ca/5021743 và test evidence cũ giữ lịch sử.
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
| Render CD configuration docs | [#27](https://github.com/brewlite-project/brewlite-a2/pull/27) 0e43bcb80f64d6a5fa558cd80f71a199029535d0 | Chỉ apps/api/README.md: main, Dockerfile, After CI Checks Pass; verification deployment sẽ ghi sau, chưa có CD event |

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

## Nội dung cập nhật PR #17 vào dev

**Title:** `docs(SCRUM-117): complete A2 report PDF and production delivery evidence`

Hoàn thiện hồ sơ SCRUM-117 / A2-T5.4 trên baseline ứng dụng dev `0e43bcb`, bổ sung báo cáo PDF 53 trang và evidence triển khai Render. Cập nhật các mô tả cũ về backend, database, migration và trạng thái review để nhóm có thể nghiệm thu từng AC theo nguồn thực tế.

## Thay đổi

- Đồng bộ README, deployment/runbook, delivery dossier, release notes và hai bảng traceability.
- Bổ sung 5 ảnh Render đã che credential/IP, xác nhận Auto-Deploy Live source `02452f2`, PostgreSQL Free 18 tại Singapore và network allowlist 3 IP /32.
- Tổng hợp HTTP evidence backend `GET /` và `GET /products` ngày 13/11/2026. Giữ timestamp của request riêng với deployment.
- Tích hợp LaTeX theo template SGU, báo cáo A1 làm nguồn lịch sử, xuất `docs/report/output/main.pdf`.
- Sửa nhận định Leader PASS theo đính chính của người dùng: Leader chưa kiểm tra/nghiệm thu SCRUM-117.
- Ghi phương án nhóm tiếp tục quản lý tài nguyên. Mẫu chuyển quyền và rollback rehearsal là khuyến nghị, không bổ sung AC mới.
- Chuẩn bị backup/restore PostgreSQL 18, rollback ứng dụng có điều kiện và kịch bản demo/Review/Retro.

## Kiểm chứng

- pdfLaTeX + VnTeX/MiKTeX, các lượt build cuối exit 0, PDF 53 trang.
- Render MuPDF toàn bộ và xem các trang thay đổi. Không có Overfull hoặc undefined references/citations trong log cuối. Underfull hbox ở một số bảng/đoạn căn đều đã kiểm tra trực quan.
- PDF SHA256 `F796B94AA56D2D80F341F182627E21FB64F58F6B705843911EBD05C35E5B9CCB`.
- 798 local links/anchors, 9 TeX inputs, 18 graphics references, 48 FR và 49 NFR được kiểm tra.
- Whitespace, conflict markers và các mẫu credential/token được dò đạt kiểm tra. Các mẫu dò không loại trừ mọi loại secret.
- Thay đổi thuộc tài liệu/evidence/PDF. Không chạy lại app tests local. CI và test claims lịch sử được ghi cùng nguồn/SHA/môi trường.

## Phần còn cần nhóm xác nhận

- Vercel status success trên `02452f2` đã có, còn thiếu mapping production alias tới deployment.
- Backend HTTP/liveness/catalog VERIFIED tại thời điểm probe. Actual Internal DB usage và migration runner chưa có evidence trực tiếp.
- External DB access giới hạn 3 IP /32. Cần quyết định phạm vi truy cập quản trị phù hợp AC3 và kế hoạch trước ngày DB hết hạn 10/12/2026.
- Release/tag và eligible rollback artifacts chưa chốt. `A2-v1.0.0` là tên đề xuất cho commit stable sau review.
- Demo, Sprint Review/Retrospective và nghiệm thu SCRUM-117 chưa có evidence.
- PR26 báo payment PAID/SUCCESS/+10, QueryDR/IPN và giao dịch cần đối soát được giữ đúng giới hạn bằng chứng.

Báo cáo giữ DRAFT. PR này chuẩn bị hồ sơ để review, chưa đề nghị đánh dấu SCRUM-117 Done.

## Bổ sung body PR17 — evidence/PDF14-11

**Cập nhật tiếp 14/11/2026:** HEAD91e6f99/dev0e43bcb giữ nguyên, 10 docs unstaged đầu vào được bảo toàn. Backend https://brewlite-a2-api-hntn.onrender.com/ có ảnh Render Auto-Deploy Live02452f2 (fullSHA02452f228712c3501c8d27f0f1ae737ad206785d), deployed field13/11/2026 08:39:19Z. GET mới / và /products200 lúc16:24:59Z ngày13/11, catalog9 items; GET không xuất processSHA. DB Free18/Singapore/1GB/Available, expiry10/12/2026; external3 /32 restricted, chưa private-only. Bỏ Edge/Computer Use theo yêu cầu; Người dùng đính chính ngày 14/11/2026: Leader chưa kiểm tra/nghiệm thu SCRUM-117. Evidence và các giới hạn tại dossier §14.

Title đề nghị: docs(SCRUM-117): complete A2 report PDF and production delivery evidence.

Nội dung bổ sung dùng kèm body cập nhật PR17: thêm Render evidence đã che và báo cáo PDF53 trang, bộ build/render/QA có nguồn; AC2 VERIFIED snapshot, AC3 vẫn PARTIAL. Hướng dẫn backup/restore PostgreSQL18 và candidate rollback được chuẩn bị, chưa backup/restore/rollback production. Không gọi PDF hoàn tất là release nghiệm thu. Chưa stage/commit/push/update PR17.


### Hiệu chỉnh trước review PR17 ngày 14/11

Người dùng xác nhận Leader chưa kiểm tra/nghiệm thu. Bỏ các nhận định Leader PASS, dùng phương án nhóm tiếp tục quản lý tài nguyên và giữ mẫu chuyển quyền là khuyến nghị. Sửa checklist/backend/CD đã lỗi thời. PDF53 trang được build/render lại; checksum hiện hành ở report README. Ba lượt build cuối exit0; log không có Overfull/undefined refs/citations/LaTeX-Package Warning, có Underfull hbox đã kiểm tra trực quan. GitHub/Vercel đã được tra lại, còn thiếu alias binding và nguồn runtime Internal DB usage.
