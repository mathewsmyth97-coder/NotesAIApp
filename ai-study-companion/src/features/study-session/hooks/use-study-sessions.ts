'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createStudySession,
  deleteStudySession,
  getSessionById,
  getSessionsForCurrentUser,
  updateStudySession,
  type UpdateStudySessionInput,
} from '@/features/study-session/services/session-db.service'

export const studySessionKeys = {
  all: ['study-sessions'] as const,
  list: () => [...studySessionKeys.all, 'list'] as const,
  detail: (sessionId: string) => [...studySessionKeys.all, 'detail', sessionId] as const,
}

export function useStudySessions() {
  return useQuery({
    queryKey: studySessionKeys.list(),
    queryFn: getSessionsForCurrentUser,
  })
}

export function useStudySession(sessionId: string) {
  return useQuery({
    queryKey: studySessionKeys.detail(sessionId),
    queryFn: () => getSessionById(sessionId),
    enabled: Boolean(sessionId),
  })
}

export function useCreateStudySession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudySession,
    onSuccess: (session) => {
      queryClient.setQueryData(studySessionKeys.detail(session.id), session)
      void queryClient.invalidateQueries({ queryKey: studySessionKeys.list() })
    },
  })
}

export function useUpdateStudySession(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateStudySessionInput) =>
      updateStudySession(sessionId, input),
    onSuccess: (session) => {
      queryClient.setQueryData(studySessionKeys.detail(session.id), session)
      void queryClient.invalidateQueries({ queryKey: studySessionKeys.list() })
    },
  })
}

export function useDeleteStudySession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStudySession,
    onSuccess: (_result, sessionId) => {
      queryClient.removeQueries({ queryKey: studySessionKeys.detail(sessionId) })
      void queryClient.invalidateQueries({ queryKey: studySessionKeys.list() })
    },
  })
}
