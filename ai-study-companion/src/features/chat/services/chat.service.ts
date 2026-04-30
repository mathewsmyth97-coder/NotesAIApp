import type { ChatMessage, StudySession } from '@/features/study-session/types/session.types'
import { streamText } from '@/features/chat/utils/stream-text'

export async function streamChatMessage(
  payload: {
    sessionId: string
    sourceText: string
    tone: StudySession['tone']
    level: StudySession['level']
    messages: ChatMessage[]
  },
  handlers: {
    onChunk: (chunk: string) => void
    onComplete?: () => void
    onError?: (error: Error) => void
  },
) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    throw new Error('Failed to start streaming chat response')
  }

  try {
    const content = await streamText(response.body, {
      onChunk: handlers.onChunk,
    })

    handlers.onComplete?.()
    return content
  } catch (error) {
    handlers.onError?.(error as Error)
    throw error
  }
}
