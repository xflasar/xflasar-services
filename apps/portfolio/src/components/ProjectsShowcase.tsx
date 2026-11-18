'use client'

import React, { useState, useEffect } from 'react'
import type { Project, ProjectCategory } from '@xflasar/types'
import { SectionContainer } from './SectionContainer'
import { useLanguage } from '@/lib/language-context'
import { ExternalLink, Github, X, ZoomIn, ChevronLeft, ChevronRight, Images, Code2 } from 'lucide-react'

interface ProjectsShowcaseProps {
  projects: Project[]
}

interface ActiveGalleryState {
  title: string
  images: string[]
  currentIndex: number
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const { dict, t } = useLanguage()

  const punoted = projects.find((p) => p.title.toLowerCase().includes('punoted'))
  const otherProjects = projects.filter((p) => !p.title.toLowerCase().includes('punoted'))

  const [filter, setFilter] = useState<'ALL' | ProjectCategory>('ALL')
  const [galleryState, setGalleryState] = useState<ActiveGalleryState | null>(null)

  const openGallery = (project: Project, startIndex = 0) => {
    const images = project.gallery && project.gallery.length > 0 
      ? project.gallery 
      : (project.imageUrl ? [project.imageUrl] : [])
    
    if (images.length === 0) return

    setGalleryState({
      title: project.title,
      images,
      currentIndex: startIndex,
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryState) return
      if (e.key === 'Escape') {
        setGalleryState(null)
      } else if (e.key === 'ArrowLeft') {
        setGalleryState((prev) =>
          prev ? { ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length } : null
        )
      } else if (e.key === 'ArrowRight') {
        setGalleryState((prev) =>
          prev ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length } : null
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryState])

  const filteredOthers = otherProjects.filter((p) => {
    if (filter === 'ALL') return true
    return p.category === filter
  })

  // Status badge styling
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold shadow-md shadow-black/60">active</span>
      case 'IN_DEVELOPMENT':
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#3b1d60] text-[#c084fc] border border-[#a855f7]/40 font-semibold shadow-md shadow-black/60">in dev</span>
      case 'PROTOTYPE':
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold shadow-md shadow-black/60">prototype</span>
      case 'CONCEPT':
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold shadow-md shadow-black/60">concept</span>
      case 'COMPLETED':
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#181b28] text-[#e2e8f0] border border-white/20 font-semibold shadow-md shadow-black/60">completed</span>
      default:
        return <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#181b28] text-[#e2e8f0] border border-white/20 font-semibold shadow-md shadow-black/60">{status.toLowerCase()}</span>
    }
  }

  return (
    <SectionContainer
      id="projects"
      nextSectionId="about"
      nextLabel={dict.nav.about}
    >
      <div className="space-y-6 w-full">
        {/* Section Header & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f2f3f5]">
              {dict.projects.title}
            </h2>
          </div>

          <div className="flex bg-[#0e1019] p-1.5 rounded-xl border border-white/5 self-start sm:self-auto flex-wrap gap-1">
            {(['ALL', 'SOFTWARE', 'HARDWARE', 'ACADEMIC'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-[#5865F2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-[#f2f3f5]'
                }`}
              >
                {cat === 'ALL'
                  ? dict.projects.filterAll
                  : cat === 'SOFTWARE'
                  ? dict.projects.filterSoftware
                  : cat === 'HARDWARE'
                  ? dict.projects.filterHardware
                  : dict.projects.filterAcademic}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight: PUNoted */}
        {punoted && (filter === 'ALL' || filter === 'SOFTWARE') && (
          <div className="relative rounded-2xl border border-[#7053e3]/30 bg-gradient-to-b from-[#0e1019] to-[#06070c] p-6 sm:p-7 overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7053e3]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Project info */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#2a1a4a] text-[#c084fc] border border-[#a855f7]/40 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse" />
                    {dict.projects.stageBadge}
                  </span>
                  <span className="text-xs sm:text-sm text-[#949ba4] font-mono">{dict.projects.communityPlatform}</span>
                </div>

                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#f2f3f5] tracking-tight">
                    PUNoted
                  </h3>
                  {punoted.liveUrl && (
                    <a
                      href={punoted.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/40 text-[#5865F2] hover:text-white text-xs sm:text-sm font-semibold transition-all"
                    >
                      <span>Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {punoted.repoUrl && (
                    <a
                      href={punoted.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181b28] hover:bg-[#232738] border border-white/10 text-[#949ba4] hover:text-[#f2f3f5] text-xs transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <p className="text-[#949ba4] text-base leading-relaxed max-w-xl">
                  {t(
                    'Herní analytická platforma pro komunitu hráčů. Uživatelé posílají data ze hry přes browser extension, backend data zpracovává, vizualizuje v přehledech a nabízí API pro nástroje třetích stran.',
                    'Collaborative gaming analytics platform. Ingests player telemetry via browser extension, computes retention statistics, and exposes public API endpoints.'
                  )}
                </p>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  {punoted.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-xs sm:text-sm font-medium rounded-md bg-[#181b28] border border-white/5 text-[#b59cfc]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Preview Image & Metrics (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {punoted.imageUrl && (
                  <button
                    onClick={() => openGallery(punoted)}
                    className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in text-left focus:outline-none"
                    aria-label={`Enlarge photos of ${punoted.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={punoted.imageUrl}
                      alt={punoted.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06070c] via-transparent to-transparent opacity-60" />
                    
                    {/* Gallery Count Hint Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-[#06070c] border border-white/20 text-xs font-semibold text-[#f2f3f5] shadow-lg flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-[#b59cfc]" />
                      <span>{punoted.gallery?.length || 1} photos</span>
                    </div>

                    {/* Zoom Hint Indicator */}
                    <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-[#06070c] text-[#f2f3f5] border border-white/20 shadow-md flex items-center gap-1 text-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Gallery</span>
                    </div>
                  </button>
                )}

                {/* Metrics */}
                <div className="flex gap-3 bg-[#06070c]/80 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
                  <div className="flex-1 text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#b59cfc]">
                      {punoted.userCount ?? 60}+
                    </span>
                    <p className="text-xs uppercase tracking-wider text-[#949ba4] mt-0.5 font-medium">
                      {dict.projects.activeUsers}
                    </p>
                  </div>

                  <div className="flex-1 border-l border-white/10 text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#5865F2]">
                      {punoted.registeredCount ?? 140}+
                    </span>
                    <p className="text-xs uppercase tracking-wider text-[#949ba4] mt-0.5 font-medium">
                      {dict.projects.registeredAccounts}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOthers.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between bg-[#0e1019] rounded-xl border border-white/5 overflow-hidden hover:border-[#7053e3]/40 hover:bg-[#181b28] transition-all duration-200 group"
            >
              {/* Image OR Code-First Header for Academic/Code Projects */}
              {project.imageUrl ? (
                <button
                  onClick={() => openGallery(project)}
                  className="relative w-full h-28 overflow-hidden border-b border-white/5 cursor-zoom-in text-left focus:outline-none block"
                  aria-label={`Enlarge photo gallery of ${project.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Solid high-contrast badge in top right */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(project.status)}
                  </div>

                  {project.gallery && project.gallery.length > 1 && (
                    <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-[#06070c] text-[11px] font-semibold text-[#f2f3f5] border border-white/20 shadow-md flex items-center gap-1 font-mono">
                      <Images className="w-3 h-3 text-[#b59cfc]" />
                      <span>{project.gallery.length}</span>
                    </div>
                  )}

                  <div className="absolute bottom-1.5 right-1.5 p-1 rounded bg-[#06070c] text-[#f2f3f5] border border-white/20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3" />
                  </div>
                </button>
              ) : (
                <div className="w-full h-24 bg-[#06070c] border-b border-white/5 p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#b59cfc] font-mono">
                      <Code2 className="w-4 h-4 text-[#5865F2]" />
                      <span>Academic Repo</span>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="text-[11px] font-mono text-[#949ba4] bg-[#181b28] px-2 py-1 rounded border border-white/5 truncate">
                    $ git clone {project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#b59cfc] font-semibold font-mono">
                      {project.category}
                    </span>
                    {/* Live & Repo Link Icons */}
                    <div className="flex items-center gap-1.5">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Source Code"
                          className="text-[#949ba4] hover:text-white transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          className="text-[#949ba4] hover:text-[#5865F2] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#f2f3f5] leading-snug">{project.title}</h4>
                  <p className="text-[#949ba4] text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#181b28] text-[#949ba4]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Multi-Image Gallery Carousel Modal */}
      {galleryState && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setGalleryState(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0e1019] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#06070c]/70">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-[#f2f3f5]">{galleryState.title}</span>
                {galleryState.images.length > 1 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#181b28] border border-white/10 text-xs font-mono text-[#b59cfc]">
                    {galleryState.currentIndex + 1} / {galleryState.images.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setGalleryState(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-[#181b28] hover:bg-[#232738] text-[#949ba4] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Carousel Container */}
            <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-[#05060b] p-3 sm:p-4 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={galleryState.currentIndex}
                src={galleryState.images[galleryState.currentIndex]}
                alt={`${galleryState.title} - photo ${galleryState.currentIndex + 1}`}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg select-none transition-all duration-300"
              />

              {galleryState.images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setGalleryState((prev) =>
                      prev
                        ? { ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length }
                        : null
                    )
                  }}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0e1019]/80 hover:bg-[#181b28] text-[#f2f3f5] border border-white/15 backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {galleryState.images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setGalleryState((prev) =>
                      prev
                        ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }
                        : null
                    )
                  }}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0e1019]/80 hover:bg-[#181b28] text-[#f2f3f5] border border-white/15 backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Footer Thumbnails */}
            {galleryState.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#06070c]/80 border-t border-white/10 overflow-x-auto">
                {galleryState.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryState((prev) => prev ? { ...prev, currentIndex: idx } : null)}
                    className={`relative w-12 h-10 rounded-lg overflow-hidden border transition-all ${
                      galleryState.currentIndex === idx
                        ? 'border-[#5865F2] ring-2 ring-[#5865F2]/40 scale-105'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
