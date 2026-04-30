import { redirect } from 'next/navigation'
import { PasswordResetCard } from '@/components/auth/password-reset-card'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { createClient } from '@/lib/supabase/server'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect('/auth/forgot-password')
  }

  return <PasswordResetCard mode="reset" nextPath={getSafeRedirectPath(next)} />
}
