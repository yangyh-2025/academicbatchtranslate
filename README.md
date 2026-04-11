# AcademicBatchTranslate

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/GitHub-yangyh--2025%2Fdocument--translate-blue?style=flat-square" alt="GitHub"></a>
  <a href="https://pypi.org/project/academicbatchtranslate/"><img src="https://img.shields.io/pypi/v/academicbatchtranslate?style=flat-square" alt="PyPI version"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square" alt="Python Version"></a>
</p>

<p align="center">
  <a href="/README_ZH.md"><strong>简体中文</strong></a> / <a href="/README.md"><strong>English</strong></a>
</p>

<p align="center">
  A batch translation tool for academic papers, based on large language models, optimized for researchers to efficiently read foreign literature
</p>

## About This Project

This project is optimized based on [xunbu/docutranslate](https://github.com/xunbu/docutranslate), following the MPL-2.0 open-source license. Building upon the original project, we have specifically optimized for the academic paper batch reading scenario, enabling researchers to read and understand foreign literature more efficiently.

### Key Improvements

- ✅ **Optimized for Academic Papers**: Better handling of tables, formulas, code, and other academic elements
- ✅ **Batch Translation Support**: Process multiple papers simultaneously to improve work efficiency
- ✅ **Terminology Consistency**: Automatically generate and maintain glossaries for consistent professional terminology translation
- ✅ **Multi-format Support**: PDF, DOCX, Markdown, and many other academic document formats

## Features

- 📄 **Multi-format Support**: Translate `pdf`, `docx`, `xlsx`, `md`, `txt`, `json`, `epub`, `srt`, `ass`, and more
- 📊 **Smart PDF Parsing**: Use `mineru` (online or local deployment) for PDF parsing, specially optimized for recognizing tables, formulas, and code in academic papers
- 📝 **Automatic Glossary**: Support automatic glossary generation for consistent professional terminology
- 📋 **Word/Excel Format Preservation**: Translate `docx`, `xlsx` files while preserving original formatting
- 🔧 **JSON Translation**: Specify values to translate in JSON via jsonpath
- 🤖 **Multi-AI Platform Support**: Support most AI platforms with custom prompts and high-performance concurrent translation
- ⚡ **Async Architecture**: Full async support designed for high-performance scenarios
- 🌐 **LAN Multi-user Support**: Support multiple simultaneous users over local network
- 🖥️ **Interactive Web UI**: Out-of-the-box Web UI and RESTful API
- 📦 **Cross-platform Portable Builds**: <40MB Windows and macOS packages

> Note: When translating PDFs, they are first converted to Markdown, which loses original formatting. Users with strict formatting requirements please note.

## Quick Start

### Using pip

```bash
# Basic installation
pip install academicbatchtranslate

# Install MCP extension
pip install academicbatchtranslate[mcp]

academicbatchtranslate -i
```

### Using uv

```bash
# Initialize environment
uv init

# Basic installation
uv add academicbatchtranslate

# Install MCP extension
uv add academicbatchtranslate[mcp]

uv run --no-dev academicbatchtranslate -i
```

### Using git

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd document-translate
uv sync --no-dev
```

## Starting Web UI and API Service

AcademicBatchTranslate provides a full-featured web interface and RESTful API.

**Start service:**

```bash
  academicbatchtranslate -i                           # Start GUI, default local access
  academicbatchtranslate -i --host 0.0.0.0            # Allow access from other devices on LAN
  academicbatchtranslate -i -p 8081                   # Specify port number
  academicbatchtranslate -i --cors                    # Enable default CORS settings
  academicbatchtranslate -i --with-mcp                # Start GUI with MCP SSE endpoint
  academicbatchtranslate --mcp                         # Start MCP server, stdio mode
  academicbatchtranslate --mcp --transport sse         # Start MCP server, SSE mode
```

- **Interactive Interface**: After starting the service, visit `http://127.0.0.1:8010` in your browser
- **API Documentation**: Complete API documentation at `http://127.0.0.1:8010/docs`

## Using Client SDK (Recommended)

Using the `Client` class is the easiest way to start translating:

```python
from docutranslate.sdk import Client

# Initialize client with your AI platform settings
client = Client(
    api_key="YOUR_API_KEY",
    base_url="https://api.openai.com/v1/",
    model_id="gpt-4o",
    to_lang="English",
    concurrent=10,
)

# Translate academic paper PDF
result = client.translate(
    "path/to/paper.pdf",
    convert_engine="mineru",
    mineru_token="YOUR_MINERU_TOKEN",
    formula_ocr=True,
)
result.save(fmt="html")
```

## Prerequisites

### 1. Get LLM API Key

Translation functionality depends on large language models. You need to obtain `base_url`, `api_key`, and `model_id` from the appropriate AI platform.

Recommended models: Volcano Engine's `doubao-seed-1-6-flash`, Zhipu's `glm-4-flash`, Alibaba's `qwen-plus`, deepseek's `deepseek-chat`, etc.

### 2. PDF Parsing Engine

If you need to translate PDF files, we recommend using the minerU engine:

- **Online**: Visit [minerU website](https://mineru.net/apiManage/token) to register and apply for a free token
- **Local Deployment**: Refer to the [MinerU project](https://github.com/opendatalab/MinerU) for local deployment

## Acknowledgments

Special thanks to the [xunbu/docutranslate](https://github.com/xunbu/docutranslate) project for providing the foundation.

## License

MPL-2.0

---

**Author**: yangyh-2025
**Email**: yangyuhang2667@163.com
**Project**: https://github.com/yangyh-2025/document-translate
