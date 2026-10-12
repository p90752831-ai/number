import './globals.css'
import type { Viewport } from 'next'
import { Onest, Unbounded } from 'next/font/google'
import Shell from '@/components/Shell'
import { I18nProvider } from '@/components/I18nProvider'
import { getLang } from '@/lib/i18n-server'
import { translate } from '@/lib/i18n'

const body = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-body' })
const num = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-num' })
export function generateMetadata() {
  const l = getLang()
  return { title: translate(l, 'app.title'), description: translate(l, 'app.desc') }
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

// runs before first paint: saved choice, otherwise the device theme (no flash)
const THEME = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang()
  return (
    <html lang={lang} className={`${body.variable} ${num.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME }} /></head>
      <body className="min-h-screen font-sans"><I18nProvider lang={lang}><Shell>{children}</Shell></I18nProvider></body>
    </html>
  )
}
