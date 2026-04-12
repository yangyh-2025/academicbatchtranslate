import { useState } from 'react'
import { FiEye, FiEyeOff, FiDatabase } from 'react-icons/fi'

interface ModelConfigPanelProps {
  values: Record<string, any>
  onChange: (key: string, value: any) => void
}

export function ModelConfigPanel({ values, onChange }: ModelConfigPanelProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [showBaseUrl, setShowBaseUrl] = useState(false)
  const [showMineruToken, setShowMineruToken] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-900">API 配置</h3>

        {/* Base URL */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            API Base URL
          </label>
          <div className="relative">
            <input
              type={showBaseUrl ? 'text' : 'password'}
              value={values.base_url || ''}
              onChange={(e) => onChange('base_url', e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowBaseUrl(!showBaseUrl)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showBaseUrl ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={values.api_key || ''}
              onChange={(e) => onChange('api_key', e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showApiKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Model ID */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Model ID
          </label>
          <input
            type="text"
            value={values.model_id || ''}
            onChange={(e) => onChange('model_id', e.target.value)}
            placeholder="gpt-4o"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Target Language */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            目标语言
          </label>
          <input
            type="text"
            value={values.to_lang || '中文'}
            onChange={(e) => onChange('to_lang', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <h3 className="text-base font-semibold text-neutral-900">参数配置</h3>

        {/* Chunk Size */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            分块大小
          </label>
          <input
            type="number"
            value={values.chunk_size || 1000}
            onChange={(e) => onChange('chunk_size', parseInt(e.target.value))}
            min="100"
            max="10000"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Concurrent */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            并发数
          </label>
          <input
            type="number"
            value={values.concurrent || 5}
            onChange={(e) => onChange('concurrent', parseInt(e.target.value))}
            min="1"
            max="20"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            温度
          </label>
          <input
            type="number"
            step="0.1"
            value={values.temperature || 0.3}
            onChange={(e) => onChange('temperature', parseFloat(e.target.value))}
            min="0"
            max="2"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Top P */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Top P
          </label>
          <input
            type="number"
            step="0.1"
            value={values.top_p || 0.9}
            onChange={(e) => onChange('top_p', parseFloat(e.target.value))}
            min="0"
            max="1"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
          <FiDatabase className="w-4 h-4" />
          MinerU 配置（PDF 翻译必需）
        </h3>

        {/* MinerU Token */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            MinerU Token
            <span className="text-neutral-500 font-normal ml-1">
              （解析 PDF 文件必需）
            </span>
          </label>
          <div className="relative">
            <input
              type={showMineruToken ? 'text' : 'password'}
              value={values.mineru_token || ''}
              onChange={(e) => onChange('mineru_token', e.target.value)}
              placeholder="输入 MinerU API Token"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowMineruToken(!showMineruToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showMineruToken ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
