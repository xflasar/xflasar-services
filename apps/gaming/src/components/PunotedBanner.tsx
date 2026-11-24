'use client'

import React from 'react'
import { ExternalLink, Activity, Users, Server } from 'lucide-react'
import { PunotedSummary } from '@/types'
import { useLanguage } from '@/lib/language-context'

interface PunotedBannerProps {
  summary?: PunotedSummary
}

export function PunotedBanner({ summary }: PunotedBannerProps) {
  const { dict } = useLanguage()

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#7053e3]/40 bg-gradient-to-r from-[#0c0e17] via-[#0e1019] to-[#0c0e17] p-4 sm:p-5 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7053e3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2a1a4a] text-[#c084fc] border border-[#a855f7]/40 font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
              {dict.punoted.badge}
            </span>
            <span className="text-xs text-[#949ba4] font-mono">punoted.net</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-[#f2f3f5] tracking-tight">
            {dict.punoted.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#949ba4] max-w-xl">
            {dict.punoted.desc}
          </p>
        </div>

        {/* Action Button & Live Metrics */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {summary?.activePlayersTracked !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#181b28] border border-white/10 font-mono text-xs">
              <Users className="w-3.5 h-3.5 text-[#5865F2]" />
              <span className="text-[#949ba4]">Tracked:</span>
              <span className="font-bold text-white">{summary.activePlayersTracked}</span>
            </div>
          )}

          <a
            href="https://punoted.net"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#5865F2]/25"
          >
            <span>{dict.punoted.viewProject}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
