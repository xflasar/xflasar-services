import { pgTable, uuid, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  category: text('category', { enum: ['SOFTWARE', 'HARDWARE'] }).notNull().default('SOFTWARE'),
  status: text('status', { enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'DISCONTINUED'] }).notNull().default('ACTIVE'),
  featured: boolean('featured').notNull().default(false),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  repoUrl: text('repo_url'),
  liveUrl: text('live_url'),
  imageUrl: text('image_url'),
  userCount: integer('user_count'),
  registeredCount: integer('registered_count'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ProjectRecord = typeof projects.$inferSelect
export type NewProjectRecord = typeof projects.$inferInsert

