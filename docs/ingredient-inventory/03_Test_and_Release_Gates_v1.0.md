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
| INV-16 | D-06: tạo Order nhiều line dùng chung ingredient    | Snapshot aggregate immutable; đúng một row `(order_id, ingredient_id)` và quantity bằng demand đã trừ |
| INV-17 | D-06: scheduler/lazy expiration/concurrent cancel   | Chỉ một transition/release hợp lệ; restore exact snapshot đúng một lần  |
| INV-18 | D-06: PAID Order gặp scheduler, retry, IPN/QueryDR  | Không release ingredient hoặc coupon của PAID Order                     |
| INV-19 | D-06: snapshot thiếu row hoặc Ingredient reference bị thiếu khi applicable | Abort transaction; không coi là zero demand, không tạo synthetic snapshot |
| INV-20 | D-06: `quantity_reserved` bị sửa hoặc integrity evidence không khớp snapshot | Abort transaction và phát operational alert/repair workflow; không tự tính recipe hiện tại |
| INV-21 | D-06: lỗi sau một hay nhiều ingredient increment trong release | Rollback giữ nguyên Order status, coupon state, stock và `released_at` |
| INV-22 | D-06: legacy Order không có reservation             | Không đi vào ingredient release path và không nhận synthetic reservation |

### 2.1 Cutover / legacy-drain evidence — D-05/D-08

`CUT-01`…`CUT-07` là test/evidence case IDs, tách biệt với Jira labels và các namespace `INV-*`, `CON-*`, `API-*`, `REG-*`. Mọi case dưới đây đều **PENDING / NOT EXECUTED** cho đến khi có evidence thực tế.

| ID | Decision trace | Ca kiểm thử / evidence | Expected outcome | Required evidence / verification | Execution status |
| --- | --- | --- | --- | --- | --- |
| CUT-01 | D-05, D-08 | Backend maintenance gate chặn normal `POST /orders`; controlled authorized test access được govern riêng | Normal customer Order creation bị block, không dựa Frontend; test-only access chỉ hoạt động theo procedure được authorized | Backend config/runbook, request logs, authorization record và owner review | PENDING / NOT EXECUTED |
| CUT-02 | D-05, D-08 | Drain in-flight Create Order; kiểm tra không overlap legacy `Product.stock` write với ingredient stock write | Mọi request cũ commit hoặc rollback trước switch; không simultaneous legacy/new inventory writes | DB transaction/request evidence, cutover timestamps và reconciliation query | PENDING / NOT EXECUTED |
| CUT-03 | D-05 | Block payment initiation mới cho legacy unpaid Order trong drain; replay valid IPN/QueryDR/finalization | Initiation mới bị block; valid IPN, QueryDR và finalization tiếp tục xử lý theo Payment safeguards hiện hữu | API/log evidence, signed fixture/replay result và Order/Payment DB assertions | PENDING / NOT EXECUTED |
| CUT-04 | D-05 | Reconcile legacy Order có potential stock-release obligation | Mọi obligation được resolve; không tạo synthetic ingredient reservation cho legacy Order | DB query/report về Order, OrderItem, Payment và reservation; owner reconciliation sign-off | PENDING / NOT EXECUTED |
| CUT-05 | D-05 | Reconcile uncertain VNPay/payment outcome trước cutover | Không suy diễn finality chỉ từ TTL 15 phút hoặc Grace 5 phút; không cutover khi outcome còn unknown | Payment/QueryDR/IPN reconciliation evidence và owner review | PENDING / NOT EXECUTED |
| CUT-06 | D-05, D-08 | Ghi database/payment reconciliation evidence và owner sign-off | Unknown state, missing evidence hoặc failed drain là **NO-GO** | Signed release checklist, DB/payment evidence bundle và GO/NO-GO decision | PENDING / NOT EXECUTED |
| CUT-07 | D-05, D-08 | Recovery exercise hoặc verified recovery procedure sau ingredient-backed Order | Bảo toàn financial/ingredient data; không blind rollback về `Product.stock` | Recovery runbook, rehearsal/restore evidence, data-integrity review và owner sign-off | PENDING / NOT EXECUTED |

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
| CON-09 | D-07: Cart A/B có cùng ingredients nhưng input/line order đảo ngược                               | Ingredient rows được update theo cùng ascending `ingredient_id`; không deadlock do cart order |
| CON-10 | D-07: Payment/Order/Coupon race đồng thời expire/cancel/finalize                                   | Theo lock contract; không double coupon/inventory effect hoặc terminal state giả             |
| CON-11 | D-07: conditional ingredient update trả `affectedRows = 0`                                        | Phân biệt valid-but-insufficient → 409 `INSUFFICIENT_STOCK` với missing/inactive/corrupt config; không TOCTOU |
| CON-12 | D-07: deadlock, serialization failure hoặc lock timeout retryable                                  | Chỉ retry whole aborted transaction theo policy; không fake Payment FAILED/Order CANCELLED    |
| CON-13 | D-07: retry exhaustion hoặc uncertain commit outcome                                               | Không map thành `INSUFFICIENT_STOCK`; không blind retry uncertain commit                       |
| CON-14 | D-07: quantity multiplication/aggregation vượt bound hoặc underflow                               | Reject trước write; không overflow/negative stock và rollback toàn bộ                         |
| CON-15 | D-07: fault injection sau một phần conditional ingredient update                                  | Transaction rollback, không partial reserve/coupon/snapshot                                  |

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

