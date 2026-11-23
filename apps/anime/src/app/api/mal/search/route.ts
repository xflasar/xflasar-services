import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  const clean = q.trim()

  if (!clean) {
    return NextResponse.json({ success: true, data: [] })
  }

  // 1. Try Jikan API v4 (with 10s timeout)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(clean)}&limit=10`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'xflasar-anime-tracker/1.0',
        },
      }
    )
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json.data) && json.data.length > 0) {
        const formatted = json.data.map((item: any) => ({
          malId: item.mal_id,
          title: item.title,
          titleEn: item.title_english || item.title,
          imageUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
          totalEpisodes: item.episodes || undefined,
          genres: (item.genres || []).map((g: any) => g.name),
          synopsis: item.synopsis,
          year: item.year,
        }))
        return NextResponse.json({ success: true, data: formatted })
      }
    }
  } catch (jikanErr: any) {
    console.warn('Jikan search error:', jikanErr.message)
  }

  // 2. Fallback: Official MAL API v2 if authenticated or clientId available
  const clientId = process.env.MAL_CLIENT_ID
  if (clientId) {
    try {
      const malRes = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(clean)}&limit=10&fields=id,title,main_picture,alternative_titles,num_episodes,genres,synopsis`,
        {
          headers: {
            'X-MAL-CLIENT-ID': clientId,
          },
        }
      )

      if (malRes.ok) {
        const malJson = await malRes.json()
        if (Array.isArray(malJson.data)) {
          const formatted = malJson.data.map((item: any) => ({
            malId: item.node.id,
            title: item.node.title,
            titleEn: item.node.alternative_titles?.en || item.node.title,
            imageUrl: item.node.main_picture?.large || item.node.main_picture?.medium,
            totalEpisodes: item.node.num_episodes || undefined,
            genres: (item.node.genres || []).map((g: any) => g.name),
            synopsis: item.node.synopsis,
          }))
          return NextResponse.json({ success: true, data: formatted })
        }
      }
    } catch (malErr: any) {
      console.warn('MAL API search fallback error:', malErr.message)
    }
  }

  return NextResponse.json({ success: true, data: [] })
}
