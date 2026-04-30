import { PasswordResetCard } from '@/components/auth/password-reset-card'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return <PasswordResetCard mode="request" nextPath={getSafeRedirectPath(next)} />
}
