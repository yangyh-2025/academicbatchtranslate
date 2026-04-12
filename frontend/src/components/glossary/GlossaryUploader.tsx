import { useCallback, useState } from 'react'
import { FiUpload, FiDownload } from 'react-icons/fi'
import { parse } from 'papaparse'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { GlossaryEntry } from '@/types/api'

interface GlossaryUploaderProps {
  entries: GlossaryEntry[]
  onEntriesChange: (entries: GlossaryEntry[]) => void
}

export function GlossaryUploader({ entries, onEntriesChange }: GlossaryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith('.csv')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const result = parse(text, { header: true })

      const newEntries: GlossaryEntry[] = []
      result.data.forEach((row: any) => {
        if (row.Source && row.Target) {
          newEntries.push({
            id: Date.now().toString() + Math.random(),
            source: row.Source,
            target: row.Target,
          })
        }
      })

      onEntriesChange(newEntries)
    }
    reader.readAsText(file)
  }, [onEntriesChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleExport = () => {
    const csvContent = 'Source,Target\n' +
      entries.map(e => `${e.source},${e.target}`).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'glossary.csv')
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'border-2 border-dashed rounded-xl p-6 text-center transition-all',
        isDragging
          ? 'border-primary bg-primary-light/5'
          : 'border-neutral-300 bg-neutral-50/50 hover:border-primary-light hover:bg-primary-light/5'
      )}
    >
      <div className="space-y-4">
        <div>
          <FiUpload className="w-12 h-12 mx-auto text-neutral-400" />
          <p className="text-sm text-neutral-700 mt-2">
            {isDragging ? '释放文件' : '拖放CSV文件导入术语表'}
          </p>
        </div>

        {entries.length > 0 && (
          <p className="text-xs text-neutral-500">
            CSV格式: 第一列Source, 第二列Target
          </p>
        )}

        {entries.length > 0 && (
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={entries.length === 0}
            className="w-full"
          >
            <FiDownload className="w-4 h-4" />
            导出CSV
          </Button>
        )}
      </div>
    </div>
  )
}
