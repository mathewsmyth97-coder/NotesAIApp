import type { SummaryResult } from '@/features/summary/types/summary.types'

export type StudySession = {
  id: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
  summary?: SummaryResult
}