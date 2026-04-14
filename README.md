<!-- SPDX-FileCopyrightText: 2025 YangYuhang -->
<!-- SPDX-License-Identifier: MPL-2.0 -->

<p align="center">
  <img src="frontend/public/tubiao.png" alt="AcademicBatchTranslate Logo" width="200">
</p>

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/AcademicBatchTranslate-2.0.0-blue?style=flat-square" alt="Version"></a>
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/GitHub-yangyh--2025%2Fdocument--translate-28a745?style=flat-square&logo=github" alt="GitHub"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square" alt="Python Version"></a>
  <a href="https://opensource.org/licenses/MPL-2.0"><img src="https://img.shields.io/badge/License-MPL--2.0-orange?style=flat-square" alt="License"></a>
</p>

<h1 align="center">
  🎓 AcademicBatchTranslate
  <br>
  <span style="font-size: 0.6em; font-weight: normal;">
    学术论文批量翻译工具
  </span>
</h1>

<p align="center">
  <em>基于大语言模型，专为科研人员高效阅读外文文献而优化</em>
</p>

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate">🚀 快速访问项目</a> ·
  <a href="#-加入技术交流社群">💬 技术交流群</a> ·
  <a href="#-快速开始">⚡ 快速开始</a> ·
  <a href="#-web-界面功能">📱 功能介绍</a>
</p>

---

## 🌟 项目简介

AcademicBatchTranslate 是一款面向科研人员的批量翻译工具，利用先进的大语言模型技术，帮助您快速理解和阅读外文学术文献。

✨ **核心特性**：

- 📄 **多格式支持** - PDF、Word、Markdown、Excel、PPTX 等多种文档格式
- 🎯 **术语一致性** - 自定义术语表，确保专业术语翻译准确统一
- ⚡ **批量处理** - 一次性上传多个文档，并行翻译，高效省时
- 🌐 **多平台兼容** - 支持 OpenAI、智谱 AI、DeepSeek、阿里云等主流 AI 平台
- 🔒 **本地化部署** - 支持本地模型（如 Ollama），保护数据隐私
- 💻 **Web 界面** - 直观易用的 Web 界面，无需编程基础

---

## 📢 加入技术交流社群

<div align="center">

关注微信公众号 **「文科生的自我拯救」**，后台回复 **「交流群」** 即可加入我们的技术交流群。

在群内您可以：

| 功能 | 描述 |
|------|------|
| 💬 | 与其他科研人员交流使用心得 |
| 🐛 | 反馈问题与获取技术支持 |
| 📢 | 获取最新功能更新通知 |
| 🤝 | 参与项目共建与改进 |

</div>

<div align="center">
  <img src="frontend/public/mp_code.jpg" alt="公众号二维码" width="200">
</div>

---

## 🚀 快速开始

### 📦 安装部署

```bash
# 1️⃣ 下载项目
git clone https://github.com/yangyh-2025/document-translate.git
cd document-translate

# 2️⃣ 安装后端
pip install -e .

# 3️⃣ 安装前端
cd frontend
npm install
npm run build
cd ..

# 4️⃣ 启动服务
python -m academicbatchtranslate.app
```

### 🌐 访问界面

启动成功后，在浏览器中访问：

```
http://127.0.0.1:8010
```

🎉 **就这么简单！** 5 步即可开始翻译您的学术文档。

### 🌍 局域网访问

如需让局域网内其他设备访问：

```bash
python -m academicbatchtranslate.app --host
```

然后在其他设备的浏览器中访问：`http://你的IP地址:8010`

---

## 📱 Web 界面功能

### 1️⃣ 批量翻译

<div align="center">

批量翻译页面用于上传多个文档进行翻译，支持实时进度跟踪。

</div>

#### 📋 操作步骤

1. 点击上传区域或拖放文件
2. 等待文件上传完成
3. 点击「开始批量翻译」按钮
4. 翻译完成后点击「下载结果」下载 ZIP 包

#### 📁 支持的文件格式

| 格式 | 说明 |
|------|------|
| 📄 PDF | 学术论文（需配置 MinerU Token）|
| 📝 Markdown | .md 文件 |
| 📃 Word | .docx 文档 |
| 📊 Excel | .xlsx 表格 |
| 📜 纯文本 | .txt 文件 |
| 🎬 SRT 字幕 | .srt 字幕文件 |
| 📚 EPUB | .epub 电子书 |
| 🌐 HTML | .html 网页 |
| 📽️ PPTX | .pptx 演示文稿 |
| 🎭 ASS 字幕 | .ass 字幕文件 |
| 📋 JSON | .json 数据文件 |

