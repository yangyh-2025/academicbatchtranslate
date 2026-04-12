import { useCallback } from 'react'
import { useFilesStore } from '@/stores/filesStore'
import { useProgressStore } from '@/stores/progressStore'
import { useConfigStore } from '@/stores/configStore'
import { uploadBatchFiles } from '@/services/batchService'

export function useFileUpload() {
  const { files, updateFileStatus, removeFile } = useFilesStore()
  const { setBatchId, updateProgress, setProcessing } = useProgressStore()
  const { payload, updatePayload } = useConfigStore()

  const startBatchUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setProcessing(true)

    try {
      // Mark all pending files as uploading
      pendingFiles.forEach(file => {
        updateFileStatus(file.id, 'uploading', 0)
      })

      const response = await uploadBatchFiles(
        pendingFiles.map(f => f.file),
        payload
      )

      setBatchId(response.batch_id)

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
  }, [files, updateFileStatus, setBatchId, updateProgress, setProcessing, payload])

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
