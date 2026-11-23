import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db/connection'
import { mangaEntries } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

function mapToMalMangaStatus(status: string): string {
  switch (status) {
    case 'READING':
      return 'reading'
    case 'COMPLETED':
      return 'completed'
    case 'ON_HOLD':
      return 'on_hold'
    case 'DROPPED':
      return 'dropped'
    case 'PLAN_TO_READ':
    default:
      return 'plan_to_read'
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('mal_access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with MyAnimeList', needsAuth: true }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { malId, status, score, chaptersRead, volumesRead, comments } = body

    if (!malId) {
      return NextResponse.json({ error: 'Missing malId' }, { status: 400 })
    }

    const formParams = new URLSearchParams()
    if (status) formParams.set('status', mapToMalMangaStatus(status))
    if (typeof score === 'number') formParams.set('score', String(score))
    if (typeof chaptersRead === 'number') formParams.set('num_chapters_read', String(chaptersRead))
    if (typeof volumesRead === 'number') formParams.set('num_volumes_read', String(volumesRead))
    if (typeof comments === 'string') formParams.set('comments', comments)

    const malRes = await fetch(`https://api.myanimelist.net/v2/manga/${malId}/my_list_status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formParams.toString(),
    })

    if (!malRes.ok) {
      const errText = await malRes.text()
      throw new Error(`MAL manga update failed (${malRes.status}): ${errText}`)
    }

    const result = await malRes.json()

    // Persist change to local PostgreSQL database
    try {
      const numMalId = Number(malId)
      const strMalId = String(malId)

      // Check if entry exists
      const existing = await db
        .select({ id: mangaEntries.id })
        .from(mangaEntries)
        .where(
          or(
            eq(mangaEntries.malId, numMalId),
            eq(mangaEntries.id, strMalId)
          )
        )
        .limit(1)

      if (existing.length > 0) {
        const dbUpdates: Record<string, any> = {
          updatedAt: new Date(),
        }
        if (status) dbUpdates.status = status
        if (typeof score === 'number') dbUpdates.score = score
        if (typeof chaptersRead === 'number') dbUpdates.chaptersRead = chaptersRead
        if (typeof volumesRead === 'number') dbUpdates.volumesRead = volumesRead
        if (typeof comments === 'string') dbUpdates.personalNotes = comments

        await db
          .update(mangaEntries)
          .set(dbUpdates)
          .where(
            or(
              eq(mangaEntries.malId, numMalId),
              eq(mangaEntries.id, strMalId)
            )
          )
      } else {
        // Insert new manga entry if not in DB yet
        await db.insert(mangaEntries).values({
          id: strMalId,
          malId: numMalId,
          title: body.title || 'Untitled',
          titleEn: body.titleEn,
          imageUrl: body.imageUrl,
          status: status || 'READING',
          score: typeof score === 'number' ? score : undefined,
          chaptersRead: typeof chaptersRead === 'number' ? chaptersRead : 0,
          totalChapters: body.totalEpisodes,
          volumesRead: typeof volumesRead === 'number' ? volumesRead : 0,
          personalNotes: comments,
          genres: Array.isArray(body.genres) ? body.genres : [],
          syncedAt: new Date(),
          updatedAt: new Date(),
        })
      }
    } catch (dbErr: any) {
      console.warn('Failed to persist manga update to DB:', dbErr.message)
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error('MAL manga update error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
