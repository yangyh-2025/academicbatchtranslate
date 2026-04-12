import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  className,
  color = 'primary'
}: ProgressRingProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    danger: 'stroke-danger',
  }
  const trackColorClasses = {
    primary: 'stroke-primary-light/30',
    success: 'stroke-success-light/30',
    warning: 'stroke-warning-light/30',
    danger: 'stroke-danger-light/30',
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackColorClasses[color]}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          strokeDasharray={circumference}
          className={colorClasses[color]}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-neutral-700">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
