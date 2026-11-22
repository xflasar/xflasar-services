'use client'

import React from 'react'
import { History, Star, Plus } from 'lucide-react'
import { AnimeEntry, AnimeStatus } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface RecentUpdatesSectionProps {
  entries: any[]
  isAdmin: boolean
  mode?: 'anime' | 'manga'
  onQuickIncrement: (id: string) => void
  onSelect?: (anime: any) => void
}

export function RecentUpdatesSection({
  entries,
  isAdmin,
  mode = 'anime',
  onQuickIncrement,
  onSelect,
}: RecentUpdatesSectionProps) {
  const { dict } = useLanguage()

  // Get items updated in last 7 days or fallback to the 5 most recently updated
  const recentUpdates = React.useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const filtered = sorted.filter((e) => new Date(e.updatedAt).getTime() >= sevenDaysAgo)
    return filtered.length > 0 ? filtered.slice(0, 5) : sorted.slice(0, 4)
  }, [entries])

  if (recentUpdates.length === 0) return null

  const getStatusBadge = (status: AnimeStatus | string) => {
    switch (status) {
      case 'WATCHING':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono uppercase">
            {dict.tabs.watching}
          </span>
        )
      case 'READING':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono uppercase">
            {dict.tabs.reading || 'Čteno'}
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181b28] text-[#949ba4] border border-white/10 font-semibold font-mono uppercase">
            {dict.tabs.completed}
          </span>
        )
      case 'PLAN_TO_WATCH':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono uppercase">
            {dict.tabs.planToWatch}
          </span>
        )
      case 'PLAN_TO_READ':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono uppercase">
            {dict.tabs.planToRead || 'Plánuji'}
          </span>
        )
      case 'ON_HOLD':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold font-mono uppercase">
            {dict.tabs.onHold}
          </span>
        )
      case 'DROPPED':
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#451a1a] text-[#f87171] border border-[#ef4444]/40 font-semibold font-mono uppercase">
            {dict.tabs.dropped}
          </span>
        )
      default:
        return null
    }
  }

  const formatRelativeTime = (isoString: string) => {
    const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return '< 1h'
    if (diffHours < 24) return `${diffHours}h`
    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d`
  }

  return (
    <div className="bg-[#0b0d16] border border-white/10 rounded-lg p-2.5 space-y-2 mb-4 shadow-sm">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-[#b59cfc] font-bold">
          <History className="w-3.5 h-3.5" />
          <span>{dict.recentUpdates?.title || 'Nedávné aktualizace'}</span>
        </div>
        <span className="text-[11px] text-[#949ba4]">
          {dict.recentUpdates?.subtitle || 'Poslední aktivita'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {recentUpdates.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className="group flex items-center justify-between p-2 rounded-md bg-[#0e1019] hover:bg-[#151824] border border-white/5 hover:border-[#7053e3]/40 transition-all cursor-pointer gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-11 shrink-0 rounded overflow-hidden bg-[#181b28] border border-white/10">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#949ba4]">
                    ?
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#f2f3f5] truncate group-hover:text-[#b59cfc] transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#949ba4] mt-0.5">
                  <span>{formatRelativeTime(item.updatedAt)}</span>
                  <span>•</span>
                  <span className="text-[#f2f3f5] font-semibold">
                    {item.chaptersRead !== undefined ? item.chaptersRead : item.episodesWatched}/
                    {(item.totalChapters !== undefined ? item.totalChapters : item.totalEpisodes) || '?'}
                    {mode === 'anime' ? ' ep' : ' kap'}
                  </span>
                  {item.score && (
                    <>
                      <span>•</span>
                      <span className="text-[#fbbf24] flex items-center gap-0.5 font-bold">
                        <Star className="w-2.5 h-2.5 fill-[#fbbf24]" />
                        {item.score}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {getStatusBadge(item.status)}
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickIncrement(item.id)
                  }}
                  title={dict.card.quickIncrement}
                  className="p-1 rounded bg-[#181b28] hover:bg-[#5865F2] text-[#949ba4] hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
