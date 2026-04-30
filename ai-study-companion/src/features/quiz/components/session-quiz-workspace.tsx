'use client'

import { useCallback, useEffect } from 'react'
import { QuizPanel } from '@/features/quiz/components/quiz-panel'
import { useGenerateQuiz } from '@/features/quiz/hooks/use-generate-quiz'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
import type { StudySession } from '@/features/study-session/types/session.types'
import { useSessionStore } from '@/stores/session.store'

export function SessionQuizWorkspace({ session }: { session: StudySession }) {
  const saveQuizToSession = useSessionStore((state) => state.saveQuizToSession)
  const { isError, isPending, mutate } = useGenerateQuiz()
  const hasQuiz = Boolean(session.quiz?.length)

  const handleGenerate = useCallback(() => {
    mutate(
      {
        sessionId: session.id,
        sourceText: session.sourceText,
        tone: session.tone,
        level: session.level,
      },
      {
        onSuccess: (data) => {
          saveQuizToSession(session.id, data)
        },
      },
    )
  }, [mutate, saveQuizToSession, session.id, session.level, session.sourceText, session.tone])

  useEffect(() => {
    if (!hasQuiz) {
      handleGenerate()
    }
  }, [handleGenerate, hasQuiz])

  if (!hasQuiz && isPending) {
    return (
      <GenerationStatusCard
        title="Quiz"
        description="Generating quiz questions from the current study material."
        status="loading"
        message="Generating quiz..."
      />
    )
  }

  if (!hasQuiz && isError) {
    return (
      <GenerationStatusCard
        title="Quiz"
        description="Failed to generate quiz."
        status="error"
        message="Try again to request a fresh set of quiz questions."
        actionLabel="Regenerate quiz"
        isActionPending={isPending}
        onAction={handleGenerate}
      />
    )
  }

  if (!session.quiz?.length) {
    return null
  }

  return (
    <div className="space-y-4">
      <GenerationToolbar>
        <RegenerateButton
          label="Regenerate quiz"
          isPending={isPending}
          onPress={handleGenerate}
        />
      </GenerationToolbar>

      <QuizPanel questions={session.quiz} />
    </div>
  )
}
