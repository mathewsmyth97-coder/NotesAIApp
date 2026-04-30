import { Card, CardContent, CardHeader, Chip, Separator } from '@heroui/react'
import type { SummaryResult } from '@/features/summary/types/summary.types'

export function SummaryPanel({ summary }: { summary: SummaryResult }) {
  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="text-sm text-muted-foreground">
          A condensed explanation of the current material.
        </p>
      </CardHeader>

      <Separator />

      <CardContent className="gap-4">
        <p className="text-sm leading-7 text-muted-foreground">{summary.text}</p>

        <div className="flex flex-wrap gap-2">
          {summary.bulletPoints.map((point) => (
            <Chip
              key={point}
              variant="tertiary"
              className="max-w-full whitespace-normal border border-border px-2 py-4 text-sm"
            >
              {point}
            </Chip>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
