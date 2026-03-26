import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangePasswordForm } from './change-password-form'

export default async function CompteMotDePassePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

  return (
    <div className="p-4 lg:p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900">Mon compte</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Compte : <span className="font-medium text-gray-800">{user.email}</span>
      </p>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Changer le mot de passe
      </h2>
      <ChangePasswordForm />
    </div>
  )
}
