export type StudySession = {
  id: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
}