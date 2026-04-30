import { createClient } from '@/lib/supabase/client'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'
import type { SummaryResult } from '@/features/summary/types/summary.types'
import type {
  ChatMessage,
  GeneratedStudyContent,
  StudySession,
} from '@/features/study-session/types/session.types'

type StudySessionRow = {
  id: string
  user_id: string
  title: string
  source_text: string
  tone: StudySession['tone']
  level: StudySession['level']
  summary: SummaryResult | null
  flashcards: Flashcard[] | null
  quiz: QuizQuestion[] | null
  messages: ChatMessage[] | null
  created_at: string
  updated_at: string
}

type CreateStudySessionInput = {
  title: string
  sourceText: string
  tone: StudySession['tone']
  level: StudySession['level']
} & Partial<GeneratedStudyContent>

export type UpdateStudySessionInput = Partial<{
  title: string
  sourceText: string
  tone: StudySession['tone']
  level: StudySession['level']
  summary: SummaryResult | null
  flashcards: Flashcard[] | null
  quiz: QuizQuestion[] | null
  messages: ChatMessage[] | null
}>

function toStudySession(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    sourceText: row.source_text,
    tone: row.tone,
    level: row.level,
    summary: row.summary ?? undefined,
    flashcards: row.flashcards ?? undefined,
    quiz: row.quiz ?? undefined,
    messages: row.messages ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toUpdateRow(input: UpdateStudySessionInput) {
  return {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.sourceText !== undefined ? { source_text: input.sourceText } : {}),
    ...(input.tone !== undefined ? { tone: input.tone } : {}),
    ...(input.level !== undefined ? { level: input.level } : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(input.flashcards !== undefined ? { flashcards: input.flashcards } : {}),
    ...(input.quiz !== undefined ? { quiz: input.quiz } : {}),
    ...(input.messages !== undefined ? { messages: input.messages } : {}),
    updated_at: new Date().toISOString(),
  }
}

export async function getSessionsForCurrentUser() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as StudySessionRow[]).map(toStudySession)
}

export async function getSessionById(sessionId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? toStudySession(data as StudySessionRow) : null
}

export async function createStudySession(input: CreateStudySessionInput) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user) {
    throw new Error('You must be signed in to create a study session.')
  }

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: user.id,
      title: input.title,
      source_text: input.sourceText,
      tone: input.tone,
      level: input.level,
      summary: input.summary ?? null,
      flashcards: input.flashcards ?? null,
      quiz: input.quiz ?? null,
      messages: [],
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return toStudySession(data as StudySessionRow)
}

export async function updateStudySession(
  sessionId: string,
  input: UpdateStudySessionInput,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_sessions')
    .update(toUpdateRow(input))
    .eq('id', sessionId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Session not found.')
  }

  return toStudySession(data as StudySessionRow)
}

export async function deleteStudySession(sessionId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) {
    throw new Error(error.message)
  }
}
