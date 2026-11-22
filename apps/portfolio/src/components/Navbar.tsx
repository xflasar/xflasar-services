'use client'

import React, { useState, useEffect } from 'react'
import { smoothScrollTo } from '@/lib/scroll'
import { LanguageSwitch } from './LanguageSwitch'
import { useLanguage } from '@/lib/language-context'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { dict } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    smoothScrollTo(id)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#05060b]/90 border-b border-white/5 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setMobileMenuOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-bold text-lg tracking-wider text-text-primary hover:text-accent-discord transition-colors"
        >
          xflasar<span className="text-[#8c6bf7]">.com</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-5">
          <a
            href="#projects"
            onClick={handleNavClick('projects')}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            {dict.nav.projects}
          </a>
          <a
            href="#about"
            onClick={handleNavClick('about')}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            {dict.nav.about}
          </a>
          <span
            className="text-text-secondary/40 text-sm font-medium flex items-center gap-1 cursor-not-allowed select-none"
            title="Coming Soon"
          >
            <span>✍️ {dict.nav.blog}</span>
            <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
          </span>
          <span
            className="text-text-secondary/40 text-sm font-medium flex items-center gap-1 cursor-not-allowed select-none"
            title="Coming Soon"
          >
            <span>🐾 {dict.nav.aki}</span>
            <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
          </span>
          <span
            className="text-text-secondary/40 text-sm font-medium flex items-center gap-1 cursor-not-allowed select-none"
            title="Coming Soon"
          >
            <span>🎮 {dict.nav.gaming}</span>
            <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
          </span>
          <a
            href="https://anime.xflasar.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#b59cfc] hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
          >
            <span>⛩️ {dict.nav.anime}</span>
            <span className="text-xs">↗</span>
          </a>
        </nav>

        {/* Desktop Actions & Hamburger Trigger */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>

          {/* Hamburger Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-xl bg-[#0e1019] hover:bg-[#181b28] border border-white/10 text-[#f2f3f5] transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#b59cfc]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#06070c]/98 backdrop-blur-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#projects"
              onClick={handleNavClick('projects')}
              className="px-3 py-2 rounded-lg bg-[#0e1019] hover:bg-[#181b28] text-base font-medium text-[#f2f3f5] transition-colors flex items-center justify-between"
            >
              <span>{dict.nav.projects}</span>
              <span className="text-xs text-[#949ba4]">Section</span>
            </a>

            <a
              href="#about"
              onClick={handleNavClick('about')}
              className="px-3 py-2 rounded-lg bg-[#0e1019] hover:bg-[#181b28] text-base font-medium text-[#f2f3f5] transition-colors flex items-center justify-between"
            >
              <span>{dict.nav.about}</span>
              <span className="text-xs text-[#949ba4]">Section</span>
            </a>

            <div className="pt-2 border-t border-white/5 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#949ba4] font-mono px-3 block">
                SUBDOMAINS
              </span>

              <div
                className="px-3 py-2 rounded-lg bg-[#0e1019]/40 text-sm text-[#949ba4]/50 flex items-center justify-between cursor-not-allowed select-none"
              >
                <span>✍️ {dict.nav.blog}</span>
                <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
              </div>

              <div
                className="px-3 py-2 rounded-lg bg-[#0e1019]/40 text-sm text-[#949ba4]/50 flex items-center justify-between cursor-not-allowed select-none"
              >
                <span>🐾 {dict.nav.aki}</span>
                <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
              </div>

              <div
                className="px-3 py-2 rounded-lg bg-[#0e1019]/40 text-sm text-[#949ba4]/50 flex items-center justify-between cursor-not-allowed select-none"
              >
                <span>🎮 {dict.nav.gaming}</span>
                <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/5 text-[#949ba4]/50">Soon</span>
              </div>

              <a
                href="https://anime.xflasar.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-[#181b28] text-sm text-[#f2f3f5] transition-colors flex items-center justify-between"
              >
                <span>⛩️ {dict.nav.anime}</span>
                <span className="text-xs text-[#b59cfc]">anime.xflasar.com ↗</span>
              </a>

              <button
                type="button"
                disabled
                title={dict.about.cvPreparing || 'Připravuje se...'}
                className="w-full px-3 py-2 rounded-lg bg-[#0e1019]/60 text-sm text-[#949ba4] flex items-center justify-between cursor-not-allowed opacity-75 border border-white/5"
              >
                <span>📄 {dict.nav.downloadCv}</span>
                <span className="text-[10px] text-[#b59cfc] font-mono bg-[#181b28] px-1.5 py-0.5 rounded border border-white/5">
                  {dict.about.cvPreparing}
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile Language Switcher */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between px-3">
            <span className="text-xs text-[#949ba4]">Jazyk / Language:</span>
            <LanguageSwitch />
          </div>
        </div>
      )}
    </header>
  )
}
