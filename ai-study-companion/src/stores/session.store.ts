import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ChatMessage,
  GeneratedStudyContent,
  StudySession,
} from '@/features/study-session/types/session.types'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'
import type { SummaryResult } from '@/features/summary/types/summary.types'

interface SessionStore {
  sessions: StudySession[]
  hasHydrated: boolean
  createSession: (input: {
    title: string
    sourceText: string
    tone: 'concise' | 'detailed'
    level: 'beginner' | 'intermediate' | 'advanced'
  } & Partial<GeneratedStudyContent>) => StudySession
  getSessionById: (id: string) => StudySession | undefined
  setHasHydrated: (hasHydrated: boolean) => void
  saveSummaryToSession: (sessionId: string, summary: SummaryResult) => void
  saveFlashcardsToSession: (sessionId: string, flashcards: Flashcard[]) => void
  saveQuizToSession: (sessionId: string, quiz: QuizQuestion[]) => void
  addMessagesToSession: (sessionId: string, messages: ChatMessage[]) => void
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      hasHydrated: false,

      createSession: (input) => {
        const newSession: StudySession = {
          id: crypto.randomUUID(),
          title: input.title,
          sourceText: input.sourceText,
          tone: input.tone,
          level: input.level,
          summary: input.summary,
          flashcards: input.flashcards,
          quiz: input.quiz,
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

      saveQuizToSession: (sessionId, quiz) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  quiz,
                  updatedAt: new Date().toISOString(),
                }
              : session,
          ),
        }))
      },

      addMessagesToSession: (sessionId, messages) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...(session.messages ?? []), ...messages],
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
