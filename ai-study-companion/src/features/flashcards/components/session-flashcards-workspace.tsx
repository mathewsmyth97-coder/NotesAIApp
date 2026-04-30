'use client'

import { useCallback, useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, Separator, Spinner } from '@heroui/react'
import { FlashcardsPanel } from '@/features/flashcards/components/flashcards-panel'
import { useGenerateFlashcards } from '@/features/flashcards/hooks/use-generate-flashcards'
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
      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-lg font-semibold">Flashcards</h2>
          <p className="text-sm text-muted-foreground">
            Generating flashcards from the current study material.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="gap-4 py-6">
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <p className="text-sm text-muted-foreground">Generating flashcards...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasFlashcards && isError) {
    return (
      <Card className="border border-danger/30 bg-card">
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-lg font-semibold">Flashcards</h2>
          <p className="text-sm text-danger">Failed to generate flashcards.</p>
        </CardHeader>
        <Separator />
        <CardContent className="gap-4">
          <p className="text-sm text-muted-foreground">
            Try again to request a fresh set of flashcards.
          </p>
          <div>
            <Button variant="primary" onPress={handleGenerate} isDisabled={isPending}>
              {isPending ? <Spinner size="sm" /> : null}
              Regenerate flashcards
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session.flashcards?.length) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onPress={handleGenerate} isDisabled={isPending}>
          {isPending ? <Spinner size="sm" /> : null}
          Regenerate flashcards
        </Button>
      </div>

      <FlashcardsPanel cards={session.flashcards} />
    </div>
  )
}
