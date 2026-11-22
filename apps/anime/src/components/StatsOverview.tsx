'use client'

import React from 'react'
import { Tv, CheckCircle2, Clock, Star, Flame } from 'lucide-react'
import { AnimeStats } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface StatsOverviewProps {
  stats: AnimeStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { dict } = useLanguage()
  const daysWatched = (stats.totalHoursWatched / 24).toFixed(1)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
      {/* Total Entries */}
      <div className="bg-[#0e1019] rounded-lg border border-white/10 px-3 py-2 hover:border-[#7053e3]/40 transition-all flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-[#949ba4] tracking-wider">{dict.stats.titles}</span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#f2f3f5] leading-tight">
            {stats.totalEntries}
          </span>
        </div>
        <div className="p-1.5 rounded-md bg-[#181b28] border border-white/5">
          <Tv className="w-3.5 h-3.5 text-[#b59cfc]" />
        </div>
      </div>

      {/* Episodes Watched */}
      <div className="bg-[#0e1019] rounded-lg border border-white/10 px-3 py-2 hover:border-[#7053e3]/40 transition-all flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-[#949ba4] tracking-wider">{dict.stats.episodes}</span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#f2f3f5] leading-tight">
            {stats.totalEpisodesWatched}
          </span>
        </div>
        <div className="p-1.5 rounded-md bg-[#181b28] border border-white/5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3ba55d]" />
        </div>
      </div>

      {/* Watch Time */}
      <div className="bg-[#0e1019] rounded-lg border border-white/10 px-3 py-2 hover:border-[#7053e3]/40 transition-all flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-[#949ba4] tracking-wider">{dict.stats.watchTime}</span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#f2f3f5] leading-tight">
            {daysWatched} <span className="text-xs font-sans text-[#949ba4]">{dict.stats.days}</span>
          </span>
        </div>
        <div className="p-1.5 rounded-md bg-[#181b28] border border-white/5">
          <Clock className="w-3.5 h-3.5 text-[#5865F2]" />
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-[#0e1019] rounded-lg border border-white/10 px-3 py-2 hover:border-[#7053e3]/40 transition-all flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-[#949ba4] tracking-wider">{dict.stats.average}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold font-mono text-[#f2f3f5] leading-tight">
              {stats.averageScore.toFixed(1)}
            </span>
            <span className="text-[10px] text-[#949ba4]">/10</span>
          </div>
        </div>
        <div className="p-1.5 rounded-md bg-[#181b28] border border-white/5">
          <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
        </div>
      </div>

      {/* Currently Watching */}
      <div className="col-span-2 sm:col-span-1 bg-[#0e1019] rounded-lg border border-white/10 px-3 py-2 hover:border-[#7053e3]/40 transition-all flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-[#949ba4] tracking-wider">{dict.stats.watching}</span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#c084fc] leading-tight">
            {stats.byStatus.WATCHING || 0}
          </span>
        </div>
        <div className="p-1.5 rounded-md bg-[#2a1a4a] border border-[#a855f7]/30">
          <Flame className="w-3.5 h-3.5 text-[#c084fc]" />
        </div>
      </div>
    </div>
  )
}
