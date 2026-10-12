import type { Config } from 'tailwindcss'
const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: v('bg'), card: v('card'), line: v('line'), fg: v('fg'), mut: v('mut'), acc: v('acc'), accfg: v('accfg'), err: v('err') },
    fontFamily: { sans: ['var(--font-body)', 'system-ui', 'sans-serif'], num: ['var(--font-num)', 'var(--font-body)', 'sans-serif'] },
  } },
  plugins: [],
}
export default config
