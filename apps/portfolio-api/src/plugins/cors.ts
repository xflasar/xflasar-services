import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { env } from '../config/env'

export default fp(async (fastify) => {
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim())

  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true)

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true)
      }

      // Allow Vercel preview domains
      if (origin.endsWith('.vercel.app')) {
        return cb(null, true)
      }

      cb(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
})

