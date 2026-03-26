import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const ARNAQUE_TYPES = [
  'Prend les cartes sans envoyer en retour',
  'Envoie de fausses cartes / cartes sans valeur',
  'Bloque après réception',
  'Double échange frauduleux',
  'Autre (à préciser)',
]
