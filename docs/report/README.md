# Báo cáo tổng hợp A2 — bản nháp SCRUM-117

Entrypoint mới: [main.tex](main.tex). Tái sử dụng 5 section fragments hiện có và domain/deployment figure fragments; giữ nguyên nhãn DRAFT/target design của từng nguồn. Section [deployment-release-delivery.tex](sections/deployment-release-delivery.tex) theo [deployment](../deployment.md) và [delivery dossier](../delivery/SCRUM-117-delivery.md). Chưa tự viết lại/nâng trạng thái nghiệm thu task khác.

Checkout hiện tại: `D:/CNPM_PJ/brewlite-a2`, branch `SCRUM-117-production-release-delivery`,
HEAD `5021743e99d73c2ce795df72ee5aaa90b04bb0da`. PR #16 đã được tích hợp; source mới chỉ đổi
Next/proxy/lockfile web, không report, diagram assets hoặc build engine/package LaTeX.
Snapshot và CI evidence lịch sử vẫn giữ SHA riêng; chưa compile/render PDF mới.
Bundle tạo trước lần đối chiếu này là snapshot cũ; khi cần bàn giao phải tạo lại
từ bộ nguồn hiện tại theo allowlist. Chưa có PDF mới được compile/render.

## Template và provenance

Đã đọc template SGU `Assignment_report.tex` trong thư mục Downloads `Assigment_template_SGU/Assigment_template_SGU` ngày 10/11/2026. Template dùng article A4, vntex, bìa trường/khoa, fancyhdr và mục lục; có niên khóa 2023–2024, GVHD/sinh viên và nội dung minh họa cũ. Tái sử dụng cấu trúc trên, bỏ thông tin mẫu, không sao chép nội dung ví dụ/credential. Không phụ thuộc absolute path máy người soạn hoặc logo ngoài repo. Đây **không phải đề Assignment 2**, chưa xác nhận template này là mẫu bắt buộc hiện hành.

SHA256 source template đã đọc: `B74C3E07D5D1453B0BA6E98E678FC621F0F043B2561FFE06025D3F7CE41C0256`.

## Engine và font được xác định

**Chọn pdfLaTeX.** Căn cứ: preamble mẫu dùng `vntex`, không có `fontspec`/font OpenType bắt buộc. Log mẫu đi kèm `Assignment_report.log` dòng đầu ghi **pdfTeX 1.40.26 / TeX Live 2024, preloaded format=pdflatex**, ngày build lịch sử 08/10/2025; `.fdb_latexmk` cũng ghi rule `pdflatex`. Đây là bằng chứng engine đã dùng cho **template lịch sử**, không phải build mới của báo cáo BrewLite.

