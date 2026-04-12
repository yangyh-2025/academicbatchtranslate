import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { TaskStatus } from '@/types/api'

interface BatchProgressChartProps {
  tasks: Record<string, TaskStatus>
  width?: number
  height?: number
}

export function BatchProgressChart({
  tasks,
  width = 400,
  height = 200
}: BatchProgressChartProps) {
  const dataPoints = useMemo(() => {
    const taskIds = Object.keys(tasks)
    return taskIds.map((id, index) => {
      const task = tasks[id]
      return {
        id,
        x: index,
        y: task?.progress || 0,
        status: task?.status,
      }
    })
  }, [tasks])

  const maxDataPoints = Math.max(5, dataPoints.length)

  return (
    <div className="relative bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-700 mb-4">
        任务进度时间线
      </h3>
      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = height - (value / 100) * (height - 40) - 20
          return (
            <line
              key={value}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )
        })}

        {/* Progress line */}
        <polyline
          points={dataPoints.map((p, i) => {
            const x = (i / (maxDataPoints - 1)) * (width - 60) + 30
            const y = height - (p.y / 100) * (height - 40) - 20
            return `${x},${y}`
          }).join(' ')}
          fill="none"
          stroke="#FFC107"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => {
          const x = (i / (maxDataPoints - 1)) * (width - 60) + 30
          const y = height - (p.y / 100) * (height - 40) - 20
          const pointColor = p.status === 'completed'
            ? '#4CAF50'
            : p.status === 'failed'
            ? '#F44336'
            : '#FFC107'

          return (
            <g key={p.id}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={pointColor}
              />
              <motion.circle
                initial={{ r: 5 }}
                animate={{ r: 8 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                cx={x}
                cy={y}
                r="5"
                fill={pointColor}
                opacity="0.3"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
