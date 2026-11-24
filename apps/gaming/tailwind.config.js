/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#05060b',
        surface: {
          primary: '#0e1019',
          secondary: '#181b28',
          card: '#0c0e17',
        },
        accent: {
          discord: '#5865F2',
          purple: '#7053e3',
          glow: '#b59cfc',
          green: '#3ba55d',
        },
        text: {
          primary: '#f2f3f5',
          secondary: '#949ba4',
          muted: '#4e5058',
        },
      },
    },
  },
  plugins: [],
}
