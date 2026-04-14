// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useState } from 'react'
import { FiHelpCircle, FiX } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const README_CONTENT = `# AcademicBatchTranslate 学术论文批量翻译工具

---

### 点击快速访问项目网站：[AcademicBatchtranslate](https://github.com/yangyh-2025/document-translate)

面向学术论文的批量翻译工具，基于大语言模型，专为科研人员高效阅读外文文献而优化

---

## 快速开始（傻瓜式部署）

### 安装

1. **下载项目**
   \`\`\`bash
   git clone https://github.com/yangyh-2025/document-translate.git
   cd document-translate
   \`\`\`

2. **安装后端**
   \`\`\`bash
   pip install -e .
   \`\`\`

3. **安装前端**
   \`\`\`bash
   cd frontend
   npm install
   npm run build
   cd ..
   \`\`\`

4. **启动**
   \`\`\`bash
   python -m academicbatchtranslate.app
   \`\`\`

5. **打开浏览器**

   访问 \`http://127.0.0.1:8010\`

就这么简单！

---

## Web 界面功能

### 1. 批量翻译

批量翻译页面用于上传多个文档进行翻译，支持实时进度跟踪。

**操作步骤**：

1. 点击上传区域或拖放文件
2. 等待文件上传完成
3. 点击「开始批量翻译」按钮
4. 翻译完成后点击「下载结果」下载 ZIP 包

**功能说明**：

| 功能 | 说明 |
|------|------|
| 文件上传 | 支持拖放或点击上传多个文件 |
| 文件预览 | 显示已上传文件的列表和状态 |
| 文件名预览 | 预览翻译后的文件名（基于设置中的文件名规则） |
| 进度显示 | 实时显示每个文件的翻译进度百分比 |
| 批量下载 | 翻译完成后一键打包下载所有结果 |
| 清空文件 | 一键清除所有已上传的文件 |

**支持的文件格式**：
- PDF（需要配置 MinerU Token）
- Markdown (.md)
- Word (.docx)
- Excel (.xlsx)
- 纯文本 (.txt)
- SRT 字幕 (.srt)
- EPUB 电子书 (.epub)
- HTML (.html)
- PPTX 演示文稿 (.pptx)
- ASS 字幕 (.ass)
- JSON (.json)

---

### 2. 术语表

术语表用于确保专业术语翻译的一致性，是提高翻译质量的重要工具。

**术语表的作用**：

- **术语统一**：确保同一术语在整个文档中翻译一致
- **专业准确**：手动指定专业术语的标准译文
- **避免误译**：防止 AI 对多义词进行错误翻译

**术语表格式**：

术语表使用 CSV 格式，包含两列：

\`\`\`csv
Source,Target
Abstract,摘要
Methodology,方法论
Machine Learning,机器学习
Neural Network,神经网络
Transformer,Transformer
\`\`\`

**格式要求**：
- 第一列必须是 \`Source\`（原文）
- 第二列必须是 \`Target\`（译文）
- 编码为 UTF-8，支持中文
- 每行一个术语对照

**使用方法**：

#### 方法一：手动添加

1. 进入「术语表」页面
2. 在表格底部的输入框中填写原文和译文
3. 点击「添加术语」按钮
4. 术语会立即保存到列表中

#### 方法二：CSV 导入

1. 准备符合格式的 CSV 文件
2. 将文件拖放到「拖放CSV文件导入术语表」区域
3. 系统会自动解析并加载术语

#### 方法三：CSV 导出

1. 在术语表页面添加或编辑术语
2. 点击「导出CSV」按钮
3. 下载的 CSV 文件可用于备份或分享

#### 方法四：AI 自动提取（实验功能）

1. 在术语表页面点击「自动生成术语」按钮
2. 配置 AI 模型参数（与翻译配置相同）
3. 输入源文本片段
4. 点击「开始生成」让 AI 提取关键术语

**注意事项**：

- 术语表中已有的术语会覆盖自动翻译结果
- 建议为每个翻译任务准备专属的术语表
- 可以在 CSV 中使用 Excel 编辑，但保存时注意选择 UTF-8 编码

---

### 3. 历史记录

历史记录页面用于查看之前的翻译任务（功能开发中）。

**计划功能**：

- 查看所有翻译任务的历史记录
- 重新下载历史任务的结果
- 删除不需要的历史记录

---

### 4. 设置

设置页面用于配置翻译相关的各种参数。

#### API 配置

| 参数 | 说明 | 示例 |
|------|------|------|
| **API Base URL** | AI 模型的 API 基础地址 | \`https://api.openai.com/v1\` |
| **API Key** | AI 模型的访问密钥 | \`sk-xxxxxxxxxxxxxxxx\` |
| **Model ID** | 使用的 AI 模型名称 | \`gpt-4o\`、\`glm-4-air\`、\`deepseek-chat\` |
| **目标语言** | 翻译的目标语言 | \`中文\`、\`English\`、\`日本語\` |

**支持的 AI 平台**：

| 平台 | Base URL | 推荐模型 |
|------|----------|----------|
| OpenAI | \`https://api.openai.com/v1\` | \`gpt-4o\`、\`gpt-4o-mini\` |
| 智谱AI | \`https://open.bigmodel.cn/api/paas/v4\` | \`glm-4-air\`、\`glm-4-flash\` |
| DeepSeek | \`https://api.deepseek.com/v1\` | \`deepseek-chat\`、\`deepseek-v3\` |
| 阿里云 | \`https://dashscope.aliyuncs.com/compatible-mode/v1\` | \`qwen-plus\`、\`qwen-turbo\` |
| Ollama（本地） | \`http://localhost:11434/v1\` | \`qwen2.5:7b\`、\`llama3:8b\` |

**提示**：所有敏感信息（API Key、Token）都支持显示/隐藏切换，方便查看和编辑。

---

#### 参数配置

| 参数 | 说明 | 推荐值 | 调整建议 |
|------|------|--------|----------|
| **分块大小** | 每次翻译的字符数 | \`1000\` | 文档复杂时调小，简单文本可调大 |
| **并发数** | 同时翻译的块数 | \`5\` | 网络好且 API 限制高时调大 |
| **温度** | 控制翻译的随机性，0 更确定，1 更随机 | \`0.3\` | 翻译建议保持较低值 |
| **Top P** | 核采样参数，与温度二选一 | \`0.9\` | 通常保持默认值 |

**参数详解**：

- **分块大小**：将文档切分成小块进行翻译。值太小会增加请求次数，太大可能超出模型上下文限制。学术论文建议 1000-2000。
- **并发数**：同时发送的翻译请求数量。值越大速度越快，但会增加 API 消耗。建议根据 API 的速率限制调整。
- **温度**：控制翻译的创造性。0 代表完全确定性翻译，1 代表高度随机性。翻译学术文献建议使用 0.2-0.4。
- **Top P**：另一种控制随机性的方法，通常与温度配合使用。保持默认值即可。

---

#### MinerU 配置（PDF 翻译必需）

| 参数 | 说明 |
|------|------|
| **MinerU Token** | 解析 PDF 文件必需的 API Token |

**如何获取 MinerU Token**：

1. 访问 [MinerU 官网](https://mineru.net/apiManage/token)
2. 注册账号并登录
3. 申请免费 Token（通常有一定额度）
4. 将 Token 复制到设置页面

**重要提示**：
- 翻译 PDF 文件时必须配置此参数
- Token 有使用配额限制，用完需要重新申请
- 也可以本地部署 MinerU 服务使用

---

#### 文件名配置

控制翻译后输出文件的命名方式。

**配置方式**：

有两种方式可以配置输出文件名：

1. **前缀 + 后缀模式**（默认）：
   - 在原文件名前添加前缀
   - 在原文件名后添加后后缀
   - 例如：原文件 \`paper.pdf\`，前缀 \`translated_\`，后缀 \`_zh\`，输出为 \`translated_paper_zh.pdf\`

2. **自定义模式**：
   - 使用占位符自定义文件名格式
   - 可用占位符：
     - \`{original}\`：原文件名（不含扩展名）
     - \`{timestamp}\`：当前时间戳
   - 例如：\`{original}_{timestamp}\` 会生成 \`paper_1712345678.pdf\`

**使用场景**：
- 需要区分原文和译文：添加后缀如 \`_zh\` 或 \`_translated\`
- 需要包含时间信息：使用 \`{timestamp}\` 占位符
- 需要自定义前缀：如按项目添加前缀 \`project1_\`

---

## 常见问题

### Q1: 翻译PDF失败怎么办？

A: 请确保：
1. 已在设置中配置 MinerU Token
2. Token 配额未用完
3. 文件大小在 MinerU 支持范围内（通常几十MB以内）

### Q2: 如何使用本地模型（如 Ollama）？

A: 配置参数如下：
- Base URL: \`http://localhost:11434/v1\`
- API Key: \`ollama\`（任意字符串都行）
- Model ID: 你的模型名称，如 \`qwen2.5:7b\`

### Q3: 翻译速度慢怎么办？

A: 可以尝试：
1. 增加「并发数」参数（如从 5 调到 10）
2. 使用速度更快的模型（如 gpt-4o-mini）
3. 检查网络连接是否稳定

### Q4: 如何提高翻译质量？

A: 建议：
1. 使用较大的模型（如 GPT-4、DeepSeek-V3）
2. 降低「温度」参数（设为 0.3 或更低）
3. 准备专业的术语表
4. 对于特别重要的文档，考虑人工校对

### Q5: 术语表导入失败怎么办？

A: 检查：
1. CSV 文件编码是否为 UTF-8
2. 第一列是否为 \`Source\`，第二列是否为 \`Target\`
3. 文件中是否包含特殊字符或格式错误

### Q6: 支持 Excel 的指定区域翻译吗？

A: 当前 Web 界面暂不支持指定区域，但 API 接口支持。完整翻译 Excel 文件会保留原有格式。

### Q7: 翻译过程中可以关闭浏览器吗？

A: 可以关闭浏览器，但请**不要关闭**运行服务的终端窗口。翻译任务在服务器端继续执行，重新打开浏览器后可以看到进度。

### Q8: 如何允许局域网内其他电脑访问？

A: 启动服务时使用以下命令：
\`\`\`bash
python -m academicbatchtranslate.app --host
\`\`\`
然后局域网内其他电脑访问 \`http://你的IP地址:8010\` 即可。

---

## 版权与许可声明

本项目基于 [docutranslate](https://github.com/xunbu/docutranslate) 二次开发，原始版权归 QinHan 所有，采用 Mozilla Public License 2.0 (MPL-2.0) 开源。

- **原始项目版权**：© 2025 QinHan
- **二次开发与封装**：© 2025 YangYuhang
- **开源协议**：[MPL-2.0](https://opensource.org/licenses/MPL-2.0)

本项目在遵守 MPL-2.0 许可的基础上进行功能扩展与封装，未修改原始核心逻辑，所有修改部分与新增代码同样以 MPL-2.0 开源发布。

遇到问题？欢迎在 GitHub 上提 Issue！`

