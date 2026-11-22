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
 * Search anime dynamically from Jikan v4 (open REST API for MyAnimeList)
 */
export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  const clean = query.trim()
  if (!clean) return []

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(clean)}&limit=10&sfw`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((item: any) => ({
          malId: item.mal_id,
          title: item.title,
          titleEn: item.title_english || item.title,
          imageUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
          totalEpisodes: item.episodes || undefined,
          genres: (item.genres || []).map((g: any) => g.name),
          synopsis: item.synopsis,
          year: item.year,
        }))
      }
    }
  } catch (err: any) {
    console.warn('Anime search failed:', err.message)
  }

  return []
}
