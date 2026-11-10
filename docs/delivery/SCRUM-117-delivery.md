# SCRUM-117 / A2-T5.4 — Readiness, demo và bàn giao

**Trạng thái: DRAFT — hồ sơ chuẩn bị review; chưa phát hành, chưa nghiệm thu, không đề xuất Jira Done.**

**Checkout hiện tại (11/11/2026):** repository `D:/CNPM_PJ/brewlite-a2`, branch
`SCRUM-117-production-release-delivery`, HEAD `5021743e99d73c2ce795df72ee5aaa90b04bb0da`
(baseline `origin/dev`). 9 tài liệu đang staged và có chỉnh sửa unstaged; ma trận mới
untracked. PR body là bản nháp trong release notes; chưa có commit/push hoặc PR draft trên GitHub.
Worktree TEMP `C:/Users/Khai Hoang/AppData/Local/Temp/SCRUM-117-production-release-delivery-sync`
và branch `SCRUM-117-production-release-delivery-sync` là hoạt động lịch sử riêng; không phải
thư mục/branch checkout hiện hành.

**Snapshot lịch sử sau fetch (10/11/2026):** đã đọc remote dev `5021743e99d73c2ce795df72ee5aaa90b04bb0da`;
tại thời điểm đó HEAD task vẫn `7dfc7ca`, chưa tích hợp source mới. Hiện trạng checkout xem ở đầu dossier;
10 file/staged–unstaged và dự phòng được ghi trong snapshot lịch sử. Các kết quả §9–11 giữ thời điểm và SHA lịch sử.

## 1. Phạm vi và snapshot trước khi sửa

- Ngày kiểm tra: 10/11/2026, múi giờ UTC+07. Evidence mới thuộc workspace Windows, không thuộc production.
- Repository/remote: `https://github.com/brewlite-project/brewlite-a2.git`.
- Branch ban đầu `SCRUM-102-normalize-requirements`, HEAD `7efaf64dd2788a1370a8fd5259646f844289e990`, working tree sạch. Không sửa branch này.
- `git ls-remote origin refs/heads/dev` xác nhận trực tiếp remote lúc khoảng 19:44–19:51: `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`. Remote-tracking cũ là `b542ee4`; đã fetch, không pull/merge.
- Branch tài liệu `SCRUM-117-production-release-delivery` tạo từ đúng `origin/dev` trên. Source kiểm tra trong phần còn lại là **7dfc7ca**; nội dung SCRUM-117 chưa có commit.
- Đã đọc AGENTS.md, planning, requirements, architecture, deployment, CI, scripts/package manifests, Docker/Compose, env **mẫu**, migrations/seed và LaTeX. Không đọc populated env/credential.
- **Nguồn AC:** 8 Acceptance Criteria của SCRUM-117 đã được người dùng cung cấp và xác nhận; dùng trực tiếp tại §2, không yêu cầu lại bản export Jira. Lượt tiếp tục đã tìm và đọc [Assignment2-BrewLite.pdf — v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) trong Drive nguồn môn học: SGU/Khoa CNTT, học kỳ I 2026–2027; metadata modified `2026-10-13T01:46:22.978Z`, 87.063 bytes. §7.4 là delivery, §8.1 là traceability, §9.1 là checklist nộp bài. Nếu giảng viên có bản thay thế mới hơn, cần đối chiếu phiên bản đó; không còn yêu cầu gửi lại bản v1.0 đã tìm được. Template SGU trong Downloads là mẫu báo cáo riêng, không phải rubric.

## 2. Readiness theo Acceptance Criteria

Cập nhật ngày 10/11/2026. **Nguồn của cả 8 dòng là Description/AC SCRUM-117 do người dùng cung cấp**, đối chiếu thêm đề v1.0 tại §1. Số 1–8 chỉ là số thứ tự đối chiếu, không giả định Jira có mã AC riêng. Các nhận định chưa tìm thấy đề trong evidence lần trước là lịch sử tìm kiếm, không phải trạng thái hiện tại; checklist từ đề đã được ánh xạ tại §7.

