import { create } from 'zustand'

interface ProgressState {
  batchId: string | null
  totalFiles: number
  completedFiles: number
  failedFiles: number
  overallProgress: number
  isProcessing: boolean
  setBatchId: (batchId: string | null) => void
  updateProgress: (completed: number, failed: number, total: number) => void
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
  setBatchId: (batchId) => set({ batchId }),
  updateProgress: (completed, failed, total) => {
    const overallProgress = total > 0 ? ((completed + failed) / total) * 100 : 0
    set({ completedFiles: completed, failedFiles: failed, totalFiles: total, overallProgress })
  },
  setProcessing: (isProcessing) => set({ isProcessing }),
  resetProgress: () => set({ batchId: null, totalFiles: 0, completedFiles: 0, failedFiles: 0, overallProgress: 0, isProcessing: false }),
}))
