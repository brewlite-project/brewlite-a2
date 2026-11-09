# BrewLite deployment diagram

Sơ đồ của **A2-T3.2 / SCRUM-108**, thể hiện kiến trúc đã chọn để triển khai thử.
Trạng thái hiện tại: **TARGET DESIGN, chưa đối chiếu môi trường deploy thực tế**.
Chi tiết source, đường đi và checklist nghiệm thu:
[deployment.md](../architecture/deployment.md).

Đây là hướng dẫn riêng của Deployment Diagram. Dùng tên
`deployment-README.md` để không cùng thêm/sửa `docs/diagrams/README.md` với
Domain Class Diagram trong PR #5; README chung do PR đó bổ sung độc lập.

| File | Vai trò |
| --- | --- |
| `brewlite-deployment.drawio` | Nguồn chuẩn, XML không nén, chỉnh sửa bằng diagrams.net |
| `brewlite-deployment.svg` | Vector dùng trong Markdown và trình duyệt |
| `brewlite-deployment.pdf` | Vector một trang A3 landscape, dùng trong báo cáo |
| `render_deployment.py` | Xuất SVG/PDF trực tiếp từ nguồn `.drawio`, kiểm tra tràn chữ và tọa độ |
| `deployment-figure.tex` | Đoạn `figure`/`landscape` để chèn vào báo cáo LaTeX |

## Xuất lại

Chạy từ repository root, Python 3.10+:

```powershell
python -m pip install reportlab==5.1.0
python -c "import reportlab; print(reportlab.Version); assert reportlab.Version == '5.1.0'"
python docs/diagrams/render_deployment.py
python docs/diagrams/render_deployment.py --check
```

`--check` so sánh cả SVG và PDF với bản sinh lại mà không ghi đè. PDF dùng
metadata cố định để có thể kiểm tra byte-for-byte trong cùng phiên bản ReportLab.
Script không đọc `.env`, không cần backend/DB, không gọi VNPay và không deploy.

Kiểm tra hình từ PDF bằng PyMuPDF (tùy chọn):

```powershell
python -m pip install pymupdf
python docs/diagrams/render_deployment.py --check --preview tmp/pdfs/deployment-preview.png
```

Mở PNG để kiểm tra bố cục, chữ, đường nối và điểm giao nhau; ảnh tạm không phải
deliverable. Khi sửa bằng diagrams.net, giữ XML không nén và các hình cơ bản:
rectangle, plain text `html=0`, đường nối vuông góc có source/target và waypoints.
Không dùng HTML labels, group tương đối, shape mới hoặc auto-wrap mà renderer
chưa hỗ trợ. Ngắt dòng rõ ràng, giữ label trong khung và xuất lại cả hai định dạng.
Nếu cần shape khác, bổ sung renderer trong cùng thay đổi và kiểm tra ảnh mới.

## Chèn LaTeX

Preamble của báo cáo cần:

```latex
\usepackage{graphicx}
\usepackage{pdflscape}
```

Nếu compile từ repository root:

```latex
\input{docs/diagrams/deployment-figure.tex}
```

Nếu compile từ `docs/report`, dùng `\input{../diagrams/deployment-figure.tex}`
và khai báo trước khi input:

```latex
\newcommand{\BrewLiteDiagramDir}{../diagrams}
\input{../diagrams/deployment-figure.tex}
```

Fragment dùng `\providecommand{\BrewLiteDiagramDir}{docs/diagrams}` cùng quy ước
với fragment Domain Class Diagram của PR #5; không ghi đè macro nếu report đã
khai báo. Không cần sửa đường dẫn trong từng fragment. PDF chứa chữ chọn được,
không raster hóa.
Compile bằng toolchain hỗ trợ tiếng Việt đang dùng của báo cáo. Snippet chưa
được tích hợp/compile trong một main report của task này.

## Build, registry và ranh giới môi trường

- **Local:** Docker Compose trên máy developer, DB A2 và `.env` riêng; không
  dùng credential hoặc volume production.
- **CI:** GitHub Actions build/test với DB cô lập. CD dự kiến dùng Vercel CLI
  `build` rồi `deploy --prebuilt`; backend chỉ được trigger sau checks.
- **Production target:** Vercel nhận frontend artifact; Render lấy Git commit,
  build `backend/Dockerfile` thành runtime image rồi chạy NestJS; PostgreSQL là
  dịch vụ managed riêng trên private network của Render.
- **Registry:** không chọn registry độc lập để publish image BrewLite. Artifact
  frontend do Vercel quản lý; backend image nằm trong registry private do Render
  quản lý. Chú giải build ghi rõ thành phần này; không thêm dịch vụ GHCR/Docker
  Hub chưa chọn vào sơ đồ. Base image Dockerfile vẫn là dependency build.

Chi tiết mapping yêu cầu A2, bằng chứng image/release/rollback còn cần ở Task 5
và giới hạn của lựa chọn này nằm ở §1.1 và §7.1 của
[deployment.md](../architecture/deployment.md).

## Quy tắc cập nhật và kiểm tra

1. Chỉnh `.drawio`, không chỉnh tay SVG/PDF.
2. Giữ số đường nối 1-6 nhất quán với `deployment.md`.
3. Không đưa URL có credential, signed payment query, token hoặc secret vào file.
4. Chạy renderer, `--check`, rồi mở ảnh PDF render để kiểm tra trực quan.
5. Khi có deployment evidence, cập nhật diagram, ngày/snapshot, tài liệu và
   caption nếu trạng thái thay đổi. Không đổi `TBD`/gate thành PASS khi thiếu evidence.
6. Review diff trước khi đề nghị commit; commit/push/merge cần phê duyệt riêng.
