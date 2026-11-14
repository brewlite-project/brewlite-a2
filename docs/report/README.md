# Báo cáo tổng hợp A2 — bản nháp SCRUM-117

Entrypoint mới: [main.tex](main.tex). Tái sử dụng 5 section fragments hiện có và domain/deployment figure fragments; giữ nguyên nhãn DRAFT/target design của từng nguồn. Section [deployment-release-delivery.tex](sections/deployment-release-delivery.tex) theo [deployment](../deployment.md) và [delivery dossier](../delivery/SCRUM-117-delivery.md). Chưa tự viết lại/nâng trạng thái nghiệm thu task khác.

Checkout hiện tại: `D:/CNPM_PJ/brewlite-a2`, branch SCRUM-117-production-release-delivery, HEAD `91e6f99bfd02353616b2e481fe613b7ea91118af`; app/config trùng origin/dev `0e43bcb80f64d6a5fa558cd80f71a199029535d0`. PR17 remote head 3543a55 đã có 10 docs; cập nhật mới chưa stage/push. Source #18–23/#25/#27 đã có trong checkout, không chỉ remote.

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

Main hiện dùng `inputenc[utf8]`, `fontenc[T5]`, `vntex`; default font family được T5/VnTeX cung cấp, không phụ thuộc font hệ điều hành chưa được chỉ định. [VnTeX trên CTAN](https://ctan.org/pkg/vntex) cung cấp font và macros tiếng Việt cho TeX Live/MiKTeX. Các assets được chèn gồm PDF và PNG, phù hợp pdfLaTeX. Chín inputs của main không yêu cầu `fontspec`; `domain-class-check.tex` có fontspec nhưng là fixture độc lập, **không được input vào main**. Không dùng engine của fixture để chọn engine báo cáo.

Không chuyển sang XeLaTeX/LuaLaTeX hoặc bỏ package để ép build. Nếu nhóm yêu cầu template/font mới khác mẫu đã đọc, cần cập nhật preamble và xác nhận riêng. Bản main là bản thích nghi cấu trúc SGU đã mô tả, không khẳng định sao chép nguyên trạng mọi package/logo của mẫu.

Đã đọc [Assignment 2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) qua Drive ngày 10/11/2026: học kỳ I 2026–2027 từ bìa đề đã được ghi vào main. GVHD/thành viên/MSSV đã kế thừa từ báo cáo A1 có nguồn ở trên; lớp chưa xác nhận, không dùng dữ liệu mẫu. Checklist §9.1 của đề không quy định tên/vị trí PDF báo cáo tổng hợp; PDF này là phần bàn giao người dùng yêu cầu, không tự gán thành một mục chấm riêng của giảng viên. Report vẫn chưa có toàn bộ evidence nghiệm thu task 4/5 hoặc production. Source/figure chỉ chứng minh có tạo phẩm, không deployment runtime.

[Requirement traceability-matrix.md](../traceability-matrix.md) đã bổ sung theo §8.1 của đề, tách khỏi ma trận task/PR TRACEABILITY.md. Main dẫn tới nguồn này để reviewer tra 48 FR + 49 NFR; không chép bảng lớn vào PDF hoặc nâng mapping coverage thành nghiệm thu.

## Build local

Toolchain: TeX Live hoặc MiKTeX có pdfLaTeX, vntex/T5, geometry, amsmath/amssymb, array, longtable, booktabs, tabularx, graphicx, pdflscape, fancyhdr, lastpage, hyperref. Chạy **từ repository root** vì các fragments kế thừa dùng path gốc:

```powershell
$reportBuild = Join-Path $env:TEMP 'brewlite-report-final'
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

Đã cài **MiKTeX26.5 user**, engine **MiKTeX-pdfTeX4.27/pdfTeX1.40.29**, VnTeX và packages cần cho report từ MiKTeX/CTAN chính thức. MiKTeX Setup ZIP hash0571E90F6D94353089B4F189FD82A532F9FE559A388C7E7F1102B14B3C1AE27D khớp trang vendor. Install root LocalAppData/Programs/MiKTeX; không đổi PATH toàn hệ thống. MuPDF portable1.28.5 tải từ casper.mupdf.com, giải nén TEMP. Không cài engine khác hoặc dùng PDF asset thay report.

PDF: [output/main.pdf](output/main.pdf), **53 trang**, giữ DRAFT/chưa nghiệm thu. Root entrypoint docs/report/main.tex, chạy từ repository root. Bản build trung gian/log/aux/toc/out và PNG QA ở TEMP/brewlite-report-final, không nằm trong bộ PR. Template SGU engine/hash lịch sử giữ nguyên; build mới là của source hiện tại có evidence14/11.

Bản pass9 trước hiệu chỉnh Leader ngày 14/11: 3.175.225 bytes; SHA256 `9B9D7837FE08DE39FB353AEFE580E747E95F9235D246895E21D202BB4957EC94`. Pass9 exit0, aux/toc không đổi so với pass8. Đã render lại toàn bộ sau sửa AC7 và xem lại trang bị ảnh hưởng; không phát hiện tràn/cắt hoặc trang trống bất thường.

Lệnh thực dùng pdfLaTeX tại user install, -interaction=nonstopmode -halt-on-error -file-line-error, output-directory TEMP/brewlite-report-final; enable-installer chỉ để bổ sung packages được duyệt, các lượt cuối disable-installer. Chạy đủ lượt đến aux và toc SHA256 không đổi. Lượt cuối exit0, không fatal/undefined references-citations/overfull hoặc duplicate page destination trong log. Chỉnh UTF8 input/VnTeX, ngắt texttt ASCII dài, xurl, small table padding, SHA path và heading; giữ nội dung/SHA/ngày của source kế thừa. Báo cáo có input production-evidence.tex và3 ảnh an toàn; 2 ảnh DB còn lại dẫn trong dossier.

MuPDF render toàn53 trang100dpi và text/layout extraction; kết quả visual QA cuối ghi ở delivery §14. Không coi compile hoặc text extraction riêng là QA bố cục. Kiểm tra bìa/tiếng Việt/font, TOC, bảng nhiều trang, hình/landscape, captions, footer/reference và trang evidence. PDF có links/bookmarks qua hyperref; không kiểm tra quyền người chấm hoặc mọi external URL. MiKTeX còn nhắc chưa check updates (maintenance notice ngoài TeX log), không phải lỗi compile; không tự update toàn bộ hệ thống.

Các lỗi trung gian đã xử lý: microtype font-expansion không hỗ trợ font bitmap; seqsplit global làm lỗi UTF8/moving arguments; macro original robust copy đã chỉnh, chỉ split literal ASCII và giữ tiếng Việt nguyên byte. Một tiến trình pdfLaTeX do task chạy bị lặp đã dừng theo PID trước rebuild; không để job treo. Build cuối ổn định, không tính lần lỗi là PASS.

## Tạo phẩm và giới hạn

PDF53 trang và source hiện tại dành cho review tài liệu. Không có tag/release/deploy/nghiệm thu tự động từ việc build. AC3/Internal connection/backup, FE production alias, payment-status/QueryDR/financial reconciliation, demo/Review/Retro và PR17 review còn cần evidence/decision. Bộ portable/Overleaf phía trên vẫn dùng đúng pdfLaTeX, đã bao gồm production-evidence.tex và ảnh evidence an toàn. Không upload.


## Bản hiệu chỉnh sau xác nhận của người dùng — 14/11/2026

Người dùng đính chính Leader chưa kiểm tra/nghiệm thu. Báo cáo và dossier đã sửa nhận định PASS trước đó. Phương án soạn thảo là nhóm tiếp tục quản lý dự án; mẫu chuyển quyền áp dụng khi đổi người quản lý, tên cá nhân chỉ ghi khi có nguồn.

Bản trước bổ sung logo có **53 trang**, 3175123 bytes, SHA256 `F796B94AA56D2D80F341F182627E21FB64F58F6B705843911EBD05C35E5B9CCB`. Rebuild bằng pdfLaTeX + VnTeX, ba lượt cuối exit 0. Log không có Overfull, undefined reference/citation hoặc LaTeX/Package Warning. Có Underfull hbox ở các đoạn/bảng căn đều; đã xem toàn bộ sáu contact sheets và trang 47/49 ở 140 dpi, không thấy cắt/chồng chữ. Các hình sơ đồ tổng thể cần zoom để đọc chi tiết. MuPDF render toàn bộ 53 trang. Kết quả pass9 ở trên là lịch sử. Build/render mới nằm ở TEMP/brewlite-scrum117-review-final.


## Bổ sung logo SGU ngày 14/11/2026

Bìa dùng đúng `logoITSGU.png` từ bộ template SGU người dùng cung cấp, đặt rộng 3 cm như lệnh trong template. Asset được lưu tại `docs/report/assets/logoITSGU.png`, SHA256 `F489C5117713707DD63FC4707E3EE7990CE3D5C76A2406AF8D99C59574B74E26`; hướng dẫn ZIP đã bao gồm ảnh.

PDF hiện hành **53 trang**, 3466242 bytes, SHA256 `B11CEFA5D56B8D54A98F0567788742B1EAF1E45938EB3F69CB26242CC75F82D1`. Ba lượt pdfLaTeX exit 0, không có Overfull hoặc LaTeX/Package Warning trong log cuối. Đã render và xem bìa cùng trang mục lục đầu bằng MuPDF ở 120 dpi; logo hiển thị đúng, thông tin nhóm và nhãn DRAFT nằm trong trang bìa. Phần nội dung đã QA ở bản trước; thay đổi này chỉ chèn logo trên titlepage.
