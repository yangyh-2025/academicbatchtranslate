// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { create } from 'zustand'

export interface FileItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
  outputFilename?: string
  taskId?: string  // Backend task ID for progress tracking
}

interface FilesState {
  files: FileItem[]
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFileStatus: (id: string, status: FileItem['status'], progress?: number, error?: string) => void
  updateFileProgressByName: (filename: string, status: FileItem['status'], progress: number, taskId: string) => void
  clearFiles: () => void
  setFileTaskId: (id: string, taskId: string) => void
}

export const useFilesStore = create<FilesState>((set) => ({
  files: [],
  addFiles: (newFiles) => set((state) => {
    const fileItems: FileItem[] = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0,
    }))
    return { files: [...state.files, ...fileItems] }
  }),
  removeFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  updateFileStatus: (id, status, progress, error) => set((state) => ({
    files: state.files.map((f) =>
      f.id === id ? { ...f, status, progress: progress ?? f.progress, error } : f
    ),
  })),
  updateFileProgressByName: (filename, status, progress, taskId) => set((state) => ({
    files: state.files.map((f) =>
      f.file.name === filename ? { ...f, status, progress, taskId } : f
    ),
  })),
  clearFiles: () => set({ files: [] }),
  setFileTaskId: (id, taskId) => set((state) => ({
    files: state.files.map((f) =>
      f.id === id ? { ...f, taskId } : f
    ),
  })),
}))
