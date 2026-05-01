'use client'

import { useCallback, useEffect } from 'react'
import { FlashcardsPanel } from '@/features/flashcards/components/flashcards-panel'
import { useGenerateFlashcards } from '@/features/flashcards/hooks/use-generate-flashcards'
import { AiUsageMeter } from '@/features/ai-usage/components/ai-usage-meter'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
import { useUpdateStudySession } from '@/features/study-session/hooks/use-study-sessions'
import type { StudySession } from '@/features/study-session/types/session.types'

export function SessionFlashcardsWorkspace({ session }: { session: StudySession }) {
  const {
    isError: isGenerateError,
    isPending: isGenerating,
    mutate,
  } = useGenerateFlashcards()
  const {
    isError: isUpdateError,
    isPending: isUpdating,
    mutate: updateSession,
  } = useUpdateStudySession(session.id)
  const hasFlashcards = Boolean(session.flashcards?.length)
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
          updateSession({ flashcards: data })
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
    if (!hasFlashcards) {
      handleGenerate()
    }
  }, [handleGenerate, hasFlashcards])

  if (!hasFlashcards && isPending) {
    return (
      <GenerationStatusCard
        title="Flashcards"
        description="Generating flashcards from the current study material."
        status="loading"
        message="Generating flashcards..."
      />
    )
  }

  if (!hasFlashcards && isError) {
    return (
      <GenerationStatusCard
        title="Flashcards"
        description="Failed to generate flashcards."
        status="error"
        message="Try again to request a fresh set of flashcards."
        actionLabel="Regenerate flashcards"
        isActionPending={isPending}
        onAction={handleGenerate}
      />
    )
  }

  if (!session.flashcards?.length) {
    return null
  }

  return (
    <div className="space-y-4">
      <GenerationToolbar>
        <AiUsageMeter />
        <RegenerateButton
          label="Regenerate flashcards"
          isPending={isPending}
          onPress={handleGenerate}
        />
      </GenerationToolbar>

      <FlashcardsPanel cards={session.flashcards} />
    </div>
  )
}
