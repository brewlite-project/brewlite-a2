# BrewLite A2 — Ingredient Inventory Test Matrix & Release Gates

**Version:** 1.0 | **Status:** Proposed verification contract
**Owners:** Hoàng (test engineering), Khang (acceptance/release).
**No code / merchant VNPay configuration changes authorized by this document.**

## 1. Phương pháp chứng minh

Mỗi test phải ghi: `case ID`, commit SHA, môi trường, DB id, fixture/recipe, thao tác, expected, actual, PASS/FAIL, bằng chứng log/SQL, reviewer. Không dùng một screenshot UI làm bằng chứng nhất quán database. Dùng database local/staging riêng; không chạy test phá dữ liệu trên Production.

**Phân loại:** Unit → Integration DB → Concurrency real PostgreSQL → Regression API/UI → Sandbox VNPay production smoke. `CI green` không thay thế các mức test khác.

## 2. Test Matrix — Inventory

| ID     | Ca kiểm thử                                         | Expected result                                                         |
| ------ | --------------------------------------------------- | ----------------------------------------------------------------------- |
| INV-01 | Đặt 1 sản phẩm size S, không topping                | Mỗi ingredient giảm đúng recipe snapshot, Order PENDING, reservation đủ |
| INV-02 | Size M/L khác S                                     | Ingredient dùng đúng công thức size, không suy từ giá                   |
| INV-03 | Topping tiêu hao ingredient riêng                   | Trừ đúng topping × số ly                                                |
| INV-04 | Topping và base recipe cùng dùng ingredient         | Aggregate rồi trừ một lần bằng tổng đúng                                |
| INV-05 | Nhiều sản phẩm trong một Order cùng dùng ingredient | Tổng demand đúng, unique reservation theo `(order, ingredient)`         |
| INV-06 | Một ingredient không đủ dù các ingredient khác đủ   | 409 phù hợp, **không tạo Order, không partial stock/coupon**            |
| INV-07 | Recipe bị thiếu / ingredient inactive / unit sai    | Reject rõ ràng, không implicit zero demand                              |
| INV-08 | Thay công thức sau tạo Order, rồi expire/cancel     | Hoàn **snapshot cũ**, không hoàn công thức mới                          |
| INV-09 | Scheduler expire Order                              | Order CANCELLED, ingredient stock trở lại chính xác                     |
| INV-10 | Scheduler gọi trùng/lazy cleanup chạy cạnh tranh    | Chỉ hoàn một lần, stock không tăng vượt baseline                        |
| INV-11 | Payment SUCCESS trước hạn                           | Order PAID; **không** hoàn ingredients                                  |
| INV-12 | Payment SUCCESS lặp / duplicate verified IPN        | Không double loyalty/coupon/ingredient mutation                         |
| INV-13 | Đơn có coupon HELD, khi CANCELLED                   | Coupon release và ingredient release atomic                             |
| INV-14 | Mixed legacy Order chưa có reservation              | Áp dụng policy migration; không tự hoàn ingredient giả                  |
| INV-15 | Product catalog/Cart API với stock/availability     | Không UI báo còn hàng sai theo stock legacy                             |

## 3. Concurrency (phải chạy PostgreSQL thực, không chỉ mocks)

| ID     | Kịch bản                                                                                          | Expected result                                                                             |
| ------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| CON-01 | Stock ingredient=2 units; User A order item X dùng 2, User B item Y dùng 1; X≠Y, share ingredient | Một thành công; request còn lại 409. Ingredient không âm                                    |
| CON-02 | Hai user order cùng product cùng lúc                                                              | Không oversell, 409 đúng                                                                    |
| CON-03 | Một user gửi 2 Create Order đồng thời                                                             | Tối đa 1 active Order/user                                                                  |
| CON-04 | Multi-ingredient order thiếu ingredient cuối                                                      | Không giữ các ingredient đầu sau rollback                                                   |
| CON-05 | Create Order đồng thời expiration/coupon release                                                  | Không deadlock vô hạn; state/stock/coupon nhất quán                                         |
| CON-06 | Expiration đồng thời IPN verified SUCCESS trong Grace                                             | Chỉ một terminal business outcome hợp lệ theo luật Payment; không hoàn ingredients nếu PAID |
| CON-07 | Retry/duplicate IPN sau Order PAID                                                                | Không thay ingredients, points hoặc coupon lần nữa                                          |
| CON-08 | Re-run cùng kịch bản 20–50 lần (theo resource)                                                    | Zero invariant failure; report deadlocks/timeouts và retry behavior                         |

