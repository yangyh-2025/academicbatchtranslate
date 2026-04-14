// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useEffect } from 'react'
import { useFilesStore } from '@/stores/filesStore'
import { useConfigStore } from '@/stores/configStore'
import { useProgressStore } from '@/stores/progressStore'
import { useFileUpload } from '@/hooks/useFileUpload'
import { startBatchStatusPolling } from '@/services/pollingService'
import { downloadBatchZip } from '@/services/batchService'
import { BatchUploadZone } from '@/components/batch/BatchUploadZone'
import { BatchFileCard } from '@/components/batch/BatchFileCard'
import { BatchFileNameEditor } from '@/components/batch/BatchFileNameEditor'
import { BatchProgressOverview } from '@/components/batch/BatchProgressOverview'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { AnimatePresence } from 'framer-motion'

// Backend batch status response format
interface BackendBatchStatus {
  batch_id: string
  total_files: number
  completed_count: number
  error_count: number
  processing_count: number
  overall_progress: number
  all_completed: boolean
  started_at: string
  tasks: Array<{
    task_id: string
    filename: string
    is_processing: boolean
    download_ready: boolean
    error_flag: boolean
    progress_percent: number
    status_message: string
  }>
}

export default function BatchPage() {
  const { files, removeFileById, startBatchUpload } = useFileUpload()
  const { payload } = useConfigStore()
  const { batchId, setProcessing, updateBatchStatus } = useProgressStore()

  // Handle batch status polling
  useEffect(() => {
    if (!batchId) return

    const stopPolling = startBatchStatusPolling(batchId, {
      onBatchStatusUpdate: (status: BackendBatchStatus) => {
        // Update progress store with backend format
        updateBatchStatus(status)
      },
      onFileUpdate: (filename, status, progress) => {
        // Update individual file status and progress by filename
        const { updateFileProgressByName } = useFilesStore.getState()
        updateFileProgressByName(filename, status as any, progress, '')
      },
      onComplete: () => {
        setProcessing(false)
      },
      onError: (error) => {
        console.error('Batch status polling error:', error)
        setProcessing(false)
      }
    })

    return () => {
      stopPolling()
    }
  }, [batchId])

  // Handle batch download
  const handleBatchDownload = async () => {
    if (!batchId) return
    try {
      const blob = await downloadBatchZip(batchId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `batch_${batchId}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="space-y-6 py-4 pb-8">
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
              {batchId && (
                <Button
                  variant="secondary"
                  onClick={handleBatchDownload}
                  className="flex-1"
                >
                  下载结果
                </Button>
              )}
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
