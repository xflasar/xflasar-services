import React from 'react'

type BadgeVariant = 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  purple: 'bg-accent-purple/15 text-purple-300 border-accent-purple/30',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  yellow: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  gray: 'bg-white/5 text-text-secondary border-white/10',
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}

