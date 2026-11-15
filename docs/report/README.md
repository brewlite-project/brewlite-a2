# Báo cáo đồ án BrewLite

[PDF báo cáo](output/main.pdf) và [nguồn LaTeX](main.tex) trình bày BrewLite theo bài toán, yêu cầu, mô hình hóa, kiến trúc/database/API, hiện thực, kiểm thử, vận hành, quản lý dự án và kết luận. Bìa giữ thông tin học phần Assignment2, logo SGU và roster có nguồn. Hình thức trình nộp không phải tuyên bố đã nghiệm thu hoặc mọi yêu cầu đều đạt.

## Cấu trúc và nguồn

- Chương chính dùng các fragments trong [sections](sections/); hình nguồn/export ở [diagrams](../diagrams/README.md).
- Giữ Use Case tổng quát/Checkout, Activity/Sequence, Domain Class, Deployment, ERD hiện hành và ảnh giao diện local có provenance.
- Phụ lục nguồn/truy vết và [phân công104 issue](../planning/BrewLite_Task_Allocation.md): 102 Task,1 Epic,1 Subtask. Bảng PDF dùng nhóm công việc, không dùng giai đoạn làm trục trình bày.
- [Requirements](../requirements/srs.md), [requirement matrix](../traceability-matrix.md), [API Contract](../a1-archive/api/BrewLite_API_Contract_v4.0.md), [deployment/runbook](../deployment.md).
- Thông tin nhóm kế thừa từ [báo cáo giữa kỳ](https://docs.google.com/document/d/1A43E5hJ4HEl6do7-Z0BYhmbKJVVgQsMdBOhCl7INyoY/edit). Nguồn nghiệp vụ lịch sử ở [A1-final](https://github.com/brewlite-project/brewlite/tree/1951dc124c83359556f04adb6ba3f0ee9f22fce4). Đề [Assignment2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view), checklist §9.1, không quy định riêng tên/path PDF tổng hợp này.

[Dossier kỹ thuật](../delivery/SCRUM-117-delivery.md#21-biên-tập-bản-trình-nộp--15112026) giữ lịch sử PDF/CI/SHA/checksum/audit và snapshot README cũ; tám AC tiếp tục ở dossier §2. Hai section release-readiness.tex và production-evidence.tex được giữ để truy vết, không input vào PDF trình nộp. Quyết định vận hành và phát hành không bị thay đổi bởi việc bỏ DRAFT.

## Build local

Toolchain: TeX Live hoặc MiKTeX có pdfLaTeX, vntex/T5, geometry, amsmath/amssymb, array, longtable, booktabs, tabularx, graphicx, pdflscape, fancyhdr, lastpage, hyperref, seqsplit, xurl và microtype. Chạy **từ repository root** vì các fragments kế thừa dùng path gốc:

```powershell
$reportBuild = Join-Path $env:TEMP 'brewlite-submission-report'
New-Item -ItemType Directory -Force $reportBuild | Out-Null
$reportTex = Join-Path $env:LOCALAPPDATA 'Programs/MiKTeX/miktex/bin/x64/pdflatex.exe'
& $reportTex --version
& $reportTex --disable-installer -interaction=nonstopmode -halt-on-error -file-line-error -output-directory="$reportBuild" docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'First pdfLaTeX pass failed; inspect main.log' }
& $reportTex --disable-installer -interaction=nonstopmode -halt-on-error -file-line-error -output-directory="$reportBuild" docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'Second pdfLaTeX pass failed; inspect main.log' }
```

Mỗi lượt phải exit 0 trước lượt kế tiếp. Lệnh trên dùng MiKTeX user đã cài trên máy hiện tại, không cần đổi PATH; máy khác phải chọn executable tương ứng. Sau build ổn định và QA, chép riêng PDF từ TEMP về [output/main.pdf](output/main.pdf). PDF hiện đã có tại vị trí này; đây là **vị trí đề xuất**, không khẳng định do đề yêu cầu. Không đổi tên domain fixture PDF thành report cuối.

Nếu log còn yêu cầu rerun reference/TOC thì tiếp tục đúng engine đến khi ổn định; không coi hai lượt tự bảo đảm không còn warning. Không bật shell-escape vì báo cáo hiện không có yêu cầu đó. Build artifacts/log không tự commit như source; chỉ đưa PDF đã review vào vị trí báo cáo trong repository.


## Bộ nguồn portable và Overleaf

Engine **pdfLaTeX + VnTeX**, UTF-8/T5, A4; không cần XeLaTeX/fontspec, shell-escape hoặc font hệ điều hành. Preamble thích nghi cấu trúc template SGU, không cần template trong Downloads để build. Không phụ thuộc checkout A1 hoặc CSV trên máy người soạn.

Để đóng gói nguồn, giữ các đường dẫn tương đối từ repository root:

- docs/report/main.tex; docs/report/sections/*.tex; docs/report/assets/*.pdf và logoITSGU.png.
- docs/diagrams/domain-class-figure.tex, deployment-figure.tex, brewlite-domain-class.pdf, brewlite-deployment.pdf.
- docs/A2_TestReport/evidence/menu_375x812.png, modal_320x640_top.png, modal_320x640_bottom.png, error_404_320x640.png.
- README.md, docs/report/README.md, docs/planning/BrewLite_Task_Allocation.md và các tài liệu đối chiếu cần bàn giao.

Trong Overleaf do người dùng tự upload, đặt bản sao nội dung main.tex tại root ZIP, chọn root file main.tex và compiler **pdfLaTeX**; giữ nguyên docs/... của các input/assets. Không upload tự động. File PDF đã build là tạo phẩm độc lập, ZIP nguồn không thay PDF.

Để tái sinh sơ đồ và các bản trình bày, lưu thêm [generator Node](../diagrams/render_report_diagrams.cjs), [UC PlantUML](../requirements/diagrams/use-case-overview.puml), [UC layout SVG](../requirements/diagrams/use-case-overview-report.svg), [ERD SVG](../diagrams/brewlite-database-erd.svg), hai SVG domain canonical trong docs/diagrams, Prisma schema và SQL migrations trong repository. Các SVG trình bày domain và PDF hai trang tương ứng cũng nằm trong docs/report/assets. Cách export MuPDF ở [diagrams README](../diagrams/README.md#erd-lưu-trữ-và-use-case-tổng-quát-trong-báo-cáo). Build LaTeX dùng PDF export có sẵn, không cần chạy generator hoặc truy cập database.

Không đóng gói .env, credential, node_modules, .git, log/render hoặc CSV all-fields. Log và contact sheets QA để TEMP.

## Bản PDF hiện hành

**[PDF hiện hành](output/main.pdf): 71 trang vật lý, 19 hình, 25 bảng, 4,592,744 bytes; SHA256 `23E1BD2631B4C5A879BFFF9D952D7E70B48F1C1977A8AAB9AA02D91A612B1BA8`.**

Biên tập tiếp theo: bỏ hai đoạn dẫn nguồn/phân biệt tạo phẩm ở đầu phụ lục B theo yêu cầu người dùng; giữ bảng tỷ lệ và các bảng task. Build lại hai lượt exit 0, không cảnh báo tham chiếu hoặc Overfull; đã render và kiểm tra trang PDF 58 sau khi xóa. Nguồn phân công vẫn được lưu trong tài liệu Markdown.

Bổ sung ngày 15/11/2026: Bảng 18 ở đầu phụ lục B, trang in 57 (trang PDF 58), tổng hợp phần việc và tỷ lệ đóng góp đề xuất theo bảng người dùng cung cấp: Nguyễn Châu Hoàng Khang 22%, Nguyễn Khải Hoàng 19%, Nguyễn Đăng Thụy 16%, Hoàng Văn Lập 13%, Cao Nguyễn Quốc Khánh 15%, Lâm Chí Khang 15%; tổng 100%. Đây là tỷ lệ đề xuất, không tính trực tiếp từ số task và không ghi nhận approval của nhóm. Giữ nguyên bảng chi tiết 104 issue.

Build mới bằng pdfLaTeX + VnTeX, ba lượt exit 0; log cuối không có Overfull hoặc cảnh báo tham chiếu/rerun, còn 7 Underfull từ nội dung trước. MuPDF trích text toàn bộ và render các trang mục lục, bảng mới và phần chuyển tiếp để kiểm tra. Bảng mới nằm trọn một trang, tiếng Việt và các tỷ lệ rõ, không tràn/cắt. Không chạy lại app tests hoặc production checks. Log/render nằm ngoài repo tại TEMP/brewlite-contribution-report. PDF này chưa có CI riêng; kết quả QA bản trước dưới đây được giữ như lịch sử.

### Snapshot QA trước khi bổ sung tỷ lệ đóng góp

**PDF trước khi bổ sung: 70 trang vật lý, 19 hình, 24 bảng, 4,589,955 bytes; SHA256 `006997E90EE869B8AFBABC68B40AC0BEF87E7C3151404DCF5C1D8F77A784C574`. Bản này đã được thay bằng PDF hiện hành ở trên.**

Build ngày15/11/2026 bằng pdfLaTeX + VnTeX/MiKTeX26.5 (pdfTeX1.40.29), từ repository root theo lệnh trên; lượt5 thay bố cục, lượt6 ổn định aux/TOC/LoF/LoT/out, exit0. Không còn Overfull, undefined references/citations hoặc LaTeX/Package Warning; 7 Underfull đã xem bố cục. MiKTeX nhắc kiểm tra updates ngoài log TeX, không phải lỗi build; không cài thêm toolchain.

MuPDF1.28.5 render toàn bộ 70 trang90dpi từ **PDF cuối**, tạo8 contact sheets mới trong TEMP/brewlite-submission-report/final-pages và final-sheet-*.png. Đã xem toàn bộ contact sheets cùng trang bìa, hai hình domain, ERD, UI, bảng phân công và các trang bị biên tập; kiểm tiếng Việt/font, caption, footer, mục lục/danh mục, bảng nhiều trang và ngắt trang. Không thấy tràn/cắt/chồng chữ hoặc trang trắng bất thường; text bbox không vượt trang, không U+FFFD. Các sơ đồ tổng thể có bản vector để zoom và bản tách để đọc.

Bìa/footer/PDF metadata không còn DRAFT; metadata title là “Báo cáo đồ án BrewLite”. Quét text không còn nhãn tác nghiệp NOT VERIFIED/PARTIAL/REVIEW PENDING, hội thoại, lỗi connector hoặc trạng thái Git; mã403 trong mô hình vẫn là HTTP error nghiệp vụ. Tên tài liệu lịch sử và enum REQUIRES_REVIEW được giữ đúng ngữ nghĩa. Không đưa checksum hiện hành vào PDF.

Đối chiếu CSV → Markdown → LaTeX → PDF đủ104 issue, gồm102 Task/1 Epic/1 Subtask, giữ assignee/nhóm công việc/mã, tiêu đề nguyên bản và Sprint/giai đoạn trong bảng nguồn. Roster/MSSV đủ sáu người. ERD13 bảng/15 FK khớp SQL và3 partial indexes; SVG tái sinh byte-identical. Nguồn/build assets nằm trong repo; không cần Downloads hoặc checkout A1 để compile.

Các kết quả ứng dụng/HTTP trong báo cáo là kết quả kế thừa theo môi trường đã ghi, không phải test mới của lượt biên tập. Không chạy app suite hoặc production checks; CI cũ không đại diện source/PDF mới. [Checklist nộp bài](../delivery/SCRUM-117-delivery.md#7-checklist-nộp-bài-và-khả-năng-truy-cập-của-người-chấm) và các thiếu hụt hoạt động thực tế giữ trong dossier.

Kiểm tra cuối sau đồng bộ: 874 local links/anchors, 12 nguồn TeX, 11 inputs, 22 graphics, 62 labels và5 citation occurrences không báo lỗi; 48 FR/49 NFR giữ nguyên. git diff --check và git diff --cached --check đạt, index trống. Dò mẫu credential/secret và conflict trong phạm vi source liên quan không báo lỗi; không thay kiểm toán bảo mật toàn repo. Source ứng dụng, schema, pipeline và archive không có diff.