**SQL invariants minh họa** (phải đối chiếu tên table/column thực tế trước khi chạy):

```sql
-- Không âm tồn kho
SELECT id, stock_quantity FROM ingredients WHERE stock_quantity < 0;
-- Expected: 0 rows

-- Một reservation aggregate trên mỗi order/ingredient
SELECT order_id, ingredient_id, COUNT(*)
FROM order_ingredient_reservations
GROUP BY order_id, ingredient_id HAVING COUNT(*) > 1;
-- Expected: 0 rows

-- Đối chiếu Order + Payment cho một đơn demo (bảng hiện hữu)
SELECT o.id, o.status AS order_status, o.total_vnd,
       p.provider, p.status AS payment_status, p.amount_vnd
FROM orders o LEFT JOIN payments p ON p.order_id = o.id
WHERE o.id = '<ORDER_UUID>';
```

## 4. Regression các tính năng hiện tại

| ID     | Hạng mục                           | Test cần giữ                                                                                 |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| REG-01 | Register/Login/JWT                 | 201, 409 email duplicate, 401 invalid, `/auth/me` 200/401                                    |
| REG-02 | Catalog/Cart/Price                 | List/detail, size/topping validation; amounts không bị thay đổi ngoài scope                  |
| REG-03 | Create Order                       | 201, validation 400, thiếu hàng 409, pending Order conflict                                  |
| REG-04 | Order History                      | JWT ownership, sorted `createdAt DESC,id DESC`, pagination, snapshots, `payment`             |
| REG-05 | Coupon/Loyalty                     | Hold/consume/release đúng trạng thái, no double effects                                      |
| REG-06 | Mock/ZERO_AMOUNT (nếu bật ở local) | Legacy response/idempotency/amount=0 giữ nguyên                                              |
| REG-07 | VNPay initiate                     | JWT/ownership, amount from DB, no duplicate pending, signed paymentUrl path không đổi        |
| REG-08 | VNPay IPN signed fixtures          | Valid/invalid signature, wrong amount, merchant, duplicate event, late/timeout rules         |
| REG-09 | Reconciliation/Grace               | No unverified FAILED, pending grace, cancelled then late financial outcome được ghi ngoại lệ |
| REG-10 | Docker/CI                          | Migrate fresh & existing DB, API/Web tests/build, image startup, Health Check                |

## 5. VNPay E2E: giới hạn do không đổi IPN

**Đã chốt:** Merchant VNPay Sandbox IPN hiện tiếp tục trỏ A2 Production; không đổi URL, không dùng ngrok để thay nó, không đổi secrets.

**Hệ quả:** Khi A2 Local đặt Order và redirect sang cùng merchant, callback thật có thể tới **Production** thay vì A2 Local. Do đó **KHÔNG** dùng một giao dịch Local VNPay như bằng chứng Local end-to-end và KHÔNG tạo hai Order/môi trường cùng một txnRef hay merchant config để hy vọng tự khớp.

### Thay thế trước release

- Unit tests của signer và parser/validator VNPay với ký thật từ test secret.
- Integration tests gọi trực tiếp local IPN endpoint bằng fixture đã ký hợp lệ (không dùng 'hash_test'); kiểm tra 200 body và dữ liệu Order/Payment.
- Duplicate IPN, wrong hash/merchant/amount, status conflict, grace, QueryDR mock/stub có xác minh response.
- Local Payment flow regression (tạo Order mới, PENDING, trạng thái sau signed fixtures) không đổi behavior.

### Bắt buộc sau release (Production smoke, sandbox thực)

