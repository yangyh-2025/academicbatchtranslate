import { useConfigStore } from '@/stores/configStore'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ModelConfigPanel } from '@/components/config/ModelConfigPanel'
import { TranslationParamsForm } from '@/components/config/TranslationParamsForm'
import { FileNamePatternEditor } from '@/components/config/FileNamePatternEditor'

export default function SettingsPage() {
  const { payload, updatePayload, resetConfig } = useConfigStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">设置</h1>
        <Button
          variant="outline"
          onClick={resetConfig}
        >
          重置默认值
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">翻译配置</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Config */}
          <ModelConfigPanel
            values={payload}
            onChange={(key, value) => updatePayload({ [key]: value })}
          />

          {/* Workflow-specific Params - 默认使用 auto 工作流 */}
          <TranslationParamsForm
            workflow="auto"
            values={payload}
            onChange={(key, value) => updatePayload({ [key]: value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">文件名配置</h2>
        </CardHeader>
        <CardContent>
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
    </div>
  )
}
