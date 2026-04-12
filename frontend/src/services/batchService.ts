import api from './api'
import type { BatchTranslateResponse, BatchStatus } from '@/types/api'

export async function uploadBatchFiles(
  files: File[],
  payload: any,
): Promise<BatchTranslateResponse> {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  formData.append('payload', JSON.stringify(payload))

  const response = await api.post('/service/translate/batch/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function getBatchStatus(batchId: string): Promise<BatchStatus> {
  const response = await api.get(`/service/batch-status/${batchId}`)
  return response.data
}

export async function downloadBatchZip(batchId: string): Promise<Blob> {
  const response = await api.get(`/service/download/batch/${batchId}`, {
    responseType: 'blob',
  })
  return response.data
}

export async function releaseBatch(batchId: string): Promise<any> {
  const response = await api.post(`/service/release/batch/${batchId}`)
  return response.data
}
