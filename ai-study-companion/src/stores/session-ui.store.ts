import { create } from 'zustand'

interface SessionUIState {
  activeTab: 'summary' | 'flashcards' | 'quiz'
  setActiveTab: (tab: SessionUIState['activeTab']) => void
}

export const useSessionUIStore = create<SessionUIState>((set) => ({
  activeTab: 'summary',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
