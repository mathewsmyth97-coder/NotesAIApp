import { NextResponse } from 'next/server'
import {
  getOpenRouterApiKeyForCurrentUser,
  MissingOpenRouterKeyError,
  OpenRouterKeyAuthError,
} from '@/lib/openrouter-user-key'

type OpenRouterModelResponse = {
  data?: Array<{
    id?: unknown
    name?: unknown
    description?: unknown
    context_length?: unknown
    pricing?: unknown
    supported_parameters?: unknown
  }>
}

export async function GET() {
  try {
    const { apiKey } = await getOpenRouterApiKeyForCurrentUser()
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'http://localhost:3000',
        'X-Title': 'AI Study Companion',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const text = await response.text()

      return NextResponse.json(
        { error: text || 'Failed to fetch OpenRouter models.' },
        { status: response.status },
      )
    }

    const json = (await response.json()) as OpenRouterModelResponse
    const models = (json.data ?? [])
      .filter((model) => typeof model.id === 'string')
      .map((model) => ({
        id: model.id as string,
        name: typeof model.name === 'string' ? model.name : model.id as string,
        description:
          typeof model.description === 'string' ? model.description : '',
        contextLength:
          typeof model.context_length === 'number'
            ? model.context_length
            : null,
        pricing:
          model.pricing && typeof model.pricing === 'object'
            ? model.pricing
            : null,
        supportedParameters: Array.isArray(model.supported_parameters)
          ? model.supported_parameters.filter(
              (parameter): parameter is string => typeof parameter === 'string',
            )
          : [],
      }))

    return NextResponse.json(models)
  } catch (error) {
    if (error instanceof OpenRouterKeyAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error instanceof MissingOpenRouterKeyError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch OpenRouter models.',
      },
      { status: 500 },
    )
  }
}
