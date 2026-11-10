# BrewLite A2 — Release notes nháp

**DRAFT, cập nhật 11/11/2026. Chưa tạo tag, publish release, deploy hoặc nghiệm thu.**

## Phiên bản và nguồn

- Tag đề xuất: `A2-v1.0.0`, theo ví dụ trong planning; nhóm chưa xác nhận quy ước cuối. Không dùng `A1-final` làm release A2.
- Snapshot lịch sử dùng ở lần soạn đầu: `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb` trên remote `dev`; đây **không phải commit phát hành đã chốt**.
- Source hiện tại trong checkout chính: branch `SCRUM-117-production-release-delivery`, HEAD `5021743e99d73c2ce795df72ee5aaa90b04bb0da` (cũng là origin/dev). SHA `7dfc7ca` chỉ là baseline kiểm tra lịch sử; giữ nguyên SHA/test evidence cũ.
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

SCRUM-117 README/runbook/report/delivery/matrix là **thay đổi đề xuất chưa merge**; chỉ thêm vào shipped sau merge SHA. Chưa thấy nguồn xác nhận 114/115 hoàn tất; #16 là phần code của 116, không release/deploy evidence. Các kết quả tìm kiếm “chưa có PR116” trong sổ evidence trước đó chỉ đúng thời điểm lịch sử.

## Environment và database

