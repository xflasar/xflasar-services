import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { refreshAccessToken } from '@/lib/mal-auth'
import { db } from '@/db/connection'
import { mangaEntries } from '@/db/schema'
import { sql } from 'drizzle-orm'
import { MangaEntry, MangaStatus } from '@xflasar/types'

function mapMalMangaStatus(malStatus: string): MangaStatus {
  switch (malStatus) {
    case 'reading':
      return 'READING'
    case 'completed':
      return 'COMPLETED'
    case 'on_hold':
      return 'ON_HOLD'
    case 'dropped':
      return 'DROPPED'
    case 'plan_to_read':
    default:
      return 'PLAN_TO_READ'
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('mal_access_token')?.value
  const refreshToken = cookieStore.get('mal_refresh_token')?.value

  const clientId = process.env.MAL_CLIENT_ID
  const clientSecret = process.env.MAL_CLIENT_SECRET

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
      'https://api.myanimelist.net/v2/users/@me/mangalist?fields=list_status{status,score,num_chapters_read,num_volumes_read,comments,updated_at},num_chapters,num_volumes,genres,alternative_titles,nsfw&nsfw=true&limit=1000'

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
        throw new Error(`MAL manga fetch error (${malRes.status}): ${malRes.statusText}`)
      }

      const json = await malRes.json()
      if (Array.isArray(json.data)) {
        allRawItems.push(...json.data)
      }

      nextUrl = json.paging?.next || null
    }

    const entries: (MangaEntry & { volumesRead?: number; totalVolumes?: number })[] = allRawItems.map((item: any) => {
      const node = item.node
      const listStatus = item.list_status || {}

      return {
        id: String(node.id),
        malId: node.id,
        title: node.title,
        titleEn: node.alternative_titles?.en || node.title,
        imageUrl: node.main_picture?.large || node.main_picture?.medium,
        type: 'MANGA',
        status: mapMalMangaStatus(listStatus.status),
        score: listStatus.score || undefined,
        chaptersRead: listStatus.num_chapters_read || 0,
        totalChapters: node.num_chapters || undefined,
        volumesRead: listStatus.num_volumes_read || 0,
        totalVolumes: node.num_volumes || undefined,
        personalNotes: listStatus.comments || undefined,
        genres: (node.genres || []).map((g: any) => g.name),
        syncedAt: new Date().toISOString(),
        updatedAt: listStatus.updated_at || new Date().toISOString(),
      }
    })

    try {
      if (entries.length > 0) {
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
            chaptersRead: e.chaptersRead,
            totalChapters: e.totalChapters,
            volumesRead: e.volumesRead || 0,
            totalVolumes: e.totalVolumes,
            personalNotes: e.personalNotes,
            genres: e.genres,
            syncedAt: new Date(),
            updatedAt: new Date(e.updatedAt),
          }))

          await db
            .insert(mangaEntries)
            .values(batch)
            .onConflictDoUpdate({
              target: mangaEntries.id,
              set: {
                title: mangaEntries.title,
                titleEn: mangaEntries.titleEn,
                imageUrl: mangaEntries.imageUrl,
                status: mangaEntries.status,
                score: mangaEntries.score,
                chaptersRead: mangaEntries.chaptersRead,
                totalChapters: mangaEntries.totalChapters,
                volumesRead: mangaEntries.volumesRead,
                totalVolumes: mangaEntries.totalVolumes,
                personalNotes: mangaEntries.personalNotes,
                genres: mangaEntries.genres,
                syncedAt: new Date(),
                updatedAt: sql`excluded.updated_at`,
              },
            })
        }
      }
    } catch (dbErr: any) {
      console.warn('Could not persist manga to DB:', dbErr.message)
    }

    return NextResponse.json({ success: true, count: entries.length, data: entries })
  } catch (err: any) {
    console.error('MAL Manga Sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
