'use client'

import { useMutation } from '@tanstack/react-query'
import { generateSummary } from '@/features/summary/services/summary.service'

export function useGenerateSummary() {
  return useMutation({
    mutationFn: generateSummary,
  })
}