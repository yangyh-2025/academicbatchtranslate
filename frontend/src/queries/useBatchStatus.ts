// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBatchStatus, BackendBatchStatus } from '@/services/batchService'

export function useBatchStatus(batchId: string | null) {
  return useQuery<BackendBatchStatus>({
    queryKey: ['batchStatus', batchId],
    queryFn: () => getBatchStatus(batchId!),
    enabled: !!batchId,
    refetchInterval: 2000,
  })
}

export function useInvalidateBatchStatus() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['batchStatus'] })
  }
}
