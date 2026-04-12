import type { WorkflowType, ConvertEngine, InsertMode } from '@/types/api'

interface TranslationParamsFormProps {
  workflow: WorkflowType
  values: Record<string, any>
  onChange: (key: string, value: any) => void
}

export function TranslationParamsForm({ workflow, values, onChange }: TranslationParamsFormProps) {
  return (
    <div className="space-y-4">
      {workflow === 'markdown_based' && (
        <MarkdownParams values={values} onChange={onChange} />
      )}
      {workflow === 'txt' && (
        <TextParams values={values} onChange={onChange} />
      )}
      {workflow === 'json' && (
        <JsonParams values={values} onChange={onChange} />
      )}
      {workflow === 'xlsx' && (
        <XlsxParams values={values} onChange={onChange} />
      )}
      {workflow === 'docx' && (
        <DocxParams values={values} onChange={onChange} />
      )}
      {workflow === 'srt' && (
        <SrtParams values={values} onChange={onChange} />
      )}
      {workflow === 'epub' && (
        <EpubParams values={values} onChange={onChange} />
      )}
      {workflow === 'html' && (
        <HtmlParams values={values} onChange={onChange} />
      )}
      {workflow === 'ass' && (
        <AssParams values={values} onChange={onChange} />
      )}
      {workflow === 'pptx' && (
        <PPTXParams values={values} onChange={onChange} />
      )}
    </div>
  )
}

function MarkdownParams({ values, onChange }: any) {
  const engines: { id: ConvertEngine; label: string }[] = [
    { id: 'identity', label: 'Identity (原Markdown)' },
    { id: 'mineru', label: 'MinerU Cloud' },
    { id: 'docling', label: 'Docling' },
    { id: 'mineru_deploy', label: 'MinerU 本地部署' },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-neutral-900">Markdown 参数</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          转换引擎
        </label>
        <select
          value={values.convert_engine || 'identity'}
          onChange={(e) => onChange('convert_engine', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {engines.map((engine) => (
            <option key={engine.id} value={engine.id}>{engine.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function TextParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function JsonParams({ values, onChange }: any) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-neutral-900">JSON 参数</h3>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          JSON Paths (逗号分隔)
        </label>
        <input
          type="text"
          value={values.json_paths?.join(', ') || ''}
          onChange={(e) => onChange('json_paths', e.target.value.split(',').map(s => s.trim()))}
          placeholder="$.product.name, $.description"
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  )
}
function XlsxParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function DocxParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function SrtParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function EpubParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function HtmlParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function AssParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}
function PPTXParams({ values, onChange }: any) {
  return <InsertModeField value={values.insert_mode} onChange={(v) => onChange('insert_mode', v)} />
}

function InsertModeField({ value, onChange }: { value?: InsertMode; onChange: (value: InsertMode) => void }) {
  const modes: { id: InsertMode; label: string }[] = [
    { id: 'replace', label: '替换' },
    { id: 'append', label: '追加' },
    { id: 'prepend', label: '前置' },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-neutral-900">插入模式</h3>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          翻译插入模式
        </label>
        <select
          value={value || 'replace'}
          onChange={(e) => onChange(e.target.value as InsertMode)}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {modes.map((mode) => (
            <option key={mode.id} value={mode.id}>{mode.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
