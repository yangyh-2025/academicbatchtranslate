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
  面向学术论文的批量翻译工具，基于大语言模型，专为科研人员高效阅读外文文献而优化
</p>

## 关于本项目

本项目基于 [xunbu/docutranslate](https://github.com/xunbu/docutranslate) 优化而来，遵循 MPL-2.0 开源许可证。我们在原项目的基础上，针对学术论文批量阅读场景进行了专门优化，让科研工作者能够更高效地阅读和理解外文文献。

### 主要改进

- ✅ **针对学术论文优化**：更好地处理表格、公式、代码等学术元素
- ✅ **批量翻译支持**：支持同时处理多篇论文，提升工作效率
- ✅ **术语一致性**：自动生成和维护术语表，确保专业术语翻译统一
- ✅ **多格式支持**：PDF、DOCX、Markdown 等多种学术文档格式

## 功能特性

- 📄 **多格式支持**：翻译 `pdf`、`docx`、`xlsx`、`md`、`txt`、`json`、`epub`、`srt`、`ass` 等多种格式
- 📊 **PDF 智能解析**：使用 `mineru`（在线或本地部署）进行 PDF 解析，特别优化对学术论文中的表格、公式、代码的识别
- 📝 **自动术语表**：支持自动生成术语表，实现专业术语的一致性对齐
- 📋 **Word/Excel 格式保持**：翻译 `docx`、`xlsx` 文件时保持原格式不变
- 🔧 **JSON 翻译**：通过 jsonpath 指定 JSON 中需要翻译的值
- 🤖 **多 AI 平台支持**：支持绝大部分 AI 平台，自定义提示词，高性能并发翻译
- ⚡ **异步架构**：专为高性能场景设计的完整异步支持
- 🌐 **局域网多人使用**：支持在局域网中多人同时使用
- 🖥️ **交互式 Web 界面**：开箱即用的 Web UI 和 RESTful API
- 📦 **跨平台便携包**：不到 40MB 的 Windows、macOS 整合包

> 注意：翻译 PDF 时会先转换为 Markdown，这会丢失原排版，对排版有严格要求的用户请注意。

## 快速开始

### 使用 pip

```bash
# 基础安装
pip install academicbatchtranslate

# 安装 MCP 扩展
pip install academicbatchtranslate[mcp]

academicbatchtranslate -i
```

### 使用 uv

```bash
# 初始化环境
uv init

# 基础安装
uv add academicbatchtranslate

# 安装 MCP 扩展
uv add academicbatchtranslate[mcp]

uv run --no-dev academicbatchtranslate -i
```

### 使用 git

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd document-translate
uv sync --no-dev
```

## 启动 Web UI 和 API 服务

AcademicBatchTranslate 提供了功能齐全的 Web 界面和 RESTful API。

**启动服务：**

```bash
  academicbatchtranslate -i                           # 启动图形界面，默认本地访问
  academicbatchtranslate -i --host 0.0.0.0            # 允许局域网内其他设备访问
  academicbatchtranslate -i -p 8081                   # 指定端口号
  academicbatchtranslate -i --cors                    # 启用默认的跨域设置
  academicbatchtranslate -i --with-mcp                # 启动图形界面同时启用 MCP SSE 端点
  academicbatchtranslate --mcp                         # 启动 MCP 服务器，stdio 模式
  academicbatchtranslate --mcp --transport sse         # 启动 MCP 服务器，SSE 模式
```

- **交互式界面**：启动服务后，在浏览器中访问 `http://127.0.0.1:8010`
- **API 文档**：完整的 API 文档位于 `http://127.0.0.1:8010/docs`

## 使用 Client SDK (推荐)

使用 `Client` 类是开始翻译最简单的方式：

```python
from docutranslate.sdk import Client

# 使用您的 AI 平台设置初始化客户端
client = Client(
    api_key="YOUR_API_KEY",
    base_url="https://api.openai.com/v1/",
    model_id="gpt-4o",
    to_lang="中文",
    concurrent=10,
)

# 翻译学术论文 PDF
result = client.translate(
    "path/to/paper.pdf",
    convert_engine="mineru",
    mineru_token="YOUR_MINERU_TOKEN",
    formula_ocr=True,
)
result.save(fmt="html")
```

## 前提条件

### 1. 获取大模型 API Key

翻译功能依赖于大型语言模型，您需要从相应的 AI 平台获取 `base_url`、`api_key` 和 `model_id`。

推荐模型：火山引擎的 `doubao-seed-1-6-flash`、智谱的 `glm-4-flash`、阿里云的 `qwen-plus`、deepseek 的 `deepseek-chat` 等。

### 2. PDF 解析引擎

如果需要翻译 PDF 文件，推荐使用 minerU 引擎：

- **在线方式**：访问 [minerU 官网](https://mineru.net/apiManage/token) 注册并申请免费 Token
- **本地部署**：参考 [MinerU 项目](https://github.com/opendatalab/MinerU) 进行本地部署

## 致谢

特别感谢 [xunbu/docutranslate](https://github.com/xunbu/docutranslate) 项目提供的基础框架。

## 许可证

MPL-2.0

---

**作者**：yangyh-2025
**邮箱**：yangyuhang2667@163.com
**项目地址**：https://github.com/yangyh-2025/document-translate
