'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'

interface DashboardSearchProps {
  defaultQ: string
  defaultStatus: string
}

export function DashboardSearch({ defaultQ, defaultStatus }: DashboardSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()

  const updateSearch = useCallback((q: string, status: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status) params.set('status', status)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router])

  const statuses = [
    { value: '', label: t('search.all') },
    { value: 'confirmed', label: t('search.confirmed') },
    { value: 'suspected', label: t('search.suspected') },
  ]

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          updateSearch(formData.get('q') as string ?? '', defaultStatus)
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            name="q"
            defaultValue={defaultQ}
            placeholder={t('search.placeholder')}
            className="pl-9"
          />
        </div>
        <Button type="submit">{t('search.search')}</Button>
      </form>
      <div className="flex gap-2">
        {statuses.map((s) => {
          const active = defaultStatus === s.value
          const isStatusChip = s.value === 'confirmed' || s.value === 'suspected'
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => updateSearch(defaultQ, s.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active && isStatusChip
                  ? 'border-transparent bg-transparent font-semibold text-blue-600 dark:text-blue-400'
                  : active
                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