#### 🛠️ 功能说明

| 功能 | 说明 |
|------|------|
| 📤 文件上传 | 支持拖放或点击上传多个文件 |
| 👀 文件预览 | 显示已上传文件的列表和状态 |
| 🏷️ 文件名预览 | 预览翻译后的文件名 |
| 📊 进度显示 | 实时显示每个文件的翻译进度百分比 |
| 📦 批量下载 | 翻译完成后一键打包下载所有结果 |
| 🗑️ 清空文件 | 一键清除所有已上传的文件 |

---

### 2️⃣ 术语表

<div align="center">

术语表用于确保专业术语翻译的一致性，是提高翻译质量的重要工具。

</div>

#### 💡 术语表的作用

- **术语统一**：确保同一术语在整个文档中翻译一致
- **专业准确**：手动指定专业术语的标准译文
- **避免误译**：防止 AI 对多义词进行错误翻译

#### 📋 术语表格式

```csv
Source,Target
Abstract,摘要
Methodology,方法论
Machine Learning,机器学习
Neural Network,神经网络
Transformer,Transformer
```

#### 📝 格式要求

- ✅ 第一列必须是 `Source`（原文）
- ✅ 第二列必须是 `Target`（译文）
- ✅ 编码为 UTF-8，支持中文
- ✅ 每行一个术语对照

#### 🛠️ 使用方法

| 方法 | 操作 |
|------|------|
| ✍️ 手动添加 | 在表格底部输入原文和译文，点击「添加术语」 |
| 📥 CSV 导入 | 拖放 CSV 文件到指定区域，自动解析并加载 |
| 📤 CSV 导出 | 点击「导出 CSV」按钮，下载备份文件 |
| 🤖 AI 自动提取 | 点击「自动生成术语」，让 AI 从文本中提取关键术语 |

#### ⚠️ 注意事项

- 术语表中已有的术语会覆盖自动翻译结果
- 建议为每个翻译任务准备专属的术语表
- 可以在 Excel 中编辑 CSV，但保存时注意选择 UTF-8 编码

---

### 3️⃣ 历史记录

<div align="center">

历史记录页面用于查看之前的翻译任务（功能开发中）

</div>

#### 🔮 计划功能

- 📜 查看所有翻译任务的历史记录
- 📥 重新下载历史任务的结果
- 🗑️ 删除不需要的历史记录

---

### 4️⃣ 设置

<div align="center">

设置页面用于配置翻译相关的各种参数。

</div>

#### 🔑 API 配置

| 参数 | 说明 | 示例 |
|------|------|------|
| **API Base URL** | AI 模型的 API 基础地址 | `https://api.openai.com/v1` |
| **API Key** | AI 模型的访问密钥 | `sk-xxxxxxxxxxxxxxxx` |
| **Model ID** | 使用的 AI 模型名称 | `gpt-4o`、`glm-4-air` |
| **目标语言** | 翻译的目标语言 | `中文`、`English`、`日本語` |

#### 🌐 支持的 AI 平台

| 平台 | Base URL | 推荐模型 |
|------|----------|----------|
| 🔵 OpenAI | `https://api.openai.com/v1` | `gpt-4o`、`gpt-4o-mini` |
| 🟣 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-air`、`glm-4-flash` |
| 🔷 DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat`、`deepseek-v3` |
| 🟠 阿里云 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus`、`qwen-turbo` |
| 🟢 Ollama（本地） | `http://localhost:11434/v1` | `qwen2.5:7b`、`llama3:8b` |

💡 **提示**：所有敏感信息（API Key、Token）都支持显示/隐藏切换，方便查看和编辑。

---

#### ⚙️ 参数配置

| 参数 | 说明 | 推荐值 | 调整建议 |
|------|------|--------|----------|
| **分块大小** | 每次翻译的字符数 | `1000` | 文档复杂时调小，简单文本可调大 |
| **并发数** | 同时翻译的块数 | `5` | 网络好且 API 限制高时调大 |
| **温度** | 控制翻译的随机性 | `0.3` | 翻译建议保持较低值 |
| **Top P** | 核采样参数 | `0.9` | 通常保持默认值 |

#### 📖 参数详解

- **分块大小**：将文档切分成小块进行翻译。值太小会增加请求次数，太大可能超出模型上下文限制。学术论文建议 1000-2000。
- **并发数**：同时发送的翻译请求数量。值越大速度越快，但会增加 API 消耗。
- **温度**：控制翻译的创造性。0 代表完全确定性翻译，1 代表高度随机性。翻译学术文献建议使用 0.2-0.4。
- **Top P**：另一种控制随机性的方法，通常与温度配合使用。保持默认值即可。

