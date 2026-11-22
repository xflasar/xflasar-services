'use client'

import React from 'react'
import { Plus, Star, ExternalLink, Edit3, Trash2 } from 'lucide-react'
import { AnimeEntry, AnimeStatus } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'

interface AnimeTableViewProps {
  entries: AnimeEntry[]
  isAdmin: boolean
  onQuickIncrement: (id: string) => void
  onEdit: (anime: AnimeEntry) => void
  onDelete: (id: string) => void
  onSelect?: (anime: AnimeEntry) => void
}

export function AnimeTableView({
  entries,
  isAdmin,
  onQuickIncrement,
  onEdit,
  onDelete,
  onSelect,
}: AnimeTableViewProps) {
  const { dict } = useLanguage()

  const getStatusBadge = (status: AnimeStatus) => {
    switch (status) {
      case 'WATCHING':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold font-mono uppercase">
            {dict.tabs.watching}
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#181b28] text-[#949ba4] border border-white/10 font-semibold font-mono uppercase">
            {dict.tabs.completed}
          </span>
        )
      case 'PLAN_TO_WATCH':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold font-mono uppercase">
            {dict.tabs.planToWatch}
          </span>
        )
      case 'ON_HOLD':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold font-mono uppercase">
            {dict.tabs.onHold}
          </span>
        )
      case 'DROPPED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a1a] text-[#f87171] border border-[#ef4444]/40 font-semibold font-mono uppercase">
            {dict.tabs.dropped}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0e1019]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-white/10 text-[#949ba4] font-mono uppercase text-[11px] bg-[#0c0e17]">
            <th className="py-2.5 px-3 w-12 text-center">{dict.table.num}</th>
            <th className="py-2.5 px-3 min-w-[200px]">{dict.table.title}</th>
            <th className="py-2.5 px-3 text-center w-24">{dict.table.score}</th>
            <th className="py-2.5 px-3 text-center w-28">{dict.table.status}</th>
            <th className="py-2.5 px-3 text-center w-36">{dict.table.episodes}</th>
            <th className="py-2.5 px-3 min-w-[150px]">{dict.table.genres}</th>
            {isAdmin && <th className="py-2.5 px-3 text-right w-24">{dict.table.actions}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {entries.map((anime, idx) => (
            <tr
              key={anime.id}
              className="hover:bg-[#181b28]/50 transition-colors group"
            >
              {/* Row Number */}
              <td className="py-2.5 px-3 text-center text-[#949ba4] font-mono text-[11px]">
                {idx + 1}
              </td>

              {/* Title & Poster */}
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  {anime.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-8 h-11 object-cover rounded border border-white/10 shrink-0"
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span
                        onClick={() => onSelect && onSelect(anime)}
                        className="font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors leading-tight cursor-pointer hover:underline"
                        title="Zobrazit detail"
                      >
                        {anime.title}
                      </span>
                      {anime.malId && (
                        <a
                          href={`https://myanimelist.net/anime/${anime.malId}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open on MyAnimeList"
                          className="text-[#949ba4] hover:text-[#5865F2] transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {anime.personalNotes && (
                      <span className="text-[10px] text-[#949ba4] italic mt-0.5 line-clamp-1">
                        &quot;{anime.personalNotes}&quot;
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Score */}
              <td className="py-2.5 px-3 text-center font-mono">
                {anime.score ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#181b28] border border-[#fbbf24]/30 text-[#fbbf24] font-bold">
                    <Star className="w-3 h-3 fill-[#fbbf24]" />
                    {anime.score}
                  </span>
                ) : (
                  <span className="text-[#949ba4]">—</span>
                )}
              </td>

              {/* Status */}
              <td className="py-2.5 px-3 text-center">
                {getStatusBadge(anime.status)}
              </td>

              {/* Progress */}
              <td className="py-2.5 px-3 text-center">
                <div className="inline-flex items-center gap-1.5 font-mono">
                  <span className="text-[#f2f3f5] font-bold">{anime.episodesWatched}</span>
                  <span className="text-[#949ba4]">/</span>
                  <span className="text-[#949ba4]">{anime.totalEpisodes || '?'}</span>

                  {isAdmin && anime.status === 'WATCHING' && (
                    <button
                      onClick={() => onQuickIncrement(anime.id)}
                      disabled={anime.totalEpisodes ? anime.episodesWatched >= anime.totalEpisodes : false}
                      className="ml-1 p-1 rounded bg-[#181b28] hover:bg-[#5865F2] text-[#b59cfc] hover:text-white border border-white/10 transition-colors disabled:opacity-30"
                      title={dict.card.quickIncrement}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </td>

              {/* Genres */}
              <td className="py-2.5 px-3">
                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 3).map((g) => (
                    <span
                      key={g}
                      className="text-[10px] px-1.5 py-0.2 rounded bg-[#181b28] text-[#949ba4] border border-white/5 font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </td>

              {/* Admin Actions */}
              {isAdmin && (
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(anime)}
                      className="p-1.5 rounded hover:bg-[#181b28] text-[#949ba4] hover:text-[#b59cfc] transition-colors"
                      title={dict.card.edit}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(anime.id)}
                      className="p-1.5 rounded hover:bg-[#3b1212] text-[#949ba4] hover:text-[#f87171] transition-colors"
                      title={dict.card.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
