'use client'

import Link from 'next/link'
import { Spinner } from '@heroui/react'
import { useStudySessions } from '@/features/study-session/hooks/use-study-sessions'

export function AppSidebar() {
  const { data: sessions = [], isError, isPending } = useStudySessions()

  return (
    <aside className="hidden border-r border-border bg-card/40 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Study Companion</h1>
          <p className="text-sm text-muted-foreground">AI-powered learning workspace</p>
        </div>

        <Link
          href="/dashboard"
          className="mb-5 rounded-2xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-accent"
        >
          + New Session
        </Link>

        <Link
          href="/settings"
          className="mb-5 rounded-2xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-accent"
        >
          Settings
        </Link>

        <div className="space-y-2">
          <p className="px-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Recent sessions
          </p>

          {isPending ? (
            <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
              <Spinner size="sm" />
              Loading sessions...
            </div>
          ) : isError ? (
            <p className="px-2 text-sm leading-6 text-red-500">
              Failed to load sessions.
            </p>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="block rounded-2xl px-3 py-2 text-sm transition hover:bg-accent"
              >
                {session.title}
              </Link>
            ))
          ) : (
            <p className="px-2 text-sm leading-6 text-muted-foreground">
              Create a session to see it here.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