---

#### 🔧 MinerU 配置（PDF 翻译必需）

| 参数 | 说明 |
|------|------|
| **MinerU Token** | 解析 PDF 文件必需的 API Token |

#### 📝 如何获取 MinerU Token

1. 访问 [MinerU 官网](https://mineru.net/apiManage/token)
2. 注册账号并登录
3. 申请免费 Token（通常有一定额度）
4. 将 Token 复制到设置页面

⚠️ **重要提示**：
- 翻译 PDF 文件时必须配置此参数
- Token 有使用配额限制，用完需要重新申请
- 也可以本地部署 MinerU 服务使用

---

#### 🏷️ 文件名配置

控制翻译后输出文件的命名方式。

#### 📌 配置方式

| 模式 | 说明 | 示例 |
|------|------|------|
| **前缀 + 后缀** | 在原文件名前后添加内容 | 前缀 `translated_`，后缀 `_zh` → `translated_paper_zh.pdf` |
| **自定义模式** | 使用占位符自定义格式 | `{original}_{timestamp}` → `paper_1712345678.pdf` |

#### 🔤 可用占位符

- `{original}`：原文件名（不含扩展名）
- `{timestamp}`：当前时间戳

#### 💡 使用场景

- 需要区分原文和译文：添加后缀如 `_zh` 或 `_translated`
- 需要包含时间信息：使用 `{timestamp}` 占位符
- 需要自定义前缀：如按项目添加前缀 `project1_`

---

## ❓ 常见问题

### Q1: 翻译 PDF 失败怎么办？

✅ **解决方案**：
1. 确保已在设置中配置 MinerU Token
2. 检查 Token 配额是否用完
3. 确认文件大小在 MinerU 支持范围内（通常几十 MB 以内）

---

### Q2: 如何使用本地模型（如 Ollama）？

✅ **配置参数**：
- Base URL: `http://localhost:11434/v1`
- API Key: `ollama`（任意字符串都行）
- Model ID: 你的模型名称，如 `qwen2.5:7b`

---

### Q3: 翻译速度慢怎么办？

✅ **优化建议**：
1. 增加「并发数」参数（如从 5 调到 10）
2. 使用速度更快的模型（如 gpt-4o-mini）
3. 检查网络连接是否稳定

---

### Q4: 如何提高翻译质量？

✅ **质量提升技巧**：
1. 使用较大的模型（如 GPT-4、DeepSeek-V3）
2. 降低「温度」参数（设为 0.3 或更低）
3. 准备专业的术语表
4. 对于特别重要的文档，考虑人工校对

---

### Q5: 术语表导入失败怎么办？

✅ **检查清单**：
1. CSV 文件编码是否为 UTF-8
2. 第一列是否为 `Source`，第二列是否为 `Target`
3. 文件中是否包含特殊字符或格式错误

---

### Q6: 支持 Excel 的指定区域翻译吗？

✅ **当前状态**：Web 界面暂不支持指定区域，但 API 接口支持。完整翻译 Excel 文件会保留原有格式。

---

### Q7: 翻译过程中可以关闭浏览器吗？

✅ **可以关闭浏览器**，但请**不要关闭**运行服务的终端窗口。翻译任务在服务器端继续执行，重新打开浏览器后可以看到进度。

---

### Q8: 如何允许局域网内其他电脑访问？

✅ **启动命令**：
```bash
python -m academicbatchtranslate.app --host
```
然后在局域网内其他设备访问：`http://你的IP地址:8010`

---

## 📄 版权与许可声明

<div align="center">

本项目基于 [docutranslate](https://github.com/xunbu/docutranslate) 二次开发，原始版权归 QinHan 所有，采用 Mozilla Public License 2.0 (MPL-2.0) 开源。

| 项目 | 版权 | 协议 |
|------|------|------|
| 原始项目 | © 2025 QinHan | MPL-2.0 |
| 二次开发与封装 | © 2025 YangYuhang | MPL-2.0 |

本项目在遵守 MPL-2.0 许可的基础上进行功能扩展与封装，未修改原始核心逻辑，所有修改部分与新增代码同样以 MPL-2.0 开源发布。

[📜 MPL-2.0 许可协议](https://opensource.org/licenses/MPL-2.0)

</div>

---

<div align="center">

遇到问题？欢迎在 [GitHub 上提 Issue](https://github.com/yangyh-2025/document-translate/issues)！🐛

如果这个项目对您有帮助，请给一个 ⭐️ Star 支持一下！💖

Made with ❤️ by YangYuhang

</div>
