import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import { SectionCard } from '@/components/shared/section-card'

export function FlashcardsPanel({ cards }: { cards: Flashcard[] }) {
  return (
    <SectionCard title="Flashcards" description="Quick recall prompts generated from the material.">
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.id} className="rounded-3xl border border-border p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Front</p>
            <p className="mt-2 font-medium">{card.front}</p>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">Back</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.back}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}