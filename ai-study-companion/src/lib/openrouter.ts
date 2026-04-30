const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function generateStructuredObject<T>({
  systemPrompt,
  userPrompt,
  schemaName,
  schema,
}: {
  systemPrompt: string
  userPrompt: string
  schemaName: string
  schema: Record<string, unknown>
}): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on the server.')
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
      model: process.env.OPENROUTER_MODEL ?? 'openrouter/free',
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

  const content = json.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('OpenRouter returned unexpected content')
  }

  return JSON.parse(content) as T
}
