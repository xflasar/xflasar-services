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
        'bg-primary': '#05060b',
        'bg-secondary': '#0e1019',
        'bg-accent': '#181b28',
        'accent-purple': '#7053e3',
        'accent-darkpurple': '#4732ba',
        'accent-discord': '#5865F2',
        'accent-blue': '#3ba55d',
        'text-primary': '#f2f3f5',
        'text-secondary': '#949ba4',
        'text-accent': '#9b84ec',
      },
    },
  },
  plugins: [],
}

export default config
