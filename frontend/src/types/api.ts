// Workflow Types
export type WorkflowType =
  | 'auto'
  | 'markdown_based'
  | 'txt'
  | 'json'
  | 'xlsx'
  | 'docx'
  | 'srt'
  | 'epub'
  | 'html'
  | 'ass'
  | 'pptx'

export type InsertMode = 'replace' | 'append' | 'prepend'
export type ThinkingMode = 'default' | 'enable' | 'disable'
export type ProviderType = 'openai' | 'anthropic' | 'azure' | 'google' | 'deepseek' | 'ollama' | 'custom'
export type ConvertEngine = 'identity' | 'mineru' | 'docling' | 'mineru_deploy'
export type MineruLanguage = 'ch' | 'ch_server' | 'en' | 'japan' | 'korean' | 'chinese_cht' | 'ta' | 'te' | 'ka' | 'el' | 'th' | 'latin' | 'arabic' | 'cyrillic' | 'east_slavic' | 'devanagari'
export type MineruDeployBackend = 'pipeline' | 'vlm-auto-engine' | 'vlm-http-client' | 'hybrid-auto-engine' | 'hybrid-http-client'
export type MineruDeployParseMethod = 'auto' | 'txt' | 'ocr'

// Base Workflow Params
export interface BaseWorkflowParams {
  skip_translate?: boolean
  base_url?: string
  api_key?: string
  model_id?: string
  to_lang?: string
  chunk_size?: number
  concurrent?: number
  temperature?: number
  top_p?: number
  timeout?: number
  thinking?: ThinkingMode
  retry?: number
  system_proxy_enable?: boolean
  custom_prompt?: string
  glossary_dict?: Record<string, string>
  glossary_generate_enable?: boolean
  glossary_agent_config?: GlossaryAgentConfigPayload
  force_json?: boolean
  rpm?: number
  tpm?: number
  provider?: ProviderType
  extra_body?: string
  output_filename_prefix?: string
  output_filename_suffix?: string
  output_filename_custom?: string
}

// Glossary Agent Config
export interface GlossaryAgentConfigPayload {
  base_url: string
  api_key: string
  model_id: string
  to_lang: string
  temperature?: number
  top_p?: number
  concurrent?: number
  timeout?: number
  thinking?: ThinkingMode
  retry?: number
  system_proxy_enable?: boolean
  custom_prompt?: string
  force_json?: boolean
  rpm?: number
  tpm?: number
  provider?: ProviderType
  extra_body?: string
}

// Workflow-specific params
export interface AutoWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'auto'
  convert_engine?: ConvertEngine
  mineru_token?: string
  model_version?: 'pipeline' | 'vlm'
  formula_ocr?: boolean
  code_ocr?: boolean
  mineru_language?: MineruLanguage
  mineru_deploy_base_url?: string
  mineru_deploy_backend?: MineruDeployBackend
  mineru_deploy_parse_method?: MineruDeployParseMethod
  mineru_deploy_table_enable?: boolean
  mineru_deploy_formula_enable?: boolean
  mineru_deploy_start_page_id?: number
  mineru_deploy_end_page_id?: number
  mineru_deploy_lang_list?: string[]
  mineru_deploy_server_url?: string
  insert_mode?: InsertMode
  separator?: string
  translate_regions?: string[]
  json_paths?: string[]
}

export interface MarkdownWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'markdown_based'
  convert_engine: ConvertEngine
  md2docx_engine?: 'python' | 'pandoc' | 'auto'
  mineru_token?: string
  model_version?: 'pipeline' | 'vlm'
  formula_ocr?: boolean
  mineru_language?: MineruLanguage
  code_ocr?: boolean
  mineru_deploy_base_url?: string
  mineru_deploy_backend?: MineruDeployBackend
  mineru_deploy_parse_method?: MineruDeployParseMethod
  mineru_deploy_table_enable?: boolean
  mineru_deploy_formula_enable?: boolean
  mineru_deploy_start_page_id?: number
  mineru_deploy_end_page_id?: number
  mineru_deploy_lang_list?: string[]
  mineru_deploy_server_url?: string
}

export interface TextWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'txt'
  insert_mode: InsertMode
  separator?: string
}

export interface JsonWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'json'
  json_paths: string[]
}

export interface XlsxWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'xlsx'
  insert_mode: InsertMode
  separator?: string
  translate_regions?: string[]
}

export interface DocxWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'docx'
  insert_mode: InsertMode
  separator?: string
}

export interface SrtWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'srt'
  insert_mode: InsertMode
  separator?: string
}

export interface EpubWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'epub'
  insert_mode: InsertMode
  separator?: string
}

export interface HtmlWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'html'
  insert_mode: InsertMode
  separator?: string
}

export interface AssWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'ass'
  insert_mode: InsertMode
  separator?: string
}

export interface PPTXWorkflowParams extends BaseWorkflowParams {
  workflow_type: 'pptx'
  insert_mode: InsertMode
  separator?: string
}

export type TranslatePayload =
  | AutoWorkflowParams
  | MarkdownWorkflowParams
  | TextWorkflowParams
  | JsonWorkflowParams
  | XlsxWorkflowParams
  | DocxWorkflowParams
  | SrtWorkflowParams
  | EpubWorkflowParams
  | HtmlWorkflowParams
  | AssWorkflowParams
  | PPTXWorkflowParams

// Task and Batch Status Types
export interface TaskFile {
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
  output_filename?: string
}

export interface TaskStatus {
  task_id: string
  status: 'running' | 'completed' | 'failed'
  progress: number
  current_file?: string
  total_files?: number
  processed_files?: number
  message?: string
  error?: string
  result?: {
    task_id: string
    outputs?: {
      file_type: string
      filename: string
    }[]
  }
}

export interface BatchStatus {
  batch_id: string
  status: 'running' | 'completed' | 'partial' | 'failed'
  total_files: number
  completed_files: number
  failed_files: number
  overall_progress: number
  tasks: Record<string, TaskStatus>
  started_at?: string
  completed_at?: string
}

// Request/Response Types
export interface BatchTranslateRequest {
  files: Array<{
    filename: string
    content: string // Base64
  }>
  payload: TranslatePayload
}

export interface BatchTranslateResponse {
  batch_started: boolean
  batch_id: string
  task_ids: string[]
  message: string
}

// Glossary Types
export interface GlossaryEntry {
  id: string
  source: string
  target: string
}

// Config Types
export interface DefaultParams {
  [key: string]: any
}

export interface MetaInfo {
  version: string
  name: string
}

export interface EngineList {
  [key: string]: any
}
