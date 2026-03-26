'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Plus, LogOut, Shield, KeyRound } from 'lucide-react'
import type { Profile } from '@/types'

interface NavProps {
  profile: Profile
  pendingCount?: number
}

export function Nav({ profile, pendingCount = 0 }: NavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isAdmin = profile.role === 'admin'

  const links = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/signalements/nouveau', label: 'Signaler', icon: Plus },
    { href: '/compte/mot-de-passe', label: 'Compte', icon: KeyRound },
    ...(isAdmin
      ? [
          {
            href: '/signalements',
            label: 'Signalements',
            icon: FileText,
            badge: pendingCount > 0 ? pendingCount : undefined,
          },
          { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Shield },
        ]
      : []),
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:min-h-screen bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900">Wecard Thief</h1>
          <p className="text-xs text-gray-500">{profile.display_name}</p>
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
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
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
          Déconnexion
        </Button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 text-xs gap-1 relative',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[4rem]">{link.label}</span>
              {'badge' in link && link.badge !== undefined && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center py-2 text-xs gap-1 text-gray-500"
        >
          <LogOut className="h-5 w-5" />
          <span>Sortir</span>
        </button>
      </nav>
    </>
  )
}
