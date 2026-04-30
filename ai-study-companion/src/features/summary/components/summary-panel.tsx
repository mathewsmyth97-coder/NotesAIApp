import type { SummaryResult } from '@/features/summary/types/summary.types'
import { SectionCard } from '@/components/shared/section-card'

export function SummaryPanel({ summary }: { summary: SummaryResult }) {
  return (
    <SectionCard title="Summary" description="A condensed explanation of the current material.">
      <div className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">{summary.text}</p>
        <div className="space-y-2">
          {summary.bulletPoints.map((point) => (
            <div key={point} className="rounded-2xl border border-border px-3 py-2 text-sm">
              {point}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}