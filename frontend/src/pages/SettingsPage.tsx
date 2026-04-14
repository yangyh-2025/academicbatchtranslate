import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useConfigStore } from '@/stores/configStore'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileNamePatternEditor } from '@/components/config/FileNamePatternEditor'

export default function SettingsPage() {
  const { payload, updatePayload, resetConfig } = useConfigStore()
  const [showApiKey, setShowApiKey] = useState(false)
  const [showBaseUrl, setShowBaseUrl] = useState(false)
  const [showMineruToken, setShowMineruToken] = useState(false)

  return (
    <div className="space-y-6 py-4">
      {/* API 配置 */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">API 配置</h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              API Base URL
            </label>
            <div className="relative">
              <input
                type={showBaseUrl ? 'text' : 'password'}
                value={payload.base_url || ''}
                onChange={(e) => updatePayload({ base_url: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={payload.api_key || ''}
                onChange={(e) => updatePayload({ api_key: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Model ID
            </label>
            <input
              type="text"
              value={payload.model_id || ''}
              onChange={(e) => updatePayload({ model_id: e.target.value })}
              placeholder="gpt-4o"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              目标语言
            </label>
            <input
              type="text"
              value={payload.to_lang || '中文'}
              onChange={(e) => updatePayload({ to_lang: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* 参数配置 */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">参数配置</h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              分块大小
            </label>
            <input
              type="number"
              value={payload.chunk_size || 1000}
              onChange={(e) => updatePayload({ chunk_size: parseInt(e.target.value) })}
              min="100"
              max="10000"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              并发数
            </label>
            <input
              type="number"
              value={payload.concurrent || 5}
              onChange={(e) => updatePayload({ concurrent: parseInt(e.target.value) })}
              min="1"
              max="20"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              温度
            </label>
            <input
              type="number"
              step="0.1"
              value={payload.temperature || 0.3}
              onChange={(e) => updatePayload({ temperature: parseFloat(e.target.value) })}
              min="0"
              max="2"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Top P
            </label>
            <input
              type="number"
              step="0.1"
              value={payload.top_p || 0.9}
              onChange={(e) => updatePayload({ top_p: parseFloat(e.target.value) })}
              min="0"
              max="1"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* MinerU 配置 */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">MinerU 配置（PDF 翻译必需）</h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
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
                value={(payload as any).mineru_token || ''}
                onChange={(e) => updatePayload({ mineru_token: e.target.value } as any)}
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
        </CardContent>
      </Card>

      {/* 文件名配置 */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">文件名配置</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <FileNamePatternEditor
            prefix={payload.output_filename_prefix || ''}
            suffix={payload.output_filename_suffix || ''}
            customPattern={payload.output_filename_custom || ''}
            useCustomPattern={false}
            onPrefixChange={(value) => updatePayload({ output_filename_prefix: value })}
            onSuffixChange={(value) => updatePayload({ output_filename_suffix: value })}
            onCustomPatternChange={(value) => updatePayload({ output_filename_custom: value })}
            onUseCustomPatternToggle={() => {}}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={resetConfig}
        >
          重置默认值
        </Button>
      </div>
    </div>
  )
}
