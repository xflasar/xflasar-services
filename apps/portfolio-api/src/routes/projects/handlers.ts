import type { FastifyRequest, FastifyReply } from 'fastify'
import { projectService } from '../../services/project.service'
import {
  projectQuerySchema,
  projectParamsSchema,
  createProjectSchema,
  updateProjectSchema,
} from './schema'

export async function listProjectsHandler(request: FastifyRequest, reply: FastifyReply) {
  const queryResult = projectQuerySchema.safeParse(request.query)
  if (!queryResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Invalid query parameters',
      details: queryResult.error.format(),
      statusCode: 400,
    })
  }

  const projects = await projectService.getAll(queryResult.data)
  return reply.send({ data: projects })
}

export async function featuredProjectsHandler(_request: FastifyRequest, reply: FastifyReply) {
  const projects = await projectService.getFeatured()
  return reply.send({ data: projects })
}

export async function getProjectHandler(request: FastifyRequest, reply: FastifyReply) {
  const paramsResult = projectParamsSchema.safeParse(request.params)
  if (!paramsResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Invalid project ID format (UUID expected)',
      statusCode: 400,
    })
  }

  const project = await projectService.getById(paramsResult.data.id)
  if (!project) {
    return reply.status(404).send({
      error: 'Not Found',
      message: 'Project not found',
      statusCode: 404,
    })
  }

  return reply.send({ data: project })
}

export async function createProjectHandler(request: FastifyRequest, reply: FastifyReply) {
  const bodyResult = createProjectSchema.safeParse(request.body)
  if (!bodyResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Validation failed',
      details: bodyResult.error.format(),
      statusCode: 400,
    })
  }

  const project = await projectService.create(bodyResult.data)
  return reply.status(201).send({ data: project })
}

export async function updateProjectHandler(request: FastifyRequest, reply: FastifyReply) {
  const paramsResult = projectParamsSchema.safeParse(request.params)
  if (!paramsResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Invalid project ID format',
      statusCode: 400,
    })
  }

  const bodyResult = updateProjectSchema.safeParse(request.body)
  if (!bodyResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Validation failed',
      details: bodyResult.error.format(),
      statusCode: 400,
    })
  }

  const project = await projectService.update(paramsResult.data.id, bodyResult.data)
  if (!project) {
    return reply.status(404).send({
      error: 'Not Found',
      message: 'Project not found',
      statusCode: 404,
    })
  }

  return reply.send({ data: project })
}

export async function deleteProjectHandler(request: FastifyRequest, reply: FastifyReply) {
  const paramsResult = projectParamsSchema.safeParse(request.params)
  if (!paramsResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Invalid project ID format',
      statusCode: 400,
    })
  }

  const deleted = await projectService.delete(paramsResult.data.id)
  if (!deleted) {
    return reply.status(404).send({
      error: 'Not Found',
      message: 'Project not found',
      statusCode: 404,
    })
  }

  return reply.send({ success: true, message: 'Project successfully deleted' })
}

