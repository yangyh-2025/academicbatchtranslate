// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiCopy, FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import { createPortal } from 'react-dom'
import { PDFViewer } from './PDFViewer'

export interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName?: string
  originalContent?: string
  translatedContent?: string
  originalPdf?: string  // 新增：原文PDF base64
  translatedPdf?: string  // 新增：译文PDF base64
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileName,
  originalContent = '',
  translatedContent = '',
  originalPdf,
  translatedPdf,
}: FilePreviewModalProps) {
  // 检查是否有PDF内容可用
  const hasPdfContent = Boolean(originalPdf || translatedPdf)
  const [previewMode, setPreviewMode] = useState<'pdf' | 'text'>(hasPdfContent ? 'pdf' : 'text')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const previewSection = (
    title: string,
    content: string,
    pdfData: string | undefined,
    isRight: boolean
  ) => (
    <div className={cn('flex-1 flex flex-col overflow-hidden', isRight && 'border-l border-neutral-200')}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex-shrink-0">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        {previewMode === 'text' && (
          <button
            onClick={() => handleCopy(content)}
            className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
            title="复制内容"
          >
            <FiCopy className="w-4 h-4 text-neutral-500" />
          </button>
        )}
      </div>

      {previewMode === 'pdf' ? (
        <PDFViewer pdfData={pdfData || ''} />
      ) : (
        <div className="flex-1 overflow-auto p-4 bg-white">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-medium mb-1">{children}</h3>,
                p: ({ children }) => <p className="mb-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-neutral-800 text-neutral-100 p-3 rounded-lg overflow-x-auto mb-2">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-neutral-300 pl-4 italic mb-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content || '暂无内容'}
            </ReactMarkdown>
          </div>
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

          {/* 预览模式切换 */}
          {hasPdfContent && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('pdf')}
                className={cn(
                  'px-3 py-1 text-sm rounded-lg transition-colors',
                  previewMode === 'pdf' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'
                )}
              >
                PDF预览
              </button>
              <button
                onClick={() => setPreviewMode('text')}
                className={cn(
                  'px-3 py-1 text-sm rounded-lg transition-colors',
                  previewMode === 'text' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'
                )}
              >
                文本预览
              </button>
            </div>
          )}

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
            {previewSection('原文', originalContent, previewMode === 'pdf' ? originalPdf : undefined, false)}
            {previewSection('译文', translatedContent, previewMode === 'pdf' ? translatedPdf : undefined, true)}
          </div>
          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col w-full h-full">
            {previewSection('原文', originalContent, previewMode === 'pdf' ? originalPdf : undefined, false)}
            {previewSection('译文', translatedContent, previewMode === 'pdf' ? translatedPdf : undefined, true)}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
