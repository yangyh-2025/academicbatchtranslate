// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { create } from 'zustand'

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
}

interface ProgressState {
  batchId: string | null
  totalFiles: number
  completedFiles: number
  failedFiles: number
  overallProgress: number
  isProcessing: boolean
  batchStatus: BackendBatchStatus | null
  setBatchId: (batchId: string | null) => void
  updateBatchStatus: (status: BackendBatchStatus) => void
  setProcessing: (isProcessing: boolean) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>((set) => ({
  batchId: null,
  totalFiles: 0,
  completedFiles: 0,
  failedFiles: 0,
  overallProgress: 0,
  isProcessing: false,
  batchStatus: null,
  setBatchId: (batchId) => set({ batchId }),
  updateBatchStatus: (status) => {
    set({
      batchStatus: status,
      totalFiles: status.total_files,
      completedFiles: status.completed_count,
      failedFiles: status.error_count,
      overallProgress: status.overall_progress
    })
  },
  setProcessing: (isProcessing) => set({ isProcessing }),
  resetProgress: () => set({ batchId: null, totalFiles: 0, completedFiles: 0, failedFiles: 0, overallProgress: 0, isProcessing: false, batchStatus: null }),
}))
