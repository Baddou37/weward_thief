'use client'

import { Suspense, useEffect, useState } from 'react'
import { Menu, X, LogOut, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useTranslations } from '@/lib/i18n/use-translations'
import { cn } from '@/lib/utils'

export function AppSettingsMenu({ className, buttonClassName, onLogout }: { className?: string; buttonClassName?: string; onLogout?: () => void }) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("h-10 w-10 shrink-0 border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-900", buttonClassName)}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('menu.openMenu')}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            aria-label={t('menu.closeMenu')}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-settings-menu-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 id="app-settings-menu-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('menu.title')}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setOpen(false)}
                aria-label={t('menu.closeMenu')}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              <section>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t('theme.label')}
                </p>
                <ThemeToggle className="border-0 bg-gray-50 shadow-none dark:bg-gray-800/80" />
              </section>
              <section>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t('locale.label')}
                </p>
                <Suspense fallback={<div className="h-10 w-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}>
                  <LocaleSwitcher className="border-0 bg-gray-50 shadow-none dark:bg-gray-800/80" />
                </Suspense>
              </section>
              {onLogout && (
                <section className="space-y-1">
                  <Link
                    href="/compte/mot-de-passe"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <KeyRound className="h-4 w-4" />
                    {t('nav.account')}
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-600 dark:text-gray-300"
                    onClick={() => { setOpen(false); onLogout() }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </Button>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
