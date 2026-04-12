import { useState } from 'react'
import { FiZap } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { GlossaryEntry } from '@/types/api'

interface AutoGlossaryGeneratorProps {
  isOpen: boolean
  onClose: () => void
  onGenerated: (entries: GlossaryEntry[]) => void
  sourceText?: string
}

export function AutoGlossaryGenerator({
  isOpen,
  onClose,
  onGenerated,
  sourceText
}: AutoGlossaryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelConfig, setModelConfig] = useState({
    baseUrl: '',
    apiKey: '',
    modelId: 'gpt-4o',
  })

  const handleGenerate = async () => {
    if (!modelConfig.baseUrl || !modelConfig.apiKey || !sourceText) return

    setIsGenerating(true)

    try {
      // In production, this would call an API
      // For demo, we'll simulate with sample entries
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockEntries: GlossaryEntry[] = [
        { id: '1', source: 'Abstract', target: '摘要' },
        { id: '2', source: 'Methodology', target: '方法论' },
        { id: '3', source: 'Conclusion', target: '结论' },
      ]

      onGenerated(mockEntries)
      onClose()
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 自动提取术语" size="lg">
      <div className="space-y-4">
        <div className="bg-neutral-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
            配置 AI 模型
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                API Base URL
              </label>
              <input
                type="text"
                value={modelConfig.baseUrl}
                onChange={(e) => setModelConfig({ ...modelConfig, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                API Key
              </label>
              <input
                type="password"
                value={modelConfig.apiKey}
                onChange={(e) => setModelConfig({ ...modelConfig, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Model ID
              </label>
              <input
                type="text"
                value={modelConfig.modelId}
                onChange={(e) => setModelConfig({ ...modelConfig, modelId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            源文本 (可选)
          </label>
          <textarea
            value={sourceText || ''}
            readOnly
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 resize-none"
            placeholder="输入文本以提取术语..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!modelConfig.baseUrl || !modelConfig.apiKey}
          >
            <FiZap className="w-4 h-4" />
            开始生成
          </Button>
        </div>
      </div>
    </Modal>
  )
}
