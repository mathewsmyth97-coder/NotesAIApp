'use client'

import { FlashcardsPanel } from '@/features/flashcards/components/flashcards-panel'
import { QuizPanel } from '@/features/quiz/components/quiz-panel'
import { SessionTabs } from '@/features/study-session/components/session-tabs'
import { mockFlashcards } from '@/mock/flashcards'
import { mockQuiz } from '@/mock/quiz'
import { useSessionUIStore } from '@/stores/session-ui.store'
import { useSessionStore } from '@/stores/session.store'
import { useParams } from 'next/navigation'
import { SessionSummaryWorkspace } from '@/features/summary/components/session-summary-workspace'

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export default function SessionPage() {
  const activeTab = useSessionUIStore((state) => state.activeTab)
  const params = useParams<{ sessionId: string }>()

  const hasHydrated = useSessionStore((state) => state.hasHydrated)
  const session = useSessionStore((state) => state.getSessionById(params.sessionId))

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Loading session...</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Restoring saved study sessions from this browser.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Session not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This mock session does not exist in local state yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{session.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Difficulty: {formatLabel(session.level)} - Tone: {formatLabel(session.tone)}
        </p>
      </div>

      <SessionTabs />

      {activeTab === 'summary' && <SessionSummaryWorkspace session={session} />}
      {activeTab === 'flashcards' && <FlashcardsPanel cards={mockFlashcards} />}
      {activeTab === 'quiz' && <QuizPanel questions={mockQuiz} />}
    </div>
  )
}
