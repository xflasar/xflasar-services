import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { mangaEntries } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { MangaEntry } from '@xflasar/types'

export async function GET(request: NextRequest) {
  try {
    const list = await db.select().from(mangaEntries).orderBy(desc(mangaEntries.updatedAt))

    const formatted: (MangaEntry & { volumesRead?: number; totalVolumes?: number })[] = list.map((item) => ({
      id: item.id,
      malId: item.malId || Number(item.id),
      title: item.title,
      titleEn: item.titleEn || undefined,
      imageUrl: item.imageUrl || undefined,
      type: 'MANGA',
      status: item.status as any,
      score: item.score || undefined,
      chaptersRead: item.chaptersRead,
      totalChapters: item.totalChapters || undefined,
      volumesRead: item.volumesRead,
      totalVolumes: item.totalVolumes || undefined,
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
