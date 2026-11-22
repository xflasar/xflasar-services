import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/anime'

// Global connection cache for Next.js Fast Refresh
declare global {
  // eslint-disable-next-line no-var
  var __dbClient: postgres.Sql | undefined
}

const client = global.__dbClient || postgres(databaseUrl, { max: 10 })

if (process.env.NODE_ENV !== 'production') {
  global.__dbClient = client
}

export const db = drizzle(client, { schema })
export { client }
