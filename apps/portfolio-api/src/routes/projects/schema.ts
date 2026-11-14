import { z } from 'zod'

export const projectQuerySchema = z.object({
  category: z.enum(['SOFTWARE', 'HARDWARE']).optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED', 'DISCONTINUED']).optional(),
})

export const projectParamsSchema = z.object({
  id: z.string().uuid(),
})

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  category: z.enum(['SOFTWARE', 'HARDWARE']).default('SOFTWARE'),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED', 'DISCONTINUED']).default('ACTIVE'),
  featured: z.boolean().default(false),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  userCount: z.number().int().nonnegative().optional(),
  registeredCount: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().default(0),
})

export const updateProjectSchema = createProjectSchema.partial()

export type ProjectQuery = z.infer<typeof projectQuerySchema>
export type ProjectParams = z.infer<typeof projectParamsSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

