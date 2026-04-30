import { fetcher } from '@/lib/api/fetcher'
import type { GeneratedStudyContent } from '@/features/study-session/types/session.types'

type GenerateStudySessionPayload = {
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
}

export async function generateStudySession(payload: GenerateStudySessionPayload) {
  return fetcher<GeneratedStudyContent>('/api/ai/study-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
