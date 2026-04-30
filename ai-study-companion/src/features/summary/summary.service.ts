import { fetcher } from '@/lib/api/fetcher'
import type { SummaryResult } from '@/features/summary/types/summary.types'

export async function generateSummary(payload: {
  sessionId: string
  sourceText: string
  tone: 'concise' | 'detailed'
}) {
  return fetcher<SummaryResult>('/api/ai/summary', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}