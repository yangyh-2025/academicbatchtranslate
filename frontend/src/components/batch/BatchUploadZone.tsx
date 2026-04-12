import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiX } from 'react-icons/fi'
import { useFilesStore } from '@/stores/filesStore'
import { cn } from '@/utils/cn'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const SUPPORTED_FORMATS = [
  '.pdf', '.docx', '.doc', '.txt', '.md',
  '.xlsx', '.csv', '.json', '.srt', '.epub',
  '.html', '.ass', '.pptx'
]

interface BatchUploadZoneProps {
  disabled?: boolean
}

export function BatchUploadZone({ disabled = false }: BatchUploadZoneProps) {
  const { addFiles, files } = useFilesStore()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `文件 ${file.name} 超过大小限制 (100MB)`
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!SUPPORTED_FORMATS.includes(ext || '')) {
      return `不支持的文件格式: ${ext}`
    }
    return null
  }, [])

  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null)
    const validFiles: File[] = []

    for (const file of newFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      // Check for duplicates
      const isDuplicate = files.some(f => f.file.name === file.name && f.file.size === file.size)
      if (!isDuplicate) {
        validFiles.push(file)
      }
    }

    if (validFiles.length > 0) {
      addFiles(validFiles)
    }
  }, [files, addFiles, validateFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [disabled, handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }, [disabled, handleFiles])

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300',
          isDragging
            ? 'border-primary bg-primary-light/5 scale-[1.02]'
            : 'border-neutral-300 bg-neutral-50/50 hover:border-primary-light hover:bg-primary-light/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          multiple
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="pointer-events-none flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{
              scale: isDragging ? 1.2 : 1,
              rotate: isDragging ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <FiUpload className="w-16 h-16 text-neutral-400" />
          </motion.div>

          <div>
            <p className="text-lg font-medium text-neutral-700">
              {isDragging ? '释放文件' : '拖放文件到此处'}
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              或点击选择文件 (支持多个文件)
            </p>
          </div>

          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            支持格式: {SUPPORTED_FORMATS.join(', ')} | 最大 100MB
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-danger-light/10 border border-danger rounded-lg p-3 flex items-center gap-2">
              <FiX className="w-4 h-4 text-danger" />
              <span className="text-sm text-danger-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
