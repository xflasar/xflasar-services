'use client'

import React from 'react'
import { Gamepad2, Radio, ExternalLink, Clock } from 'lucide-react'
import { SteamPlayerSummary, SteamGame } from '@/types'
import { useLanguage } from '@/lib/language-context'

interface LiveHeroProps {
  player: SteamPlayerSummary | null
  currentGame?: SteamGame | null
}

export function LiveHero({ player, currentGame }: LiveHeroProps) {
  const { dict } = useLanguage()

  const isPlaying = Boolean(player?.gameExtraInfo)
  const isOnline = player?.personaState && player.personaState > 0

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e1019] p-4 sm:p-6 shadow-xl">
      {/* Ambient background glow if playing */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isPlaying ? 'bg-[#3ba55d]/15' : 'bg-[#7053e3]/10'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Avatar & Player Info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative shrink-0">
            {player?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.avatarUrl}
                alt={player.personaName || 'Steam Avatar'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white/10 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#181b28] border-2 border-white/10 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-[#949ba4]" />
              </div>
            )}

            {/* Pulse Indicator on Avatar */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0e1019] ${
                isPlaying
                  ? 'bg-[#3ba55d] animate-pulse'
                  : isOnline
                  ? 'bg-[#5865F2]'
                  : 'bg-[#949ba4]/60'
              }`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider border shadow-sm ${
                  isPlaying
                    ? 'bg-[#1e4620] text-[#4ade80] border-[#22c55e]/40'
                    : isOnline
                    ? 'bg-[#1e2a5e] text-[#60a5fa] border-[#3b82f6]/40'
                    : 'bg-[#181b28] text-[#949ba4] border-white/10'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlaying ? 'bg-[#4ade80] animate-ping' : 'bg-current'
                  }`}
                />
                {isPlaying
                  ? dict.hero.inGame
                  : isOnline
                  ? dict.hero.online
                  : dict.hero.offline}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#f2f3f5] tracking-tight">
              {player?.personaName || 'Gamer Profile'}
            </h2>

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

        {/* Right: Currently Playing Game Spotlight OR Last Played */}
        <div className="w-full md:w-auto md:max-w-md bg-[#06070c]/80 border border-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm flex items-center gap-4">
          {currentGame?.headerImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentGame.headerImageUrl}
              alt={currentGame.name}
              className="w-24 sm:w-28 h-14 sm:h-16 rounded object-cover border border-white/10 shadow shrink-0"
            />
          ) : (
            <div className="w-24 sm:w-28 h-14 sm:h-16 rounded bg-[#181b28] border border-white/10 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-[#949ba4]" />
            </div>
          )}

          <div className="space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#949ba4] block">
              {isPlaying ? dict.hero.inGame : dict.hero.lastSeen}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#f2f3f5] truncate">
              {player?.gameExtraInfo || currentGame?.name || 'DayZ'}
            </h3>
            {currentGame && (
              <div className="flex items-center gap-1.5 text-xs text-[#b59cfc] font-mono">
                <Clock className="w-3 h-3" />
                <span>
                  {Math.round(currentGame.playtimeForeverMinutes / 60)} {dict.library.hours}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
