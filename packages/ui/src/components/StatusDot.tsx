import React from 'react'

type DotStatus = 'active' | 'paused' | 'completed' | 'offline'

interface StatusDotProps {
  status: DotStatus
  label?: string
}

const dotStyles: Record<DotStatus, string> = {
  active: 'bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]',
  paused: 'bg-amber-400',
  completed: 'bg-accent-blue',
  offline: 'bg-text-secondary',
}

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${dotStyles[status]}`} />
      {label && <span className="text-xs text-text-secondary capitalize">{label}</span>}
    </span>
  )
}

