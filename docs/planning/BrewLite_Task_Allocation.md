# Phân công nhiệm vụ toàn đồ án BrewLite

Nguồn phân công: Jira (1).csv do người dùng cung cấp, đọc ngày 14/11/2026; 104 issue, 52 cột, xử lý quoted multiline và hai header trùng Custom field (Vulnerability) theo vị trí. SHA256 CSV: `CBA2BA48D03B2EB1743F99F32A6EFCB72DBF0C4DD308ECFA771516DB41A99261`. Không lưu raw export hoặc metadata tài khoản vào repository.

Mapping assignee ↔ họ tên dựa trên các mã task trùng với §6.1.2 của [báo cáo A1](https://docs.google.com/document/d/1A43E5hJ4HEl6do7-Z0BYhmbKJVVgQsMdBOhCl7INyoY/edit), không suy từ username, tác giả hay người merge PR. Các mã đối chiếu đại diện: Khang SCRUM-9/18; Khánh SCRUM-14/26; Hoàng SCRUM-10/23; Thụy SCRUM-11/15; Lập SCRUM-12/16; CKhang SCRUM-13/25. Đủ sáu mapping, không có xung đột theo các task trùng. Roster/MSSV ở [report README](../report/README.md#bản-pdf-hiện-hành).

## Provenance giai đoạn gốc và kiểm đủ

A1 là các task Sprint0–3; Phase2 là Sprint4/Phase 2 theo export; A2 lấy nhãn [A2] trong Summary hoặc Sprint A2. SCRUM-95 thuộc A2 dù Sprint/Parent trống. SCRUM-98 là Epic A2, tách khỏi Task. SCRUM-4 là Subtask chưa có assignee, giữ riêng. Không dùng Jira Done làm kết quả test hoặc nghiệm thu, không suy tỷ lệ đóng góp từ số task.

| Thành viên | A1 Task | Phase2 Task | A2 Task | Tổng Task |
|---|---:|---:|---:|---:|
| Nguyễn Châu Hoàng Khang | 13 | 5 | 8 | 26 |
| Cao Nguyễn Quốc Khánh | 8 | 4 | 2 | 14 |
| Nguyễn Khải Hoàng | 9 | 5 | 3 | 17 |
| Nguyễn Đăng Thụy | 13 | 3 | 2 | 18 |
| Hoàng Văn Lập | 11 | 2 | 3 | 16 |
| Lâm Chí Khang | 6 | 3 | 2 | 11 |
| Tổng | 60 | 22 | 20 | 102 |

Ngoài 102 Task: 1 Epic (SCRUM-98, Nguyễn Châu Hoàng Khang) và 1 Subtask (SCRUM-4, chưa phân công). Tổng **104 issue duy nhất**. Bảng A1 Google Docs có 65 Task lịch sử; export hiện tại chỉ chứa 60 trong số đó. Các mã A1 không có trong export là SCRUM-62, SCRUM-66, SCRUM-70, SCRUM-72, SCRUM-73. Giữ sự khác biệt nguồn, không tự thêm các mã này vào bảng 104 issue.

“Tạo phẩm theo nhiệm vụ” là đầu ra được giao theo Summary/Description, không khẳng định đã hoàn thành. “Tìm thấy” chỉ xác định đường dẫn tạo phẩm có thực; kết quả chạy và nghiệm thu phải xem evidence theo SHA/môi trường riêng. Các đường dẫn archive là snapshot A1-final/1951dc1 chỉ đọc; không đồng nhất đường dẫn backend/frontend lịch sử với apps/api/apps/web hiện tại.

## Quy tắc trình bày theo nhóm công việc

Nhóm công việc là phân loại phục vụ trình bày báo cáo, dựa trên nội dung Summary/Description; không đổi assignee, task, Sprint hoặc trạng thái Jira. Mỗi issue có một nhóm chính để không đếm trùng; task liên ngành vẫn giữ nguyên ý nghĩa nhiệm vụ. Tên nhiệm vụ nguyên bản và Sprint/giai đoạn gốc được giữ ở bảng dưới. PDF dùng năm cột theo nhóm công việc, có thể rút tiền tố A2/P2 cho gọn; mã SCRUM không đổi. Epic và Subtask chưa phân công ghi riêng.

## Nguyễn Châu Hoàng Khang

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Nguyễn Châu Hoàng Khang | Yêu cầu | A2 | A2 — Preparation (Task 1–3) | SCRUM-101 | [A2-REVIEW-T1] Review & Finalize Requirements | Theo nhiệm vụ: Nội dung review/đối chiếu Task 1 Requirements; không tự coi là approval. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A1 | SCRUM Sprint 1 | SCRUM-35 | API Contract + Review | Theo nhiệm vụ: API Contract và nội dung review. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A1 | SCRUM Sprint 2 | SCRUM-45 | Sprint 2 API Contract + Review + Integration Coordination | Theo nhiệm vụ: API Contract Sprint 2 và điều phối tích hợp. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A1 | SCRUM Sprint 2 | SCRUM-48 | Update_API_Contract | Theo nhiệm vụ: API Contract cập nhật. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A1 | SCRUM Sprint 3 | SCRUM-61 | Update API Contract v3.0 | Theo nhiệm vụ: API Contract v3.0. Tìm thấy: docs/a1-archive/api/BrewLite_API_Contract_v3.0.md. |
| Nguyễn Châu Hoàng Khang | Thiết kế | Phase2 | Phase 2 (Sprint 4) | SCRUM-75 | P2-01 – Finalize VNPay Payment Architecture & API Contract v4.0 | Theo nhiệm vụ: Kiến trúc VNPay và API Contract v4.0. Tìm thấy: docs/a1-archive/api/BrewLite_API_Contract_v4.0.md. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-106 | [A2-REVIEW-T2] Review & Finalize Task 2 Modeling | Theo nhiệm vụ: Nội dung review Task 2 Modeling; không tự coi là approval. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-107 | [A2-T3.1] Architecture Design & Architecture Decision Records | Theo nhiệm vụ: Architecture Document và ADR. Tìm thấy: docs/architecture/architecture.md. |
| Nguyễn Châu Hoàng Khang | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-109 | REVIEW-T3 — Review & nghiệm thu Architecture | Theo nhiệm vụ: Nội dung review Task 3 Architecture; không tự coi là approval. |
| Nguyễn Châu Hoàng Khang | Backend | A1 | SCRUM Sprint 2 | SCRUM-50 | Product_catalog_backend_upgrade | Theo nhiệm vụ: Catalog backend nâng cấp. |
| Nguyễn Châu Hoàng Khang | Backend | A1 | SCRUM Sprint 3 | SCRUM-60 | Implement GET /orders/me | Theo nhiệm vụ: GET /orders/me. |
| Nguyễn Châu Hoàng Khang | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-77 | P2-03 – Implement VNPay Gateway & Payment Initiation | Theo nhiệm vụ: VNPay gateway và khởi tạo thanh toán. |
| Nguyễn Châu Hoàng Khang | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-81 | P2-07 – Implement VNPay IPN Endpoint & QueryDR Client | Theo nhiệm vụ: IPN endpoint và QueryDR client. |
| Nguyễn Châu Hoàng Khang | Database | A1 | SCRUM Sprint 2 | SCRUM-49 | Schema_Database_Upgrate | Theo nhiệm vụ: Schema và database nâng cấp. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | A1 | SCRUM Sprint 1 | SCRUM-33 | FE-BE integration test | Theo nhiệm vụ: Kịch bản và kết quả integration FE–BE. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | A1 | SCRUM Sprint 1 | SCRUM-34 | Bug fixing + regression | Theo nhiệm vụ: Bản sửa lỗi và regression sau tích hợp. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | A1 | SCRUM Sprint 2 | SCRUM-46 | Sprint 2 integration test + fix | Theo nhiệm vụ: Integration test và sửa lỗi Sprint 2. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | A1 | SCRUM Sprint 3 | SCRUM-63 | Assignment 1 full E2E + release review | Theo nhiệm vụ: Full E2E và release review A1. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | Phase2 | Phase 2 (Sprint 4) | SCRUM-93 | P2-19 – Execute VNPay Sandbox E2E & Regression Test Suite | Theo nhiệm vụ: Kết quả Sandbox E2E và regression suite theo phạm vi chạy. Tìm thấy: docs/a1-archive/verification/SCRUM94_Verification_Evidence.md. |
| Nguyễn Châu Hoàng Khang | Kiểm thử | A2 | Không có trong export | SCRUM-95 | [A2] Investigate & Validate VNPay QueryDR Sandbox E2E | Theo nhiệm vụ: Điều tra và evidence QueryDR Sandbox E2E; không suy PASS từ tên task. |
| Nguyễn Châu Hoàng Khang | Triển khai | Phase2 | Phase 2 (Sprint 4) | SCRUM-91 | P2-17 – Implement Docker Compose & Full System Packaging | Theo nhiệm vụ: Docker Compose và đóng gói toàn hệ thống. Tìm thấy: docs/a1-archive/Docker_Compose.md. |
| Nguyễn Châu Hoàng Khang | Triển khai | A2 | A2 — Sprint 1 (Task 4) | SCRUM-110 | [A2-T4.1] Thiết lập Repository & chuẩn hóa Monorepo | Theo nhiệm vụ: Monorepo apps/web và apps/api, path/Compose tương ứng. Tìm thấy: docker-compose.yml. |
| Nguyễn Châu Hoàng Khang | Triển khai | A2 | A2 — Sprint 1 (Task 4) | SCRUM-113 | [A2-T4.4] Continuous Integration - Thiết lập GitHub Actions CI & Quality Gates | Theo nhiệm vụ: GitHub Actions CI và tài liệu quality gates. Tìm thấy: docs/ci/README.md. |
| Nguyễn Châu Hoàng Khang | Triển khai | A2 | A2 — Sprint 2 (Task 5) | SCRUM-116 | [A2-T5.3] Thiết lập CD Pipeline — Build, Deploy & Smoke Test | Theo nhiệm vụ: CD/deployment, migration và smoke evidence theo phạm vi thực có. Tìm thấy: apps/api/README.md. |
| Nguyễn Châu Hoàng Khang | Tài liệu | A1 | SCRUM Sprint 1 | SCRUM-18 | Setup Swagger / OpenAPI Documentation | Theo nhiệm vụ: Swagger/OpenAPI cho API backend. |
| Nguyễn Châu Hoàng Khang | Quản lý dự án | A1 | SCRUM Sprint 0 | SCRUM-9 | Project Charter & README.md & Techstack | Theo nhiệm vụ: Project Charter, README và Tech Stack. Tìm thấy: docs/a1-archive/BrewLite_Project_Charter.docx. |

## Cao Nguyễn Quốc Khánh

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Cao Nguyễn Quốc Khánh | Thiết kế | A1 | SCRUM Sprint 0 | SCRUM-14 | Figma bố cục/Wireframe cơ bản | Theo nhiệm vụ: Figma/wireframe bố cục cơ bản. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 1 | SCRUM-26 | Product Card + Menu UI | Theo nhiệm vụ: Product Card và Menu UI. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 1 | SCRUM-27 | Menu loading/empty/error | Theo nhiệm vụ: Trạng thái loading, empty và error của menu. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 1 | SCRUM-28 | Integrate Menu with API | Theo nhiệm vụ: Menu kết nối API catalog. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 2 | SCRUM-40 | Implement Cart State & UI | Theo nhiệm vụ: Cart state và giao diện giỏ hàng. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 2 | SCRUM-44 | Integrate Cart with Order flow | Theo nhiệm vụ: Kết nối Cart với tạo Order. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 3 | SCRUM-64 | Build Order History UI | Theo nhiệm vụ: Order History UI. |
| Cao Nguyễn Quốc Khánh | Frontend | A1 | SCRUM Sprint 3 | SCRUM-65 | Integrate Order History with GET /orders/me | Theo nhiệm vụ: History kết nối GET /orders/me. |
| Cao Nguyễn Quốc Khánh | Frontend | Phase2 | Phase 2 (Sprint 4) | SCRUM-86 | P2-12 – Implement VNPay Payment Frontend Flow | Theo nhiệm vụ: Luồng frontend VNPay initiation/redirect/return. |
| Cao Nguyễn Quốc Khánh | Frontend | Phase2 | Phase 2 (Sprint 4) | SCRUM-97 | P2-22 – Implement Coupon Application Frontend Flow | Theo nhiệm vụ: Luồng nhập/áp dụng coupon frontend. |
| Cao Nguyễn Quốc Khánh | Frontend | A2 | A2 — Sprint 2 (Task 5) | SCRUM-114 | [A2-T5.1] Hoàn thiện MVP — Checkout, Payment, History & PWA | Theo nhiệm vụ: MVP Checkout/Payment/History/PWA theo scope task; PWA chưa có evidence nghiệm thu. |
| Cao Nguyễn Quốc Khánh | Kiểm thử | Phase2 | Phase 2 (Sprint 4) | SCRUM-87 | P2-13 – Write VNPay Frontend Payment Flow Tests | Theo nhiệm vụ: Tests luồng thanh toán VNPay frontend. |
| Cao Nguyễn Quốc Khánh | Kiểm thử | A2 | A2 — Sprint 1 (Task 4) | SCRUM-112 | [A2-T4.3] Kiểm chứng MVP Sprint 1 — Menu & Mobile-first UI | Theo nhiệm vụ: MVP Sprint 1 verification report và UI evidence. Tìm thấy: docs/A2_TestReport/MVP_Sprint1_Verification_Report.md. |
| Cao Nguyễn Quốc Khánh | Triển khai | Phase2 | Phase 2 (Sprint 4) | SCRUM-90 | P2-16 – Dockerize Next.js Frontend | Theo nhiệm vụ: Dockerfile và hướng dẫn build/run frontend. |

## Nguyễn Khải Hoàng

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Nguyễn Khải Hoàng | Yêu cầu | A1 | SCRUM Sprint 0 | SCRUM-10 | Requirements Specification | Theo nhiệm vụ: Requirements Specification. Tìm thấy: docs/a1-archive/BrewLite_Requirements_Specification.docx. |
| Nguyễn Khải Hoàng | Yêu cầu | A2 | A2 — Preparation (Task 1–3) | SCRUM-99 | [A2-T1.1] Bối cảnh, Stakeholders và Phạm vi | Theo nhiệm vụ: Context, stakeholders và phạm vi A2. Tìm thấy: docs/requirements/context-and-scope.md. |
| Nguyễn Khải Hoàng | Yêu cầu | A2 | A2 — Preparation (Task 1–3) | SCRUM-102 | [A2-T1.2] Chuẩn hóa FR/NFR, MoSCoW & Acceptance Criteria | Theo nhiệm vụ: FR/NFR, MoSCoW và Acceptance Criteria A2. Tìm thấy: docs/requirements/srs.md. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 1 | SCRUM-23 | Create Products module | Theo nhiệm vụ: Products module. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 1 | SCRUM-24 | Implement GET /products | Theo nhiệm vụ: API GET /products. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 2 | SCRUM-38 | Implement Register API | Theo nhiệm vụ: Register API, validation và hash mật khẩu. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 2 | SCRUM-39 | Implement Login + JWT + Guard | Theo nhiệm vụ: Login, JWT và Guard. Tìm thấy: docs/a1-archive/api/SCRUM39_Handoff.md. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 3 | SCRUM-54 | Implement POST /payments Mock Payment | Theo nhiệm vụ: POST /payments theo Mock provider. Tìm thấy: docs/a1-archive/api/SCRUM54_Payment_Implementation.md. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 3 | SCRUM-55 | Implement Payment Idempotency | Theo nhiệm vụ: Payment idempotency. Tìm thấy: docs/a1-archive/api/SCRUM55_Payment_Idempotency.md. |
| Nguyễn Khải Hoàng | Backend | A1 | SCRUM Sprint 3 | SCRUM-56 | Implement Promotion & Loyalty service logic | Theo nhiệm vụ: Nghiệp vụ Promotion và Loyalty. |
| Nguyễn Khải Hoàng | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-78 | P2-04 – Implement Shared Payment Finalization Service | Theo nhiệm vụ: Shared payment finalization cho VNPay/Mock/ZERO_AMOUNT. Tìm thấy: docs/a1-archive/design/payment/Shared_Payment_Finalization_Handoff_SCRUM-78.md. |
| Nguyễn Khải Hoàng | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-96 | P2-21 – Implement Coupon Application & Redemption Backend | Theo nhiệm vụ: Coupon validation, discount và redemption backend. Tìm thấy: docs/a1-archive/api/SCRUM96_Coupon_Preview_Addendum.md. |
| Nguyễn Khải Hoàng | Kiểm thử | Phase2 | Phase 2 (Sprint 4) | SCRUM-79 | P2-05 – Write Payment Finalization Concurrency Tests | Theo nhiệm vụ: PostgreSQL concurrency tests cho finalization. Tìm thấy: docs/a1-archive/design/payment/Payment_Finalization_Concurrency_Test_Handoff_SCRUM-79.md. |
| Nguyễn Khải Hoàng | Triển khai | Phase2 | Phase 2 (Sprint 4) | SCRUM-89 | P2-15 – Dockerize NestJS Backend with Prisma | Theo nhiệm vụ: Dockerfile và hướng dẫn build/run backend. |
| Nguyễn Khải Hoàng | Tài liệu | A1 | SCRUM Sprint 3 | SCRUM-74 | Viết báo cáo A1 | Theo nhiệm vụ: Báo cáo Assignment 1. |
| Nguyễn Khải Hoàng | Tài liệu | Phase2 | Phase 2 (Sprint 4) | SCRUM-94 | P2-20 – Update README & Phase 2 Project Report | Theo nhiệm vụ: README và báo cáo Phase2. Tìm thấy: docs/a1-archive/BrewLite_Phase2_Project_Report_Draft.md. |
| Nguyễn Khải Hoàng | Tài liệu | A2 | A2 — Sprint 2 (Task 5) | SCRUM-117 | [A2-T5.4] Production Release, Documentation & Delivery | Theo nhiệm vụ: README, runbook, release notes, report PDF và delivery dossier. Tìm thấy: docs/delivery/SCRUM-117-delivery.md. |

## Nguyễn Đăng Thụy

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Nguyễn Đăng Thụy | Yêu cầu | A1 | SCRUM Sprint 0 | SCRUM-11 | User Stories + Acceptance Criteria | Theo nhiệm vụ: User Stories và Acceptance Criteria. Tìm thấy: docs/a1-archive/BrewLite_User_Stories_Acceptance_Criteria.docx. |
| Nguyễn Đăng Thụy | Yêu cầu | A1 | SCRUM Sprint 0 | SCRUM-15 | Use Case Specification | Theo nhiệm vụ: Use Case Specification. Tìm thấy: docs/a1-archive/BrewLite_Use_Case_Specification.docx. |
| Nguyễn Đăng Thụy | Yêu cầu | A2 | A2 — Preparation (Task 1–3) | SCRUM-100 | [A2-T1.3] Đặc tả Use Case trọng tâm — Checkout | Theo nhiệm vụ: Checkout Use Case Specification. Tìm thấy: docs/requirements/A2_T1.3_Checkout_Use_Case_Specification.md. |
| Nguyễn Đăng Thụy | Backend | A1 | SCRUM Sprint 3 | SCRUM-71 | [BE] Implement GET /auth/me – Customer Profile & Loyalty Points | Theo nhiệm vụ: GET /auth/me, profile và loyalty points. |
| Nguyễn Đăng Thụy | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-82 | P2-08 – Implement Payment Reconciliation Scheduler | Theo nhiệm vụ: Scheduler đối soát Payment PENDING. Tìm thấy: docs/a1-archive/verification/SCRUM82_Payment_Reconciliation_Scheduler.md. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 1 | SCRUM-19 | Finalize Product data model | Theo nhiệm vụ: Mô hình dữ liệu Product, Size và Topping. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 1 | SCRUM-20 | Setup Prisma + PostgreSQL | Theo nhiệm vụ: Prisma/PostgreSQL và cấu hình kết nối local. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 1 | SCRUM-21 | Create Product database migration | Theo nhiệm vụ: Migration bảng Product và quan hệ catalog. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 1 | SCRUM-22 | Seed Product data | Theo nhiệm vụ: Seed dữ liệu catalog. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 2 | SCRUM-36 | Extend Prisma schema for User, Order, OrderItem | Theo nhiệm vụ: Prisma models User, Order, OrderItem. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 2 | SCRUM-37 | Create User/Order migration | Theo nhiệm vụ: Migration User/Order. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 3 | SCRUM-51 | Extend Prisma schema for Payment | Theo nhiệm vụ: Prisma Payment model. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 3 | SCRUM-52 | Create Payment database migration | Theo nhiệm vụ: Migration Payment. |
| Nguyễn Đăng Thụy | Database | A1 | SCRUM Sprint 3 | SCRUM-53 | Prepare Promotion & Loyalty persistence | Theo nhiệm vụ: Persistence Promotion và Loyalty. |
| Nguyễn Đăng Thụy | Database | Phase2 | Phase 2 (Sprint 4) | SCRUM-76 | P2-02 – Extend Payment Prisma Schema & Create Migration | Theo nhiệm vụ: Payment schema và migration Phase2. |
| Nguyễn Đăng Thụy | Kiểm thử | Phase2 | Phase 2 (Sprint 4) | SCRUM-80 | P2-06 – Verify Payment Migration & Database Constraints | Theo nhiệm vụ: Kết quả kiểm tra migration và DB constraints. Tìm thấy: docs/a1-archive/verification/SCRUM80_Payment_Migration_Verification.md. |
| Nguyễn Đăng Thụy | Tài liệu | A1 | SCRUM Sprint 2 | SCRUM-47 | Setup and migrate Assignment 1 documentation to LaTeX | Theo nhiệm vụ: Bộ nguồn báo cáo A1 bằng LaTeX. |
| Nguyễn Đăng Thụy | Tài liệu | A2 | A2 — Sprint 1 (Task 4) | SCRUM-111 | [A2-T4.2]— Quản lý tài liệu- Chuẩn hóa Repository Documentation & Traceability | Theo nhiệm vụ: Documentation index và traceability Task 1–3. Tìm thấy: docs/TRACEABILITY.md. |

## Hoàng Văn Lập

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Hoàng Văn Lập | Thiết kế | A1 | SCRUM Sprint 0 | SCRUM-12 | UseCase diagram, Activity diagram | Theo nhiệm vụ: Use Case Diagram và Activity Diagram. Tìm thấy: docs/a1-archive/diagram/UseCase_Diagram.drawio.svg. |
| Hoàng Văn Lập | Thiết kế | A1 | SCRUM Sprint 0 | SCRUM-16 | Sequence diagram | Theo nhiệm vụ: Sequence Diagram. Tìm thấy: docs/a1-archive/diagram/Sequence/Sequence_Brewlite-Page-1.drawio.svg. |
| Hoàng Văn Lập | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-103 | [A2-T2.1] Chuẩn hóa Activity Diagram — Checkout | Theo nhiệm vụ: Activity Diagram Checkout. |
| Hoàng Văn Lập | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-104 | [A2-T2.2] Chuẩn hóa Sequence Diagram — Checkout & Payment | Theo nhiệm vụ: Sequence Diagram Checkout/Payment. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 1 | SCRUM-29 | Product Detail UI | Theo nhiệm vụ: Giao diện chi tiết sản phẩm. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 1 | SCRUM-30 | Size/Topping selectors | Theo nhiệm vụ: Bộ chọn size và topping. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 1 | SCRUM-31 | Price calculation | Theo nhiệm vụ: Tính giá preview trên giao diện. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 1 | SCRUM-32 | Integrate Detail with API | Theo nhiệm vụ: Chi tiết sản phẩm kết nối API. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 2 | SCRUM-41 | Build Login/Register UI | Theo nhiệm vụ: Giao diện đăng nhập/đăng ký. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 2 | SCRUM-43 | Checkout Flow | Theo nhiệm vụ: Luồng Checkout. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 3 | SCRUM-67 | Build Payment UI | Theo nhiệm vụ: Payment UI. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 3 | SCRUM-68 | Build Order Confirmation UI | Theo nhiệm vụ: Order Confirmation UI. |
| Hoàng Văn Lập | Frontend | A1 | SCRUM Sprint 3 | SCRUM-69 | Integrate Payment + Confirmation flow | Theo nhiệm vụ: Tích hợp Payment và Confirmation. |
| Hoàng Văn Lập | Frontend | Phase2 | Phase 2 (Sprint 4) | SCRUM-88 | P2-14 – Complete Payment Confirmation & Order History Integration | Theo nhiệm vụ: Tích hợp confirmation với order history. |
| Hoàng Văn Lập | Kiểm thử | Phase2 | Phase 2 (Sprint 4) | SCRUM-92 | P2-18 – Verify Docker Clean Setup & Integration | Theo nhiệm vụ: Clean setup và integration verifier Docker. Tìm thấy: docs/a1-archive/verification/SCRUM92_Docker_Clean_Setup_Verification.md. |
| Hoàng Văn Lập | Kiểm thử | A2 | A2 — Sprint 2 (Task 5) | SCRUM-115 | [A2-T5.2] Integration, E2E Tests & Database Verification | Theo nhiệm vụ: Integration/E2E và database verification evidence theo commit/môi trường. |

## Lâm Chí Khang

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Lâm Chí Khang | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-105 | [A2-T2.3] Thiết kế Domain Class Diagram — BrewLite | Theo nhiệm vụ: Domain Class Diagram. |
| Lâm Chí Khang | Thiết kế | A2 | A2 — Preparation (Task 1–3) | SCRUM-108 | [A2-T3.2] Thiết kế Deployment Diagram — Vercel & Render | Theo nhiệm vụ: Deployment Diagram Vercel/Render. |
| Lâm Chí Khang | Backend | A1 | SCRUM Sprint 1 | SCRUM-25 | Implement GET /products/:id | Theo nhiệm vụ: API GET /products/:id. |
| Lâm Chí Khang | Backend | A1 | SCRUM Sprint 2 | SCRUM-42 | Implement POST /orders | Theo nhiệm vụ: POST /orders và tính tiền phía server. |
| Lâm Chí Khang | Backend | A1 | SCRUM Sprint 3 | SCRUM-57 | Implement Order State Machine | Theo nhiệm vụ: Order state machine. Tìm thấy: docs/a1-archive/api/SCRUM57_Order_State_Machine.md. |
| Lâm Chí Khang | Backend | A1 | SCRUM Sprint 3 | SCRUM-58 | Implement Inventory Concurrency Control | Theo nhiệm vụ: Inventory concurrency control. Tìm thấy: docs/a1-archive/api/SCRUM58_Inventory_Concurrency.md. |
| Lâm Chí Khang | Backend | A1 | SCRUM Sprint 3 | SCRUM-59 | Integrate Order ↔ Payment lifecycle | Theo nhiệm vụ: Kết nối vòng đời Order–Payment. Tìm thấy: docs/a1-archive/api/SCRUM59_Order_Payment_Lifecycle.md. |
| Lâm Chí Khang | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-83 | P2-09 – Implement 15-minute Order Expiration & 5-minute Grace Period | Theo nhiệm vụ: Order expiration 15 phút và grace 5 phút. |
| Lâm Chí Khang | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-84 | P2-10 – Implement ZERO_AMOUNT Payment | Theo nhiệm vụ: ZERO_AMOUNT payment. Tìm thấy: docs/a1-archive/api/SCRUM84_Zero_Amount_Payment.md. |
| Lâm Chí Khang | Backend | Phase2 | Phase 2 (Sprint 4) | SCRUM-85 | P2-11 – Implement Mock Payment Environment Access Policy | Theo nhiệm vụ: Mock payment environment access policy. Tìm thấy: docs/a1-archive/api/SCRUM85_Mock_Payment_Environment_Access_Policy.md. |
| Lâm Chí Khang | Database | A1 | SCRUM Sprint 0 | SCRUM-13 | ERD | Theo nhiệm vụ: ERD mô hình dữ liệu. Tìm thấy: docs/a1-archive/diagram/ERD/ERD.pdf. |

## Chưa phân công

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Chưa phân công | Chưa phân nhóm | A1 | Không có trong export | SCRUM-4 | Subtask 2.1 | Tên subtask trong export là Subtask 2.1; không có mô tả tạo phẩm. |

## Epic riêng

| Thành viên | Nhóm công việc | Giai đoạn gốc | Sprint gốc | Mã task | Nhiệm vụ nguyên bản | Tạo phẩm phụ trách |
|---|---|---|---|---|---|---|
| Nguyễn Châu Hoàng Khang | Quản lý dự án | A2 | Không có trong export | SCRUM-98 | BrewLite A2 — Requirements to Deployment | Theo nhiệm vụ: Epic tổ chức Requirements to Deployment, không tính như Task con. |


## Bố cục các issue đặc biệt trong PDF

SCRUM-4 (Subtask chưa phân công) và SCRUM-98 (Epic) được đặt chung một bảng cuối phụ lục để tránh trang gần trống. Hai dòng vẫn tách biệt, giữ tên/mã/người và không cộng vào102 Task. Không đổi104 issue hoặc mapping từ CSV; diagram/ảnh bổ sung cho report không tự thay người phụ trách các task lịch sử.


Bản trình nộp giữ nguyên104 issue và mapping nguồn; bỏ nhãn tác nghiệp ở phần dẫn báo cáo, không thay người được giao hoặc nội dung nhiệm vụ.
