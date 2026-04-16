// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import api from './api'
import type { BatchTranslateResponse } from '@/types/api'

// Backend batch status response format (snake_case from Python)
export interface BackendBatchStatus {
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

export async function uploadBatchFiles(
  files: File[],
  payload: any,
): Promise<BatchTranslateResponse> {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  // Log the payload being sent
  console.log('Sending payload to /service/translate/batch/file:', payload)
  console.log('Payload JSON:', JSON.stringify(payload, null, 2))

  formData.append('payload', JSON.stringify(payload))

  try {
    const response = await api.post('/service/translate/batch/file', formData)
    return response.data
  } catch (error: any) {
    console.error('Upload failed with error:', error)

    // Log detailed error information
    if (error.response) {
      console.error('Error response status:', error.response.status)
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2))
      console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2))
    }

    throw error
  }
}

export async function getBatchStatus(batchId: string): Promise<BackendBatchStatus> {
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

export async function downloadBatchFormats(batchId: string, formats: string[]): Promise<Blob> {
  const response = await api.post(`/service/download/batch/${batchId}/formats`, formats, {
    responseType: 'blob',
  })
  return response.data
}

export async function downloadSingleFileFormats(taskId: string, formats: string[]): Promise<Blob> {
  const response = await api.post(`/service/download/${taskId}/formats`, formats, {
    responseType: 'blob',
  })
  return response.data
}

export async function getFileContent(taskId: string): Promise<{ original: string; translated: string }> {
  const response = await api.get(`/service/content/${taskId}`)
  return response.data
}

export async function getPDFPreviewContent(taskId: string): Promise<{
  original_pdf?: string
  translated_pdf?: string
}> {
  const response = await api.get(`/service/preview/pdf/${taskId}`)
  return response.data
}
