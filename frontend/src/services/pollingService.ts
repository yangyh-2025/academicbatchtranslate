// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { getBatchStatus } from './batchService'

// Backend batch status response format (snake_case from Python)
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

interface PollingCallbacks {
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: any) => void
  onFileUpdate?: (filename: string, status: string, progress: number) => void
  onBatchStatusUpdate?: (status: BackendBatchStatus) => void
}

export function startBatchStatusPolling(
  batchId: string,
  callbacks: PollingCallbacks,
  intervalMs: number = 2000
): () => void {
  let isActive = true

  const poll = async () => {
    if (!isActive) return

    try {
      const status: BackendBatchStatus = await getBatchStatus(batchId)

      // Notify batch status update
      callbacks.onBatchStatusUpdate?.(status)

      // Update overall progress
      if (callbacks.onProgress && status.overall_progress !== undefined) {
        callbacks.onProgress(status.overall_progress)
      }

      // Update individual file progress by filename
      if (callbacks.onFileUpdate && status.tasks) {
        status.tasks.forEach((task) => {
          // Determine file status
          let fileStatus = 'processing'
          if (task.download_ready) {
            fileStatus = 'completed'
          } else if (task.error_flag) {
            fileStatus = 'failed'
          }

          callbacks.onFileUpdate?.(
            task.filename,  // Use filename instead of task_id
            fileStatus,
            task.progress_percent || 0
          )
        })
      }

      // Check if all tasks are completed or failed
      if (status.all_completed) {
        isActive = false
        callbacks.onComplete?.()
        return
      }
    } catch (error) {
      if (isActive) {
        callbacks.onError?.(error)
      }
    }
  }

  // Initial poll
  poll()

  // Start interval
  const intervalId = setInterval(poll, intervalMs)

  // Return cleanup function
  return () => {
    isActive = false
    clearInterval(intervalId)
  }
}
