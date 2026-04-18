// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

// 配置 PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface PDFViewerProps {
  pdfData: string  // Base64 encoded PDF
  className?: string
}

export function PDFViewer({ pdfData, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setNumPages(null)
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
      {loading && !pdfError && (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载PDF...</p>
          </div>
        </div>
      )}

      {pdfError && (
        <div className="h-full flex items-center justify-center text-red-500">
          {pdfError}
        </div>
      )}

      {!pdfError && !loading && (
        <div className="h-full overflow-auto p-4 bg-gray-50">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            {numPages !== null && Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
              <div key={pageNumber} className="flex justify-center mb-4">
                  <Page
                    pageNumber={pageNumber}
                    className="shadow-lg"
                  />
              </div>
            ))}
          </Document>
        </div>
      )}
    </div>
  )
}
