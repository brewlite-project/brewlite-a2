# BrewLite A2 Documentation Center

Trung tâm điều hướng tài liệu và tạo phẩm của đồ án **BrewLite Assignment 2**. Các đường dẫn trong file này được viết tương đối từ thư mục `docs/`.

**Baseline kiểm tra 13/11/2026:** workspace `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`; `origin/dev` sau fetch lượt trước và đối chiếu lại là `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Đầu lượt working tree/index sạch; thay đổi lượt này chỉ ở tài liệu, chưa stage. Source ứng dụng/config tại HEAD trùng origin/dev; diff ba chấm chỉ 10 tài liệu SCRUM-117. Merge dev trong HEAD là lịch sử đã có trước lượt này, không phải thao tác vừa thực hiện.

[PR #17](https://github.com/brewlite-project/brewlite-a2/pull/17) đã tồn tại, **open, draft=false**, head remote `3543a55d4fed63cd343f5da59d28500f124490be`, base `dev` (API snapshot base SHA `5021743`). Local HEAD đi trước remote branch 20 commits. PR files API hiện liệt kê đúng 10 file docs; nội dung local mới chưa có trên PR. Chưa có review trong API trả về. Chỉ chuẩn bị nội dung cập nhật PR, không tạo trùng/chuyển Draft/push trong lượt này.

[Readiness/evidence/demo/checklist](delivery/SCRUM-117-delivery.md), [release notes và body cập nhật PR17](delivery/release-notes-A2.md), [runbook migration/seed/rollback](deployment.md#11-runbook-scrum-117--migration-seed-và-rollback). Source mới #18–23/#25/#27 đã có trong checkout; CI không thay CD. Browser smoke NOT VERIFIED do công cụ; FE URL đã có và HTTP evidence ghi ở delivery §13.

Report [main.tex](report/main.tex) kế thừa roster/nền tảng A1 có nguồn, bổ sung triển khai/kiểm thử/vận hành A2; compiler **pdfLaTeX + VnTeX**. [Build local/Overleaf](report/README.md); PDF tổng hợp đã build/render, xem README báo cáo, không upload dịch vụ ngoài.

## 1. Bản đồ tài liệu

| Khu vực | Nội dung | Điểm vào |
|---|---|---|
| Planning | Phân tích khoảng cách A1–A2, kế hoạch triển khai và risk register | [`planning/A2_Gap_Analysis.md`](planning/A2_Gap_Analysis.md), [`planning/A2_Implementation_Plan.md`](planning/A2_Implementation_Plan.md), [`planning/A2_Risk_Register.md`](planning/A2_Risk_Register.md) |
| Requirements | Context & Scope, SRS và đặc tả Use Case Checkout | [`requirements/context-and-scope.md`](requirements/context-and-scope.md), [`requirements/srs.md`](requirements/srs.md), [`requirements/A2_T1.3_Checkout_Use_Case_Specification.md`](requirements/A2_T1.3_Checkout_Use_Case_Specification.md) |
| Requirements diagrams | Source và hình tổng quan Use Case | [`requirements/diagrams/`](requirements/diagrams/) |
| Activity diagrams | Đặc tả Activity Diagram Checkout; source PlantUML và bản xuất theo overview/phase | [`diagrams/activity_diagram/A2_T2.1_Activity_Diagram_Checkout.md`](diagrams/activity_diagram/A2_T2.1_Activity_Diagram_Checkout.md) |
| Sequence diagrams | Đặc tả Sequence Diagram Checkout & Payment; source PlantUML và bản xuất theo overview/phase | [`diagrams/sequence_diagram/A2_T2.2_Sequence_Diagram_Checkout.md`](diagrams/sequence_diagram/A2_T2.2_Sequence_Diagram_Checkout.md) |
| Domain / deployment diagrams | Source Draw.io, bản xuất SVG/PDF và tài liệu hướng dẫn liên quan | [`diagrams/brewlite-domain-class.drawio`](diagrams/brewlite-domain-class.drawio), [`diagrams/brewlite-deployment.drawio`](diagrams/brewlite-deployment.drawio), [`diagrams/README.md`](diagrams/README.md) |
| Architecture | Tổng quan kiến trúc và ADR 001–005 | [`architecture/architecture.md`](architecture/architecture.md), [`architecture/adr/`](architecture/adr/) |
| Deployment | Mô tả triển khai Vercel/Render của [SCRUM-108](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-108) | [`deployment.md`](deployment.md) |
| CI | Hướng dẫn và thông tin quality gates | [`ci/README.md`](ci/README.md) |
| Report sources | Entrypoint tổng hợp nháp, section fragments, asset PDF và domain fixture | [`report/main.tex`](report/main.tex), [`report/README.md`](report/README.md), [`report/sections/`](report/sections/), [`report/assets/`](report/assets/), [`report/domain-class-check.tex`](report/domain-class-check.tex) |
| Delivery / release | Readiness, mapping release/deploy/run/smoke, demo/Scrum agenda và checklist tạm | [`delivery/SCRUM-117-delivery.md`](delivery/SCRUM-117-delivery.md), [`delivery/release-notes-A2.md`](delivery/release-notes-A2.md) |
| MVP evidence | Báo cáo local Sprint 1 kế thừa, không production smoke | [`A2_TestReport/MVP_Sprint1_Verification_Report.md`](A2_TestReport/MVP_Sprint1_Verification_Report.md) |
| A1 archive | Snapshot tài liệu kế thừa từ Assignment 1; xem provenance để biết nguồn gốc | [`a1-archive/PROVENANCE.md`](a1-archive/PROVENANCE.md) |
| Traceability | Ma trận Planning/Task 1–4 và snapshot delivery Task 5.4, Jira, PR, commit, nguồn và evidence | [`TRACEABILITY.md`](TRACEABILITY.md) |
| Requirement traceability | 48 FR + 49 NFR từ SRS → US/UC → design → code/API → test inventory, theo đề §8.1 | [`traceability-matrix.md`](traceability-matrix.md) |

## 2. Vị trí artifact sau [SCRUM-110](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-110)

Các đường dẫn dưới đây phản ánh tree được kiểm tra trên `origin/dev` tại baseline ghi trong [`TRACEABILITY.md`](TRACEABILITY.md):

- Deployment document của [SCRUM-108](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-108) hiện ở **`docs/deployment.md`**. Không dùng đường dẫn cũ `docs/architecture/deployment.md` trong tài liệu A2 hiện tại.
- ADR nằm tại `docs/architecture/adr/001-modular-monolith.md` đến `docs/architecture/adr/005-production-hosting.md`.
- Activity Diagram nằm dưới `docs/diagrams/activity_diagram/`; Sequence Diagram nằm dưới `docs/diagrams/sequence_diagram/`.
- Domain Class và Deployment Diagram nằm trực tiếp dưới `docs/diagrams/` với source `.drawio` và các bản xuất tương ứng.
- Tài liệu A1 được giữ dưới `docs/a1-archive/`; danh sách và provenance ở `docs/a1-archive/PROVENANCE.md`.

## 3. LaTeX: entrypoint và fragments

Tree được kiểm tra có các fragment sau:

- Report sections: `report/sections/context-and-scope.tex`, `requirements-summary.tex`, `checkout-use-case.tex`, `activity-diagram.tex`, `sequence-diagram.tex`.
- Report support: `report/domain-class-check.tex`.
- Diagram fragments: `diagrams/deployment-figure.tex` và `diagrams/domain-class-figure.tex`.

**SCRUM-117 đã bổ sung `report/main.tex` làm entrypoint nháp**, tái sử dụng các
fragments trên cùng `report/sections/deployment-release-delivery.tex`. Chạy build
từ repository root theo [`report/README.md`](report/README.md). Chưa compile PDF,
chưa visual QA và chưa đủ đầu vào để khẳng định báo cáo/bộ nộp hoàn chỉnh theo đề.
PDF domain fixture và assets hiện có không phải PDF report tổng hợp.

## 4. Quy tắc quản lý tài liệu

1. **Không chỉnh sửa archive như tài liệu A2 đang hoạt động.** `docs/a1-archive/` là snapshot kế thừa; giữ nguyên nội dung và provenance. Nếu A2 cần kế thừa quy tắc, hãy dẫn liên kết tới nguồn archive và ghi nội dung A2 ở đúng khu vực hiện hành.
2. **Không tạo bản sao tài liệu chỉ để đổi vị trí.** Một artifact có một vị trí chuẩn; các trang điều hướng và ma trận truy vết nên liên kết tới artifact đó.
3. **Sơ đồ mới hoặc được cập nhật phải giữ source có thể chỉnh sửa và bản xuất để review.** Với PlantUML dùng `.puml`; Draw.io dùng `.drawio`; sơ đồ dạng Graphviz dùng `.dot`. Lưu bản xuất SVG và/hoặc PDF tương ứng theo quy ước của nhóm. Không suy ra một source file tồn tại chỉ từ việc có SVG/PDF.
4. **Tách source, bản xuất và bằng chứng kiểm thử.** SVG/PDF là bản trình bày; file `.puml`/`.drawio`/`.dot` là source; log hoặc verification report là bằng chứng cho một lần kiểm tra cụ thể. Không dùng một loại thay thế cho loại khác.
5. **Giữ traceability khi di chuyển hoặc đổi tên.** Cập nhật link tại tài liệu tham chiếu và `TRACEABILITY.md` trong cùng thay đổi; không giữ đường dẫn cũ như thể nó vẫn tồn tại.
6. **Không nâng trạng thái quá bằng chứng.** `Merged` chỉ xác nhận PR đã được merge; `Reviewed` không tự có nghĩa `Approved`; `Verified` phải gắn với phạm vi kiểm chứng và evidence cụ thể. Quy ước trạng thái đầy đủ nằm trong [`TRACEABILITY.md`](TRACEABILITY.md).

## 5. Kiểm tra trước khi tạo Pull Request

Chạy từ Git Bash tại repository root:

```bash
# Xác nhận các artifact docs hiện có trên nhánh nền
git ls-tree -r --name-only origin/dev docs

