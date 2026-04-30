import type { QuizQuestion } from '@/features/quiz/types/quiz.types'
import { SectionCard } from '@/components/shared/section-card'

export function QuizPanel({ questions }: { questions: QuizQuestion[] }) {
  return (
    <SectionCard title="Quiz" description="Test your understanding with generated questions.">
      <div className="space-y-4">
        {questions.map((question, index) => (
          <article key={question.id} className="rounded-3xl border border-border p-4">
            <p className="mb-4 text-sm font-semibold">
              {index + 1}. {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option} className="rounded-2xl border border-border px-3 py-2 text-sm">
                  {option}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}