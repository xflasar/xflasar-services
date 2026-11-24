'use client'

import React, { useState } from 'react'
import { Search, LayoutGrid, Table, Clock, ExternalLink, Gamepad2 } from 'lucide-react'
import { SteamGame } from '@/types'
import { useLanguage } from '@/lib/language-context'

function GameCardImage({ game }: { game: SteamGame }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0c0e17] text-[#949ba4] p-2 text-center">
        <Gamepad2 className="w-6 h-6 text-[#7053e3]/60 mb-1" />
        <span className="text-[10px] font-bold text-[#f2f3f5] line-clamp-1">{game.name}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={game.headerImageUrl}
      alt={game.name}
      loading="lazy"
      onError={() => setImgError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )
}

interface GameLibraryProps {
  games: SteamGame[]
}

export function GameLibrary({ games }: GameLibraryProps) {
  const { dict } = useLanguage()
  const [filterTab, setFilterTab] = useState<'all' | 'recent' | 'top'>('top')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // =========================================================================
  // 🎯 TODO PRO TEBE: FILTROVÁNÍ A ŘAZENÍ HER
  // =========================================================================
  // Vstup:
  // - `games`: pole všech Steam her
  // - `filterTab`: 'all' | 'recent' | 'top'
  // - `searchQuery`: text z vyhledávače
  //
  // Co má funkce vrátit:
  // - pole her profiltrované podle `searchQuery`
  // - seřazené podle `filterTab`:
  //   - 'top': seřaď podle `playtimeForeverMinutes` od největšího po nejmenší
  //   - 'recent': vyfiltruj pouze hry s `playtime2WeeksMinutes > 0` a seřaď podle něj
  //   - 'all': všechny hry např. abecedně podle `name`
  // =========================================================================
  const filteredGames = React.useMemo(() => {
    let result = [...games]

    // 1. Vyhledávání
    if (searchQuery.trim()) {
      result = result.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 2. Filtrování & Řazení
    if (filterTab === 'top') {
      result.sort((a, b) => b.playtimeForeverMinutes - a.playtimeForeverMinutes)
    } else if (filterTab === 'recent') {
      result = result
        .filter((g) => (g.playtime2WeeksMinutes || 0) > 0)
        .sort((a, b) => (b.playtime2WeeksMinutes || 0) - (a.playtime2WeeksMinutes || 0))
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [games, filterTab, searchQuery])

  return (
    <div className="space-y-4">
      {/* Toolbar: Tabs, Search, View switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center bg-[#0e1019] p-0.5 rounded-lg border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('top')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
              filterTab === 'top'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.topPlayed}
          </button>
          <button
            onClick={() => setFilterTab('recent')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
              filterTab === 'recent'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.recent}
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
              filterTab === 'all'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            {dict.tabs.all} ({games.length})
          </button>
        </div>

        {/* Right side: Search and View Mode */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]" />
            <input
              type="text"
              placeholder={dict.library.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-[#0e1019] border border-white/10 rounded-lg text-xs text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:border-[#7053e3]/60 font-mono"
            />
          </div>

          <div className="flex bg-[#0e1019] p-0.5 rounded-lg border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid' ? 'bg-[#181b28] text-[#b59cfc]' : 'text-[#949ba4]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'table' ? 'bg-[#181b28] text-[#b59cfc]' : 'text-[#949ba4]'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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
                <div
                  key={game.appId}
                  className="group bg-[#0e1019] border border-white/10 rounded-lg overflow-hidden hover:border-[#7053e3]/50 hover:bg-[#131622] transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[460/215] bg-[#06070c] overflow-hidden">
                    <GameCardImage game={game} />
                    {hours2Weeks > 0 && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#1e4620]/90 border border-[#22c55e]/40 text-[#4ade80] text-[9px] font-mono font-semibold">
                        +{hours2Weeks}h nedávno
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h4 className="font-bold text-xs text-[#f2f3f5] truncate" title={game.name}>
                      {game.name}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#949ba4] pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#b59cfc]" />
                        <span>
                          {hoursTotal} {dict.library.hours}
                        </span>
                      </div>

                      <a
                        href={`https://store.steampowered.com/app/${game.appId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b59cfc] hover:text-white"
                        title={dict.library.viewOnSteam}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0e1019]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#949ba4] font-mono uppercase text-[11px] bg-[#0c0e17]">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Hra</th>
                  <th className="py-2.5 px-3 text-right">Odehráno celkem</th>
                  <th className="py-2.5 px-3 text-right">Za 14 dní</th>
                  <th className="py-2.5 px-3 text-center w-24">Steam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredGames.map((game, idx) => (
                  <tr key={game.appId} className="hover:bg-[#181b28]/60 transition-colors">
                    <td className="py-2 px-3 text-center text-[#949ba4]">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 font-sans font-semibold text-[#f2f3f5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={game.imgIconUrl || game.headerImageUrl}
                          alt=""
                          className="w-5 h-5 rounded object-cover"
                        />
                        <span className="truncate">{game.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-[#b59cfc] font-bold">
                      {Math.round(game.playtimeForeverMinutes / 60)}h
                    </td>
                    <td className="py-2 px-3 text-right text-[#4ade80]">
                      {game.playtime2WeeksMinutes ? `${Math.round(game.playtime2WeeksMinutes / 60)}h` : '-'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <a
                        href={`https://store.steampowered.com/app/${game.appId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center text-[#949ba4] hover:text-[#b59cfc]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
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
