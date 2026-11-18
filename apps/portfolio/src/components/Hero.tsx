'use client'

import React from 'react'
import { ChevronDown, Gamepad2 } from 'lucide-react'
import { smoothScrollTo } from '@/lib/scroll'
import { LanguageSwitch } from './LanguageSwitch'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { dict } = useLanguage()

  const handleScroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo(id)
  }

  return (
    <section id="hero" className="relative min-h-screen snap-start flex flex-col justify-between items-center text-center px-4 pt-8 pb-8">
      {/* Top Bar with Brand & Language Toggle */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-12">
        <span className="font-bold text-base tracking-wider text-[#f2f3f5]">
          xflasar<span className="text-[#8c6bf7]">.dev</span>
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#181b28] hover:bg-[#232738] border border-white/10 text-xs font-semibold text-[#f2f3f5] transition-all"
          >
            <span>📄 {dict.nav.downloadCv}</span>
          </a>
          <LanguageSwitch />
        </div>
      </div>

      {/* Hero Headline & Call to Action */}
      <div className="max-w-3xl space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7053e3]/15 border border-[#7053e3]/30 text-[#b59cfc] text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#7053e3] animate-pulse" />
          <span>{dict.hero.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f2f3f5]">
          {dict.hero.greeting}{' '}
          <span className="bg-gradient-to-r from-[#b59cfc] via-[#8c6bf7] to-[#5865F2] bg-clip-text text-transparent">
            {dict.hero.name}
          </span>
          .
        </h1>

        <p className="text-lg sm:text-xl text-[#949ba4] leading-relaxed max-w-2xl mx-auto">
          {dict.hero.pitch}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#projects"
            onClick={handleScroll('projects')}
            className="px-6 py-3 rounded-lg font-medium bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all shadow-lg shadow-[#5865F2]/25"
          >
            {dict.hero.ctaProjects}
          </a>
          <a
            href="#about"
            onClick={handleScroll('about')}
            className="px-6 py-3 rounded-lg font-medium bg-[#0e1019] text-[#f2f3f5] border border-white/10 hover:border-[#7053e3]/50 hover:bg-[#181b28] transition-all"
          >
            {dict.hero.ctaAbout}
          </a>
        </div>

        {/* Quick Links Directory & Now Playing Badge */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://aki.xflasar.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#7053e3]/20 border border-white/5 hover:border-[#7053e3]/40 text-xs text-[#949ba4] hover:text-[#b59cfc] transition-all"
            >
              <span>🐾 Aki</span>
              <span className="text-[10px] text-[#b59cfc]">↗</span>
            </a>

            <a
              href="https://gaming.xflasar.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#5865F2]/20 border border-white/5 hover:border-[#5865F2]/40 text-xs text-[#949ba4] hover:text-[#5865F2] transition-all"
            >
              <span>🎮 Gaming</span>
              <span className="text-[10px] text-[#5865F2]">↗</span>
            </a>

            <a
              href="https://anime.xflasar.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#7053e3]/20 border border-white/5 hover:border-[#7053e3]/40 text-xs text-[#949ba4] hover:text-[#b59cfc] transition-all"
            >
              <span>⛩️ Anime</span>
              <span className="text-[10px] text-[#b59cfc]">↗</span>
            </a>

            <a
              href="https://github.com/xflasar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#232738] border border-white/5 hover:border-white/20 text-xs text-[#949ba4] hover:text-[#f2f3f5] transition-all"
            >
              <span>GitHub</span>
              <span className="text-[10px] text-[#949ba4]">↗</span>
            </a>

            <a
              href="https://instagram.com/xsupefly"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#7053e3]/20 border border-white/5 hover:border-[#7053e3]/40 text-xs text-[#949ba4] hover:text-[#b59cfc] transition-all"
            >
              <span>📸 Instagram</span>
              <span className="text-[10px] text-[#b59cfc]">↗</span>
            </a>
          </div>

          {/* Steam / Gaming Activity Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1019] border border-white/5 text-[11px] text-[#949ba4]">
            <Gamepad2 className="w-3.5 h-3.5 text-[#5865F2]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#949ba4]/50" />
            <span>{dict.hero.playingGame}</span>
          </div>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <a
        href="#projects"
        onClick={handleScroll('projects')}
        aria-label="Scroll to projects"
        className="group flex flex-col items-center gap-1.5 text-xs text-[#949ba4] hover:text-[#f2f3f5] transition-colors cursor-pointer"
      >
        <span className="text-[11px] tracking-wider uppercase opacity-75 group-hover:opacity-100">
          {dict.hero.scrollDown}
        </span>
        <div className="p-1 rounded-full bg-[#181b28] border border-white/10 group-hover:border-[#7053e3]/50 group-hover:bg-[#232738] transition-all animate-bounce">
          <ChevronDown className="w-4 h-4 text-[#b59cfc]" />
        </div>
      </a>
    </section>
  )
}
