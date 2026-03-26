import { cookies } from 'next/headers'
import { createTranslator } from './dictionaries'
import type { Locale } from './types'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from './types'

export async function getLocale(): Promise<Locale> {
  const c = await cookies()
  const v = c.get(LOCALE_COOKIE)?.value
  if (v === 'en' || v === 'fr') return v
  return DEFAULT_LOCALE
}

export async function getT() {
  const locale = await getLocale()
  return { locale, t: createTranslator(locale) }
}
