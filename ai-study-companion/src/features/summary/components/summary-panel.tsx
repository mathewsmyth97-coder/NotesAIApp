import { Chip } from '@heroui/react'
import { SessionFeatureCard } from '@/features/study-session/components/session-feature-card'
import type { SummaryResult } from '@/features/summary/types/summary.types'

export function SummaryPanel({ summary }: { summary: SummaryResult }) {
  return (
    <SessionFeatureCard
      title="Summary"
      description="A condensed explanation of the current material."
      contentClassName="gap-4"
    >
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
    </SessionFeatureCard>
  )
}
