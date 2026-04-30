'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { createClient } from '@/lib/supabase/server'

export type AuthFormState = {
  error?: string
  message?: string
}

function getCredentials(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const next = getSafeRedirectPath(formData.get('next'))

  if (typeof email !== 'string' || typeof password !== 'string') {
    return {
      error: 'Enter an email address and password.',
      next,
    }
  }

  return {
    email: email.trim(),
    password,
    next,
  }
}

function getEmail(formData: FormData) {
  const email = formData.get('email')
  const next = getSafeRedirectPath(formData.get('next'))

  if (typeof email !== 'string' || !email.trim()) {
    return {
      error: 'Enter your email address.',
      next,
    }
  }

  return {
    email: email.trim(),
    next,
  }
}

function getPasswordReset(formData: FormData) {
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')
  const next = getSafeRedirectPath(formData.get('next'))

  if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return {
      error: 'Enter and confirm your new password.',
      next,
    }
  }

  if (password.length < 6) {
    return {
      error: 'Password must be at least 6 characters.',
      next,
    }
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match.',
      next,
    }
  }

  return {
    password,
    next,
  }
}

export async function signInAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = getCredentials(formData)

  if ('error' in credentials) {
    return { error: credentials.error }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(credentials.next)
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = getCredentials(formData)

  if ('error' in credentials) {
    return { error: credentials.error }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(credentials.next)}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    revalidatePath('/', 'layout')
    redirect(credentials.next)
  }

  return {
    message: 'Check your email to confirm your account, then sign in.',
  }
}

export async function forgotPasswordAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const emailInput = getEmail(formData)

  if ('error' in emailInput) {
    return { error: emailInput.error }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(emailInput.email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/auth/reset-password')}`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    message: 'Check your email for a password reset link.',
  }
}

export async function resetPasswordAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const passwordInput = getPasswordReset(formData)

  if ('error' in passwordInput) {
    return { error: passwordInput.error }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: passwordInput.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(passwordInput.next)
}
