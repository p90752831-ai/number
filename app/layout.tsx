import './globals.css'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
export const metadata = { title: 'NUMBER — Your identity. In one number.', description: 'One number. One profile.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <Nav />
        <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">{children}</main>
      </body>
    </html>
  )
}
