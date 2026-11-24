'use client'

import React, { useState, useEffect } from 'react'
import { LiveHero } from '@/components/LiveHero'
import { KpiRibbon } from '@/components/KpiRibbon'
import { PunotedBanner } from '@/components/PunotedBanner'
import { Battlestation } from '@/components/Battlestation'
import { GameLibrary } from '@/components/GameLibrary'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { SteamPlayerSummary, SteamGame, GamingStats } from '@/types'
import { MOCK_PLAYER_SUMMARY, MOCK_GAMES, MOCK_GAMING_STATS } from '@/lib/mock-data'
import { useLanguage } from '@/lib/language-context'
import { getGameCoverUrl } from '@/lib/covers'

export default function GamingPage() {
  const { dict } = useLanguage()

  // State
  const [player, setPlayer] = useState<SteamPlayerSummary | null>(MOCK_PLAYER_SUMMARY)
  const [games, setGames] = useState<SteamGame[]>(MOCK_GAMES)
  const [stats, setStats] = useState<GamingStats>(MOCK_GAMING_STATS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/steam')
        if (!res.ok) throw new Error('Failed to fetch Steam data')
        const json = await res.json()
        if (json.success) {
          if (json.player) setPlayer(json.player)
          if (json.games) setGames(json.games)
          if (json.stats) setStats(json.stats)
        }
      } catch (err) {
        console.warn('Using fallback data, error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const currentGame: SteamGame | null = games.find(
    (g) =>
      (player?.gameId && String(g.appId) === String(player.gameId)) ||
      (player?.gameExtraInfo && g.name.toLowerCase() === player.gameExtraInfo.toLowerCase())
  ) || (player?.gameExtraInfo ? {
    appId: player.gameId ? Number(player.gameId) : 0,
    name: player.gameExtraInfo,
    playtimeForeverMinutes: 0,
    playtime2WeeksMinutes: 0,
    headerImageUrl: getGameCoverUrl(player.gameId, player.gameExtraInfo),
  } : null)

  return (
    <div className="min-h-screen bg-[#05060b] text-[#f2f3f5] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#06070c]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="https://xflasar.com"
              className="text-xs font-mono text-[#949ba4] hover:text-[#b59cfc] transition-colors"
            >
              ← {dict.nav.backToPortfolio}
            </a>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#f2f3f5]">
              <span>🎮</span>
              <span>{dict.nav.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitch />
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6 w-full flex-1">
        {/* 1. Live Hero Status Banner */}
        <LiveHero player={player} currentGame={currentGame} />

        {/* 2. KPI Ribbon */}
        <KpiRibbon stats={stats} />

        {/* 3. PUNoted Banner - Zatím schováno, dokud nepřipravíš API */}
        {/* <PunotedBanner /> */}

        {/* 4. Game Library (Grid vs Table, Search, Filters) */}
        <div className="pt-2">
          <GameLibrary games={games} />
        </div>

        {/* 5. Battlestation & Hardware */}
        <div className="pt-4">
          <Battlestation />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#06070c] border-t border-white/10 py-4 px-4 sm:px-8 text-center text-xs text-[#949ba4] mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {dict.footer.rights}</span>
          <span className="font-mono text-[11px] text-[#949ba4]">
            Next.js • Steam API
          </span>
        </div>
      </footer>
    </div>
  )
}
