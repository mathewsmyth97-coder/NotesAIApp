'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Button, Input, Label, Spinner } from '@heroui/react'
import {
  forgotPasswordAction,
  type AuthFormState,
} from '@/app/auth/actions'

const initialState: AuthFormState = {}

export function ForgotPasswordForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Email</Label>
        <Input
          name="email"
          type="email"
          aria-label="Email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-muted-foreground">{state.message}</p> : null}

      <Button
        type="submit"
        isDisabled={isPending}
        className="w-full rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        {isPending ? <Spinner size="sm" /> : null}
        {isPending ? 'Sending reset link...' : 'Send reset link'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link
          href={`/auth/sign-in?next=${encodeURIComponent(nextPath)}`}
          className="font-medium text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
