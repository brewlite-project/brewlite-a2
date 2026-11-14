# Báo cáo tổng hợp A2 — bản nháp SCRUM-117

Entrypoint báo cáo toàn đồ án: [main.tex](main.tex). Tái sử dụng context/SRS/use case/activity/sequence và domain/deployment figures, bổ sung dữ liệu/API/hiện thực, kiểm thử, Scrum và đánh giá; giữ nguyên nhãn DRAFT/target design của từng nguồn. Section [deployment-release-delivery.tex](sections/deployment-release-delivery.tex) theo [deployment](../deployment.md) và [delivery dossier](../delivery/SCRUM-117-delivery.md). Chưa tự viết lại/nâng trạng thái nghiệm thu task khác.

**Hiện trạng kiểm tra lại 14/11/2026:** checkout chính và PR17 cùng HEAD `6ee4199acaab709471144295adc98ac34e9f11c3`, base dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. Bản báo cáo toàn đồ án **65 trang còn trong working tree**, chưa nằm trong commit này; PDF ở PR17 vẫn là bản 53 trang. CI của head hiện tại không đại diện thay đổi chưa commit. Xem [audit Git/HTTP mới](../delivery/SCRUM-117-delivery.md#16-đối-chiếu-git-và-khả-năng-hoàn-thiện-ngày14112026).

**Snapshot lịch sử trước lần tổng hợp toàn đồ án:** `D:/CNPM_PJ/brewlite-a2`, branch SCRUM-117-production-release-delivery, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`; app/config trùng origin/dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. PR17 remote head 3543a55 đã có 10 docs; cập nhật lúc đó chưa stage/push. Source #18–23/#25/#27 đã có trong checkout, không chỉ remote.

Report bổ sung triển khai/kiểm thử/vận hành/bàn giao và giới hạn A2 theo PR24–28. Payment Sandbox success theo PR26 không thay IPN/QueryDR evidence; README #27 mô tả CD và ảnh Render mới xác nhận một Auto-Deploy Live02452f2. Browser smoke NOT VERIFIED; người dùng yêu cầu bỏ Computer Use. PDF mới đã build/render; kết quả hiện hành ở cuối README, các dòng lịch sử giữ provenance.

## Nguồn A1 và dữ liệu kế thừa

Đã đọc native text của [BrewLite Assignment 1 — Nhóm 3](https://docs.google.com/document/d/1A43E5hJ4HEl6do7-Z0BYhmbKJVVgQsMdBOhCl7INyoY/edit) ngày 13/11/2026, tab t.0. Bìa/§1 ghi GVHD Từ Lãng Phiêu, học phần 841047, nhóm 03, học kỳ I 2026–2027 và 6 thành viên:

| Thành viên | MSSV |
|---|---|
| Nguyễn Châu Hoàng Khang | 3124410143 |
| Cao Nguyễn Quốc Khánh | 3124410149 |
| Nguyễn Khải Hoàng | 3124410106 |
| Nguyễn Đăng Thụy | 3124410352 |
| Hoàng Văn Lập | 3124410184 |
| Lâm Chí Khang | 3124410142 |

Các thông tin trên được kế thừa và ghi provenance trên bìa; lớp chưa có nguồn, không tự điền. Thay đổi roster A2 nếu có cần nhóm xác nhận. Vai trò/công việc A1 không tự chuyển thành ownership hosting/DB/release/tiếp nhận A2. Không chỉnh Google Docs hoặc upload.

Nền tảng còn đúng: ứng dụng một cửa hàng, Next.js → NestJS → Prisma/PostgreSQL, JWT/ownership, backend quyết định giá và trạng thái, shared finalization; đối chiếu architecture/source A2 hiện tại. Các đặc tả Mock/0đ cũ phải đọc cùng API v4/BR-06 hiện hành: không copy rule Phase1 thành rule A2. A1 IPN/QueryDR tests/ADR và SCRUM94 giữ source/ngày/môi trường trong archive; không chuyển thành A2 PASS.



## Template và provenance

Đã đọc template SGU `Assignment_report.tex` trong thư mục Downloads `Assigment_template_SGU/Assigment_template_SGU` ngày 10/11/2026. Template dùng article A4, vntex, bìa trường/khoa, fancyhdr và mục lục; có niên khóa 2023–2024, GVHD/sinh viên và nội dung minh họa cũ. Tái sử dụng cấu trúc trên, bỏ thông tin mẫu, không sao chép nội dung ví dụ/credential. Không phụ thuộc absolute path máy người soạn hoặc logo ngoài repo. Đây **không phải đề Assignment 2**, chưa xác nhận template này là mẫu bắt buộc hiện hành.

SHA256 source template đã đọc: `B74C3E07D5D1453B0BA6E98E678FC621F0F043B2561FFE06025D3F7CE41C0256`.

## Engine và font được xác định

**Chọn pdfLaTeX.** Căn cứ: preamble mẫu dùng `vntex`, không có `fontspec`/font OpenType bắt buộc. Log mẫu đi kèm `Assignment_report.log` dòng đầu ghi **pdfTeX 1.40.26 / TeX Live 2024, preloaded format=pdflatex**, ngày build lịch sử 08/10/2025; `.fdb_latexmk` cũng ghi rule `pdflatex`. Đây là bằng chứng engine đã dùng cho **template lịch sử**, không phải build mới của báo cáo BrewLite.

Main hiện dùng `inputenc[utf8]`, `fontenc[T5]`, `vntex`; default font family được T5/VnTeX cung cấp, không phụ thuộc font hệ điều hành chưa được chỉ định. [VnTeX trên CTAN](https://ctan.org/pkg/vntex) cung cấp font và macros tiếng Việt cho TeX Live/MiKTeX. Các assets được chèn gồm PDF và PNG, phù hợp pdfLaTeX. Các inputs của main không yêu cầu `fontspec`; `domain-class-check.tex` có fontspec nhưng là fixture độc lập, **không được input vào main**. Không dùng engine của fixture để chọn engine báo cáo.

Không chuyển sang XeLaTeX/LuaLaTeX hoặc bỏ package để ép build. Nếu nhóm yêu cầu template/font mới khác mẫu đã đọc, cần cập nhật preamble và xác nhận riêng. Bản main là bản thích nghi cấu trúc SGU đã mô tả, không khẳng định sao chép nguyên trạng mọi package/logo của mẫu.

Đã đọc [Assignment 2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) qua Drive ngày 10/11/2026: học kỳ I 2026–2027 từ bìa đề đã được ghi vào main. GVHD/thành viên/MSSV đã kế thừa từ báo cáo A1 có nguồn ở trên; lớp chưa xác nhận, không dùng dữ liệu mẫu. Checklist §9.1 của đề không quy định tên/vị trí PDF báo cáo tổng hợp; PDF này là phần bàn giao người dùng yêu cầu, không tự gán thành một mục chấm riêng của giảng viên. Report vẫn chưa có toàn bộ evidence nghiệm thu task 4/5 hoặc production. Source/figure chỉ chứng minh có tạo phẩm, không deployment runtime.

[Requirement traceability-matrix.md](../traceability-matrix.md) đã bổ sung theo §8.1 của đề, tách khỏi ma trận task/PR TRACEABILITY.md. Main dẫn tới nguồn này để reviewer tra 48 FR + 49 NFR; không chép bảng lớn vào PDF hoặc nâng mapping coverage thành nghiệm thu.

## Build local

Toolchain: TeX Live hoặc MiKTeX có pdfLaTeX, vntex/T5, geometry, amsmath/amssymb, array, longtable, booktabs, tabularx, graphicx, pdflscape, fancyhdr, lastpage, hyperref, seqsplit, xurl và microtype. Chạy **từ repository root** vì các fragments kế thừa dùng path gốc:

```powershell
$reportBuild = Join-Path $env:TEMP 'brewlite-whole-project-report'
New-Item -ItemType Directory -Force $reportBuild | Out-Null
$reportTex = Join-Path $env:LOCALAPPDATA 'Programs/MiKTeX/miktex/bin/x64/pdflatex.exe'
& $reportTex --version
& $reportTex --disable-installer -interaction=nonstopmode -halt-on-error -file-line-error -output-directory="$reportBuild" docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'First pdfLaTeX pass failed; inspect main.log' }
& $reportTex --disable-installer -interaction=nonstopmode -halt-on-error -file-line-error -output-directory="$reportBuild" docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'Second pdfLaTeX pass failed; inspect main.log' }
```

Mỗi lượt phải exit 0 trước lượt kế tiếp. Lệnh trên dùng MiKTeX user đã cài trên máy hiện tại, không cần đổi PATH; máy khác phải chọn executable tương ứng. Sau build ổn định và QA, chép riêng PDF từ TEMP về [output/main.pdf](output/main.pdf). PDF hiện đã có tại vị trí này; đây là **vị trí đề xuất**, không khẳng định do đề yêu cầu. Không đổi tên domain fixture PDF thành report cuối.

Nếu log còn yêu cầu rerun reference/TOC thì tiếp tục đúng engine đến khi ổn định; không coi hai lượt tự bảo đảm không còn warning. Không bật shell-escape vì báo cáo hiện không có yêu cầu đó. Build artifacts/log không tự commit như source; chỉ đưa PDF đã review vào vị trí nộp được nhóm xác nhận.

## Bộ nguồn portable và Overleaf (người dùng tự thực hiện)

Không có tài liệu nào được upload trong lượt này. Chỉ đóng gói allowlist sau, giữ path từ repository root:

- `docs/report/main.tex` → **`main.tex` ở root của ZIP/Overleaf** (nội dung nguyên byte); không đổi các input paths.
- `docs/report/sections/*.tex`, `docs/report/assets/*.pdf` và `docs/report/assets/logoITSGU.png`.
- Năm ảnh an toàn `docs/delivery/evidence/*.png` dùng cho production evidence; không lấy ảnh raw từ clipboard.
- `docs/diagrams/domain-class-figure.tex`, `deployment-figure.tex`, `brewlite-domain-class.pdf`, `brewlite-deployment.pdf`.
- Hai ảnh UI lịch sử: `docs/A2_TestReport/evidence/menu_375x812.png`, `docs/A2_TestReport/evidence/modal_320x640_top.png` (giữ provenance source34cbbc0).
- Các Markdown để reviewer đối chiếu: `docs/report/README.md`, `docs/deployment.md`, `docs/delivery/SCRUM-117-delivery.md`, `docs/delivery/release-notes-A2.md`, `docs/traceability-matrix.md`.

Không zip toàn repo, `.env`, credentials, `node_modules`, `.git` hay log máy cá nhân. Bộ ZIP chỉ là snapshot source nháp; không phải bộ nộp chính thức/PDF đã build. Lệnh PowerShell dưới chạy từ repository root, tạo ZIP mới trong thư mục TEMP, không ghi đè source:

```powershell
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$reportZip = Join-Path $env:TEMP ('brewlite-report-' + [guid]::NewGuid().ToString('N') + '.zip')
$reportFiles = @(
  'docs/report/README.md', 'docs/deployment.md',
  'docs/delivery/SCRUM-117-delivery.md', 'docs/delivery/release-notes-A2.md',
  'docs/traceability-matrix.md',
  'docs/A2_TestReport/evidence/menu_375x812.png',
  'docs/A2_TestReport/evidence/modal_320x640_top.png',
  'docs/diagrams/domain-class-figure.tex', 'docs/diagrams/deployment-figure.tex',
  'docs/diagrams/brewlite-domain-class.pdf', 'docs/diagrams/brewlite-deployment.pdf'
)
$reportFiles += Get-ChildItem docs/report/sections -Filter *.tex | ForEach-Object { 'docs/report/sections/' + $_.Name }
$reportFiles += Get-ChildItem docs/report/assets -Filter *.pdf | ForEach-Object { 'docs/report/assets/' + $_.Name }
$reportFiles += 'docs/report/assets/logoITSGU.png'
$reportFiles += Get-ChildItem docs/delivery/evidence -Filter *.png | ForEach-Object { 'docs/delivery/evidence/' + $_.Name }
$reportArchive = [IO.Compression.ZipFile]::Open($reportZip, [IO.Compression.ZipArchiveMode]::Create)
try {
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($reportArchive, (Resolve-Path docs/report/main.tex).Path, 'main.tex') | Out-Null
  foreach ($reportFile in $reportFiles) {
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($reportArchive, (Resolve-Path $reportFile).Path, $reportFile) | Out-Null
  }
} finally { $reportArchive.Dispose() }
Write-Output $reportZip
```

Người dùng giải nén kiểm tra `main.tex` và `docs/` ở cùng root; nếu được nhóm cho phép chia sẻ, tự Upload Project ZIP lên Overleaf. Trong project settings, chọn **Main document `main.tex` tại root**, **Compiler pdfLaTeX**; TeX Live 2024 khớp log template nếu phiên bản đó được project hỗ trợ, hoặc ghi rõ phiên bản TeX Live thực dùng và kiểm tra log. Không khẳng định đã test trên bất kỳ bản TeX Live nào của báo cáo mới. Root entrypoint trong ZIP tránh đổi working directory/path của các fragments. Hướng dẫn chính thức: [compiler/TeX Live](https://docs.overleaf.com/getting-started/recompiling-your-project/selecting-a-tex-live-version-and-latex-compiler), [main document](https://docs.overleaf.com/getting-started/recompiling-your-project/the-main-document).

Recompile, tải log/PDF, kiểm tra mục dưới; chỉ sau khi compile/render/review mới lưu PDF về vị trí chuẩn được xác nhận (đề xuất `docs/report/output/main.pdf`). Nếu lỗi, gửi first error và version engine/package đã dùng, không gửi credential hoặc toàn bộ environment.

## Kiểm tra bắt buộc sau build

- Đọc log: không undefined reference/citation, missing file/font/glyph; xử lý overfull và float placement.
- Render toàn bộ PDF ra ảnh, kiểm tra từng trang: bìa, tiếng Việt, mục lục, bảng nhiều trang, sơ đồ landscape, caption, link/reference và không cắt/đè chữ. Compile hai lượt chưa thay visual QA.
- Đối chiếu claims Markdown–LaTeX và source/deploy SHA; điền metadata từ nguồn thật; giữ draft cho gate chưa đủ evidence.
- Thử mở/download PDF đúng phiên bản từ quyền người chấm, khóa manifest/checksum cùng bộ nộp sau review.

## Kết quả build và QA ngày 14/11/2026

**Snapshot trước lần tổng hợp toàn đồ án; kết quả hiện hành ở mục cuối README.**

Đã cài **MiKTeX26.5 user**, engine **MiKTeX-pdfTeX4.27/pdfTeX1.40.29**, VnTeX và packages cần cho report từ MiKTeX/CTAN chính thức. MiKTeX Setup ZIP hash0571E90F6D94353089B4F189FD82A532F9FE559A388C7E7F1102B14B3C1AE27D khớp trang vendor. Install root LocalAppData/Programs/MiKTeX; không đổi PATH toàn hệ thống. MuPDF portable1.28.5 tải từ casper.mupdf.com, giải nén TEMP. Không cài engine khác hoặc dùng PDF asset thay report.

PDF: [output/main.pdf](output/main.pdf), **53 trang**, giữ DRAFT/chưa nghiệm thu. Root entrypoint docs/report/main.tex, chạy từ repository root. Bản build trung gian/log/aux/toc/out và PNG QA ở TEMP/brewlite-report-final, không nằm trong bộ PR. Template SGU engine/hash lịch sử giữ nguyên; build mới là của source hiện tại có evidence14/11.

Bản pass9 trước hiệu chỉnh Leader ngày 14/11: 3.175.225 bytes; SHA256 `9B9D7837FE08DE39FB353AEFE580E747E95F9235D246895E21D202BB4957EC94`. Pass9 exit0, aux/toc không đổi so với pass8. Đã render lại toàn bộ sau sửa AC7 và xem lại trang bị ảnh hưởng; không phát hiện tràn/cắt hoặc trang trống bất thường.

Lệnh thực dùng pdfLaTeX tại user install, -interaction=nonstopmode -halt-on-error -file-line-error, output-directory TEMP/brewlite-report-final; enable-installer chỉ để bổ sung packages được duyệt, các lượt cuối disable-installer. Chạy đủ lượt đến aux và toc SHA256 không đổi. Lượt cuối exit0, không fatal/undefined references-citations/overfull hoặc duplicate page destination trong log. Chỉnh UTF8 input/VnTeX, ngắt texttt ASCII dài, xurl, small table padding, SHA path và heading; giữ nội dung/SHA/ngày của source kế thừa. Báo cáo có input production-evidence.tex và3 ảnh an toàn; 2 ảnh DB còn lại dẫn trong dossier.

MuPDF render toàn53 trang100dpi và text/layout extraction; kết quả visual QA cuối ghi ở delivery §14. Không coi compile hoặc text extraction riêng là QA bố cục. Kiểm tra bìa/tiếng Việt/font, TOC, bảng nhiều trang, hình/landscape, captions, footer/reference và trang evidence. PDF có links/bookmarks qua hyperref; không kiểm tra quyền người chấm hoặc mọi external URL. MiKTeX còn nhắc chưa check updates (maintenance notice ngoài TeX log), không phải lỗi compile; không tự update toàn bộ hệ thống.

Các lỗi trung gian đã xử lý: microtype font-expansion không hỗ trợ font bitmap; seqsplit global làm lỗi UTF8/moving arguments; macro original robust copy đã chỉnh, chỉ split literal ASCII và giữ tiếng Việt nguyên byte. Một tiến trình pdfLaTeX do task chạy bị lặp đã dừng theo PID trước rebuild; không để job treo. Build cuối ổn định, không tính lần lỗi là PASS.

## Tạo phẩm và giới hạn

Đoạn này ghi giới hạn của **snapshot PDF53 trang lịch sử**; bản toàn đồ án hiện hành là PDF65 trang ở cuối README. Không có tag/release/deploy/nghiệm thu tự động từ việc build. AC3/Internal connection/backup, FE production alias, payment-status/QueryDR/financial reconciliation, demo/Review/Retro và PR17 review còn cần evidence/decision. Bộ portable/Overleaf phía trên vẫn dùng đúng pdfLaTeX, đã bao gồm production-evidence.tex và ảnh evidence an toàn. Không upload.


## Bản hiệu chỉnh sau xác nhận của người dùng — 14/11/2026

Người dùng đính chính Leader chưa kiểm tra/nghiệm thu. Báo cáo và dossier đã sửa nhận định PASS trước đó. Phương án soạn thảo là nhóm tiếp tục quản lý dự án; mẫu chuyển quyền áp dụng khi đổi người quản lý, tên cá nhân chỉ ghi khi có nguồn.

Bản trước bổ sung logo có **53 trang**, 3175123 bytes, SHA256 `F796B94AA56D2D80F341F182627E21FB64F58F6B705843911EBD05C35E5B9CCB`. Rebuild bằng pdfLaTeX + VnTeX, ba lượt cuối exit 0. Log không có Overfull, undefined reference/citation hoặc LaTeX/Package Warning. Có Underfull hbox ở các đoạn/bảng căn đều; đã xem toàn bộ sáu contact sheets và trang 47/49 ở 140 dpi, không thấy cắt/chồng chữ. Các hình sơ đồ tổng thể cần zoom để đọc chi tiết. MuPDF render toàn bộ 53 trang. Kết quả pass9 ở trên là lịch sử. Build/render mới nằm ở TEMP/brewlite-scrum117-review-final.


## Bổ sung logo SGU ngày 14/11/2026 — snapshot lịch sử

Bìa dùng đúng `logoITSGU.png` từ bộ template SGU người dùng cung cấp, đặt rộng 3 cm như lệnh trong template. Asset được lưu tại `docs/report/assets/logoITSGU.png`, SHA256 `F489C5117713707DD63FC4707E3EE7990CE3D5C76A2406AF8D99C59574B74E26`; hướng dẫn ZIP đã bao gồm ảnh.

PDF tại commit6ee4199 **53 trang**, 3466242 bytes, SHA256 `B11CEFA5D56B8D54A98F0567788742B1EAF1E45938EB3F69CB26242CC75F82D1`. Ba lượt pdfLaTeX exit 0, không có Overfull hoặc LaTeX/Package Warning trong log cuối. Đã render và xem bìa cùng trang mục lục đầu bằng MuPDF ở 120 dpi; logo hiển thị đúng, thông tin nhóm và nhãn DRAFT nằm trong trang bìa. Phần nội dung đã QA ở bản trước; thay đổi này chỉ chèn logo trên titlepage.


## Đối chiếu báo cáo toàn đồ án với đề A2 v1.0

Đã đọc lại đề [A2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) và native text [báo cáo A1](https://docs.google.com/document/d/1A43E5hJ4HEl6do7-Z0BYhmbKJVVgQsMdBOhCl7INyoY/edit) ngày14/11/2026, không upload/chỉnh nguồn. Đề §2 chia5 task, mỗi task2 điểm; không có rubric khác được suy diễn. PDF tổng hợp do người dùng yêu cầu, đề §9.1 không chỉ định tên PDF. Template SGU dùng VnTeX và log pdfLaTeX; logo gốc giữ nguyên hash đã ghi.

Đối chiếu bản53 trang trước: đã có bối cảnh/stakeholder/SRS/use case/activity/sequence/domain/architecture/production, không kết luận chỉ có deployment. Thiếu tương đối mô hình dữ liệu/API thực, walkthrough frontend/backend, chiến lược test, Scrum theo mốc có nguồn và đánh giá tổng hợp. Bản này bổ sung các phần đó; chuyển bảng8 AC và ảnh production sang phụ lục, giữ nhật ký dài ở dossier.

| Yêu cầu/nội dung | Nguồn | Vị trí report | Mức đáp ứng và phần còn lại |
|---|---|---|---|
| Bìa, roster, provenance A1 → A2 | Báo cáo A1; đề bìa; SGU template | main, Tóm tắt/Nguồn, TOC/LoF/LoT | Có logo/roster có nguồn; lớp/thay đổi roster chưa xác nhận |
| Task1.1 vấn đề/stakeholder/scope/rủi ro | Đề §3.1, context-and-scope.md | section context-and-scope | Đã có; giữ giới hạn phạm vi, không viết lại từ đầu |
| Task1.2 FR/NFR/MoSCoW/AC, overall UC | Đề §3.2, SRS + nguồn A1 | requirements-summary; link SVG/PlantUML | 48 FR/49 NFR, representative AC và stories; catalog đầy đủ ở SRS/matrix, priority caveats giữ mở |
| Task1.3 checkout UC | Đề §3.3; checkout spec | checkout-use-case | Actor/main/alt/exception và diagram có; status API gap nêu đúng |
| Task2 activity/sequence/class | Đề §4, source + exports | activity/sequence/domain figure | Đã tích hợp; các phase model giữ provenance, không suy runtime PASS |
| Task3 architecture/ADR/deployment | Đề §5, architecture/ADR001–005 | Domain/kiến trúc; deployment figure | Trade-offs có; target diagram còn khác evidence external DB/CD, chưa thay design approval |
| Dữ liệu/API toàn hệ thống | A1 chương5, Prisma/10 migrations/controllers/API v4 | data-api-implementation, Thiết kế dữ liệu/API | Mới bổ sung13models/quan hệ/constraints/API inventory; không tạo DB schema/endpoint mới |
| Task4 monorepo/MVP/CI | Đề §6; PR11–15; report34cbbc0 | Hiện thực; Kiểm thử; Scrum | Có inherited result502/502 và ảnh local, không chuyển thành test hiện tại |
| Task5.1 MVP/luồng chính/bảo mật | Đề §7.1; app code/SRS/contracts | Hiện thực frontend/backend | Bổ sung walkthrough; rounding, status/Mock scope/PWA vẫn có gap, không tự nghiệm thu |
| Task5.2 unit/integration/E2E/Compose | Đề §7.2; tests/scripts/CI/PR25–26 | Chiến lược/kết quả kiểm thử | Phân mức/env/result; thiếu full menu→confirmation và QueryDR/IPN đúng baseline |
| Task5.3 CD/migration/smoke | Đề §7.3; PR27/Render/CI | Deployment và phụ lục | Một Auto-Deploy có evidence; runner/image/failure chain và FE alias chưa bind |
| Task5.4 vận hành/release/demo/Scrum | Đề §7.4; runbook/dossier | Deployment; Scrum; phụ lục8AC | Hướng dẫn có, chưa actual backup/restore/release/ceremony/acceptance |
| Traceability + bộ nộp | Đề §8.1/§9.1; matrix | Đánh giá/truy vết; dossier§7 | Mapping đủ48FR/49NFR, không bằng implementation/test coverage |
| Đánh giá/hạn chế/hướng phát triển | Tổng hợp nguồn thực | project-evaluation | Mới bổ sung; Planned/Implemented/Verified/Approved/Released tách biệt |

Không tích hợp domain-class-check.tex vì là fixture kiểm hình dùng fontspec/engine khác, không phải chương nội dung; không đổi compiler report theo fixture. Tất cả section nội dung còn lại đều được tích hợp, ba section mới dùng source hiện hữu. Không tạo meeting/feedback/approval hoặc ảnh UI giả.


## PDF tổng hợp hiện hành — build và QA cuối14/11

**Snapshot trước khi tích hợp audit16; bản hiện hành và checksum mới ở [mục cuối](#pdf-tích-hợp-audit16).**

[PDF tổng hợp](output/main.pdf): **65 trang vật lý** (bìa không đánh số +1–64), **3930674 bytes**, DRAFT; **12 phần chính,2 phụ lục,19 hình và23 bảng có caption**. SHA256 hiện hành: `E69A3F17AFC5FD36A9C98437C424FB96C4967C315997248DE7DC59BC0B6D401C`. Bản53 trang/B11CE… tại commit6ee4199, bản trước logo/F796… và pass9 cũ giữ nhãn lịch sử, không phải file hiện tại.

Đã dùng **MiKTeX26.5 user/pdfTeX1.40.29, pdfLaTeX + VnTeX**, MuPDF portable1.28.5 có sẵn; không cài lại/đổi engine/bỏ package hoặc sửa PATH. Root file docs/report/main.tex, thư mục thực thi D:/CNPM_PJ/brewlite-a2. Lệnh build đúng ở mục Build local; các lượt dùng --disable-installer. Pass10/11 exit0, pass11 ổn định aux/toc/lof/lot/out; không Overfull, undefined references/citations, LaTeX/Package Warning hoặc duplicate destination trong TeX log cuối. Có16 Underfull hbox ở đoạn/bảng căn đều; đã xem bố cục, không phải lỗi compile. MiKTeX còn maintenance notice chưa check updates ngoài TeX log.

MuPDF render **toàn65 trang90dpi**; xem8 contact sheets toàn bộ, các trang mới dữ liệu/API/UI/tests/Scrum/evaluation và readiness ở kích thước trang. Kiểm tra bìa/logo, TOC/LoF/LoT, caption/table tiếp trang, landscape diagrams, footer, references/bookmarks và ảnh đã che. Không thấy chữ cắt/chồng hoặc trang trống bất thường; text bbox không ra ngoài page bounds, không replacement glyph U+FFFD. Sơ đồ overview dày cần zoom, có các hình pha vector; không tuyên bố mọi external URL/quyền người chấm đã kiểm tra. Nội dung UI ảnh là lịch sử local source34cbbc0, không production smoke.

Intermediate PDF/log/aux/toc/lof/lot/out, render PNG và checker nằm TEMP/brewlite-whole-project-report, không thuộc bộ PR. Source portable/Overleaf đã gồm toàn bộ input mới và2 ảnh UI lịch sử cùng5 ảnh Render an toàn/logo; không upload. Chỉ đưa PDF đã QA và source tương ứng vào commit khi được cho phép. CI43543439775 của6ee4199 không kiểm bản source mới này.


## PDF tích hợp audit16

Đã đưa kết quả audit kế thừa14/11/2026 khoảng10:31 UTC từ dossier§16 vào nội dung report, không chỉ checklist: §10.1 HTTP/ý nghĩa/giới hạn; §10.2 CI/review/release; §10.5 phân biệt PDF53trang commit6ee4199 với PDF65trang local trước tích hợp; §12.1 đánh giá; phụ lụcA8AC và phụ lụcBprovenance ảnh Render. Main/preamble/logo và cấu trúc toàn đồ án giữ nguyên. Không gọi lại HTTP/GitHub trong lượt tích hợp; không đổi audit trước thành kiểm tra mới.

**[PDF hiện hành](output/main.pdf): 65 trang vật lý, 3932356 bytes**, DRAFT. SHA256 **`E3A8956E269950261286A22CB6DBD46862E4F8C3E207FDBEBCDF090CE676B59F`**. Bản65trang/3930674bytes/E69A… là snapshot trước tích hợp và đã được audit10:31 kiểm hash; bản53trang/B11CE… là PDF đã commit6ee4199. Các giá trị cũ trong mục lịch sử giữ nguyên, không thay toàn cục. Không ghi checksum hiện hành vào LaTeX/PDF.

Build từ D:/CNPM_PJ/brewlite-a2, root docs/report/main.tex; **MiKTeX26.5 user/pdfTeX1.40.29, pdfLaTeX + VnTeX**, MuPDF portable1.28.5 đã cài. Lệnh vẫn -interaction=nonstopmode -halt-on-error -file-line-error --disable-installer, output-directory TEMP/brewlite-audit16-report. Ba lượt exit0, pass3 ổn định aux/toc/lof/lot/out. Log cuối không Overfull, undefined references/citations, LaTeX/Package Warning hoặc duplicate destination;14 Underfull hbox đã kiểm tra trực quan. MiKTeX maintenance notice chưa check updates không phải lỗi compile; không cài lại/đổi engine.

Render toàn65trang90dpi; xem8 contact sheets và riêng trang55–57,59,61–62 bị ảnh hưởng. Đã kiểm tiếng Việt/font, bìa/logo, TOC/danh mục, bảng/hình/landscape, ngắt trang/footer, references và bookmarks. Không thấy chữ tràn/cắt/chồng hoặc trang trống bất thường. Kiểm text bbox không vượt page bounds và không U+FFFD; kiểm tự động không thay visual QA. Không mở mọi external link hoặc xác minh quyền người chấm. Sơ đồ overview vẫn cần zoom như bản trước, có hình pha vector.

Build/log/render/checker ở TEMP/brewlite-audit16-report, không thuộc bộ PR; nguồn portable/Overleaf không đổi dependencies/asset trong lần tích hợp này. Không upload. CI43543439775 chỉ cho head6ee4199, không cho source/PDF mới chưa commit. Cả8AC giữ nguyên mức chứng minh, không nâng Approved/Released/Accepted/Done do cập nhật report.
