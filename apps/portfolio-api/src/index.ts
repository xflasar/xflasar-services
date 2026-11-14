import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import { env } from './config/env'
import corsPlugin from './plugins/cors'
import authPlugin from './plugins/auth'
import { projectRoutes } from './routes/projects'
import { client } from './db/connection'

const server = Fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  },
})

async function bootstrap() {
  try {
    // Core plugins
    await server.register(sensible)
    await server.register(corsPlugin)
    await server.register(authPlugin)

    // Health checks
    const healthHandler = async () => ({
      status: 'ok',
      service: 'portfolio-api',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    })

    server.get('/health', healthHandler)
    server.get('/portfolio/health', healthHandler)

    // Register project routes
    // Supports both direct access (/projects) and reverse proxy routing (/portfolio/projects)
    await server.register(projectRoutes, { prefix: '/projects' })
    await server.register(projectRoutes, { prefix: '/portfolio/projects' })

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'] as const
    for (const signal of signals) {
      process.on(signal, async () => {
        server.log.info(`Received ${signal}, shutting down gracefully...`)
        await server.close()
        await client.end()
        process.exit(0)
      })
    }

    const address = await server.listen({ port: env.PORT, host: '0.0.0.0' })
    server.log.info(`🚀 Portfolio API server listening at ${address}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

bootstrap()

