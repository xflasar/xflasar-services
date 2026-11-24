'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import czData from '@/locales/cz.json'
import enData from '@/locales/en.json'

export type Language = 'cz' | 'en'
export type TranslationData = typeof czData

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (czText: string, enText: string) => string
  dict: TranslationData
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'cz',
  setLanguage: () => {},
  t: (cz) => cz,
  dict: czData,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cz')

  useEffect(() => {
    const saved = localStorage.getItem('xflasar_lang') as Language
    if (saved === 'cz' || saved === 'en') {
      setLanguageState(saved)
    } else if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || ''
      const isCzechOrSlovak = /^cs|^sk/i.test(browserLang)
      setLanguageState(isCzechOrSlovak ? 'cz' : 'en')
    }
  }, [])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    localStorage.setItem('xflasar_lang', newLang)
  }

  const dict = language === 'cz' ? czData : enData

  const t = (czText: string, enText: string) => {
    return language === 'cz' ? czText : enText
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dict }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
