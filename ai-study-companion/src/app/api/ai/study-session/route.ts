import { NextResponse } from 'next/server'
import { generateStructuredObject, getOpenRouterErrorStatus } from '@/lib/openrouter'
import type { GeneratedStudyContent } from '@/features/study-session/types/session.types'

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

const flashcardSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    front: { type: 'string' },
    back: { type: 'string' },
  },
  required: ['id', 'front', 'back'],
  additionalProperties: false,
}

const quizQuestionSchema = {
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
}

const studySessionSchema = {
  type: 'object',
  properties: {
    summary: summarySchema,
    flashcards: {
      type: 'array',
      minItems: 5,
      maxItems: 8,
      items: flashcardSchema,
    },
    quiz: {
      type: 'array',
      minItems: 5,
      maxItems: 8,
      items: quizQuestionSchema,
    },
  },
  required: ['summary', 'flashcards', 'quiz'],
  additionalProperties: false,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, sourceText, tone, level } = body

    if (!sourceText) {
      return NextResponse.json({ error: 'Missing sourceText' }, { status: 400 })
    }

    const result = await generateStructuredObject<GeneratedStudyContent>({
      schemaName: 'study_session_result',
      schema: studySessionSchema,
      systemPrompt:
        `You are an AI study companion. ` +
        `Generate one complete study session from the provided material. ` +
        `Use a ${tone} tone. ` +
        `Target ${level} difficulty. ` +
        `Return a clear summary, 3 to 5 key takeaways, 5 to 8 flashcards, ` +
        `and 5 to 8 multiple-choice quiz questions. ` +
        `Each quiz question must have exactly 4 options and one correct answer. ` +
        `The correctAnswer value must exactly match one of the options.`,
      userPrompt:
        `Session title: ${title}\n\n` +
        `Study material:\n${sourceText}`,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate study session',
      },
      { status: getOpenRouterErrorStatus(error) },
    )
  }
}
