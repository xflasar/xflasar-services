'use client'

import React from 'react'
import { Tv, CheckCircle2, Clock, Star, Flame, BookOpen } from 'lucide-react'
import { AnimeStats } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface StatsOverviewProps {
  stats: AnimeStats
  mode?: 'anime' | 'manga'
}

export function StatsOverview({ stats, mode = 'anime' }: StatsOverviewProps) {
  const { dict } = useLanguage()
  const daysWatched = (stats.totalHoursWatched / 24).toFixed(1)

  return (
    <div className="flex items-center md:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
      {/* Total Entries */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 shrink-0">
        {mode === 'anime' ? (
          <Tv className="w-3.5 h-3.5 text-[#b59cfc] shrink-0" />
        ) : (
          <BookOpen className="w-3.5 h-3.5 text-[#b59cfc] shrink-0" />
        )}
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">{dict.stats.titles}</span>
          <span className="text-xs sm:text-sm font-bold text-[#f2f3f5]">{stats.totalEntries}</span>
        </div>
      </div>

      {/* Episodes / Chapters Watched */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#3ba55d] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">
            {mode === 'anime' ? dict.stats.episodes : dict.stats.chapters}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#f2f3f5]">{stats.totalEpisodesWatched}</span>
        </div>
      </div>

      {/* Watch Time (Anime only) */}
      {mode === 'anime' && (
        <div className="bg-[#0e1019] rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 shrink-0">
          <Clock className="w-3.5 h-3.5 text-[#5865F2] shrink-0" />
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-[10px] uppercase text-[#949ba4]">{dict.stats.watchTime}</span>
            <span className="text-xs sm:text-sm font-bold text-[#f2f3f5]">
              {daysWatched}<span className="text-[10px] text-[#949ba4] font-normal">{dict.stats.days}</span>
            </span>
          </div>
        </div>
      )}

      {/* Average Score */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 shrink-0">
        <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">{dict.stats.average}</span>
          <span className="text-xs sm:text-sm font-bold text-[#fbbf24]">
            {stats.averageScore ? stats.averageScore.toFixed(1) : '-'}
          </span>
        </div>
      </div>

      {/* Currently Watching / Reading */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 shrink-0">
        <Flame className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">
            {mode === 'anime' ? dict.stats.watching : dict.stats.reading}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#c084fc]">
            {stats.byStatus.WATCHING || (stats.byStatus as any).READING || 0}
          </span>
        </div>
      </div>
    </div>
  )
}
