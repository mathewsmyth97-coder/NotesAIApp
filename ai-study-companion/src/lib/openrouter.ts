import {
  getOpenRouterApiKeyForCurrentUser,
  MissingOpenRouterKeyError,
  OpenRouterKeyAuthError,
} from '@/lib/openrouter-user-key'
import { getOpenRouterModelForCurrentUser } from '@/lib/openrouter-model-preferences'
import {
  AiUsageLimitError,
  assertAppKeyUsageAllowed,
  recordAiUsage,
  type AiUsageFeature,
} from '@/lib/ai-usage'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export function getOpenRouterErrorStatus(error: unknown) {
  if (error instanceof OpenRouterKeyAuthError) {
    return 401
  }

  if (error instanceof MissingOpenRouterKeyError) {
    return 400
  }

  if (error instanceof AiUsageLimitError) {
    return 429
  }

  return 500
}

export async function generateStructuredObject<T>({
  systemPrompt,
  userPrompt,
  schemaName,
  schema,
  usageFeature,
}: {
  systemPrompt: string
  userPrompt: string
  schemaName: string
  schema: Record<string, unknown>
  usageFeature: AiUsageFeature
}): Promise<T> {
  const { apiKey, source } = await getOpenRouterApiKeyForCurrentUser()
  const model = await getOpenRouterModelForCurrentUser('generation')

  if (source === 'app') {
    await assertAppKeyUsageAllowed(usageFeature)
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'http://localhost:3000',
      'X-Title': 'AI Study Companion',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'OpenRouter request failed')
  }

  const json = await response.json()
  const tokensUsed =
    typeof json.usage?.total_tokens === 'number' ? json.usage.total_tokens : null

  const content = json.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('OpenRouter returned unexpected content')
  }

  if (source === 'app') {
    await recordAiUsage({
      feature: usageFeature,
      tokensUsed,
    })
  }

  return JSON.parse(content) as T
}