### 3.1 API availability và error compatibility

| ID | Ca kiểm thử | Expected result |
| --- | --- | --- |
| API-01 | D-03: Product có ít nhất một size feasible | `Product.isAvailable=true` khi Category active và ít nhất một supported size có base recipe feasible |
| API-02 | D-03: size S feasible, size L không feasible | Detail trả `sizes[].isAvailable` đúng theo exact Product/Size recipe; S selectable, L disabled |
| API-03 | D-03: Product `ONE_SIZE` | Chỉ trả `ONE_SIZE` với availability tính từ recipe ONE_SIZE |
| API-04 | D-03: topping eligible nhưng thiếu ingredient | Topping vẫn được trả về, `toppings[].isAvailable=false`, Frontend disable; base Product/size không bị unavailable vì topping optional |
| API-05 | D-03: topping ineligible hoặc business-inactive | Không xuất hiện trong response topping eligible theo ProductTopping/business rule |
| API-06 | D-03: Frontend API mapping/Cart | Giữ fields availability mới, không fallback `Product.stock`, default size feasible đầu tiên và không add selection unavailable |
| API-07 | D-03: GET availability stale trước POST `/orders` | GET chỉ là UI hint; POST tự validate/aggregate/reserve atomically và có thể reject selection không còn feasible |
| API-08 | D-04: valid ingredient thiếu stock khi Create Order | HTTP 409 `INSUFFICIENT_STOCK`, giữ error envelope hiện hữu; không partial Order/ingredient/coupon/snapshot |
| API-09 | D-04: missing/invalid recipe | Reject theo validation/integrity rule, không báo sai `INSUFFICIENT_STOCK` |
| API-10 | D-04: missing/inactive ingredient | Reject distinct với actual stock shortage; không tạo public code mới nếu chưa approved |
| API-11 | D-04: lock timeout/deadlock/retry exhaustion | Không map thành `INSUFFICIENT_STOCK`; không fake business/payment/order terminal state |
| API-12 | D-04: insufficient stock sau demand aggregate nhiều item/topping | Rollback toàn bộ; không partial Order, ingredient reserve, coupon reservation hoặc reservation snapshot |

`API-01`…`API-12` là test case IDs, không phải Jira labels. Các case D-06 snapshot-integrity giả định một persistence mechanism được SCRUM-121/123 đề xuất và review; row-count/unique constraint một mình không chứng minh snapshot integrity.

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

**Approved policy / operational state:** Không đổi Merchant VNPay Sandbox IPN URL, signing, callback semantics hoặc secrets trong scope này. Current IPN URL/target là **NOT VERIFIED** từ repository review; SCRUM-129/130 phải xác minh và ghi evidence trước controlled cutover/E2E.

**Hệ quả khi callback target đã xác minh không về Local:** Một giao dịch Local không phải bằng chứng Local end-to-end. Không tạo hai Order/môi trường cùng một `txnRef` hay merchant configuration để hy vọng tự khớp; dùng signed fixtures/integration tests và xác minh callback target trước real E2E.

