'use client'

import { useMutation } from '@tanstack/react-query'
import { streamChatMessage } from '@/features/chat/services/chat.service'

export function useStreamChatMessage() {
  return useMutation({
    mutationFn: async ({
      payload,
      onChunk,
    }: {
      payload: {
        sessionId: string
        sourceText: string
        tone: 'concise' | 'detailed'
        level: 'beginner' | 'intermediate' | 'advanced'
        messages: {
          id: string
          role: 'user' | 'assistant'
          content: string
          createdAt: string
        }[]
      }
      onChunk: (chunk: string) => void
    }) => {
      return streamChatMessage(payload, {
        onChunk,
      })
    },
  })
}
