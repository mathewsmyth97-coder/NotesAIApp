import { fetcher } from '@/lib/api/fetcher'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'

export async function generateFlashcards(payload: {
  sessionId: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
}) {
  return fetcher<Flashcard[]>('/api/ai/flashcards', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
