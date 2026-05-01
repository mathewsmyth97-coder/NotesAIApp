'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createSessionSchema,
  type CreateSessionInput,
} from '@/features/study-session/schemas/session.schema'
import { Button, Form, Input, Label, ListBox, Select, Spinner } from '@heroui/react'
import { AiUsageMeter } from '@/features/ai-usage/components/ai-usage-meter'
import { useGenerateStudySession } from '@/features/study-session/hooks/use-generate-study-session'
import { useCreateStudySession } from '@/features/study-session/hooks/use-study-sessions'

const toneOptions = [
  { id: 'concise', label: 'Concise' },
  { id: 'detailed', label: 'Detailed' },
] as const

const levelOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
] as const

export function NewSessionForm() {
  const router = useRouter()
  const { isPending: isGeneratingContent, mutateAsync: generateStudyContent } =
    useGenerateStudySession()
  const { isPending: isCreatingSession, mutateAsync: createStudySession } =
    useCreateStudySession()
  const [generationError, setGenerationError] = useState<string | null>(null)

  const form = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      sourceText: '',
      tone: 'concise',
      level: 'intermediate',
    },
  })

  const onSubmit = async (values: CreateSessionInput) => {
    setGenerationError(null)

    try {
      const generatedContent = await generateStudyContent(values)
      const session = await createStudySession({
        ...values,
        ...generatedContent,
      })

      router.push(`/sessions/${session.id}`)
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'Failed to generate study session. Please try again.',
      )
    }
  }

  const isGenerating =
    form.formState.isSubmitting || isGeneratingContent || isCreatingSession

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Session title</Label>
        <Input
          {...form.register('title')}
          placeholder="e.g. Exam review notes"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 outline-none transition focus:ring-2 focus:ring-slate-400"
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Study material</Label>
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
                selectedKey={field.value}
                onBlur={field.onBlur}
                onSelectionChange={(key) => {
                  if (key) {
                    field.onChange(key.toString())
                  }
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="">
                  <ListBox>
                    {toneOptions.map((option) => (
                      <ListBox.Item
                        key={option.id}
                        id={option.id}
                        textValue={option.label}
                        className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                      >
                        {option.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Difficulty</Label>
          <Controller
            name="level"
            control={form.control}
            defaultValue="intermediate"
            render={({ field }) => (
              <Select
                className="w-full rounded-2xl px-3 py-2"
                selectedKey={field.value}
                onBlur={field.onBlur}
                onSelectionChange={(key) => {
                  if (key) {
                    field.onChange(key.toString())
                  }
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="">
                  <ListBox>
                    {levelOptions.map((option) => (
                      <ListBox.Item
                        key={option.id}
                        id={option.id}
                        textValue={option.label}
                        className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                      >
                        {option.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          isDisabled={isGenerating}
          className="rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          {isGenerating ? <Spinner size="sm" /> : null}
          {isGenerating ? 'Generating study session...' : 'Generate study session'}
        </Button>
        <AiUsageMeter />
      </div>

      {generationError ? (
        <p className="text-sm text-red-500">{generationError}</p>
      ) : null}
    </Form>
  )
}