VERIFIED = đạt đúng phạm vi có evidence; NOT VERIFIED = chưa chứng minh đủ; BLOCKED = thiếu đầu vào cụ thể để kiểm tra; NOT APPLICABLE chỉ khi có quyết định/giải thích hợp lệ. Các phần source/tài liệu đã kiểm tra không tự làm cả AC production đạt.

Sau đối chiếu dev mới 5021743 ở §12, trạng thái 8 AC dưới đây chưa thay đổi:
PR #16/CI đã có nhưng production, DB policy, CD/migration/deploy/smoke và nghiệm
thu SCRUM-117 vẫn chưa có evidence. Source backend và cấu hình liên quan không
đổi; không thay các SHA của runtime/test report cũ bằng SHA mới.

| AC đã được cung cấp | Artifact / căn cứ và kết quả | Commit / môi trường / thời điểm đối chiếu | Trạng thái AC | Còn thiếu / đầu mối cần xác nhận |
|---|---|---|---|---|
| 1. Frontend production HTTPS hoạt động | Deployment §8 còn TBD; chưa có URL để mở browser/TLS/asset | 7dfc7ca / repo + nguồn GitHub truy cập được / 10-11 | BLOCKED | SCRUM-116 cung cấp URL, deploy ID/SHA; chưa xác nhận người cung cấp |
| 2. Backend API và health endpoint truy cập được | Source có `GET /` → `Hello World!`, `GET /products` đọc DB; không tự đặt `/health`. Chưa kiểm tra deployed API | 7dfc7ca / static / 10-11 | BLOCKED | SCRUM-116: backend origin, deploy SHA; sau đó chỉ GET read-only để xác minh |
| 3. PostgreSQL production cấu hình phù hợp, không công khai trực tiếp | ADR-005 Proposed; internal URL không chứng minh external access tắt; Docker local không chứng minh production | 7dfc7ca / deployment §3,8; ADR-005 / 10-11 | BLOCKED | SCRUM-116/DB owner: tier/region, Networking policy đã che secret, DB read/migration status; tên owner chưa xác nhận |
| 4. Có release/tag, release notes và hướng dẫn rollback | Notes nháp đã có; deployment §11.3 có hướng dẫn theo candidate provider. Remote tag chỉ A1-final ở lần kiểm tra đầu; chưa có release A2 được xác minh | 7dfc7ca + docs chưa commit / repo; remote evidence §3 / 10-11 | NOT VERIFIED | Release commit/tag và rollback target IDs/compatibility còn thiếu. Rehearsal **khuyến nghị**, chưa thực hiện; chưa có căn cứ bắt buộc cho AC này |
| 5. README và tài liệu bàn giao đầy đủ | README, runbook, delivery mapping/demo/ownership đã được chuẩn bị và static review; runtime URLs/ownership chưa điền vì chưa có evidence | 7dfc7ca + docs chưa commit / Windows static / 10-11 | NOT VERIFIED (phần tài liệu đã chuẩn bị) | Hoàn thiện metadata vận hành từ SCRUM-116/Leader rồi reviewer đánh giá tính đầy đủ; không yêu cầu lại AC |
| 6. Có bằng chứng demo và Sprint Review/Retrospective | Có report/ảnh local SCRUM-112; agenda cuối ở §5 chưa phải biên bản hoặc demo đã diễn ra | Report source 34cbbc0, evidence kế thừa; đọc lại 10-11 | NOT VERIFIED | Nhóm cung cấp video/log demo A2, Review/Retro thực, thời gian/phạm vi/version; chưa xác nhận người phụ trách |
| 7. Các tạo phẩm bắt buộc đã có trên repository | Đã đối chiếu đề v1.0 §8.1/9.1 và bổ sung docs/traceability-matrix.md với 48 FR + 49 NFR. Artifacts nguồn tồn tại; CD/production/demo và bản bàn giao cuối chưa có evidence; docs chưa commit | 7dfc7ca + docs chưa commit / local repo + Drive / 10-11 | NOT VERIFIED | Hoàn thiện các dòng checklist §7 còn mở và đưa bản đã review lên repo sau khi được phép; không còn bị chặn vì chưa có checklist |
| 8. Có PR review và nghiệm thu | PR body đã chuẩn bị; chưa tạo PR SCRUM-117 theo ranh giới lượt này; không có acceptance record | Branch SCRUM-117 / 10-11 | NOT VERIFIED | Sau cho phép riêng: commit/push/open draft PR vào dev; reviewer/Leader review và quyết định nghiệm thu |

