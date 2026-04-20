// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { cn } from '@/utils/cn'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-blue border border-neutral-200 overflow-hidden',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}>
      {children}
    </div>
  )
}
