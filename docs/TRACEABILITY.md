# BrewLite A2 — Repository Traceability Matrix

> **Trạng thái SCRUM-117 (13/11/2026):** HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`, origin/dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`, branch SCRUM-117-production-release-delivery tại workspace chính. App/config trùng dev; chỉ 10 docs là delta task. PR17 open, draft=false, remote head 3543a55; cập nhật local chưa stage/push. §1–7 phía dưới là lịch sử theo SHA/ngày riêng; xem §8 cho hiện trạng.



**Task của baseline lịch sử:** [SCRUM-111](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-111) / A2-T4.2 — Repository Documentation & Traceability

**Repository:** [`brewlite-a2`](https://github.com/brewlite-project/brewlite-a2)

**`origin/dev` baseline được xuất:** [`e4d3185750e0956950e67c552c611295286200e2`](https://github.com/brewlite-project/brewlite-a2/commit/e4d3185750e0956950e67c552c611295286200e2) — merge PR [#12](https://github.com/brewlite-project/brewlite-a2/pull/12) ([SCRUM-113](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-113)).

**Historical branch snapshot của [SCRUM-111](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-111) tại thời điểm xuất dữ liệu đầu vào ngày 09/11/2026:** [`69d8582526830ce6da7edb2ece1e420e624aef29`](https://github.com/brewlite-project/brewlite-a2/commit/69d8582526830ce6da7edb2ece1e420e624aef29). Đây là mốc lịch sử dùng để đối chiếu tài liệu, **không phải HEAD hiện tại của PR #14** và không được dùng để suy ra trạng thái branch sau các commit tiếp theo.
**Mục đích:** Truy vết các tạo phẩm Planning, Task 1–3 và Task 4.1 tới artifact path, Jira key, Pull Request, merge commit và source branch tip được ghi trong merge history.

> **Phạm vi bằng chứng:** Các đường dẫn artifact được đối chiếu với Git tree của `origin/dev` tại baseline nêu trên. Merge commit và source tip được lấy từ hai parent của từng merge commit tương ứng. Bảng này không chứng minh rằng mọi yêu cầu đã được triển khai hoặc mọi runtime/integration/Sandbox test đã PASS.
>
> **Jira hyperlinks:** Jira tenant được xác nhận từ URL board do người dùng cung cấp: [`https://nguyenkhang03012006.atlassian.net`](https://nguyenkhang03012006.atlassian.net). Các Jira issue key trong ma trận và các issue được dẫn chiếu trực tiếp được liên kết theo mẫu `https://nguyenkhang03012006.atlassian.net/browse/SCRUM-xxx`. PR và commit được liên kết trực tiếp tới GitHub.

---

## 1. Artifact traceability: Planning → Requirements → Modeling → Architecture → Repository

| Stage | Jira key | Artifact path đã xác minh | PR | Merge commit | Source branch tip (merge parent thứ hai) | Review / design state | Repository / verification state |
|---|---|---|---:|---|---|---|---|
| Planning baseline | [SCRUM-98](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-98) | [`planning/A2_Gap_Analysis.md`](planning/A2_Gap_Analysis.md)<br>[`planning/A2_Implementation_Plan.md`](planning/A2_Implementation_Plan.md)<br>[`planning/A2_Risk_Register.md`](planning/A2_Risk_Register.md) | [#1](https://github.com/brewlite-project/brewlite-a2/pull/1) | [`8b4224a907091529ca954c8b0792406cb8a0d9f2`](https://github.com/brewlite-project/brewlite-a2/commit/8b4224a907091529ca954c8b0792406cb8a0d9f2) | [`9caf29b74a5dc70aee08c5fc9e1d0f384d8eb924`](https://github.com/brewlite-project/brewlite-a2/commit/9caf29b74a5dc70aee08c5fc9e1d0f384d8eb924) | Approved / A2 planning baseline (theo matrix hiện tại) | Merged vào `dev`; không đồng nghĩa toàn bộ kế hoạch đã được thực thi. |
| Task 1.1 — Context & Scope | [SCRUM-99](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-99) | [`requirements/context-and-scope.md`](requirements/context-and-scope.md) | [#2](https://github.com/brewlite-project/brewlite-a2/pull/2) | [`b542ee42be5933ac8cf34bda39908685e88aafbe`](https://github.com/brewlite-project/brewlite-a2/commit/b542ee42be5933ac8cf34bda39908685e88aafbe) | [`bccfe58f6fc81f88a75e25a36a029f3d6a1f4f5e`](https://github.com/brewlite-project/brewlite-a2/commit/bccfe58f6fc81f88a75e25a36a029f3d6a1f4f5e) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. Nội dung DRAFT không được hiểu là phê duyệt cuối. |
| Task 1.2 — SRS | [SCRUM-102](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-102) | [`requirements/srs.md`](requirements/srs.md) | [#7](https://github.com/brewlite-project/brewlite-a2/pull/7) | [`a5d2b50b4e626e34a856f2052564f137188c4f62`](https://github.com/brewlite-project/brewlite-a2/commit/a5d2b50b4e626e34a856f2052564f137188c4f62) | [`7efaf64dd2788a1370a8fd5259646f844289e990`](https://github.com/brewlite-project/brewlite-a2/commit/7efaf64dd2788a1370a8fd5259646f844289e990) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. FR/NFR/AC là yêu cầu; không tự chứng minh implementation. |
| Task 1.3 — Checkout Use Case | [SCRUM-100](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-100) | [`requirements/A2_T1.3_Checkout_Use_Case_Specification.md`](requirements/A2_T1.3_Checkout_Use_Case_Specification.md)<br>[`requirements/diagrams/checkout-use-case.dot`](requirements/diagrams/checkout-use-case.dot)<br>[`requirements/diagrams/checkout-use-case.drawio`](requirements/diagrams/checkout-use-case.drawio)<br>[`requirements/diagrams/use-case-overview.puml`](requirements/diagrams/use-case-overview.puml)<br>[`requirements/diagrams/use-case-overview.svg`](requirements/diagrams/use-case-overview.svg) | [#3](https://github.com/brewlite-project/brewlite-a2/pull/3) | [`f5b67a5b7e9af57428fcff32645ef7b089c81184`](https://github.com/brewlite-project/brewlite-a2/commit/f5b67a5b7e9af57428fcff32645ef7b089c81184) | [`ac08a3a608ad7f2cbc5ea34642aa26130a164bdc`](https://github.com/brewlite-project/brewlite-a2/commit/ac08a3a608ad7f2cbc5ea34642aa26130a164bdc) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. Use Case là đặc tả phạm vi/luồng, không phải runtime evidence. |
| Task 2.1 — Activity Diagram | [SCRUM-103](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-103) | [`diagrams/activity_diagram/A2_T2.1_Activity_Diagram_Checkout.md`](diagrams/activity_diagram/A2_T2.1_Activity_Diagram_Checkout.md)<br>[`diagrams/activity_diagram/`](diagrams/activity_diagram/) | [#4](https://github.com/brewlite-project/brewlite-a2/pull/4) | [`47f4926ca67aa7a1f0ae32a4f67f4d2a2fdf61db`](https://github.com/brewlite-project/brewlite-a2/commit/47f4926ca67aa7a1f0ae32a4f67f4d2a2fdf61db) | [`30ba0fe8e49e727f097545974db4a7f5fce16151`](https://github.com/brewlite-project/brewlite-a2/commit/30ba0fe8e49e727f097545974db4a7f5fce16151) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. Folder gồm overview và phase 1–3; xem link folder/source cụ thể ở §2. |
| Task 2.2 — Sequence Diagram | [SCRUM-104](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-104) | [`diagrams/sequence_diagram/A2_T2.2_Sequence_Diagram_Checkout.md`](diagrams/sequence_diagram/A2_T2.2_Sequence_Diagram_Checkout.md)<br>[`diagrams/sequence_diagram/`](diagrams/sequence_diagram/) | [#8](https://github.com/brewlite-project/brewlite-a2/pull/8) | [`a00b37679fc2027b94949007327d981bd7a45ced`](https://github.com/brewlite-project/brewlite-a2/commit/a00b37679fc2027b94949007327d981bd7a45ced) | [`7bed71d9fb57581427279e4f2250edfc91384a2d`](https://github.com/brewlite-project/brewlite-a2/commit/7bed71d9fb57581427279e4f2250edfc91384a2d) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. Folder gồm overview và phase 1–3; xem link folder/source cụ thể ở §2. |
| Task 2.3 — Domain Class Diagram | [SCRUM-105](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-105) | [`diagrams/brewlite-domain-class.drawio`](diagrams/brewlite-domain-class.drawio)<br>[`diagrams/brewlite-domain-class.svg`](diagrams/brewlite-domain-class.svg)<br>[`diagrams/brewlite-domain-class.pdf`](diagrams/brewlite-domain-class.pdf)<br>[`diagrams/brewlite-domain-types.svg`](diagrams/brewlite-domain-types.svg)<br>[`diagrams/render_domain.py`](diagrams/render_domain.py) | [#5](https://github.com/brewlite-project/brewlite-a2/pull/5) | [`03dfb47abe0fa9c0a71407b709fd010c9e083ed2`](https://github.com/brewlite-project/brewlite-a2/commit/03dfb47abe0fa9c0a71407b709fd010c9e083ed2) | [`978e038ab44bf34eef694c50f563643119718ec0`](https://github.com/brewlite-project/brewlite-a2/commit/978e038ab44bf34eef694c50f563643119718ec0) | Reviewed; document label remains DRAFT (theo matrix hiện tại) | Merged. Không coi sơ đồ domain là thay thế Prisma schema hoặc migration. |
| Task 3.1 — Architecture & ADRs | [SCRUM-107](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-107) | [`architecture/architecture.md`](architecture/architecture.md)<br>[`architecture/adr/001-modular-monolith.md`](architecture/adr/001-modular-monolith.md)<br>[`architecture/adr/002-database-schema-authority.md`](architecture/adr/002-database-schema-authority.md)<br>[`architecture/adr/003-payment-consistency.md`](architecture/adr/003-payment-consistency.md)<br>[`architecture/adr/004-a2-environment-isolation.md`](architecture/adr/004-a2-environment-isolation.md)<br>[`architecture/adr/005-production-hosting.md`](architecture/adr/005-production-hosting.md) | [#9](https://github.com/brewlite-project/brewlite-a2/pull/9) | [`2c432159ec8eb47ea315c3af25c1739d0f04dd4d`](https://github.com/brewlite-project/brewlite-a2/commit/2c432159ec8eb47ea315c3af25c1739d0f04dd4d) | [`f09c39274c34f8731918b7dcda8a3ee0b39ea998`](https://github.com/brewlite-project/brewlite-a2/commit/f09c39274c34f8731918b7dcda8a3ee0b39ea998) | Reviewed / Technical Approved (theo matrix hiện tại) | Merged. Technical approval chỉ áp dụng kiến trúc/ADR trong phạm vi đã duyệt, không chứng minh runtime. |
| Task 3.2 — Deployment design | [SCRUM-108](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-108) | [`deployment.md`](deployment.md)<br>[`diagrams/brewlite-deployment.drawio`](diagrams/brewlite-deployment.drawio)<br>[`diagrams/brewlite-deployment.svg`](diagrams/brewlite-deployment.svg)<br>[`diagrams/brewlite-deployment.pdf`](diagrams/brewlite-deployment.pdf)<br>[`diagrams/deployment-README.md`](diagrams/deployment-README.md) | [#6](https://github.com/brewlite-project/brewlite-a2/pull/6) | [`4910733ac4633b6f85480d0399c5dae6c4399545`](https://github.com/brewlite-project/brewlite-a2/commit/4910733ac4633b6f85480d0399c5dae6c4399545) | [`86829aed969f9bef845eab4f6d0f82d12002fc21`](https://github.com/brewlite-project/brewlite-a2/commit/86829aed969f9bef845eab4f6d0f82d12002fc21) | Reviewed / Target Design (theo matrix hiện tại) | Merged. Path chuẩn hiện tại là `docs/deployment.md`; target design không phải bằng chứng deployment đã chạy. |
| Task 4.1 — Monorepo & A1 archive migration | [SCRUM-110](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-110) | `apps/web/`, `apps/api/`, [`a1-archive/PROVENANCE.md`](a1-archive/PROVENANCE.md), [`README.md`](../README.md) | [#11](https://github.com/brewlite-project/brewlite-a2/pull/11) | [`4b8098742aa5346d116b7a2ba3e3c1956462acf7`](https://github.com/brewlite-project/brewlite-a2/commit/4b8098742aa5346d116b7a2ba3e3c1956462acf7) | [`e64c5fd0a63aae62c2c35f8c454c8dd74ad0d6b0`](https://github.com/brewlite-project/brewlite-a2/commit/e64c5fd0a63aae62c2c35f8c454c8dd74ad0d6b0) | — | Merged. Tree của `origin/dev` xác nhận `apps/web`, `apps/api` và `docs/a1-archive/` tồn tại. |
| Task 4.2 — Documentation & traceability | [SCRUM-111](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-111) | [`README.md`](README.md), [`TRACEABILITY.md`](TRACEABILITY.md) | [#14](https://github.com/brewlite-project/brewlite-a2/pull/14) | Chưa có merge commit | Historical branch snapshot (09/11/2026; **không phải HEAD hiện tại của PR #14**): [`69d8582526830ce6da7edb2ece1e420e624aef29`](https://github.com/brewlite-project/brewlite-a2/commit/69d8582526830ce6da7edb2ece1e420e624aef29) | Review vòng 1: Changes Requested (theo review được cung cấp) | Chưa merged; cập nhật sau review vòng 2. |

### 1.1. Baseline sau các task tài liệu

`origin/dev` tại thời điểm xuất input đã có thêm PR [#12 — SCRUM-113 GitHub Actions quality gates](https://github.com/brewlite-project/brewlite-a2/pull/12):

- Merge commit: [`e4d3185750e0956950e67c552c611295286200e2`](https://github.com/brewlite-project/brewlite-a2/commit/e4d3185750e0956950e67c552c611295286200e2).
- Source branch tip (parent thứ hai): [`5472f03ee46643b3e51439741515a7e5b0dbdbdc`](https://github.com/brewlite-project/brewlite-a2/commit/5472f03ee46643b3e51439741515a7e5b0dbdbdc).

PR #12 là thay đổi CI sau PR #11; không gán PR #12 làm PR triển khai cho các artifact Task 1–4.1.

## 2. Business traceability chi tiết

Các chuỗi dưới đây nối artifact A2 hiện hành với các nguồn hợp đồng/decision kế thừa nằm trong archive. Archive được dẫn làm nguồn lịch sử/chuẩn nghiệp vụ; việc dẫn nguồn **không tự xác nhận** mọi yêu cầu đã được code hoặc kiểm thử thành công.

### 2.1. Create Order

1. **Requirements:** [`requirements/context-and-scope.md`](requirements/context-and-scope.md) → [`requirements/srs.md`](requirements/srs.md) → [`requirements/A2_T1.3_Checkout_Use_Case_Specification.md`](requirements/A2_T1.3_Checkout_Use_Case_Specification.md).
2. **Modeling:** [`diagrams/activity_diagram/phase1/activity-checkout-phase1-order.puml`](diagrams/activity_diagram/phase1/activity-checkout-phase1-order.puml) / [SVG](diagrams/activity_diagram/phase1/activity-checkout-phase1-order.svg) → [`diagrams/sequence_diagram/phase1/sequence-checkout-phase1a-order-init.puml`](diagrams/sequence_diagram/phase1/sequence-checkout-phase1a-order-init.puml) và [`sequence-checkout-phase1b-order-create.puml`](diagrams/sequence_diagram/phase1/sequence-checkout-phase1b-order-create.puml).
3. **Domain:** [`diagrams/brewlite-domain-class.drawio`](diagrams/brewlite-domain-class.drawio) và [`diagrams/brewlite-domain-types.svg`](diagrams/brewlite-domain-types.svg).
4. **Business source:** [`A1 API Contract v3.0`](a1-archive/api/BrewLite_API_Contract_v3.0.md) (Create Order, active Order, transaction/rollback, inventory/coupon consistency); [`SCRUM58 Inventory Concurrency`](a1-archive/api/SCRUM58_Inventory_Concurrency.md) (cleanup trước Create Order, concurrency và bounded retry); [`SCRUM59 Order–Payment Lifecycle`](a1-archive/api/SCRUM59_Order_Payment_Lifecycle.md).

### 2.2. Payment idempotency và retry

1. **Requirements/modeling:** [`requirements/srs.md`](requirements/srs.md) → [`diagrams/sequence_diagram/phase2/sequence-checkout-phase2a-idempotency.puml`](diagrams/sequence_diagram/phase2/sequence-checkout-phase2a-idempotency.puml) / [PDF](diagrams/sequence_diagram/phase2/sequence-checkout-phase2a-idempotency.pdf).
2. **Idempotency source:** [`A1 API Contract v3.0`](a1-archive/api/BrewLite_API_Contract_v3.0.md) (mục idempotency/concurrency) → [`SCRUM55 Payment Idempotency`](a1-archive/api/SCRUM55_Payment_Idempotency.md) → [`Shared Payment Finalization handoff`](a1-archive/design/payment/Shared_Payment_Finalization_Handoff_SCRUM-78.md) ([Jira: SCRUM-78](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-78)) và [`Payment Finalization concurrency handoff`](a1-archive/design/payment/Payment_Finalization_Concurrency_Test_Handoff_SCRUM-79.md) ([Jira: SCRUM-79](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-79)).
3. **VNPay extension:** [`A1 API Contract v4.0`](a1-archive/api/BrewLite_API_Contract_v4.0.md) quy định key/canonical request, replay, conflict, in-flight handling và immutable initiation/final outcome data; nối tiếp bằng [`sequence-checkout-phase3a-vnpay-ipn.puml`](diagrams/sequence_diagram/phase3/sequence-checkout-phase3a-vnpay-ipn.puml).
4. **Phân biệt retry:** retry một request do timeout/key đang bận phải giữ cùng idempotency key để replay/đợi kết quả của cùng request; một payment attempt mới sau FAILED là nghiệp vụ riêng, dùng key mới theo contract và chỉ hợp lệ khi Order vẫn đủ điều kiện. Không coi PENDING/unknown của VNPay là FAILED và không mở attempt/fallback mới khi kết quả còn chưa rõ.
5. **Giới hạn:** transaction retry cho lỗi cạnh tranh được mô tả riêng trong [`SCRUM58 Inventory Concurrency`](a1-archive/api/SCRUM58_Inventory_Concurrency.md); không đồng nhất transaction retry với việc Customer thử thanh toán lần nữa.

### 2.3. VNPay initiation, Return, IPN và QueryDR

1. **Requirements:** [`requirements/srs.md`](requirements/srs.md) và [`requirements/A2_T1.3_Checkout_Use_Case_Specification.md`](requirements/A2_T1.3_Checkout_Use_Case_Specification.md).
2. **Modeling:** [`sequence-checkout-phase2-payment-init.puml`](diagrams/sequence_diagram/phase2/sequence-checkout-phase2-payment-init.puml) → [`sequence-checkout-phase3-vnpay-ipn-reconciliation.puml`](diagrams/sequence_diagram/phase3/sequence-checkout-phase3-vnpay-ipn-reconciliation.puml) → [`sequence-checkout-phase3a-vnpay-ipn.puml`](diagrams/sequence_diagram/phase3/sequence-checkout-phase3a-vnpay-ipn.puml) → [`sequence-checkout-phase3b-return-scheduler.puml`](diagrams/sequence_diagram/phase3/sequence-checkout-phase3b-return-scheduler.puml).
3. **Business source:** [`A1 API Contract v4.0`](a1-archive/api/BrewLite_API_Contract_v4.0.md), [`VNPay Phase 2 Change Request`](a1-archive/decisions/VNPay_Phase2_Change_Request.md), [`VNPay Sandbox Setup`](a1-archive/integration/VNPay_Sandbox_Setup.md) và [`ADR QueryDR Sandbox E2E Deferred`](a1-archive/decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md).
4. **Quy tắc đọc bằng chứng:** Return URL chỉ là luồng điều hướng; IPN phải xác minh nguồn/merchant/amount/correlation/signature và finalize an toàn; QueryDR phải phân biệt query response với payment outcome. Unit/integration test hoặc synthetic local Compose không thay thế VNPay Sandbox E2E. Nguồn archive ghi nhận QueryDR Sandbox E2E được hoãn; không ghi trạng thái Sandbox PASS nếu không có evidence thực tế tương ứng.

### 2.4. TTL, Grace và reconciliation horizon

1. **A2 model:** [`activity-checkout-phase3-reconciliation.puml`](diagrams/activity_diagram/phase3/activity-checkout-phase3-reconciliation.puml) → [`sequence-checkout-phase3b-return-scheduler.puml`](diagrams/sequence_diagram/phase3/sequence-checkout-phase3b-return-scheduler.puml).
2. **Business/decision source:** [`A1 API Contract v4.0`](a1-archive/api/BrewLite_API_Contract_v4.0.md) (Order expiration/Grace và lịch QueryDR) → [`SCRUM59 Order–Payment Lifecycle`](a1-archive/api/SCRUM59_Order_Payment_Lifecycle.md) → [`SCRUM82 Payment Reconciliation Scheduler verification`](a1-archive/verification/SCRUM82_Payment_Reconciliation_Scheduler.md) → [`Shared Payment Finalization handoff`](a1-archive/design/payment/Shared_Payment_Finalization_Handoff_SCRUM-78.md) ([Jira: SCRUM-78](https://nguyenkhang03012006.atlassian.net/browse/SCRUM-78)).
3. **Notation trong tài liệu:** `E = Order.expiresAt`; `G = E + 5 phút`; `H = G + 60 phút`. Đây là ba mốc nghiệp vụ khác nhau: hết TTL, hết Grace, hết reconciliation horizon.
4. **Quy tắc được nguồn v4.0 mô tả:** trước `E`, Order còn đủ điều kiện để tạo attempt mới; trong `[E, G)`, Grace chỉ phục vụ xác minh một VNPay attempt đã được khởi tạo đúng hạn, không gia hạn quyền tạo attempt; tại/sau `G`, Order chưa được xác minh thành công có thể bị CANCELLED và tài nguyên được release đúng một lần trong transaction, trong khi Payment chưa rõ kết quả vẫn PENDING để tiếp tục đối soát; đến `H`, chuyển trạng thái đối soát sang `REQUIRES_REVIEW` thay vì tự kết luận FAILED. IPN muộn vẫn phải qua shared finalization/evidence handling.
5. **Không suy diễn:** các mốc và policy này là trace tới contract/verification source. Bản thân dòng traceability không chứng minh scheduler đang chạy đúng ở production hoặc mọi race đã được nghiệm thu trong runtime.

## 3. Cross-Task Consistency và cách xử lý xung đột

Các mục dưới đây là **bản đồ nguồn và các nguyên tắc cần đối chiếu**, không phải tuyên bố rằng mọi mâu thuẫn lịch sử đã được giải quyết:

1. **Retry và state machine:** đối chiếu A1 API Contract v3.0, A1 API Contract v4.0, SCRUM55, SCRUM58 và SCRUM59. Giữ riêng ba trường hợp: idempotency replay của cùng request; transaction retry có giới hạn khi gặp lỗi cạnh tranh transient; payment attempt mới sau FAILED terminal. Không dùng retry của một loại để biện minh cho loại khác.
2. **TTL/Grace/reconciliation:** lấy A1 API Contract v4.0 làm nguồn policy chi tiết cho `E/G/H`, đối chiếu SCRUM59 và SCRUM82 verification. Khi report hoặc diagram có mô tả khác, ghi nhận discrepancy/change decision và xác định nguồn được phê duyệt; không tự chọn một con số rồi coi xung đột đã hết.
3. **VNPay evidence:** phân biệt thiết kế API, kiểm thử unit/integration, synthetic Compose, IPN Sandbox và QueryDR Sandbox. Chỉ ghi PASS cho đúng lớp evidence đã chạy; nguồn hiện có nêu QueryDR Sandbox E2E deferred.
4. **Promotion/Coupon:** Domain Class là mô hình khái niệm; đối chiếu Prisma/database authority theo [`ADR-002`](architecture/adr/002-database-schema-authority.md). Không suy ra có bảng `Promotion` riêng nếu schema authority không định nghĩa.
5. **Loyalty:** đối chiếu mô hình domain với requirement và payment finalization source. Một khái niệm trong class diagram không tự yêu cầu ledger/table mới khi nguồn persistence không quy định điều đó.

Nếu phát hiện mâu thuẫn chưa được quyết định, ghi rõ hai nguồn, phạm vi khác nhau, owner/decision cần có và liên kết change record/ADR. Không “resolve” bằng cách sửa câu chữ trong ma trận mà không cập nhật nguồn có thẩm quyền.

## 4. Quy ước trạng thái

Các nhãn thuộc những trục khác nhau; không ghép chúng thành một trạng thái duy nhất.

| Nhãn | Ý nghĩa trong ma trận | Không có nghĩa là |
|---|---|---|
| `DRAFT` | Nội dung tài liệu còn là bản nháp/chưa có phê duyệt cuối theo trạng thái nguồn được ghi nhận. | Không có nghĩa PR chưa merge; một tài liệu DRAFT vẫn có thể nằm trong PR đã merge. |
| `Reviewed` | Đã có hoạt động review theo thông tin của task/matrix. | Không tự đồng nghĩa `Approved`, `Merged` hoặc `Verified`. |
| `Approved` | Phạm vi tài liệu/decision được phê duyệt làm baseline. | Không chứng minh code, migration, deployment hay Sandbox đã chạy thành công. |
| `Target Design` | Mô tả kiến trúc/triển khai mục tiêu. | Không phải deployment evidence hoặc production verification. |
| `Merged` | PR đã được merge vào nhánh đích; cần có PR và merge commit để kiểm tra. | Không chứng minh yêu cầu đã nghiệm thu hoặc runtime PASS. |
| `Verified` | Một phạm vi cụ thể đã được kiểm chứng bằng evidence có thể truy cập. | Không được mở rộng sang môi trường, lớp test hoặc scenario chưa chạy. |
| `Changes Requested` | Reviewer yêu cầu sửa đổi ở vòng review được nêu. | Không phải Approved/Merged. |
| `In Progress` / `Pending` | Công việc chưa có bằng chứng hoàn tất tương ứng. | Không được chuyển thành Done chỉ vì branch đã push hoặc unit test pass. |

## 5. Link conventions và cập nhật ma trận

- Jira issue: dùng tenant đã xác nhận [`https://nguyenkhang03012006.atlassian.net`](https://nguyenkhang03012006.atlassian.net); URL issue theo mẫu `https://nguyenkhang03012006.atlassian.net/browse/SCRUM-xxx`.
- Pull Request: dùng `https://github.com/brewlite-project/brewlite-a2/pull/<number>`.
- Commit: dùng full SHA URL `https://github.com/brewlite-project/brewlite-a2/commit/<40-char-sha>`; không chỉ lưu short SHA nếu có thể lấy full SHA.
- **Merge commit** là commit merge PR (thường có hai parent); **source branch tip** trong bảng là parent thứ hai được ghi trong merge history. Đây là hai đối tượng khác nhau, không thay thế lẫn nhau.
- Khi PR được cập nhật/merge, cập nhật trạng thái và SHA dựa trên GitHub/Git history mới; không giữ `Pending` hoặc branch HEAD cũ như sự thật hiện tại.

## 6. Delivery snapshot SCRUM-117 / A2-T5.4

Ngày kiểm tra 10/11/2026, môi trường Windows repository + GitHub read-only.
SHA source `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`; branch tài liệu
`SCRUM-117-production-release-delivery` chưa commit. Bảng §1 là snapshot lịch sử;
trạng thái thực của #14 đã thay đổi như dưới đây.

| Task / phạm vi | Artifact chuẩn | PR / merge commit | Mức chứng minh |
|---|---|---|---|
| SCRUM-111 / T4.2 | [docs README](README.md), ma trận này | [#14](https://github.com/brewlite-project/brewlite-a2/pull/14), `34cbbc088117d7a4908d07a66cfbd03b0c905dea`; source tip `38e3b842e22319cba1c24d716c50adb1056b0019` | **Merged**, xác minh bằng Git parents; không tự đổi trạng thái phê duyệt tài liệu |
| SCRUM-112 / T4.3 | [MVP report](A2_TestReport/MVP_Sprint1_Verification_Report.md), [ảnh](A2_TestReport/evidence/) | [#15](https://github.com/brewlite-project/brewlite-a2/pull/15), `7dfc7ca996c2eb6190a5ec3e7812f70d441a61cb`; source tip `e942cbe9be479e53ba76f8c3bf99e3e489db93f6` | Merged; test report kế thừa chạy source 34cbbc0, không production và không rerun SCRUM-117 |
| SCRUM-114/115/116 | Chờ PR, tests/migration/CD/deploy evidence | Không trả kết quả khi search PR theo key tại lần kiểm tra | **NOT VERIFIED**, không suy Jira Done hoặc work ngoài repo; assignee chưa được xác nhận |
| SCRUM-117 / T5.4 | [README A2](../README.md), [deployment runbook](deployment.md#11-runbook-scrum-117--migration-seed-và-rollback), [readiness/evidence/demo/checklist](delivery/SCRUM-117-delivery.md), [release notes/PR draft](delivery/release-notes-A2.md) | Chưa PR/commit/merge | Hồ sơ nháp chờ review; runtime/release/acceptance còn chặn |
| SCRUM-117 report | [main.tex](report/main.tex), [delivery section](report/sections/deployment-release-delivery.tex), [build guide](report/README.md) | Chưa PR/commit/merge | Tích hợp fragments nguồn; chưa compile/visual QA, chưa report PDF cuối |

Nguồn từng tiêu chí, evidence commit/environment/time/method/result và đầu vào
còn thiếu ở [delivery §2–3](delivery/SCRUM-117-delivery.md#2-readiness-theo-acceptance-criteria).
Release/tag → source SHA → FE → BE → CI/CD → smoke ở
[delivery §4](delivery/SCRUM-117-delivery.md#4-releasetag--source--deployments--runs--smoke).
**8 AC SCRUM-117 đã được người dùng cung cấp và xác nhận**, là căn cứ readiness.
Lượt tiếp tục đã đọc [đề A2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view)
qua Drive; checklist §9.1 đã được ánh xạ trong delivery §7. Nguồn lịch sử nói chưa
tìm thấy đề chỉ đúng thời điểm đó. [Requirement matrix](traceability-matrix.md)
mới bổ sung theo path đề §8.1: 48 FR + 49 NFR, giữ SRS IDs và gap/priority;
chỉ kiểm chứng mapping/file inventory, không runtime PASS hay approval.
Rollback rehearsal hiện khuyến nghị, chưa thấy nguồn áp dụng bắt buộc. Phạm vi
payment-status/QueryDR giữ trạng thái cần xác nhận theo bảng nguồn/tác động ở
delivery §3, không tự miễn A2 hay mặc định chặn toàn bộ release.

Đã thu thêm [push CI 42782530478](https://github.com/brewlite-project/brewlite-a2/actions/runs/42782530478)
success đúng SHA 7dfc7ca (10/11/2026, 08:25:31Z–08:27:13Z), API CI/Web CI;
[PR CI 42780158363](https://github.com/brewlite-project/brewlite-a2/actions/runs/42780158363)
success SHA e942cbe (08:07:17Z–08:08:49Z). CI unit/build khác runtime report
source 34cbbc0 và không chứng minh CD, production hoặc Sandbox E2E.

Lượt tiếp tục cũng thu [CI failure 42626286395](https://github.com/brewlite-project/brewlite-a2/actions/runs/42626286395)
ở SHA 779dacd: Web lint failure, unit/build skipped; [CI success 42629605254](https://github.com/brewlite-project/brewlite-a2/actions/runs/42629605254)
ở SHA 5472f03. Đủ ghi nhận pipeline phát hiện lỗi/phục hồi theo đề §6.4; chưa có
bằng chứng branch protection chặn merge. Không có PR SCRUM-117 trong kết quả search
15 PR hiện tại; 9 file đầu vào đang staged ở máy nhưng chưa commit/push, matrix mới
chưa stage. Staged không đồng nghĩa published trên repository remote.

## 7. Historical audit: đối chiếu remote dev mới 5021743 trước khi cập nhật checkout

Lần fetch ngày 10/11/2026 ghi nhận branch task khi đó ở `7dfc7ca`; evidence §1–6 giữ SHA/môi trường lịch sử. Snapshot checkout ngày 11/11 đã ở baseline `5021743e99d73c2ce795df72ee5aaa90b04bb0da`; hiện trạng 13/11 xem §8.
Evidence rows below keep their historical SHA, environment and CI result; current checkout is the branch/SHA recorded at the top.

| Nguồn mới | SHA / evidence | Kết luận đúng phạm vi |
|---|---|---|
| [PR #16 / SCRUM-116](https://github.com/brewlite-project/brewlite-a2/pull/16) | Head `e8b1498ab0fe70a1bacd0f2b221492c46796643f`, merge `5021743e99d73c2ce795df72ee5aaa90b04bb0da`; review APPROVED 2026-11-10T15:37:54Z | Merged phần Next/proxy, không overall nghiệm thu SCRUM-116; PR ghi CD/Render/Vercel/smoke là follow-up |
| [PR CI 42845148086](https://github.com/brewlite-project/brewlite-a2/actions/runs/42845148086) | e8b1498, pull_request; 15:31:04Z–15:32:49Z, success | Lint/unit/build, không Sandbox/production |
| [Push CI 42846397766](https://github.com/brewlite-project/brewlite-a2/actions/runs/42846397766) | 5021743, push/dev; 15:38:07Z–15:39:50Z, success | CI đúng merge source, không CD/deploy |

Chỉ ba file `apps/web/package.json`, `package-lock.json`, proxy Route Handler đổi.
Không file nào trùng phạm vi 10 docs SCRUM-117; không thay requirement/test/API
mapping. [Delivery §12](delivery/SCRUM-117-delivery.md#12-đối-chiếu-dev-mới-5021743-chưa-tích-hợp)
ghi chi tiết gaps, AC và lịch sử worktree sync; PR body dự kiến từ branch SCRUM-117-production-release-delivery vào dev.

## 8. SCRUM-117 hiện hành — audit 13/11/2026

| Task/phạm vi | PR / merge SHA | Trạng thái và giới hạn |
|---|---|---|
| SCRUM-116 seed demo Render | [#18](https://github.com/brewlite-project/brewlite-a2/pull/18) 6e004d764ca9027290f100c0f010d7e5c33824ac; [#19](https://github.com/brewlite-project/brewlite-a2/pull/19) 63b9195c64b8f4c58c674bbe0ecad5eb8d8d55d0; [#20](https://github.com/brewlite-project/brewlite-a2/pull/20) f674897d7f9c02c537fcc84828d73f54e3a9bfbe; [#21](https://github.com/brewlite-project/brewlite-a2/pull/21) 3d412b45cf53a282e5594994b343402e14826f55 | Merged, có trong checkout: cloud seed/policy/artifact, diagnostics/catalog fixture; không tự chứng minh runtime |
| SCRUM-116 one-shot guard/TLS | [#22](https://github.com/brewlite-project/brewlite-a2/pull/22) af31196125e93243b2b89a02b33134a764eeddc9; [#23](https://github.com/brewlite-project/brewlite-a2/pull/23) 95906b56c1a2842eb04cdbd7bf60a267ef98fbf9 | Migration thứ 10/marker, tests và Internal Prisma TLS profile. Không suy DB external policy |
| Production promotion liên quan 114/115/116, không tự gán nghiệm thu | [#24](https://github.com/brewlite-project/brewlite-a2/pull/24) 1b394f1dae75fd0a11c1b1b3f4390a588dedf18f; [#26](https://github.com/brewlite-project/brewlite-a2/pull/26) 03668e36b85a9958d5a6e1cd2b468295fdb0fb2d | #24 báo 10 migrations/seed/catalog; #26 báo Sandbox payment PAID/SUCCESS/+10 tại 2216b7a, có manual reconciliation còn mở. Không có report riêng SCRUM114/115, IPN/QueryDR chưa chứng minh |
| QueryDR diagnostics | [#25](https://github.com/brewlite-project/brewlite-a2/pull/25) 2216b7a246b21491cf81cd2f2196f907c0aa7a98 | Diagnostics/tests, body báo 479 PASS và 6 PostgreSQL opt-in skipped; không sửa timeout |
| CD configuration documentation | [#27](https://github.com/brewlite-project/brewlite-a2/pull/27) 0e43bcb80f64d6a5fa558cd80f71a199029535d0 | Chỉ apps/api/README.md, main/Render/After CI Checks Pass; chưa observed CD event. CI 43392423041 success |
| main promotion | [#28](https://github.com/brewlite-project/brewlite-a2/pull/28) 02452f228712c3501c8d27f0f1ae737ad206785d | CI 43394783298 và Vercel status success; backend alignment/domain alias chưa bind, chưa A2 release/tag |
| SCRUM-117 / A2-T5.4 | [#17](https://github.com/brewlite-project/brewlite-a2/pull/17), head remote 3543a55d4fed63cd343f5da59d28500f124490be | Open thường, chưa review/acceptance; local HEAD 91e6f99 đã gồm dev mới. 10 docs; body cập nhật chuẩn bị, chưa push/update PR |

Ngày/giờ gốc và mapping CI/deploy/smoke ở [delivery §4/13](delivery/SCRUM-117-delivery.md#13-audit-hiện-hành-ngày-13112026). Không thay SHA evidence SCRUM112/A1 hoặc nâng implementation thành acceptance. Chỉ phần tài liệu có thể review; 8 AC release còn NOT VERIFIED toàn AC.

## Cập nhật evidence và PDF ngày14/11/2026

**Cập nhật tiếp 14/11/2026:** HEAD91e6f99/dev0e43bcb giữ nguyên, 10 docs unstaged đầu vào được bảo toàn. Backend https://brewlite-a2-api-hntn.onrender.com/ có ảnh Render Auto-Deploy Live02452f2 (fullSHA02452f228712c3501c8d27f0f1ae737ad206785d), deployed field13/11/2026 08:39:19Z. GET mới / và /products200 lúc16:24:59Z ngày13/11, catalog9 items; GET không xuất processSHA. DB Free18/Singapore/1GB/Available, expiry10/12/2026; external3 /32 restricted, chưa private-only. Bỏ Edge/Computer Use theo yêu cầu; Người dùng đính chính ngày 14/11/2026: Leader chưa kiểm tra/nghiệm thu SCRUM-117. Evidence và các giới hạn tại dossier §14.

[PDF báo cáo](report/output/main.pdf), [build/QA](report/README.md#kết-quả-build-và-qa-ngày-14112026), [dossier §14](delivery/SCRUM-117-delivery.md#14-evidence-render-backup-và-pdf--cập-nhật-14112026). AC2 VERIFIED snapshot HTTP/liveness/catalog; AC3 PARTIAL vì external còn3 /32 và Internal app usage chưa xác nhận. Requirement mapping không tự nâng thành acceptance; payment-status/QueryDR và manual reconciliation giữ mở.
