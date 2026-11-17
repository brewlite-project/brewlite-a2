# Bộ tài liệu triển khai Ingredient Inventory — BrewLite A2

**Trạng thái:** **DESIGN BASELINE COMPLETE** — D-01..D-08 **APPROVED DESIGN**. SCRUM-120 vẫn chờ final review, PR merge và Jira closure; không suy diễn design approval thành implementation hoặc production readiness.

Tài liệu mới bổ sung, **không thay thế** Requirements, API Contract, Payment Architecture và các docs cũ. Khi có mâu thuẫn, dừng và ghi Decision Record trong tài liệu này; không tự sửa rule cũ để hợp code mới.

1. [01_Ingredient_Inventory_Decision_Spec_v1.0.md](01_Ingredient_Inventory_Decision_Spec_v1.0.md): quyết định D-01..D-08, invariants, cutover và GO/NO-GO design.
2. [02_Implementation_and_Work_Plan_v1.0.md](02_Implementation_and_Work_Plan_v1.0.md): Jira ownership/dependencies, implementation phases và D-05 legacy-drain runbook requirement.
3. [03_Test_and_Release_Gates_v1.0.md](03_Test_and_Release_Gates_v1.0.md): Test Matrix, PostgreSQL/concurrency gates, VNPay boundary và release evidence.
4. [04_Ingredient_Recipe_Master_v1.0.md](04_Ingredient_Recipe_Master_v1.0.md): 22-ingredient master cùng 25 Product/Size và 5 topping DEMO recipes đã approved ở phạm vi design.
5. [05_SCRUM-121_Schema_Migration.md](05_SCRUM-121_Schema_Migration.md): PR #38 core schema + temporal CHECK, rehearsal ba đường nâng cấp, source snapshot/verifier (§6.3), compatibility và thiết kế snapshot-integrity (§8.1). Leader đã cho phép merge core trước và defer persistence sang SCRUM-123; không thay thế formal approval/CI/merge hoặc release approval.

**Trạng thái thực thi:** Core/temporal revision đã push tại 4e9f1f0; revision provenance mới còn local, xem tài liệu 05. Không suy rộng thành inventory cutover/production readiness. Seed, ingredient reserve/release/concurrency và deployment chưa được xác nhận bởi task này. Opening stock/seed thuộc SCRUM-122. Theo [Leader Ryannguyxn, 2026-11-17 13:33:54 UTC](https://github.com/brewlite-project/brewlite-a2/pull/38#issuecomment-6949554030), persistence deferred sang SCRUM-123; SCRUM-123/124/126 phải hoàn thành implementation/test gates trước ingredient-backed Orders. Chi tiết thiết kế chưa được phê duyệt riêng, chưa triển khai/PASS. API Contract verification thuộc SCRUM-125; migration/cutover/VNPay evidence thuộc SCRUM-128/129/130.

**Operational assumptions:** Repository không tự xác minh current merchant IPN URL/target, deployed version, auto-deploy behavior, Production DB/traffic, maintenance/test-only access hay rollback capability. SCRUM-129/130 phải xác minh và lưu release evidence trước cutover/reopen traffic. Policy vẫn là không đổi VNPay signing, callback, IPN URL hoặc QueryDR nếu không có authorization riêng; không gọi local callback là Sandbox E2E thật khi callback target chưa được xác minh.
