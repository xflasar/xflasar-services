import type { Project } from '@xflasar/types'
import { MOCK_PROJECTS } from './mock-data'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/portfolio/projects`, {
      next: { revalidate: 3600 }, // ISR caching: revalidate every hour
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    const json = await res.json()
    return json.data
  } catch (error) {
    // Graceful fallback when the Ubuntu backend is offline
    console.warn('⚠️ Backend API is offline or unreachable. Using mock data.', error)
    return MOCK_PROJECTS
  }
}

