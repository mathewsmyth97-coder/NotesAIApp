import { streamText } from '@/features/chat/utils/stream-text'

export class ChatStreamError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ChatStreamError'
  }
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

const getErrorPayload = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await response.json() as { code?: string; message?: string }

    return {
      code: body.code,
      message: body.message ?? 'Failed to start streaming chat',
    }
  }

  return {
    code: undefined,
    message: await response.text(),
  }
}

export async function streamChatMessage(
  payload: {
    sessionId: string
    title: string
    sourceText: string
    tone: 'concise' | 'detailed'
    level: 'beginner' | 'intermediate' | 'advanced'
    messages: ChatMessage[]
  },
  handlers: {
    onChunk: (chunk: string) => void
  },
) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await getErrorPayload(response)

    throw new ChatStreamError(error.message, response.status, error.code)
  }

  if (!response.body) {
    throw new ChatStreamError('Failed to start streaming chat', response.status)
  }

  return streamText(response.body, {
    onChunk: handlers.onChunk,
  })
}
