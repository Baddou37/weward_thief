import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangePasswordForm } from './change-password-form'
import { getT } from '@/lib/i18n/server'

export default async function CompteMotDePassePage() {
  const { t } = await getT()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

  return (
    <div className="p-4 lg:p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('account.title')}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        {t('account.accountLabel')}{' '}
        <span className="font-medium text-gray-800 dark:text-gray-100">{user.email}</span>
      </p>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('account.changePassword')}
      </h2>
      <ChangePasswordForm />
    </div>
  )
}
