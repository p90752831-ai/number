import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#0A0A0B', card: '#131316', line: '#25252C', fg: '#F5F3EE', mut: '#8B8B93', acc: '#C8FF3D' },
    fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], num: ['var(--font-num)', 'var(--font-inter)', 'sans-serif'] },
  } },
  plugins: [],
}
export default config
