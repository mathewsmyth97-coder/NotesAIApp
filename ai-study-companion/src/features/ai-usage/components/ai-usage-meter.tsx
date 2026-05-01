'use client'

import { KeyRound } from 'lucide-react'
import { useAiUsageStatus } from '@/features/ai-usage/hooks/use-ai-usage'

const tokenFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function formatTokens(value: number) {
  if (value < 10_000) {
    return value.toLocaleString()
  }

  return tokenFormatter.format(value)
}

export function AiUsageMeter() {
  const { data, isError, isLoading } = useAiUsageStatus()

  if (isLoading) {
    return (
      <span className="text-xs font-medium text-muted-foreground">
        AI tokens loading...
      </span>
    )
  }

  if (isError || !data) {
    return null
  }

  if (data.hasUserOpenRouterKey) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        title="Your saved OpenRouter key is active, so the app token allowance does not apply."
      >
        <KeyRound className="h-3.5 w-3.5" />
        Using your key
      </span>
    )
  }

  return (
    <span
      className="text-xs font-medium text-muted-foreground"
      title={`Resets at ${new Date(data.resetsAt).toLocaleString()}`}
    >
      AI tokens: {formatTokens(data.tokensUsed)} / {formatTokens(data.tokenLimit)} today
    </span>
  )
}
