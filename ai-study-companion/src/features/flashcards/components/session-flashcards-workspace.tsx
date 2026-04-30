'use client'

import { useCallback, useEffect } from 'react'
import { FlashcardsPanel } from '@/features/flashcards/components/flashcards-panel'
import { useGenerateFlashcards } from '@/features/flashcards/hooks/use-generate-flashcards'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
import type { StudySession } from '@/features/study-session/types/session.types'
import { useSessionStore } from '@/stores/session.store'

export function SessionFlashcardsWorkspace({ session }: { session: StudySession }) {
  const saveFlashcardsToSession = useSessionStore((state) => state.saveFlashcardsToSession)
  const { isError, isPending, mutate } = useGenerateFlashcards()
  const hasFlashcards = Boolean(session.flashcards?.length)

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
          saveFlashcardsToSession(session.id, data)
        },
      },
    )
  }, [
    mutate,
    saveFlashcardsToSession,
    session.id,
    session.level,
    session.sourceText,
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
