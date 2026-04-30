import { Card, CardContent, CardHeader, Chip, Separator } from '@heroui/react'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'

export function FlashcardsPanel({ cards }: { cards: Flashcard[] }) {
  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-lg font-semibold">Flashcards</h2>
        <p className="text-sm text-muted-foreground">
          Quick recall prompts generated from the material.
        </p>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article key={card.id} className="rounded-2xl border border-border p-4">
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
      </CardContent>
    </Card>
  )
}
