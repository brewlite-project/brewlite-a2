# SCRUM-105 đối chiếu sau review vòng 1

Ngày thực hiện: **09/11/2026**. Phạm vi: xử lý DC-03, DC-04, DC-05 và kiểm chứng PDF/LaTeX của [PR #5](https://github.com/brewlite-project/brewlite-a2/pull/5). Đây là bằng chứng chuẩn bị để reviewer xem lại; không phải approval, merge hoặc Jira Done.

## 1. Snapshot và trạng thái nguồn

Đã `git fetch origin` trước khi đối chiếu. Không pull, merge hoặc rebase branch SCRUM-105. Đọc các tài liệu mới qua Git object và dùng permalink để việc truy vết không phụ thuộc branch task đã tích hợp `dev` hay chưa.

| Nguồn | Phiên bản/commit | Trạng thái ghi nhận |
| --- | --- | --- |
| `origin/dev` sau fetch | `2c432159ec8eb47ea315c3af25c1739d0f04dd4d` | Snapshot tích hợp dùng cho lần đối chiếu này. |
| [SRS A2](https://github.com/brewlite-project/brewlite-a2/blob/50ef4be8beff005321ee6b44aa9e83d9d5202ee2/docs/requirements/srs.md) | SCRUM-102; commit sửa file gần nhất `50ef4be8beff005321ee6b44aa9e83d9d5202ee2` | Có trong `dev` qua PR #7, merge `a5d2b50`. Header vẫn ghi DRAFT/chờ xác nhận gap; giữ nguyên mức MUST/SHOULD/MUST* của nguồn. |
| [Checkout UC A2](https://github.com/brewlite-project/brewlite-a2/blob/ac08a3a608ad7f2cbc5ea34642aa26130a164bdc/docs/requirements/A2_T1.3_Checkout_Use_Case_Specification.md) | Bản 0.4; SCRUM-100; commit `ac08a3a608ad7f2cbc5ea34642aa26130a164bdc` | Đã có mapping R-02 và static verification R-03, có trong `dev` qua PR #3, merge `f5b67a5`. UC ghi riêng các giới hạn runtime/E2E. |
| [API Contract v4.0](https://github.com/brewlite-project/brewlite-a2/blob/1951dc124c83359556f04adb6ba3f0ee9f22fce4/docs/api/BrewLite_API_Contract_v4.0.md) | Cùng nội dung A1-final tại snapshot `dev` trên | Header NOT APPROVED/Review 3; mở đầu và §14 ghi xác nhận design/input theo Leader. Chưa coi toàn bộ contract hoặc implementation đã được duyệt. |
| [Implementation A1-final](https://github.com/brewlite-project/brewlite-a2/tree/1951dc124c83359556f04adb6ba3f0ee9f22fce4/backend) | `1951dc124c83359556f04adb6ba3f0ee9f22fce4` | `git diff A1-final origin/dev -- backend frontend database` không có thay đổi tại lần đối chiếu này. Đây là kiểm tra tĩnh, không phải test runtime. |

**DC-03 — đã cập nhật cách ghi trạng thái:** việc PR nguồn đã merge và người dùng thông báo các task khác đã Done cho phép tiếp tục đối chiếu; không xóa cảnh báo hoặc tự sửa nhãn approval của nguồn. Mâu thuẫn Document Control bên trong v4.0 vẫn được giữ như giới hạn của tài liệu nguồn, không bị ghi thành một quyết định mới của SCRUM-105.

## 2. DC-04 xác nhận quy tắc retry

**Xác nhận nhận trong phiên làm việc ngày 09/11/2026**, khi hỏi owner Order/Payment đã chốt trạng thái Order lúc retry VNPay:

> Giữ Order PAYMENT_FAILED khi Payment mới PENDING

Nguồn xác nhận là câu trả lời của người dùng trong phiên làm việc này; chưa có link comment/sign-off riêng của owner trên PR #5. Không gán tên người phê duyệt hoặc dựng bằng chứng review ngoài nội dung đã nhận.

| Thời điểm / điều kiện | Order | Payment attempt mới | Tài nguyên |
| --- | --- | --- | --- |
| Retry VNPay hợp lệ từ Order PAYMENT_FAILED | Giữ PAYMENT_FAILED | PENDING | Dùng lại Order/stock/coupon đang giữ; không gia hạn expiresAt. |
| Attempt đó được chấp nhận SUCCESS | PAID | SUCCESS | Coupon CONSUMED, cộng điểm một lần; không trừ stock lần hai. |
| Attempt đó FAILED cuối cùng khi Order còn hạn | PAYMENT_FAILED | FAILED | Giữ tài nguyên để retry tiếp nếu đủ guards. |

Xác nhận trên chỉ giải quyết trường hợp **retry VNPay từ Order PAYMENT_FAILED**. Không ép các Order khởi tạo lần đầu sang PAYMENT_FAILED; không thay chính sách Mock, ZERO_AMOUNT, expiry/Grace hoặc finalization.

Bằng chứng source tại A1-final và `dev` đối chiếu:

- [VnpayInitiationService](https://github.com/brewlite-project/brewlite-a2/blob/1951dc124c83359556f04adb6ba3f0ee9f22fce4/backend/src/payments/vnpay-initiation.service.ts#L14) chấp nhận Order PENDING/PAYMENT_FAILED; đoạn [tạo Payment](https://github.com/brewlite-project/brewlite-a2/blob/1951dc124c83359556f04adb6ba3f0ee9f22fce4/backend/src/payments/vnpay-initiation.service.ts#L94) đặt Payment.status=PENDING và không cập nhật Order.status.
- [PaymentFinalizationService](https://github.com/brewlite-project/brewlite-a2/blob/1951dc124c83359556f04adb6ba3f0ee9f22fce4/backend/src/payments/payment-finalization.service.ts#L475) xử lý FAILED; [nhánh thành công](https://github.com/brewlite-project/brewlite-a2/blob/1951dc124c83359556f04adb6ba3f0ee9f22fce4/backend/src/payments/payment-finalization.service.ts#L630) cập nhật Order PAID.
- Requirements v3.1 FR-ORD-003 còn mô tả PAYMENT_FAILED→PENDING. SRS A2 FR-21/FR-40 và Checkout UC 0.4 AF-05/BR-C04 mô tả guards retry, không bắt buộc ghi một transition Order về PENDING trong bước initiate. Dùng xác nhận ngày 09/11 ở trên để chốt cách thể hiện của SCRUM-105; không âm thầm sửa đặc tả A1.

**Kết quả DC-04:** cập nhật chú thích trong nguồn, SVG/PDF, Draw.io và caption LaTeX; giữ nguyên class, enum, multiplicity và backend. Owner tài liệu Requirements cần đồng bộ câu mô tả cũ theo quy trình của task nguồn. Reviewer PR #5 xác nhận bằng chứng này trước khi approve; không coi đó là một approval do agent thực hiện.

## 3. DC-05 mapping FR/NFR với Checkout đã merge

Các ID dưới đây đọc từ SRS tại commit cố định trong §1; không tạo ID mới. FR/AC nằm ở SRS §4–5; NFR/AC ở §6–7. UC được dùng là bản 0.4 tại commit cố định trong §1, đặc biệt §8.1 và §8.3. Mapping chỉ chứng minh các khái niệm và ràng buộc mô hình có nguồn; không xác nhận AC PASS.

| Nhóm domain | FR A2 | NFR A2 | Điểm trong Checkout UC 0.4 | Kết quả đối chiếu |
| --- | --- | --- | --- | --- |
| User và ownership | FR-03, FR-05, FR-06, FR-07 | NFR-01, NFR-02, NFR-05, NFR-09 | P1/P3; Steps 1–4; EF-01/02 | Order thuộc 1 User; JWT/owner là invariant server, không thêm client userId hoặc actor/class mới. |
| Product, giá và snapshot OrderItem | FR-10, FR-11, FR-18, FR-19, FR-20 | NFR-11, NFR-12, NFR-17, NFR-29 | Steps 2–6; EF-03/04 | Catalog hiện tại tách snapshot đơn; MoneyVnd nguyên, half-up cho size, topping/qty chốt theo Order. |
| Order lifecycle và active Order | FR-21, FR-24, FR-25 | NFR-10, NFR-13, NFR-18 | AF-07/08/09; EF-05/08; BR-C02/03 | 7 OrderStatus giữ nguyên; một User có nhiều Order lịch sử nhưng tối đa 1 active; không thêm GRACE thành enum. |
| Product stock và release | FR-26, FR-27, FR-28 | NFR-10, NFR-13, NFR-15 | Steps 4–6; AF-05/08/09; EF-04/13/15 | Stock trên Product; reserve khi tạo Order, release khi CANCELLED; retry không giữ thêm; không thêm InventoryMovement SHOULD thành class đã triển khai. |
| Payment attempts, retry và idempotency | FR-30, FR-32, FR-33, FR-36, FR-40 | NFR-15, NFR-45, NFR-46 | Steps 7–8; AF-05/10; EF-06/07/13 | Order 1—0..* Payment; tối đa một SUCCESS và một VNPay PENDING; giữ terminal; chú thích retry theo §2. |
| Gateway evidence và finalization | FR-25, FR-31, FR-37, FR-38, FR-39 | NFR-02, NFR-10, NFR-16, NFR-18, NFR-43, NFR-47, NFR-48 | Steps 9–11; AF-06–09; EF-10–14; BR-C10 | PaymentGatewayEvent tách outcome/disposition khỏi PaymentStatus; reconciliation là trục riêng; late SUCCESS không hồi sinh Order. |
| Promotion / CouponRedemption | FR-42, FR-44, FR-46 | NFR-10, NFR-12, NFR-13, NFR-15 | Steps 5–6/10; AF-01/02/05/08/09 | Promotion ánh xạ Coupon; Order có 0..1 redemption; HELD→CONSUMED/RELEASED, quota không bị dùng lặp. |
| LoyaltyTransaction suy ra | FR-45, FR-47 | NFR-10, NFR-12, NFR-15 | Step 10; postcondition PAID; EF-12/13 | Điểm floor(totalVnd/10000) khi thanh toán hợp lệ; ánh xạ Order.pointsEarned/paidAt, không thêm ledger. |
| ZERO_AMOUNT | FR-41 | NFR-10, NFR-15, NFR-48 | AF-03; EF-09 | Provider riêng, total=0, SUCCESS/PAID, 0 điểm; không thêm gateway event bắt buộc. |
| Mock non-production | FR-35 | NFR-49 | AF-04; EF-07 | Provider MOCK và method CARD/WALLET tách riêng; không thay provider VNPay bằng Mock khi uncertain. |
| History và presentation | FR-22, FR-34 | NFR-11, NFR-25, NFR-26, NFR-27 | Step 11; §8.2/8.3 | Snapshot và hai trục status độc lập; không nhầm resolution với enum hoặc suy ra Payment Status route đã được triển khai. |

Đối chiếu AC tiêu biểu: FR-19/20 ↔ AC-A2-019/020; FR-33/40 ↔ AC-A2-033/040; FR-42/44/45/46 ↔ AC-A2-042/044/045/046; NFR-10/11/12/15/45 ↔ AC-A2-058/059/060/063/093. Đây là các AC của SRS nguồn, không phải test mới của SCRUM-105.

**Kết quả DC-05:** hoàn tất đối chiếu tài liệu nguồn đã merge; thay trạng thái “chưa có đầu vào Task 1” của bản đầu. Không cần thay class, thuộc tính hoặc multiplicity. Những gap runtime được SRS/UC giữ mở (Payment Status route, QueryDR Sandbox E2E) không được đóng bởi sơ đồ domain.

## 4. PDF và LaTeX

Nguồn fixture: [domain-class-check.tex](../report/domain-class-check.tex). Fixture A4 sử dụng đúng [domain-class-figure.tex](domain-class-figure.tex), có text tiếng Việt, caption và tham chiếu hai hình; compile từ repo root hoặc từ `docs/report/`.

Đã chạy thực tế với **Tectonic 0.15.0**, XeTeX/LaTeX trong bundle của Tectonic, font TeX Gyre Termes được chọn theo tên file. Generator domain được chạy với Python 3.12 và ReportLab 4.4.9. Các tool/cache nằm ngoài bộ tài liệu bàn giao, không commit binary hoặc gói cài đặt.

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| Compile từ root repo | Exit 0; xuất [domain-class-check.pdf](../report/assets/domain-class-check.pdf), 3 trang A4. |
| Compile từ `docs/report/` | Exit 0; xuất bản kiểm tra vào thư mục tạm, text của từng trang giống bản compile từ root. |
| TeX log cuối của cả hai đường dẫn | Không có Overfull/Underfull box, undefined reference, Missing character hoặc LaTeX/fontspec error. |
| Kiểm tra PDF | Một trang giới thiệu/giới hạn và hai trang landscape; caption, số hình và hai tham chiếu được giải quyết. PDF chứa text, font và hình vector. |
| Render và xem trực quan | Đã render đủ 3 trang thành PNG 144 dpi và xem từng trang; không cắt chữ, đè caption hoặc thiếu dấu tiếng Việt. |
| Cỡ chữ trong hình sau khi ghép A4 | Thuộc tính/enum chính khoảng 7.26 pt ở hình domain và 7.45 pt ở hình types; dùng trang riêng landscape, không ghép hai hình vào một trang. Stereotype/chú giải nhỏ hơn nội dung chính. |
| Tối ưu sau khi xem bản render đầu | Rút gọn caption, tăng giới hạn chiều cao hình từ 0.83 lên 0.94 của vùng text, giảm khoảng trắng trang enum. Không đổi enum hoặc quan hệ nghiệp vụ. |

Lệnh tái tạo với Tectonic đã cài trên PATH:

```powershell
# Từ root repository
python docs/diagrams/render_domain.py
tectonic --keep-logs --outdir docs/report/assets docs/report/domain-class-check.tex
```

```powershell
# Hoặc từ docs/report/
tectonic --keep-logs --outdir assets domain-class-check.tex
```

Fixture này phục vụ review phần tích hợp SCRUM-105; không phải báo cáo A2 hoàn chỉnh theo template cuối của nhóm. Template khác lề/font có thể làm hình nhỏ hơn; cần kiểm tra lại sau khi ghép báo cáo cuối. Nếu cần in lớn, dùng PDF sơ đồ A3 gốc.

## 5. Kiểm tra phạm vi và bàn giao review

- Đủ 7 class bắt buộc; giữ nguyên 9 class ở hình chính, ToppingSnapshot bổ trợ và 10 quan hệ/multiplicity. Chỉ thêm chú thích retry và chỉnh layout trang types.
- 12 enum đối chiếu đúng tên/value/thứ tự trong Prisma; các ID FR/NFR/AC trong §3 tồn tại ở SRS commit cố định.
- Parse Draw.io/SVG, kiểm tra source/target của edges, link nội bộ và permalink tới Git object nguồn. Generator tái tạo cùng byte trong môi trường ReportLab nêu trên.
- Kiểm tra text của PDF domain 2 trang và PDF tích hợp 3 trang nằm trong trang; đã xem các trang render cuối.
- Chỉ thay tài liệu, nguồn hình, generator và fixture của SCRUM-105. Không sửa ứng dụng, Prisma, migration, SRS/UC nguồn, API Contract hoặc task khác.
- Backend/frontend build, unit/integration/E2E không chạy lại vì không có thay đổi ứng dụng. Không dùng compile LaTeX để tuyên bố behavior runtime hoặc Sandbox đã PASS.

**Bàn giao:** nội dung follow-up sẵn sàng để reviewer PR #5 kiểm tra lại DC-03/DC-04/DC-05 và bằng chứng PDF/LaTeX. Chưa commit/push phần follow-up, chưa comment/approve/merge PR và chưa đánh dấu Jira Done. Xác nhận retry ở §2 cần được đưa vào nội dung PR khi nhóm cập nhật bằng chứng review; việc agent ghi nhận trong tài liệu không thay thế approval của reviewer.
