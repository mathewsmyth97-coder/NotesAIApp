'use client'

import { useState } from 'react'
import { MessageSquareText, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionChatWorkspace } from '@/features/chat/components/session-chat-workspace'
import type { StudySession } from '@/features/study-session/types/session.types'

export function SessionChatSidebar({ session }: { session: StudySession }) {
  const [isOpen, setIsOpen] = useState(true)

  const collapseButton = (
    <button
      type="button"
      aria-label="Collapse chat sidebar"
      title="Collapse chat sidebar"
      onClick={() => setIsOpen(false)}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <PanelRightClose className="h-4 w-4" />
    </button>
  )

  return (
    <aside
      aria-label="Chat sidebar"
      className={cn(
        'min-w-0 transition-[width] duration-200 ease-out xl:sticky xl:top-24',
        isOpen ? 'w-full xl:w-[390px] 2xl:w-[420px]' : 'w-full xl:w-14',
      )}
    >
      <div
        className={cn(
          isOpen ? 'h-[620px] xl:h-[calc(100vh-7rem)] xl:min-h-[520px]' : 'hidden',
        )}
      >
        <SessionChatWorkspace
          session={session}
          variant="sidebar"
          className="h-full"
          headerAction={collapseButton}
        />
      </div>

      <button
        type="button"
        aria-label="Open chat sidebar"
        title="Open chat sidebar"
        onClick={() => setIsOpen(true)}
        className={cn(
          'items-center justify-center gap-3 rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
          isOpen
            ? 'hidden'
            : 'flex h-12 w-full px-4 xl:h-[calc(100vh-7rem)] xl:min-h-[220px] xl:w-14 xl:flex-col xl:px-0',
        )}
      >
        <PanelRightOpen className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium xl:hidden">Open chat</span>
        <span className="hidden rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] xl:block">
          Chat
        </span>
        <MessageSquareText className="hidden h-5 w-5 shrink-0 xl:block" />
      </button>
    </aside>
  )
}
