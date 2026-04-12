import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBatchStatus } from '@/services/batchService'
import type { BatchStatus } from '@/types/api'

export function useBatchStatus(batchId: string | null) {
  return useQuery<BatchStatus>({
    queryKey: ['batchStatus', batchId],
    queryFn: () => getBatchStatus(batchId!),
    enabled: !!batchId,
    refetchInterval: (query) => {
      // Poll faster when running, slower when complete
      return query.state.data?.status === 'running' ? 2000 : 5000
    },
  })
}

export function useInvalidateBatchStatus() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['batchStatus'] })
  }
}
