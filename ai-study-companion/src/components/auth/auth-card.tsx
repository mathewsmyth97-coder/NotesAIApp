import Link from 'next/link'
import { AuthForm } from '@/features/auth/components/auth-form'

export function AuthCard({
  mode,
  nextPath,
}: {
  mode: 'sign-in' | 'sign-up'
  nextPath: string
}) {
  const isSignIn = mode === 'sign-in'

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 text-sm font-medium text-muted-foreground hover:text-foreground">
          AI Study Companion
        </Link>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSignIn ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isSignIn
                ? 'Sign in to open your study workspace.'
                : 'Start saving study sessions behind your own account.'}
            </p>
          </div>

          <AuthForm mode={mode} nextPath={nextPath} />
        </section>
      </div>
    </main>
  )
}
