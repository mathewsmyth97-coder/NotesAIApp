import { fetcher } from '@/lib/api/fetcher'

export type ProfileSettings = {
  id: string
  email: string | null
  displayName: string
  openrouterChatModel: string | null
  openrouterGenerationModel: string | null
}

export type UpdateProfileSettingsInput = {
  displayName: string
  openrouterChatModel: string | null
  openrouterGenerationModel: string | null
}

export async function getProfileSettings() {
  return fetcher<ProfileSettings>('/api/settings/profile')
}

export async function updateProfileSettings(input: UpdateProfileSettingsInput) {
  return fetcher<ProfileSettings>('/api/settings/profile', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
