import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const animeEntries = pgTable('anime_entries', {
  id: text('id').primaryKey(),
  malId: integer('mal_id').unique(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  imageUrl: text('image_url'),
  status: text('status', {
    enum: ['WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'ON_HOLD', 'DROPPED'],
  }).notNull().default('WATCHING'),
  score: integer('score'),
  episodesWatched: integer('episodes_watched').notNull().default(0),
  totalEpisodes: integer('total_episodes'),
  personalNotes: text('personal_notes'),
  genres: jsonb('genres').$type<string[]>().notNull().default([]),
  syncedAt: timestamp('synced_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const mangaEntries = pgTable('manga_entries', {
  id: text('id').primaryKey(),
  malId: integer('mal_id').unique(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  imageUrl: text('image_url'),
  status: text('status', {
    enum: ['READING', 'COMPLETED', 'PLAN_TO_READ', 'ON_HOLD', 'DROPPED'],
  }).notNull().default('READING'),
  score: integer('score'),
  chaptersRead: integer('chapters_read').notNull().default(0),
  totalChapters: integer('total_chapters'),
  volumesRead: integer('volumes_read').notNull().default(0),
  totalVolumes: integer('total_volumes'),
  personalNotes: text('personal_notes'),
  genres: jsonb('genres').$type<string[]>().notNull().default([]),
  syncedAt: timestamp('synced_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const malTokens = pgTable('mal_tokens', {
  id: text('id').primaryKey().default('primary_token'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type AnimeEntryRecord = typeof animeEntries.$inferSelect
export type NewAnimeEntryRecord = typeof animeEntries.$inferInsert
export type MangaEntryRecord = typeof mangaEntries.$inferSelect
export type NewMangaEntryRecord = typeof mangaEntries.$inferInsert
export type MalTokenRecord = typeof malTokens.$inferSelect
