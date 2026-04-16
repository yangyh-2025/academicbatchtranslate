// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface CheckboxProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function Checkbox({ checked, onChange, disabled, className, children }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.div
        animate={{ scale: checked ? [0.8, 1] : 1 }}
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
          checked ? 'bg-primary border-primary' : 'bg-white border-neutral-300 hover:border-primary'
        )}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}
      </motion.div>
      {children && <span className="text-sm text-neutral-700">{children}</span>}
    </button>
  )
}
