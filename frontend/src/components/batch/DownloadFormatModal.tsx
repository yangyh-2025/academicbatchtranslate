// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { createPortal } from 'react-dom'

export interface DownloadFormatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (formats: string[]) => void
  selectedFormats: string[]
  onFormatChange: (formats: string[]) => void
}

const formatOptions = [
  { id: 'markdown', label: 'Markdown', description: '.md 格式，轻量级文本标记' },
  { id: 'docx', label: 'DOCX', description: '.docx 格式，Microsoft Word 文档' },
  { id: 'pdf', label: 'PDF', description: '.pdf 格式，便携式文档' },
]

export function DownloadFormatModal({
  isOpen,
  onClose,
  onConfirm,
  selectedFormats,
  onFormatChange,
}: DownloadFormatModalProps) {
  const handleFormatToggle = (formatId: string) => {
    const newFormats = selectedFormats.includes(formatId)
      ? selectedFormats.filter((f) => f !== formatId)
      : [...selectedFormats, formatId]
    onFormatChange(newFormats)
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
            可以选择多种格式，将打包为ZIP下载
          </p>
        </div>
        <div className="p-6 space-y-3">
          {formatOptions.map((option) => (
            <Checkbox
              key={option.id}
              checked={selectedFormats.includes(option.id)}
              onChange={() => handleFormatToggle(option.id)}
              className="w-full p-3 rounded-lg border border-neutral-200 hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{option.label}</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {option.description}
                </div>
              </div>
            </Checkbox>
          ))}
          {selectedFormats.length === 0 && (
            <p className="text-sm text-danger">请至少选择一种格式</p>
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
            确认下载 ({selectedFormats.length})
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
