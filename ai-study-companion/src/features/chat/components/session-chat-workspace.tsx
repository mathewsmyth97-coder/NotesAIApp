'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChatPanel } from '@/features/chat/components/chat-panel'
import { useStreamChatMessage } from '@/features/chat/hooks/use-stream-chat-message'
import { ChatStreamError } from '@/features/chat/services/chat.service'
import type { ChatMessage, StudySession } from '@/features/study-session/types/session.types'
import { useUpdateStudySession } from '@/features/study-session/hooks/use-study-sessions'

export function SessionChatWorkspace({
  session,
  variant = 'default',
  className,
  headerAction,
}: {
  session: StudySession
  variant?: 'default' | 'sidebar'
  className?: string
  headerAction?: ReactNode
}) {
  const [draft, setDraft] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isStreamingActive, setIsStreamingActive] = useState(false)
  const [localConversation, setLocalConversation] = useState<{
    sessionId: string
    messages: ChatMessage[]
  } | null>(null)
  const { mutate: updateSession } = useUpdateStudySession(session.id)
  const { error, isError, isPending, mutate } = useStreamChatMessage()
  const messages =
    localConversation?.sessionId === session.id
      ? localConversation.messages
      : (session.messages ?? [])
  const isStreaming = isPending || isStreamingActive
  const errorMessage =
    error instanceof ChatStreamError &&
    (error.code === 'credits_exceeded' || error.code === 'rate_limited')
      ? error.message
      : undefined

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

    setLocalConversation({ sessionId: session.id, messages: nextMessages })
    setDraft('')
    setStreamingContent('')
    setStreamingMessageId(assistantMessageId)
    setIsStreamingActive(true)

    mutate(
      {
        payload: {
          sessionId: session.id,
          title: session.title,
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
          const completedMessages = [...nextMessages, assistantMessage]

          setLocalConversation({ sessionId: session.id, messages: completedMessages })
          updateSession({ messages: completedMessages })
          setStreamingContent('')
          setStreamingMessageId(null)
          setIsStreamingActive(false)
        },
        onError: () => {
          updateSession({ messages: nextMessages })
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
      errorMessage={errorMessage}
      streamingContent={streamingContent}
      streamingMessageId={streamingMessageId}
      isStreaming={isStreaming}
      variant={variant}
      className={className}
      headerAction={headerAction}
      onDraftChange={setDraft}
      onSubmit={handleSubmit}
    />
  )
}
