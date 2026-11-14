import { eq, and, desc, asc } from 'drizzle-orm'
import { db } from '../db/connection'
import { projects, type ProjectRecord, type NewProjectRecord } from '../db/schema'

export interface ProjectFilters {
  category?: 'SOFTWARE' | 'HARDWARE'
  featured?: boolean
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'DISCONTINUED'
}

export class ProjectService {
  async getAll(filters?: ProjectFilters): Promise<ProjectRecord[]> {
    const conditions = []

    if (filters?.category) {
      conditions.push(eq(projects.category, filters.category))
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(projects.featured, filters.featured))
    }
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status))
    }

    const query = db.select().from(projects)

    if (conditions.length > 0) {
      return query.where(and(...conditions)).orderBy(asc(projects.sortOrder), desc(projects.createdAt))
    }

    return query.orderBy(asc(projects.sortOrder), desc(projects.createdAt))
  }

  async getFeatured(): Promise<ProjectRecord[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
  }

  async getById(id: string): Promise<ProjectRecord | null> {
    const results = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
    return results[0] ?? null
  }

  async create(data: Omit<NewProjectRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectRecord> {
    const results = await db.insert(projects).values(data).returning()
    return results[0]
  }

  async update(id: string, data: Partial<Omit<NewProjectRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProjectRecord | null> {
    const results = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()

    return results[0] ?? null
  }

  async delete(id: string): Promise<boolean> {
    const results = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id })
    return results.length > 0
  }
}

export const projectService = new ProjectService()

