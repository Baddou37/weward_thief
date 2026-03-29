import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { CreateUserButton } from '@/components/create-user-button'
import { ToggleUserButton } from '@/components/toggle-user-button'
import { getT } from '@/lib/i18n/server'

export default async function UtilisateursPage() {
  const { locale, t } = await getT()
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authUser.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const n = users?.length ?? 0
  const countLabel =
    locale === 'en'
      ? `${n} ${n === 1 ? t('admin.accounts') : t('admin.accountsPlural')}`
      : `${n} ${n > 1 ? t('admin.accountsPlural') : t('admin.accounts')}`

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('admin.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{countLabel}</p>
      </div>

      <div className="space-y-3">
        {users?.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              {/* inline-flex : évite une ligne pleine largeur (email) qui pousse le badge à droite */}
              <div className="inline-flex max-w-full flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{user.display_name}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('admin.createdOn')} {formatDate(user.created_at, locale)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ToggleUserButton
                userId={user.id}
                isActive={user.is_active}
                isSelf={user.id === authUser.id}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <CreateUserButton />
      </div>
    </div>
  )
}
