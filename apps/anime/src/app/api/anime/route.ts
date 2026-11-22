import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { animeEntries } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { AnimeEntry } from '@xflasar/types'

export async function GET(request: NextRequest) {
  try {
    const list = await db.select().from(animeEntries).orderBy(desc(animeEntries.updatedAt))

    const formatted: AnimeEntry[] = list.map((item) => ({
      id: item.id,
      malId: item.malId || Number(item.id),
      title: item.title,
      titleEn: item.titleEn || undefined,
      imageUrl: item.imageUrl || undefined,
      status: item.status as any,
      score: item.score || undefined,
      episodesWatched: item.episodesWatched,
      totalEpisodes: item.totalEpisodes || undefined,
      personalNotes: item.personalNotes || undefined,
      genres: item.genres,
      syncedAt: item.syncedAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))

    return NextResponse.json({ success: true, count: formatted.length, data: formatted })
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      count: 0,
      data: [],
      dbWarning: err.message,
    })
  }
}
