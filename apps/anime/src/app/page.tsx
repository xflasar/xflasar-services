'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  Plus,
  Shield,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Languages,
} from 'lucide-react'
import { AnimeEntry, AnimeStatus, AnimeStats } from '@xflasar/types'
import { StatsOverview } from '@/components/StatsOverview'
import { AnimeCard } from '@/components/AnimeCard'
import { AnimeTableView } from '@/components/AnimeTableView'
import { AnimeModal } from '@/components/AnimeModal'
import { AnimeDetailModal } from '@/components/AnimeDetailModal'
import { useLanguage } from '@/lib/language-context'

export default function AnimePage() {
  const { lang, setLang, dict } = useLanguage()
  const [entries, setEntries] = useState<AnimeEntry[]>([])
  const [filter, setFilter] = useState<'ALL' | AnimeStatus>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [sortBy, setSortBy] = useState<'score' | 'title' | 'progress' | 'recent'>('recent')

  // Admin mode defaults to false (viewer mode). Only enabled via Keycloak SSO.
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<string | null>(null)

  // Check Keycloak Auth Session on load
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) {
          setIsAdmin(true)
          setAdminUser(data.username)
        } else {
          setIsAdmin(false)
          setAdminUser(null)
        }
      })
      .catch(() => setIsAdmin(false))
  }, [])

  // Modal State
  const [selectedAnime, setSelectedAnime] = useState<Partial<AnimeEntry> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Detail Modal State
  const [detailAnime, setDetailAnime] = useState<AnimeEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // MAL Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  // Initial fetch from our DB API
  useEffect(() => {
    fetch('/api/anime')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setEntries(json.data)
        }
      })
      .catch((err) => console.warn('Could not load anime from API:', err))
  }, [])

  // Compute stats dynamically
  const stats: AnimeStats = useMemo(() => {
    const totalEntries = entries.length
    const totalEpisodesWatched = entries.reduce((acc, curr) => acc + (curr.episodesWatched || 0), 0)
    const totalHoursWatched = Math.round((totalEpisodesWatched * 24) / 60)

    const scored = entries.filter((e) => typeof e.score === 'number' && e.score > 0)
    const averageScore = scored.length
      ? scored.reduce((acc, curr) => acc + (curr.score || 0), 0) / scored.length
      : 0

    const byStatus: Record<AnimeStatus, number> = {
      WATCHING: 0,
      COMPLETED: 0,
      PLAN_TO_WATCH: 0,
      ON_HOLD: 0,
      DROPPED: 0,
    }

    const genreMap: Record<string, number> = {}

    entries.forEach((e) => {
      if (byStatus[e.status] !== undefined) {
        byStatus[e.status]++
      }
      e.genres.forEach((g) => {
        genreMap[g] = (genreMap[g] || 0) + 1
      })
    })

    const topGenres = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalEntries,
      totalEpisodesWatched,
      totalHoursWatched,
      averageScore,
      byStatus,
      topGenres,
    }
  }, [entries])

  // Filter & Search logic
  const filteredEntries = useMemo(() => {
    let result = entries.filter((e) => {
      const matchesFilter = filter === 'ALL' || e.status === filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.titleEn && e.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesFilter && matchesSearch
    })

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'score') {
        return (b.score || 0) - (a.score || 0)
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'progress') {
        return b.episodesWatched - a.episodesWatched
      }
      return 0 // default 'recent'
    })

    return result
  }, [entries, filter, searchQuery, sortBy])

  // Quick episode increment (+1) with optional MAL push
  const handleQuickIncrement = async (id: string) => {
    const target = entries.find((e) => e.id === id)
    if (!target) return

    const newWatched = target.episodesWatched + 1
    const completed = target.totalEpisodes ? newWatched >= target.totalEpisodes : false
    const newStatus = completed ? 'COMPLETED' : target.status

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            episodesWatched: newWatched,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        }
        return item
      })
    )

    // Push update to MAL API in background if authenticated
    if (target.malId) {
      try {
        await fetch('/api/mal/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            malId: target.malId,
            episodesWatched: newWatched,
            status: newStatus,
          }),
        })
      } catch (err) {
        // Silently keep local state if not connected to MAL yet
      }
    }
  }

  // Edit / Add handler
  const handleOpenAdd = () => {
    setSelectedAnime({
      status: 'WATCHING',
      episodesWatched: 0,
      genres: [],
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (anime: AnimeEntry) => {
    setSelectedAnime(anime)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(dict.confirmDelete)) {
      setEntries((prev) => prev.filter((e) => e.id !== id))
    }
  }

  const handleSaveModal = (savedData: Partial<AnimeEntry>) => {
    if (selectedAnime?.id) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === selectedAnime.id
            ? ({
              ...e,
              ...savedData,
              updatedAt: new Date().toISOString(),
            } as AnimeEntry)
            : e
        )
      )
    } else {
      const newEntry: AnimeEntry = {
        id: String(Date.now()),
        malId: savedData.malId || Math.floor(Math.random() * 90000),
        title: savedData.title || 'Untitled',
        titleEn: savedData.titleEn,
        imageUrl: savedData.imageUrl,
        status: savedData.status || 'WATCHING',
        score: savedData.score,
        episodesWatched: savedData.episodesWatched || 0,
        totalEpisodes: savedData.totalEpisodes,
        personalNotes: savedData.personalNotes,
        genres: savedData.genres || ['Action'],
        syncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
    }
    setIsModalOpen(false)
  }

  const handleSyncMAL = async () => {
    setIsSyncing(true)
    setSyncStatus(dict.sync.connecting)

    try {
      const res = await fetch('/api/mal/sync')
      if (res.status === 401) {
        // Redirect to MAL OAuth Login if not authenticated
        setSyncStatus('Přesměrovávám na přihlášení MyAnimeList...')
        window.location.href = '/api/mal/auth'
        return
      }

      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setEntries(json.data)
        setSyncStatus(dict.sync.success + ` (${json.count} anime)`)
      } else {
        setSyncStatus(json.error || 'Žádná data z MAL')
      }
    } catch (err: any) {
      setSyncStatus('Chyba synchronizace: ' + err.message)
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncStatus(null), 5000)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#05060b] text-[#f2f3f5] flex flex-col justify-between">
      <header className="shrink-0 z-30 bg-[#06070c] border-b border-white/10 px-4 sm:px-8 py-2 space-y-2 shadow-md">
        {/* Brand bar */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Logo & Subdomain branding */}
          <div className="flex items-center gap-3">
            <a
              href="https://xflasar.com"
              className="text-xs font-mono text-[#949ba4] hover:text-[#b59cfc] transition-colors"
            >
              {dict.nav.backToPortfolio}
            </a>
            <span className="text-[#949ba4]">/</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#f2f3f5] tracking-tight flex items-center gap-1.5">
                <span>⛩️</span>
                <span>{dict.nav.title}</span>
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Language Switcher (CZ / EN) */}
            <div className="flex items-center bg-[#0e1019] p-0.5 rounded-md border border-white/10">
              <button
                onClick={() => setLang('cz')}
                className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-all ${lang === 'cz'
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949ba4] hover:text-white'
                  }`}
              >
                CZ
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-all ${lang === 'en'
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949ba4] hover:text-white'
                  }`}
              >
                EN
              </button>
            </div>

            {/* Sync with MAL Button (Admin only) */}
            {isAdmin && (
              <button
                onClick={handleSyncMAL}
                disabled={isSyncing}
                title="Synchronizovat data s MyAnimeList"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#181b28] hover:bg-[#202436] text-[#f2f3f5] border border-white/10 text-xs font-semibold transition-all group"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#b59cfc] ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                />
                <span className="hidden sm:inline">{dict.nav.syncMal}</span>
              </button>
            )}

            {/* Keycloak Auth Button (Login / Logout) */}
            {isAdmin ? (
              <a
                href="/api/auth/keycloak/logout"
                title="Odhlásit se z Keycloak"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border bg-[#1e1f29] border-[#7053e3]/50 text-[#b59cfc] hover:bg-[#282a36] transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#4ade80]" />
                <span className="hidden sm:inline">Admin ({adminUser || 'Admin'})</span>
              </a>
            ) : (
              <a
                href="/api/auth/keycloak/login"
                title="Přihlásit se přes Keycloak"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border bg-[#11131f] hover:bg-[#181b28] border-white/10 text-[#949ba4] hover:text-white transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Login</span>
              </a>
            )}

            {/* Add Anime button */}
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{dict.nav.addAnime}</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact KPI Overview Row */}
        <div className="max-w-7xl mx-auto">
          <StatsOverview stats={stats} />
        </div>

        {/* Toolbar: Status Tabs & Filter / Search directly under KPI */}
        <div className="max-w-7xl mx-auto pt-0.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#0e1019] p-1 rounded-lg border border-white/10 overflow-x-auto gap-1">
            {(
              [
                { id: 'ALL', label: dict.tabs.all },
                { id: 'WATCHING', label: dict.tabs.watching },
                { id: 'COMPLETED', label: dict.tabs.completed },
                { id: 'PLAN_TO_WATCH', label: dict.tabs.planToWatch },
                { id: 'ON_HOLD', label: dict.tabs.onHold },
                { id: 'DROPPED', label: dict.tabs.dropped },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${filter === tab.id
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949ba4] hover:text-[#f2f3f5]'
                  }`}
              >
                {tab.label}
                <span className="ml-1 text-[10px] opacity-75 font-mono">
                  {tab.id === 'ALL'
                    ? entries.length
                    : stats.byStatus[tab.id as AnimeStatus] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search, Sort & View Mode Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={dict.controls.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0e1019] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:border-[#7053e3] transition-colors"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center bg-[#0e1019] rounded-lg border border-white/10 px-2 py-1 text-xs text-[#949ba4]">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-[#b59cfc]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#f2f3f5] focus:outline-none cursor-pointer"
              >
                <option value="recent" className="bg-[#0e1019]">{dict.controls.sortBy.recent}</option>
                <option value="score" className="bg-[#0e1019]">{dict.controls.sortBy.score}</option>
                <option value="title" className="bg-[#0e1019]">{dict.controls.sortBy.title}</option>
                <option value="progress" className="bg-[#0e1019]">{dict.controls.sortBy.progress}</option>
              </select>
            </div>

            {/* Grid vs Table View Toggle */}
            <div className="flex items-center bg-[#0e1019] p-1 rounded-lg border border-white/10 gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-all ${viewMode === 'grid'
                  ? 'bg-[#181b28] text-white shadow-sm'
                  : 'text-[#949ba4] hover:text-white'
                  }`}
                title={dict.controls.gridView}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-all ${viewMode === 'table'
                  ? 'bg-[#181b28] text-white shadow-sm'
                  : 'text-[#949ba4] hover:text-white'
                  }`}
                title={dict.controls.tableView}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sync Status Toast/Banner */}
        {syncStatus && (
          <div className="max-w-7xl mx-auto bg-[#181b28] border border-[#7053e3]/40 py-1 px-3 rounded text-center text-xs font-mono text-[#b59cfc] animate-in slide-in-from-top">
            {syncStatus}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-4">
        <div className="max-w-7xl mx-auto">
          {/* Items Content: Grid or Table View */}
          {filteredEntries.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pb-8">
                {filteredEntries.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    isAdmin={isAdmin}
                    onQuickIncrement={handleQuickIncrement}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onSelect={(a) => {
                      setDetailAnime(a)
                      setIsDetailOpen(true)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="pb-8">
                <AnimeTableView
                  entries={filteredEntries}
                  isAdmin={isAdmin}
                  onQuickIncrement={handleQuickIncrement}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onSelect={(a) => {
                    setDetailAnime(a)
                    setIsDetailOpen(true)
                  }}
                />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-white/10 bg-[#0e1019] text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#b59cfc]" />
              <h3 className="text-base font-bold text-[#f2f3f5]">{dict.empty.title}</h3>
              <p className="text-xs text-[#949ba4]">
                {dict.empty.desc}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="shrink-0 z-30 bg-[#06070c] border-t border-white/10 py-2.5 px-4 sm:px-8 text-center text-xs text-[#949ba4]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {dict.footer.rights}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://myanimelist.net/profile/xSupeFly"
              target="_blank"
              rel="noreferrer"
              className="text-[#949ba4] hover:text-[#b59cfc] transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{dict.footer.malProfile}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Add / Edit Modal */}
      <AnimeModal
        anime={selectedAnime}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
      />

      {/* Detail Modal */}
      <AnimeDetailModal
        anime={detailAnime}
        isOpen={isDetailOpen}
        isAdmin={isAdmin}
        onClose={() => setIsDetailOpen(false)}
        onOpenEdit={(a) => {
          setSelectedAnime(a)
          setIsModalOpen(true)
        }}
      />
    </div>
  )
}
