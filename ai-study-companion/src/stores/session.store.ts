import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudySession } from '@/features/study-session/types/session.types'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import type { SummaryResult } from '@/features/summary/types/summary.types'

interface SessionStore {
  sessions: StudySession[]
  hasHydrated: boolean
  createSession: (input: {
    title: string
    sourceText: string
    tone: 'concise' | 'detailed'
    level: 'beginner' | 'intermediate' | 'advanced'
  }) => StudySession
  getSessionById: (id: string) => StudySession | undefined
  setHasHydrated: (hasHydrated: boolean) => void
  saveSummaryToSession: (sessionId: string, summary: SummaryResult) => void
  saveFlashcardsToSession: (sessionId: string, flashcards: Flashcard[]) => void
}

const seedSessionTimestamp = '2026-04-30T00:00:00.000Z'

const defaultSessions: StudySession[] = [
  {
    id: '1',
    title: 'Photosynthesis Basics',
    sourceText: 'Photosynthesis is the process plants use to convert light energy into chemical energy.',
    tone: 'concise',
    level: 'beginner',
    createdAt: seedSessionTimestamp,
    updatedAt: seedSessionTimestamp,
  },
  {
    id: '2',
    title: 'JavaScript Closures',
    sourceText: 'Closures happen when a function retains access to variables from its lexical scope.',
    tone: 'concise',
    level: 'intermediate',
    createdAt: seedSessionTimestamp,
    updatedAt: seedSessionTimestamp,
  },
]

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: defaultSessions,
      hasHydrated: false,

      createSession: (input) => {
        const newSession: StudySession = {
          id: crypto.randomUUID(),
          title: input.title,
          sourceText: input.sourceText,
          tone: input.tone,
          level: input.level,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
        }))

        return newSession
      },

      getSessionById: (id) => {
        return get().sessions.find((session) => session.id === id)
      },

      saveSummaryToSession: (sessionId, summary) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  summary,
                  updatedAt: new Date().toISOString(),
                }
              : session,
          ),
        }))
      },

      saveFlashcardsToSession: (sessionId, flashcards) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  flashcards,
                  updatedAt: new Date().toISOString(),
                }
              : session,
          ),
        }))
      },

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'study-companion-sessions',
      partialize: (state) => ({ sessions: state.sessions }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
