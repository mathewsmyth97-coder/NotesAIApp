import 'server-only'

import { decryptSecret } from '@/lib/crypto'
import { createClient } from '@/lib/supabase/server'

type UserApiKeyRow = {
  encrypted_key: string
}

export type OpenRouterApiKeyResolution = {
  apiKey: string
  source: 'user' | 'app'
}

export class OpenRouterKeyAuthError extends Error {
  constructor() {
    super('You must be signed in to use OpenRouter.')
    this.name = 'OpenRouterKeyAuthError'
  }
}

export class MissingOpenRouterKeyError extends Error {
  constructor() {
    super('OpenRouter is not configured for this app.')
    this.name = 'MissingOpenRouterKeyError'
  }
}

export async function getOpenRouterApiKeyForCurrentUser(): Promise<OpenRouterApiKeyResolution> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new OpenRouterKeyAuthError()
  }

  const { data, error } = await supabase
    .from('user_api_keys')
    .select('encrypted_key')
    .eq('provider', 'openrouter')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const row = data as UserApiKeyRow | null

  if (!row) {
    const appApiKey = process.env.OPENROUTER_API_KEY

    if (!appApiKey) {
      throw new MissingOpenRouterKeyError()
    }

    return {
      apiKey: appApiKey,
      source: 'app',
    }
  }

  return {
    apiKey: decryptSecret(row.encrypted_key),
    source: 'user',
  }
}
