'use client'

import React, { useState } from 'react'
import { Search, LayoutGrid, Table, Clock, ExternalLink, Gamepad2, Filter } from 'lucide-react'
import { SteamGame } from '@/types'
import { useLanguage } from '@/lib/language-context'
import { getGameCoverUrl, getGameFallbackUrls } from '@/lib/covers'

function GameCardImage({ game }: { game: SteamGame }) {
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const coverCandidates = React.useMemo(() => {
    const primary = game.headerImageUrl || getGameCoverUrl(game.appId, game.name)
    const fallbacks = getGameFallbackUrls(game.appId, game.imgIconUrl)
    return [primary, ...fallbacks].filter(Boolean)
  }, [game])

  const currentCoverUrl = coverCandidates[fallbackIndex]

  const handleImgError = () => {
    if (fallbackIndex < coverCandidates.length - 1) {
      setFallbackIndex((prev) => prev + 1)
    } else {
      setAllFailed(true)
    }
  }

  if (allFailed || !currentCoverUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0c0e17] text-[#949ba4] p-2 text-center">
        <Gamepad2 className="w-6 h-6 text-[#7053e3]/60 mb-1" />
        <span className="text-xs font-bold text-[#f2f3f5] line-clamp-1">{game.name}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentCoverUrl}
      alt={game.name}
      loading="lazy"
      onError={handleImgError}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )
}

