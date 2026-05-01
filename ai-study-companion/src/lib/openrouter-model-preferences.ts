import 'server-only'

import { createClient } from '@/lib/supabase/server'

export type OpenRouterModelPurpose = 'chat' | 'generation'

type ProfileModelRow = {
  openrouter_chat_model: string | null
  openrouter_generation_model: string | null
}

export function getDefaultOpenRouterModel() {
  return process.env.OPENROUTER_MODEL ?? 'openrouter/free'
}

export async function getOpenRouterModelForCurrentUser(
  purpose: OpenRouterModelPurpose,
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return getDefaultOpenRouterModel()
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('openrouter_chat_model, openrouter_generation_model')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const profile = data as ProfileModelRow | null
  const selectedModel =
    purpose === 'chat'
      ? profile?.openrouter_chat_model
      : profile?.openrouter_generation_model

  return selectedModel || getDefaultOpenRouterModel()
}
