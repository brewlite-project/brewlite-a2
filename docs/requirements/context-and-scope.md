# Bối cảnh, stakeholder và phạm vi hệ thống BrewLite

**Task:** SCRUM-99 / A2-T1.1

**Trạng thái:** DRAFT — chờ review; chưa phải biên bản nghiệm thu

**Ngày soạn:** 08/11/2026

**Baseline nghiệp vụ:** A1-final — 1951dc124c83359556f04adb6ba3f0ee9f22fce4

**Repository đích:** brewlite-project/brewlite-a2; PR base: dev

## 1. Nguồn kế thừa và nguyên tắc sử dụng

Tài liệu chuẩn hóa bối cảnh, stakeholder, mục tiêu và phạm vi cho Assignment 2 Task 1.1. Nội dung kế thừa Requirements Specification v3.1 và baseline A1-final; không thay thế toàn bộ SRS, không bổ sung nghiệp vụ, API hoặc quyền người dùng.

Requirements v3.1 có business baseline BR-01–BR-06 đã được duyệt, trong khi bản đặc tả ghi trạng thái chờ review. A2 Gap Analysis là bản draft. Việc một yêu cầu nằm trong phạm vi không chứng minh chức năng đó đã triển khai hoặc được nghiệm thu.

Các nguồn dùng trong tài liệu: [S1] Requirements v3.1, mục 3–6, 9.9 và 16; [S2] A2 Gap Analysis, mục 0–1 và 6–7; [S3] README A1 kế thừa trong repo A2, mục 1 và 4; [S4] A2 Implementation Plan. S4 chỉ cung cấp bối cảnh bàn giao, không được dùng để mở rộng baseline nghiệp vụ.

## 2. Bối cảnh và vấn đề

BrewLite là ứng dụng web đặt cà phê và đồ uống theo mô hình một cửa hàng (Single-Vendor), phục vụ Guest và Customer. Luồng giá trị chính là xem menu, chọn size/topping, quản lý giỏ hàng, đăng nhập, tạo đơn, thanh toán và xem xác nhận/trạng thái/lịch sử đơn.

Bài toán là duy trì thông tin món, cấu hình, giá và kết quả đơn nhất quán xuyên suốt luồng đặt hàng. Giỏ hàng có thể cũ so với dữ liệu cửa hàng; nhiều khách có thể cùng đặt món cuối; request hoặc thông báo thanh toán có thể được gửi lặp hay đến trễ. Hệ thống cần kiểm tra dữ liệu phía server để tránh tính sai tiền, bán vượt tồn kho và lặp tác động thanh toán hoặc cộng điểm.

Đây là bối cảnh nghiệp vụ của đồ án; chưa có khảo sát định lượng để khẳng định cửa hàng đang gặp một tỷ lệ sai sót cụ thể hoặc BrewLite đã giảm thời gian chờ. A1 cung cấp nền tảng demo local, không phải bằng chứng hệ thống đã vận hành thương mại. [S1 §3–4; S2 §0; S3 §1]

## 3. Stakeholder, vai trò và nhu cầu

| Stakeholder | Vai trò và nhu cầu | Giới hạn |
| --- | --- | --- |
| Guest | Người chưa đăng nhập; cần xem menu, giá và tùy chọn size/topping để lựa chọn món. | Phải đăng nhập trước khi tạo Order. |
| Customer | Người đặt món; cần giỏ hàng, tạo đơn, thanh toán, xác nhận, lịch sử và điểm tích lũy; cần dữ liệu đúng và bảo vệ quyền sở hữu đơn. | Chỉ truy cập tài nguyên thuộc tài khoản; không quyết định giá, tồn kho hay kết quả thanh toán. |
| Quản lý cửa hàng / PO mô phỏng | Stakeholder xác định giá trị, ưu tiên backlog và chấp nhận increment; cần phạm vi rõ và quy tắc nhất quán. | Không suy ra có tài khoản hay UI quản trị; không gán PO cho thành viên khi chưa được xác nhận. |
| Nhân viên quầy / Barista | Stakeholder liên quan đến chuẩn bị và hoàn tất đồ uống; cần hiểu các trạng thái PREPARING, READY, COMPLETED. | UI Barista nằm ngoài MVP; stakeholder nghiệp vụ không đồng nghĩa actor có giao diện đã triển khai. |
| VNPay Sandbox | Hệ thống ngoài tham gia redirect và trao đổi kết quả IPN/QueryDR; cần dữ liệu giao dịch và thông báo được xác minh theo hợp đồng tích hợp. | Chỉ Sandbox; không giao dịch tiền thật. Mock và ZERO_AMOUNT là cơ chế nội bộ, không phải actor ngoài. |
| Nhóm phát triển | Phân tích, thiết kế, triển khai, review và kiểm thử; cần nguồn yêu cầu thống nhất, khả năng truy vết và tái tạo môi trường. | Lịch sử A1 không thay thế bằng chứng review và kiểm chứng A2. |
| Giảng viên | Đánh giá đồ án; cần tạo phẩm, demo và bằng chứng có thể kiểm tra theo tiêu chí Assignment. | Không mặc định đã nghiệm thu khi mới có tài liệu hoặc test lịch sử. |

