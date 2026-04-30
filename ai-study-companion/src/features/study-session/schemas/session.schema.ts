import { z } from 'zod'

export const createSessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  sourceText: z.string().min(20, 'Please add more study material'),
  tone: z.enum(['concise', 'detailed']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
})

export type CreateSessionInput = z.infer<typeof createSessionSchema>