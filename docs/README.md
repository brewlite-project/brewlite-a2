# BrewLite A2 Documentation Center

Trung tâm điều hướng tài liệu và tạo phẩm của đồ án **BrewLite Assignment 2**. Các đường dẫn trong file này được viết tương đối từ thư mục `docs/`.

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
| Report sources | Các fragment LaTeX theo section, asset PDF và file kiểm tra domain class | [`report/sections/`](report/sections/), [`report/assets/`](report/assets/), [`report/domain-class-check.tex`](report/domain-class-check.tex) |
| A1 archive | Snapshot tài liệu kế thừa từ Assignment 1; xem provenance để biết nguồn gốc | [`a1-archive/PROVENANCE.md`](a1-archive/PROVENANCE.md) |
| Traceability | Ma trận nối Planning, Task 1–4.1, Jira, PR, commit và nguồn nghiệp vụ | [`TRACEABILITY.md`](TRACEABILITY.md) |

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

**Không có `docs/report/main.tex` trong tree được kiểm tra.** Vì vậy, không mô tả `main.tex` là entrypoint hiện hữu và không tự suy ra một file build entrypoint khác. Khi bổ sung entrypoint LaTeX, cần thêm file nguồn cùng lệnh build/hướng dẫn tương ứng rồi cập nhật mục này.

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
