'use client'

import { useMemo } from 'react'
import { useLocale } from '@/components/locale-provider'
import { createTranslator } from '@/lib/i18n/dictionaries'

export function useTranslations() {
  const locale = useLocale()
  return useMemo(() => createTranslator(locale), [locale])
}
