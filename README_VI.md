<p align="center">
<img src="./DocuTranslate.png" alt="Project Logo" style="width: 150px">
</p>

<h1 align="center">DocuTranslate</h1>

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/GitHub-yangyh--2025%2Fdocument--translate-blue?style=flat-square" alt="GitHub"></a>
  <a href="https://pypi.org/project/docutranslate/"><img src="https://img.shields.io/pypi/v/docutranslate?style=flat-square" alt="PyPI version"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square" alt="Python Version"></a>
</p>

<p align="center">
  <a href="/README.md"><strong>English</strong></a> / <a href="/README_ZH.md"><strong>简体中文</strong></a> / <a href="/README_JP.md"><strong>日本語</strong></a> / <a href="/README_VI.md"><strong>Tiếng Việt</strong></a>
</p>

<p align="center">
  Công cụ dịch tài liệu cục bộ nhẹ dựa trên các mô hình ngôn ngữ lớn
</p>

## Tính năng

- ✅ **Hỗ trợ nhiều định dạng**: Dịch `pdf`, `docx`, `xlsx`, `md`, `txt`, `json`, `epub`, `srt`, `ass` và nhiều hơn nữa
- ✅ **Tạo bảng thuật ngữ tự động**: Hỗ trợ tạo bảng thuật ngữ tự động để căn chỉnh thuật ngữ
- ✅ **Nhận dạng bảng, công thức, mã PDF**: Sử dụng `mineru` (trực tuyến hoặc triển khai cục bộ) để phân tích PDF
- ✅ **Dịch JSON**: Hỗ trợ chỉ định các giá trị cần dịch trong JSON thông qua jsonpath
- ✅ **Bảo tồn định dạng Word/Excel**: Dịch các tệp `docx`, `xlsx` trong khi vẫn giữ nguyên định dạng gốc
- ✅ **Hỗ trợ nhiều nền tảng AI**: Hỗ trợ hầu hết các nền tảng AI với lời nhắc tùy chỉnh và dịch đồng thời hiệu suất cao
- ✅ **Hỗ trợ không đồng bộ**: Hỗ trợ không đồng bộ đầy đủ được thiết kế cho các kịch bản hiệu suất cao
- ✅ **Hỗ trợ nhiều người dùng/LAN**: Hỗ trợ nhiều người dùng đồng thời trên mạng cục bộ
- ✅ **Web UI tương tác**: Web UI và RESTful API sẵn sàng sử dụng
- ✅ **Kích thước nhỏ, bản di động đa nền tảng**: Các gói Windows và macOS <40MB

## Bắt đầu nhanh

### Sử dụng pip

```bash
# Cài đặt cơ bản
pip install docutranslate

# Cài đặt tiện ích mở rộng MCP
pip install docutranslate[mcp]

docutranslate -i
```

### Sử dụng git

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd docutranslate
uv sync --no-dev
```

## Tài liệu

**Vui lòng tham khảo [README_ZH.md](./README_ZH.md) để có tài liệu đầy đủ bằng tiếng Trung.**

## Giấy phép

MPL-2.0

---

**Tác giả**: yangyh-2025  
**Email**: yangyuhang2667@163.com  
**Dự án**: https://github.com/yangyh-2025/document-translate
