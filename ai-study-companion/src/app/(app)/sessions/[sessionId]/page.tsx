import { SummaryPanel } from '@/features/summary/components/summary-panel'
import { FlashcardsPanel } from '@/features/flashcards/components/flashcards-panel'
import { QuizPanel } from '@/features/quiz/components/quiz-panel'
import { SessionTabs } from '@/features/study-session/components/session-tabs'
import { mockSummary } from '@/mock/summary'
import { mockFlashcards } from '@/mock/flashcards'
import { mockQuiz } from '@/mock/quiz'

export default function SessionPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">JavaScript Closures</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mock session page. Replace this with live data after the UI feels complete.
        </p>
      </div>

      <SessionTabs />

      <SummaryPanel summary={mockSummary} />
      <FlashcardsPanel cards={mockFlashcards} />
      <QuizPanel questions={mockQuiz} />
    </div>
  )
}