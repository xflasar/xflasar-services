'use client'

import React, { useState, useEffect } from 'react'
import type { Project, ProjectCategory } from '@xflasar/types'
import { SectionContainer } from './SectionContainer'
import { useLanguage } from '@/lib/language-context'
import { ExternalLink, Github, X, ZoomIn, ChevronLeft, ChevronRight, Images, Code2, ImageOff, Cpu, ChevronDown } from 'lucide-react'

// Helper function to normalize repoUrls
function getRepoList(repoUrl: Project['repoUrl']): { name: string; url: string }[] {
    if (!repoUrl) return []
    if (typeof repoUrl === 'string') return [{ name: 'Code', url: repoUrl }]
    if (Array.isArray(repoUrl)) {
        return repoUrl.map((item, idx) => {
            if (typeof item === 'string') {
                const parts = item.split('/')
                const name = parts[parts.length - 1] || `Repo ${idx + 1}`
                return { name, url: item }
            }
            return item
        })
    }
    return []
}

interface ProjectsShowcaseProps {
    projects: Project[]
}

interface ActiveGalleryState {
    title: string
    images: string[]
    currentIndex: number
}

// Subcomponent for project card image with auto-slideshow when 2+ images exist
function ProjectCardMedia({
    project,
    getStatusBadge,
    onOpenGallery,
}: {
    project: Project
    getStatusBadge: (status: Project['status']) => React.ReactNode
    onOpenGallery: (project: Project, startIndex?: number) => void
}) {
    const images = project.gallery && project.gallery.length > 0
        ? project.gallery
        : (project.imageUrl ? [project.imageUrl] : [])

    const [slideIndex, setSlideIndex] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % images.length)
        }, 3200)
        return () => clearInterval(interval)
    }, [images.length])

    return (
        <button
            onClick={() => onOpenGallery(project, slideIndex)}
            className="relative w-full h-32 overflow-hidden border-b border-white/5 cursor-zoom-in text-left focus:outline-none block bg-[#06070c]"
            aria-label={`Enlarge photo gallery of ${project.title}`}
        >
            {/* Ambient blur background for smooth filling */}
            {images.map((imgUrl, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={`blur-${imgUrl}`}
                    src={imgUrl}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-20 transition-opacity duration-700 ease-in-out ${idx === slideIndex ? 'opacity-20' : 'opacity-0 pointer-events-none'
                        }`}
                />
            ))}

            {/* Foreground image transition */}
            {images.map((imgUrl, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={imgUrl}
                    src={imgUrl}
                    alt={`${project.title} slide ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${idx === slideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                />
            ))}

            {/* Status badge in top right */}
            <div className="absolute top-2 right-2 z-10">
                {getStatusBadge(project.status)}
            </div>

            {/* Gallery count indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-[#06070c]/85 text-[11px] font-semibold text-[#f2f3f5] border border-white/20 shadow-md flex items-center gap-1.5 font-mono z-10 backdrop-blur-sm">
                    <Images className="w-3 h-3 text-[#b59cfc]" />
                    <span>{slideIndex + 1}/{images.length}</span>
                </div>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-1.5 right-1.5 p-1 rounded bg-[#06070c]/85 text-[#f2f3f5] border border-white/20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                <ZoomIn className="w-3 h-3" />
            </div>
        </button>
    )
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
    const { dict, t } = useLanguage()

    const punoted = projects.find((p) => p.title.toLowerCase().includes('punoted'))
    const otherProjects = projects.filter((p) => !p.title.toLowerCase().includes('punoted'))

    const [filter, setFilter] = useState<'ALL' | ProjectCategory>('ALL')
    const [galleryState, setGalleryState] = useState<ActiveGalleryState | null>(null)
    const [repoDropdownOpen, setRepoDropdownOpen] = useState(false)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const punotedGallery = punoted?.gallery && punoted.gallery.length > 0 ? punoted.gallery : (punoted?.imageUrl ? [punoted.imageUrl] : [])

    useEffect(() => {
        if (punotedGallery.length <= 1) return
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % punotedGallery.length)
        }, 3500)
        return () => clearInterval(interval)
    }, [punotedGallery.length])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setRepoDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

    // Status badge styling with i18n
    const getStatusBadge = (status: Project['status']) => {
        const s = dict.projects.statuses || {
            active: 'active',
            inBeta: 'in beta',
            inDev: 'in dev',
            prototype: 'prototype',
            inConcept: 'in concept',
            completed: 'obhájeno'
        }

        switch (status) {
            case 'ACTIVE':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e4620] text-[#4ade80] border border-[#22c55e]/40 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.active}</span>
            case 'IN_BETA':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#2a1a4a] text-[#c084fc] border border-[#a855f7]/40 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.inBeta}</span>
            case 'IN_DEV':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#3b1d60] text-[#c084fc] border border-[#a855f7]/40 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.inDev}</span>
            case 'PROTOTYPE':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#583307] text-[#fbbf24] border border-[#f59e0b]/40 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.prototype}</span>
            case 'IN_CONCEPT':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e2a5e] text-[#60a5fa] border border-[#3b82f6]/40 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.inConcept}</span>
            case 'COMPLETED':
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#181b28] text-[#e2e8f0] border border-white/20 font-semibold tracking-wide uppercase font-mono shadow-sm">{s.completed}</span>
            default:
                return <span className="text-[11px] px-2 py-0.5 rounded bg-[#181b28] text-[#e2e8f0] border border-white/20 font-semibold tracking-wide uppercase font-mono shadow-sm">{String(status).toLowerCase().replace('_', ' ')}</span>
        }
    }

    return (
        <SectionContainer
            id="projects"
            nextSectionId="about"
            nextLabel={dict.nav.about}
        >
            <div className="space-y-4 w-full flex-1 flex flex-col justify-center py-1">
                {/* Section Header & Category Filter */}
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-2.5 border-b border-white/5 pb-3 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f2f3f5]">
                            {dict.projects.title}
                        </h2>
                    </div>

                    <div className="flex bg-[#0e1019] p-1 rounded-lg border border-white/10 mx-auto md:mx-0 flex-wrap justify-center gap-1">
                        {(['ALL', 'SOFTWARE', 'HARDWARE', 'ACADEMIC'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === cat
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
                    <div className="relative rounded-xl border border-[#7053e3]/40 bg-[#0c0e17] p-3 sm:p-5 shadow-xl overflow-hidden mb-3">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7053e3]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-stretch">
                            {/* Project info: centered only on mobile (<md), left-aligned on tablet and desktop (md+) */}
                            <div className="lg:col-span-7 flex flex-col justify-between py-0.5 items-center md:items-start text-center md:text-left">
                                <div className="space-y-2 flex flex-col items-center md:items-start w-full">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#2a1a4a] text-[#c084fc] border border-[#a855f7]/40 shadow-sm font-mono uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                                            {dict.projects.stageBadge}
                                        </span>
                                        <span className="text-xs text-[#949ba4] font-mono">{dict.projects.communityPlatform}</span>
                                    </div>

                                    {/* Title & Action Buttons Header */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#f2f3f5] tracking-tight">
                                            PUNoted
                                        </h3>

                                        {/* Action Buttons: Unified grid on mobile, inline on desktop */}
                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto justify-center md:justify-start">
                                            {punoted.liveUrl && (
                                                <a
                                                    href={punoted.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                                                >
                                                    <span>Live App</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}

                                            {/* Repositories Dropdown / Link */}
                                            {(() => {
                                                const repos = getRepoList(punoted.repoUrl)
                                                if (repos.length === 0) return null
                                                if (repos.length === 1) {
                                                    return (
                                                        <a
                                                            href={repos[0].url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-[#181b28] hover:bg-[#232738] border border-white/10 text-[#f2f3f5] text-xs sm:text-sm font-medium transition-all"
                                                        >
                                                            <Github className="w-4 h-4 text-[#b59cfc]" />
                                                            <span>Code</span>
                                                        </a>
                                                    )
                                                }
                                                return (
                                                    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setRepoDropdownOpen((prev) => !prev)}
                                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md bg-[#181b28] hover:bg-[#232738] border border-white/10 text-[#f2f3f5] text-xs sm:text-sm font-medium transition-all group"
                                                        >
                                                            <Github className="w-4 h-4 text-[#b59cfc]" />
                                                            <span>Code</span>
                                                            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-xs font-mono font-bold text-[#b59cfc]">
                                                                {repos.length}
                                                            </span>
                                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${repoDropdownOpen ? 'rotate-180 text-white' : 'text-[#949ba4]'}`} />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {repoDropdownOpen && (
                                                            <div className="absolute left-0 right-0 sm:right-auto sm:left-0 mt-2 sm:w-48 py-1 rounded-md bg-[#11131f] border border-white/10 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                                                                {repos.map((repo) => (
                                                                    <a
                                                                        key={repo.url}
                                                                        href={repo.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        onClick={() => setRepoDropdownOpen(false)}
                                                                        className="flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-[#f2f3f5] hover:bg-[#5865F2]/20 hover:text-white transition-colors group"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Github className="w-3.5 h-3.5 text-[#b59cfc] group-hover:text-white transition-colors" />
                                                                            <span className="font-medium">{repo.name}</span>
                                                                        </div>
                                                                        <ExternalLink className="w-3 h-3 text-[#949ba4] group-hover:text-white transition-colors opacity-70" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </div>

                                    <p className="text-[#949ba4] text-xs sm:text-sm leading-relaxed max-w-xl">
                                        {t(
                                            'Herní analytická platforma pro komunitu hráčů. Uživatelé posílají data ze hry přes browser extension, backend data zpracovává, vizualizuje v přehledech a nabízí API pro nástroje třetích stran.',
                                            'Collaborative gaming analytics platform. Ingests player telemetry via browser extension, computes retention statistics, and exposes public API endpoints.'
                                        )}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-3">
                                    {punoted.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-0.5 text-xs font-medium rounded bg-[#181b28] border border-white/5 text-[#b59cfc]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Project Preview Image & Metrics (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col gap-2.5">
                                {punotedGallery.length > 0 && (
                                    <button
                                        onClick={() => openGallery(punoted, currentSlideIndex)}
                                        className="relative w-full aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in text-left focus:outline-none bg-[#0a0c14] flex items-center justify-center"
                                        aria-label={`Enlarge photos of ${punoted.title}`}
                                    >
                                        {/* Blurred backdrop for perfect ambient letterboxing */}
                                        {punotedGallery.map((imgUrl, idx) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                key={`blur-${imgUrl}`}
                                                src={imgUrl}
                                                alt=""
                                                aria-hidden="true"
                                                className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-30 transition-opacity duration-700 ease-in-out ${idx === currentSlideIndex ? 'opacity-30' : 'opacity-0 pointer-events-none'
                                                    }`}
                                            />
                                        ))}

                                        {/* Crisp foreground image preserving natural aspect ratio */}
                                        {punotedGallery.map((imgUrl, idx) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                key={imgUrl}
                                                src={imgUrl}
                                                alt={`${punoted.title} slide ${idx + 1}`}
                                                className={`absolute inset-0 w-full h-full object-contain p-1.5 transition-all duration-700 ease-in-out ${idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                                    }`}
                                            />
                                        ))}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#06070c]/50 via-transparent to-transparent pointer-events-none" />

                                        {/* Gallery Count Hint Badge */}
                                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-[#06070c]/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f2f3f5] shadow-lg flex items-center gap-1.5 z-10">
                                            <Images className="w-3.5 h-3.5 text-[#b59cfc]" />
                                            <span>{punotedGallery.length} photos</span>
                                        </div>

                                        {/* Progress Indicator Dots */}
                                        {punotedGallery.length > 1 && (
                                            <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 z-10">
                                                {punotedGallery.map((_, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlideIndex
                                                            ? 'w-5 bg-[#b59cfc]'
                                                            : 'w-1.5 bg-white/30'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Zoom Hint Indicator */}
                                        <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-[#06070c]/80 backdrop-blur-md text-[#f2f3f5] border border-white/20 shadow-md flex items-center gap-1 text-xs z-10">
                                            <ZoomIn className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Gallery</span>
                                        </div>
                                    </button>
                                )}

                                {/* Metrics */}
                                <div className="flex gap-3 bg-[#06070c]/80 border border-white/10 rounded-lg p-3 backdrop-blur-sm">
                                    <div className="flex-1 text-center">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-[#b59cfc]">
                                            {punoted.userCount ?? 60}+
                                        </span>
                                        <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#949ba4] mt-0.5 font-medium">
                                            {dict.projects.activeUsers}
                                        </p>
                                    </div>

                                    <div className="flex-1 border-l border-white/10 text-center">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-[#5865F2]">
                                            {punoted.registeredCount ?? 140}+
                                        </span>
                                        <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#949ba4] mt-0.5 font-medium">
                                            {dict.projects.registeredAccounts}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project Cards Grid OR Empty State */}
                {filteredOthers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {filteredOthers.map((project) => (
                            <div
                                key={project.id}
                                className="flex flex-col justify-between bg-[#0e1019] rounded-lg border border-white/10 overflow-hidden hover:border-[#7053e3]/50 hover:bg-[#131622] transition-all duration-200 group"
                            >
                                {/* Image OR No-Image Fallback Card */}
                                {project.imageUrl || (project.gallery && project.gallery.length > 0) ? (
                                    <ProjectCardMedia
                                        project={project}
                                        getStatusBadge={getStatusBadge}
                                        onOpenGallery={openGallery}
                                    />
                                ) : project.category === 'ACADEMIC' ? (
                                    <div className="w-full h-28 bg-[#06070c] border-b border-white/5 p-3 flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-[#b59cfc] font-mono">
                                                <Code2 className="w-4 h-4 text-[#5865F2]" />
                                                <span>{dict.projects.academicRepo}</span>
                                            </div>
                                            {getStatusBadge(project.status)}
                                        </div>
                                        <div className="text-[11px] font-mono text-[#949ba4] bg-[#181b28] px-2 py-1 rounded border border-white/5 truncate">
                                            $ git clone {project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-28 bg-[#06070c] border-b border-white/5 flex flex-col items-center justify-center p-3 overflow-hidden select-none">
                                        {/* Subtle Discord midnight grid background */}
                                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7053e3_1px,transparent_1px)] [background-size:12px_12px]" />

                                        {/* Status badge in top right */}
                                        <div className="absolute top-2 right-2 z-10">
                                            {getStatusBadge(project.status)}
                                        </div>

                                        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 text-center">
                                            <div className="p-2 rounded-xl bg-[#181b28] border border-white/10 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors shadow-inner">
                                                {project.category === 'HARDWARE' ? (
                                                    <Cpu className="w-5 h-5 text-[#b59cfc]" />
                                                ) : (
                                                    <ImageOff className="w-5 h-5 text-[#949ba4]" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-mono text-[#949ba4] uppercase tracking-wider font-semibold">
                                                {dict.projects.noPreview}
                                            </span>
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
                                                {getRepoList(project.repoUrl).map((repo) => (
                                                    <a
                                                        key={repo.url}
                                                        href={repo.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title={repo.name ? `Code: ${repo.name}` : 'Source Code'}
                                                        className="text-[#949ba4] hover:text-white transition-colors"
                                                    >
                                                        <Github className="w-3.5 h-3.5" />
                                                    </a>
                                                ))}
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
                                            {t(project.description, project.descriptionEn || project.description)}
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
                ) : !(punoted && (filter === 'ALL' || filter === 'SOFTWARE')) ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-[#0e1019] border border-white/10 text-center my-4 space-y-2">
                        <div className="p-3 rounded-xl bg-[#181b28] border border-white/10 text-[#949ba4]">
                            <ImageOff className="w-6 h-6 text-[#b59cfc]" />
                        </div>
                        <p className="text-sm font-semibold text-[#f2f3f5]">
                            {dict.projects.noProjects || 'No projects found'}
                        </p>
                        <p className="text-xs text-[#949ba4]">
                            {t('V této kategorii zatím nejsou žádné projekty.', 'There are currently no projects listed under this category.')}
                        </p>
                    </div>
                ) : null}
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
                                        className={`relative w-12 h-10 rounded-lg overflow-hidden border transition-all ${galleryState.currentIndex === idx
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
