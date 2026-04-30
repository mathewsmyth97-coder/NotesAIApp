'use client'

import { useMutation } from '@tanstack/react-query'
import { generateFlashcards } from '@/features/flashcards/services/flashcards.service'

export function useGenerateFlashcards() {
  return useMutation({
    mutationFn: generateFlashcards,
  })
}
