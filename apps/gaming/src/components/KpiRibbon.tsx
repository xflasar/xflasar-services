'use client'

import React from 'react'
import { Library, Clock, Flame, Trophy } from 'lucide-react'
import { GamingStats } from '@/types'
import { useLanguage } from '@/lib/language-context'

interface KpiRibbonProps {
  stats: GamingStats
}

export function KpiRibbon({ stats }: KpiRibbonProps) {
  const { dict } = useLanguage()
  const daysTotal = (stats.totalPlaytimeHours / 24).toFixed(1)

  return (
    <div className="flex items-center md:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
      {/* Total Games */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-3 py-1.5 flex items-center gap-2 shrink-0">
        <Library className="w-4 h-4 text-[#b59cfc] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">{dict.kpi.totalGames}</span>
          <span className="text-xs sm:text-sm font-bold text-[#f2f3f5]">{stats.totalGames}</span>
        </div>
      </div>

      {/* Total Hours Played */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-3 py-1.5 flex items-center gap-2 shrink-0">
        <Clock className="w-4 h-4 text-[#5865F2] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">{dict.kpi.totalHours}</span>
          <span className="text-xs sm:text-sm font-bold text-[#f2f3f5]">
            {stats.totalPlaytimeHours}
            <span className="text-[10px] text-[#949ba4] font-normal ml-1">
              ({daysTotal} {dict.kpi.daysEquivalent})
            </span>
          </span>
        </div>
      </div>

      {/* Past 2 Weeks Activity */}
      <div className="bg-[#0e1019] rounded-md border border-white/10 px-3 py-1.5 flex items-center gap-2 shrink-0">
        <Flame className="w-4 h-4 text-[#3ba55d] shrink-0" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-[10px] uppercase text-[#949ba4]">{dict.kpi.recentHours}</span>
          <span className="text-xs sm:text-sm font-bold text-[#3ba55d]">
            {stats.recentPlaytimeHours}h
          </span>
        </div>
      </div>

      {/* Top Game of All Time */}
      {stats.topGame && (
        <div className="bg-[#0e1019] rounded-md border border-white/10 px-3 py-1.5 flex items-center gap-2 shrink-0">
          <Trophy className="w-4 h-4 text-[#fbbf24] shrink-0" />
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-[10px] uppercase text-[#949ba4]">{stats.topGame.name}</span>
            <span className="text-xs sm:text-sm font-bold text-[#fbbf24]">
              {stats.topGame.hours}h
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