export function Header() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src="./tubiao.png" alt="图标" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">AcademicBatchTranslate</h1>
            <p className="text-xs text-neutral-500">学术论文批量翻译</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => setShowHelp(true)}
          >
            <FiHelpCircle className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-8 lg:p-12"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">使用说明</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-8 sm:p-12 lg:p-16 prose prose-neutral prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4 scroll-mt-24">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4 scroll-mt-24">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3 scroll-mt-24">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-neutral-700 mt-6 mb-2 scroll-mt-24">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-neutral-700 mb-4 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-6 space-y-2 text-neutral-700">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const isInline = !className || className === 'language-undefined'
                      if (isInline) {
                        return (
                          <code
                            className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded font-mono text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code
                          className="block bg-neutral-900 text-neutral-100 p-4 rounded-lg my-6 overflow-x-auto font-mono text-sm leading-relaxed"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="mb-6">{children}</pre>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-neutral-900">{children}</strong>
                    ),
                    hr: () => (
                      <hr className="my-8 border-t-2 border-neutral-200" />
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-neutral-300 pl-4 py-2 my-6 bg-neutral-50 rounded-r-lg text-neutral-700">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-neutral-200">
                        <table className="min-w-full divide-y divide-neutral-200">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-neutral-50">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-white divide-y divide-neutral-200">{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr>{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-6 py-3 text-sm text-neutral-700">{children}</td>
                    ),
                  }}
                >
                  {README_CONTENT}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