- Paths chạy npm chuyển sang app tương ứng; không có root npm workspace. CI Node 24 khác Docker Node 26, ghi version thực của artifact khi release.
- Runtime variables, proxy/public origins, JWT/internal/VNPay secrets xem [deployment §5](../deployment.md#5-environment-và-vị-trí-secrets). Chưa xác nhận cấu hình thật trên host; tên secret CD trong target design còn dự kiến.
- Source đang có 9 migrations; SCRUM-117 không thêm migration/schema. Runner production chưa xác minh; runtime image không có Prisma CLI. Chỉ runner được duyệt chạy `db:migrate` (= migrate deploy).
- Catalog seed là dữ liệu demo có guard/upsert, không seed production; chưa có production provisioning được duyệt. Đọc [migration/rollback runbook](../deployment.md#11-runbook-scrum-117--migration-seed-và-rollback).

## Known limitations và quyết định còn mở

- Chưa có URL/ID/SHA production FE/BE, DB network policy, runner và CI/CD run đúng release. Không khẳng định production chưa tồn tại ngoài quyền truy cập.
- **Cần xác nhận scope A2:** payment-status GET còn thiếu theo API v4 §5/SRS FR-34; QueryDR lost-IPN chưa có evidence mới theo ADR chuyển A1→A2 và SRS FR-38. [Bảng nguồn/tác động](SCRUM-117-delivery.md#phạm-vi-release-gap-và-quyết-định-cần-xác-nhận) phân biệt lỗi scenario, giới hạn chỉ được chấp nhận trong A1 và quyết định release chưa có. Không tự miễn yêu cầu A2 hoặc mặc định hai gap chặn toàn bộ release.
- Hosting ADR-005 Proposed; giới hạn tier, quota, expiry, backup và scheduler cần xác nhận theo deployment §11.1.
- Report nháp chưa compile/render; thông tin nhóm và bản nộp cuối chưa chốt. Đã đọc đề A2 v1.0 từ Drive và đối chiếu §9.1; không còn thiếu nguồn checklist này. Đề không quy định tên/vị trí PDF tổng hợp riêng.
- **AC chưa đủ evidence:** release/tag A2, demo cuối, Sprint Review/Retro và acceptance record chưa có. Hướng dẫn rollback đã viết theo candidate Vercel/Render, cần bind IDs/tier/schema compatibility thật. Không dùng notes làm bằng chứng đã phát hành.
- **Khuyến nghị:** rollback rehearsal chưa thực hiện; không tự làm điều kiện chặn AC4 khi chưa có đề/quy trình được duyệt hoặc SCRUM-116 yêu cầu. Không đồng nhất rehearsal với hướng dẫn rollback mà AC đã yêu cầu.
- **Nguồn đã có:** [8 AC người dùng cung cấp](SCRUM-117-delivery.md#2-readiness-theo-acceptance-criteria) và [đề A2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view), không chờ lại AC/checklist. [Push CI 42782530478](https://github.com/brewlite-project/brewlite-a2/actions/runs/42782530478) success tại 7dfc7ca xác nhận baseline lint/unit/build, không CD/production và không phải CI cho docs chưa commit. CI failure/phục hồi cũng đã thu trong delivery E117-C3.

## Điều kiện chốt notes và phát hành

Xem [delivery §8](SCRUM-117-delivery.md#8-trình-tự-còn-lại-và-điều-kiện-thực-hiện). Chốt source SHA sau merge/release workflow, thu CI/CD + deploy IDs + smoke đúng SHA, hoàn thiện PDF/bộ nộp và quyền người chấm, xác nhận người tiếp nhận, rồi mới xin quyền tạo/push tag và publish. Mỗi bước ngoài lượt tài liệu này cần quyền theo AGENTS.md; không thay đổi Jira Approved/Done tự động.

## Nội dung PR đề xuất vào dev

**Title:** `docs(SCRUM-117): prepare A2 release, operations and delivery dossier`

**Body:**

README còn mô tả A1 trong khi ứng dụng đã chuyển sang apps/web và apps/api. PR cập nhật hướng dẫn A2 theo scripts hiện tại, bổ sung runbook migration/seed/rollback tại deployment.md, readiness/evidence/release mapping và hồ sơ demo/bàn giao; thêm entrypoint LaTeX nháp tái sử dụng fragments và bố cục SGU. Đã tìm và đọc đề A2 v1.0, ánh xạ checklist §9.1 và bổ sung requirement matrix theo path bắt buộc §8.1.

Phạm vi đã chuẩn bị:

- Readiness đối chiếu đủ 8 AC SCRUM-117 do người dùng cung cấp, tách hồ sơ draft PR với release đã phát hành/nghiệm thu.
- Hướng dẫn rollback theo candidate provider/tier, giới hạn eligibility/retention, schema/API compatibility và DB recovery riêng. Rehearsal chỉ khuyến nghị khi chưa có nguồn bắt buộc.
- Ghi rõ source/evidence/SHA khác nhau; phân loại payment-status/QueryDR là quyết định release cần xác nhận, không tự waive hoặc chặn mọi AC.
- Engine pdfLaTeX xác định từ preamble và log template SGU; bộ nguồn và hướng dẫn build local/Overleaf, chưa upload dịch vụ ngoài.
- Requirement matrix mới truy 48 FR + 49 NFR theo SRS → US/UC → design/code/test inventory, không tự ghi runtime PASS; mẫu demo/Review/Retro/ký nhận đã có để nhóm điền sau hoạt động thực.

Validation thực chạy ở lượt tài liệu:

- Kiểm tra local Markdown paths/anchors, LaTeX inputs/assets, package scripts/lockfiles, whitespace/conflict và các mẫu nhạy cảm; kết quả sau đối chiếu dev mới ở delivery §12: 10 files, 776 local references, 8 TeX inputs, 19 graphics references; 55 code/config paths trong Git tree 5021743 tồn tại. Không khẳng định loại trừ mọi secret; counts/SHA cũ giữ ở sổ lịch sử.
- `git diff --check` và review phạm vi: chỉ tài liệu; không sửa app, schema, CI/CD hay archive A1; không chạy lại toàn bộ app tests.
- Chưa compile/render PDF mới do chưa tìm được engine khả dụng trên máy. pdfLaTeX trong log SGU chỉ là build template lịch sử.
- Evidence kế thừa mới thu từ GitHub: push CI 42782530478 success trên 7dfc7ca; PR CI 42780158363 success trên e942cbe. Chỉ lint/unit/build, không thay CD/E2E/production smoke.

Dependency và phần chưa xác minh:

- SCRUM-114: scope MVP/PR/commit và giới hạn được chấp nhận; SCRUM-115: report/run integration/browser/Sandbox với environment/SHA/scenario; SCRUM-116: CD/deploy URLs, IDs/SHA, provider/tier/region, DB policy, runner và rollback targets. PR liên quan #6/#9/#12/#15 chưa chứng minh ba task này hoàn tất.
- Leader: chỉ dẫn giảng viên mới hơn đề v1.0 nếu có, metadata report, ownership/tiếp nhận, quyết định scope Mock/VNPay/payment-status/QueryDR và bộ nộp cuối. AC và checklist v1.0 đã có nguồn.
- Production, PDF cuối, demo/Review/Retro, release/tag và nghiệm thu còn mở; không đề xuất SCRUM-117 Done.

PR draft được chuẩn bị cho source branch `SCRUM-117-production-release-delivery` → base `dev`, từ thư mục `D:/CNPM_PJ/brewlite-a2` tại HEAD `5021743`. Nội dung ở đây chỉ là PR body nháp; chưa commit/push, chưa tạo PR GitHub/PR number. Chỉ mở sau khi người dùng review và cho phép các bước Git riêng.

**Trạng thái Git hiện tại (11/11/2026):** checkout chính ở `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`, HEAD/origin/dev `5021743e99d73c2ce795df72ee5aaa90b04bb0da`. 9 tài liệu staged và có unstaged edits; matrix mới untracked. Không dùng branch/path TEMP như hướng dẫn thao tác hiện hành; các tham chiếu đó nếu có trong dossier là lịch sử.
