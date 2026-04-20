import { FiFile, FiFileText, FiDatabase,
FiVideo, FiBook, FiCode, FiTable } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import type { WorkflowType } from '@/types/api'

interface WorkflowSelectorProps {
  value: WorkflowType
  onChange: (value: WorkflowType) => void
}

const workflows: { id: WorkflowType; label: string; icon: any; description: string }[] = [
  { id: 'auto', label: '自动', icon: FiFile, description: '根据文件类型自动选择' },
  { id: 'markdown_based', label: 'Markdown', icon: FiFileText, description: 'PDF/Markdown转DOCX' },
  { id: 'txt', label: '纯文本', icon: FiCode, description: 'TXT文件翻译' },
  { id: 'json', label: 'JSON', icon: FiDatabase, description: 'JSON字段翻译' },
  { id: 'xlsx', label: 'Excel', icon: FiTable, description: 'XLSX文件翻译' },
  { id: 'docx', label: 'Word', icon: FiFile, description: 'DOCX文件翻译' },
  { id: 'srt', label: 'SRT字幕', icon: FiVideo, description: 'SRT字幕翻译' },
  { id: 'epub', label: 'EPUB电子书', icon: FiBook, description: 'EPUB翻译' },
  { id: 'html', label: 'HTML', icon: FiCode, description: 'HTML翻译' },
  { id: 'ass', label: 'ASS字幕', icon: FiVideo, description: 'ASS字幕翻译' },
  { id: 'pptx', label: 'PowerPoint', icon: FiFile, description: 'PPTX翻译' },
]

export function WorkflowSelector({ value, onChange }: WorkflowSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        选择翻译工作流
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {workflows.map((workflow) => {
          const Icon = workflow.icon
          const isSelected = value === workflow.id

          return (
            <button
              key={workflow.id}
              onClick={() => onChange(workflow.id)}
              className={cn(
                'flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary-light/10 ring-2 ring-primary/20'
                  : 'border-neutral-200 bg-white hover:border-primary-light hover:shadow-blue'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg',
                isSelected ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-neutral-900">{workflow.label}</span>
                <span className="text-xs text-neutral-500 mt-1">{workflow.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
