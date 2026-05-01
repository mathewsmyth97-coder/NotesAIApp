'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProfileSettings,
  updateProfileSettings,
  type UpdateProfileSettingsInput,
} from '@/features/settings/services/profile.service'
import { getOpenRouterModels } from '@/features/settings/services/openrouter-models.service'

const profileSettingsQueryKey = ['settings', 'profile'] as const
const openRouterModelsQueryKey = ['settings', 'openrouter-models'] as const

export function useProfileSettings() {
  return useQuery({
    queryKey: profileSettingsQueryKey,
    queryFn: getProfileSettings,
  })
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileSettingsInput) => updateProfileSettings(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileSettingsQueryKey, profile)
    },
  })
}

export function useOpenRouterModels() {
  return useQuery({
    queryKey: openRouterModelsQueryKey,
    queryFn: getOpenRouterModels,
  })
}
