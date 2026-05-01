'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiUsageQueryKey } from '@/features/ai-usage/hooks/use-ai-usage'
import { generateFlashcards } from '@/features/flashcards/services/flashcards.service'

export function useGenerateFlashcards() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateFlashcards,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: aiUsageQueryKey })
    },
  })
}
