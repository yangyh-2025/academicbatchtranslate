// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getBatchList, downloadBatchZip, releaseBatch, type BatchListResponse } from '@/services/batchService'

export default function HistoryPage() {
  const [batches, setBatches] = useState<BatchListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBatches = async () => {
    try {
      const data = await getBatchList()
      setBatches(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || '获取任务历史失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()

    const interval = setInterval(() => {
      if (batches.some(b => b.status === 'processing')) {
        fetchBatches()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [batches])

  const handleDownload = async (batchId: string) => {
    try {
      const blob = await downloadBatchZip(batchId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `batch-${batchId}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      alert('下载失败: ' + (err.message || '未知错误'))
    }
  }

  const handleDelete = async (batchId: string) => {
    if (!confirm('确定要删除这个任务吗？')) {
      return
    }
    try {
      await releaseBatch(batchId)
      await fetchBatches()
    } catch (err: any) {
      alert('删除失败: ' + (err.message || '未知错误'))
    }
  }

  const handleClearAll = async () => {
    if (!confirm('确定要清空所有任务历史吗？')) {
      return
    }
    try {
      await Promise.all(batches.map(b => releaseBatch(b.batch_id)))
      await fetchBatches()
    } catch (err: any) {
      alert('清空失败: ' + (err.message || '未知错误'))
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return '处理中'
      case 'completed': return '已完成'
      case 'partial': return '部分完成'
      case 'failed': return '失败'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-500'
      case 'completed': return 'text-green-500'
      case 'partial': return 'text-yellow-500'
      case 'failed': return 'text-red-500'
      default: return 'text-neutral-500'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'partial': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-neutral-500'
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
      ) : error ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchBatches}>重试</Button>
          </CardContent>
        </Card>
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
                    <p className="text-sm text-neutral-500">{new Date(batch.started_at * 1000).toLocaleString('zh-CN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(batch.batch_id)}
                      disabled={batch.status !== 'completed' && batch.status !== 'partial'}
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">文件数量</span>
                    <span>{batch.total_files}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">完成进度</span>
                    <span>{batch.completed_files}/{batch.total_files}</span>
                  </div>
                  {batch.failed_files > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">失败数量</span>
                      <span className="text-red-500">{batch.failed_files}</span>
                    </div>
                  )}
                  {batch.processing_files > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">处理中</span>
                      <span className="text-blue-500">{batch.processing_files}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">状态</span>
                      <span className={getStatusColor(batch.status)}>
                        {getStatusText(batch.status)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className={`${getStatusBgColor(batch.status)} h-2 rounded-full transition-all`}
                        style={{ width: `${batch.overall_progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
