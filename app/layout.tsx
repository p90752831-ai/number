import './globals.css'
import type { Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Shell from '@/components/Shell'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const num = Space_Grotesk({ subsets: ['latin'], variable: '--font-num', weight: ['500', '700'] })
export const metadata = { title: 'Number# — твоя личность в одном номере', description: 'Уникальный номер вместо юзернейма. Профиль, подписки, записи.' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${num.variable}`}>
      <body className="min-h-screen font-sans"><Shell>{children}</Shell></body>
    </html>
  )
}
