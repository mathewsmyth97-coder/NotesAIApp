'use client'

import { useCallback, useEffect } from 'react'
import {
  GenerationStatusCard,
  GenerationToolbar,
  RegenerateButton,
} from '@/features/study-session/components/generation-controls'
import { useGenerateSummary } from '@/features/summary/hooks/use-generate-summary'
import { SummaryPanel } from '@/features/summary/components/summary-panel'
import { AiUsageMeter } from '@/features/ai-usage/components/ai-usage-meter'
import { useUpdateStudySession } from '@/features/study-session/hooks/use-study-sessions'
import type { StudySession } from '@/features/study-session/types/session.types'

export function SessionSummaryWorkspace({ session }: { session: StudySession }) {
  const {
    isError: isGenerateError,
    isPending: isGenerating,
    mutate,
  } = useGenerateSummary()
  const {
    isError: isUpdateError,
    isPending: isUpdating,
    mutate: updateSession,
  } = useUpdateStudySession(session.id)
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
          updateSession({ summary: data })
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
        <AiUsageMeter />
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
