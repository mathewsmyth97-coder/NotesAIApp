import type { SummaryResult } from '@/features/summary/types/summary.types'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export type StudySession = {
  id: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
  summary?: SummaryResult
  flashcards?: Flashcard[]
  quiz?: QuizQuestion[]
  messages?: ChatMessage[]
}


export type StreamingAssistantMessage = {
  id: string
  role: 'assistant'
  content: string
}