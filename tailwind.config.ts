import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#0B0B0D', card: '#16161A', line: '#2A2A30', fg: '#F4F2EC', mut: '#8A8A90', acc: '#C8FF3D' },
    fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
  } },
  plugins: [],
}
export default config
