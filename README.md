# AcademicBatchTranslate 学术论文批量翻译工具

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/GitHub-yangyh--2025%2Fdocument--translate-blue?style=flat-square" alt="GitHub"></a>
  <a href="https://pypi.org/project/academicbatchtranslate/"><img src="https://img.shields.io/pypi/v/academicbatchtranslate?style=flat-square" alt="PyPI version"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square" alt="Python Version"></a>
</p>

<p align="center">
  面向学术论文的批量翻译工具，基于大语言模型，专为科研人员高效阅读外文文献而优化
</p>

## 版权与许可声明

本项目基于 [xunbu/docutranslate](https://github.com/xunbu/docutranslate) 二次开发，原始版权归 QinHan 所有，采用 Mozilla Public License 2.0 (MPL-2.0) 开源。

- **原始项目版权**：© 2025 QinHan
- **二次开发**：© 2025 yangyh-2025
- **开源协议**：[MPL-2.0](https://opensource.org/licenses/MPL-2.0)

本项目在遵守 MPL-2.0 许可的基础上进行功能扩展与封装，未修改原始核心逻辑，所有修改部分与新增代码同样以 MPL-2.0 开源发布。

## 关于本项目

本项目基于 [xunbu/docutranslate](https://github.com/xunbu/docutranslate) 优化而来，遵循 MPL-2.0 开源许可证。我们在原项目的基础上，针对学术论文批量阅读场景进行了专门优化，让科研工作者能够更高效地阅读和理解外文文献。

### 主要特性

- 📄 **多格式支持**：支持 PDF、DOCX、XLSX、Markdown、TXT、JSON、EPUB、SRT、ASS、PPTX 等多种格式
- 📊 **智能 PDF 解析**：使用 MinerU 引擎进行 PDF 解析，特别优化对学术论文中表格、公式、代码的识别
- 📝 **自动术语表**：支持自动生成术语表，实现专业术语的一致性对齐
- 📋 **格式保持**：翻译 Word、Excel 文件时保持原格式不变
- 🔧 **JSON 翻译**：通过 JSONPath 指定需要翻译的节点
- 🤖 **多 AI 平台支持**：支持 OpenAI、智谱、阿里云、DeepSeek 等主流 AI 平台
- ⚡ **高性能并发**：异步架构，支持多任务并发翻译
- 🌐 **局域网共享**：支持在局域网中多人同时使用
- 🖥️ **Web 界面**：开箱即用的交互式 Web UI
- 🔌 **RESTful API**：完整的 API 接口，方便集成到其他系统

> ⚠️ **注意**：翻译 PDF 时会先转换为 Markdown，这会丢失原排版，对排版有严格要求的用户请注意。

---

## 快速开始

### 方式一：使用 pip 安装（推荐新手）

```bash
# 基础安装
pip install academicbatchtranslate

# 启动服务
academicbatchtranslate -i
```

安装完成后，浏览器访问 `http://127.0.0.1:8010` 即可使用。

### 方式二：从源码运行（推荐开发者）

#### 前置要求

- Python 3.11 或更高版本
- Node.js 18 或更高版本（用于前端构建）
- npm 包管理器

#### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd document-translate
```

2. **创建虚拟环境**

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

3. **安装 Python 依赖**

```bash
pip install -e .
```

4. **安装前端依赖**

```bash
cd frontend
npm install
cd ..
```

5. **构建前端**

```bash
cd frontend
npm run build
cd ..
```

6. **启动服务**

```bash
# 方式 A：使用一键启动脚本（推荐）
python run.py

# 方式 B：直接启动后端
python -m academicbatchtranslate.app
```

启动成功后，访问以下地址：
- 🌐 **主页面**：http://127.0.0.1:8010
- 📚 **API 文档**：http://127.0.0.1:8010/docs

---

## 使用指南

### 准备工作

#### 1. 获取大模型 API Key

翻译功能依赖大型语言模型，你需要从相应的 AI 平台获取以下信息：

- **Base URL**：API 接口地址
- **API Key**：访问密钥
- **Model ID**：模型名称

**推荐模型**：
- 智谱 AI：`glm-4-flash`（性价比高）
- 火山引擎：`doubao-seed-1-6-flash`
- 阿里云：`qwen-plus`
- DeepSeek：`deepseek-chat`
- OpenAI：`gpt-4o`

#### 2. 获取 MinerU Token（翻译 PDF 需要）

如果需要翻译 PDF 文件，推荐使用 MinerU 引擎：

- **在线方式**：访问 [minerU 官网](https://mineru.net/apiManage/token) 注册并申请免费 Token
- **本地部署**：参考 [MinerU 项目](https://github.com/opendatalab/MinerU) 进行本地部署

### Web 界面使用

1. **打开浏览器**访问 `http://127.0.0.1:8010`

2. **配置翻译参数**：
   - 填写 API Key、Base URL、模型 ID
   - 选择目标语言（如"中文"）
   - 选择文档解析引擎（PDF 选择 `mineru`）

3. **上传文件**：点击上传区域，选择要翻译的文件

4. **开始翻译**：点击开始按钮，等待翻译完成

5. **下载结果**：翻译完成后，可选择下载不同格式的结果

### API 接口使用

完整的 API 文档位于 `http://127.0.0.1:8010/docs`，以下是常用接口示例：

#### 提交翻译任务

```bash
curl -X POST "http://127.0.0.1:8010/service/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "paper.pdf",
    "file_content": "Base64编码的文件内容",
    "payload": {
      "workflow_type": "auto",
      "base_url": "https://api.openai.com/v1",
      "api_key": "sk-your-api-key",
      "model_id": "gpt-4o",
      "to_lang": "中文",
      "convert_engine": "mineru",
      "mineru_token": "your-mineru-token"
    }
  }'
```

#### 查询任务状态

```bash
curl "http://127.0.0.1:8010/service/status/{task_id}"
```

#### 下载翻译结果

```bash
curl "http://127.0.0.1:8010/service/download/{task_id}/html" \
  -o translated.html
```

### Python SDK 使用

```python
from academicbatchtranslate.sdk import Client

# 初始化客户端
client = Client(
    api_key="YOUR_API_KEY",
    base_url="https://api.openai.com/v1/",
    model_id="gpt-4o",
    to_lang="中文",
    concurrent=10,
)

# 翻译学术论文
result = client.translate(
    "path/to/paper.pdf",
    convert_engine="mineru",
    mineru_token="YOUR_MINERU_TOKEN",
    formula_ocr=True,
)

# 保存结果
result.save(fmt="html")
```

---

## 启动参数

```bash
academicbatchtranslate -i                           # 启动 Web 界面
academicbatchtranslate -i --host 0.0.0.0            # 允许局域网访问
academicbatchtranslate -i -p 8081                   # 指定端口
academicbatchtranslate -i --cors                    # 启用跨域
```

---

## 高级功能

### 术语表功能

启用术语表可确保专业术语翻译的一致性：

1. 在 Web 界面中上传术语表（CSV 格式）
2. 或设置 `glossary_generate_enable=True` 自动生成术语表

### 批量翻译

支持一次性翻译多个文件：

```bash
# 通过 API 上传多个文件
POST /service/translate/batch
```

### 自定义提示词

可以通过 `custom_prompt` 参数自定义翻译提示系统，以获得更符合特定领域需求的翻译效果。

---

## 常见问题

### Q: 翻译 PDF 后格式乱了怎么办？

A: PDF 翻译是基于 Markdown 转换的，会丢失原排版。建议：
- 使用 HTML 格式输出，用浏览器打开查看
- 或使用 Word 格式输出后手动调整排版

### Q: 如何提高翻译速度？

A: 可以增加 `concurrent` 参数（并发数），建议设置为 10-20 之间，具体取决于你的 API 限制。

### Q: 翻译过程中断开了怎么办？

A: 当前版本任务状态保存在内存中，服务重启后任务会丢失。建议使用 Python SDK 进行本地调用。

### Q: MinerU Token 获取失败怎么办？

A: 可以：
- 使用其他 PDF 解析引擎（如 `docling`）
- 或本地部署 MinerU 服务

---

## 项目结构

```
document-translate/
├── academicbatchtranslate/    # 核心代码
│   ├── app.py               # FastAPI 应用入口
│   ├── cli.py               # 命令行入口
│   ├── core/                # 核心逻辑
│   ├── exporter/            # 导出模块
│   └── translator/          # 翻译器
├── frontend/               # 前端代码
│   ├── src/               # React 源码
│   └── dist/              # 构建产物
├── run.py                 # 一键启动脚本
└── README.md              # 本文件
```

---

## 致谢

特别感谢 [xunbu/docutranslate](https://github.com/xunbu/docutranslate) 项目提供的基础框架。

---

## 许可证

MPL-2.0

---

**作者**：yangyh-2025  
**邮箱**：yangyuhang2667@163.com  
**项目地址**：https://github.com/yangyh-2025/document-translate
