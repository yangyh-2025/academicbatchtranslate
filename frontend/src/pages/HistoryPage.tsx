import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { BatchStatus } from '@/types/api'

export default function HistoryPage() {
  const [batches, setBatches] = useState<BatchStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 实现从后端加载任务历史
    setLoading(false)
  }, [])

  const handleDelete = (batchId: string) => {
    setBatches(batches.filter(b => b.batch_id !== batchId))
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有任务历史吗？')) {
      setBatches([])
    }
  }

  return (
    <div className="space-y-6 py-4">
      {batches.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClearAll}
          >
            清空历史
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">
          加载中...
        </div>
      ) : batches.length === 0 ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">任务历史</h2>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-neutral-500 mb-4">还没有任务历史</p>
            <p className="text-sm text-neutral-400">上传的翻译任务将显示在这里</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {batches.map((batch) => (
            <Card key={batch.batch_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{batch.batch_id.slice(0, 8)}</h3>
                    <p className="text-sm text-neutral-500">{new Date(batch.started_at || Date.now()).toLocaleString('zh-CN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: 下载批量结果
                      }}
                    >
                      下载
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(batch.batch_id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">文件数量</span>
                    <span>{batch.total_files || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">完成进度</span>
                    <span>{batch.completed_files || 0}/{batch.total_files || 0}</span>
                  </div>
                  {batch.status && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">状态</span>
                      <span className={`${
                        batch.status === 'completed' ? 'text-green-500' :
                        batch.status === 'failed' ? 'text-red-500' :
                        'text-neutral-500'
                      }`}>
                        {batch.status === 'completed' ? '已完成' :
                         batch.status === 'failed' ? '失败' :
                         batch.status}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
