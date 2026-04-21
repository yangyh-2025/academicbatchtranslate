// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { createPortal } from 'react-dom'

export interface DownloadFormatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (formats: string[]) => void
  selectedFormats: string[]
  onFormatChange: (formats: string[]) => void
  mode?: 'batch' | 'single'
}

const formatOptions = [
  { id: 'markdown', label: 'Markdown', description: '.md 格式，轻量级文本标记' },
  { id: 'docx', label: 'DOCX', description: '.docx 格式，Microsoft Word 文档' },
  { id: 'pdf', label: 'PDF', description: '.pdf 格式，便携式文档' },
  { id: 'pdf_premium', label: 'PDF 高级版', description: '.pdf 格式，纯净版无推广信息' },
]

export function DownloadFormatModal({
  isOpen,
  onClose,
  onConfirm,
  selectedFormats,
  onFormatChange,
  mode = 'batch',
}: DownloadFormatModalProps) {
  const isSingleMode = mode === 'single'

  const handleFormatToggle = (formatId: string) => {
    if (selectedFormats.includes(formatId)) {
      onFormatChange(selectedFormats.filter(f => f !== formatId))
    } else {
      onFormatChange([...selectedFormats, formatId])
    }
  }

  const handleConfirm = () => {
    if (selectedFormats.length > 0) {
      onConfirm(selectedFormats)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-200',
          'scale-100 opacity-100'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold">选择下载格式</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {isSingleMode
              ? '选择格式（选多个将打包为ZIP，选一个直接下载文件）'
              : '可以选择多种格式，将打包为ZIP下载'
            }
          </p>
        </div>
        <div className="p-6 space-y-3">
          {formatOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleFormatToggle(option.id)}
              className={cn(
                'w-full p-3 rounded-lg border cursor-pointer transition-colors',
                'border-neutral-200 hover:border-primary/30 hover:bg-primary/5',
                selectedFormats.includes(option.id) && 'border-primary bg-primary/10'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center',
                    'border-gray-300',
                    selectedFormats.includes(option.id) && 'border-primary bg-primary'
                  )}
                >
                  {selectedFormats.includes(option.id) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414 0L10 14.586l6.293-6.293a1 1 0 011.414-1.414l-7 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{option.label}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {selectedFormats.length === 0 && (
            <p className="text-sm text-danger">请选择一种格式</p>
          )}
        </div>
        <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedFormats.length === 0}
            className="flex-1"
          >
            确认下载
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
