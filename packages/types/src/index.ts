// ─── Project / Portfolio ───────────────────────────────────────────────────

export type ProjectCategory = 'SOFTWARE' | 'HARDWARE' | 'ACADEMIC'
export type ProjectStatus = 'ACTIVE' | 'IN_DEVELOPMENT' | 'PROTOTYPE' | 'CONCEPT' | 'COMPLETED' | 'PAUSED' | 'DISCONTINUED'

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: ProjectCategory
  status: ProjectStatus
  featured: boolean
  techStack: string[]
  repoUrl?: string
  liveUrl?: string
  imageUrl?: string
  gallery?: string[]
  userCount?: number
  registeredCount?: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// ─── Anime ────────────────────────────────────────────────────────────────

export type AnimeStatus = 'WATCHING' | 'COMPLETED' | 'PLAN_TO_WATCH' | 'DROPPED' | 'ON_HOLD'

export interface AnimeEntry {
  id: string
  malId: number
  title: string
  titleEn?: string
  imageUrl?: string
  gallery?: string[]
  status: AnimeStatus
  score?: number
  episodesWatched: number
  totalEpisodes?: number
  personalNotes?: string
  genres: string[]
  syncedAt: string
  updatedAt: string
}

export interface AnimeStats {
  totalEntries: number
  totalEpisodesWatched: number
  totalHoursWatched: number
  averageScore: number
  byStatus: Record<AnimeStatus, number>
  topGenres: { genre: string; count: number }[]
}

// ─── Manga ────────────────────────────────────────────────────────────────

export type MangaStatus = 'READING' | 'COMPLETED' | 'PLAN_TO_READ' | 'DROPPED' | 'ON_HOLD'
export type MangaType = 'MANGA' | 'MANHWA' | 'MANHUA'

export interface MangaEntry {
  id: string
  malId: number
  title: string
  titleEn?: string
  imageUrl?: string
  gallery?: string[]
  type: MangaType
  status: MangaStatus
  score?: number
  chaptersRead: number
  totalChapters?: number
  personalNotes?: string
  genres: string[]
  syncedAt: string
  updatedAt: string
}

// ─── API Responses ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

