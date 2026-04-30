import 'server-only'

import { decryptSecret } from '@/lib/crypto'
import { createClient } from '@/lib/supabase/server'

type UserApiKeyRow = {
  encrypted_key: string
}

export class OpenRouterKeyAuthError extends Error {
  constructor() {
    super('You must be signed in to use OpenRouter.')
    this.name = 'OpenRouterKeyAuthError'
  }
}

export class MissingOpenRouterKeyError extends Error {
  constructor() {
    super('Add your OpenRouter API key in settings before generating study content.')
    this.name = 'MissingOpenRouterKeyError'
  }
}

export async function getOpenRouterApiKeyForCurrentUser() {
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
    throw new MissingOpenRouterKeyError()
  }

  return decryptSecret(row.encrypted_key)
}
