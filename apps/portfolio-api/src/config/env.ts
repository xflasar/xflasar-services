import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  KEYCLOAK_URL: z.string().url().default('http://localhost:8080'),
  KEYCLOAK_REALM: z.string().default('xflasar'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    process.exit(1)
  }
  return result.data
}

export const env = loadEnv()

