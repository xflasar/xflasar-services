'use client'

import React from 'react'
import { X, Star, ExternalLink, Calendar, Film, Tv, BookOpen } from 'lucide-react'
import { AnimeEntry, AnimeStatus } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface AnimeDetailModalProps {
  anime: any | null
  isOpen: boolean
  mode?: 'anime' | 'manga'
  onClose: () => void
  onOpenEdit?: (anime: any) => void
  isAdmin?: boolean
}

export function AnimeDetailModal({
  anime,
  isOpen,
  mode = 'anime',
  onClose,
  onOpenEdit,
  isAdmin,
}: AnimeDetailModalProps) {
  const { dict } = useLanguage()

  if (!isOpen || !anime) return null

  const getStatusBadge = (status: AnimeStatus | string) => {
    switch (status) {
      case 'WATCHING':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.watching}
          </span>
        )
      case 'READING':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.reading || 'Čteno'}
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#181b28] text-[#949ba4] border border-white/10 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.completed}
          </span>
        )
      case 'PLAN_TO_WATCH':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.planToWatch}
          </span>
        )
      case 'PLAN_TO_READ':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.planToRead || 'Plánuji'}
          </span>
        )
      case 'ON_HOLD':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.onHold}
          </span>
        )
      case 'DROPPED':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#451a1a] text-[#f87171] border border-[#ef4444]/40 font-semibold font-mono tracking-wider uppercase">
            {dict.tabs.dropped}
          </span>
        )
      default:
        return null
    }
  }

  const currentProgress = anime.chaptersRead !== undefined ? anime.chaptersRead : (anime.episodesWatched || 0)
  const maxProgress = anime.totalChapters !== undefined ? anime.totalChapters : anime.totalEpisodes

  const progressPercent = maxProgress
    ? Math.min(100, Math.round((currentProgress / maxProgress) * 100))
    : 0

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0e1019] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0c0e17] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[#b59cfc]">MAL ID: {anime.malId}</span>
            <span>•</span>
            {getStatusBadge(anime.status)}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#949ba4] hover:text-white hover:bg-[#181b28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Top Banner Grid */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Poster Image */}
            <div className="w-36 sm:w-44 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg mx-auto sm:mx-0">
              {anime.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={anime.imageUrl} alt={anime.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center bg-[#181b28] text-xs text-[#949ba4]">
                  No Image
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#f2f3f5] leading-tight">
                  {anime.title}
                </h3>
                {anime.titleEn && anime.titleEn !== anime.title && (
                  <p className="text-xs text-[#949ba4] mt-0.5">{anime.titleEn}</p>
                )}
              </div>

              {/* Badges / Quick Stats */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Score */}
                {anime.score ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#181b28] border border-[#fbbf24]/30 text-[#fbbf24] font-mono text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                    <span>{anime.score} / 10</span>
                  </div>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-[#181b28] text-[#949ba4] font-mono border border-white/5">
                    {dict.card.unrated}
                  </span>
                )}

                {/* Episodes / Chapters */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181b28] border border-white/10 text-xs font-mono">
                  {mode === 'anime' ? (
                    <Film className="w-3.5 h-3.5 text-[#5865F2]" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-[#5865F2]" />
                  )}
                  <span>
                    {currentProgress} / {maxProgress || '?'} {mode === 'anime' ? 'ep' : 'kap'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[#949ba4]">
                  <span>{dict.modal.progress}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#181b28] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${anime.status === 'COMPLETED' ? 'bg-[#3ba55d]' : 'bg-[#7053e3]'
                      }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {anime.genres.map((g: string) => (
                  <span
                    key={g}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#181b28] text-[#b59cfc] font-medium border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Notes */}
          {anime.personalNotes && (
            <div className="p-3.5 rounded-lg bg-[#06070c] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#b59cfc] font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-[#b59cfc]" />
                <span>{dict.modal.personalNotes}</span>
              </div>
              <p className="text-xs text-[#949ba4] leading-relaxed italic">
                &quot;{anime.personalNotes}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-[#0c0e17] shrink-0">
          {anime.malId ? (
            <a
              href={`https://myanimelist.net/${mode === 'anime' ? 'anime' : 'manga'}/${anime.malId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#949ba4] hover:text-[#5865F2] font-semibold transition-colors"
            >
              <span>{dict.modal.viewOnMal}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {isAdmin && onOpenEdit && (
              <button
                onClick={() => {
                  onClose()
                  onOpenEdit(anime)
                }}
                className="px-3.5 py-1.5 rounded-md bg-[#181b28] hover:bg-[#202436] text-[#f2f3f5] border border-white/10 text-xs font-semibold transition-colors"
              >
                {dict.card.edit}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-all shadow-sm"
            >
              {dict.modal.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
