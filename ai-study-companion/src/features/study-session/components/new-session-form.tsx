'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createSessionSchema,
  type CreateSessionInput,
} from '@/features/study-session/schemas/session.schema'

export function NewSessionForm() {
  const router = useRouter()

  const form = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      sourceText: '',
      tone: 'concise',
      level: 'intermediate',
    },
  })

  const onSubmit = (_values: CreateSessionInput) => {
    router.push('/sessions/1')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Session title</label>
        <input
          {...form.register('title')}
          placeholder="e.g. JavaScript Closures"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Study material</label>
        <textarea
          {...form.register('sourceText')}
          placeholder="Paste notes, an article excerpt, or a topic prompt..."
          className="min-h-[220px] w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
        {form.formState.errors.sourceText ? (
          <p className="text-sm text-red-500">{form.formState.errors.sourceText.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <select
            {...form.register('tone')}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none"
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            {...form.register('level')}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        Generate study session
      </button>
    </form>
  )
}