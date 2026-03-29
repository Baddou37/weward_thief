import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
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
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
