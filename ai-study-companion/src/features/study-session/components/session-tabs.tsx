'use client'

import { cn } from '@/lib/utils'
import { useSessionUIStore } from '@/stores/session-ui.store'

const tabs = ['summary', 'flashcards', 'quiz'] as const


export function SessionTabs() {
  const activeTab = useSessionUIStore((state) => state.activeTab)
  const setActiveTab = useSessionUIStore((state) => state.setActiveTab)
  

  return (
    <div className="inline-flex rounded-2xl border border-border bg-card p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm capitalize transition',
            activeTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
