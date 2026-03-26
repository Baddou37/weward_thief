import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CreateUserButton } from '@/components/create-user-button'
import { ToggleUserButton } from '@/components/toggle-user-button'

export default async function UtilisateursPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500">{users?.length ?? 0} compte(s)</p>
        </div>
        <CreateUserButton />
      </div>

      <div className="space-y-3">
        {users?.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{user.display_name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">Créé le {formatDate(user.created_at)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={user.role === 'admin' ? 'confirmed' : 'pending'}>
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
              <ToggleUserButton
                userId={user.id}
                isActive={user.is_active}
                isSelf={user.id === session.user.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
