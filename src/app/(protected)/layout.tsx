import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import { MobileSettingsMenu } from '@/components/mobile-settings-menu'
import type { Profile } from '@/types'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) {
    console.log('[layout] profil manquant ou inactif:', { profile, userId: user.id })
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Nav profile={profile as Profile} />
      <main className="flex-1 pb-20 lg:pb-0 relative">
        <div className="lg:hidden fixed top-4 right-4 z-40">
          <MobileSettingsMenu />
        </div>
        {children}
      </main>
    </div>
  )
}
