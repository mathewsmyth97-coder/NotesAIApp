'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiUsageQueryKey } from '@/features/ai-usage/hooks/use-ai-usage'
import { generateQuiz } from '@/features/quiz/services/quiz.service'

export function useGenerateQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateQuiz,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: aiUsageQueryKey })
    },
  })
}
