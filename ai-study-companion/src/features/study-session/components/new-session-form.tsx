'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createSessionSchema,
  type CreateSessionInput,
} from '@/features/study-session/schemas/session.schema'
import { Button, Form, Input, Label, ListBox, Select } from '@heroui/react'
import { Controller } from 'react-hook-form'
import { useSessionStore } from '@/stores/session.store'

export function NewSessionForm() {
  const router = useRouter()
  const createSession = useSessionStore((state) => state.createSession)

  const form = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      sourceText: '',
      tone: 'concise',
      level: 'intermediate',
    },
  })

  const onSubmit = (values: CreateSessionInput) => {
    const session = createSession(values)
    router.push(`/sessions/${session.id}`)
  }


  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label  className="text-sm font-medium">Session title</Label>
        <Input
          {...form.register('title')}
          placeholder="e.g. JavaScript Closures"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label  className="text-sm font-medium">Study material</Label>
        <Input
          {...form.register('sourceText')}
          type="textarea"
          placeholder="Paste notes, an article excerpt, or a topic prompt..."
          className="min-h-[220px] w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
        {form.formState.errors.sourceText ? (
          <p className="text-sm text-red-500">{form.formState.errors.sourceText.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tone</Label>
          <Controller
            name="tone"
            control={form.control}
            defaultValue="concise"
            render={({ field }) => (
              <Select
                className="w-full rounded-2xl px-3 py-2"
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="">
                  <ListBox>
                    <ListBox.Item
                      id="concise"
                      textValue="Concise"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Concise
                    </ListBox.Item>
                    <ListBox.Item
                      id="detailed"
                      textValue="Detailed"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Detailed
                    </ListBox.Item>
                    <ListBox.Item
                      id="friendly"
                      textValue="Friendly"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Friendly
                    </ListBox.Item>
                    <ListBox.Item
                      id="formal"
                      textValue="Formal"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Formal
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          {/* <select
            {...form.register('level')}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select> */}
          <Controller 
            name="level"
            control={form.control}
            defaultValue="intermediate"
            render={({ field }) => (
              <Select
                className="w-full rounded-2xl px-3 py-2"
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="">
                  <ListBox>
                    <ListBox.Item
                      id="beginner"
                      textValue="Beginner"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Beginner
                    </ListBox.Item>
                    <ListBox.Item
                      id="intermediate"
                      textValue="Intermediate"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Intermediate
                    </ListBox.Item>
                    <ListBox.Item
                      id="advanced"
                      textValue="Advanced"
                      className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      Advanced
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        Generate study session
      </Button>
    </Form>
  )
}