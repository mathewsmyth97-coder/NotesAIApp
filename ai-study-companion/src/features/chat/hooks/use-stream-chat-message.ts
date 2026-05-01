'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiUsageQueryKey } from '@/features/ai-usage/hooks/use-ai-usage'
import { streamChatMessage } from '@/features/chat/services/chat.service'

export function useStreamChatMessage() {
  const queryClient = useQueryClient()

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
        title: string
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
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: aiUsageQueryKey })
    },
  })
}
