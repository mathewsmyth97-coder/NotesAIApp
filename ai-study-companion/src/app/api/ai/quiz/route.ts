import { NextResponse } from 'next/server'
import { generateStructuredObject } from '@/lib/openrouter'

const quizSchema = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      minItems: 5,
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          options: {
            type: 'array',
            items: { type: 'string' },
            minItems: 4,
            maxItems: 4,
          },
          correctAnswer: { type: 'string' },
          explanation: { type: 'string' },
        },
        required: ['id', 'question', 'options', 'correctAnswer', 'explanation'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
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
      questions: Array<{
        id: string
        question: string
        options: string[]
        correctAnswer: string
        explanation: string
      }>
    }>({
      schemaName: 'quiz_result',
      schema: quizSchema,
      systemPrompt:
        `You are an AI study companion. ` +
        `Create a multiple-choice quiz from the material. ` +
        `Use a ${tone} tone. ` +
        `Target ${level} difficulty. ` +
        `Each question should have exactly 4 options and one correct answer.`,
      userPrompt:
        `Session title: ${title}\n\n` +
        `Study material:\n${sourceText}`,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 },
    )
  }
}