Guest và Customer là actor sử dụng web chính; VNPay Sandbox là actor hệ thống ngoài. Các stakeholder còn lại có lợi ích và trách nhiệm liên quan nhưng không mặc nhiên có quyền thao tác trong ứng dụng. [S1 §5–6; S2 §0]

## 4. Mục tiêu sản phẩm

| Mục tiêu | Kết quả mong muốn trong baseline |
| --- | --- |
| G1 — Đặt món rõ ràng | Khách xem món/giá, chọn size/topping và quản lý giỏ trước khi tạo đơn. |
| G2 — Đơn hàng nhất quán | Server kiểm tra giỏ, tính lại giá, lưu thông tin đơn và kiểm soát tồn kho để tránh oversell. |
| G3 — Thanh toán có kiểm soát | Kết quả thanh toán được xác minh; request lặp không lặp tác động; retry và trường hợp chưa rõ kết quả tuân thủ baseline. |
| G4 — Theo dõi và bảo vệ dữ liệu | Customer xem kết quả/lịch sử đơn của mình; JWT và ownership bảo vệ nghiệp vụ cần đăng nhập; coupon/điểm tuân thủ quy tắc đã có. |
| G5 — Có thể đánh giá và bàn giao | Tài liệu mô tả đúng hệ thống, môi trường có thể tái tạo và bằng chứng được ghi theo trạng thái thực tế. |

Đây là mục tiêu và kết quả mong muốn, không phải tuyên bố các tiêu chí đã PASS. Ngưỡng đo, FR/NFR chi tiết và Acceptance Criteria sẽ được chuẩn hóa trong SRS của task tương ứng, không tự phát minh tại Task 1.1. [S1 §1, §3–6; S2 §1]

## 5. Ranh giới hệ thống

Bên trong BrewLite: Web Client Next.js, Backend API NestJS, dữ liệu PostgreSQL qua Prisma và các cơ chế nội bộ phục vụ Order, Inventory, Payment, Promotion/Loyalty. Docker Compose là cách tái tạo môi trường kế thừa A1.

Web Client hiển thị và gửi yêu cầu; Backend là nơi quyết định giá, kiểm tra tồn kho, quyền truy cập và thay đổi trạng thái nghiệp vụ. Không tin giá, userId hay kết quả thanh toán do client tự khai.

Bên ngoài BrewLite: Guest/Customer và VNPay Sandbox. VNPay Sandbox là provider mặc định. Mock CARD/WALLET chỉ phục vụ automated test/demo khi backend cho phép trong môi trường không phải production và luôn bị tắt ở production. ZERO_AMOUNT xử lý nội bộ đơn 0 VND, độc lập với Mock. Không tự fallback sang Mock khi VNPay PENDING hoặc chưa rõ kết quả. [S1 §3, §9.9, §16]

## 6. In Scope — MVP và phần mở rộng kế thừa A1-final

MVP và phần mở rộng dưới đây đều nằm trong baseline A1-final được kế thừa sang A2. Cách phân nhóm dựa trên 10 task A1 và các bổ sung Phase 2 đã ghi trong nguồn, không phải thay đổi ưu tiên hoặc loại bỏ yêu cầu. Đặc biệt, state machine, idempotency, concurrency/inventory và coupon/loyalty thuộc Task 10 A1, không bị chuyển thành tính năng tùy chọn. [S1 §4.1, §6; S3 §4.1]

