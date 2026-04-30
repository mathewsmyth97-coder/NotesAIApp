import { NextResponse } from 'next/server'
import { generateStructuredObject } from '@/lib/openrouter'

const flashcardsSchema = {
  type: 'object',
  properties: {
    cards: {
      type: 'array',
      minItems: 5,
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          front: { type: 'string' },
          back: { type: 'string' },
        },
        required: ['id', 'front', 'back'],
        additionalProperties: false,
      },
    },
  },
  required: ['cards'],
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
      cards: Array<{ id: string; front: string; back: string }>
    }>({
      schemaName: 'flashcards_result',
      schema: flashcardsSchema,
      systemPrompt:
        `You are an AI study companion. ` +
        `Create useful study flashcards from the material. ` +
        `Use a ${tone} tone. ` +
        `Target ${level} difficulty. ` +
        `Make fronts short and backs clear.`,
      userPrompt:
        `Session title: ${title}\n\n` +
        `Study material:\n${sourceText}`,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate flashcards' },
      { status: 500 },
    )
  }
}