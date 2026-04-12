import { useProgressStore } from '@/stores/progressStore'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { FiCheckCircle, FiPlay } from 'react-icons/fi'

export function BatchProgressOverview() {
  const {
    totalFiles,
    completedFiles,
    failedFiles,
    overallProgress,
    isProcessing,
    batchId
  } = useProgressStore()

  if (totalFiles === 0) return null

  const successRate = totalFiles > 0
    ? (completedFiles / totalFiles * 100).toFixed(0)
    : '0'

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-start gap-6">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing
            value={overallProgress}
            size={100}
            strokeWidth={10}
          />
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">批量处理进度</h3>
            {batchId && (
              <p className="text-xs text-neutral-500 mt-1">
                批量ID: {batchId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-lg p-3">
              <span className="text-2xl font-bold text-primary">{totalFiles}</span>
              <span className="text-xs text-neutral-500 block mt-1">总文件</span>
            </div>
            <div className="bg-success-light/10 rounded-lg p-3">
              <span className="text-2xl font-bold text-success">{completedFiles}</span>
              <span className="text-xs text-neutral-500 block mt-1">已完成</span>
            </div>
            <div className="bg-danger-light/10 rounded-lg p-3">
              <span className="text-2xl font-bold text-danger">{failedFiles}</span>
              <span className="text-xs text-neutral-500 block mt-1">失败</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-success" />
              <span className="text-neutral-700">成功率: {successRate}%</span>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <FiPlay className="w-4 h-4" />
                <span>处理中...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
