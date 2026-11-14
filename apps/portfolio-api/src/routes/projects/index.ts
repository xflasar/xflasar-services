import type { FastifyPluginAsync } from 'fastify'
import {
  listProjectsHandler,
  featuredProjectsHandler,
  getProjectHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from './handlers'

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  // Public endpoints
  fastify.get('/', listProjectsHandler)
  fastify.get('/featured', featuredProjectsHandler)
  fastify.get('/:id', getProjectHandler)

  // Protected endpoints (require Keycloak admin role)
  fastify.post('/', { preHandler: [fastify.requireAdmin] }, createProjectHandler)
  fastify.put('/:id', { preHandler: [fastify.requireAdmin] }, updateProjectHandler)
  fastify.delete('/:id', { preHandler: [fastify.requireAdmin] }, deleteProjectHandler)
}