- Dùng **A2 Vercel + Render Production**, IPN URL hiện tại giữ nguyên.
- Một Order mới có ingredient reservations, thanh toán Sandbox qua VNPay; xác minh Payment SUCCESS, Order PAID bằng `GET /orders/me` và direct DB read-only nếu đủ quyền.
- Đối chiếu Ingredient remaining stock; không release khi paid, không double effect trong callback.
- Test idempotency/replay bằng fixtures và test DB có kiểm soát, không replay live gateway tùy tiện.

**Residual risk:** Giữ nguyên IPN đồng nghĩa không có bằng chứng VNPay callback thật vào Local trước release, dù signed integration tests PASS. Nếu policy dự án yêu cầu live gateway E2E trước Production, không thể đồng thời đạt điều đó và giữ nguyên một IPN Production; cần môi trường độc lập hoặc hoãn GO. Leader ghi chấp nhận/không chấp nhận rủi ro này.

## 6. Migration gates

- [ ] `prisma migrate deploy` PASS trên DB sạch mới.
- [ ] PASS trên bản sao DB cũ, giữ Order/Payment/Coupon/Loyalty, không mất dữ liệu.
- [ ] Bảo đảm recipe đầy đủ, unit integer consistent, constraints/index thực sự được apply.
- [ ] Kiểm tra old active Orders và chính sách migration.
- [ ] Backup và restore rehearsal thành công trên DB riêng.
- [ ] Nếu rollback code, schema mới không phá code baseline. Nếu không bảo đảm, release bị BLOCK.
- [ ] Không seed/clean data Production. Không in connection string/secret trong log hoặc ảnh.

## 7. Release gates và GO/NO-GO

### Hard blockers — bất kỳ FAIL nào cũng NO-GO

1. Migration/restore chưa kiểm chứng hoặc schema làm hỏng bản cũ.
2. Incomplete recipe/units cho sản phẩm trong phạm vi demo.
3. Negative stock, oversell, partial reserve hoặc double release dù chỉ một lần.
4. Create Order/TTL/Grace/Payment state/coupon/loyalty regression.
5. VNPay signed-IPN integration không PASS, Payment idempotency/invariants không PASS.
6. GET `/orders/me`, Auth hoặc Product API/UI bị phá tương thích.
7. Không có thời gian/khả năng kiểm tra Production smoke ngay sau release hoặc không có phương án incident rollback.
8. `dev` → `main` diff có thay đổi ngoài scope, PR review chưa đầy đủ hoặc CI không PASS.

### Evidence khi tạo PR release

- Commit SHA + GitHub Checks; `git diff --stat origin/main..origin/dev` + review affected paths.
- Automated test report có case ID, logs, DB assertions, run environment.
- Migration status, backup/restore rehearsal và old-order compatibility plan.
- Risk register, giới hạn chưa test, quyết định GO do Khang, review Hoàng.
- Render Auto-Deploy event & commit matching sau merge, Backend health/smoke.
- VNPay Sandbox Production smoke sau deploy và SQL/GET orders/me evidence.

### Phương án khi triển khai gặp sự cố

- Dừng các hành động gây thêm dữ liệu sai theo runbook đã chuẩn bị. Không vội rollback code nếu schema bất tương thích.
- Xác minh transaction/Payment hiện tại trước khi hủy/retry; không tự đánh dấu VNPay FAILED.
- Khi có thể, deploy lại baseline compatible code; khôi phục database chỉ với backup đã xác minh và quy trình dữ liệu phát sinh kể từ backup. **Không khôi phục DB cũ mù quáng làm mất Order/Payment mới.**
- Ghi incident evidence rồi quyết định rollback/fix forward.

## 8. Final signoff

| Role             | Kiểm tra                                     | Kết luận |
| ---------------- | -------------------------------------------- | -------- |
| Hoàng            | Schema, inventory, concurrency, tests        | PENDING  |
| Khang            | Scope, regressions, VNPay, migration/release | PENDING  |
| CI               | API/Web required checks                      | PENDING  |
| Local/Staging    | Acceptance gates                             | PENDING  |
| Production smoke | After deploy (conditional)                   | PENDING  |

**Chỉ đánh dấu PASS bằng kết quả đã chạy; không chuyển từ “đã thiết kế” sang “đã chứng minh” bằng suy đoán.**
