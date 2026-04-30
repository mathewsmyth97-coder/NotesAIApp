import { fetcher } from '@/lib/api/fetcher'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'

export async function generateQuiz(payload: {
  sessionId: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
}) {
  const result = await fetcher<{ questions: QuizQuestion[] }>('/api/ai/quiz', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return result.questions
}
