import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/lib/i18n/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Classes pour `<select>` natifs — alignées sur `Input` (`!` en dark pour WebKit / UA). */
export const nativeSelectClassName =
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:!border-gray-600 dark:!bg-gray-900 dark:!text-gray-100 dark:[color-scheme:dark]'

export function formatDate(dateString: string, locale: Locale = 'fr'): string {
  const tag = locale === 'en' ? 'en-GB' : 'fr-FR'
  return new Intl.DateTimeFormat(tag, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Valeurs stockées en base (libellés canoniques FR) */
export const ARNAQUE_TYPES_FR = [
  'Prend les cartes sans envoyer en retour',
  'Envoie de fausses cartes / cartes sans valeur',
  'Bloque après réception',
  'Double échange frauduleux',
  'Autre (à préciser)',
]

export const ARNAQUE_TYPES_EN = [
  'Takes cards without sending in return',
  'Sends fake or worthless cards',
  'Blocks after receiving',
  'Fraudulent double trade',
  'Other (please specify)',
]

/** @deprecated utiliser ARNAQUE_TYPES_FR — alias pour scripts */
export const ARNAQUE_TYPES = ARNAQUE_TYPES_FR

export function getArnaqueTypeOptions(locale: Locale): {
  value: string
  label: string
}[] {
  return ARNAQUE_TYPES_FR.map((fr, i) => ({
    value: fr,
    label: locale === 'en' ? ARNAQUE_TYPES_EN[i]! : fr,
  }))
}
