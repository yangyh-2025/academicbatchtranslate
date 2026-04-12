
interface FileNamePatternEditorProps {
  prefix: string
  suffix: string
  customPattern: string | undefined
  onPrefixChange: (value: string) => void
  onSuffixChange: (value: string) => void
  onCustomPatternChange: (value: string) => void
  useCustomPattern: boolean
  onUseCustomPatternToggle: (use: boolean) => void
}

export function FileNamePatternEditor({
  prefix,
  suffix,
  customPattern,
  onPrefixChange,
  onSuffixChange,
  onCustomPatternChange,
  useCustomPattern,
  onUseCustomPatternToggle
}: FileNamePatternEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomPattern}
            onChange={(e) => onUseCustomPatternToggle(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-sm font-medium text-neutral-700">
            使用自定义文件名模式
          </span>
        </label>
      </div>

      {useCustomPattern ? (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            自定义模式
          </label>
          <input
            type="text"
            value={customPattern || ''}
            onChange={(e) => onCustomPatternChange(e.target.value)}
            placeholder="{original}_{timestamp}"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-neutral-500 mt-1.5">
            可用占位符: {'{original}'} (原文件名), {'{timestamp}'} (时间戳)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              文件名前缀
            </label>
            <input
              type="text"
              value={prefix || ''}
              onChange={(e) => onPrefixChange(e.target.value)}
              placeholder="例如: translated_"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              文件名后缀
            </label>
            <input
              type="text"
              value={suffix || ''}
              onChange={(e) => onSuffixChange(e.target.value)}
              placeholder="_translated"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
