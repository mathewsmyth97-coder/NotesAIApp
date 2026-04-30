'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Button, Input, Label, Spinner } from '@heroui/react'
import {
  signInAction,
  signUpAction,
  type AuthFormState,
} from '@/app/auth/actions'

const initialState: AuthFormState = {}

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: 'sign-in' | 'sign-up'
  nextPath: string
}) {
  const isSignIn = mode === 'sign-in'
  const action = isSignIn ? signInAction : signUpAction
  const [state, formAction, isPending] = useActionState(action, initialState)
  const title = isSignIn ? 'Sign in' : 'Create account'
  const submitLabel = isSignIn ? 'Sign in' : 'Sign up'
  const alternateHref = isSignIn
    ? `/auth/sign-up?next=${encodeURIComponent(nextPath)}`
    : `/auth/sign-in?next=${encodeURIComponent(nextPath)}`

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

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm font-medium">Password</Label>
          {isSignIn ? (
            <Link
              href={`/auth/forgot-password?next=${encodeURIComponent(nextPath)}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>
        <Input
          name="password"
          type="password"
          aria-label="Password"
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          required
          minLength={6}
          placeholder="Minimum 6 characters"
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
        {isPending ? `${title}...` : submitLabel}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
        <Link href={alternateHref} className="font-medium text-foreground hover:underline">
          {isSignIn ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </form>
  )
}
