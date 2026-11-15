# Tài liệu đồ án BrewLite

Trung tâm tra cứu hệ thống BrewLite: yêu cầu, mô hình, hiện thực, kiểm thử, vận hành và báo cáo.

- [Báo cáo PDF](report/output/main.pdf), [nguồn LaTeX](report/main.tex), [build và QA](report/README.md#bản-pdf-hiện-hành).
- [Phân công104 issue](planning/BrewLite_Task_Allocation.md): 102 Task,1 Epic,1 Subtask; phụ lục PDF trình bày theo thành viên và nhóm công việc.
- [Use Case tổng quát](report/assets/use-case-overview.pdf), [ERD hiện hành](report/assets/database-erd.pdf), [source và exports](diagrams/README.md).
- [Runbook vận hành](deployment.md), [hồ sơ kiểm chứng kỹ thuật](delivery/SCRUM-117-delivery.md), [release notes](delivery/release-notes-A2.md).

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
| Report sources | Báo cáo, section fragments và assets | [`report/main.tex`](report/main.tex), [`report/README.md`](report/README.md), [`report/sections/`](report/sections/), [`report/assets/`](report/assets/), [`report/domain-class-check.tex`](report/domain-class-check.tex) |
| Delivery / release | Readiness, mapping release/deploy/run/smoke, demo/Scrum agenda và checklist kỹ thuật | [`delivery/SCRUM-117-delivery.md`](delivery/SCRUM-117-delivery.md), [`delivery/release-notes-A2.md`](delivery/release-notes-A2.md) |
| MVP evidence | Báo cáo local Sprint 1 kế thừa, không production smoke | [`A2_TestReport/MVP_Sprint1_Verification_Report.md`](A2_TestReport/MVP_Sprint1_Verification_Report.md) |
| A1 archive | Snapshot tài liệu kế thừa từ Assignment 1; xem provenance để biết nguồn gốc | [`a1-archive/PROVENANCE.md`](a1-archive/PROVENANCE.md) |
| Traceability | Ma trận Planning/Task 1–4 và snapshot delivery Task 5.4, Jira, PR, commit, nguồn và evidence | [`TRACEABILITY.md`](TRACEABILITY.md) |
| Requirement traceability | 48 FR + 49 NFR từ SRS → US/UC → design → code/API → test inventory, theo đề §8.1 | [`traceability-matrix.md`](traceability-matrix.md) |


## Báo cáo và bộ nguồn

Báo cáo trình bày bài toán → yêu cầu → mô hình hóa → kiến trúc/database/API → hiện thực → kiểm thử → vận hành → quản lý dự án → kết luận. Phụ lục giữ nguồn/truy vết và bảng104 issue. Logo SGU, hình vector và ảnh giao diện local có nguồn nằm trong repository; build từ root bằng pdfLaTeX + VnTeX.

Nhật ký Git/CI, checksum lịch sử, tám AC SCRUM-117 và quyết định vận hành được giữ trong dossier. Hình thức trình nộp của PDF không thay trạng thái nghiệm thu. Bảng traceability phục vụ đối chiếu yêu cầu và tạo phẩm, không tự khẳng định tất cả test hoặc luồng nghiệp vụ đều đạt.

## Nguồn kế thừa

Repository này tiếp nối đồ án BrewLite; [archive bất biến và provenance](a1-archive/PROVENANCE.md) giữ nguồn A1 tại tag A1-final. Tài liệu hiện hành dùng apps/web, apps/api và các đường dẫn docs ở repository này; không cần checkout A1 để build báo cáo.
