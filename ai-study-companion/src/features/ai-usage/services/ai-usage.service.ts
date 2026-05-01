import { fetcher } from '@/lib/api/fetcher'

export type AiUsageStatus = {
  tokensUsed: number
  tokenLimit: number
  hasUserOpenRouterKey: boolean
  resetsAt: string
}

export async function getAiUsageStatus() {
  return fetcher<AiUsageStatus>('/api/ai/usage')
}
