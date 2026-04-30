import { SectionCard } from '@/components/shared/section-card'
import { OpenRouterKeyForm } from '@/features/settings/components/openrouter-key-form'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <SectionCard
        title="API keys"
        description="Manage account-level provider keys for AI generation."
      >
        <OpenRouterKeyForm />
      </SectionCard>
    </div>
  )
}
