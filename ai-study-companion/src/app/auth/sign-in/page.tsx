import { AuthCard } from '@/components/auth/auth-card'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return <AuthCard mode="sign-in" nextPath={getSafeRedirectPath(next)} />
}