# Kiểm tra whitespace/conflict marker trong thay đổi tài liệu
git diff --check

# Kiểm tra phạm vi thay đổi
git diff --stat
git status --short
```

Khi PR có thay đổi đường dẫn, đối chiếu link tương đối với file thực tế trong Git tree. Có thể dùng công cụ Markdown link checker đã được nhóm chấp thuận nếu đã được cấu hình; không giả định một checker chưa có trong repository. Trước khi commit, bảo đảm không stage file môi trường, secret, log chứa thông tin nhạy cảm hoặc file review tạm.

## Cập nhật evidence và PDF ngày14/11/2026

**Cập nhật tiếp 14/11/2026:** HEAD91e6f99/dev0e43bcb giữ nguyên, 10 docs unstaged đầu vào được bảo toàn. Backend https://brewlite-a2-api-hntn.onrender.com/ có ảnh Render Auto-Deploy Live02452f2 (fullSHA02452f228712c3501c8d27f0f1ae737ad206785d), deployed field13/11/2026 08:39:19Z. GET mới / và /products200 lúc16:24:59Z ngày13/11, catalog9 items; GET không xuất processSHA. DB Free18/Singapore/1GB/Available, expiry10/12/2026; external3 /32 restricted, chưa private-only. Bỏ Edge/Computer Use theo yêu cầu; Người dùng đính chính ngày 14/11/2026: Leader chưa kiểm tra/nghiệm thu SCRUM-117. Evidence và các giới hạn tại dossier §14.

[PDF báo cáo](report/output/main.pdf), [build/QA](report/README.md#kết-quả-build-và-qa-ngày-14112026), [dossier §14](delivery/SCRUM-117-delivery.md#14-evidence-render-backup-và-pdf--cập-nhật-14112026). AC2 VERIFIED snapshot HTTP/liveness/catalog; AC3 PARTIAL vì external còn3 /32 và Internal app usage chưa xác nhận. Requirement mapping không tự nâng thành acceptance; payment-status/QueryDR và manual reconciliation giữ mở.
