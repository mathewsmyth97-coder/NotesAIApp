'use client'

import { FormEvent, useState } from 'react'
import { Button, Input, Label, Spinner } from '@heroui/react'
import {
  useOpenRouterKeyStatus,
  useRemoveOpenRouterKey,
  useSaveOpenRouterKey,
} from '@/features/settings/hooks/use-openrouter-key'

function formatSavedDate(value?: string) {
  if (!value) return null

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function OpenRouterKeyForm() {
  const [apiKey, setApiKey] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const { data, isError, isPending } = useOpenRouterKeyStatus()
  const saveKey = useSaveOpenRouterKey()
  const removeKey = useRemoveOpenRouterKey()
  const isMutating = saveKey.isPending || removeKey.isPending
  const error =
    saveKey.error instanceof Error
      ? saveKey.error.message
      : removeKey.error instanceof Error
        ? removeKey.error.message
        : null
  const savedAt = formatSavedDate(data?.updatedAt)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    saveKey.mutate(apiKey, {
      onSuccess: () => {
        setApiKey('')
        setMessage('OpenRouter key saved.')
      },
    })
  }

  const handleRemove = () => {
    setMessage(null)
    removeKey.mutate(undefined, {
      onSuccess: () => {
        setApiKey('')
        setMessage('OpenRouter key removed.')
      },
    })
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner size="sm" />
        Loading OpenRouter key settings...
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Failed to load OpenRouter key settings.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border p-4">
        <p className="text-sm font-medium">
          {data?.hasKey ? 'OpenRouter key saved' : 'No OpenRouter key saved'}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {data?.hasKey
            ? `${data.maskedKey}${savedAt ? ` - Updated ${savedAt}` : ''}`
            : 'Use the app default key, or add your own OpenRouter key to use your account and bypass app limits.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {data?.hasKey ? 'Replace OpenRouter key' : 'OpenRouter API key'}
          </Label>
          <Input
            type="password"
            aria-label="OpenRouter API key"
            autoComplete="off"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Adding your own key is optional. If you do add one, create a
          dedicated OpenRouter key for this app and set a low spend limit in
          OpenRouter. The full key is encrypted server-side and is not shown
          again after saving.
        </p>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            isDisabled={isMutating || !apiKey.trim()}
            className="rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            {saveKey.isPending ? <Spinner size="sm" /> : null}
            {data?.hasKey ? 'Replace key' : 'Save key'}
          </Button>

          {data?.hasKey ? (
            <Button
              type="button"
              variant="outline"
              isDisabled={isMutating}
              onPress={handleRemove}
              className="rounded-2xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              {removeKey.isPending ? <Spinner size="sm" /> : null}
              Remove key
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
