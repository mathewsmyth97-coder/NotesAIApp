import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

export function PasswordResetCard({
  mode,
  nextPath,
}: {
  mode: 'request' | 'reset'
  nextPath: string
}) {
  const isRequest = mode === 'request'

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 text-sm font-medium text-muted-foreground hover:text-foreground">
          AI Study Companion
        </Link>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isRequest ? 'Reset your password' : 'Choose a new password'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isRequest
                ? 'Enter your email and we will send a secure reset link.'
                : 'Set a new password for your study workspace.'}
            </p>
          </div>

          {isRequest ? (
            <ForgotPasswordForm nextPath={nextPath} />
          ) : (
            <ResetPasswordForm nextPath={nextPath} />
          )}
        </section>
      </div>
    </main>
  )
}
