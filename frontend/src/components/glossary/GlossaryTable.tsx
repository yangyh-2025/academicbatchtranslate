import { useState } from 'react'
import { FiPlus, FiTrash2, FiSearch, FiEdit } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import type { GlossaryEntry } from '@/types/api'

interface GlossaryTableProps {
  entries: GlossaryEntry[]
  onEntriesChange: (entries: GlossaryEntry[]) => void
}

export function GlossaryTable({ entries, onEntriesChange }: GlossaryTableProps) {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState({ source: '', target: '' })

  const filteredEntries = entries.filter(
    e => e.source.toLowerCase().includes(search.toLowerCase()) ||
         e.target.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!newEntry.source.trim() || !newEntry.target.trim()) return
    onEntriesChange([
      ...entries,
      { id: Date.now().toString(), ...newEntry }
    ])
    setNewEntry({ source: '', target: '' })
  }

  const handleDelete = (id: string) => {
    onEntriesChange(entries.filter(e => e.id !== id))
  }

  const handleEdit = (id: string, field: 'source' | 'target', value: string) => {
    onEntriesChange(entries.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ))
  }

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索术语..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="primary" onClick={handleAdd} disabled={!newEntry.source || !newEntry.target}>
          <FiPlus className="w-4 h-4" />
          添加
        </Button>
      </div>

      {/* New Entry Input */}
      <div className="flex gap-3 bg-neutral-50 rounded-lg p-3">
        <input
          type="text"
          value={newEntry.source}
          onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
          placeholder="原文"
          className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          value={newEntry.target}
          onChange={(e) => setNewEntry({ ...newEntry, target: e.target.value })}
          placeholder="译文"
          className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-1/2">
                原文
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-1/2">
                译文
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 w-24">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={entry.source}
                        onChange={(e) => handleEdit(entry.id, 'source', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-neutral-300 focus:border-primary"
                      />
                    ) : (
                      <span>{entry.source}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={entry.target}
                        onChange={(e) => handleEdit(entry.id, 'target', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-neutral-300 focus:border-primary"
                      />
                    ) : (
                      <span>{entry.target}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === entry.id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          完成
                        </Button>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(entry.id)}
                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <FiEdit className="w-4 h-4 text-neutral-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 hover:bg-danger-light hover:text-danger rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          暂无术语
        </div>
      )}
    </div>
  )
}
