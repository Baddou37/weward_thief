'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/use-translations'
import { useIsClient } from '@/lib/use-is-client'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useIsClient()
  const t = useTranslations()

  if (!mounted) {
    return (
      <div
        className={cn('h-9 w-[88px] shrink-0 rounded-xl border border-transparent', className)}
        aria-hidden
      />
    )
  }

  const modes = [
    { id: 'light' as const, icon: Sun, label: t('theme.light') },
    { id: 'dark' as const, icon: Moon, label: t('theme.dark') },
    { id: 'system' as const, icon: Monitor, label: t('theme.system') },
  ]

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/95 px-1 py-1 shadow-sm dark:border-gray-600 dark:bg-gray-900/95',
        className,
      )}
      role="group"
      aria-label={t('theme.label')}
    >
      {modes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          title={label}
          aria-label={label}
          aria-pressed={theme === id}
          className={cn(
            'rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
            theme === id &&
              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </button>
      ))}
    </div>
  )
}
