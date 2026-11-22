'use client'

import React from 'react'
import { Plus, Star, ExternalLink, Edit3, Trash2 } from 'lucide-react'
import { AnimeEntry, AnimeStatus, MangaEntry } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface AnimeCardProps {
  anime: AnimeEntry | (MangaEntry & { episodesWatched?: number; totalEpisodes?: number })
  isAdmin: boolean
  mode?: 'anime' | 'manga'
  onQuickIncrement: (id: string) => void
  onEdit: (anime: any) => void
  onDelete: (id: string) => void
  onSelect?: (anime: any) => void
}

export function AnimeCard({
  anime,
  isAdmin,
  mode = 'anime',
  onQuickIncrement,
  onEdit,
  onDelete,
  onSelect,
}: AnimeCardProps) {
  const { dict } = useLanguage()

  const currentProgress = (anime as any).chaptersRead !== undefined
    ? (anime as any).chaptersRead
    : (anime as any).episodesWatched || 0
  const maxProgress = (anime as any).totalChapters !== undefined
    ? (anime as any).totalChapters
    : (anime as any).totalEpisodes

  const isCompleted = anime.status === 'COMPLETED'
  const isActive = anime.status === 'WATCHING' || (anime.status as any) === 'READING'
  const progressPercent = maxProgress
    ? Math.min(100, Math.round((currentProgress / maxProgress) * 100))
    : 0

  const getStatusBadge = (status: AnimeStatus | string) => {
    switch (status) {
      case 'WATCHING':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.watching}
          </span>
        )
      case 'READING':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.reading || 'Čteno'}
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#181b28] text-[#949ba4] border border-white/10 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.completed}
          </span>
        )
      case 'PLAN_TO_WATCH':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.planToWatch}
          </span>
        )
      case 'PLAN_TO_READ':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.planToRead || 'Plánuji'}
          </span>
        )
      case 'ON_HOLD':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.onHold}
          </span>
        )
      case 'DROPPED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a1a] text-[#f87171] border border-[#ef4444]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.dropped}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="group relative bg-[#0e1019] rounded-lg border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#7053e3]/50 transition-all duration-200 shadow-lg hover:shadow-[#7053e3]/5">
      {/* Top Banner / Image Container */}
      <div
        onClick={() => onSelect && onSelect(anime)}
        className="relative aspect-[3/4] w-full bg-[#06070c] overflow-hidden cursor-pointer"
      >
        {anime.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.imageUrl}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#949ba4] text-xs">
            {dict.card.noImage}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1019] via-transparent to-black/60 pointer-events-none" />

        {/* Top Badges: Status & Score */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
          <div>{getStatusBadge(anime.status)}</div>

          {anime.score ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#fbbf24]/30 text-[#fbbf24] font-mono text-xs font-bold shadow-md">
              <Star className="w-3 h-3 fill-[#fbbf24]" />
              <span>{anime.score}</span>
            </div>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#949ba4] font-mono">
              {dict.card.unrated}
            </span>
          )}
        </div>

        {/* Quick Admin Actions Overlay on Hover */}
        {isAdmin && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
            <button
              onClick={() => onEdit(anime)}
              className="p-2 rounded-md bg-[#181b28] hover:bg-[#202436] text-[#f2f3f5] border border-white/10 text-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
              title={dict.card.edit}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#b59cfc]" />
              <span>{dict.card.edit}</span>
            </button>
            <button
              onClick={() => onDelete(anime.id)}
              className="p-2 rounded-md bg-[#3b1212] hover:bg-[#501818] text-[#f87171] border border-red-500/20 text-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
              title={dict.card.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        {anime.malId ? (
          <a
            href={`https://myanimelist.net/${mode === 'anime' ? 'anime' : 'manga'}/${anime.malId}`}
            target="_blank"
            rel="noreferrer"
            title={`Open ${anime.title} on MyAnimeList`}
            className="block group/link cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex items-start justify-between gap-1">
              <h3
                className="font-bold text-sm text-[#f2f3f5] group-hover/link:text-[#b59cfc] transition-colors line-clamp-1 leading-snug"
                title={anime.title}
              >
                {anime.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-[#949ba4] group-hover/link:text-[#b59cfc] transition-colors shrink-0 mt-0.5" />
            </div>

            {anime.titleEn && anime.titleEn !== anime.title && (
              <p className="text-[11px] text-[#949ba4] line-clamp-1 mt-0.5">
                {anime.titleEn}
              </p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mt-2">
              {(anime.genres || []).slice(0, 3).map((g: string) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.2 rounded bg-[#181b28] text-[#949ba4] font-medium border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>
          </a>
        ) : (
          <div>
            <h3
              className="font-bold text-sm text-[#f2f3f5] line-clamp-1 leading-snug"
              title={anime.title}
            >
              {anime.title}
            </h3>

            {anime.titleEn && anime.titleEn !== anime.title && (
              <p className="text-[11px] text-[#949ba4] line-clamp-1 mt-0.5">
                {anime.titleEn}
              </p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mt-2">
              {(anime.genres || []).slice(0, 3).map((g: string) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.2 rounded bg-[#181b28] text-[#949ba4] font-medium border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress & Controls */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#949ba4]">
              {mode === 'anime' ? dict.card.episodes : dict.card.chapters || 'Kapitoly:'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[#f2f3f5] font-bold">{currentProgress}</span>
              <span className="text-[#949ba4]">/</span>
              <span className="text-[#949ba4]">{maxProgress || '?'}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#181b28] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-[#3ba55d]' : 'bg-[#7053e3]'
                }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick +1 Episode/Chapter Button */}
          {isActive && isAdmin && (
            <button
              onClick={() => onQuickIncrement(anime.id)}
              disabled={maxProgress ? currentProgress >= maxProgress : false}
              className="w-full mt-1.5 py-1 px-2 rounded bg-[#181b28] hover:bg-[#5865F2] hover:text-white text-[#b59cfc] border border-white/10 hover:border-[#5865F2] text-xs font-semibold font-mono flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="w-3 h-3" />
              <span>{mode === 'anime' ? dict.card.quickIncrement : dict.card.quickIncrementChapter || '+1 kap'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
