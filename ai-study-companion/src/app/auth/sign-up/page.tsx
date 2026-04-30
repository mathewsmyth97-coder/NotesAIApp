import { AuthCard } from '@/components/auth/auth-card'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return <AuthCard mode="sign-up" nextPath={getSafeRedirectPath(next)} />
}
