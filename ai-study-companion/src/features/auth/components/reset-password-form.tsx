'use client'

import { useActionState } from 'react'
import { Button, Input, Label, Spinner } from '@heroui/react'
import {
  resetPasswordAction,
  type AuthFormState,
} from '@/app/auth/actions'

const initialState: AuthFormState = {}

export function ResetPasswordForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <Label className="text-sm font-medium">New password</Label>
        <Input
          name="password"
          type="password"
          aria-label="New password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Minimum 6 characters"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Confirm password</Label>
        <Input
          name="confirmPassword"
          type="password"
          aria-label="Confirm password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Repeat your new password"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}

      <Button
        type="submit"
        isDisabled={isPending}
        className="w-full rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        {isPending ? <Spinner size="sm" /> : null}
        {isPending ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  )
}
