'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Search, Check, ExternalLink, Loader2 } from 'lucide-react'
import { AnimeEntry, AnimeStatus } from '@xflasar/types'
import { useLanguage } from '@/lib/language-context'
import { searchAnime, AnimeSearchResult } from '@/lib/mal-search'

interface AnimeModalProps {
  anime: Partial<AnimeEntry> | null
  isOpen: boolean
  onClose: () => void
  onSave: (saved: Partial<AnimeEntry>) => void
}

export function AnimeModal({ anime, isOpen, onClose, onSave }: AnimeModalProps) {
  const { dict } = useLanguage()
  const isEditing = Boolean(anime?.id)

  // Search state for adding new anime
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResult, setSelectedResult] = useState<AnimeSearchResult | null>(null)

  // Tracking form fields
  const [status, setStatus] = useState<AnimeStatus>('WATCHING')
  const [score, setScore] = useState<number | undefined>(undefined)
  const [episodesWatched, setEpisodesWatched] = useState<number>(0)
  const [personalNotes, setPersonalNotes] = useState<string>('')

  // Readonly fields
  const [title, setTitle] = useState<string>('')
  const [titleEn, setTitleEn] = useState<string>('')
  const [malId, setMalId] = useState<number | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined)
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    if (anime && isOpen) {
      if (anime.id) {
        // Edit mode: populate existing values
        setTitle(anime.title || '')
        setTitleEn(anime.titleEn || '')
        setMalId(anime.malId)
        setImageUrl(anime.imageUrl || '')
        setTotalEpisodes(anime.totalEpisodes)
        setGenres(anime.genres || [])
        setStatus(anime.status || 'WATCHING')
        setScore(anime.score)
        setEpisodesWatched(anime.episodesWatched || 0)
        setPersonalNotes(anime.personalNotes || '')
        setSelectedResult(null)
      } else {
        // Add mode: reset to search state
        setTitle('')
        setTitleEn('')
        setMalId(undefined)
        setImageUrl('')
        setTotalEpisodes(undefined)
        setGenres([])
        setStatus('WATCHING')
        setScore(undefined)
        setEpisodesWatched(0)
        setPersonalNotes('')
        setSearchQuery('')
        setSearchResults([])
        setSelectedResult(null)
      }
    }
  }, [anime, isOpen])

  // Live search debounced
  useEffect(() => {
    if (isEditing) return
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchAnime(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, isEditing])

  if (!isOpen) return null

  const handleSelectAnime = (res: AnimeSearchResult) => {
    setSelectedResult(res)
    setTitle(res.title)
    setTitleEn(res.titleEn || res.title)
    setMalId(res.malId)
    setImageUrl(res.imageUrl || '')
    setTotalEpisodes(res.totalEpisodes)
    setGenres(res.genres || [])
    setEpisodesWatched(0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEditing && !selectedResult) {
      alert(dict.modal.selectPrompt || 'Prosím vyhledej a vyber anime ze seznamu.')
      return
    }

    onSave({
      title,
      titleEn,
      malId,
      imageUrl,
      totalEpisodes,
      genres,
      status,
      score,
      episodesWatched,
      personalNotes,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0e1019] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0c0e17] shrink-0">
          <h3 className="font-bold text-base text-[#f2f3f5]">
            {isEditing ? dict.modal.editTitle : dict.modal.addTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#949ba4] hover:text-white hover:bg-[#181b28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {!isEditing && (
            <div className="space-y-3 pb-3 border-b border-white/5">
              <label className="block text-xs font-mono uppercase text-[#b59cfc] font-semibold">
                1. {dict.modal.searchAnimeStep || 'Vyhledat anime na MyAnimeList'}
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-[#949ba4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={dict.modal.searchAnimePlaceholder || 'Napiš název anime (např. Naruto, Frieren, Solo Leveling)...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181b28] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:border-[#7053e3]"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-[#b59cfc] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Search Results Dropdown List */}
              {searchResults.length > 0 && !selectedResult && (
                <div className="space-y-1 max-h-48 overflow-y-auto p-1 bg-[#06070c] rounded-lg border border-white/10">
                  {searchResults.map((res) => (
                    <button
                      key={res.malId}
                      type="button"
                      onClick={() => handleSelectAnime(res)}
                      className="w-full p-2 rounded-md hover:bg-[#181b28] transition-colors flex items-center justify-between gap-3 text-left group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {res.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={res.imageUrl}
                            alt={res.title}
                            className="w-8 h-10 object-cover rounded border border-white/10 shrink-0"
                          />
                        )}
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors truncate">
                            {res.title}
                          </div>
                          <div className="text-[10px] text-[#949ba4] font-mono">
                            MAL ID: {res.malId} • {res.totalEpisodes || '?'} ep
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a1a4a] text-[#c084fc] border border-[#a855f7]/30 shrink-0">
                        Vybrat
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {(isEditing || selectedResult) && (
            <div className="p-3 rounded-lg bg-[#06070c] border border-white/10 flex items-center gap-3">
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-12 h-16 object-cover rounded border border-white/10 shrink-0"
                />
              )}
              <div className="flex-1 overflow-hidden space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#f2f3f5] truncate" title={title}>
                    {title}
                  </h4>
                  {malId && (
                    <a
                      href={`https://myanimelist.net/anime/${malId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#949ba4] hover:text-[#5865F2] transition-colors shrink-0"
                      title="Otevřít na MyAnimeList"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {titleEn && titleEn !== title && (
                  <p className="text-[11px] text-[#949ba4] truncate">{titleEn}</p>
                )}

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181b28] text-[#b59cfc] border border-white/5">
                    MAL ID: {malId || 'N/A'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181b28] text-[#949ba4] border border-white/5">
                    Celkem: {totalEpisodes || '?'} ep
                  </span>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedResult(null)
                    setTitle('')
                    setMalId(undefined)
                  }}
                  className="text-[#949ba4] hover:text-white p-1 text-xs"
                  title="Změnit anime"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="space-y-3 pt-1">
            {!isEditing && (
              <label className="block text-xs font-mono uppercase text-[#b59cfc] font-semibold">
                2. {dict.modal.trackingFieldsStep || 'Tvoje sledování & hodnocení'}
              </label>
            )}

            {/* Status & Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#949ba4] mb-1">
                  {dict.modal.statusLabel}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AnimeStatus)}
                  className="w-full bg-[#181b28] border border-white/10 rounded-md px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:border-[#7053e3]"
                >
                  <option value="WATCHING">{dict.tabs.watching}</option>
                  <option value="COMPLETED">{dict.tabs.completed}</option>
                  <option value="PLAN_TO_WATCH">{dict.tabs.planToWatch}</option>
                  <option value="ON_HOLD">{dict.tabs.onHold}</option>
                  <option value="DROPPED">{dict.tabs.dropped}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#949ba4] mb-1">
                  {dict.modal.scoreLabel}
                </label>
                <select
                  value={score ?? ''}
                  onChange={(e) => setScore(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-[#181b28] border border-white/10 rounded-md px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:border-[#7053e3]"
                >
                  <option value="">{dict.modal.unratedOption}</option>
                  <option value="10">(10) Masterpiece</option>
                  <option value="9">(9) Great</option>
                  <option value="8">(8) Very Good</option>
                  <option value="7">(7) Good</option>
                  <option value="6">(6) Fine</option>
                  <option value="5">(5) Average</option>
                  <option value="4">(4) Bad</option>
                  <option value="3">(3) Very Bad</option>
                  <option value="2">(2) Horrible</option>
                  <option value="1">(1) Appalling</option>
                </select>
              </div>
            </div>

            {/* Episodes Watched Progress */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#949ba4] mb-1">
                {dict.modal.episodesWatchedLabel} (max {totalEpisodes || '?'})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={totalEpisodes || undefined}
                  value={episodesWatched}
                  onChange={(e) => setEpisodesWatched(Number(e.target.value) || 0)}
                  className="w-full bg-[#181b28] border border-white/10 rounded-md px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:border-[#7053e3]"
                />
                {totalEpisodes && (
                  <button
                    type="button"
                    onClick={() => setEpisodesWatched(totalEpisodes)}
                    className="px-2.5 py-2 rounded bg-[#181b28] hover:bg-[#202436] text-[11px] font-mono text-[#b59cfc] border border-white/10 whitespace-nowrap"
                    title="Nastavit na všechny"
                  >
                    All ({totalEpisodes})
                  </button>
                )}
              </div>
            </div>

            {/* Personal Notes */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#949ba4] mb-1">
                {dict.modal.notesLabel}
              </label>
              <textarea
                rows={2}
                value={personalNotes}
                placeholder={dict.modal.notesPlaceholder}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="w-full bg-[#181b28] border border-white/10 rounded-md px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:border-[#7053e3]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#181b28] hover:bg-[#202436] text-[#949ba4] hover:text-white text-xs font-semibold transition-colors"
            >
              {dict.modal.cancel}
            </button>
            <button
              type="submit"
              disabled={!isEditing && !selectedResult}
              className="px-4 py-2 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{dict.modal.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
