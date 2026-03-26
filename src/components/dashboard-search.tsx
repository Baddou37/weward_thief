'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface DashboardSearchProps {
  defaultQ: string
  defaultStatus: string
}

export function DashboardSearch({ defaultQ, defaultStatus }: DashboardSearchProps) {
  const router = useRouter()
  const pathname = usePathname()

  const updateSearch = useCallback((q: string, status: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status) params.set('status', status)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router])

  const statuses = [
    { value: '', label: 'Tous' },
    { value: 'confirmed', label: '🔴 Confirmé' },
    { value: 'suspected', label: '🟡 Suspecté' },
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="q"
            defaultValue={defaultQ}
            placeholder="Rechercher un pseudo ou un nom..."
            className="pl-9"
          />
        </div>
        <Button type="submit">Rechercher</Button>
      </form>
      <div className="flex gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => updateSearch(defaultQ, s.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              defaultStatus === s.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
