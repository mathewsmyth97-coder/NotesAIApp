import { fetcher } from '@/lib/api/fetcher'
import type { SummaryResult } from '@/features/summary/types/summary.types'

export async function generateSummary(payload: {
  sessionId: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
}) {
  return fetcher<SummaryResult>('/api/ai/summary', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}