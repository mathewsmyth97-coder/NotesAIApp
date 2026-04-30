'use client'

import { useMutation } from '@tanstack/react-query'
import { generateQuiz } from '@/features/quiz/services/quiz.service'

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: generateQuiz,
  })
}
