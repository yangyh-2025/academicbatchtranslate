import { useState } from 'react'
import { GlossaryTable } from '@/components/glossary/GlossaryTable'
import { GlossaryUploader } from '@/components/glossary/GlossaryUploader'
import { AutoGlossaryGenerator } from '@/components/glossary/AutoGlossaryGenerator'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import type { GlossaryEntry } from '@/types/api'

export default function GlossaryPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">术语表管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 术语表管理 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">术语表</h2>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowGenerator(!showGenerator)}
                >
                  {showGenerator ? '隐藏自动生成' : '自动生成术语'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 自动生成器 */}
            {showGenerator && (
              <AutoGlossaryGenerator
                isOpen={showGenerator}
                onClose={() => setShowGenerator(false)}
                onGenerated={(entries) => setGlossaryEntries(entries)}
              />
            )}

            {/* 导入导出 */}
            <GlossaryUploader
              entries={glossaryEntries}
              onEntriesChange={setGlossaryEntries}
            />

            {/* 术语表 */}
            <GlossaryTable
              entries={glossaryEntries}
              onEntriesChange={setGlossaryEntries}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
