import { NewSessionForm } from '@/features/study-session/components/new-session-form'
import { SectionCard } from '@/components/shared/section-card'

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard
        title="Create a study session"
        description="Paste notes or a topic and generate learning content."
      >
        <NewSessionForm />
      </SectionCard>

      <SectionCard
        title="What this project shows"
        description="A polished UI and strong frontend architecture."
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Feature-based folders</p>
          <p>Typed form validation</p>
          <p>Server state and client state separation</p>
          <p>Reusable dashboard UI patterns</p>
        </div>
      </SectionCard>
    </div>
  )
}