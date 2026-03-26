'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from '@/components/locale-provider'
import { createTranslator } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/types'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = createTranslator(locale)
  const redirect =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

  function href(l: Locale) {
    return `/api/locale?locale=${l}&redirect=${encodeURIComponent(redirect)}`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/95 px-1.5 py-1 shadow-sm dark:border-gray-600 dark:bg-gray-900/95',
        className,
      )}
      role="group"
      aria-label={t('locale.label')}
    >
      <a
        href={href('fr')}
        title={t('locale.titleFr')}
        aria-label={t('locale.titleFr')}
        aria-current={locale === 'fr' ? 'true' : undefined}
        className={cn(
          'text-2xl leading-none rounded-lg p-1.5 transition-[opacity,box-shadow] select-none',
          locale === 'fr'
            ? 'ring-2 ring-blue-500 shadow-sm'
            : 'opacity-55 hover:opacity-100',
        )}
      >
        🇫🇷
      </a>
      <a
        href={href('en')}
        title={t('locale.titleEn')}
        aria-label={t('locale.titleEn')}
        aria-current={locale === 'en' ? 'true' : undefined}
        className={cn(
          'text-2xl leading-none rounded-lg p-1.5 transition-[opacity,box-shadow] select-none',
          locale === 'en'
            ? 'ring-2 ring-blue-500 shadow-sm'
            : 'opacity-55 hover:opacity-100',
        )}
      >
        🇬🇧
      </a>
    </div>
  )
}
