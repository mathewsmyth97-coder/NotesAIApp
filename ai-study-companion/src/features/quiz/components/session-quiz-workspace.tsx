'use client'

import { useCallback, useEffect } from 'react'
import { QuizPanel } from '@/features/quiz/components/quiz-panel'
import { useGenerateQuiz } from '@/features/quiz/hooks/use-generate-quiz'
import { AiUsageMeter } from '@/features/ai-usage/components/ai-usage-meter'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
import { useUpdateStudySession } from '@/features/study-session/hooks/use-study-sessions'
import type { StudySession } from '@/features/study-session/types/session.types'

export function SessionQuizWorkspace({ session }: { session: StudySession }) {
  const {
    isError: isGenerateError,
    isPending: isGenerating,
    mutate,
  } = useGenerateQuiz()
  const {
    isError: isUpdateError,
    isPending: isUpdating,
    mutate: updateSession,
  } = useUpdateStudySession(session.id)
  const hasQuiz = Boolean(session.quiz?.length)
  const isError = isGenerateError || isUpdateError
  const isPending = isGenerating || isUpdating

  const handleGenerate = useCallback(() => {
    mutate(
      {
        sessionId: session.id,
        title: session.title,
        sourceText: session.sourceText,
        tone: session.tone,
        level: session.level,
      },
      {
        onSuccess: (data) => {
          updateSession({ quiz: data })
        },
      },
    )
  }, [
    mutate,
    updateSession,
    session.id,
    session.level,
    session.sourceText,
    session.title,
    session.tone,
  ])

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
        <AiUsageMeter />
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
