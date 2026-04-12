import { useMemo } from 'react'
import { cn } from '@/utils/cn'
import type { FileItem } from '@/stores/filesStore'

interface BatchFileNameEditorProps {
  files: FileItem[]
  prefix: string
  suffix: string
  customPattern: string | undefined
  useCustomPattern: boolean
}

export function BatchFileNameEditor({
  files,
  prefix,
  suffix,
  customPattern,
  useCustomPattern
}: BatchFileNameEditorProps) {
  const generateOutputName = useMemo(() => (originalName: string): string => {
    if (useCustomPattern && customPattern) {
      let result = customPattern
      result = result.replace('{original}', originalName)
      result = result.replace('{timestamp}', Date.now().toString())
      return result
    } else {
      const extIndex = originalName.lastIndexOf('.')
      const nameWithoutExt = extIndex > 0 ? originalName.substring(0, extIndex) : originalName
      const ext = extIndex > 0 ? originalName.substring(extIndex) : ''
      return `${prefix}${nameWithoutExt}${suffix}${ext}`
    }
  }, [prefix, suffix, customPattern, useCustomPattern])

  if (files.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-neutral-700 mb-3">
        输出文件名预览
      </h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {files.map((file) => {
          const outputName = generateOutputName(`${file.file.name}`)
          return (
            <div
              key={file.id}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm',
                file.status === 'completed' && 'bg-success-light/10',
                file.status === 'failed' && 'bg-danger-light/10',
                file.status === 'pending' && 'bg-neutral-100'
              )}
            >
              <span className="truncate max-w-xs text-neutral-600">
                {file.file.name}
              </span>
              <span className="text-neutral-400">→</span>
              <span className="truncate max-w-xs font-mono">
                {outputName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
