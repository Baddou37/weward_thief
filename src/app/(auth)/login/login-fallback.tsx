'use client'

import { useTranslations } from '@/lib/i18n/use-translations'

export function LoginFallback() {
  const t = useTranslations()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
    </div>
  )
}
