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

  // On mobile touch: clean one-way trigger from hero to projects
  const touchStartY = React.useRef<number | null>(null)
  const isScrollingToProjects = React.useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || isScrollingToProjects.current) return
    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartY.current - touchEndY

    // If swiped up more than 35px while on hero, scroll to projects
    if (deltaY > 35 && window.scrollY < 80) {
      isScrollingToProjects.current = true
      smoothScrollTo('projects')
      setTimeout(() => {
        isScrollingToProjects.current = false
      }, 700)
    }
    touchStartY.current = null
  }

  return (
    <section
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen [@media(min-width:1024px)_and_(min-height:850px)]:h-screen [@media(min-width:1024px)_and_(min-height:850px)]:snap-start flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-6 pb-6"
    >
      {/* Top Bar with Brand & Language Toggle */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-12">
        <span className="font-bold text-base tracking-wider text-[#f2f3f5]">
          xflasar<span className="text-[#8c6bf7]">.com</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            title={dict.about.cvPreparing || 'Připravuje se...'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/60 border border-white/5 text-xs font-semibold text-[#949ba4] cursor-not-allowed opacity-75"
          >
            <span>📄 {dict.nav.downloadCv}</span>
            <span className="text-[10px] text-[#b59cfc] font-mono bg-white/5 px-1.5 py-0.2 rounded">
              {dict.about.cvPreparing}
            </span>
          </button>
          <LanguageSwitch />
        </div>
      </div>

      {/* Hero Headline & Call to Action - Perfectly centered */}
      <div className="w-full max-w-2xl space-y-4 my-auto flex flex-col items-center justify-center py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7053e3]/15 border border-[#7053e3]/30 text-[#b59cfc] text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#7053e3] animate-pulse" />
          <span>{dict.hero.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f3f5]">
          {dict.hero.greeting}{' '}
          <span className="bg-gradient-to-r from-[#b59cfc] via-[#8c6bf7] to-[#5865F2] bg-clip-text text-transparent">
            {dict.hero.name}
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-[#949ba4] leading-relaxed max-w-xl mx-auto">
          {dict.hero.pitch}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <a
            href="#projects"
            onClick={handleScroll('projects')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all shadow-md shadow-[#5865F2]/25"
          >
            {dict.hero.ctaProjects}
          </a>
          <a
            href="#about"
            onClick={handleScroll('about')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0e1019] text-[#f2f3f5] border border-white/10 hover:border-[#7053e3]/50 hover:bg-[#181b28] transition-all"
          >
            {dict.hero.ctaAbout}
          </a>
        </div>

        {/* Quick Links Directory & Now Playing Badge */}
        <div className="space-y-2.5 pt-1">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/40 border border-white/5 text-xs text-[#949ba4]/50 cursor-not-allowed select-none"
              title="Coming Soon"
            >
              <span>🐾 Aki</span>
              <span className="text-[9px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/60">Soon</span>
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/40 border border-white/5 text-xs text-[#949ba4]/50 cursor-not-allowed select-none"
              title="Coming Soon"
            >
              <span>🎮 Gaming</span>
              <span className="text-[9px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/60">Soon</span>
            </div>

            <a
              href="https://anime.xflasar.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181b28]/80 hover:bg-[#7053e3]/20 border border-white/5 hover:border-[#7053e3]/40 text-xs text-[#949ba4] hover:text-[#b59cfc] transition-all"
            >
              <span>⛩️ Anime / Manga</span>
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
            <span>{dict.hero.playingGame || 'Offline'}</span>
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
