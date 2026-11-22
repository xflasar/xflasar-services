import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db/connection'
import { animeEntries } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Map our AnimeStatus to MAL status strings
function mapToMalStatus(status: string): string {
  switch (status) {
    case 'WATCHING':
      return 'watching'
    case 'COMPLETED':
      return 'completed'
    case 'ON_HOLD':
      return 'on_hold'
    case 'DROPPED':
      return 'dropped'
    case 'PLAN_TO_WATCH':
    default:
      return 'plan_to_watch'
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
    const { malId, status, score, episodesWatched, comments } = body

    if (!malId) {
      return NextResponse.json({ error: 'Missing malId' }, { status: 400 })
    }

    const formParams = new URLSearchParams()
    if (status) formParams.set('status', mapToMalStatus(status))
    if (typeof score === 'number') formParams.set('score', String(score))
    if (typeof episodesWatched === 'number') formParams.set('num_watched_episodes', String(episodesWatched))
    if (typeof comments === 'string') formParams.set('comments', comments)

    const malRes = await fetch(`https://api.myanimelist.net/v2/anime/${malId}/my_list_status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formParams.toString(),
    })

    if (!malRes.ok) {
      const errText = await malRes.text()
      throw new Error(`MAL update failed (${malRes.status}): ${errText}`)
    }

    const result = await malRes.json()

    // Persist change to local PostgreSQL database
    try {
      const dbUpdates: Record<string, any> = {
        updatedAt: new Date(),
      }
      if (status) dbUpdates.status = status
      if (typeof score === 'number') dbUpdates.score = score
      if (typeof episodesWatched === 'number') dbUpdates.episodesWatched = episodesWatched
      if (typeof comments === 'string') dbUpdates.personalNotes = comments

      await db
        .update(animeEntries)
        .set(dbUpdates)
        .where(eq(animeEntries.malId, Number(malId)))
    } catch (dbErr: any) {
      console.warn('Failed to persist update to DB:', dbErr.message)
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error('MAL update error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
