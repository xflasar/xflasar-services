'use client'

import React, { useState } from 'react'
import { SectionContainer } from './SectionContainer'
import { Mail, Github, Instagram, ExternalLink, Sparkles, Server, HeartHandshake, Check, Copy, FileDown, Layers, Terminal, Wrench, Briefcase } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function AboutAndContact() {
    const { dict } = useLanguage()
    const [copied, setCopied] = useState(false)

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault()
        navigator.clipboard.writeText('contact@xflasar.com')
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const experienceIcons: Record<string, React.ReactNode> = {
        punoted: <Sparkles className="w-4 h-4 text-[#b59cfc]" />,
        dayz: <Server className="w-4 h-4 text-[#5865F2]" />,
        mentoring: <HeartHandshake className="w-4 h-4 text-[#3ba55d]" />,
        internship: <Briefcase className="w-4 h-4 text-[#b59cfc]" />,
    }

    const categoryIcons: Record<string, React.ReactNode> = {
        backend: <Terminal className="w-3.5 h-3.5 text-[#5865F2]" />,
        hardware: <Wrench className="w-3.5 h-3.5 text-[#b59cfc]" />,
        devops: <Layers className="w-3.5 h-3.5 text-[#3ba55d]" />,
    }

    return (
        <SectionContainer id="about" className="justify-center relative !pt-0 !pb-0">
            <div className="space-y-4 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center py-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f2f3f5]">
                        {dict.about.title}
                    </h2>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch w-full">

                        {/* Experience timeline (left column) */}
                        <div className="bg-[#0e1019] rounded-lg border border-white/10 p-3 sm:p-4 flex flex-col justify-between hover:border-[#7053e3]/40 transition-colors">
                            <div className="border-b border-white/5 pb-1.5 mb-1">
                                <span className="text-[11px] uppercase tracking-widest text-[#b59cfc] font-semibold font-mono">
                                    {dict.about.rolesSection}
                                </span>
                            </div>

                            <div className="relative pl-5 py-1 my-auto flex flex-col justify-between gap-2.5">
                                <div className="absolute left-[9px] top-2 bottom-3 w-0.5 bg-gradient-to-b from-[#7053e3]/70 via-[#5865F2]/40 to-[#7053e3]/30" />

                                {dict.experiences.map((exp) => (
                                    <div key={exp.id} className="relative group transition-all">
                                        <div className="absolute -left-[21px] top-0.5 p-0.5 rounded-full bg-[#0e1019] border border-white/20 group-hover:border-[#7053e3] group-hover:shadow-[0_0_8px_rgba(112,83,227,0.5)] transition-all z-10">
                                            {experienceIcons[exp.id] ?? <Briefcase className="w-3 h-3 text-[#b59cfc]" />}
                                        </div>

                                        <div className="space-y-0.5 pl-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <h4 className="text-xs sm:text-sm font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors leading-tight">
                                                    {exp.role} <span className="text-[#949ba4] font-normal text-[11px] sm:text-xs">• {exp.project}</span>
                                                </h4>
                                                <span className="text-[10px] font-mono text-[#949ba4] whitespace-nowrap bg-[#181b28]/80 px-1.5 py-0.5 rounded border border-white/5 self-start sm:self-auto">
                                                    {exp.period}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-[#949ba4] leading-relaxed line-clamp-2">
                                                {exp.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1 pt-0.5">
                                                {exp.tags.map((tag) => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-[#181b28] text-[#949ba4] font-medium border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar: stack, subdomains, contact (right column) */}
                        <div className="flex flex-col justify-between gap-2.5">

                            {/* Tech stack */}
                            <div className="bg-[#0e1019] rounded-lg border border-white/10 p-3 space-y-2 hover:border-[#7053e3]/40 transition-colors">
                                <div className="border-b border-white/5 pb-1">
                                    <div className="flex items-center gap-1 text-[11px] text-[#b59cfc] font-mono font-semibold uppercase tracking-wider">
                                        <Layers className="w-3 h-3" />
                                        <span>{dict.about.techStackTitle}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    {(dict.about.techCategories || []).map((cat) => (
                                        <div key={cat.id || cat.name} className="space-y-0.5">
                                            <div className="text-[11px] font-semibold text-[#f2f3f5] flex items-center gap-1">
                                                {categoryIcons[cat.id] ?? <Layers className="w-3 h-3 text-[#5865F2]" />}
                                                <span>{cat.name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {cat.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-1.5 py-0.5 rounded bg-[#181b28] text-[#f2f3f5] text-[10px] font-mono font-medium border border-white/10 hover:border-[#5865F2]/50 hover:bg-[#202436] transition-all shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subdomains */}
                            <div className="bg-[#0e1019] rounded-lg border border-white/10 p-3 space-y-1.5 hover:border-[#7053e3]/40 transition-colors">
                                <span className="text-[11px] text-[#b59cfc] font-mono font-semibold uppercase tracking-wider block">
                                    {dict.about.subdomainsTitle}
                                </span>

                                <div className="grid grid-cols-2 gap-1.5">
                                    <a
                                        href="https://blog.xflasar.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        title={dict.about.subdomains.blogDesc}
                                        className="group flex flex-col justify-between p-2 rounded bg-[#06070c] border border-white/5 hover:border-[#b59cfc]/50 hover:bg-[#181b28] transition-all shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">✍️ Blog</span>
                                            <ExternalLink className="w-3 h-3 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors shrink-0" />
                                        </div>
                                        <p className="text-[10px] text-[#949ba4] mt-0.5 font-medium leading-snug line-clamp-2">{dict.about.subdomains.blogDesc}</p>
                                    </a>

                                    <a
                                        href="https://aki.xflasar.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        title={dict.about.subdomains.akiDesc}
                                        className="group flex flex-col justify-between p-2 rounded bg-[#06070c] border border-white/5 hover:border-[#7053e3]/50 hover:bg-[#181b28] transition-all shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">🐾 Aki</span>
                                            <ExternalLink className="w-3 h-3 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors shrink-0" />
                                        </div>
                                        <p className="text-[10px] text-[#949ba4] mt-0.5 font-medium leading-snug line-clamp-2">{dict.about.subdomains.akiDesc}</p>
                                    </a>

                                    <a
                                        href="https://gaming.xflasar.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        title={dict.about.subdomains.gamingDesc}
                                        className="group flex flex-col justify-between p-2 rounded bg-[#06070c] border border-white/5 hover:border-[#5865F2]/50 hover:bg-[#181b28] transition-all shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#f2f3f5] group-hover:text-[#5865F2] transition-colors">🎮 Gaming</span>
                                            <ExternalLink className="w-3 h-3 text-[#949ba4] group-hover:text-[#5865F2] transition-colors shrink-0" />
                                        </div>
                                        <p className="text-[10px] text-[#949ba4] mt-0.5 font-medium leading-snug line-clamp-2">{dict.about.subdomains.gamingDesc}</p>
                                    </a>

                                    <a
                                        href="https://anime.xflasar.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        title={dict.about.subdomains.animeDesc}
                                        className="group flex flex-col justify-between p-2 rounded bg-[#06070c] border border-white/5 hover:border-[#b59cfc]/50 hover:bg-[#181b28] transition-all shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">⛩️ Anime</span>
                                            <ExternalLink className="w-3 h-3 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors shrink-0" />
                                        </div>
                                        <p className="text-[10px] text-[#949ba4] mt-0.5 font-medium leading-snug line-clamp-2">{dict.about.subdomains.animeDesc}</p>
                                    </a>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="bg-[#0e1019] rounded-lg border border-white/10 p-3 space-y-2 hover:border-[#7053e3]/40 transition-colors">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 text-[#3ba55d] text-[10px] font-mono font-semibold uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#3ba55d] animate-pulse" />
                                        <span>{dict.about.openInquiries}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#f2f3f5]">{dict.about.connectTitle}</h4>
                                </div>

                                {/* Email copy */}
                                <div className="flex flex-col gap-1 pt-1 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[11px] text-[#949ba4]">
                                        <span>{dict.about.emailLabel}</span>
                                        <button
                                            onClick={handleCopyEmail}
                                            title="Click to copy email"
                                            className="group flex items-center gap-1 font-mono text-[11px] text-[#f2f3f5] hover:text-[#b59cfc] transition-colors focus:outline-none"
                                        >
                                            <span className="font-semibold">xflasar@gmail.com</span>
                                            {copied ? (
                                                <Check className="w-3 h-3 text-[#3ba55d]" />
                                            ) : (
                                                <Copy className="w-3 h-3 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors opacity-70 group-hover:opacity-100" />
                                            )}
                                            {copied && <span className="text-[10px] text-[#3ba55d] font-sans font-semibold">Zkopírováno!</span>}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-[#949ba4]">
                                        <span>{dict.about.locationLabel}</span>
                                        <span className="text-[#f2f3f5] font-medium text-[11px]">{dict.about.locationValue}</span>
                                    </div>
                                </div>

                                {/* Links & CV */}
                                <div className="space-y-1.5 pt-0.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                        <a
                                            href="mailto:xflasar@gmail.com"
                                            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-[11px] font-semibold transition-all shadow-sm"
                                        >
                                            <Mail className="w-3 h-3 shrink-0" />
                                            <span>Email</span>
                                        </a>

                                        <a
                                            href="https://github.com/xflasar"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#181b28] hover:bg-[#232738] text-[#f2f3f5] border border-white/10 text-[11px] font-semibold transition-all"
                                        >
                                            <Github className="w-3 h-3 shrink-0" />
                                            <span>GitHub</span>
                                        </a>

                                        <a
                                            href="https://instagram.com/xsupefly"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#181b28] hover:bg-[#232738] text-[#f2f3f5] border border-white/10 hover:border-[#7053e3]/40 text-[11px] font-semibold transition-all group"
                                        >
                                            <Instagram className="w-3 h-3 shrink-0 text-[#b59cfc] group-hover:text-white transition-colors" />
                                            <span>Instagram</span>
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        disabled
                                        title={dict.about.cvPreparing || 'Připravuje se...'}
                                        className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#06070c] text-[#949ba4] border border-white/5 text-[11px] font-medium cursor-not-allowed opacity-75"
                                    >
                                        <FileDown className="w-3 h-3 text-[#b59cfc]/60" />
                                        <span>{dict.about.downloadCv} (PDF)</span>
                                        <span className="text-[10px] text-[#b59cfc] font-mono bg-[#181b28] px-1.5 py-0.5 rounded border border-white/5 ml-1">
                                            {dict.about.cvPreparing}
                                        </span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-3 left-0 right-0 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#949ba4] gap-1">
                    <p>© {new Date().getFullYear()} xflasar.com • {dict.about.footer}</p>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#181b28] border border-white/5 font-mono text-[10px] text-[#949ba4]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3ba55d] animate-pulse" />
                            <span>Server • Docker</span>
                        </span>
                    </div>
                </div>
            </div>
        </SectionContainer >
    )
}
