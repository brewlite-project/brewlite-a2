# Bộ tài liệu triển khai Ingredient Inventory — BrewLite A2

**Trạng thái:** proposed baseline / chờ xác nhận lịch chấm mới và khóa quyết định.

Tài liệu mới bổ sung, **không thay thế** Requirements, API Contract, Payment Architecture và các docs cũ. Khi có mâu thuẫn, dừng và ghi Decision Record trong tài liệu này; không tự sửa rule cũ để hợp code mới.

1. `01_Ingredient_Inventory_Decision_Spec_v1.0.md`: phạm vi và quy tắc nghiệp vụ, schema đề xuất, những quyết định còn OPEN.
2. `02_Implementation_and_Work_Plan_v1.0.md`: audit, chia việc, workflow Git/Docker, day-by-day, prompt Codex read-only.
3. `03_Test_and_Release_Gates_v1.0.md`: test matrix, SQL assertions, VNPay test boundary, GO/NO-GO.

**VNPay:** Giữ nguyên IPN Merchant và flow thanh toán hiện tại. Unit/integration test offline trước release, một Sandbox Production smoke sau release. Không gọi đó là Sandbox Local E2E nếu callback không về Local.

**Production safety:** Main auto-deploy; không merge main để thử nghiệm. Không chạy migrations/seed trên Production trước khi hoàn tất release gates.
