import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, client } from './connection'

async function runMigration() {
  console.log('⏳ Running database migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('✅ Database migrations completed!')
  await client.end()
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})

