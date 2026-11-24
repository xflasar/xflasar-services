'use client'

import React, { useState } from 'react'
import { Monitor, Laptop, Cpu, HardDrive, MemoryStick, Headphones } from 'lucide-react'
import { HardwareSpec } from '@/types'
import { useLanguage } from '@/lib/language-context'

interface BattlestationProps {
  specs?: HardwareSpec[]
}

const DEFAULT_SPECS: HardwareSpec[] = [
  {
    category: 'DESKTOP',
    name: 'Custom Gaming Rig (Main PC)',
    cpu: 'Intel Core i9-9900K (8 cores / 16 threads, up to 5.0 GHz)',
    gpu: 'NVIDIA GeForce RTX 2080 Ti 11GB',
    ram: '32GB DDR4',
    storage: '1TB SSD + 2TB HDD',
    peripherals: {
      monitors: '34" iiyama G-Master 144Hz Ultrawide',
      mouse: 'SteelSeries Sensei Ten',
      keyboard: 'HyperX Mechanical Keyboard',
      headset: 'Logitech G PRO X Gaming Headset',
    },
  },
  {
    category: 'LAPTOP',
    name: 'Lenovo Legion 5',
    cpu: 'AMD Ryzen AI 9 465 (up to 5.0 GHz, AI NPU)',
    gpu: 'NVIDIA GeForce RTX 5060 Laptop GPU',
    ram: '32GB RAM',
    storage: '1TB NVMe SSD',
  },
]

export function Battlestation({ specs = DEFAULT_SPECS }: BattlestationProps) {
  const { dict } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<'DESKTOP' | 'LAPTOP'>('DESKTOP')

  const currentSpec = specs.find((s) => s.category === activeCategory) || specs[0]

  return (
    <div className="bg-[#0e1019] rounded-xl border border-white/10 p-4 sm:p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-[#f2f3f5]">{dict.battlestation.title}</h3>
          <p className="text-sm text-[#949ba4]">{dict.battlestation.subtitle}</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#06070c] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveCategory('DESKTOP')}
            className={`px-3.5 py-1.5 rounded text-xs sm:text-sm font-semibold font-mono flex items-center gap-2 transition-all ${
              activeCategory === 'DESKTOP'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>{dict.battlestation.desktop}</span>
          </button>
          <button
            onClick={() => setActiveCategory('LAPTOP')}
            className={`px-3.5 py-1.5 rounded text-xs sm:text-sm font-semibold font-mono flex items-center gap-2 transition-all ${
              activeCategory === 'LAPTOP'
                ? 'bg-[#7053e3] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>{dict.battlestation.laptop}</span>
          </button>
        </div>
      </div>

      {/* Hardware Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#06070c] border border-white/5 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#b59cfc] font-mono">
            <Cpu className="w-4 h-4 text-[#5865F2]" />
            <span>{dict.battlestation.specs.cpu}</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#f2f3f5]">{currentSpec.cpu}</p>
        </div>

        <div className="bg-[#06070c] border border-white/5 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#b59cfc] font-mono">
            <Monitor className="w-4 h-4 text-[#7053e3]" />
            <span>{dict.battlestation.specs.gpu}</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#f2f3f5]">{currentSpec.gpu}</p>
        </div>

        <div className="bg-[#06070c] border border-white/5 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#b59cfc] font-mono">
            <MemoryStick className="w-4 h-4 text-[#3ba55d]" />
            <span>{dict.battlestation.specs.ram}</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#f2f3f5]">{currentSpec.ram}</p>
        </div>

        <div className="bg-[#06070c] border border-white/5 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#b59cfc] font-mono">
            <HardDrive className="w-4 h-4 text-[#fbbf24]" />
            <span>{dict.battlestation.specs.storage}</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#f2f3f5]">{currentSpec.storage}</p>
        </div>
      </div>

      {/* Peripherals Row (If Desktop) */}
      {currentSpec.peripherals && (
        <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#949ba4] font-mono">
          <span className="text-[#b59cfc] font-semibold">{dict.battlestation.specs.peripherals}:</span>
          {Object.entries(currentSpec.peripherals).map(([key, val]) => (
            <span key={key} className="px-2.5 py-1 rounded bg-[#181b28] border border-white/5 text-[#f2f3f5]">
              {val}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
