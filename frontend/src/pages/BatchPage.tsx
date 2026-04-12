import { useFilesStore } from '@/stores/filesStore'
import { useConfigStore } from '@/stores/configStore'
import { useFileUpload } from '@/hooks/useFileUpload'
import { BatchUploadZone } from '@/components/batch/BatchUploadZone'
import { BatchFileCard } from '@/components/batch/BatchFileCard'
import { BatchFileNameEditor } from '@/components/batch/BatchFileNameEditor'
import { BatchProgressOverview } from '@/components/batch/BatchProgressOverview'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { AnimatePresence } from 'framer-motion'

export default function BatchPage() {
  const { files, removeFileById, startBatchUpload } = useFileUpload()
  const { payload } = useConfigStore()

  return (
    <div className="space-y-6">
      {/* Batch Progress Overview */}
      <BatchProgressOverview />

      {/* File Upload & Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">文件管理</h2>
            <span className="text-sm text-neutral-500">
              {files.length} 个文件
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Zone */}
          <BatchUploadZone disabled={false} />

          {/* Filename Preview */}
          <AnimatePresence>
            {files.length > 0 && (
              <BatchFileNameEditor
                files={files}
                prefix={payload.output_filename_prefix || ''}
                suffix={payload.output_filename_suffix || ''}
                customPattern={payload.output_filename_custom || ''}
                useCustomPattern={false}
              />
            )}
          </AnimatePresence>

          {/* File Cards */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {files.map((file) => (
                <BatchFileCard
                  key={file.id}
                  file={file}
                  onRemove={removeFileById}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                variant="primary"
                onClick={startBatchUpload}
                disabled={files.filter(f => f.status === 'pending').length === 0}
                className="flex-1"
              >
                开始批量翻译
              </Button>
              <Button
                variant="outline"
                onClick={() => useFilesStore.getState().clearFiles()}
                className="flex-1"
              >
                清空文件
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 提示 */}
      <div className="text-center text-neutral-500 py-8">
        <p>需要修改翻译配置？请前往「设置」页面</p>
      </div>
    </div>
  )
}
