import { fetcher } from '@/lib/api/fetcher'

export type OpenRouterKeyStatus = {
  hasKey: boolean
  maskedKey?: string
  updatedAt?: string
}

export async function getOpenRouterKeyStatus() {
  return fetcher<OpenRouterKeyStatus>('/api/settings/openrouter-key')
}

export async function saveOpenRouterKey(apiKey: string) {
  return fetcher<OpenRouterKeyStatus>('/api/settings/openrouter-key', {
    method: 'POST',
    body: JSON.stringify({ apiKey }),
  })
}

export async function removeOpenRouterKey() {
  return fetcher<OpenRouterKeyStatus>('/api/settings/openrouter-key', {
    method: 'DELETE',
  })
}
