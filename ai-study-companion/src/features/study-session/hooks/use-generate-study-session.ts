'use client'

import { useMutation } from '@tanstack/react-query'
import { generateStudySession } from '@/features/study-session/services/study-session.service'

export function useGenerateStudySession() {
  return useMutation({
    mutationFn: generateStudySession,
  })
}
