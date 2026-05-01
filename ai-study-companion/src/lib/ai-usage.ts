import 'server-only'

import { createClient } from '@/lib/supabase/server'

export type AiUsageFeature =
  | 'chat'
  | 'summary'
  | 'flashcards'
  | 'quiz'
  | 'study_session'

const DEFAULT_DAILY_TOKEN_LIMIT = 100_000

export type AiUsageStatus = {
  tokensUsed: number
  tokenLimit: number
  hasUserOpenRouterKey: boolean
  resetsAt: string
}

export class AiUsageLimitError extends Error {
  constructor(limit: number, tokensUsedToday: number) {
    super(
      `Daily AI token limit reached (${tokensUsedToday.toLocaleString()} / ${limit.toLocaleString()} tokens). Add your own OpenRouter key in settings or try again tomorrow.`,
    )
    this.name = 'AiUsageLimitError'
    this.limit = limit
    this.tokensUsedToday = tokensUsedToday
  }

  limit: number
  tokensUsedToday: number
}

function getDailyTokenLimit() {
  const value = Number(process.env.APP_AI_DAILY_TOKEN_LIMIT)

  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_DAILY_TOKEN_LIMIT
  }

  return Math.floor(value)
}

function getDayStartIso() {
  const now = new Date()
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  return dayStart.toISOString()
}

function getNextDayStartIso() {
  const now = new Date()
  const nextDayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  )

  return nextDayStart.toISOString()
}

async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

export async function getCurrentAiUsageStatus(): Promise<AiUsageStatus> {
  const { supabase, user } = await getCurrentUser()
  const limit = getDailyTokenLimit()
  const dayStart = getDayStartIso()
  const nextDayStart = getNextDayStartIso()
  const { data, error } = await supabase
    .from('ai_usage')
    .select('tokens_used')
    .eq('user_id', user.id)
    .gte('created_at', dayStart)
    .lt('created_at', nextDayStart)

  if (error) {
    throw new Error(error.message)
  }

  const tokensUsedToday = (data ?? []).reduce((total, row) => {
    const tokensUsed = row.tokens_used

    return total + (typeof tokensUsed === 'number' ? tokensUsed : 0)
  }, 0)

  const { data: apiKey, error: apiKeyError } = await supabase
    .from('user_api_keys')
    .select('id')
    .eq('user_id', user.id)
    .eq('provider', 'openrouter')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (apiKeyError) {
    throw new Error(apiKeyError.message)
  }

  return {
    tokensUsed: tokensUsedToday,
    tokenLimit: limit,
    hasUserOpenRouterKey: Boolean(apiKey),
    resetsAt: nextDayStart,
  }
}

export async function assertAppKeyUsageAllowed(feature: AiUsageFeature) {
  void feature

  const { tokensUsed, tokenLimit } = await getCurrentAiUsageStatus()

  if (tokensUsed >= tokenLimit) {
    throw new AiUsageLimitError(tokenLimit, tokensUsed)
  }
}

export async function recordAiUsage({
  feature,
  tokensUsed = null,
}: {
  feature: AiUsageFeature
  tokensUsed?: number | null
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return
  }

  const { error } = await supabase.from('ai_usage').insert({
    user_id: user.id,
    feature,
    tokens_used: tokensUsed,
  })

  if (error) {
    console.error('Failed to record AI usage', error)
  }
}
