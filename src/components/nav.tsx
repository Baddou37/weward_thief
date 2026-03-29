'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, UserX, Users, LogOut } from 'lucide-react'
import type { Profile } from '@/types'
import { useTranslations } from '@/lib/i18n/use-translations'
import { AppSettingsMenu } from '@/components/app-settings-menu'

interface NavProps {
  profile: Profile
}

export function Nav({ profile }: NavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isAdmin = profile.role === 'admin'

  const links = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: Home },
    { href: '/signalements/nouveau', label: t('nav.report'), icon: UserX, exact: true },
    ...(isAdmin
      ? [
          { href: '/admin/utilisateurs', label: t('nav.users'), icon: Users },
        ]
      : []),
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:min-h-screen bg-white border-r border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-700">
        <div className="mb-6 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('common.appName')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{profile.display_name}</p>
          </div>
          <AppSettingsMenu onLogout={handleLogout} />
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href || (!('exact' in link && link.exact) && pathname.startsWith(link.href + '/'))
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
                {'badge' in link && link.badge !== undefined && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start gap-2 text-gray-600">
          <LogOut className="h-4 w-4" />
          {t('nav.logout')}
        </Button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 dark:bg-gray-900 dark:border-gray-700">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (!('exact' in link && link.exact) && pathname.startsWith(link.href + '/'))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex-1 flex flex-col items-center py-4 relative',
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <Icon className="h-6 w-6" />
              {'badge' in link && link.badge !== undefined && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
        <div className="flex items-center justify-center px-4 text-gray-500 dark:text-gray-400">
          <AppSettingsMenu onLogout={handleLogout} buttonClassName="border-0 bg-transparent shadow-none dark:bg-transparent text-gray-500 dark:text-gray-400 hover:bg-transparent dark:hover:bg-transparent" />
        </div>
      </nav>
    </>
  )
}
