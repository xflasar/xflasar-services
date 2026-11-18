'use client'

import React from 'react'
import { useLanguage } from '@/lib/language-context'

export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`inline-flex items-center p-0.5 rounded-lg bg-[#0e1019] border border-white/10 ${className}`}>
      <button
        onClick={() => setLang('cz')}
        className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-all ${
          lang === 'cz'
            ? 'bg-[#5865F2] text-white shadow-sm'
            : 'text-[#949ba4] hover:text-[#f2f3f5]'
        }`}
        aria-label="Přepnout do češtiny"
      >
        CZ
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-all ${
          lang === 'en'
            ? 'bg-[#5865F2] text-white shadow-sm'
            : 'text-[#949ba4] hover:text-[#f2f3f5]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  )
}