### 6.1. Phạm vi MVP — 10 task A1

| Nhóm | Nội dung trong phạm vi MVP | Nguồn |
| --- | --- | --- |
| Identity | Đăng ký/đăng nhập JWT, băm mật khẩu Argon2id và bảo vệ API/quyền sở hữu dữ liệu. | S1 §4.1, §7.1; S3 §4.1 Task 7 |
| Catalog và Cart | Menu, chi tiết, size/topping; thêm/sửa/xóa giỏ và tổng tạm; server tính lại khi tạo đơn. | S1 §4.1, §6 F02–F03; S3 §4.1 Task 2–5 |
| Order và Inventory | Tạo đơn, kiểm tra hợp lệ, snapshot, xác nhận/trạng thái/lịch sử; state machine, chống oversell, concurrency/inventory và hết hạn/hoàn tài nguyên theo lifecycle baseline. | S1 §6 F04–F05; S3 §4.1 Task 6, 9–10 |
| Mock Payment và idempotency | Thanh toán giả lập CARD/WALLET cho test/demo trong môi trường được backend cho phép; xử lý kết quả và idempotency. Mock luôn bị tắt ở production; policy tại mục 5 áp dụng đầy đủ. | S1 §4.1, §6 F06; S3 §4.1 Task 8, 10 |
| Promotion và Loyalty | Kiểm tra coupon, giới hạn lượt dùng, tính giảm giá và cộng điểm sau thanh toán hợp lệ, không cộng trùng. | S1 §6 F07; S3 §4.1 Task 10 |
| Kiểm chứng và bàn giao kế thừa | Kiểm thử, Docker Compose, README, cấu hình mẫu và demo; phân biệt bằng chứng lịch sử A1 với kiểm chứng A2. | S1 §4.1; S2 §0; S3 §4.1 Task 1, 9 |

### 6.2. Phạm vi mở rộng — Phase 2 đã có trong baseline A1-final

| Nhóm | Nội dung mở rộng kế thừa | Nguồn |
| --- | --- | --- |
| VNPay Sandbox | Khởi tạo/redirect VNPay Sandbox mặc định; xác minh IPN/QueryDR. Không bao gồm thanh toán tiền thật hoặc kích hoạt cổng production. | S1 §3, §4.1, §9.9; S3 §1.1, §4 |
| Payment/Order nâng cao | Payment PENDING/SUCCESS/FAILED, shared finalization, retry có kiểm soát, điều chỉnh chính sách TTL/grace và xử lý hết hạn/hoàn tài nguyên khi có VNPay PENDING, reconciliation theo BR-01–BR-06. | S1 §6 F04–F06, §9.9, §16; S3 §4 |
| ZERO_AMOUNT | Xử lý nội bộ đơn 0 VND qua finalization chung; độc lập Mock, không gọi VNPay/Mock cho đơn 0 VND. | S1 §9.9 BR-06, §16; S3 §4 |

Các bảng xác định phạm vi yêu cầu, không xác nhận mức hoàn thành. Phần mở rộng là nội dung đã được kế thừa từ A1-final, không phải đề xuất thêm nghiệp vụ A2. QueryDR vẫn In Scope; chỉ việc nghiệm thu Sandbox E2E được hoãn từ A1 sang A2, nêu tại mục 7.3. Các giới hạn ở mục 9 áp dụng cho cả MVP và phần mở rộng.

## 7. Out of Scope và Deferred

### 7.1. Out of Scope — ngoài phạm vi sản phẩm baseline

| Nội dung | Ranh giới áp dụng |
| --- | --- |
| Thanh toán tiền thật và refund tự động | Không kích hoạt cổng thanh toán production hoặc giao dịch thật; không tự thêm nghiệp vụ refund. |
| Multi-vendor, microservices, mobile native | Giữ mô hình một cửa hàng và stack hiện có. |
| Seller/Admin phức tạp và UI Barista | Module Seller/Admin phức tạp và UI Barista nằm ngoài phạm vi sản phẩm baseline; vòng đời trạng thái đơn vẫn được mô tả theo yêu cầu kế thừa. |
| Vận chuyển và định vị thời gian thực | Không bổ sung Last-Mile, tracking hoặc nghiệp vụ giao nhận. |
| ERP/POS và quản lý nguyên liệu đầy đủ | Tồn kho chỉ phục vụ phạm vi chống oversell và lifecycle tài nguyên của baseline. |

