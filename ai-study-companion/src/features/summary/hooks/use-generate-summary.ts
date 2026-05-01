'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiUsageQueryKey } from '@/features/ai-usage/hooks/use-ai-usage'
import { generateSummary } from '@/features/summary/services/summary.service'

export function useGenerateSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateSummary,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: aiUsageQueryKey })
    },
  })
}