Jira Done không thay merge/test; PR merged không thay nghiệm thu. CI xanh không thay CD; agenda không thay họp đã tổ chức. Hướng dẫn rollback được yêu cầu bởi AC4; rehearsal chỉ nâng mức tin cậy khi chưa có quy định được duyệt buộc thực hiện. SRS AC-OPS-07 là nguồn yêu cầu liên quan cần xác nhận cửa nghiệm thu áp dụng, không tự nâng thành điều kiện mới của SCRUM-117.

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

| Vấn đề / nguồn cụ thể | Phân loại hiện tại và tác động | Xác nhận cần có |
|---|---|---|
| Payment status: [SRS §8](../requirements/srs.md#8-bảng-gap-và-mục-cần-leader-xác-nhận), FR-34; [API v4 §5](../a1-archive/api/BrewLite_API_Contract_v4.0.md); `apps/web/services/payment.service.ts` gọi status, inventory `apps/api/src/payments/*controller.ts` không có GET status tại 7dfc7ca | **Implementation gap, quyết định release cần xác nhận.** Cản chứng minh Return UI đọc authoritative state cho scenario đó; không tự cản chứng minh HTTPS, GET / hoặc menu public | Leader/API owner xác nhận contract/scope release A2 lần này và task xử lý hoặc quyết định chấp nhận giới hạn cụ thể. Chưa thấy waiver A2; không tự miễn hoặc đóng gap |
| QueryDR: [ADR APPROVED ngày 03/11/2026, §2.2](../a1-archive/decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md), SRS FR-38 và §8 | **Giới hạn được chấp nhận trong A1**, chuyển Sandbox E2E/lost-IPN recovery sang A2/SCRUM-95, không miễn yêu cầu A2. Chưa có evidence mới; không claim financial recovery E2E. Chưa có quyết định cửa nghiệm thu release A2 lần này | Leader/QA xác nhận scenario/cửa nghiệm thu SCRUM-95/114/115; nếu chấp nhận giới hạn ở release này cần link quyết định và tác động. Không mặc định chặn toàn bộ 8 AC |
| Proxy 502 lịch sử: [SCRUM94](../a1-archive/verification/SCRUM94_Verification_Evidence.md) | Không tái hiện ở rerun A1 theo archive; lần này không production runtime probe | SCRUM-116 cung cấp FE→API evidence; không khẳng định còn lỗi hoặc đã hết ở deployed version |
| Hosting: [ADR-005](../architecture/adr/005-production-hosting.md), deployment §8 | Candidate vẫn Proposed; URL/tier/region/migration runner thực chưa xác minh, trực tiếp thiếu đầu vào AC1–3 và rollback binding AC4 | SCRUM-116/Leader xác nhận actual topology, không dùng sơ đồ làm proof-of-deployment |
| Scope demo: đề v1.0 §7.1 ghi thanh toán Ví/Thẻ mô phỏng; [Mock policy](../a1-archive/api/SCRUM85_Mock_Payment_Environment_Access_Policy.md) và source chặn Mock khi NODE_ENV=production | **Cần quyết định môi trường/phạm vi demo.** VNPay Sandbox là phần mở rộng có nguồn riêng, chưa có quyết định ở hồ sơ xác nhận nó thay toàn bộ demo Mock của đề. Không bật Mock production để làm demo | Leader/QA/SCRUM-114/116 chốt cách chứng minh luồng tối thiểu đúng đề và policy: môi trường demo được phép, production và evidence tương ứng; không tự miễn Mock hoặc giả Sandbox PASS |
| CD/image: đề v1.0 §7.3 yêu cầu image có tag SHA/semantic version; push registry chỉ khi nền tảng yêu cầu | Không còn là giả định “nếu rubric yêu cầu image tag”; candidate Render host-build vẫn cần bằng chứng image version/artifact và deploy mapping thực | SCRUM-116 xác nhận image/tag/build provenance và cơ chế deploy. Không tự bắt buộc registry độc lập khi đề chỉ yêu cầu có điều kiện |

Không sửa app, policy hoặc quyết định nghiệp vụ trong SCRUM-117. Chưa có quyết định A2 chấp nhận hai gap thanh toán; hồ sơ không đánh đồng “cần xác nhận” với lỗi chặn toàn bộ release, và không đánh dấu PASS cho các scenario chưa đủ evidence.

### Evidence các task phụ thuộc sau tìm kiếm rộng

| Task cần đối chiếu | Nguồn tìm được và giới hạn | Đầu vào còn cần |
|---|---|---|
| SCRUM-114 — MVP thực tế | Không thấy PR theo key hoặc nội dung đủ xác nhận thuộc task. [PR #15](https://github.com/brewlite-project/brewlite-a2/pull/15) / SCRUM-112 merged tại 7dfc7ca có report menu/mobile source 34cbbc0; là evidence **liên quan**, không đổi tên thành SCRUM-114 | Link scope/PR/commit hoặc xác nhận cách task 114 kế thừa MVP; các giới hạn đã được chấp nhận |
| SCRUM-115 — integration/E2E | Không có PR/evidence gắn task. Report #15 nêu 11 Products E2E, local tests và ảnh; CI #12 chạy unit/build. Các tests A1 trong archive là historical, không chứng minh Sprint 2 integration/browser/Sandbox E2E hiện tại | Run/report với SHA, environment, scenario và actual result; ghi riêng browser, DB integration, Sandbox |
| SCRUM-116 — CD/deploy/rollback | Đã có [PR #16](https://github.com/brewlite-project/brewlite-a2/pull/16), merge 5021743: Next/proxy hardening; CI PR/push success. Body PR ghi Render/Vercel deploy, CD và production smoke là follow-up. Không đổi workflow và chưa có actual origins/deploy SHA. Runbook vẫn candidate | Còn cần CD workflow/integration/run, FE/BE URLs + deployment IDs/SHA, provider/tier/region, runner/rollback targets; merge #16 không đồng nghĩa toàn task Done |

Tìm cả title/body/diff và toàn bộ hai trang PR trả về, không chỉ mã task. PR số #115/#116 trong lịch sử A1 là số PR, không phải bằng chứng cho Jira SCRUM-115/116. Không thấy URL production sạch trong nguồn được truy cập nên chưa gửi GET production. Các nguồn bên ngoài quyền truy cập vẫn có thể tồn tại; không suy Jira trạng thái hoặc người phụ trách từ việc không tìm thấy.

## 4. Release/tag → source → deployments → runs → smoke

| Phiên bản | Source commit | Frontend deployment | Backend deployment | CI/CD run | Smoke evidence / khác biệt |
|---|---|---|---|---|---|
| A1-final (provenance) | 1951dc124c83359556f04adb6ba3f0ee9f22fce4 | Không xác minh A2 | Không xác minh A2 | Không dùng làm CI A2 | Archive lịch sử, không release A2 |
| dev baseline cũ | 7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb | Chưa có ID/SHA | Chưa có ID/SHA | [Push CI 42782530478](https://github.com/brewlite-project/brewlite-a2/actions/runs/42782530478) success, đúng SHA; CD chưa thấy | E112-H chạy source 34cbbc0, **khác SHA dev**, không production; không dùng CI success làm deployment evidence |
| Source 5021743 hiện tại; deployment chưa xác minh | 5021743e99d73c2ce795df72ee5aaa90b04bb0da | Chưa có ID/SHA | Chưa có ID/SHA | [Push CI 42846397766](https://github.com/brewlite-project/brewlite-a2/actions/runs/42846397766) success, 15:38:07Z–15:39:50Z ngày 10-11 | Không có deploy/smoke evidence; không tự gắn A2 tag vào SHA này |
| PR #16 head, không release | e8b1498ab0fe70a1bacd0f2b221492c46796643f | Không xác minh | Không xác minh | [PR CI 42845148086](https://github.com/brewlite-project/brewlite-a2/actions/runs/42845148086) success, 15:31:04Z–15:32:49Z ngày 10-11 | Khác merge SHA; body PR ghi CD/hosting/smoke follow-up |
| PR #15 (source branch, không release) | e942cbe9be479e53ba76f8c3bf99e3e489db93f6 | Không xác minh | Không xác minh | [PR CI 42780158363](https://github.com/brewlite-project/brewlite-a2/actions/runs/42780158363) success | Khác SHA merge 7dfc7ca và runtime report 34cbbc0; chỉ xác nhận CI branch |
| A2-v1.0.0 (đề xuất, chưa tạo) | Chờ release commit được duyệt | Chờ URL/ID/artifact/SHA | Chờ URL/ID/image/SHA | Chờ CI + CD run cùng SHA | Chờ production smoke đúng deployment; không tự điền 7dfc7ca làm final |

SCRUM-117 chỉ thêm tài liệu chưa commit. Khi release có FE/BE khác SHA, ghi cả hai, lý do và tương thích; reviewer phải chấp nhận hoặc dừng phát hành. Không che khác biệt bằng nhãn “latest”. [Release notes nháp và PR body](release-notes-A2.md).

## 5. Demo và Scrum evidence (chưa thực hiện)

Điều kiện đầu vào: Leader chốt scope/contract, deployment mapping, tài khoản demo cấp riêng, dữ liệu được phép, QA xác nhận payment path, quyền tạo giao dịch Sandbox riêng. Lượt SCRUM-117 **không tạo tài khoản, đơn, giao dịch hoặc thay đổi production**.

| Thời lượng dự kiến | Bước trình bày | Expected result | Evidence cần thu |
|---|---|---|---|
| 1 phút | Mở README, release mapping, FE HTTPS ở browser không đăng nhập provider | Đúng SHA, UI tải, không interstitial/mixed content | URL sạch, screenshot, giờ/viewport |
| 1 phút | Menu, chi tiết, size/topping; thêm/sửa giỏ trên client | Giá/giới hạn theo contract, loading/empty/error trình bày khi có fixture được duyệt | Video thao tác và API public đọc DB |
| 2 phút | Auth → tạo đơn tại demo environment được phép | JWT/ownership server-side; tổng tiền từ backend | Step log đã lọc dữ liệu, SHA/environment |
| 2 phút | VNPay Sandbox đã được cho phép, Return và authoritative outcome | Return không tự finalize; IPN/QueryDR được xác minh, Payment/Order nhất quán | Gateway + callback + DB evidence; status-route gap phải xử lý/được quyết định rõ trước claim PASS |
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

| Tài nguyên | Người phụ trách đã xác nhận | Người tiếp nhận đã xác nhận | Cách cấp quyền cần thống nhất | Điều kiện ký nhận |
|---|---|---|---|---|
| Frontend hosting | Chưa xác nhận | Chưa xác nhận | Invite vào project/scope bằng tài khoản cá nhân, role theo plan; nếu plan không hỗ trợ nhóm, Leader chốt phương án hợp lệ | Người nhận mở project, kiểm tra domain/deployment/env names và hiểu cách rollback |
| Backend hosting | Chưa xác nhận | Chưa xác nhận | Invite vào workspace/service với role tối thiểu; không bàn giao password tài khoản chủ | Người nhận đọc được logs/deploy history, hiểu port/health/scheduler và runner thực |
| PostgreSQL/backup | Chưa xác nhận | Chưa xác nhận | Cấp role/workspace hoặc DB role qua kênh secret được duyệt; không chia sẻ password tài khoản chủ | Xem được expiry/policy, chạy kiểm tra read-only được phép; xác minh nơi lưu backup |
| GitHub release/CD | Chưa xác nhận | Chưa xác nhận | Repo/team role và environment approval tối thiểu; token ở secret store, không trong hồ sơ | Người nhận xem run/artifact/release và hiểu gate phát hành |
| Demo và báo cáo | Chưa xác nhận | Chưa xác nhận | Quyền đọc/chỉnh sửa kho evidence/report qua invite; người chấm có quyền riêng được nhóm duyệt | Người nhận tự mở video/biên bản, build report bằng toolchain được chốt và biết bộ nộp phiên bản nào |

**Mẫu ký nhận (chưa ký):** tài nguyên/project ID an toàn; người giao/nhận đã xác nhận; thời gian UTC; role được cấp; kiểm tra người nhận tự truy cập; version/docs/evidence bàn giao; hạn hosting/DB và việc còn mở; link xác nhận của hai bên. Chỉ ghi cách cấp quyền và trạng thái, không ghi credential. Release/rollback executor chưa được xác nhận chỉ bằng việc ai đang là Leader.

Khang được nhắc là Leader trong planning, nhưng **không suy ra** là chủ hosting, DBA hay release executor. Chỉ bổ sung tên khi có xác nhận của nhóm; chưa có thời hạn bàn giao được xác nhận.

## 7. Checklist nộp bài và khả năng truy cập của người chấm

Nguồn: **Assignment 2 v1.0 §9.1**, bổ sung chi tiết bắt buộc ở §6.4, §7.2–7.4, §8.1. Đây là checklist đã đối chiếu với bản đề tìm được, không còn chỉ dựa Jira/planning. Cột trạng thái không phải điểm nghiệm thu. Mọi tạo phẩm cuối cần khóa về release SHA/tag được chọn; checkout hiện tại ở source 5021743; 7dfc7ca là baseline evidence lịch sử. Docs SCRUM-117 chưa có commit.

| Mục theo đề | Vị trí chuẩn của tạo phẩm | Evidence/phiên bản hiện có | Trạng thái và việc còn lại |
|---|---|---|---|
| Link repo và quyền giảng viên | [Repository A2](https://github.com/brewlite-project/brewlite-a2), [README](../../README.md) | GitHub connector đọc được; chưa thử bằng tài khoản/quyền giảng viên | NOT VERIFIED: người chấm phải clone/đọc được release; chưa có xác nhận quyền |
| SRS, use-case và requirement matrix | [SRS](../requirements/srs.md), [UC](../requirements/A2_T1.3_Checkout_Use_Case_Specification.md), [traceability-matrix.md](../traceability-matrix.md) | SRS/UC ở 7dfc7ca; matrix mới map 48 FR + 49 NFR, có design/code/test inventory | Source mapping đã chuẩn bị; chưa commit/reviewer xác nhận coverage và runtime evidence. [TRACEABILITY.md](../TRACEABILITY.md) là ma trận task/PR riêng |
| Activity, sequence, class, deployment | [Diagram sources/exports](../diagrams/), [architecture](../architecture/architecture.md) | Source và exports hiện có, xem task/merge SHA trong TRACEABILITY | Deployment còn target design; cần SCRUM-116 đối chiếu actual topology, image/registry/provider theo đề §5.2 |
| Frontend, backend và migrations | [apps/web](../../apps/web/), [apps/api](../../apps/api/), [migrations](../../apps/api/prisma/migrations/) | Source 7dfc7ca, 9 migration directories | VERIFIED tồn tại source; build/deploy release và migration production chưa xác minh |
| Unit, integration và ít nhất một E2E menu→confirmation | [API tests](../../apps/api/test/), [web tests](../../apps/web/tests/), [matrix lookup](../traceability-matrix.md#3-design-codeapi-và-test-lookup) | Có test files; local report SCRUM-112 source 34cbbc0; CI chỉ unit/build | NOT VERIFIED cho Sprint 2/release: SCRUM-115 cung cấp đúng scenario, SHA/environment/result; không dùng JSDOM/Mock làm Sandbox E2E |
| CI/CD chạy thành công | [CI workflow](../../.github/workflows/ci.yml), §3 E117-C2/C3 | CI success/failure có run/SHA; chưa thấy CD workflow/run | PARTIAL: cần CD build/tag image, deploy, safe migration, health/smoke và failure handling theo §7.3; branch protection chưa xác minh |
| Production frontend/API/health, DB không public | [deployment §8/11](../deployment.md), mapping §4 | Chưa có origins, deploy IDs/SHA và DB Networking evidence | BLOCKED kiểm tra do thiếu input SCRUM-116; GET / là liveness, DB read kiểm tra riêng |
| Release notes, README, rollback | [notes](release-notes-A2.md), [README](../../README.md), [runbook](../deployment.md#11-runbook-scrum-117--migration-seed-và-rollback) | Tài liệu nháp; A2-v1.0.0 chỉ đề xuất | Chưa tag/release; rollback cần actual tier/target/compatibility. Đề không yêu cầu rehearsal |
| Video/demo và Sprint Retrospective; Sprint Review theo §7.4 | §5: script, mẫu ghi nhận và link evidence chờ điền | Chưa có video/biên bản cuối được cung cấp | NOT VERIFIED: phải demo luồng end-to-end thật và lưu Review/Retro; template không thay evidence |

**Báo cáo LaTeX/PDF theo yêu cầu người dùng:** source chuẩn `docs/report/main.tex`, PDF đề xuất `docs/report/output/main.pdf`; chưa compile/render. Đề v1.0 không quy định tên/vị trí PDF tổng hợp hay đưa PDF này thành một mục riêng trong §9.1; không gọi vị trí đề xuất là quy định giảng viên. Deadline/portal, quy cách tên file và metadata GVHD/thành viên vẫn cần nhóm xác nhận nếu có hướng dẫn bổ sung. Học kỳ I 2026–2027 đã có nguồn từ bìa đề.

**Sai khác layout cần reviewer xem:** đề §9 minh họa root `.env.example` và `tests/`; repo hiện có env mẫu trong từng app/compose và tests trong app. Các path hiện hành được README/matrix dẫn đúng; chưa có quyết định yêu cầu di chuyển/tạo bản trùng. SCRUM-117 không sửa config hoặc test layout để tự coi tương đương.

**Điều kiện người chấm ở §7.4:** clone repository, chạy hệ thống theo README, truy cập production. Chưa thực hiện clean-clone setup ở một môi trường mới trong lượt này; không lấy static script review làm bằng chứng tái tạo thành công. Khi có URL/quyền, browser riêng phải tải UI/asset, kiểm tra TLS/mixed content, FE→API menu đọc DB. Mở/phát video, mở PDF đúng phiên bản và đọc/download từng evidence; trang login/HTTP 200 không đủ. Hiện chưa có URL production/demo/PDF để chạy các bước đó.

## 8. Trình tự còn lại và điều kiện thực hiện

1. Giữ 8 AC tại §2 và đề A2 v1.0 đã tìm được tại §1/7. Leader bổ sung chỉ dẫn giảng viên mới hơn nếu có, roster tiếp nhận và URLs/evidence; xác nhận scope/contract/payment demo và hosting/tier, không yêu cầu lại nguồn đã có.
2. SCRUM-114/115/116 cung cấp PR/merge SHA, test/migration/CD/deploy evidence. Leader triage status-route gap và QueryDR E2E; SCRUM-117 không sửa ứng dụng/CD.
3. Reviewer review docs diff và report; cài/chọn toolchain SGU được duyệt, build PDF hai lượt, kiểm tra từng trang/TOC/bảng/hình/link/reference; bổ sung kết quả thực. Xác nhận metadata nhóm/GVHD từ nguồn thật.
4. Sau người dùng cho phép riêng: commit/push branch, mở PR vào dev; CI/review bắt buộc đạt rồi mới xin/thi hành merge theo quy trình. Chưa thực hiện các bước này.
5. Theo workflow repo đã được Leader xác nhận, chọn commit phát hành trên nhánh release (`main` là nhánh stable; không tự tạo nhánh release mới/merge). CI/CD phải gắn với **commit phát hành thực**, không chỉ SHA feature; kiểm tra cả FE/BE, migrations và rollback compatibility.
6. Chỉ khi được cấp quyền riêng: release executor chạy deploy/CD/migration theo SCRUM-116; QA thu production smoke và Sandbox E2E được phép. Trong lượt này chỉ chuẩn bị quy trình và kiểm tra read-only nếu có URL.
7. Chốt mapping §4, demo/Review/Retro thực, PDF/bộ nộp đúng checklist được cung cấp; thử quyền người chấm và người tiếp nhận. Xác nhận version khôi phục/compatibility; rehearsal khuyến nghị ở môi trường riêng được phép, không tự làm gate nếu chưa có quy định áp dụng.
8. Sau nghiệm thu/release approval: người được phân công tạo/push tag A2 theo quy ước đã chốt, publish release và gắn notes/evidence đúng SHA. Không tag commit chưa nghiệm thu; A1-final giữ provenance. Reviewer/Leader quyết định Jira Done cuối cùng.

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
