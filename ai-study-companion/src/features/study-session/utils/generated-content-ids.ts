import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'
import type { GeneratedStudyContent } from '@/features/study-session/types/session.types'

function getUniqueId({
  id,
  index,
  prefix,
  usedIds,
}: {
  id: string
  index: number
  prefix: string
  usedIds: Set<string>
}) {
  const trimmedId = id.trim()

  if (trimmedId && !usedIds.has(trimmedId)) {
    usedIds.add(trimmedId)
    return trimmedId
  }

  let counter = 1
  let fallbackId = `${prefix}-${index + 1}`

  while (usedIds.has(fallbackId)) {
    counter += 1
    fallbackId = `${prefix}-${index + 1}-${counter}`
  }

  usedIds.add(fallbackId)
  return fallbackId
}

export function normalizeFlashcardIds(cards: Flashcard[]) {
  const usedIds = new Set<string>()

  return cards.map((card, index) => ({
    ...card,
    id: getUniqueId({
      id: card.id,
      index,
      prefix: 'flashcard',
      usedIds,
    }),
  }))
}

export function normalizeQuizQuestionIds(questions: QuizQuestion[]) {
  const usedIds = new Set<string>()

  return questions.map((question, index) => ({
    ...question,
    id: getUniqueId({
      id: question.id,
      index,
      prefix: 'question',
      usedIds,
    }),
  }))
}

export function normalizeGeneratedStudyContent(
  content: GeneratedStudyContent,
): GeneratedStudyContent {
  return {
    ...content,
    flashcards: normalizeFlashcardIds(content.flashcards),
    quiz: normalizeQuizQuestionIds(content.quiz),
  }
}
