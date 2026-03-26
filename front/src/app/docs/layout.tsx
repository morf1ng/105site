import type { Metadata } from 'next'
import Link from 'next/link'
import './docs.css'

export const metadata: Metadata = {
  title: 'Документы — SOFT STUDIO',
  description: 'Политика конфиденциальности, публичная оферта и договор об оказании услуг',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-page" lang="ru">
      <div className="docs-page__inner">
        <Link href="/" className="docs-page__back">
          ← На главную
        </Link>
        {children}
      </div>
    </div>
  )
}
