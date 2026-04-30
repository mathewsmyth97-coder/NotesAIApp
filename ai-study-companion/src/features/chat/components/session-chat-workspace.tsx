'use client'

import { useState } from 'react'
import { ChatPanel } from '@/features/chat/components/chat-panel'
import { useStreamChatMessage } from '@/features/chat/hooks/use-stream-chat-message'
import type { ChatMessage, StudySession } from '@/features/study-session/types/session.types'
import { useSessionStore } from '@/stores/session.store'

export function SessionChatWorkspace({ session }: { session: StudySession }) {
  const [draft, setDraft] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isStreamingActive, setIsStreamingActive] = useState(false)
  const addMessagesToSession = useSessionStore((state) => state.addMessagesToSession)
  const { isError, isPending, mutate } = useStreamChatMessage()
  const messages = session.messages ?? []
  const isStreaming = isPending || isStreamingActive

  const handleSubmit = () => {
    const content = draft.trim()

    if (!content || isStreaming) {
      return
    }

    const assistantMessageId = crypto.randomUUID()
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    const nextMessages = [...messages, userMessage]

    addMessagesToSession(session.id, [userMessage])
    setDraft('')
    setStreamingContent('')
    setStreamingMessageId(assistantMessageId)
    setIsStreamingActive(true)

    mutate(
      {
        payload: {
          sessionId: session.id,
          sourceText: session.sourceText,
          tone: session.tone,
          level: session.level,
          messages: nextMessages,
        },
        onChunk: (chunk) => {
          setStreamingContent((current) => current + chunk)
        },
      },
      {
        onSuccess: (content) => {
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content,
            createdAt: new Date().toISOString(),
          }

          addMessagesToSession(session.id, [assistantMessage])
          setStreamingContent('')
          setStreamingMessageId(null)
          setIsStreamingActive(false)
        },
        onError: () => {
          setStreamingContent('')
          setStreamingMessageId(null)
          setIsStreamingActive(false)
        },
      },
    )
  }

  return (
    <ChatPanel
      messages={messages}
      draft={draft}
      hasError={isError}
      streamingContent={streamingContent}
      streamingMessageId={streamingMessageId}
      isStreaming={isStreaming}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
    />
  )
}
