import { SectionCard } from '@/components/shared/section-card'
import { OpenRouterKeyForm } from '@/features/settings/components/openrouter-key-form'
import { OpenRouterModelPreferences } from '@/features/settings/components/openrouter-model-preferences'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionCard
        title="API keys"
        description="Manage account-level provider keys for AI generation."
      >
        <OpenRouterKeyForm />
      </SectionCard>

      <SectionCard
        title="Model preferences"
        description="Choose which OpenRouter models this account uses."
      >
        <OpenRouterModelPreferences />
      </SectionCard>
    </div>
  )
}
