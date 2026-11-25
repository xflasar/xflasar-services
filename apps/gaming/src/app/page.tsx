'use client'

import React, { useState, useEffect } from 'react'
import { LiveHero } from '@/components/LiveHero'
import { KpiRibbon } from '@/components/KpiRibbon'
import { Battlestation } from '@/components/Battlestation'
import { GameLibrary } from '@/components/GameLibrary'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { SteamPlayerSummary, SteamGame, GamingStats } from '@/types'
import { MOCK_PLAYER_SUMMARY, MOCK_GAMES, MOCK_GAMING_STATS } from '@/lib/mock-data'
import { useLanguage } from '@/lib/language-context'
import { getGameCoverUrl } from '@/lib/covers'

const CACHE_KEY = 'steam_gaming_cache_v2'

export default function GamingPage() {
  const { dict } = useLanguage()

  // State: No initial mock data, initialized empty for true cache-first SWR
  const [player, setPlayer] = useState<SteamPlayerSummary | null>(null)
  const [games, setGames] = useState<SteamGame[]>([])
  const [stats, setStats] = useState<GamingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // 1. Read from localStorage cache immediately
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed?.games && parsed.games.length > 0) {
          setPlayer(parsed.player || null)
          setGames(parsed.games || [])
          setStats(parsed.stats || null)
          setIsLoading(false)
          setIsSyncing(true) // Silent background refresh
        }
      }
    } catch (e) {
      console.warn('Failed to parse steam cache', e)
    }

    // 2. Fetch fresh data from Steam API
    async function loadData() {
      try {
        const res = await fetch('/api/steam')
        if (!res.ok) throw new Error('Failed to fetch Steam data')
        const json = await res.json()
        if (json.success) {
          if (json.player) setPlayer(json.player)
          if (json.games) setGames(json.games)
          if (json.stats) setStats(json.stats)

          // Save to localStorage for instant subsequent loads
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                player: json.player,
                games: json.games,
                stats: json.stats,
                savedAt: Date.now(),
              })
            )
          } catch (storageErr) {
            console.warn('Storage quota or error:', storageErr)
          }
        }
      } catch (err) {
        console.warn('Failed to sync live data:', err)
        // Fallback to mock only if cache was completely absent
        setPlayer((prev) => prev || MOCK_PLAYER_SUMMARY)
        setGames((prev) => (prev.length > 0 ? prev : MOCK_GAMES))
        setStats((prev) => prev || MOCK_GAMING_STATS)
      } finally {
        setIsLoading(false)
        setIsSyncing(false)
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
    <div className="min-h-screen bg-[#05060b] text-[#f2f3f5] flex flex-col justify-between relative">
      {/* Background sync indicator line */}
      {isSyncing && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#7053e3] to-transparent animate-pulse z-50 pointer-events-none" />
      )}

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
            {isSyncing && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                syncing
              </span>
            )}
            <LanguageSwitch />
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-4 space-y-3 w-full flex-1">
        {isLoading && games.length === 0 ? (
          /* Custom Cyber Loading State */
          <div className="space-y-3 animate-pulse">
            {/* LiveHero Skeleton */}
            <div className="rounded-xl border border-white/10 bg-[#0e1019] p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-white/5" />
                <div className="space-y-2">
                  <div className="w-28 h-5 rounded bg-white/10" />
                  <div className="w-20 h-3.5 rounded bg-white/5" />
                </div>
              </div>
            </div>

            {/* KPI Ribbon Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[#0e1019] border border-white/5 p-3 flex flex-col justify-between">
                  <div className="w-16 h-3 rounded bg-white/5" />
                  <div className="w-24 h-5 rounded bg-white/10" />
                </div>
              ))}
            </div>

            {/* Custom Neon Loading Bar */}
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                <div className="w-full h-full bg-gradient-to-r from-[#7053e3] via-[#3ba55d] to-[#7053e3] rounded-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <span className="text-xs font-mono text-white/40 tracking-wider uppercase">
                Synchronizing Steam Library...
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Live Hero Status Banner */}
            <LiveHero player={player} currentGame={currentGame} />

            {/* 2. KPI Ribbon */}
            <KpiRibbon stats={stats || MOCK_GAMING_STATS} />

            {/* 3. Game Library (Grid vs Table, Search, Filters) */}
            <div className="pt-1">
              <GameLibrary games={games} />
            </div>

            {/* 4. Battlestation & Hardware */}
            <div className="pt-2">
              <Battlestation />
            </div>
          </>
        )}
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
