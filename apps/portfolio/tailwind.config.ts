import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // True Discord Midnight / Void
        'bg-primary': '#06070c',      // Midnight black
        'bg-secondary': '#0e1019',    // Discord card background
        'bg-accent': '#181b28',       // Discord hover/raised
        
        // Pure Discord Purples & Blurples (Zero Pink)
        'accent-purple': '#7053e3',   // Signature Discord Royal Purple
        'accent-darkpurple': '#4732ba', // Deep purple
        'accent-discord': '#5865F2',  // Discord Blurple
        'accent-blue': '#3ba55d',     // Discord Online Green (for status)
        
        // Crisp Discord Typography
        'text-primary': '#f2f3f5',    // Discord white
        'text-secondary': '#949ba4',  // Discord muted gray
        'text-accent': '#9b84ec',     // Bright Discord purple text
      },
    },
  },
  plugins: [],
}

export default config
