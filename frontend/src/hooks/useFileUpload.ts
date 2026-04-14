// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useCallback } from 'react'
import { useFilesStore } from '@/stores/filesStore'
import { useProgressStore } from '@/stores/progressStore'
import { useConfigStore } from '@/stores/configStore'
import { uploadBatchFiles } from '@/services/batchService'

export function useFileUpload() {
  const { files, updateFileStatus, removeFile, setFileTaskId } = useFilesStore()
  const { setBatchId, setProcessing } = useProgressStore()
  const { workflow, payload, updatePayload } = useConfigStore()

  const startBatchUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setProcessing(true)

    try {
      // Mark all pending files as uploading
      pendingFiles.forEach(file => {
        updateFileStatus(file.id, 'uploading', 0)
      })

      // Merge workflow_type with payload
      // Filter out empty strings and undefined/null values
      // Keep 'xx' for api_key as it's required default value
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, value]) => {
          // Filter out undefined/null values
          if (value === undefined || value === null) return false

          // Filter out empty strings for non-api_key fields
          if (value === '' && key !== 'api_key') return false

          return true
        })
      )

      const fullPayload = {
        workflow_type: workflow,
        ...cleanedPayload
      }

      console.log('Sending payload:', fullPayload)

      const response = await uploadBatchFiles(
        pendingFiles.map(f => f.file),
        fullPayload
      )

      setBatchId(response.batch_id)

      // Save task IDs - map by filename
      if (response.task_ids && response.task_ids.length === pendingFiles.length) {
        pendingFiles.forEach((file, index) => {
          const taskId = response.task_ids[index]
          if (taskId) {
            setFileTaskId(file.id, taskId)
          }
        })
      }

      // Mark all files as processing
      pendingFiles.forEach((file) => {
        updateFileStatus(file.id, 'processing', 0)
      })

    } catch (error) {
      console.error('Upload failed:', error)
      pendingFiles.forEach(file => {
        updateFileStatus(file.id, 'failed', 0, String(error))
      })
      setProcessing(false)
    }
  }, [files, updateFileStatus, setBatchId, setProcessing, setFileTaskId, payload, workflow])

  const removeFileById = useCallback((id: string) => {
    removeFile(id)
  }, [removeFile])

  const updateGlossaryInPayload = useCallback((glossary: Record<string, string>) => {
    updatePayload({ glossary_dict: glossary })
  }, [updatePayload])

  return {
    files,
    startBatchUpload,
    removeFileById,
    updateGlossaryInPayload,
  }
}
