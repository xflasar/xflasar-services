import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import jwksRsa from 'jwks-rsa'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '../config/env'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export interface KeycloakTokenPayload {
  sub: string
  preferred_username?: string
  email?: string
  realm_access?: {
    roles: string[]
  }
  resource_access?: Record<string, { roles: string[] }>
}

export default fp(async (fastify) => {
  const jwksUri = `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/certs`

  const client = jwksRsa({
    jwksUri,
    cache: true,
    cacheMaxEntries: 10,
    cacheMaxAge: 600000,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
  })

  await fastify.register(fastifyJwt, {
    secret: async (_req: FastifyRequest, token: any) => {
      const kid = token?.header?.kid
      if (!kid) {
        throw new Error('Token header missing key identifier (kid)')
      }
      const key = await client.getSigningKey(kid)
      return key.getPublicKey()
    },
    decode: { complete: true },
  })

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: 'Valid authentication token required', statusCode: 401 })
    }
  })

  fastify.decorate('requireAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
      const payload = request.user as KeycloakTokenPayload
      const roles = payload?.realm_access?.roles || []

      if (!roles.includes('admin')) {
        reply.status(403).send({ error: 'Forbidden', message: 'Administrator privileges required', statusCode: 403 })
      }
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: 'Valid authentication token required', statusCode: 401 })
    }
  })
})

