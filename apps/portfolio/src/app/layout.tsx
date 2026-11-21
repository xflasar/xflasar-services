import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'

export const metadata: Metadata = {
  title: 'xflasar.com | Software Engineer & Maker',
  description:
    'Personal portfolio and projects of xflasar: software engineering, IoT hardware automation, and digital life.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className="dark">
      <body className="discord-bg min-h-screen text-text-primary antialiased selection:bg-accent-purple/30 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
