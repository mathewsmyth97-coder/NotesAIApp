'use client'

import { useCallback, useEffect } from 'react'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
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
      <GenerationStatusCard
        title="Summary"
        description="Generating summary from the current study material."
        status="loading"
        message="Generating summary..."
      />
    )
  }

  if (!session.summary && isError) {
    return (
      <GenerationStatusCard
        title="Summary"
        description="Failed to generate summary."
        status="error"
        message="Try again to request a fresh summary."
        actionLabel="Regenerate summary"
        isActionPending={isPending}
        onAction={handleGenerate}
      />
    )
  }

  if (!session.summary) {
    return null
  }

  return (
    <div className="space-y-4">
      <GenerationToolbar>
        <RegenerateButton
          label="Regenerate summary"
          isPending={isPending}
          onPress={handleGenerate}
        />
      </GenerationToolbar>

      <SummaryPanel summary={session.summary} />
    </div>
  )
}
