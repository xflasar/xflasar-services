'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { smoothScrollTo } from '@/lib/scroll'

interface SectionContainerProps {
  id: string
  nextSectionId?: string
  nextLabel?: string
  children: React.ReactNode
  className?: string
}

export function SectionContainer({
  id,
  nextSectionId,
  nextLabel = 'Next',
  children,
  className = '',
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen snap-start box-border flex flex-col justify-between items-center px-4 pt-16 pb-4 ${className}`}
    >
      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center min-h-0">
        {children}
      </div>

      {/* Bottom Center Next-Section Trigger */}
      {nextSectionId && (
        <div className="flex items-center justify-center pt-2 pb-1 shrink-0">
          <button
            onClick={() => smoothScrollTo(nextSectionId)}
            title={`Scroll to ${nextLabel}`}
            aria-label={`Scroll to ${nextLabel}`}
            className="group flex flex-col items-center gap-1 text-[#949ba4] hover:text-[#f2f3f5] transition-colors focus:outline-none"
          >
            <span className="text-[10px] uppercase tracking-wider text-[#949ba4] group-hover:text-[#b59cfc] transition-colors">
              {nextLabel}
            </span>
            <div className="p-1 rounded-full bg-[#181b28]/80 border border-white/10 group-hover:border-[#7053e3]/50 group-hover:bg-[#232738] transition-all animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-[#b59cfc]" />
            </div>
          </button>
        </div>
      )}
    </section>
  )
}
