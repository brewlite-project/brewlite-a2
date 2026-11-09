# BrewLite A2 — Repository Traceability Matrix

**Task:** SCRUM-111 / A2-T4.2 — Chuẩn hóa Repository Documentation & Traceability  
**Baseline:** `origin/dev` (`4b80987`)  
**Mục đích:** Cung cấp ma trận truy vết xuyên suốt từ Yêu cầu (Task 1), Mô hình hóa (Task 2), Kiến trúc (Task 3) đến Cấu trúc Monorepo và Triển khai (Task 4.1), gắn liền với Jira Issue, PR và Commit thực tế của nhóm.

---

## 1. Ma trận truy vết tạo phẩm (Requirements ➔ Modeling ➔ Architecture ➔ Code/Verification)

| Stage / Task | Jira Issue | Deliverable / Artifact Path | PR # | Merge Commit / SHA | Source / Reference Mapping | Verification / Status |
|---|---|---|---|---|---|---|
| **Planning** | `SCRUM-98` | `docs/planning/A2_Gap_Analysis.md`<br>`docs/planning/A2_Implementation_Plan.md`<br>`docs/planning/A2_Risk_Register.md` | PR #1 | `8b4224a` | Baseline `A1-final` (`1951dc1`) sang A2 | **Approved / Baseline** |
| **Task 1.1** | `SCRUM-99` | `docs/requirements/context-and-scope.md` | PR #2 | `b542ee4` | Requirements v3.1 §3–6, 9.9, 16 | **Reviewed / DRAFT** |
| **Task 1.2** | `SCRUM-102` | `docs/requirements/srs.md` | PR #7 | `a5d2b50` | SRS FR-01..48 / NFR-01..49, MoSCoW, AC-A2-001..097 | **Reviewed / DRAFT** |
| **Task 1.3** | `SCRUM-100` | `docs/requirements/A2_T1.3_Checkout_Use_Case_Specification.md`<br>`docs/requirements/diagrams/checkout-use-case.*` | PR #3 | `f5b67a5` | Use Case `UC-A2-CHECKOUT-001`, API v4.0 §14 | **Reviewed / DRAFT** |
| **Task 2.1** | `SCRUM-103` | `docs/diagrams/activity_diagram/A2_T2.1_Activity_Diagram_Checkout.md`<br>`docs/diagrams/activity_diagram/{overview,phase1,phase2,phase3}/` | PR #4 | `47f4926` | Activity Diagram (D1..D23, R-01..R-06) | **Reviewed / DRAFT** |
| **Task 2.2** | `SCRUM-104` | `docs/diagrams/sequence_diagram/A2_T2.2_Sequence_Diagram_Checkout.md`<br>`docs/diagrams/sequence_diagram/{overview,phase1,phase2,phase3}/` | PR #8 | `a00b376` | Sequence Diagram (`SD-01`..`SD-06`, SD-R01..R06) | **Reviewed / DRAFT** |
| **Task 2.3** | `SCRUM-105` | `docs/diagrams/brewlite-domain-class.*`<br>`docs/diagrams/brewlite-domain-types.svg`<br>`docs/diagrams/render_domain.py` | PR #5 | `03dfb47` | Prisma Schema, `cart-pricing.ts`, Orders/Payments | **Reviewed / DRAFT** |
| **Task 3.1** | `SCRUM-107` | `docs/architecture/architecture.md`<br>`docs/architecture/adr/001-005.md` | PR #9 | `2c43215` | NestJS Modular Monolith, PostgreSQL, ADRs | **Reviewed / Technical Approved** |
| **Task 3.2** | `SCRUM-108` | `docs/deployment.md`<br>`docs/diagrams/brewlite-deployment.*` | PR #6 | `4910733` | Vercel, Render Web Service, Render PostgreSQL | **Reviewed / Target Design** |
| **Task 4.1** | `SCRUM-110` | Monorepo Migration (`apps/web`, `apps/api`, `docs/a1-archive/`) | PR #11 | `4b80987` | A1 Source structure to Monorepo standard | **Merged / Verified** |
| **Task 4.2** | `SCRUM-111` | `docs/TRACEABILITY.md`<br>`docs/README.md`<br>`docs/report/` | *Current* | *Pending* | Integration of Task 1–3 docs & LaTeX report | **In Progress** |

---

## 2. Quy tắc nhất quán và giải quyết mâu thuẫn (Cross-Task Consistency)

1. **State Machine & Retry Rule (DC-04):** Khi retry VNPay từ trạng thái đơn hàng `PAYMENT_FAILED`, hệ thống **giữ nguyên `Order.status = PAYMENT_FAILED`** trong khi khởi tạo một bản ghi `Payment` mới ở trạng thái `PENDING`. Không tự động chuyển Order về `PENDING`.
2. **Promotion & Coupon:** Khái niệm `Promotion` trong sơ đồ Domain Class ánh xạ trực tiếp vào mô hình `Coupon` và `CouponRedemption` của cơ sở dữ liệu Prisma hiện tại, không tạo bảng Promotion riêng.
3. **LoyaltyTransaction (DC-01):** LoyaltyTransaction là khái niệm suy ra (`derived`) từ `Order.pointsEarned` khi `paidAt != null`, không yêu cầu ledger hoặc bảng lịch sử điểm độc lập mới.
4. **Timeouts & Expiration:** TTL đơn hàng là 15 phút ($E = \text{createdAt} + 15\text{m}$), cửa sổ Grace bổ sung 5 phút ($G = E + 5\text{m}$), và chân trời đối soát kéo dài 60 phút sau Grace ($H = G + 60\text{m}$).
5. **Known Implementation Gaps:** Route `GET /payments/:paymentId/status` theo API Contract v4.0 §5 chưa được hiện thực hóa ở backend tại baseline code kiểm tra; giao diện xử lý UI status có thể nhận mã 404 và được ghi nhận là một gap cần giải quyết ở task tích hợp riêng. QueryDR Sandbox E2E được chính thức hoãn sang A2 theo ADR đã phê duyệt.
