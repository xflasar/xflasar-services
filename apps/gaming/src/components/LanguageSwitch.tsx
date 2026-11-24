'use client'

import React from 'react'
import { useLanguage } from '@/lib/language-context'

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center bg-[#0e1019] p-0.5 rounded border border-white/10 font-mono text-xs">
      <button
        onClick={() => setLanguage('cz')}
        className={`px-2 py-0.5 rounded transition-all ${
          language === 'cz'
            ? 'bg-[#5865F2] text-white font-bold shadow-sm'
            : 'text-[#949ba4] hover:text-white'
        }`}
      >
        CZ
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded transition-all ${
          language === 'en'
            ? 'bg-[#5865F2] text-white font-bold shadow-sm'
            : 'text-[#949ba4] hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  )
}
