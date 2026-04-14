// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { cn } from '@/utils/cn'
import { FiFileText, FiBook, FiClock, FiSettings } from 'react-icons/fi'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
}

const menuItems: MenuItem[] = [
  { id: 'batch', label: '批量翻译', icon: FiFileText, path: '/' },
  { id: 'glossary', label: '术语表', icon: FiBook, path: '/glossary' },
  { id: 'history', label: '任务历史', icon: FiClock, path: '/history' },
  { id: 'settings', label: '设置', icon: FiSettings, path: '/settings' },
]

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-full py-4 flex flex-col">
      <nav className="space-y-1 px-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              currentPath === item.path
                ? 'bg-primary-light/10 text-primary font-medium'
                : 'text-neutral-700 hover:bg-neutral-100'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 pb-2">
        <div className="bg-gradient-to-br from-primary-light/5 to-primary-light/10 rounded-lg p-3 border border-primary-light/20">
          <h4 className="text-sm font-semibold text-primary mb-2">加入交流群</h4>
          <p className="text-xs text-neutral-600 mb-2 leading-relaxed">
            关注公众号「文科生的自我拯救」，回复「交流群」获取技术服务
          </p>
          <div className="flex justify-center">
            <img
              src="/app/mp_code.jpg"
              alt="公众号二维码"
              className="w-20 h-20 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
