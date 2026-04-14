// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import api from './api'
import type { DefaultParams, MetaInfo, EngineList } from '@/types/api'

export async function getDefaultParams(): Promise<DefaultParams> {
  const response = await api.get('/service/default-params')
  return response.data
}

export async function getMetaInfo(): Promise<MetaInfo> {
  const response = await api.get('/service/meta')
  return response.data
}

export async function getEngineList(): Promise<EngineList> {
  const response = await api.get('/service/engin-list')
  return response.data
}
