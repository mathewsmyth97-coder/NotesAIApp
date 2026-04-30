import Link from 'next/link'

const sessions = [
  { id: '1', title: 'Photosynthesis Basics' },
  { id: '2', title: 'JavaScript Closures' },
  { id: '3', title: 'French Revolution' },
]

export function AppSidebar() {
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

        <div className="space-y-2">
          <p className="px-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Recent sessions
          </p>
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="block rounded-2xl px-3 py-2 text-sm transition hover:bg-accent"
            >
              {session.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}