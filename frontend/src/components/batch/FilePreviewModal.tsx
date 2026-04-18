// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import { createPortal } from 'react-dom'
import { PDFViewer } from './PDFViewer'

export interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName?: string
  originalPdf?: string  // 原文PDF base64
  translatedPdf?: string  // 译文PDF base64
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileName,
  originalPdf,
  translatedPdf,
}: FilePreviewModalProps) {
  const previewSection = (
    title: string,
    pdfData: string | undefined,
    isRight: boolean
  ) => (
    <div className={cn('flex-1 flex flex-col overflow-hidden', isRight && 'border-l border-neutral-200')}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex-shrink-0">
        <h3 className="font-medium text-neutral-700">{title}</h3>
      </div>

      {pdfData ? (
        <PDFViewer pdfData={pdfData} className="flex-1 h-full overflow-hidden" />
      ) : (
        <div className="flex-1 h-full overflow-auto p-4 bg-white flex items-center justify-center">
          <p className="text-neutral-500">暂无PDF内容</p>
        </div>
      )}
    </div>
  )

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold">文件预览</h3>
            {fileName && (
              <p className="text-sm text-neutral-500 mt-1">{fileName}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Desktop: side-by-side */}
          <div className="hidden md:flex w-full h-full">
            {previewSection('原文', originalPdf, false)}
            {previewSection('译文', translatedPdf, true)}
          </div>
          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col w-full h-full">
            {previewSection('原文', originalPdf, false)}
            {previewSection('译文', translatedPdf, true)}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
