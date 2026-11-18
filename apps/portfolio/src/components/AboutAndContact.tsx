'use client'

import React, { useState } from 'react'
import { SectionContainer } from './SectionContainer'
import { Mail, Github, Instagram, ExternalLink, Tv, Sparkles, Server, Cpu, HeartHandshake, Gamepad2, Check, Copy, FileDown, Layers, Terminal, Wrench } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function AboutAndContact() {
  const { dict } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText('contact@xflasar.dev')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const experienceIcons: Record<string, React.ReactNode> = {
    punoted: <Sparkles className="w-4 h-4 text-[#b59cfc]" />,
    dayz: <Server className="w-4 h-4 text-[#5865F2]" />,
    mentoring: <HeartHandshake className="w-4 h-4 text-[#3ba55d]" />,
    embedded: <Cpu className="w-4 h-4 text-[#b59cfc]" />,
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    backend: <Terminal className="w-3.5 h-3.5 text-[#5865F2]" />,
    hardware: <Cpu className="w-3.5 h-3.5 text-[#b59cfc]" />,
    devops: <Wrench className="w-3.5 h-3.5 text-[#3ba55d]" />,
  }

  return (
    <SectionContainer id="about" className="snap-end pt-20 pb-4">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between py-2">
        
        {/* Section title */}
        <div className="flex-1 flex flex-col justify-center items-center min-h-[70px] max-h-[140px]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f2f3f5] text-center">
            {dict.about.title}
          </h2>
        </div>

        {/* Content grid */}
        <div className="flex-initial w-full my-auto pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
            
            {/* Experience timeline */}
            <div className="lg:col-span-7 bg-[#0e1019] rounded-2xl border border-white/5 p-6 sm:p-7 flex flex-col justify-between">
              <div className="border-b border-white/5 pb-3">
                <span className="text-sm uppercase tracking-widest text-[#b59cfc] font-semibold font-mono">
                  {dict.about.rolesSection}
                </span>
              </div>

              <div className="relative pl-7 py-3 my-auto flex flex-col justify-between gap-6">
                {/* Timeline vertical line */}
                <div className="absolute left-[13px] top-4 bottom-6 w-0.5 bg-gradient-to-b from-[#7053e3]/70 via-[#5865F2]/40 to-[#7053e3]/30" />

                {dict.experiences.map((exp) => (
                  <div key={exp.id} className="relative group transition-all">
                    <div className="absolute -left-[27px] top-1 p-1.5 rounded-full bg-[#0e1019] border border-white/20 group-hover:border-[#7053e3] group-hover:shadow-[0_0_10px_rgba(112,83,227,0.5)] transition-all z-10">
                      {experienceIcons[exp.id] ?? <Sparkles className="w-4 h-4 text-[#b59cfc]" />}
                    </div>

                    <div className="space-y-2 pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <h4 className="text-lg sm:text-xl font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">
                          {exp.role} <span className="text-[#949ba4] font-normal text-base sm:text-lg">• {exp.project}</span>
                        </h4>
                        <span className="text-xs sm:text-sm text-[#949ba4] font-mono whitespace-nowrap bg-[#181b28]/80 px-2.5 py-1 rounded-md border border-white/5 self-start sm:self-auto">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-[#949ba4] leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="text-xs sm:text-sm px-3 py-1 rounded-md bg-[#181b28] text-[#949ba4] font-medium border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: stack, subdomains, contact */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              
              {/* Tech stack */}
              <div className="bg-[#0e1019] rounded-2xl border border-white/5 p-5 space-y-4">
                <div className="border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2 text-sm text-[#b59cfc] font-mono font-semibold uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>{dict.about.techStackTitle}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {(dict.about.techCategories || []).map((cat) => (
                    <div key={cat.id || cat.name} className="space-y-2">
                      <div className="text-xs sm:text-sm font-semibold text-[#f2f3f5] flex items-center gap-2">
                        {categoryIcons[cat.id] ?? <Layers className="w-3.5 h-3.5 text-[#5865F2]" />}
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-[#181b28] text-[#f2f3f5] text-xs font-mono font-medium border border-white/10 hover:border-[#5865F2]/50 hover:bg-[#202436] transition-all shadow-sm"
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
              <div className="bg-[#0e1019] rounded-2xl border border-white/5 p-5 space-y-3">
                <span className="text-sm text-[#b59cfc] font-mono font-semibold uppercase tracking-wider block">
                  {dict.about.subdomainsTitle}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://blog.xflasar.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#06070c] border border-white/5 hover:border-[#b59cfc]/50 hover:bg-[#181b28] transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">✍️ Blog</span>
                      <ExternalLink className="w-4 h-4 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors" />
                    </div>
                    <p className="text-xs text-[#949ba4] mt-1.5 font-medium">Build logs & hardware</p>
                  </a>

                  <a
                    href="https://aki.xflasar.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#06070c] border border-white/5 hover:border-[#7053e3]/50 hover:bg-[#181b28] transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">🐾 Aki</span>
                      <ExternalLink className="w-4 h-4 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors" />
                    </div>
                    <p className="text-xs text-[#949ba4] mt-1.5 font-medium">Aussie media vault</p>
                  </a>

                  <a
                    href="https://gaming.xflasar.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#06070c] border border-white/5 hover:border-[#5865F2]/50 hover:bg-[#181b28] transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#f2f3f5] group-hover:text-[#5865F2] transition-colors">🎮 Gaming</span>
                      <ExternalLink className="w-4 h-4 text-[#949ba4] group-hover:text-[#5865F2] transition-colors" />
                    </div>
                    <p className="text-xs text-[#949ba4] mt-1.5 font-medium">Telemetry & stats</p>
                  </a>

                  <a
                    href="https://anime.xflasar.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#06070c] border border-white/5 hover:border-[#b59cfc]/50 hover:bg-[#181b28] transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#f2f3f5] group-hover:text-[#b59cfc] transition-colors">⛩️ Anime</span>
                      <ExternalLink className="w-4 h-4 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors" />
                    </div>
                    <p className="text-xs text-[#949ba4] mt-1.5 font-medium">Tier list & MAL tracker</p>
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#0e1019] rounded-2xl border border-white/5 p-5 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#3ba55d] text-xs font-mono font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#3ba55d] animate-pulse" />
                    <span>{dict.about.openInquiries}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#f2f3f5]">{dict.about.connectTitle}</h4>
                </div>

                {/* Email copy */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-[#949ba4]">
                    <span>{dict.about.emailLabel}</span>
                    <button
                      onClick={handleCopyEmail}
                      title="Click to copy email"
                      className="group flex items-center gap-1.5 font-mono text-[#f2f3f5] hover:text-[#b59cfc] transition-colors focus:outline-none"
                    >
                      <span className="font-semibold">contact@xflasar.dev</span>
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#3ba55d]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#949ba4] group-hover:text-[#b59cfc] transition-colors opacity-70 group-hover:opacity-100" />
                      )}
                      {copied && <span className="text-[11px] text-[#3ba55d] font-sans font-semibold">Zkopírováno!</span>}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-[#949ba4]">
                    <span>{dict.about.locationLabel}</span>
                    <span className="text-[#f2f3f5] font-medium">{dict.about.locationValue}</span>
                  </div>
                </div>

                {/* Links & CV */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <a
                      href="mailto:contact@xflasar.dev"
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#5865F2]/25"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Email</span>
                    </a>

                    <a
                      href="https://github.com/xflasar"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#181b28] hover:bg-[#232738] text-[#f2f3f5] border border-white/10 text-xs sm:text-sm font-semibold transition-all"
                    >
                      <Github className="w-4 h-4 shrink-0" />
                      <span>GitHub</span>
                    </a>

                    <a
                      href="https://instagram.com/xsupefly"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#181b28] hover:bg-[#232738] text-[#f2f3f5] border border-white/10 hover:border-[#7053e3]/40 text-xs sm:text-sm font-semibold transition-all group"
                    >
                      <Instagram className="w-4 h-4 shrink-0 text-[#b59cfc] group-hover:text-white transition-colors" />
                      <span>Instagram</span>
                    </a>
                  </div>

                  <a
                    href="/cv.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#06070c] hover:bg-[#181b28] text-[#949ba4] hover:text-[#f2f3f5] border border-white/10 text-xs font-medium transition-all group"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#b59cfc] group-hover:scale-110 transition-transform" />
                    <span>{dict.about.downloadCv} (PDF)</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 pb-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#949ba4] shrink-0 mt-auto gap-2">
          <p>© {new Date().getFullYear()} xflasar.dev • {dict.about.footer}</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181b28] border border-white/5 font-mono text-[11px] text-[#949ba4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ba55d] animate-pulse" />
              <span>Ubuntu Server • Docker</span>
            </span>
          </div>
        </div>

      </div>
    </SectionContainer>
  )
}
