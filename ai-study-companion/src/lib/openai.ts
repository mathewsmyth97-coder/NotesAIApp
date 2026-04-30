import OpenAI from 'openai'

export class MissingOpenAIKeyError extends Error {
  constructor() {
    super('OPENAI_API_KEY is not configured')
    this.name = 'MissingOpenAIKeyError'
  }
}

let openai: OpenAI | null = null

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new MissingOpenAIKeyError()
  }

  openai ??= new OpenAI({ apiKey })

  return openai
}