function GameRowIcon({ game }: { game: SteamGame }) {
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const candidates = React.useMemo(() => {
    const list: string[] = []
    if (game.imgIconUrl) list.push(game.imgIconUrl)
    const primaryCover = game.headerImageUrl || getGameCoverUrl(game.appId, game.name)
    if (primaryCover) list.push(primaryCover)
    const fallbacks = getGameFallbackUrls(game.appId)
    list.push(...fallbacks)
    return list.filter(Boolean)
  }, [game])

  const currentSrc = candidates[fallbackIndex]

  if (allFailed || !currentSrc) {
    return (
      <div className="w-6 h-6 rounded bg-[#181b28] border border-white/10 flex items-center justify-center shrink-0">
        <Gamepad2 className="w-3.5 h-3.5 text-[#b59cfc]" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt=""
      onError={() => {
        if (fallbackIndex < candidates.length - 1) {
          setFallbackIndex((prev) => prev + 1)
        } else {
          setAllFailed(true)
        }
      }}
      className="w-6 h-6 rounded object-cover border border-white/10 shrink-0"
    />
  )
}

export type PlaytimeFilter =
  | 'all'
  | '1000h+'
  | '500h-1000h'
  | '100h-500h'
  | 'under100h'
  | 'under2h'
  | 'zero'

interface GameLibraryProps {
  games: SteamGame[]
}

export function GameLibrary({ games }: GameLibraryProps) {
  const { dict } = useLanguage()
  const [filterTab, setFilterTab] = useState<'all' | 'recent' | 'top'>('all')
  const [playtimeFilter, setPlaytimeFilter] = useState<PlaytimeFilter>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Tier counts calculated dynamically
  const tierCounts = React.useMemo(() => {
    return {
      all: games.length,
      '1000h+': games.filter((g) => g.playtimeForeverMinutes >= 60000).length,
      '500h-1000h': games.filter(
        (g) => g.playtimeForeverMinutes >= 30000 && g.playtimeForeverMinutes < 60000
      ).length,
      '100h-500h': games.filter(
        (g) => g.playtimeForeverMinutes >= 6000 && g.playtimeForeverMinutes < 30000
      ).length,
      under100h: games.filter(
        (g) => g.playtimeForeverMinutes >= 120 && g.playtimeForeverMinutes < 6000
      ).length,
      under2h: games.filter(
        (g) => g.playtimeForeverMinutes < 120 && g.playtimeForeverMinutes > 0
      ).length,
      zero: games.filter((g) => g.playtimeForeverMinutes === 0).length,
    }
  }, [games])

  const filteredGames = React.useMemo(() => {
    let result = [...games]

    // 1. Text search
    if (searchQuery.trim()) {
      result = result.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 2. Playtime Tier filter
    if (playtimeFilter === '1000h+') {
      result = result.filter((g) => g.playtimeForeverMinutes >= 60000)
    } else if (playtimeFilter === '500h-1000h') {
      result = result.filter(
        (g) => g.playtimeForeverMinutes >= 30000 && g.playtimeForeverMinutes < 60000
      )
    } else if (playtimeFilter === '100h-500h') {
      result = result.filter(
        (g) => g.playtimeForeverMinutes >= 6000 && g.playtimeForeverMinutes < 30000
      )
    } else if (playtimeFilter === 'under100h') {
      result = result.filter(
        (g) => g.playtimeForeverMinutes >= 120 && g.playtimeForeverMinutes < 6000
      )
    } else if (playtimeFilter === 'under2h') {
      result = result.filter(
        (g) => g.playtimeForeverMinutes < 120 && g.playtimeForeverMinutes > 0
      )
    } else if (playtimeFilter === 'zero') {
      result = result.filter((g) => g.playtimeForeverMinutes === 0)
    }

    // 3. Sort tab
    if (filterTab === 'top') {
      result.sort((a, b) => b.playtimeForeverMinutes - a.playtimeForeverMinutes)
    } else if (filterTab === 'recent') {
      result = result
        .filter((g) => (g.playtime2WeeksMinutes || 0) > 0)
        .sort((a, b) => (b.playtime2WeeksMinutes || 0) - (a.playtime2WeeksMinutes || 0))
    } else {
      // 'all' tab: recent games first, then alphabetical
      result.sort((a, b) => {
        const aRecent = a.playtime2WeeksMinutes || 0
        const bRecent = b.playtime2WeeksMinutes || 0

        if (aRecent > 0 && bRecent > 0) return bRecent - aRecent
        if (aRecent > 0 && bRecent === 0) return -1
        if (bRecent > 0 && aRecent === 0) return 1

        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      })
    }

    return result
  }, [games, filterTab, playtimeFilter, searchQuery])

  const tierPills: { id: PlaytimeFilter; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All Playtimes', count: tierCounts.all },
    { id: '1000h+', label: '1,000h+', count: tierCounts['1000h+'], color: '#a855f7' },
    { id: '500h-1000h', label: '500h – 1k', count: tierCounts['500h-1000h'], color: '#c084fc' },
    { id: '100h-500h', label: '100h – 500h', count: tierCounts['100h-500h'], color: '#34d399' },
    { id: 'under100h', label: '< 100h', count: tierCounts.under100h, color: '#38bdf8' },
    { id: 'under2h', label: '< 2h', count: tierCounts.under2h, color: '#f59e0b' },
    { id: 'zero', label: '0h / Unplayed', count: tierCounts.zero, color: '#f43f5e' },
  ]

  return (
    <div className="space-y-2.5">
      {/* Row 1: Sort Tabs, Search, View switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Sort Tabs */}
        <div className="flex items-center bg-[#0e1019] p-1 rounded-lg border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('top')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded text-sm font-semibold font-mono transition-all ${
              filterTab === 'top'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.topPlayed}
          </button>
          <button
            onClick={() => setFilterTab('recent')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded text-sm font-semibold font-mono transition-all ${
              filterTab === 'recent'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.recent}
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded text-sm font-semibold font-mono transition-all ${
              filterTab === 'all'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.all} ({games.length})
          </button>
        </div>

        {/* Right side: Search and View Mode */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]" />
            <input
              type="text"
              placeholder={dict.library.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0e1019] border border-white/10 rounded-lg text-sm text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:border-[#7053e3]/60 font-mono"
            />
          </div>

          <div className="flex bg-[#0e1019] p-1 rounded-lg border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid' ? 'bg-[#181b28] text-[#b59cfc]' : 'text-[#949ba4]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'table' ? 'bg-[#181b28] text-[#b59cfc]' : 'text-[#949ba4]'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Playtime Tier Filter Chips (wrapping without horizontal scroll) */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono pt-0.5">
        <span className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1.5 shrink-0 pl-0.5 pr-1 font-semibold">
          <Filter className="w-3.5 h-3.5" /> Tier:
        </span>
        {tierPills.map((pill) => {
          const isActive = playtimeFilter === pill.id
          return (
            <button
              key={pill.id}
              onClick={() => setPlaytimeFilter(pill.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#7053e3]/20 border-[#7053e3] text-white shadow-sm font-semibold'
                  : 'bg-[#0e1019]/80 border-white/5 text-[#949ba4] hover:text-white hover:border-white/15'
              }`}
            >
              {pill.color && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: pill.color }}
                />
              )}
              <span>{pill.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${
                  isActive ? 'bg-[#7053e3]/40 text-white' : 'bg-white/5 text-white/50'
                }`}
              >
                {pill.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid or Table Display */}
      {filteredGames.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredGames.map((game) => {
              const hoursTotal = Math.round(game.playtimeForeverMinutes / 60)
              const hours2Weeks = game.playtime2WeeksMinutes
                ? Math.round(game.playtime2WeeksMinutes / 60)
                : 0

              return (
                <a
                  key={game.appId}
                  href={`https://store.steampowered.com/app/${game.appId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={game.name}
                  className="group bg-[#0e1019] border border-white/10 rounded-lg overflow-hidden hover:border-[#7053e3]/60 hover:bg-[#131622] hover:shadow-lg hover:shadow-[#7053e3]/10 transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-[460/215] bg-[#06070c] overflow-hidden">
                    <GameCardImage game={game} />
                    {hours2Weeks > 0 && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#1e4620]/95 border border-[#22c55e]/60 text-[#4ade80] text-xs font-mono font-bold shadow-md backdrop-blur-sm">
                        +{hours2Weeks}h {dict.library.recentBadge}
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5">
                    <h4 className="font-bold text-sm text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors truncate">
                      {game.name}
                    </h4>

                    <div className="flex items-center justify-between text-xs font-mono text-[#949ba4] pt-1.5 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#b59cfc]" />
                        <span>
                          {hoursTotal} {dict.library.hours}
                        </span>
                      </div>

                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b59cfc]">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0e1019]">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[#949ba4] font-mono uppercase text-xs bg-[#0c0e17]">
                  <th className="py-3 px-3.5 w-12 text-center">#</th>
                  <th className="py-3 px-3.5">{dict.library.tableGame}</th>
                  <th className="py-3 px-3.5 text-right">{dict.library.tableTotal}</th>
                  <th className="py-3 px-3.5 text-right">{dict.library.tablePast2Weeks}</th>
                  <th className="py-3 px-3.5 text-center w-24">{dict.library.tableStore}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-sm">
                {filteredGames.map((game, idx) => (
                  <tr
                    key={game.appId}
                    onClick={() =>
                      window.open(
                        `https://store.steampowered.com/app/${game.appId}`,
                        '_blank',
                        'noreferrer'
                      )
                    }
                    className="hover:bg-[#181b28]/80 hover:text-white transition-colors cursor-pointer group"
                    title={`Open ${game.name} on Steam`}
                  >
                    <td className="py-2.5 px-3.5 text-center text-[#949ba4] group-hover:text-white">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5 font-sans font-semibold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">
                        <GameRowIcon game={game} />
                        <span className="truncate">{game.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-[#b59cfc] font-bold">
                      {Math.round(game.playtimeForeverMinutes / 60)}h
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-[#4ade80]">
                      {game.playtime2WeeksMinutes
                        ? `${Math.round(game.playtime2WeeksMinutes / 60)}h`
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className="inline-flex items-center justify-center text-[#949ba4] group-hover:text-[#b59cfc] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12 border border-white/5 rounded-lg bg-[#0e1019] text-[#949ba4] text-xs font-mono">
          {dict.library.noGamesFound}
        </div>
      )}
    </div>
  )
}
