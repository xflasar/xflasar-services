export interface AnimeSearchResult {
  malId: number
  title: string
  titleEn?: string
  imageUrl?: string
  totalEpisodes?: number
  genres: string[]
  synopsis?: string
  year?: number
}

/**
 * Search anime dynamically from our internal API (which proxies Jikan & official MAL API)
 */
export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  const clean = query.trim()
  if (!clean) return []

  try {
    const res = await fetch(`/api/mal/search?q=${encodeURIComponent(clean)}`)
    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json.data)) {
        return json.data
      }
    }
  } catch (err: any) {
    console.warn('Anime search failed:', err.message)
  }

  return []
}
