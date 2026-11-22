import postgres from 'postgres'
import fs from 'fs'
import path from 'path'

async function runMigration() {
  const connectionString =
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/anime'

  console.log('Connecting to database:', connectionString.replace(/:[^:@]*@/, ':****@'))
  const sql = postgres(connectionString, { max: 1 })

  try {
    const migrationPath = path.join(__dirname, 'migrations', '0000_red_shadow_king.sql')
    const sqlContent = fs.readFileSync(migrationPath, 'utf8')

    console.log('Applying migration 0000_red_shadow_king.sql...')
    await sql.unsafe(sqlContent)
    console.log('✅ Migration applied successfully! Tables anime_entries and mal_tokens are ready.')
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
