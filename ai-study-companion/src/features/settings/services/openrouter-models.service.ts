import { fetcher } from '@/lib/api/fetcher'

export type OpenRouterModel = {
  id: string
  name: string
  description: string
  contextLength: number | null
  pricing: Record<string, unknown> | null
  supportedParameters: string[]
}

export async function getOpenRouterModels() {
  return fetcher<OpenRouterModel[]>('/api/settings/openrouter-models')
}
