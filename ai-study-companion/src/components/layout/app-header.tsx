'use client'

import { useTheme } from 'next-themes'

export function AppHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <p className="text-sm text-muted-foreground">Workspace</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-2xl border border-border px-3 py-2 text-sm transition hover:bg-accent"
          >
            Toggle theme
          </button>
          <button className="rounded-2xl border border-border px-3 py-2 text-sm transition hover:bg-accent">
            Profile
          </button>
        </div>
      </div>
    </header>
  )
}