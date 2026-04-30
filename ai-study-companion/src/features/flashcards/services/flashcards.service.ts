import { fetcher } from '@/lib/api/fetcher'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'

export async function generateFlashcards(payload: {
  sessionId: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
}) {
  const result = await fetcher<{ cards: Flashcard[] }>('/api/ai/flashcards', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return result.cards
}