Main hiện dùng `inputenc[utf8]`, `fontenc[T5]`, `vntex`; default font family được T5/VnTeX cung cấp, không phụ thuộc font hệ điều hành chưa được chỉ định. [VnTeX trên CTAN](https://ctan.org/pkg/vntex) cung cấp font và macros tiếng Việt cho TeX Live/MiKTeX. Các assets được chèn là PDF, phù hợp pdfLaTeX. Tám inputs của main không yêu cầu `fontspec`; `domain-class-check.tex` có fontspec nhưng là fixture độc lập, **không được input vào main**. Không dùng engine của fixture để chọn engine báo cáo.

Không chuyển sang XeLaTeX/LuaLaTeX hoặc bỏ package để ép build. Nếu nhóm yêu cầu template/font mới khác mẫu đã đọc, cần cập nhật preamble và xác nhận riêng. Bản main là bản thích nghi cấu trúc SGU đã mô tả, không khẳng định sao chép nguyên trạng mọi package/logo của mẫu.

Đã đọc [Assignment 2 v1.0](https://drive.google.com/file/d/1CYVsexpTXZ6Uyg2FHMRE8lnJHSPkYQmi/view) qua Drive ngày 10/11/2026: học kỳ I 2026–2027 từ bìa đề đã được ghi vào main. GVHD/lớp/thành viên/MSSV còn cần nguồn xác nhận, không dùng dữ liệu mẫu để điền. Checklist §9.1 của đề không quy định tên/vị trí PDF báo cáo tổng hợp; PDF này là phần bàn giao người dùng yêu cầu, không tự gán thành một mục chấm riêng của giảng viên. Report vẫn chưa có toàn bộ evidence nghiệm thu task 4/5 hoặc production. Source/figure chỉ chứng minh có tạo phẩm, không deployment runtime.

[Requirement traceability-matrix.md](../traceability-matrix.md) đã bổ sung theo §8.1 của đề, tách khỏi ma trận task/PR TRACEABILITY.md. Main dẫn tới nguồn này để reviewer tra 48 FR + 49 NFR; không chép bảng lớn vào PDF hoặc nâng mapping coverage thành nghiệm thu.

## Build dự kiến

Toolchain: TeX Live hoặc MiKTeX có pdfLaTeX, vntex/T5, geometry, amsmath/amssymb, array, longtable, booktabs, tabularx, graphicx, pdflscape, fancyhdr, lastpage, hyperref. Chạy **từ repository root** vì các fragments kế thừa dùng path gốc:

```powershell
New-Item -ItemType Directory -Force docs/report/output | Out-Null
Get-Command pdflatex -ErrorAction Stop | Out-Null
pdflatex --version
pdflatex -interaction=nonstopmode -halt-on-error -file-line-error -output-directory=docs/report/output docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'First pdfLaTeX pass failed; inspect main.log' }
pdflatex -interaction=nonstopmode -halt-on-error -file-line-error -output-directory=docs/report/output docs/report/main.tex
if ($LASTEXITCODE -ne 0) { throw 'Second pdfLaTeX pass failed; inspect main.log' }
```

Mỗi lượt phải exit 0 trước lượt kế tiếp. Output dự kiến `docs/report/output/main.pdf`, chưa tồn tại trong lượt chuẩn bị này. Đây là **vị trí đề xuất**, không khẳng định do đề yêu cầu. Không đổi tên domain fixture PDF thành report cuối.

Nếu log còn yêu cầu rerun reference/TOC thì tiếp tục đúng engine đến khi ổn định; không coi hai lượt tự bảo đảm không còn warning. Không bật shell-escape vì báo cáo hiện không có yêu cầu đó. Build artifacts/log không tự commit như source; chỉ đưa PDF đã review vào vị trí nộp được nhóm xác nhận.

## Bộ nguồn portable và Overleaf (người dùng tự thực hiện)

Không có tài liệu nào được upload trong lượt này. Chỉ đóng gói allowlist sau, giữ path từ repository root:

- `docs/report/main.tex` → **`main.tex` ở root của ZIP/Overleaf** (nội dung nguyên byte); không đổi các input paths.
- `docs/report/sections/*.tex`, `docs/report/assets/*.pdf`.
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

## Kết quả ở lượt này

Lượt đầu gọi `pdflatex` ngày 10/11/2026 lúc 20:13 +07 trả **command not found**. Lượt review tiếp kiểm tra `Get-Command pdflatex,xelatex,lualatex,tectonic,latexmk`, các vị trí MiKTeX system/user, TeX Live 2024/2025/2026 thông dụng và cargo/tectonic: chưa tìm được engine khả dụng trong phạm vi kiểm tra. Điều này chỉ chứng minh môi trường hiện tại chưa có lệnh/toolchain được tìm thấy, **không phải báo cáo sai engine hay không thể build ở máy khác**.

Chưa compile được PDF mới, chưa render hoặc kiểm tra font/tiếng Việt/bảng/hình/TOC/reference trực quan. Kiểm tra inputs/assets và đóng gói source chỉ là static/package verification; không được gọi là báo cáo hợp lệ hoặc PDF hoàn tất. Đã hỏi quyền cài MiKTeX user + MuPDF portable, chưa thực hiện khi chưa được phép. Bước cần người dùng: xác nhận cài/chọn pdfLaTeX + packages trên máy được phép, hoặc tự dùng Overleaf như trên, rồi cung cấp log/PDF để visual QA. Kết quả đối chiếu và branch hiện hành ở [delivery §12](../delivery/SCRUM-117-delivery.md#12-đối-chiếu-dev-mới-5021743-chưa-tích-hợp); source 5021743 đã có trong checkout chính, PDF mới vẫn chưa build/render.
