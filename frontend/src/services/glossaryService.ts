// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import type { GlossaryEntry } from '@/types/api'

export async function fetchGlossary(): Promise<GlossaryEntry[]> {
  // This would connect to backend glossary API
  // For now, return empty array
  return []
}

export async function saveGlossary(entries: GlossaryEntry[]): Promise<void> {
  // This would save to backend
  console.log('Saving glossary:', entries)
}

export async function exportGlossaryToCsv(entries: GlossaryEntry[]): Promise<string> {
  const headers = 'Source,Target\n'
  const rows = entries.map(e => `${e.source},${e.target}`).join('\n')
  return headers + rows
}
