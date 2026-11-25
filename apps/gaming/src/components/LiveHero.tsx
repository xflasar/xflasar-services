'use client'

import React, { useState } from 'react'
import { Gamepad2, ExternalLink } from 'lucide-react'
import { SteamPlayerSummary, SteamGame } from '@/types'
import { useLanguage } from '@/lib/language-context'
import { getGameCoverUrl, getGameFallbackUrls } from '@/lib/covers'

interface LiveHeroProps {
  player: SteamPlayerSummary | null
  currentGame?: SteamGame | null
}

export function LiveHero({ player, currentGame }: LiveHeroProps) {
  const { dict } = useLanguage()
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const isPlaying = Boolean(player?.gameExtraInfo)
  const isOnline = player?.personaState !== undefined && player.personaState > 0

  const coverCandidates = React.useMemo(() => {
    const primary =
      currentGame?.headerImageUrl ||
      getGameCoverUrl(player?.gameId, player?.gameExtraInfo)
    const fallbacks = getGameFallbackUrls(
      player?.gameId || currentGame?.appId,
      currentGame?.imgIconUrl
    )
    return [primary, ...fallbacks].filter(Boolean)
  }, [currentGame, player?.gameId, player?.gameExtraInfo])

  const currentCoverUrl = coverCandidates[fallbackIndex]

  const handleImgError = () => {
    if (fallbackIndex < coverCandidates.length - 1) {
      setFallbackIndex((prev) => prev + 1)
    } else {
      setAllFailed(true)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e1019] p-3 shadow-lg">
      {/* Ambient background glow if playing */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isPlaying ? 'bg-[#3ba55d]/15' : 'bg-[#7053e3]/10'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Avatar & Player Info strictly inline */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0">
            {player?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.avatarUrl}
                alt={player.personaName || 'Steam Avatar'}
                className="w-14 h-14 rounded-lg object-cover border-2 border-white/10 shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-[#181b28] border-2 border-white/10 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-7 h-7 text-[#949ba4]" />
              </div>
            )}

            {/* Pulse Indicator on Avatar */}
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0e1019] ${
                isPlaying
                  ? 'bg-[#3ba55d] animate-pulse'
                  : isOnline
                  ? 'bg-[#5865F2]'
                  : 'bg-[#949ba4]/60'
              }`}
            />
          </div>

          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#f2f3f5] tracking-tight leading-tight">
              {player?.personaName || 'Gamer Profile'}
            </h2>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border shadow-md ${
                  isPlaying
                    ? 'bg-[#1e4620] text-[#4ade80] border-[#22c55e]/50'
                    : isOnline
                    ? 'bg-[#1e2a5e] text-[#60a5fa] border-[#3b82f6]/50'
                    : 'bg-[#181b28] text-[#949ba4] border-white/10'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlaying ? 'bg-[#4ade80] animate-ping' : 'bg-current'
                  }`}
                />
                {isOnline ? dict.hero.online : dict.hero.offline}
              </span>

              {player?.profileUrl && (
                <a
                  href={player.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#b59cfc] hover:text-white transition-colors font-mono"
                >
                  <span>{dict.nav.steamProfile}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Currently Playing Game Spotlight (shown ONLY when in-game) */}
        {isPlaying && (
          <div className="w-full md:w-auto md:max-w-md bg-[#06070c]/80 border border-[#22c55e]/30 rounded-lg p-2 backdrop-blur-sm flex items-center gap-2.5 shadow-lg shadow-[#22c55e]/5 animate-fadeIn md:ml-auto">
            {currentCoverUrl && !allFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentCoverUrl}
                alt={player?.gameExtraInfo || currentGame?.name || 'In-Game'}
                onError={handleImgError}
                className="w-16 h-10 rounded object-cover border border-white/10 shadow shrink-0"
              />
            ) : (
              <div className="w-16 h-10 rounded bg-[#181b28] border border-white/10 flex flex-col items-center justify-center p-1 text-center shrink-0">
                <Gamepad2 className="w-4 h-4 text-[#4ade80]" />
              </div>
            )}

            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-[#1e4620]/90 border border-[#22c55e]/50 text-[10px] uppercase font-mono tracking-wider text-[#4ade80] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                {dict.hero.inGame}
              </span>
              <h3 className="text-sm font-bold text-[#f2f3f5] truncate">
                {player?.gameExtraInfo || currentGame?.name}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
