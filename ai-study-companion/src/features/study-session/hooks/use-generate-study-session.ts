'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiUsageQueryKey } from '@/features/ai-usage/hooks/use-ai-usage'
import { generateStudySession } from '@/features/study-session/services/study-session.service'

export function useGenerateStudySession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateStudySession,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: aiUsageQueryKey })
    },
  })
}
