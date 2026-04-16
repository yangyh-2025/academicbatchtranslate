// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

// 配置 PDF.js worker 使用本地文件
// 注意：路径需要匹配 Vite 的 base 配置 (/app)
pdfjs.GlobalWorkerOptions.workerSrc = '/app/pdf.worker.min.js'

interface PDFViewerProps {
  pdfData: string  // Base64 encoded PDF
  className?: string
}

export function PDFViewer({ pdfData, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setNumPages(null)
    setCurrentPage(1)
    setPdfError(null)
    setLoading(true)
  }, [pdfData])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF加载错误:', error)
    setPdfError('PDF加载失败，请重试或切换到文本预览模式')
    setLoading(false)
  }

  if (!pdfData) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full text-gray-500">
          暂无PDF内容
        </div>
      </div>
    )
  }

  const pdfUrl = `data:application/pdf;base64,${pdfData}`

  return (
    <div className={className}>
      <div className="flex-1 overflow-auto p-4 bg-gray-50 relative">
        {loading && !pdfError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载PDF...</p>
            </div>
          </div>
        )}

        {pdfError && (
          <div className="flex items-center justify-center h-full text-red-500">
            {pdfError}
          </div>
        )}

        {!pdfError && (
          <div className="flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="shadow-lg"
            >
              <Page pageNumber={currentPage} />
            </Document>
          </div>
        )}
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            第 {currentPage} / {numPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
            disabled={currentPage === numPages}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