### Thay thế trước release

- Unit tests của signer và parser/validator VNPay với ký thật từ test secret.
- Integration tests gọi trực tiếp local IPN endpoint bằng fixture đã ký hợp lệ (không dùng 'hash_test'); kiểm tra 200 body và dữ liệu Order/Payment.
- Duplicate IPN, wrong hash/merchant/amount, status conflict, grace, QueryDR mock/stub có xác minh response.
- Local Payment flow regression (tạo Order mới, PENDING, trạng thái sau signed fixtures) không đổi behavior.

### Bắt buộc post-deploy trước reopening normal traffic (Production smoke, sandbox thực)

- Trong controlled state, Backend maintenance gate vẫn block normal customer Order creation. Controlled E2E chỉ dùng secure test-only Order creation procedure đã authorized hoặc cơ chế tương đương đã verified; tài liệu này không xác nhận mechanism đó đã tồn tại.
- Dùng deployment target đã được SCRUM-129/130 xác minh, giữ merchant IPN URL/signing đã xác minh không đổi; một Order ingredient-backed được phép theo controlled procedure mới được thanh toán Sandbox qua VNPay.
- Xác minh ingredient reserve, Payment SUCCESS, Order PAID bằng `GET /orders/me` và DB read-only nếu đủ quyền; đối chiếu reservation/remaining stock, không release khi PAID và không double effect trong callback.
- Test idempotency/replay bằng fixtures và test DB có kiểm soát, không replay live gateway tùy tiện. Nếu smoke/E2E fail, không thể run hoặc thiếu evidence thì **NO-GO** cho reopening normal traffic; giữ maintenance/controlled state và dùng safe recovery plan, không blind rollback về `Product.stock` sau ingredient-backed Orders.

**Residual risk:** Giữ nguyên IPN đồng nghĩa không có bằng chứng VNPay callback thật vào Local trước release, kể cả khi signed integration tests sau này được thực thi và PASS. Nếu policy dự án yêu cầu live gateway E2E trước Production, không thể đồng thời đạt điều đó và giữ nguyên một IPN Production; cần môi trường độc lập hoặc hoãn GO. Leader ghi chấp nhận/không chấp nhận rủi ro này.

**D-08 boundary:** Pre-release real VNPay Sandbox E2E chỉ có thể ghi `NOT EXECUTED — accepted residual risk` cho controlled deployment nếu không thể chạy mà không thay đổi live IPN configuration. Điều đó không waive post-deploy real VNPay Sandbox E2E bắt buộc trước reopening normal traffic.

## 6. Migration gates

- [ ] `prisma migrate deploy` PASS trên DB sạch mới.
- [ ] PASS trên bản sao DB cũ, giữ Order/Payment/Coupon/Loyalty, không mất dữ liệu.
- [ ] Bảo đảm recipe đầy đủ, unit integer consistent, constraints/index thực sự được apply.
- [ ] Kiểm tra old active Orders và chính sách migration.
- [ ] Backup và restore rehearsal thành công trên DB riêng.
- [ ] Persistence mechanism snapshot-integrity do SCRUM-121/123 đề xuất/review đã được validate: missing row/reference, modified `quantity_reserved`, integrity-evidence mismatch và partial-release failure đều rollback an toàn, có operational alert/repair workflow.
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
9. Không có Backend maintenance gate/in-flight drain evidence, legacy reconciliation evidence, authorized controlled E2E procedure hoặc post-deploy VNPay Sandbox E2E evidence trước reopening normal traffic.

### Evidence khi tạo PR release

- Commit SHA + GitHub Checks; `git diff --stat origin/main..origin/dev` + review affected paths.
- Automated test report có case ID, logs, DB assertions, run environment.
- Migration status, backup/restore rehearsal và old-order compatibility plan.
- Risk register, giới hạn chưa test, quyết định GO do Khang, review Hoàng.
- Deployment-provider event, deployed commit mapping và Backend health/smoke; nếu SCRUM-129 xác minh provider là Render thì có thể đính kèm Render-specific event làm evidence.
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