### 7.2. Deferred — chức năng chưa đưa vào phạm vi hiện hành

| Nội dung | Giới hạn |
| --- | --- |
| Forgot/Reset Password | Tiếp tục Deferred theo baseline; không bổ sung hoặc mô tả endpoint/UI tương ứng như đã có. [S1 §4.2] |
| Hủy đơn chủ động — FR-ORD-005 | Tiếp tục Deferred; không mặc định có Cancel API/UI. Hết hạn đơn và hoàn tài nguyên tự động theo lifecycle vẫn nằm trong phạm vi kế thừa. [S1 §6 F04] |
| Advanced monitoring | Tiếp tục Deferred theo phạm vi A1; không bổ sung hoặc mô tả như năng lực đã có trong Task 1.1. [S1 §4.2] |

### 7.3. Deferred về kiểm chứng — không loại khỏi In Scope

QueryDR Sandbox E2E được hoãn nghiệm thu từ A1 sang A2 theo ADR đã được Gap Analysis dẫn lại. QueryDR và reconciliation vẫn thuộc phần mở rộng In Scope tại mục 6.2; trạng thái Deferred chỉ nói về kiểm chứng Sandbox E2E, không phải quyết định loại chức năng khỏi A2 hoặc ghi nhận đã PASS. [S2 §0, §6–7]

A1 từng defer deployment chính thức và CI/CD nâng cao; không được suy diễn rằng các mục này nằm ngoài toàn bộ Assignment 2. Task 1.1 chỉ ghi nhận sự phân biệt giữa phạm vi sản phẩm kế thừa và yêu cầu bàn giao A2. Advanced monitoring không được tự bổ sung như tính năng đã có. [S1 §4.2, §6 F04; S2 §3–5; S4]

## 8. Giả định và ràng buộc

| Mã / Loại | Nội dung | Nguồn |
| --- | --- | --- |
| A-01 — Giả định phân tích | A1-final là baseline nghiệp vụ dùng để kế thừa; chưa có quyết định được duyệt cho thay đổi nghiệp vụ ngoài baseline trong Task 1.1. Mọi đề xuất thay đổi cần được ghi riêng và review trước khi cập nhật phạm vi. | S1; S2 §0; S4 |
| C-01 — Ràng buộc công nghệ | Giữ Next.js, NestJS, TypeScript, PostgreSQL, Prisma và Docker; không thực hiện refactor hay đổi cấu trúc frontend/backend trong task tài liệu này. | S1 §3; S4 |
| C-02 — Ràng buộc truy cập và nghiệp vụ | Guest có thể xem menu; tạo đơn, thanh toán và xem lịch sử cần JWT hợp lệ và kiểm tra quyền sở hữu. Backend là nguồn quyết định giá và trạng thái. | S1 §3–5 |
| C-03 — Ràng buộc môi trường | Môi trường A2 cần tách khỏi A1 về Compose project và DB/volume; không kế thừa việc container A1 đang chạy thành bằng chứng A2. | S2 §0; S4 |
| A-02 — Giả định chưa chốt | Hosting và chính sách payment demo A2 còn cần quyết định theo planning; không giả định đã có phương án được phê duyệt. | S2 §7; S4 |
| C-04 — Ràng buộc bằng chứng | Tài liệu phải phân biệt yêu cầu, hiện trạng được ghi nhận và bằng chứng nghiệm thu. Không đánh dấu PASS, Done hoặc Approved nếu chưa có review và chứng cứ tương ứng. | S1 §3–5; S2 §0, §7; S4 |

## 9. Rủi ro và giới hạn kiểm chứng

