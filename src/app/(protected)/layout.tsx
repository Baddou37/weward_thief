import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/nav'
import type { Profile } from '@/types'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null
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

  // Compter les signalements en attente pour les admins
  let pendingCount = 0
  if (profile.role === 'admin') {
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    pendingCount = count ?? 0
  }

  return (
    <div className="flex min-h-screen">
      <Nav profile={profile as Profile} pendingCount={pendingCount} />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
