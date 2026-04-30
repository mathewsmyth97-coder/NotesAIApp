import { NextResponse } from 'next/server'
import { generateStructuredObject, getOpenRouterErrorStatus } from '@/lib/openrouter'

const summarySchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'A concise explanatory summary of the study material.',
    },
    bulletPoints: {
      type: 'array',
      items: { type: 'string' },
      description: '3 to 5 important takeaways.',
      minItems: 3,
      maxItems: 5,
    },
  },
  required: ['text', 'bulletPoints'],
  additionalProperties: false,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, sourceText, tone, level } = body

    if (!sourceText) {
      return NextResponse.json({ error: 'Missing sourceText' }, { status: 400 })
    }

    const result = await generateStructuredObject<{
      text: string
      bulletPoints: string[]
    }>({
      schemaName: 'summary_result',
      schema: summarySchema,
      systemPrompt:
        `You are an AI study companion. ` +
        `Summarize study material clearly and accurately. ` +
        `Use a ${tone} tone. ` +
        `Target ${level} difficulty.`,
      userPrompt:
        `Session title: ${title}\n\n` +
        `Study material:\n${sourceText}`,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: getOpenRouterErrorStatus(error) },
    )
  }
}
