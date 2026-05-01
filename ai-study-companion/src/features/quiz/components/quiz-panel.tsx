import { Chip, Separator } from '@heroui/react'
import { SessionFeatureCard } from '@/features/study-session/components/session-feature-card'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'

export function QuizPanel({ questions }: { questions: QuizQuestion[] }) {
  return (
    <SessionFeatureCard
      title="Quiz"
      description="Test your understanding with generated questions."
    >
        <div className="space-y-4">
          {questions.map((question, index) => (
            <article
              key={question.id || `question-${index}`}
              className="rounded-2xl border border-border p-4"
            >
              <div className="mb-4 flex items-start gap-3">
                <Chip size="sm" variant="tertiary">
                  {index + 1}
                </Chip>
                <p className="text-sm font-semibold leading-6">{question.question}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = option === question.correctAnswer

                  return (
                    <div
                      key={`${option}-${optionIndex}`}
                      className="rounded-2xl border border-border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{option}</span>
                        {isCorrect ? (
                          <Chip size="sm" variant="soft" color="success">
                            Answer
                          </Chip>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <div>
                <Chip size="sm" variant="tertiary">
                  Explanation
                </Chip>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            </article>
          ))}
        </div>
    </SessionFeatureCard>
  )
}
