import { motion } from 'framer-motion'
import { FiFile, FiCheckCircle, FiXCircle, FiDownload, FiTrash2 } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import type { FileItem } from '@/stores/filesStore'

interface BatchFileCardProps {
  file: FileItem
  onRemove?: (id: string) => void
  onDownload?: (id: string) => void
}

const statusConfig = {
  pending: { icon: FiFile, color: 'text-neutral-400', label: '等待中' },
  uploading: { icon: FiFile, color: 'text-warning', label: '上传中' },
  processing: { icon: FiFile, color: 'text-primary', label: '处理中' },
  completed: { icon: FiCheckCircle, color: 'text-success', label: '已完成' },
  failed: { icon: FiXCircle, color: 'text-danger', label: '失败' },
}

export function BatchFileCard({ file, onRemove, onDownload }: BatchFileCardProps) {
  const StatusIcon = statusConfig[file.status].icon
  const statusColor = statusConfig[file.status].color
  const statusLabel = statusConfig[file.status].label

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={cn('flex-shrink-0 p-2 rounded-lg bg-neutral-50', statusColor)}>
          <StatusIcon className="w-5 h-5" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-neutral-900 truncate">
            {file.file.name}
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
            <span>{formatFileSize(file.file.size)}</span>
            <span>•</span>
            <span className={cn(
              'capitalize',
              file.status === 'completed' && 'text-success',
              file.status === 'failed' && 'text-danger'
            )}>
              {statusLabel}
            </span>
          </div>

          {/* Progress Bar */}
          {file.status !== 'pending' && file.status !== 'failed' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span>进度</span>
                <span>{file.progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'h-full rounded-full',
                    file.status === 'completed' && 'bg-success',
                    file.status !== 'completed' && 'bg-primary'
                  )}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {file.status === 'failed' && file.error && (
            <div className="mt-2 text-sm text-danger bg-danger-light/10 rounded-lg p-2">
              {file.error}
            </div>
          )}

          {/* Output Filename */}
          {file.status === 'completed' && file.outputFilename && (
            <div className="mt-2 text-sm text-neutral-600 flex items-center gap-2">
              <span className="text-neutral-400">输出:</span>
              <span className="font-mono bg-neutral-100 px-2 py-1 rounded">
                {file.outputFilename}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {onDownload && file.status === 'completed' && (
            <button
              onClick={() => onDownload(file.id)}
              className="p-2 hover:bg-success-light hover:text-success rounded-lg transition-colors"
              title="下载"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="p-2 hover:bg-danger-light hover:text-danger rounded-lg transition-colors"
              title="移除"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
