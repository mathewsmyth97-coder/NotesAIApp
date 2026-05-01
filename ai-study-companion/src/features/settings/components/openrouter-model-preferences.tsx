'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Button, Input, Label, Spinner } from '@heroui/react'
import {
  useOpenRouterModels,
  useProfileSettings,
  useUpdateProfileSettings,
} from '@/features/settings/hooks/use-profile-settings'
import type { OpenRouterModel } from '@/features/settings/services/openrouter-models.service'
import type { ProfileSettings } from '@/features/settings/services/profile.service'

function supportsStructuredOutput(model: OpenRouterModel) {
  return (
    model.supportedParameters.includes('response_format') ||
    model.supportedParameters.includes('structured_outputs')
  )
}

function formatContextLength(value: number | null) {
  if (!value) return 'Context window: unknown'

  return `Context window: ${new Intl.NumberFormat().format(value)} tokens`
}

function ModelSelect({
  label,
  value,
  models,
  onChange,
}: {
  label: string
  value: string
  models: OpenRouterModel[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-400"
      >
        <option value="">Use default model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.id})
          </option>
        ))}
      </select>
    </div>
  )
}

function SelectedModelDetails({
  title,
  model,
}: {
  title: string
  model?: OpenRouterModel
}) {
  if (!model) return null

  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{model.id}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {formatContextLength(model.contextLength)}
      </p>
    </div>
  )
}

function OpenRouterModelPreferencesForm({
  profile,
  models,
}: {
  profile: ProfileSettings
  models: OpenRouterModel[]
}) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [chatModel, setChatModel] = useState(profile.openrouterChatModel ?? '')
  const [generationModel, setGenerationModel] = useState(
    profile.openrouterGenerationModel ?? '',
  )
  const [message, setMessage] = useState<string | null>(null)
  const updateProfile = useUpdateProfileSettings()
  const generationModels = useMemo(
    () => models.filter(supportsStructuredOutput),
    [models],
  )
  const selectedChatModel = models.find((model) => model.id === chatModel)
  const selectedGenerationModel = models.find(
    (model) => model.id === generationModel,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    updateProfile.mutate(
      {
        displayName,
        openrouterChatModel: chatModel || null,
        openrouterGenerationModel: generationModel || null,
      },
      {
        onSuccess: (updatedProfile) => {
          setDisplayName(updatedProfile.displayName)
          setChatModel(updatedProfile.openrouterChatModel ?? '')
          setGenerationModel(updatedProfile.openrouterGenerationModel ?? '')
          setMessage('Model preferences saved.')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Display name</Label>
        <Input
          aria-label="Display name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Optional"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ModelSelect
          label="Chat model"
          value={chatModel}
          models={models}
          onChange={setChatModel}
        />
        <ModelSelect
          label="Study generation model"
          value={generationModel}
          models={generationModels}
          onChange={setGenerationModel}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectedModelDetails title="Selected chat model" model={selectedChatModel} />
        <SelectedModelDetails
          title="Selected generation model"
          model={selectedGenerationModel}
        />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Generation models are filtered to options that advertise structured JSON
        output support, because summaries, flashcards, and quizzes are saved as
        typed data.
      </p>

      {updateProfile.error instanceof Error ? (
        <p className="text-sm text-red-500">{updateProfile.error.message}</p>
      ) : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <Button
        type="submit"
        isDisabled={updateProfile.isPending}
        className="rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        {updateProfile.isPending ? <Spinner size="sm" /> : null}
        Save model preferences
      </Button>
    </form>
  )
}

export function OpenRouterModelPreferences() {
  const profile = useProfileSettings()
  const models = useOpenRouterModels()
  const isPending = profile.isPending || models.isPending
  const error =
    profile.error instanceof Error
      ? profile.error.message
      : models.error instanceof Error
        ? models.error.message
        : null

  if (isPending) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner size="sm" />
        Loading model preferences...
      </div>
    )
  }

  if (error || !profile.data || !models.data) {
    return (
      <p className="text-sm text-red-500">
        {error ?? 'Failed to load model preferences.'}
      </p>
    )
  }

  return (
    <OpenRouterModelPreferencesForm
      profile={profile.data}
      models={models.data}
    />
  )
}
