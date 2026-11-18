'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import czData from '@/locales/cz.json'
import enData from '@/locales/en.json'

export type Language = 'cz' | 'en'

export type TranslationData = typeof czData

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (czText: string, enText: string) => string
  dict: TranslationData
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'cz',
  setLang: () => {},
  t: (cz) => cz,
  dict: czData,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('cz')

  useEffect(() => {
    const saved = localStorage.getItem('xflasar_lang') as Language
    if (saved === 'cz' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('xflasar_lang', newLang)
  }

  const dict = lang === 'cz' ? czData : enData

  const t = (czText: string, enText: string) => {
    return lang === 'cz' ? czText : enText
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t, dict }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
