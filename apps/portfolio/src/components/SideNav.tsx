'use client'

import React, { useState, useEffect } from 'react'
import { smoothScrollTo } from '@/lib/scroll'

const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About & Contact' },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 py-3 px-1.5 rounded-full bg-[#06070c]/70 backdrop-blur-sm border border-white/5"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id

        return (
          <button
            key={sec.id}
            onClick={() => smoothScrollTo(sec.id)}
            aria-label={`Jump to ${sec.label}`}
            className="p-1 focus:outline-none group flex items-center justify-center"
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-2 h-5 bg-[#5865F2] shadow-[0_0_8px_1px_rgba(88,101,242,0.6)]'
                  : 'w-2 h-2 bg-[#181b28] border border-white/20 group-hover:border-[#7053e3] group-hover:bg-[#232738] group-hover:scale-125'
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}
