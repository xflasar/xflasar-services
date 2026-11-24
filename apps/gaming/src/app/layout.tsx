import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'

export const metadata: Metadata = {
  title: 'xflasar.com • Gaming Hub',
  description: 'Live Steam status, gaming library, telemetrie a hardware battlestation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className="min-h-screen bg-[#05060b] text-[#f2f3f5] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
