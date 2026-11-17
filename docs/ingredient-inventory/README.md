# Bộ tài liệu triển khai Ingredient Inventory — BrewLite A2

**Trạng thái:** **DESIGN BASELINE COMPLETE** — D-01..D-08 **APPROVED DESIGN**. SCRUM-120 vẫn chờ final review, PR merge và Jira closure; không suy diễn design approval thành implementation hoặc production readiness.

Tài liệu mới bổ sung, **không thay thế** Requirements, API Contract, Payment Architecture và các docs cũ. Khi có mâu thuẫn, dừng và ghi Decision Record trong tài liệu này; không tự sửa rule cũ để hợp code mới.

1. [01_Ingredient_Inventory_Decision_Spec_v1.0.md](01_Ingredient_Inventory_Decision_Spec_v1.0.md): quyết định D-01..D-08, invariants, cutover và GO/NO-GO design.
2. [02_Implementation_and_Work_Plan_v1.0.md](02_Implementation_and_Work_Plan_v1.0.md): Jira ownership/dependencies, implementation phases và D-05 legacy-drain runbook requirement.
3. [03_Test_and_Release_Gates_v1.0.md](03_Test_and_Release_Gates_v1.0.md): Test Matrix, PostgreSQL/concurrency gates, VNPay boundary và release evidence.
4. [04_Ingredient_Recipe_Master_v1.0.md](04_Ingredient_Recipe_Master_v1.0.md): 22-ingredient master cùng 25 Product/Size và 5 topping DEMO recipes đã approved ở phạm vi design.
5. [05_SCRUM-121_Schema_Migration.md](05_SCRUM-121_Schema_Migration.md): PR #38 core schema + temporal CHECK follow-up migration, rehearsal ba đường nâng cấp, evidence/provenance, compatibility và đề xuất snapshot-integrity (§8.1) chờ Leader; chưa thay thế release approval.

**Trạng thái thực thi:** SCRUM-121 có implementation và evidence local riêng ở tài liệu 05; không suy rộng thành inventory cutover hoặc production readiness. Seed, ingredient reserve/release/concurrency và deployment chưa được xác nhận bởi task này. Opening stock, seed idempotency và detailed input conversion còn là dependency SCRUM-122; snapshot-integrity persistence còn cần SCRUM-121/123 đề xuất/review; active API Contract verification thuộc SCRUM-125; PostgreSQL concurrency tests thuộc SCRUM-126; migration/cutover và VNPay evidence thuộc SCRUM-128/129/130.

**Operational assumptions:** Repository không tự xác minh current merchant IPN URL/target, deployed version, auto-deploy behavior, Production DB/traffic, maintenance/test-only access hay rollback capability. SCRUM-129/130 phải xác minh và lưu release evidence trước cutover/reopen traffic. Policy vẫn là không đổi VNPay signing, callback, IPN URL hoặc QueryDR nếu không có authorization riêng; không gọi local callback là Sandbox E2E thật khi callback target chưa được xác minh.
