# BrewLite A2 Documentation Center

Trung tâm tài liệu và tạo phẩm của đồ án **BrewLite Assignment 2**.

## 1. Cấu trúc thư mục tài liệu (`docs/`)

- [`docs/requirements/`](requirements/): Chứa các đặc tả yêu cầu, Context & Scope (`context-and-scope.md`), SRS chuẩn hóa (`srs.md`), và Use Case đặc tả checkout (`A2_T1.3_Checkout_Use_Case_Specification.md`).
- [`docs/diagrams/`](diagrams/): Chứa toàn bộ mã nguồn sơ đồ (`.puml`, `.drawio`, `.dot`), bản xuất vector (`.svg`, `.pdf`), script render tự động (`render_domain.py`, `render_deployment.py`) và các fragment LaTeX (`-figure.tex`).
- [`docs/architecture/`](architecture/): Chứa tổng quan kiến trúc hệ thống (`architecture.md`) và các Quyết định Kiến trúc (`adr/001-005.md`).
- [`docs/report/`](report/): Chứa mã nguồn báo cáo LaTeX (`sections/`, `assets/`, `main.tex` hoặc các fragment tích hợp).
- [`docs/a1-archive/`](a1-archive/): Kho lưu trữ bất biến (immutable snapshot) chứa 58 tạo phẩm kế thừa từ Assignment 1 (`A1-final`), được kiểm chứng bằng `PROVENANCE.md`.
- [`docs/TRACEABILITY.md`](TRACEABILITY.md): Ma trận truy vết liên kết toàn bộ tạo phẩm Task 1–3 với Jira Issue, PR và Commit.

## 2. Quy tắc và Hướng dẫn Cập nhật

1. **Không sao chép trùng lặp:** Những nội dung kỹ thuật đã có trong `docs/a1-archive/` không được sao chép nguyên bản sang tài liệu A2; mọi thay đổi phải nằm ngoài kho lưu trữ archive.
2. **Nguồn sơ đồ & Bản xuất:** Mọi sơ đồ trong `docs/diagrams/` phải có đầy đủ file nguồn (`.drawio` / `.puml`) và bản xuất vector (`.svg` / `.pdf`). Không gộp tất cả sơ đồ thành một file PDF duy nhất.
3. **Kiểm chứng liên kết:** Trước khi tạo Pull Request, chạy kiểm tra Git diff và kiểm tra liên kết Markdown để đảm bảo không có đường dẫn tương đối nào bị gãy sau khi di chuyển monorepo (`SCRUM-110`).
