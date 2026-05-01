'use client'

import { useQuery } from '@tanstack/react-query'
import { getAiUsageStatus } from '@/features/ai-usage/services/ai-usage.service'

export const aiUsageQueryKey = ['ai-usage'] as const

export function useAiUsageStatus() {
  return useQuery({
    queryKey: aiUsageQueryKey,
    queryFn: getAiUsageStatus,
    staleTime: 15_000,
  })
}
