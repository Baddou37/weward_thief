'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'

interface DashboardSearchProps {
  defaultQ: string
}

export function DashboardSearch({ defaultQ }: DashboardSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()
  const [value, setValue] = useState(defaultQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateSearch = useCallback((q: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateSearch(value)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, updateSearch])

  function handleClear() {
    setValue('')
    updateSearch('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('search.placeholder')}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Effacer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
