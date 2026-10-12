import Link from 'next/link'
import { getT } from '@/lib/i18n-server'
export default function NotFound() {
  const { t } = getT()
  return (
    <div className="mt-8 text-center">
      <div className="num text-8xl text-mut">#404</div>
      <p className="mt-4 text-xl font-bold">{t('notfound.title')}</p>
      <Link href="/" className="btn-p mt-6">{t('notfound.home')}</Link>
    </div>
  )
}
