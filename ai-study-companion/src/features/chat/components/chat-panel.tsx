'use client'

import { FormEvent, useEffect, useRef } from 'react'
import { Button, Chip, Spinner, TextArea } from '@heroui/react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionFeatureCard } from '@/features/study-session/components/session-feature-card'
import type { ChatMessage } from '@/features/study-session/types/session.types'

export function ChatPanel({
  messages,
  draft,
  hasError,
  streamingContent = '',
  streamingMessageId,
  isStreaming,
  onDraftChange,
  onSubmit,
}: {
  messages: ChatMessage[]
  draft: string
  hasError: boolean
  streamingContent?: string
  streamingMessageId?: string | null
  isStreaming: boolean
  onDraftChange: (value: string) => void
  onSubmit: () => void
}) {
  const canSubmit = draft.trim().length > 0 && !isStreaming
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const streamingBubbleId = streamingMessageId ?? 'streaming-assistant-message'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages.length, streamingContent, isStreaming])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <SessionFeatureCard
      title="Chat"
      description="Ask follow-up questions about the current study session."
      contentClassName="gap-4"
    >
      <div className="flex max-h-[520px] min-h-[300px] flex-col gap-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Start with a question about the source material, summary, flashcards, or quiz.
            </p>
          </div>
        ) : null}

        {messages.map((message) => {
          const isUser = message.role === 'user'

          return (
            <div
              key={message.id}
              className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}
            >
              <Chip size="sm" variant="tertiary">
                {isUser ? 'You' : 'AI'}
              </Chip>
              <div
                className={cn(
                  'max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6',
                  isUser
                    ? 'bg-foreground text-background'
                    : 'border border-border bg-background text-foreground',
                )}
              >
                {message.content}
              </div>
            </div>
          )
        })}

        {isStreaming && streamingContent.length === 0 ? (
          <div key={`${streamingBubbleId}-thinking`} className="flex flex-col items-start gap-1">
            <Chip size="sm" variant="tertiary">
              AI
            </Chip>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
              <Spinner size="sm" />
              <span>Reading the session context...</span>
            </div>
          </div>
        ) : null}

        {streamingContent.length > 0 ? (
          <div key={streamingBubbleId} className="flex flex-col items-start gap-1">
            <Chip size="sm" variant="tertiary">
              AI
            </Chip>
            <div className="max-w-[82%] rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground">
              {streamingContent}
              {isStreaming ? (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-foreground"
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {hasError ? (
        <p className="text-sm text-danger">
          The AI reply could not be generated. Try sending another message.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextArea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          rows={3}
          placeholder="Ask about this study session..."
          className="min-h-[96px] w-full"
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isDisabled={!canSubmit}>
            {isStreaming ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
            Send
          </Button>
        </div>
      </form>
    </SessionFeatureCard>
  )
}
