import './globals.css'
import type { Viewport } from 'next'
import { Onest, Unbounded } from 'next/font/google'
import Shell from '@/components/Shell'

const body = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-body' })
const num = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-num' })
export const metadata = { title: 'Number# — твоя личность в одном номере', description: 'Уникальный номер вместо юзернейма. Профиль, подписки, записи.' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

// runs before first paint: saved choice, otherwise the device theme (no flash)
const THEME = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${body.variable} ${num.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME }} /></head>
      <body className="min-h-screen font-sans"><Shell>{children}</Shell></body>
    </html>
  )
}
