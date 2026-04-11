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
  A lightweight local document translation tool based on large language models
</p>

## Features

- ✅ **Multi-format support**: Translate `pdf`, `docx`, `xlsx`, `md`, `txt`, `json`, `epub`, `srt`, `ass` and more
- ✅ **Automatic glossary generation**: Support automatic glossary generation for term alignment
- ✅ **PDF table, formula, code recognition**: Use `mineru` (online or local deployment) for PDF parsing
- ✅ **JSON translation**: Support specifying values to translate in JSON via jsonpath
- ✅ **Word/Excel format preservation**: Translate `docx`, `xlsx` files while preserving original formatting
- ✅ **Multi-AI platform support**: Support most AI platforms with custom prompts and high-performance concurrent translation
- ✅ **Async support**: Full async support designed for high-performance scenarios
- ✅ **LAN/multi-user support**: Support multiple simultaneous users over local network
- ✅ **Interactive Web UI**: Out-of-the-box Web UI and RESTful API
- ✅ **Small footprint, multi-platform portable builds**: <40MB Windows and macOS packages

## Quick Start

### Using pip

```bash
# Basic installation
pip install docutranslate

# Install MCP extension
pip install docutranslate[mcp]

docutranslate -i
```

### Using git

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd docutranslate
uv sync --no-dev
```

## Documentation

**Please refer to [README_ZH.md](./README_ZH.md) for complete documentation in Chinese.**

## License

MPL-2.0

---

**Author**: yangyh-2025  
**Email**: yangyuhang2667@163.com  
**Project**: https://github.com/yangyh-2025/document-translate
