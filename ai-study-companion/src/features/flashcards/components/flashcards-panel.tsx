import { Chip } from '@heroui/react'
import { SessionFeatureCard } from '@/features/study-session/components/session-feature-card'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'

export function FlashcardsPanel({ cards }: { cards: Flashcard[] }) {
  return (
    <SessionFeatureCard
      title="Flashcards"
      description="Quick recall prompts generated from the material."
    >
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card, index) => (
            <article
              key={card.id || `flashcard-${index}`}
              className="rounded-2xl border border-border p-4"
            >
              <Chip size="sm" variant="tertiary">
                Front
              </Chip>
              <p className="mt-3 font-medium">{card.front}</p>

              <div className="my-4 h-px bg-border" />

              <Chip size="sm" variant="tertiary">
                Back
              </Chip>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.back}</p>
            </article>
          ))}
        </div>
    </SessionFeatureCard>
  )
}
