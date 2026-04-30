'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getOpenRouterKeyStatus,
  removeOpenRouterKey,
  saveOpenRouterKey,
} from '@/features/settings/services/openrouter-key.service'

const openRouterKeyQueryKey = ['settings', 'openrouter-key'] as const

export function useOpenRouterKeyStatus() {
  return useQuery({
    queryKey: openRouterKeyQueryKey,
    queryFn: getOpenRouterKeyStatus,
  })
}

export function useSaveOpenRouterKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveOpenRouterKey,
    onSuccess: (status) => {
      queryClient.setQueryData(openRouterKeyQueryKey, status)
    },
  })
}

export function useRemoveOpenRouterKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeOpenRouterKey,
    onSuccess: (status) => {
      queryClient.setQueryData(openRouterKeyQueryKey, status)
    },
  })
}
