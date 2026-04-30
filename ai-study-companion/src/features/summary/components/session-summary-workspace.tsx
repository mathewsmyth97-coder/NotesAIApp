'use client'

import { useCallback, useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, Separator, Spinner } from '@heroui/react'
import { useGenerateSummary } from '@/features/summary/hooks/use-generate-summary'
import { SummaryPanel } from '@/features/summary/components/summary-panel'
import { useSessionStore } from '@/stores/session.store'
import type { StudySession } from '@/features/study-session/types/session.types'

export function SessionSummaryWorkspace({ session }: { session: StudySession }) {
  const saveSummaryToSession = useSessionStore((state) => state.saveSummaryToSession)
  const { isError, isPending, mutate } = useGenerateSummary()

  const handleGenerate = useCallback(() => {
    mutate(
      {
        sessionId: session.id,
        sourceText: session.sourceText,
        tone: session.tone,
      },
      {
        onSuccess: (data) => {
          saveSummaryToSession(session.id, data)
        },
      },
    )
  }, [mutate, saveSummaryToSession, session.id, session.sourceText, session.tone])

  useEffect(() => {
    if (!session.summary) {
      handleGenerate()
    }
  }, [handleGenerate, session.summary])

  if (!session.summary && isPending) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p className="text-sm text-muted-foreground">
            Generating summary from the current study material.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="gap-4 py-6">
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <p className="text-sm text-muted-foreground">Generating summary...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session.summary && isError) {
    return (
      <Card className="border border-danger/30 bg-card">
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p className="text-sm text-danger">Failed to generate summary.</p>
        </CardHeader>
        <Separator />
        <CardContent className="gap-4">
          <p className="text-sm text-muted-foreground">
            Try again to request a fresh summary.
          </p>
          <div>
            <Button
              variant="primary"
              onPress={handleGenerate}
              isDisabled={isPending}
            >
              {isPending ? <Spinner size="sm" /> : null}
              Regenerate summary
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session.summary) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onPress={handleGenerate}
          isDisabled={isPending}
        >
          {isPending ? <Spinner size="sm" /> : null}
          Regenerate summary
        </Button>
      </div>

      <SummaryPanel summary={session.summary} />
    </div>
  )
}