| Rủi ro / giới hạn | Cách thể hiện và xử lý trong Task 1.1 |
| --- | --- |
| Scope creep từ stakeholder cửa hàng | Ghi vai trò và nhu cầu nhưng không biến thành tính năng Admin/Barista mới. |
| Nhầm yêu cầu với chức năng hoàn thành | Dùng ngôn ngữ mục tiêu/yêu cầu; không dùng “đã hoàn tất” nếu thiếu bằng chứng. |
| QueryDR Sandbox E2E còn Deferred | Bảo lưu phạm vi đối soát; không dùng synthetic/local tests để tuyên bố đã chạy Sandbox E2E. |
| Sai lệch payment-status API được Gap Analysis ghi nhận | Giữ trạng thái cần đối chiếu ở A2; không khẳng định đã có route hoặc đã sửa; xử lý ở task kỹ thuật riêng. |
| A1 local demo; production/CI/CD/PWA A2 chưa được xác nhận | Không ghi đã deploy, đã có pipeline hoặc đạt PWA; yêu cầu kiểm chứng tại task A2 tương ứng. |
| Nguồn tài liệu chưa chốt nghiệm thu | Ghi v3.1 chờ review đặc tả, business baseline đã duyệt; Gap Analysis draft; PR/reviewer/merge là chứng cứ còn cần bổ sung. |

Các giới hạn trên kế thừa S2, không phải kết quả chạy lại toàn bộ hệ thống trong SCRUM-99. Task này không sửa lỗi kỹ thuật hoặc thay đổi business rule để khép các gap. [S2 §0, §5–7]

## 10. Tạo phẩm và điều kiện review Task 1.1

Tạo phẩm chuẩn: docs/requirements/context-and-scope.md. Phần báo cáo tương ứng: docs/report/sections/context-and-scope.tex; đây là fragment dùng trong mẫu SGU, không phải báo cáo A2 hoàn chỉnh.

Công việc thuộc các task A2 khác: SRS chi tiết, UC, diagram, kiến trúc, CI/CD và deployment được thực hiện trong các task tương ứng, không triển khai trong SCRUM-99. Đây là giới hạn công việc của Task 1.1, không phải danh sách loại trừ của sản phẩm A2. Production/CI/CD là yêu cầu bàn giao A2 theo planning, chưa được ghi nhận là đã nghiệm thu. [S2; S4]

Review cần kiểm tra bối cảnh/mục tiêu rõ; từng stakeholder có vai trò và nhu cầu; In Scope/Out of Scope nhất quán với A1-final; không mô tả chức năng chưa kiểm chứng như đã hoàn thành; nội dung Markdown và LaTeX thống nhất.

Thay đổi cần được đưa lên nhánh riêng từ dev có mã SCRUM-99, tạo PR về dev và có review theo quy trình nhóm. Tài liệu này chưa xác nhận đã commit, push, mở PR, review hay merge; không tự đánh dấu Jira Done.

## 11. Tài liệu tham chiếu

Phiên bản nguồn [S1]–[S4] được cố định tại commit 8b4224a907091529ca954c8b0792406cb8a0d9f2 của repository brewlite-project/brewlite-a2, đọc ngày 08/11/2026. Đây là commit nguồn tài liệu A2; baseline nghiệp vụ A1-final vẫn là 1951dc124c83359556f04adb6ba3f0ee9f22fce4.

[S1] BrewLite Requirements Specification v3.1, cập nhật 30/10/2026. Nguồn tham chiếu chính: docs/a1-archive/BrewLite_Requirements_Specification_v3.1.docx. Bản trong docs/a1-archive/docs_Phase2/ có cùng nội dung tại commit nguồn được chốt bên dưới.

[S2] docs/planning/A2_Gap_Analysis.md — DRAFT, 08/11/2026.

[S3] README.md — tài liệu A1 kế thừa, không phải chứng nhận production A2.

[S4] docs/planning/A2_Implementation_Plan.md — PROPOSED / NOT APPROVED, 08/11/2026.

- [Requirements v3.1](https://github.com/brewlite-project/brewlite-a2/blob/8b4224a907091529ca954c8b0792406cb8a0d9f2/docs/BrewLite_Requirements_Specification_v3.1.docx)
- [A2 Gap Analysis](https://github.com/brewlite-project/brewlite-a2/blob/8b4224a907091529ca954c8b0792406cb8a0d9f2/docs/planning/A2_Gap_Analysis.md)
- [README](https://github.com/brewlite-project/brewlite-a2/blob/8b4224a907091529ca954c8b0792406cb8a0d9f2/README.md)
- [A2 Implementation Plan](https://github.com/brewlite-project/brewlite-a2/blob/8b4224a907091529ca954c8b0792406cb8a0d9f2/docs/planning/A2_Implementation_Plan.md)
