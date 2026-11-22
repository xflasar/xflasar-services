import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { refreshAccessToken } from '@/lib/mal-auth'
import { db } from '@/db/connection'
import { animeEntries } from '@/db/schema'
import { AnimeEntry, AnimeStatus } from '@xflasar/types'

// Map MAL status to our AnimeStatus
function mapMalStatus(malStatus: string): AnimeStatus {
  switch (malStatus) {
    case 'watching':
      return 'WATCHING'
    case 'completed':
      return 'COMPLETED'
    case 'on_hold':
      return 'ON_HOLD'
    case 'dropped':
      return 'DROPPED'
    case 'plan_to_watch':
    default:
      return 'PLAN_TO_WATCH'
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('mal_access_token')?.value
  const refreshToken = cookieStore.get('mal_refresh_token')?.value

  const clientId = process.env.MAL_CLIENT_ID
  const clientSecret = process.env.MAL_CLIENT_SECRET

  // Try refreshing token if access token is missing but refresh token exists
  if (!accessToken && refreshToken && clientId && clientSecret) {
    try {
      const refreshed = await refreshAccessToken(refreshToken, clientId, clientSecret)
      accessToken = refreshed.access_token

      cookieStore.set('mal_access_token', refreshed.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshed.expires_in,
        path: '/',
      })
    } catch (err) {
      return NextResponse.json({ error: 'Failed to refresh MAL token', needsAuth: true }, { status: 401 })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with MyAnimeList', needsAuth: true }, { status: 401 })
  }

  try {
    const allRawItems: any[] = []
    let nextUrl: string | null =
      'https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status{status,score,num_episodes_watched,comments},num_episodes,genres,alternative_titles&limit=1000'

    // Loop through all pages until all anime are fetched
    while (nextUrl) {
      const currentUrl: string = nextUrl
      const malRes: Response = await fetch(currentUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!malRes.ok) {
        if (malRes.status === 401) {
          return NextResponse.json({ error: 'Access token expired', needsAuth: true }, { status: 401 })
        }
        throw new Error(`MAL fetch error (${malRes.status}): ${malRes.statusText}`)
      }

      const json = await malRes.json()
      if (Array.isArray(json.data)) {
        allRawItems.push(...json.data)
      }

      // Check for next page link in paging.next
      nextUrl = json.paging?.next || null
    }

    // Transform all entries into our unified AnimeEntry model
    const entries: AnimeEntry[] = allRawItems.map((item: any) => {
      const node = item.node
      const listStatus = item.list_status || {}

      return {
        id: String(node.id),
        malId: node.id,
        title: node.title,
        titleEn: node.alternative_titles?.en || node.title,
        imageUrl: node.main_picture?.large || node.main_picture?.medium,
        status: mapMalStatus(listStatus.status),
        score: listStatus.score || undefined,
        episodesWatched: listStatus.num_episodes_watched || 0,
        totalEpisodes: node.num_episodes || undefined,
        personalNotes: listStatus.comments || undefined,
        genres: (node.genres || []).map((g: any) => g.name),
        syncedAt: new Date().toISOString(),
        updatedAt: listStatus.updated_at || new Date().toISOString(),
      }
    })

    // Upsert into PostgreSQL database in batches
    try {
      if (entries.length > 0) {
        // Upsert batches of 100 entries to avoid hitting SQL parameter limits
        const batchSize = 100
        for (let i = 0; i < entries.length; i += batchSize) {
          const batch = entries.slice(i, i + batchSize).map((e) => ({
            id: e.id,
            malId: e.malId,
            title: e.title,
            titleEn: e.titleEn,
            imageUrl: e.imageUrl,
            status: e.status,
            score: e.score,
            episodesWatched: e.episodesWatched,
            totalEpisodes: e.totalEpisodes,
            personalNotes: e.personalNotes,
            genres: e.genres,
            syncedAt: new Date(),
            updatedAt: new Date(e.updatedAt),
          }))

          await db
            .insert(animeEntries)
            .values(batch)
            .onConflictDoUpdate({
              target: animeEntries.id,
              set: {
                title: animeEntries.title,
                titleEn: animeEntries.titleEn,
                imageUrl: animeEntries.imageUrl,
                status: animeEntries.status,
                score: animeEntries.score,
                episodesWatched: animeEntries.episodesWatched,
                totalEpisodes: animeEntries.totalEpisodes,
                personalNotes: animeEntries.personalNotes,
                genres: animeEntries.genres,
                syncedAt: new Date(),
                updatedAt: new Date(),
              },
            })
        }
      }
    } catch (dbErr: any) {
      console.warn('Could not persist to PostgreSQL (proceeding with memory response):', dbErr.message)
    }

    return NextResponse.json({ success: true, count: entries.length, data: entries })
  } catch (err: any) {
    console.error('MAL Sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
